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
    renderMocksDetail
} from "./mocks.js";

import { closeSidebar } from "./sidebar.js";

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

export const showView = name => {
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
};

export const goHome = () => {
    showView("home");
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
            })
    );
};

export const goToResources = opts => {
    opts = opts || {};

    if ("subject" in opts) {
        state.subject = opts.subject;
    } else {
        state.subject = state.subject;
    }

    if ("type" in opts) {
        state.type = opts.type;
    } else {
        state.type = state.type;
    }

    if ("search" in opts) {
        state.search = opts.search;
    } else {
        state.search = state.search;
    }

    elSearchInput.value = state.search;

    showView("resources");

    renderResources();
};

export const goToUpdates = () => {
    showView("updates");

    updateUnreadBadge();

    renderUpdates();
};

export const goToPyqs = () => {
    state.examKey = null;

    showView("pyqs");

    renderExamGrid(
        goToPyqsExam
    );
};

export const goToPyqsExam = examKey => {
    state.examKey = examKey;

    showView("pyqs-exam");

    renderPyqsExam();
};

export const goToDpps = () => {
    state.dppSubject = null;
    state.dppChapterKey = null;
    state.dppChapterName = null;

    showView("dpps");

    renderDppSubjectGrid(goToDppsSubject);
};

export const goToDppsSubject = subjectName => {
    state.dppSubject = subjectName;
    state.dppChapterKey = null;
    state.dppChapterName = null;

    showView("dpps-subject");

    renderDppChapters(goToDppsChapter);
};

export const goToDppsChapter = (chapterKey, chapterName) => {
    state.dppChapterKey = chapterKey;
    state.dppChapterName = chapterName;

    showView("dpps-chapter");

    renderDppChapterItems();
};

export const goToMocks = () => {
    state.mockKey = null;

    showView("mocks");

    renderMocksGrid(goToMocksDetail);
};

export const goToMocksDetail = (mockKey, mockName) => {
    state.mockKey = mockKey;

    showView("mocks-detail");

    renderMocksDetail(mockName);
};