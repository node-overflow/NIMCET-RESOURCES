"use strict";

import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.2.108/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.2.108/pdf.worker.min.mjs";


/* ===== ELEMENTS ===== */

const viewer = document.querySelector("#viewer");
const container = document.querySelector("#pdfContainer");
const loading = document.querySelector("#loading");
const bookTitle = document.querySelector("#bookTitle");
const pageInput = document.querySelector("#pageInput");
const pageCount = document.querySelector("#pageCount");
const downloadBtn = document.querySelector("#downloadBtn");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const zoomIn = document.querySelector("#zoomIn");
const zoomOut = document.querySelector("#zoomOut");
const zoomValue = document.querySelector("#zoomValue");
const fitWidth = document.querySelector("#fitWidth");
const fullscreenBtn = document.querySelector("#fullscreenBtn");
const searchBtn = document.querySelector("#searchBtn");
const searchPanel = document.querySelector("#searchPanel");
const searchInput = document.querySelector("#searchInput");
const searchStatus = document.querySelector("#searchStatus");
const closeSearch = document.querySelector("#closeSearch");
const mobilePrev = document.querySelector("#mobilePrev");
const mobileNext = document.querySelector("#mobileNext");
const mobilePageInput = document.querySelector("#mobilePageInput");
const mobilePageCount = document.querySelector("#mobilePageCount");
const printBtn = document.querySelector("#printBtn");


/* ===== URL PARAMS ===== */

const params = new URLSearchParams(window.location.search);
const pdfUrl = params.get("file");
const title = params.get("title") || "PDF Reader";

if (!pdfUrl) {
    loading.innerHTML = `
        <div class="loading-title">PDF not found</div>
        <div class="loading-text">No document was provided.</div>
    `;
    throw new Error("Missing PDF URL");
}

bookTitle.textContent = title;
document.title = `${title} - PDF Reader`;
downloadBtn.href = pdfUrl;
downloadBtn.setAttribute("download", title.toLowerCase().endsWith(".pdf") ? title : `${title}.pdf`);


/* ===== STATE ===== */

let pdf = null;
let scale = 1.2;
let fitWidthMode = false;
let currentPage = 1;
let isNavigating = false;

const pages = [];
const RENDER_AHEAD = 2;
const RENDER_BEHIND = 1;
const MAX_DPR = 1.5;
const MAX_CONCURRENT_RENDERS = 3;

let activeRenders = 0;
let renderGeneration = 0;
let basePageWidth = 0;
let baseRatio = 1;
let scrollRaf = null;

const textCache = new Map();


/* ===== LAYOUT HELPERS ===== */

const isMobileViewport = () => window.innerWidth <= 600;

const getPageWidth = () => {
    const margin = isMobileViewport() ? 0 : 40;
    return Math.max(200, viewer.clientWidth - margin);
};

const updateZoomText = () => {
    zoomValue.textContent = fitWidthMode ? "Fit" : `${Math.round(scale * 100)}%`;
};

const calculateFitWidth = () => {
    if (!basePageWidth) return;
    scale = Math.max(0.5, Math.min(2.5, getPageWidth() / basePageWidth));
    updateZoomText();
};


/* ===== PLACEHOLDERS ===== */

const createPagePlaceholders = () => {
    const width = getPageWidth();
    const height = width * baseRatio;
    const fragment = document.createDocumentFragment();

    for (let n = 1; n <= pdf.numPages; n++) {
        const wrapper = document.createElement("div");
        wrapper.className = "pdf-page-wrapper";
        wrapper.dataset.page = n;
        wrapper.style.width = `${width}px`;
        wrapper.style.minHeight = `${height}px`;
        wrapper.style.contain = "layout paint style";
        fragment.appendChild(wrapper);

        pages.push({ number: n, wrapper, rendered: false, rendering: false, renderTask: null });
    }

    container.appendChild(fragment);
};


/* ===== LOAD PDF ===== */

