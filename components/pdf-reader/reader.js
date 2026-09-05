import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.2.108/pdf.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.2.108/pdf.worker.min.mjs";

/* ------------------------------------------------------------------ */
/*  State                                                              */
/* ------------------------------------------------------------------ */
const els = {
    toolbar: document.getElementById('toolbar'),
    sidebar: document.getElementById('sidebar'),
    sidebarBackdrop: document.getElementById('sidebarBackdrop'),
    scroller: document.getElementById('scroller'),
    pages: document.getElementById('pages'),
    dropZone: document.getElementById('dropZone'),
    loadOverlay: document.getElementById('loadOverlay'),
    ringFg: document.getElementById('ringFg'),
    ovPct: document.getElementById('ovPct'),
    ovMsg: document.getElementById('ovMsg'),
    ovFname: document.getElementById('ovFname'),
    errBox: document.getElementById('errBox'),
    pwOverlay: document.getElementById('pwOverlay'),
    pwInput: document.getElementById('pwInput'),
    pwErrMsg: document.getElementById('pwErrMsg'),
    pwSubmit: document.getElementById('pwSubmit'),
    pwCancel: document.getElementById('pwCancel'),
    pageInput: document.getElementById('pageInput'),
    pageTotal: document.getElementById('pageTotal'),
    zoomPct: document.getElementById('zoomPct'),
    fname: document.getElementById('fname'),
    fsize: document.getElementById('fsize'),
    fileInput: document.getElementById('fileInput'),
};

const RING_CIRC = 150.8;
const ZOOM_STEPS = [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4];
const RENDER_BUFFER_PX = 1400;
const MAX_CONCURRENT_RENDERS = 2;
const MAX_DPR = 2;

let pdfDoc = null;
let numPages = 0;
let scale = 1;
let fitWidthMode = true;
let baseViewport1 = null;
let pageMeta = [];
let thumbMeta = [];
let currentPage = 1;
let renderQueue = [];
let activeRenders = 0;
let currentFileName = 'document.pdf';
let currentLoadingTask = null;
let pendingPasswordCallback = null;
let passwordPromptCancelled = false;

/* ------------------------------------------------------------------ */
/*  Utilities                                                          */
/* ------------------------------------------------------------------ */
const showError = (msg) => {
    els.errBox.textContent = msg;
    els.errBox.style.display = 'block';

    clearTimeout(showError._t);
    showError._t = setTimeout(() => {
        els.errBox.style.display = 'none';
    }, 6000);
};

const dpr = () => {
    return Math.min(window.devicePixelRatio || 1, MAX_DPR);
};

const isMobile = () => {
    return window.innerWidth <= 760;
};

const formatBytes = (bytes) => {
    if (typeof bytes !== 'number' || isNaN(bytes)) {
        return '';
    }

    if (bytes < 1024) {
        return bytes + ' B';
    }

    const units = ['KB', 'MB', 'GB'];
    let val = bytes, i = -1;

    do {
        val /= 1024;
        i++;
    } while (val >= 1024 && i < units.length - 1);

    if (val < 10) {
        return val.toFixed(1) + ' ' + units[i];
    } else {
        return Math.round(val) + ' ' + units[i];
    }
};

const setLoading = (show, pct, msg, fname) => {
    els.loadOverlay.classList.toggle('show', show);

    if (fname !== undefined) {
        els.ovFname.textContent = fname;
    }

    if (msg !== undefined) {
        els.ovMsg.textContent = msg;
    }

    if (pct !== undefined) {
        const clamped = Math.max(0, Math.min(100, pct));
        els.ovPct.textContent = Math.round(clamped) + '%';
        els.ringFg.style.strokeDashoffset = RING_CIRC - (RING_CIRC * clamped / 100);
    }
};

