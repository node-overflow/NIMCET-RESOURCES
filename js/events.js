"use strict";

import {
    $$,
    elOverlay,
    elSidebarClose,
    elPyqsBackBtn,
    elDppChapterBackBtn,
    elDppBackBtn,
    elMocksBackBtn,
    elSearchInput,
    elScrollTopBtn
} from "./dom.js";

import { state } from "./state.js";

import { renderResourceResults } from "./resources.js";

import {
    goHome,
    goToResources,
    goToUpdates,
    goToPyqs,
    goToExamInfo,
    goToDpps,
    goToDppsSubject,
    goToMocks
} from "./navigation.js";

import {
    toggleSidebar,
    closeSidebar
} from "./sidebar.js";

const debounce = (fn, delay) => {
    let timerId = null;

    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn(...args), delay);
    };
};

const handleNavAction = (button) => {
    const nav = button.dataset.nav;

    if (nav === "home") {
        goHome();
    } else if (nav === "all") {
        goToResources({
            subject: null,
            type: null,
            search: ""
        });
    } else if (nav === "subject") {
        goToResources({
            subject: button.dataset.subject,
            type: null,
            search: ""
        });
    } else if (nav === "updates") {
        goToUpdates();
    } else if (nav === "pyqs") {
        goToPyqs();
    } else if (nav === "examinfo") {
        goToExamInfo();
    } else if (nav === "dpps") {
        goToDpps();
    } else if (nav === "mocks") {
        goToMocks();
    }
};

export const wireStaticEvents = () => {
    elOverlay.addEventListener("click", closeSidebar);

    elSidebarClose.addEventListener("click", closeSidebar);

    $$(".nav-item").forEach(button => {
        button.addEventListener("click", () => {
            handleNavAction(button);
        });
    });

    $$(".footer-link[data-nav]").forEach(button => {
        button.addEventListener("click", () => {
            handleNavAction(button);
        });
    });

    if (elPyqsBackBtn) {
        elPyqsBackBtn.addEventListener("click", () => {
            goToPyqs();
        });
    }

    if (elDppChapterBackBtn) {
        elDppChapterBackBtn.addEventListener("click", () => {
            goToDpps();
        });
    }

    if (elDppBackBtn) {
        elDppBackBtn.addEventListener("click", () => {
            goToDppsSubject(state.dppSubject);
        });
    }

    if (elMocksBackBtn) {
        elMocksBackBtn.addEventListener("click", () => {
            goToMocks();
        });
    }

    const debouncedRenderResults = debounce(renderResourceResults, 200);

    elSearchInput.addEventListener("input", event => {
        state.search = event.target.value;
        debouncedRenderResults();
    });

    $$(".bnav-item").forEach(button => {
        button.addEventListener("click", () => {
            const action = button.dataset.bottom;

            if (action === "home") {
                goHome();
            } else if (action === "all") {
                goToResources({
                    subject: null,
                    type: null,
                    search: ""
                });
            } else if (action === "menu") {
                toggleSidebar();
            } else if (action === "search") {
                closeSidebar();

                if (state.view !== "resources") {
                    goToResources({});
                }

                setTimeout(() => {
                    elSearchInput.focus();

                    elSearchInput.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }, 50);
            }
        });
    });

    const handleScrollTopButton = () => {
        if (!elScrollTopBtn) return;

        elScrollTopBtn.dataset.visible =
            window.scrollY > 300 ? "true" : "false";
    };

    window.addEventListener("scroll", handleScrollTopButton, {
        passive: true
    });

    if (elScrollTopBtn) {
        elScrollTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
};