"use strict";

import {
    VIEWS,
    elSearchInput
} from "./dom.js";

import { state } from "./state.js";

import { renderHome } from "./home.js";

import { renderResources } from "./resources.js";

import {
    renderUpdates,
    updateUnreadBadge
} from "./updates.js";

import {
    renderExamGrid,
    renderPyqsExam
} from "./pyqs.js";

import {
    renderDppSubjectGrid,
    renderDppChapters,
    renderDppChapterItems
} from "./dpp.js";

import {
    renderMocksGrid,
    renderMocksDetail,
    mockByKey
} from "./mocks.js";

import { renderMathgym } from "./mathgym.js";

import { closeSidebar } from "./sidebar.js";

import { pathForState, routeFromPath } from "./routes.js";

/* =========================================================
   HISTORY STACK (from scratch)

   Rules:
   1. Every user navigation that should be reversible → pushState
   2. Boot / deep-link / same-entry updates → replaceState
   3. Browser back/forward → popstate restores snapshot only (no push)
   4. In-app back buttons → history.back() (real stack, never hard-coded parents)
   5. history.state is the source of truth for restorable app state
   ========================================================= */

let isRestoring = false;
let isBooted = false;

const NAV_KEYS = [
    "view",
    "subject",
    "type",
    "search",
    "examKey",
    "examFilter",
    "mathOwnerFilter",
    "mathChapterFilter",
    "dppSubject",
    "dppChapterKey",
    "dppChapterName",
    "mockKey",
    "updateCategory"
];

const buildSnapshot = (scrollY = 0) => {
    const snap = { scrollY: scrollY || 0 };

    NAV_KEYS.forEach(key => {
        snap[key] = state[key] ?? null;
    });

    if (snap.search == null) snap.search = "";

    return snap;
};

const applySnapshotToState = (snap) => {
    const s = snap || {};

    state.subject = s.subject ?? null;
    state.type = s.type ?? null;
    state.search = s.search ?? "";
    state.examKey = s.examKey ?? null;
    state.examFilter = s.examFilter ?? null;
    state.mathOwnerFilter = s.mathOwnerFilter ?? null;
    state.mathChapterFilter = s.mathChapterFilter ?? null;
    state.dppSubject = s.dppSubject ?? null;
    state.dppChapterKey = s.dppChapterKey ?? null;
    state.dppChapterName = s.dppChapterName ?? null;
    state.mockKey = s.mockKey ?? null;
    state.updateCategory = s.updateCategory ?? null;
    state.view = s.view || "home";

    if (elSearchInput) {
        elSearchInput.value = state.search;
    }
};

const saveScrollOnCurrentEntry = () => {
    if (!isBooted || isRestoring) return;

    const current = history.state;

    if (!current || typeof current !== "object") return;

    try {
        history.replaceState(
            { ...current, scrollY: window.scrollY || 0 },
            "",
            pathForState(state)
        );
    } catch (_) {
        /* ignore quota / security edge cases */
    }
};

const commitHistory = ({ replace = false, scrollY = 0 } = {}) => {
    if (isRestoring) return;

    const snap = buildSnapshot(scrollY);
    const url = pathForState(state);

    if (replace || !isBooted) {
        history.replaceState(snap, "", url);
    } else {
        history.pushState(snap, "", url);
    }
};

const paintViews = () => {
    Object.keys(VIEWS).forEach(key => {
        const element = VIEWS[key];

        if (element) {
            element.hidden = key !== state.view;
        }
    });

    setActiveNav();
    closeSidebar();
};

const renderForView = () => {
    switch (state.view) {
        case "home":
            renderHome(
                subject =>
                    goToResources({
                        subject,
                        type: null,
                        search: ""
                    }),
                type =>
                    goToResources({
                        subject: null,
                        type,
                        search: ""
                    }),
                () =>
                    goToResources({
                        subject: null,
                        type: null,
                        search: ""
                    }),
                () => goToPyqs(),
                () => goToUpdates()
            );
            break;

        case "resources":
            renderResources();
            break;

        case "updates":
            updateUnreadBadge();
            renderUpdates();
            break;

        case "pyqs":
            renderExamGrid(goToPyqsExam);
            break;

        case "pyqs-exam":
            renderPyqsExam();
            break;

        case "dpps":
            renderDppSubjectGrid(goToDppsSubject);
            break;

        case "dpps-subject":
            renderDppChapters(goToDppsChapter);
            break;

        case "dpps-chapter":
            renderDppChapterItems();
            break;

        case "mocks":
            renderMocksGrid(goToMocksDetail);
            break;

        case "mocks-detail": {
            const mock = mockByKey(state.mockKey);

            renderMocksDetail(mock ? mock.name : state.mockKey);
            break;
        }

        case "mathgym":
            renderMathgym();
            break;

        default:
            break;
    }
};