const loadPDF = async () => {
    try {
        const loadingTask = pdfjsLib.getDocument({
            url: pdfUrl,
            rangeChunkSize: 1024 * 1024,
            disableRange: false,
            disableStream: false,
            disableAutoFetch: true,
            isEvalSupported: true,
            useSystemFonts: true,
            cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.2.108/cmaps/",
            cMapPacked: true,
            standardFontDataUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.2.108/standard_fonts/",
            verbosity: 0
        });

        loadingTask.onProgress = progress => {
            if (progress.total && progress.loaded) {
                const percent = Math.round((progress.loaded / progress.total) * 100);
                const text = loading.querySelector(".loading-text");
                if (text) text.textContent = `Loading PDF… ${percent}%`;
            }
        };

        pdf = await loadingTask.promise;

        pageCount.textContent = pdf.numPages;
        mobilePageCount.textContent = pdf.numPages;
        pageInput.max = pdf.numPages;
        mobilePageInput.max = pdf.numPages;

        const firstPage = await pdf.getPage(1);
        const viewport = firstPage.getViewport({ scale: 1 });
        basePageWidth = viewport.width;
        baseRatio = viewport.height / viewport.width;
        firstPage.cleanup();

        if (isMobileViewport()) {
            fitWidthMode = true;
            calculateFitWidth();
        }

        createPagePlaceholders();

        loading.remove();

        scheduleRender(1);

    } catch (error) {
        console.error("PDF loading error:", error);
        loading.innerHTML = `
            <div class="loading-title">Unable to open PDF</div>
            <div class="loading-text">Please check the PDF URL and try again.</div>
        `;
    }
};


/* ===== RENDER QUEUE ===== */

const renderQueue = [];

const queuePage = pageNumber => {
    if (!pdf || pageNumber < 1 || pageNumber > pdf.numPages) return;

    const pageInfo = pages[pageNumber - 1];
    if (!pageInfo || pageInfo.rendered || pageInfo.rendering) return;
    if (renderQueue.some(item => item.page === pageNumber)) return;

    renderQueue.push({ page: pageNumber, generation: renderGeneration });
};

const processRenderQueue = async () => {
    while (activeRenders < MAX_CONCURRENT_RENDERS && renderQueue.length) {
        renderQueue.sort((a, b) => Math.abs(a.page - currentPage) - Math.abs(b.page - currentPage));

        const item = renderQueue.shift();
        if (!item || item.generation !== renderGeneration) continue;

        const pageInfo = pages[item.page - 1];
        if (!pageInfo) continue;

        activeRenders++;
        renderPage(pageInfo)
            .catch(error => console.error(`Page ${item.page} failed:`, error))
            .finally(() => {
                activeRenders--;
                processRenderQueue();
            });
    }
};

const scheduleRender = pageNumber => {
    if (!pdf) return;

    const start = Math.max(1, pageNumber - RENDER_BEHIND);
    const end = Math.min(pdf.numPages, pageNumber + RENDER_AHEAD);

    queuePage(pageNumber);
    for (let i = start; i <= end; i++) {
        if (i !== pageNumber) queuePage(i);
    }

    processRenderQueue();
};


/* ===== RENDER PAGE ===== */

const renderPage = async pageInfo => {
    if (pageInfo.rendered || pageInfo.rendering) return;
    pageInfo.rendering = true;

    try {
        const page = await pdf.getPage(pageInfo.number);

        if (fitWidthMode) calculateFitWidth();

        const viewport = page.getViewport({ scale });
        const outputScale = Math.min(window.devicePixelRatio || 1, MAX_DPR);

        const canvas = document.createElement("canvas");
        canvas.className = "pdf-page";
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const context = canvas.getContext("2d", { alpha: false, willReadFrequently: false });

        const oldCanvas = pageInfo.wrapper.querySelector("canvas");
        pageInfo.wrapper.style.width = `${viewport.width}px`;
        pageInfo.wrapper.style.minHeight = `${viewport.height}px`;
        pageInfo.wrapper.appendChild(canvas);

        const renderTask = page.render({
            canvasContext: context,
            viewport,
            transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null,
            annotationMode: pdfjsLib.AnnotationMode?.DISABLE ?? 0
        });

        pageInfo.renderTask = renderTask;
        await renderTask.promise;

        if (oldCanvas && oldCanvas !== canvas) oldCanvas.remove();

        pageInfo.rendered = true;
        page.cleanup();

    } catch (error) {
        if (error?.name !== "RenderingCancelledException") {
            console.error(`Page ${pageInfo.number} failed:`, error);
        }
    } finally {
        pageInfo.rendering = false;
        pageInfo.renderTask = null;
    }
};