/* ------------------------------------------------------------------ */
/*  Open document                                                      */
/* ------------------------------------------------------------------ */
const openSource = async (src, fname) => {
    resetDoc();

    currentFileName = fname || 'document.pdf';
    els.fname.textContent = currentFileName;
    els.fsize.textContent = '';
    els.dropZone.style.display = 'none';

    setLoading(true, 0, 'Loading document…', currentFileName);

    try {
        const loadingTask = pdfjsLib.getDocument(src);
        currentLoadingTask = loadingTask;

        loadingTask.onProgress = (p) => {
            if (p.total) {
                setLoading(true, (p.loaded / p.total) * 100, 'Loading document…');
            } else {
                setLoading(true, undefined, `Loading… ${(p.loaded / 1024 / 1024).toFixed(1)} MB`);
            }
        };

        loadingTask.onPassword = (updatePassword, reason) => {
            showPasswordPrompt(reason, updatePassword);
        };

        pdfDoc = await loadingTask.promise;

        pdfDoc.getData().then(data => {
            els.fsize.textContent = formatBytes(data.byteLength);
        }).catch(() => { /* ignore */ });

        numPages = pdfDoc.numPages;
        els.pageTotal.textContent = numPages;
        els.pageInput.max = numPages;

        setLoading(true, 100, 'Preparing pages…');

        const page1 = await pdfDoc.getPage(1);
        baseViewport1 = page1.getViewport({ scale: 1 });

        buildSkeleton();
        els.scroller.style.display = 'block';

        computeFitWidthScale();
        applyScaleToAllWrappers();
        updateFitBtnTitle();

        setLoading(false);
        els.scroller.scrollTop = 0;
        updateActivePage(1);
        scheduleWindowUpdate();
    } catch (err) {
        console.error(err);
        setLoading(false);
        els.dropZone.style.display = 'flex';

        if (passwordPromptCancelled) {
            passwordPromptCancelled = false;
        } else {
            showError('Could not load this PDF: ' + (err && err.message ? err.message : 'unknown error'));
        }
    } finally {
        currentLoadingTask = null;
    }
};

const resetDoc = () => {
    if (pdfDoc) {
        try {
            pdfDoc.destroy();
        } catch (e) { }
    }

    pdfDoc = null;
    numPages = 0;

    pageMeta.forEach(m => {
        if (m.renderTask) {
            try {
                m.renderTask.cancel();
            } catch (e) { }
        }
    });

    pageMeta = [];
    thumbMeta = [];

    els.pages.innerHTML = '';
    els.sidebar.innerHTML = '';

    renderQueue = [];
    activeRenders = 0;

    currentPage = 1;
    els.pageInput.value = 1;
};

/* ------------------------------------------------------------------ */
/*  Password prompt (encrypted PDFs)                                   */
/* ------------------------------------------------------------------ */
const showPasswordPrompt = (reason, updatePassword) => {
    pendingPasswordCallback = updatePassword;

    const incorrect = reason === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD;

    setLoading(false);
    els.pwInput.value = '';
    els.pwInput.classList.toggle('pwError', incorrect);

    if (incorrect) {
        els.pwErrMsg.textContent = 'Incorrect password. Try again.';
    } else {
        els.pwErrMsg.textContent = '';
    }

    els.pwOverlay.classList.add('show');
    requestAnimationFrame(() => els.pwInput.focus());
};

const submitPassword = () => {
    if (!pendingPasswordCallback) {
        return;
    }

    const value = els.pwInput.value;
    const cb = pendingPasswordCallback;

    pendingPasswordCallback = null;
    els.pwOverlay.classList.remove('show');

    setLoading(true, undefined, 'Loading document…', currentFileName);

    cb(value);
};

const cancelPasswordPrompt = () => {
    pendingPasswordCallback = null;

    els.pwOverlay.classList.remove('show');
    passwordPromptCancelled = true;

    if (currentLoadingTask) {
        try {
            currentLoadingTask.destroy();
        } catch (e) { }
    }

    setLoading(false);
    els.dropZone.style.display = 'flex';
};

els.pwSubmit.addEventListener('click', submitPassword);
els.pwCancel.addEventListener('click', cancelPasswordPrompt);
els.pwInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitPassword();
    else if (e.key === 'Escape') cancelPasswordPrompt();
});