/**
 * Core transition.
 * @param {string} name - view id
 * @param {{ replace?: boolean, scrollToTop?: boolean }} options
 *   replace: true → replaceState (boot, filters, or intentional replace)
 *   scrollToTop: default true for forward nav; false when restoring
 */
export const showView = (name, options = {}) => {
    const replace = options.replace === true;
    const scrollToTop = options.scrollToTop !== false;

    if (!isRestoring) {
        saveScrollOnCurrentEntry();
    }

    state.view = name;
    paintViews();

    if (scrollToTop && !isRestoring) {
        window.scrollTo(0, 0);
    }

    commitHistory({
        replace: replace || !isBooted,
        scrollY: scrollToTop && !isRestoring ? 0 : window.scrollY || 0
    });
};

export const setActiveNav = () => {
    document.querySelectorAll(".nav-item").forEach(button => {
        button.dataset.active = "false";
    });

    document.querySelectorAll(".bnav-item").forEach(button => {
        button.dataset.active = "false";
    });

    if (state.view === "home") {
        const homeButton = document.querySelector('.nav-item[data-nav="home"]');
        if (homeButton) homeButton.dataset.active = "true";

        const bottomHome = document.querySelector('.bnav-item[data-bottom="home"]');
        if (bottomHome) bottomHome.dataset.active = "true";
        return;
    }

    if (state.view === "resources") {
        if (state.subject) {
            const subjectButton = document.querySelector(
                '.nav-item[data-subject="' + CSS.escape(state.subject) + '"]'
            );
            if (subjectButton) subjectButton.dataset.active = "true";
        } else {
            const allButton = document.querySelector('.nav-item[data-nav="all"]');
            if (allButton) allButton.dataset.active = "true";

            const bottomAll = document.querySelector('.bnav-item[data-bottom="all"]');
            if (bottomAll) bottomAll.dataset.active = "true";
        }
        return;
    }

    if (state.view === "updates") {
        const button = document.querySelector('.nav-item[data-nav="updates"]');
        if (button) button.dataset.active = "true";
        return;
    }

    if (state.view === "pyqs" || state.view === "pyqs-exam") {
        const button = document.querySelector('.nav-item[data-nav="pyqs"]');
        if (button) button.dataset.active = "true";
        return;
    }

    if (
        state.view === "dpps" ||
        state.view === "dpps-subject" ||
        state.view === "dpps-chapter"
    ) {
        const button = document.querySelector('.nav-item[data-nav="dpps"]');
        if (button) button.dataset.active = "true";
        return;
    }

    if (state.view === "mocks" || state.view === "mocks-detail") {
        const button = document.querySelector('.nav-item[data-nav="mocks"]');
        if (button) button.dataset.active = "true";
        return;
    }

    if (state.view === "mathgym") {
        const button = document.querySelector('.nav-item[data-nav="mathgym"]');
        if (button) button.dataset.active = "true";
    }
};

/* =========================================================
   PUBLIC NAV ACTIONS (always push onto the stack)
   ========================================================= */

export const goHome = () => {
    showView("home");
    renderForView();
};

export const goToResources = opts => {
    opts = opts || {};

    if ("subject" in opts) state.subject = opts.subject;
    if ("type" in opts) state.type = opts.type;
    if ("search" in opts) state.search = opts.search;

    const keepComputerFilter =
        state.subject === "Computer" && state.type === "Video";
    const keepMathPyqFilter =
        state.subject === "Mathematics" && state.type === "PYQ";

    if (!keepComputerFilter && !keepMathPyqFilter) {
        state.examFilter = null;
    }

    const keepMathPracticeFilter =
        state.subject === "Mathematics" && state.type === "Practice";

    if (!keepMathPracticeFilter) {
        state.mathOwnerFilter = null;
        state.mathChapterFilter = null;
    }

    if (elSearchInput) elSearchInput.value = state.search;

    showView("resources");
    renderForView();
};

export const goToUpdates = () => {
    showView("updates");
    renderForView();
};

export const goToPyqs = () => {
    state.examKey = null;
    showView("pyqs");
    renderForView();
};

export const goToPyqsExam = examKey => {
    state.examKey = examKey;
    showView("pyqs-exam");
    renderForView();
};

export const goToDpps = () => {
    state.dppSubject = null;
    state.dppChapterKey = null;
    state.dppChapterName = null;
    showView("dpps");
    renderForView();
};

