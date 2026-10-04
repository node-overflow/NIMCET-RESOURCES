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

    wireBookLightbox();
};

/* =========================================================
   BOOK COVER LIGHTBOX (desktop only)
   ========================================================= */

const DESKTOP_MQ = "(min-width: 881px)";

const isDesktop = () => window.matchMedia(DESKTOP_MQ).matches;

const wireBookLightbox = () => {
    const lightbox = document.getElementById("bookLightbox");
    const lightboxImg = document.getElementById("bookLightboxImg");

    if (!lightbox || !lightboxImg) return;

    const openLightbox = (src, alt) => {
        lightboxImg.src = src;
        lightboxImg.alt = alt || "Book cover";
        lightbox.hidden = false;
        document.body.classList.add("no-scroll");
    };

    const closeLightbox = () => {
        lightbox.hidden = true;
        lightboxImg.removeAttribute("src");
        lightboxImg.alt = "";
        document.body.classList.remove("no-scroll");
    };

    document.addEventListener("click", (event) => {
        const img = event.target.closest(".book-cover img");

        if (!img) return;
        if (!isDesktop()) return;

        event.preventDefault();
        event.stopPropagation();

        const src = img.currentSrc || img.src;
        if (!src) return;

        openLightbox(src, img.alt);
    });

    lightbox.addEventListener("click", (event) => {
        if (event.target.closest("[data-lightbox-close]")) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !lightbox.hidden) {
            closeLightbox();
        }
    });
};