/* ===== VISIBILITY -> PREFETCH ===== */

const renderObserver = new IntersectionObserver(
    entries => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                scheduleRender(Number(entry.target.dataset.page));
            }
        }
    },
    { root: viewer, rootMargin: "400px 0px 400px 0px", threshold: 0.01 }
);

const observePages = () => {
    for (const page of pages) renderObserver.observe(page.wrapper);
};


/* ===== CURRENT PAGE FROM SCROLL POSITION ===== */

const trackCurrentPage = () => {
    if (isNavigating || !pages.length) return;

    const probe = viewer.scrollTop + 1;
    let found = pages[0].number;

    for (const page of pages) {
        if (page.wrapper.offsetTop <= probe) found = page.number;
        else break;
    }

    if (found !== currentPage) {
        currentPage = found;
        updatePageUI();
    }
};

viewer.addEventListener("scroll", () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        trackCurrentPage();
    });
}, { passive: true });


/* ===== PAGE UI ===== */

const updatePageUI = () => {
    pageInput.value = currentPage;
    mobilePageInput.value = currentPage;
};


/* ===== PAGE JUMP ===== */

const jumpToPage = pageNumber => {
    if (!pdf) return;

    pageNumber = Math.max(1, Math.min(pdf.numPages, Number(pageNumber)));
    if (!Number.isFinite(pageNumber)) return;

    const page = pages[pageNumber - 1];
    if (!page) return;

    currentPage = pageNumber;
    updatePageUI();

    renderGeneration++;
    renderQueue.length = 0;
    scheduleRender(pageNumber);

    isNavigating = true;
    const gap = window.innerWidth <= 600 ? 0 : 10;
    viewer.scrollTop = Math.max(0, page.wrapper.offsetTop - gap);

    requestAnimationFrame(() => requestAnimationFrame(() => { isNavigating = false; }));
};


/* ===== PAGE INPUTS ===== */

const handlePageInput = event => {
    const value = event.target.value.trim();
    const number = Number(value);

    if (!value || !Number.isFinite(number) || number < 1) {
        updatePageUI();
        return;
    }

    jumpToPage(number);
};

pageInput.addEventListener("change", handlePageInput);
mobilePageInput.addEventListener("change", handlePageInput);


/* ===== PREV / NEXT ===== */

const previousPage = () => { if (pdf) jumpToPage(currentPage - 1); };
const nextPage = () => { if (pdf) jumpToPage(currentPage + 1); };

prevBtn.addEventListener("click", previousPage);
mobilePrev.addEventListener("click", previousPage);
nextBtn.addEventListener("click", nextPage);
mobileNext.addEventListener("click", nextPage);


/* ===== ZOOM ===== */

const changeZoom = amount => {
    fitWidthMode = false;
    scale = Math.max(0.5, Math.min(2.5, scale + amount));
    updateZoomText();
    rerenderVisiblePages();
};

zoomIn.addEventListener("click", () => changeZoom(0.1));
zoomOut.addEventListener("click", () => changeZoom(-0.1));

const enableFitWidth = () => {
    fitWidthMode = true;
    calculateFitWidth();
    rerenderVisiblePages();
};

fitWidth.addEventListener("click", enableFitWidth);
zoomValue.addEventListener("click", enableFitWidth);

const rerenderVisiblePages = () => {
    if (!pdf) return;

    renderGeneration++;
    renderQueue.length = 0;

    const start = Math.max(1, currentPage - RENDER_BEHIND);
    const end = Math.min(pdf.numPages, currentPage + RENDER_AHEAD);

    for (let i = start; i <= end; i++) {
        const page = pages[i - 1];
        if (!page) continue;

        if (page.renderTask?.cancel) {
            try { page.renderTask.cancel(); } catch { /* ignore */ }
        }

        page.rendered = false;
        page.wrapper.querySelectorAll("canvas").forEach(canvas => canvas.remove());
        queuePage(i);
    }

    updateZoomText();
    processRenderQueue();
};