export const goToDppsSubject = subjectName => {
    state.dppSubject = subjectName;
    state.dppChapterKey = null;
    state.dppChapterName = null;
    showView("dpps-subject");
    renderForView();
};

export const goToDppsChapter = (chapterKey, chapterName) => {
    state.dppChapterKey = chapterKey;
    state.dppChapterName = chapterName;
    showView("dpps-chapter");
    renderForView();
};

export const goToMocks = () => {
    state.mockKey = null;
    showView("mocks");
    renderForView();
};

export const goToMocksDetail = (mockKey, mockName) => {
    state.mockKey = mockKey;
    showView("mocks-detail");
    renderForView();
};

export const goToMathgym = () => {
    showView("mathgym");
    renderForView();
};

/**
 * In-app back arrow. Uses the real browser history stack.
 * Falls back to a sensible parent only if there is nothing to go back to.
 */
export const goBack = () => {
    if (window.history.length > 1) {
        history.back();
        return;
    }

    // No stack (e.g. opened deep-link in new tab)
    switch (state.view) {
        case "pyqs-exam":
            goToPyqs();
            break;
        case "dpps-chapter":
            goToDppsSubject(state.dppSubject);
            break;
        case "dpps-subject":
            goToDpps();
            break;
        case "mocks-detail":
            goToMocks();
            break;
        case "resources":
        case "updates":
        case "pyqs":
        case "dpps":
        case "mocks":
        case "mathgym":
            goHome();
            break;
        default:
            goHome();
    }
};

/* =========================================================
   RESTORE FROM HISTORY / DEEP LINK
   ========================================================= */

const restoreFromSnapshot = (snap) => {
    isRestoring = true;

    try {
        applySnapshotToState(snap);
        paintViews();
        renderForView();

        const y = (snap && snap.scrollY) || 0;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.scrollTo(0, y);
            });
        });
    } finally {
        isRestoring = false;
    }
};

const applyRouteQuiet = (route) => {
    // Mutate state for the route without pushing history (used on boot / empty popstate)
    switch (route.view) {
        case "resources":
            state.subject = route.subject ?? null;
            state.type = route.type ?? null;
            state.search = "";
            state.examFilter = null;
            state.mathOwnerFilter = null;
            state.mathChapterFilter = null;
            state.view = "resources";
            break;

        case "updates":
            state.view = "updates";
            break;

        case "pyqs":
            state.examKey = null;
            state.view = "pyqs";
            break;

        case "pyqs-exam":
            state.examKey = route.examKey;
            state.view = "pyqs-exam";
            break;

        case "dpps":
            state.dppSubject = null;
            state.dppChapterKey = null;
            state.dppChapterName = null;
            state.view = "dpps";
            break;

        case "dpps-subject":
            state.dppSubject = route.dppSubject;
            state.dppChapterKey = null;
            state.dppChapterName = null;
            state.view = "dpps-subject";
            break;

        case "dpps-chapter":
            state.dppSubject = route.dppSubject;
            state.dppChapterKey = route.dppChapterKey;
            state.dppChapterName = route.dppChapterKey;
            state.view = "dpps-chapter";
            break;

        case "mocks":
            state.mockKey = null;
            state.view = "mocks";
            break;

        case "mocks-detail":
            state.mockKey = route.mockKey;
            state.view = "mocks-detail";
            break;

        case "mathgym":
            state.view = "mathgym";
            break;

        default:
            state.view = "home";
            break;
    }

    if (elSearchInput) elSearchInput.value = state.search || "";
};

export const initHistoryNavigation = () => {
    window.addEventListener("popstate", event => {
        if (event.state && typeof event.state === "object" && event.state.view) {
            restoreFromSnapshot(event.state);
            return;
        }

        // No state (e.g. external hash edit) — derive from URL
        const hashPath = window.location.hash
            ? window.location.hash.slice(1)
            : "/";
        const route = routeFromPath(hashPath || "/");

        isRestoring = true;

        try {
            applyRouteQuiet(route);
            paintViews();
            renderForView();
            window.scrollTo(0, 0);
            // Seed state onto this history entry so future back works
            history.replaceState(buildSnapshot(0), "", pathForState(state));
        } finally {
            isRestoring = false;
        }
    });
};

export const initFromLocation = () => {
    const hashPath = window.location.hash
        ? window.location.hash.slice(1)
        : "/";
    const route = routeFromPath(hashPath || "/");

    isRestoring = true;

    try {
        applyRouteQuiet(route);
        paintViews();
        renderForView();
        window.scrollTo(0, 0);
        history.replaceState(buildSnapshot(0), "", pathForState(state));
    } finally {
        isRestoring = false;
        isBooted = true;
    }
};
