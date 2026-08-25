"use strict";

import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.2.108/pdf.min.mjs";


/* =========================================================
   PDF.JS WORKER
========================================================= */

pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.2.108/pdf.worker.min.mjs";


/* =========================================================
   ELEMENTS
========================================================= */

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


/* =========================================================
   URL
========================================================= */

const params = new URLSearchParams(window.location.search);

const pdfUrl = params.get("file");

const title = params.get("title") || "PDF Reader";


if (!pdfUrl) {

    loading.innerHTML = `
        <div class="loading-title">
            PDF not found
        </div>

        <div class="loading-text">
            No document was provided.
        </div>
    `;

    throw new Error(
        "Missing PDF URL"
    );
}


/* =========================================================
   DOCUMENT INFO
========================================================= */

bookTitle.textContent = title;

document.title = `${title} - PDF Reader`;

downloadBtn.href = pdfUrl;


/* =========================================================
   STATE
========================================================= */

let pdf = null;
let scale = 1.2;
let fitWidthMode = false;

const pages = [];

let currentPage = 1;


/* =========================================================
   LOAD PDF
========================================================= */

const loadPDF = async () => {
    try {
        pdf = await pdfjsLib.getDocument({
            url: pdfUrl
        }).promise;

        pageCount.textContent = pdf.numPages;
        mobilePageCount.textContent = pdf.numPages;

        pageInput.max = pdf.numPages;
        mobilePageInput.max = pdf.numPages;

        await createPagePlaceholders();

        loading.remove();

        renderNearbyPages(1);
    } catch (error) {
        console.error("PDF loading error:", error);

        loading.innerHTML = `
            <div class="loading-title">
                Unable to open PDF
            </div>

            <div class="loading-text">
                Please check the PDF URL and try again.
            </div>
        `;
    }
};


/* =========================================================
   CREATE PAGE PLACEHOLDERS
========================================================= */

const createPagePlaceholders = async () => {
    const firstPage = await pdf.getPage(1);
    const firstViewport = firstPage.getViewport({
        scale: 1
    });

    const ratio = firstViewport.height / firstViewport.width;

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const wrapper = document.createElement("div");

        wrapper.className = "pdf-page-wrapper";
        wrapper.dataset.page = pageNumber;

        const width = getPageWidth();

        wrapper.style.width = `${width}px`;
        wrapper.style.minHeight = `${width * ratio}px`;

        container.appendChild(wrapper);

        pages.push({
            number: pageNumber,
            wrapper: wrapper,
            rendered: false,
            rendering: false
        });
    }
};


/* =========================================================
   PAGE WIDTH
========================================================= */

const getPageWidth = () => {
    const available = viewer.clientWidth;
    const margin = window.innerWidth <= 600 ? 0 : 40;

    return Math.max(200, available - margin);
};


/* =========================================================
   FIT WIDTH
========================================================= */

const calculateScale = async () => {
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const availableWidth = getPageWidth();

    scale = availableWidth / viewport.width;
    scale = Math.max(0.5, Math.min(2.5, scale));

    updateZoomText();
};


/* =========================================================
   RENDER PAGE
========================================================= */

const renderPage = async (pageInfo) => {
    if (pageInfo.rendered || pageInfo.rendering) {
        return;
    }

    pageInfo.rendering = true;

    try {
        const page = await pdf.getPage(pageInfo.number);

        if (fitWidthMode) {
            await calculateScale();
        }

        const viewport = page.getViewport({
            scale
        });

        const outputScale = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        const canvas = document.createElement("canvas");

        canvas.className = "pdf-page";

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);

        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const context = canvas.getContext("2d");

        pageInfo.wrapper.innerHTML = "";
        pageInfo.wrapper.style.width = `${viewport.width}px`;
        pageInfo.wrapper.style.minHeight = `${viewport.height}px`;

        pageInfo.wrapper.appendChild(canvas);

        await page.render({
            canvasContext: context,
            viewport,
            transform: outputScale !== 1
                ? [
                    outputScale,
                    0,
                    0,
                    outputScale,
                    0,
                    0
                ]
                : null
        }).promise;

        pageInfo.rendered = true;
    } catch (error) {
        console.error(
            `Page ${pageInfo.number} failed:`,
            error
        );
    } finally {
        pageInfo.rendering = false;
    }
};


/* =========================================================
   LAZY RENDERING
========================================================= */

const observer = new IntersectionObserver(
    entries => {
        let mostVisiblePage = null;
        let highestVisibility = 0;

        for (const entry of entries) {
            if (!entry.isIntersecting) {
                continue;
            }

            const visibility = entry.intersectionRatio;

            if (visibility > highestVisibility) {
                highestVisibility = visibility;
                mostVisiblePage = Number(
                    entry.target.dataset.page
                );
            }
        }

        if (mostVisiblePage !== null) {
            currentPage = mostVisiblePage;
            updatePageUI();
            renderNearbyPages(currentPage);
        }
    },
    {
        root: viewer,
        rootMargin: "0px",
        threshold: [0.25, 0.5, 0.75, 1]
    }
);