/* ------------------------------------------------------------------ */
/*  Build page + thumb skeleton (placeholders, sized, virtualized)     */
/* ------------------------------------------------------------------ */
const buildSkeleton = () => {
    const pagesFrag = document.createDocumentFragment();
    const thumbFrag = document.createDocumentFragment();

    for (let i = 1; i <= numPages; i++) {
        // main page wrapper
        const wrap = document.createElement('div');
        wrap.className = 'pageWrap loadingPage';
        wrap.dataset.pageNum = i;

        const pnum = document.createElement('div');
        pnum.className = 'pnum';
        pnum.textContent = i;

        wrap.appendChild(pnum);
        pagesFrag.appendChild(wrap);

        pageMeta.push({
            wrap, canvas: null, textLayerDiv: null,
            viewport1: baseViewport1, rendered: false, rendering: false,
            renderTask: null, textTask: null
        });

        // thumbnail wrapper
        const tw = document.createElement('div');
        tw.className = 'thumbWrap';
        tw.dataset.pageNum = i;

        const box = document.createElement('div');
        box.className = 'thumbCanvasBox';

        const ratio = baseViewport1.height / baseViewport1.width;
        box.style.aspectRatio = `1 / ${ratio.toFixed(4)}`;

        tw.appendChild(box);

        const label = document.createElement('div');
        label.className = 'thumbNum';
        label.textContent = i;

        tw.appendChild(label);
        thumbFrag.appendChild(tw);

        thumbMeta.push({ wrap: tw, box, canvas: null, rendered: false });

        tw.addEventListener('click', () => jumpToPage(i));
    }

    els.pages.appendChild(pagesFrag);
    els.sidebar.appendChild(thumbFrag);

    observeAll();
};

/* ------------------------------------------------------------------ */
/*  Scale / sizing                                                     */
/* ------------------------------------------------------------------ */
const computeFitWidthScale = () => {
    const available = isMobile() ? els.scroller.clientWidth * 0.9 : els.scroller.clientWidth - 48;

    scale = Math.max(0.1, available / baseViewport1.width);
    els.zoomPct.textContent = Math.round(scale * 100) + '%';
};

const applyScaleToAllWrappers = () => {
    pageMeta.forEach((m) => {
        const vp = m.viewport1;
        const w = Math.floor(vp.width * scale);
        const h = Math.floor(vp.height * scale);

        m.wrap.style.width = w + 'px';
        m.wrap.style.height = h + 'px';

        if (m.rendered) {
            m.rendered = false;
            m.wrap.classList.add('loadingPage');
            renderPageAt(parseInt(m.wrap.dataset.pageNum, 10));
        }
    });
};

const updateFitBtnTitle = () => {
    const btn = document.getElementById('btnFitWidth');

    if (btn) {
        if (fitWidthMode) {
            btn.title = 'Actual size (100%)';
        } else {
            btn.title = 'Fit to width';
        }
    }
};

const setScale = (newScale, opts = {}) => {
    newScale = Math.max(0.1, Math.min(6, newScale));

    const anchorPage = currentPage;
    const anchorMeta = pageMeta[anchorPage - 1];
    let ratio = 0;

    if (anchorMeta) {
        const rect = anchorMeta.wrap.getBoundingClientRect();
        const scRect = els.scroller.getBoundingClientRect();
        ratio = (scRect.top - rect.top) / rect.height;
    }

    scale = newScale;
    els.zoomPct.textContent = Math.round(scale * 100) + '%';
    fitWidthMode = false;
    updateFitBtnTitle();

    pageMeta.forEach((m) => {
        const vp = m.viewport1;

        m.wrap.style.width = Math.floor(vp.width * scale) + 'px';
        m.wrap.style.height = Math.floor(vp.height * scale) + 'px';

        if (m.rendered || m.rendering) {
            cancelRender(m);
            m.rendered = false;
            m.wrap.classList.add('loadingPage');
        }
    });

    if (!opts.skipRestore && anchorMeta) {
        requestAnimationFrame(() => {
            const rect = anchorMeta.wrap.getBoundingClientRect();
            const scRect = els.scroller.getBoundingClientRect();
            const targetTop = els.scroller.scrollTop + (rect.top - scRect.top) + ratio * rect.height;

            els.scroller.scrollTop = targetTop;
            scheduleWindowUpdate();
        });
    } else {
        scheduleWindowUpdate();
    }
};

