"use strict";

import {
    elSidebar,
    elOverlay,
    elSidebarClose,
    elMenuBBtn
} from "./dom.js";

export const openSidebar = () => {
    elSidebar.classList.add("open");
    elOverlay.classList.add("active");

    document.body.classList.add("no-scroll");

    if (elMenuBBtn) {
        elMenuBBtn.dataset.active = "true";
    }
};

export const closeSidebar = () => {
    elSidebar.classList.remove("open");
    elOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

    if (elMenuBBtn) {
        elMenuBBtn.dataset.active = "false";
    }
};

export const toggleSidebar = () => {
    if (elSidebar.classList.contains("open")) {
        closeSidebar();
    } else {
        openSidebar();
    }
};