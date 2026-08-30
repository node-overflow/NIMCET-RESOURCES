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

import { renderExamInfo } from "./examinfo.js";

import { closeSidebar } from "./sidebar.js";

let historyInitialized = false;

const buildSnapshot = () => ({
    view: state.view,
    subject: state.subject,
    type: state.type,
    search: state.search,
    examKey: state.examKey,
    examFilter: state.examFilter,
    dppSubject: state.dppSubject,
    dppChapterKey: state.dppChapterKey,
    dppChapterName: state.dppChapterName,
    mockKey: state.mockKey,
    updateCategory: state.updateCategory
});

const applySnapshot = (snapshot) => {
    const s = snapshot || {};

    state.subject = s.subject ?? null;
    state.type = s.type ?? null;
    state.search = s.search ?? "";
    state.examKey = s.examKey ?? null;
    state.examFilter = s.examFilter ?? null;
    state.dppSubject = s.dppSubject ?? null;
    state.dppChapterKey = s.dppChapterKey ?? null;
    state.dppChapterName = s.dppChapterName ?? null;
    state.mockKey = s.mockKey ?? null;
    state.updateCategory = s.updateCategory ?? null;

    elSearchInput.value = state.search;

    showView(s.view || "home", { pushHistoryEntry: false });

    renderForView();
};

export const initHistoryNavigation = () => {
    window.addEventListener("popstate", event => {
        applySnapshot(event.state);
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

        if (homeButton) {
            homeButton.dataset.active = "true";
        }

        const bottomHome = document.querySelector('.bnav-item[data-bottom="home"]');

        if (bottomHome) {
            bottomHome.dataset.active = "true";
        }

        return;
    }

    if (state.view === "resources") {
        if (state.subject) {
            const subjectButton = document.querySelector(
                '.nav-item[data-subject="' +
                CSS.escape(state.subject) +
                '"]'
            );

            if (subjectButton) {
                subjectButton.dataset.active = "true";
            }
        } else if (!state.type) {
            const allButton = document.querySelector('.nav-item[data-nav="all"]');

            if (allButton) {
                allButton.dataset.active = "true";
            }

            const bottomAll = document.querySelector('.bnav-item[data-bottom="all"]');

            if (bottomAll) {
                bottomAll.dataset.active = "true";
            }
        }

        return;
    }

    if (state.view === "updates") {
        const button = document.querySelector('.nav-item[data-nav="updates"]');

        if (button) {
            button.dataset.active = "true";
        }

        return;
    }

    if (state.view === "pyqs" || state.view === "pyqs-exam") {
        const button = document.querySelector('.nav-item[data-nav="pyqs"]');

        if (button) {
            button.dataset.active = "true";
        }

        return;
    }

    if (state.view === "exam-info") {
        const button = document.querySelector('.nav-item[data-nav="examinfo"]');

        if (button) {
            button.dataset.active = "true";
        }

        return;
    }

    if (state.view === "dpps" || state.view === "dpps-subject" || state.view === "dpps-chapter") {
        const button = document.querySelector('.nav-item[data-nav="dpps"]');

        if (button) {
            button.dataset.active = "true";
        }

        return;
    }

    if (state.view === "mocks" || state.view === "mocks-detail") {
        const button = document.querySelector('.nav-item[data-nav="mocks"]');

        if (button) {
            button.dataset.active = "true";
        }
    }
};

export const showView = (name, options = {}) => {
    const pushHistoryEntry = options.pushHistoryEntry !== false;
    const previousView = state.view;

    state.view = name;

    Object.keys(VIEWS).forEach(key => {
        const element = VIEWS[key];

        if (element) {
            element.hidden = key !== name;
        }
    });

    setActiveNav();

    closeSidebar();

    window.scrollTo(0, 0);

    const snapshot = buildSnapshot();

    if (!historyInitialized) {
        history.replaceState(snapshot, "", "");
        historyInitialized = true;
    } else if (pushHistoryEntry) {
        if (previousView === name) {
            history.replaceState(snapshot, "", "");
        } else {
            history.pushState(snapshot, "", "");
        }
    }
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
                () =>
                    goToPyqs(),
                () =>
                    goToUpdates()
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

        case "exam-info":
            renderExamInfo();
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

        default:
            break;
    }
};

export const goHome = () => {
    showView("home");
    renderForView();
};

export const goToResources = opts => {
    opts = opts || {};

    if ("subject" in opts) {
        state.subject = opts.subject;
    }

    if ("type" in opts) {
        state.type = opts.type;
    }

    if ("search" in opts) {
        state.search = opts.search;
    }

    const keepComputerFilter = state.subject === "Computer" && state.type === "Video";
    const keepMathPyqFilter = state.subject === "Mathematics" && state.type === "PYQ";

    if (!keepComputerFilter && !keepMathPyqFilter) {
        state.examFilter = null;
    }

    elSearchInput.value = state.search;

    showView("resources");

    renderForView();
};

export const goToUpdates = () => {
    showView("updates");

    renderForView();
};

export const goToPyqs = () => {
    state.examKey = null;

    showView("pyqs", { pushHistoryEntry: false });

    renderForView();
};

export const goToPyqsExam = examKey => {
    state.examKey = examKey;

    showView("pyqs-exam");

    renderForView();
};

export const goToExamInfo = () => {
    showView("exam-info");

    renderForView();
};

export const goToDpps = () => {
    state.dppSubject = null;
    state.dppChapterKey = null;
    state.dppChapterName = null;

    showView("dpps", { pushHistoryEntry: false });

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

    showView("mocks", { pushHistoryEntry: false });

    renderForView();
};

export const goToMocksDetail = (mockKey, mockName) => {
    state.mockKey = mockKey;

    showView("mocks-detail");

    renderForView();
};