/* ===== SEARCH ===== */

let searchTimeout = null;
let searchToken = 0;

searchBtn.addEventListener("click", () => {
    searchPanel.classList.toggle("open");
    if (searchPanel.classList.contains("open")) {
        setTimeout(() => searchInput.focus(), 50);
    }
});

closeSearch.addEventListener("click", () => {
    searchPanel.classList.remove("open");
    searchInput.value = "";
    searchStatus.textContent = "";
    searchToken++;
});

searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => searchPDF(currentPage), 300);
});

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        clearTimeout(searchTimeout);
        searchPDF(currentPage + 1);
    }
});

const getPageText = async pageNumber => {
    if (textCache.has(pageNumber)) return textCache.get(pageNumber);

    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent({ disableCombineTextItems: false });
    const text = content.items.map(item => item.str).join(" ").toLowerCase();

    textCache.set(pageNumber, text);
    page.cleanup();
    return text;
};

const searchPDF = async (fromPage = currentPage) => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) { searchStatus.textContent = ""; return; }

    const token = ++searchToken;
    searchStatus.textContent = "Searching…";

    try {
        const order = [];
        for (let offset = 0; offset < pdf.numPages; offset++) {
            order.push(((fromPage - 1 + offset) % pdf.numPages) + 1);
        }

        const BATCH_SIZE = 4;

        for (let i = 0; i < order.length; i += BATCH_SIZE) {
            if (token !== searchToken) return;

            const batch = order.slice(i, i + BATCH_SIZE);
            const results = await Promise.all(batch.map(async pageNumber => {
                const text = await getPageText(pageNumber);
                return { pageNumber, found: text.includes(query) };
            }));

            if (token !== searchToken) return;

            const found = results.find(result => result.found);
            if (found) {
                searchStatus.textContent = `Page ${found.pageNumber}`;
                jumpToPage(found.pageNumber);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 0));
        }

        if (token === searchToken) searchStatus.textContent = "Not found";

    } catch (error) {
        console.error("Search error:", error);
        if (token === searchToken) searchStatus.textContent = "Search failed";
    }
};


/* ===== FULLSCREEN / PRINT ===== */

fullscreenBtn.addEventListener("click", async () => {
    try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
    } catch (error) {
        console.error(error);
    }
});

const printPDF = () => {
    const existing = document.getElementById("printFrame");
    if (existing) existing.remove();

    const printFrame = document.createElement("iframe");
    printFrame.id = "printFrame";
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";

    printFrame.onload = () => {
        try {
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
        } catch (error) {
            console.error("Print failed, opening PDF instead:", error);
            window.open(pdfUrl, "_blank", "noopener");
        }
    };

    printFrame.src = pdfUrl;
    document.body.appendChild(printFrame);
};

printBtn.addEventListener("click", printPDF);


/* ===== KEYBOARD ===== */

document.addEventListener("keydown", event => {
    if (event.target.tagName === "INPUT") return;

    if (event.key === "ArrowLeft") { previousPage(); event.preventDefault(); }
    if (event.key === "ArrowRight") { nextPage(); event.preventDefault(); }
    if (event.key === "+" || event.key === "=") { changeZoom(0.1); event.preventDefault(); }
    if (event.key === "-") { changeZoom(-0.1); event.preventDefault(); }
    if (event.key.toLowerCase() === "f") fullscreenBtn.click();
});


/* ===== MOBILE SWIPE ===== */

let touchStartX = 0;
let touchStartY = 0;

viewer.addEventListener("touchstart", event => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}, { passive: true });

viewer.addEventListener("touchend", event => {
    const dx = event.changedTouches[0].clientX - touchStartX;
    const dy = event.changedTouches[0].clientY - touchStartY;

    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 2) {
        if (dx < 0) nextPage();
        else previousPage();
    }
}, { passive: true });


/* ===== RESIZE ===== */

let resizeTimer = null;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (fitWidthMode) {
            calculateFitWidth();
            rerenderVisiblePages();
        }
    }, 200);
});


/* ===== START ===== */

const start = async () => {
    updateZoomText();
    await loadPDF();
    observePages();
    updatePageUI();
};

start();