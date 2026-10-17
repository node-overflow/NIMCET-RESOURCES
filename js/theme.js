"use strict";

const STORAGE_KEY = "nimcet-theme";

const elToggle = document.getElementById("themeToggle");
const elToggleMobile = document.getElementById("themeToggleMobile");
const elThemeColor = document.querySelector('meta[name="theme-color"]');
const elColorScheme = document.querySelector('meta[name="color-scheme"]');

const ICON_ATTRS =
    'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

const ICON_SUN =
    `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="4.2"/>` +
    '<path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg>';

const ICON_MOON =
    `<svg ${ICON_ATTRS}><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/></svg>`;

const setToggleIcons = (theme) => {
    const icon = theme === "light" ? ICON_SUN : ICON_MOON;
    if (elToggle) elToggle.innerHTML = icon;
    if (elToggleMobile) elToggleMobile.innerHTML = icon;
};

const applyTheme = (theme) => {
    if (theme === "light") {
        document.documentElement.setAttribute("data-theme", "light");

        setToggleIcons("light");
        if (elThemeColor) elThemeColor.setAttribute("content", "#edeff3");
        if (elColorScheme) elColorScheme.setAttribute("content", "light");
    } else {
        document.documentElement.removeAttribute("data-theme");

        setToggleIcons("dark");
        if (elThemeColor) elThemeColor.setAttribute("content", "#0e1118");
        if (elColorScheme) elColorScheme.setAttribute("content", "dark");
    }
};

const getSavedTheme = () => {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
        return null;
    }
};

const saveTheme = (theme) => {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
        // ignore
    }
};

const toggleTheme = () => {
    const isLight =
        document.documentElement.getAttribute("data-theme") === "light";

    const next = isLight ? "dark" : "light";

    applyTheme(next);
    saveTheme(next);
};

export const wireThemeToggle = () => {
    const saved = getSavedTheme();

    applyTheme(saved === "light" ? "light" : "dark");

    if (elToggle) {
        elToggle.addEventListener("click", toggleTheme);
    }
    if (elToggleMobile) {
        elToggleMobile.addEventListener("click", toggleTheme);
    }
};