const cancelRender = (m) => {
    if (m.renderTask) {
        try {
            m.renderTask.cancel();
        } catch (e) { /* ignore */ }

        m.renderTask = null;
    }

    m.rendering = false;
};

/* ------------------------------------------------------------------ */
/*  Windowed rendering via IntersectionObserver                        */
/* ------------------------------------------------------------------ */
let renderObserver, currentPageObserver, thumbObserver;

const observeAll = () => {
    if (renderObserver) {
        renderObserver.disconnect();
    }

    if (currentPageObserver) {
        currentPageObserver.disconnect();
    }

    if (thumbObserver) {
        thumbObserver.disconnect();
    }

    renderObserver = new IntersectionObserver(onRenderIntersect, {
        root: els.scroller,
        rootMargin: `${RENDER_BUFFER_PX}px 0px ${RENDER_BUFFER_PX}px 0px`,
        threshold: 0
    });

    currentPageObserver = new IntersectionObserver(onCurrentPageIntersect, {
        root: els.scroller,
        rootMargin: '0px',
        threshold: [0, .25, .5, .75, 1]
    });

    thumbObserver = new IntersectionObserver(onThumbIntersect, {
        root: els.sidebar,
        rootMargin: '600px 0px 600px 0px',
        threshold: 0
    });

    pageMeta.forEach(m => {
        renderObserver.observe(m.wrap);
        currentPageObserver.observe(m.wrap);
    });

    thumbMeta.forEach(t => thumbObserver.observe(t.wrap));
};

const onRenderIntersect = (entries) => {
    for (const e of entries) {
        const num = parseInt(e.target.dataset.pageNum, 10);

        if (e.isIntersecting) {
            enqueueRender(num);
        } else {
            unrenderPage(num);
        }
    }
};

const visibleRatios = new Map();
const onCurrentPageIntersect = (entries) => {
    for (const e of entries) {
        const num = parseInt(e.target.dataset.pageNum, 10);

        if (e.isIntersecting) {
            visibleRatios.set(num, e.intersectionRatio);
        } else {
            visibleRatios.delete(num);
        }
    }

    let best = null, bestR = -1;

    visibleRatios.forEach((r, n) => {
        if (r > bestR) {
            bestR = r;
            best = n;
        }
    });

    if (best) {
        updateActivePage(best);
    }
};

const onThumbIntersect = (entries) => {
    for (const e of entries) {
        if (e.isIntersecting) {
            const num = parseInt(e.target.dataset.pageNum, 10);
            renderThumb(num);
        }
    }
};

const scheduleWindowUpdate = () => {
    requestAnimationFrame(() => {
        pageMeta.forEach(m => {
            const r = m.wrap.getBoundingClientRect();
            const sr = els.scroller.getBoundingClientRect();
            const within = r.bottom > sr.top - RENDER_BUFFER_PX && r.top < sr.bottom + RENDER_BUFFER_PX;
            const num = parseInt(m.wrap.dataset.pageNum, 10);

            if (within) {
                enqueueRender(num);
            } else {
                unrenderPage(num);
            }
        });
    });
};

/* ------------------------------------------------------------------ */
/*  Render queue (limits concurrent pdf.js render calls)               */
/* ------------------------------------------------------------------ */
const enqueueRender = (num) => {
    const m = pageMeta[num - 1];

    if (!m || m.rendered || m.rendering) {
        return;
    }

    if (renderQueue.includes(num)) {
        return;
    }

    renderQueue.push(num);
    pumpQueue();
};

const pumpQueue = () => {
    while (activeRenders < MAX_CONCURRENT_RENDERS && renderQueue.length) {
        const num = renderQueue.shift();
        const m = pageMeta[num - 1];

        if (!m || m.rendered || m.rendering) {
            continue;
        }

        activeRenders++;

        renderPageAt(num).finally(() => {
            activeRenders--;
            pumpQueue();
        });
    }
};

