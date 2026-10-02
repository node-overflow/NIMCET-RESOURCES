"use strict";

import {
    elSidebar,
    elOverlay,
    elSidebarClose
} from "./dom.js";

const COLLAPSE_KEY = "sidebar-collapsed";
const DESKTOP_MQ = "(min-width: 881px)";

const elCollapseBtn = () => document.getElementById("sidebarCollapseBtn");

const isDesktop = () => window.matchMedia(DESKTOP_MQ).matches;

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

const setCollapseUi = (collapsed) => {
    const btn = elCollapseBtn();
    if (!btn) return;

    btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
    btn.setAttribute(
        "aria-label",
        collapsed ? "Expand sidebar" : "Collapse sidebar"
    );
    btn.title = collapsed ? "Expand sidebar" : "Collapse sidebar";
};

export const setSidebarCollapsed = (collapsed) => {
    if (!elSidebar) return;

    if (collapsed && isDesktop()) {
        elSidebar.classList.add("collapsed");
    } else {
        elSidebar.classList.remove("collapsed");
    }

    setCollapseUi(elSidebar.classList.contains("collapsed"));

    try {
        localStorage.setItem(
            COLLAPSE_KEY,
            elSidebar.classList.contains("collapsed") ? "1" : "0"
        );
    } catch {
        /* ignore */
    }
};

export const toggleSidebarCollapse = () => {
    if (!isDesktop()) return;
    setSidebarCollapsed(!elSidebar.classList.contains("collapsed"));
};

export const initSidebarCollapse = () => {
    const btn = elCollapseBtn();
    if (!btn) return;

    let preferred = false;
    try {
        preferred = localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
        preferred = false;
    }

    setSidebarCollapsed(preferred);

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleSidebarCollapse();
    });

    const mq = window.matchMedia(DESKTOP_MQ);
    const onChange = () => {
        if (!mq.matches) {
            elSidebar.classList.remove("collapsed");
            setCollapseUi(false);
        } else {
            let pref = false;
            try {
                pref = localStorage.getItem(COLLAPSE_KEY) === "1";
            } catch {
                pref = false;
            }
            setSidebarCollapsed(pref);
        }
    };

    if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", onChange);
    } else if (typeof mq.addListener === "function") {
        mq.addListener(onChange);
    }
};