const observePages = () => {
    for (const page of pages) {
        observer.observe(page.wrapper);
    }
};


/* =========================================================
   RENDER NEARBY
========================================================= */

const renderNearbyPages = (pageNumber) => {
    const start = Math.max(1, pageNumber - 2);
    const end = Math.min(pdf.numPages, pageNumber + 2);

    for (let i = start; i <= end; i++) {
        renderPage(pages[i - 1]);
    }
};


/* =========================================================
   PAGE UI
========================================================= */

const updatePageUI = () => {
    pageInput.value = currentPage;
    mobilePageInput.value = currentPage;
};


/* =========================================================
   PAGE JUMP
========================================================= */

const jumpToPage = pageNumber => {
    if (!pdf) {
        return;
    }

    pageNumber = Math.max(
        1,
        Math.min(pdf.numPages, Number(pageNumber))
    );

    const page = pages[pageNumber - 1];

    if (!page) {
        return;
    }

    currentPage = pageNumber;
    renderNearbyPages(pageNumber);

    page.wrapper.scrollIntoView({
        behavior: "auto",
        block: "start"
    });

    updatePageUI();
};


/* =========================================================
   DESKTOP PAGE JUMP
========================================================= */

pageInput.addEventListener("change", event => {
    const value = event.target.value.trim();

    if (!value) {
        updatePageUI();
        return;
    }

    jumpToPage(Number(value));
});


/* =========================================================
   MOBILE PAGE JUMP
========================================================= */

mobilePageInput.addEventListener("change", event => {
    const value = event.target.value.trim();

    if (!value) {
        updatePageUI();
        return;
    }

    jumpToPage(Number(value));
});


/* =========================================================
   PREVIOUS
========================================================= */

const previousPage = () => {
    jumpToPage(Math.max(1, currentPage - 1));
};

prevBtn.addEventListener("click", previousPage);
mobilePrev.addEventListener("click", previousPage);


/* =========================================================
   NEXT
========================================================= */

const nextPage = () => {
    jumpToPage(Math.min(pdf.numPages, currentPage + 1));
};

nextBtn.addEventListener("click", nextPage);
mobileNext.addEventListener("click", nextPage);


/* =========================================================
   ZOOM
========================================================= */

zoomIn.addEventListener("click", () => {
    fitWidthMode = false;
    scale = Math.min(2.5, scale + 0.1);

    rerenderAllPages();
});

zoomOut.addEventListener("click", () => {
    fitWidthMode = false;
    scale = Math.max(0.5, scale - 0.1);

    rerenderAllPages();
});


/* =========================================================
   FIT WIDTH
========================================================= */

fitWidth.addEventListener("click", () => {
    fitWidthMode = true;
    rerenderAllPages();
});


/* =========================================================
   ZOOM TEXT
========================================================= */

const updateZoomText = () => {
    if (fitWidthMode) {
        zoomValue.textContent = "Fit";
        return;
    }

    zoomValue.textContent = `${Math.round(scale * 100)}%`;
};


/* =========================================================
   RERENDER
========================================================= */

const rerenderAllPages = async () => {
    updateZoomText();

    for (const page of pages) {
        page.rendered = false;
        page.wrapper.innerHTML = "";
    }

    renderNearbyPages(currentPage);
};


/* =========================================================
   SEARCH
========================================================= */

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
});

let searchTimeout;

searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(searchPDF, 400);
});


/* =========================================================
   SEARCH PDF
========================================================= */

const searchPDF = async () => {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        searchStatus.textContent = "";
        return;
    }

    searchStatus.textContent = "Searching...";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const text = content.items
            .map(item => item.str)
            .join(" ")
            .toLowerCase();

        if (text.includes(query)) {
            searchStatus.textContent = `Page ${i}`;
            jumpToPage(i);
            return;
        }
    }

    searchStatus.textContent = "Not found";
};


/* =========================================================
   FULLSCREEN
========================================================= */

fullscreenBtn.addEventListener("click", async () => {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.error(error);
    }
});


/* =========================================================
   PRINT
========================================================= */

printBtn.addEventListener("click", () => {
    window.open(pdfUrl, "_blank", "noopener");
});


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener("keydown", event => {
    if (event.target.tagName === "INPUT") {
        return;
    }

    if (event.key === "ArrowLeft") {
        previousPage();
    }

    if (event.key === "ArrowRight") {
        nextPage();
    }

    if (event.key === "+" || event.key === "=") {
        fitWidthMode = false;
        scale = Math.min(2.5, scale + 0.1);

        rerenderAllPages();
    }

    if (event.key === "-") {
        fitWidthMode = false;
        scale = Math.max(0.5, scale - 0.1);

        rerenderAllPages();
    }

    if (event.key === "f") {
        fullscreenBtn.click();
    }
});


/* =========================================================
   RESIZE
========================================================= */

let resizeTimer;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        if (fitWidthMode) {
            rerenderAllPages();
        }
    }, 250);
});


/* =========================================================
   START
========================================================= */

const start = async () => {
    await loadPDF();

    observePages();
};

start();