const renderPageAt = async (num) => {
    const m = pageMeta[num - 1];

    if (!m) {
        return;
    }

    m.rendering = true;

    try {
        const page = await pdfDoc.getPage(num);
        const vp1 = page.getViewport({ scale: 1 });

        if (Math.abs(vp1.width - m.viewport1.width) > 0.5 || Math.abs(vp1.height - m.viewport1.height) > 0.5) {
            m.viewport1 = vp1;
            m.wrap.style.width = Math.floor(vp1.width * scale) + 'px';
            m.wrap.style.height = Math.floor(vp1.height * scale) + 'px';
        }

        const viewport = page.getViewport({ scale });
        const ratio = dpr();
        let canvas = m.canvas;

        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.draggable = false;
            m.wrap.insertBefore(canvas, m.wrap.firstChild);
            m.canvas = canvas;
        }

        canvas.width = Math.ceil(viewport.width * ratio);
        canvas.height = Math.ceil(viewport.height * ratio);

        const ctx = canvas.getContext('2d', { alpha: false });

        const task = page.render({
            canvasContext: ctx,
            viewport,
            transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : null
        });

        m.renderTask = task;

        await task.promise;

        m.renderTask = null;
        m.rendered = true;
        m.wrap.classList.remove('loadingPage');

        buildTextLayer(m, page, viewport).catch(() => { });
    } catch (err) {
        if (err && err.name === 'RenderingCancelledException') {
            /* ignore */
        } else {
            console.warn('render error on page', num, err);
        }
    } finally {
        m.rendering = false;
    }
};

const buildTextLayer = async (m, page, viewport) => {
    if (!pdfjsLib.TextLayer) {
        return;
    }

    if (m.textLayerDiv) {
        m.textLayerDiv.remove();
        m.textLayerDiv = null;
    }

    const div = document.createElement('div');
    div.className = 'textLayer';
    div.style.width = viewport.width + 'px';
    div.style.height = viewport.height + 'px';
    m.wrap.appendChild(div);
    m.textLayerDiv = div;

    try {
        const textContent = await page.getTextContent();

        const tl = new pdfjsLib.TextLayer({
            textContentSource: textContent,
            container: div,
            viewport
        });

        await tl.render();
    } catch (e) {
        /* ignore */
    }
};

const unrenderPage = (num) => {
    const m = pageMeta[num - 1];

    if (!m) {
        return;
    }

    const idx = renderQueue.indexOf(num);

    if (idx !== -1) {
        renderQueue.splice(idx, 1);
    }

    cancelRender(m);

    if (!m.rendered) {
        return;
    }

    if (m.canvas) {
        m.canvas.remove();
        m.canvas = null;
    }

    if (m.textLayerDiv) {
        m.textLayerDiv.remove();
        m.textLayerDiv = null;
    }

    m.rendered = false;
    m.wrap.classList.add('loadingPage');
};

/* ------------------------------------------------------------------ */
/*  Thumbnails                                                        */
/* ------------------------------------------------------------------ */
const renderThumb = async (num) => {
    const t = thumbMeta[num - 1];

    if (!t || t.rendered || !pdfDoc) {
        return;
    }

    t.rendered = true;

    try {
        const page = await pdfDoc.getPage(num);
        const targetW = 150;
        const vp1 = page.getViewport({ scale: 1 });
        const s = targetW / vp1.width;
        const viewport = page.getViewport({ scale: s });
        const canvas = document.createElement('canvas');
        const ratio = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.ceil(viewport.width * ratio);
        canvas.height = Math.ceil(viewport.height * ratio);

        const ctx = canvas.getContext('2d', { alpha: false });

        await page.render({
            canvasContext: ctx,
            viewport,
            transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : null
        }).promise;

        t.box.innerHTML = '';
        t.box.appendChild(canvas);
        t.canvas = canvas;
    } catch (e) {
        t.rendered = false;
    }
};

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */
const updateActivePage = (num) => {
    if (num === currentPage) {
        /* ignore */
    }

    currentPage = num;
    els.pageInput.value = num;

    thumbMeta.forEach((t, i) => {
        t.wrap.classList.toggle('active', i + 1 === num);
    });

    const activeThumb = thumbMeta[num - 1];

    if (activeThumb) {
        const wrapRect = activeThumb.wrap.getBoundingClientRect();
        const sideRect = els.sidebar.getBoundingClientRect();

        if (wrapRect.top < sideRect.top || wrapRect.bottom > sideRect.bottom) {
            activeThumb.wrap.scrollIntoView({
                block: 'center',
                behavior: 'smooth'
            });
        }
    }
};

