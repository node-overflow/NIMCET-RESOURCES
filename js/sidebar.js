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

const getNavItems = () =>
    elSidebar ? Array.from(elSidebar.querySelectorAll(".nav-item")) : [];

const ensureNavTooltipCache = () => {
    getNavItems().forEach((item) => {
        if (item.dataset.tooltip) return;

        const labelSpan = Array.from(item.querySelectorAll("span")).find(
            (s) =>
                !s.classList.contains("nav-symbol") &&
                !s.classList.contains("nav-badge") &&
                !s.classList.contains("sym-desktop-only") &&
                !s.classList.contains("sym-mobile-only")
        );

        const text =
            (labelSpan && labelSpan.textContent.trim()) ||
            item.getAttribute("title") ||
            "";

        if (text) item.dataset.tooltip = text;

        item.removeAttribute("title");
    });
};

const setNavTooltips = (collapsed) => {
    getNavItems().forEach((item) => {
        const tip = item.dataset.tooltip;
        if (!tip) return;

        if (collapsed) {
            item.setAttribute("title", tip);
        } else {
            item.removeAttribute("title");
        }
    });
};

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
    if (btn) {
        btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
        btn.setAttribute(
            "aria-label",
            collapsed ? "Expand sidebar" : "Collapse sidebar"
        );
        btn.title = collapsed ? "Expand sidebar" : "Collapse sidebar";
    }

    setNavTooltips(collapsed);
};

export const setSidebarCollapsed = (collapsed) => {
    if (!elSidebar) return;

    ensureNavTooltipCache();

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

    ensureNavTooltipCache();

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
