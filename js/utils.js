"use strict";

import { NEW_WITHIN_DAYS, TYPES, MATH_CHAPTER_KEYWORDS } from "./config.js";
import { state } from "./state.js";

export const escapeHtml = str => {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
};

export const typeLabelPlural = key => {
    const type = TYPES.find(item => item.key === key);

    if (type) {
        return type.label;
    }

    return key;
};

export const actionLabel = item => {
    if (item.action === "download") {
        return "Download PDF";
    }

    return "Open PDF";
};

export const deriveMathChapter = title => {
    if (!title) return null;

    const lower = String(title).toLowerCase();

    const match = MATH_CHAPTER_KEYWORDS.find(entry =>
        entry.keywords.some(keyword => lower.includes(keyword))
    );

    return match ? match.chapter : null;
};

export const countBySubject = name => {
    return state.resources.filter(
        resource => resource.subject === name
    ).length;
};

export const countByExam = key => {
    return state.pyqs.filter(
        resource => resource.exam === key
    ).length;
};

export const parseDateStr = str => {
    if (!str) return null;

    const parts = String(str)
        .split("-")
        .map(n => parseInt(n, 10));

    if (parts.length < 3 || parts.some(Number.isNaN)) {
        return null;
    }

    const date = new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
    );

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
};

export const isRecent = dateObj => {
    if (!dateObj) return false;

    const diffDays =
        (Date.now() - dateObj.getTime()) / 86400000;

    if (diffDays >= 0 && diffDays <= NEW_WITHIN_DAYS) {
        return true;
    }

    return false;
};

export const extractYouTubeId = url => {
    if (!url) return null;

    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );

    if (match) {
        return match[1];
    }

    return null;
};

export const matchesSearch = (item, query) => {
    if (!query) return true;

    const haystack = [
        item.title,
        item.subject,
        item.chapter,
        item.type,
        item.desc,
        (item.tags || []).join(" ")
    ]
        .join(" ")
        .toLowerCase();

    return haystack.includes(query.toLowerCase());
};

export const getFilteredResources = () => {
    return state.resources.filter(item => {
        if (state.subject && item.subject !== state.subject) return false;
        if (state.type && item.type !== state.type) return false;
        if (!matchesSearch(item, state.search)) return false;

        if (state.subject === "Computer" && state.examFilter && state.examFilter !== "All") {
            const exam = (item.exam || "").toUpperCase();
            const filter = state.examFilter.toUpperCase();

            if (exam !== filter && exam !== "ALL") {
                return false;
            }
        }

        if (state.subject === "Mathematics" && state.type === "PYQ" && state.examFilter && state.examFilter !== "All") {
            if ((item.exam || "") !== state.examFilter) return false;
        }

        return true;
    });
};