const jumpToPage = (num, opts = {}) => {
    num = Math.max(1, Math.min(numPages, num));

    const m = pageMeta[num - 1];

    if (!m) {
        return;
    }

    m.wrap.scrollIntoView({
        behavior: opts.instant ? 'auto' : 'smooth',
        block: 'start'
    });

    updateActivePage(num);

    if (isMobile()) {
        closeSidebar();
    }
};

/* ------------------------------------------------------------------ */
/*  Toolbar wiring                                                    */
/* ------------------------------------------------------------------ */
document.getElementById('btnPrev').addEventListener('click', () => {
    jumpToPage(currentPage - 1);
});

document.getElementById('btnNext').addEventListener('click', () => {
    jumpToPage(currentPage + 1);
});

els.pageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        jumpToPage(parseInt(els.pageInput.value, 10) || 1, { instant: true });
        els.pageInput.blur();
    }
});

els.pageInput.addEventListener('change', () => {
    jumpToPage(parseInt(els.pageInput.value, 10) || 1, { instant: true });
});

document.getElementById('btnZoomIn').addEventListener('click', () => {
    const next = ZOOM_STEPS.find(z => z > scale + 0.001) || scale * 1.25;
    setScale(next);
});

document.getElementById('btnZoomOut').addEventListener('click', () => {
    const rev = [...ZOOM_STEPS].reverse();
    const next = rev.find(z => z < scale - 0.001) || scale * 0.8;
    setScale(next);
});

els.zoomPct.addEventListener('click', () => {
    setScale(1);
});

document.getElementById('btnFitWidth').addEventListener('click', () => {
    if (fitWidthMode) {
        setScale(1);
    } else {
        fitWidthMode = true;
        computeFitWidthScale();
        applyScaleToAllWrappers();
        scheduleWindowUpdate();
        updateFitBtnTitle();
    }
});

document.getElementById('btnFullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => { });
    } else {
        document.exitFullscreen();
    }
});;

