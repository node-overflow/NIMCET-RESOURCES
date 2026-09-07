"use strict";

import {
    elSidebar,
    elOverlay,
    elSidebarClose
} from "./dom.js";

export const openSidebar = () => {
    elSidebar.classList.add("open");
    elOverlay.classList.add("active");

    document.body.classList.add("no-scroll");
};

export const closeSidebar = () => {
    elSidebar.classList.remove("open");
    elOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");
};

export const toggleSidebar = () => {
    if (elSidebar.classList.contains("open")) {
        closeSidebar();
    } else {
        openSidebar();
    }
};