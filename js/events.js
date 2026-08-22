"use strict";

import {
    $$,
    elOverlay,
    elSidebarClose,
    elPyqsBackBtn,
    elDppChapterBackBtn,
    elDppBackBtn,
    elMocksBackBtn,
    elSearchInput
} from "./dom.js";

import { state } from "./state.js";

import { renderResources } from "./resources.js";

import {
    goHome,
    goToResources,
    goToUpdates,
    goToPyqs,
    goToDpps,
    goToDppsSubject,
    goToMocks
} from "./navigation.js";

import {
    toggleSidebar,
    closeSidebar
} from "./sidebar.js";

export const wireStaticEvents = () => {
    elOverlay.addEventListener("click", closeSidebar);

    elSidebarClose.addEventListener("click", closeSidebar);

    $$(".nav-item").forEach(button => {
        button.addEventListener("click", () => {
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
            }
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

    elSearchInput.addEventListener("input", event => {
        state.search = event.target.value;
        renderResources();
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
};