const triggerDownload = (url, revoke) => {
    const a = document.createElement('a');

    a.href = url;
    a.download = currentFileName || 'document.pdf';

    document.body.appendChild(a);
    a.click();
    a.remove();

    if (revoke) {
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
};

document.getElementById('btnDownload').addEventListener('click', async () => {
    if (!pdfDoc) return;

    try {
        const data = await pdfDoc.getData();
        const blob = new Blob([data], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        triggerDownload(blobUrl, true);
    } catch (e) {
        console.error(e);
        showError('Could not download this PDF.');
    }
});

const openSidebar = () => {
    els.sidebar.classList.add('open');
    els.sidebarBackdrop.classList.add('show');
};

const closeSidebar = () => {
    els.sidebar.classList.remove('open');
    els.sidebarBackdrop.classList.remove('show');
};

document.getElementById('btnSidebar').addEventListener('click', () => {
    if (isMobile()) {
        if (els.sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    } else {
        const collapsed = els.sidebar.style.display === 'none';

        if (collapsed) {
            els.sidebar.style.display = 'block';
        } else {
            els.sidebar.style.display = 'none';
        }
    }
});

els.sidebarBackdrop.addEventListener('click', closeSidebar);

document.getElementById('btnOpenBig').addEventListener('click', () => {
    els.fileInput.click();
});

els.fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (file) {
        loadFile(file);
    }

    els.fileInput.value = '';
});

const loadFile = async (file) => {
    try {
        const buf = await file.arrayBuffer();
        openSource({ data: buf }, file.name);
    } catch (e) {
        console.error(e);
        showError('Could not read this file.');
    }
};

/* Drag & drop */
['dragenter', 'dragover'].forEach(ev => document.addEventListener(ev, (e) => {
    e.preventDefault();

    if (pdfDoc) {
        return;
    }

    els.dropZone.style.display = 'flex';
    els.dropZone.classList.add('dragOver');
}));

['dragleave', 'drop'].forEach(ev => document.addEventListener(ev, (e) => {
    e.preventDefault();
    els.dropZone.classList.remove('dragOver');
}));

document.addEventListener('drop', (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files && e.dataTransfer.files[0];

    if (file && file.type === 'application/pdf') {
        loadFile(file);
    } else if (file) {
        showError('Please drop a valid PDF file.');

        if (!pdfDoc) {
            els.dropZone.style.display = 'flex';
        }
    } else if (!pdfDoc) {
        els.dropZone.style.display = 'flex';
    }
});

/* Keyboard shortcuts */
document.addEventListener('keydown', (e) => {
    if (document.activeElement === els.pageInput) {
        return;
    }

    if (!pdfDoc) {
        return;
    }

    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        jumpToPage(currentPage + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        jumpToPage(currentPage - 1);
    } else if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        document.getElementById('btnZoomIn').click();
    } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        document.getElementById('btnZoomOut').click();
    }
});

/* Resize handling */
let resizeT;
window.addEventListener('resize', () => {
    clearTimeout(resizeT);

    resizeT = setTimeout(() => {
        if (!pdfDoc) {
            return;
        }

        if (fitWidthMode) {
            computeFitWidthScale();
            applyScaleToAllWrappers();
        }

        scheduleWindowUpdate();
    }, 150);
});

/* ------------------------------------------------------------------ */
/*  Pinch-to-zoom                                                     */
/*  Live CSS transform while pinching                                 */
/*  real re-render at the final scale once fingers lift               */
/* ------------------------------------------------------------------ */
let pinchActive = false;
let pinchStartDist = 0;
let pinchStartScale = 1;
let pinchRatio = 1;

const touchDist = (t0, t1) => {
    return Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
};

els.scroller.addEventListener('touchstart', (e) => {
    if (!pdfDoc || e.touches.length !== 2) {
        return;
    }

    pinchActive = true;
    pinchRatio = 1;
    pinchStartDist = touchDist(e.touches[0], e.touches[1]);
    pinchStartScale = scale;

    const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    const rect = els.pages.getBoundingClientRect();

    const originX = rect.width ? ((midX - rect.left) / rect.width) * 100 : 50;
    const originY = rect.height ? ((midY - rect.top) / rect.height) * 100 : 50;

    els.pages.style.transformOrigin = `${originX}% ${originY}%`;
}, { passive: true });

els.scroller.addEventListener('touchmove', (e) => {
    if (!pinchActive || e.touches.length !== 2) {
        return;
    }

    e.preventDefault();

    const dist = touchDist(e.touches[0], e.touches[1]);
    pinchRatio = Math.max(0.25, Math.min(6, dist / pinchStartDist));

    els.pages.style.transform = `scale(${pinchRatio})`;
}, { passive: false });

const endPinch = (e) => {
    if (!pinchActive || e.touches.length >= 2) {
        return;
    }

    pinchActive = false;
    els.pages.style.transform = '';
    els.pages.style.transformOrigin = '';

    const target = pinchStartScale * pinchRatio;

    if (Math.abs(target - scale) > 0.005) {
        setScale(target);
    }
};

els.scroller.addEventListener('touchend', endPinch);
els.scroller.addEventListener('touchcancel', endPinch);

/* Load PDF from ?file= or ?url= query param */
const checkQueryParam = () => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('file') || params.get('url');

    if (q) {
        const name = decodeURIComponent(q.split('/').pop().split('?')[0]) || 'document.pdf';
        openSource({ url: q }, name);
    }
};

checkQueryParam();