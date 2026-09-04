"use strict";

const STORAGE_KEY = "nimcet-theme";

const elToggle = document.getElementById("themeToggle");
const elThemeColor = document.querySelector('meta[name="theme-color"]');
const elColorScheme = document.querySelector('meta[name="color-scheme"]');

const applyTheme = (theme) => {
    if (theme === "light") {
        document.documentElement.setAttribute("data-theme", "light");

        if (elToggle) elToggle.textContent = "☀️";
        if (elThemeColor) elThemeColor.setAttribute("content", "#f7f8fa");
        if (elColorScheme) elColorScheme.setAttribute("content", "light");
    } else {
        document.documentElement.removeAttribute("data-theme");

        if (elToggle) elToggle.textContent = "🌙";
        if (elThemeColor) elThemeColor.setAttribute("content", "#0a0a0c");
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
        // Private browsing / storage disabled
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
};