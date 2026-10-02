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
    elScrollTopBtn,
    elMobileMenuBtn
} from "./dom.js";

import { state } from "./state.js";

import { renderResourceResults } from "./resources.js";

import {
    goHome,
    goToResources,
    goToUpdates,
    goToPyqs,
    goToDpps,
    goToDppsSubject,
    goToMocks,
    goToMathgym
} from "./navigation.js";

import {
    toggleSidebar,
    closeSidebar,
    initSidebarCollapse
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
    } else if (nav === "dpps") {
        goToDpps();
    } else if (nav === "mocks") {
        goToMocks();
    } else if (nav === "mathgym") {
        goToMathgym();
    }
};

export const wireStaticEvents = () => {
    elOverlay.addEventListener("click", closeSidebar);

    elSidebarClose.addEventListener("click", closeSidebar);

    if (elMobileMenuBtn) {
        elMobileMenuBtn.addEventListener("click", toggleSidebar);
    }

    initSidebarCollapse();

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

    const handleScrollTopButton = () => {
        if (!elScrollTopBtn) return;

        elScrollTopBtn.dataset.visible =
            window.scrollY > 300 ? "true" : "false";
    };

    let scrollEndTimer = null;

    const handleScrollHoverGuard = () => {
        document.documentElement.classList.add("is-scrolling");

        clearTimeout(scrollEndTimer);

        scrollEndTimer = setTimeout(() => {
            document.documentElement.classList.remove("is-scrolling");
        }, 150);
    };

    window.addEventListener("scroll", () => {
        handleScrollTopButton();
        handleScrollHoverGuard();
    }, {
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
