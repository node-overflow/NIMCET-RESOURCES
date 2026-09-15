"use strict";

import { NEW_WITHIN_DAYS, TYPES, MATH_CHAPTER_KEYWORDS } from "./config.js";
import { state } from "./state.js";

export const escapeHtml = str => {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
};

export const TYPE_CHIP_ICONS = {
    Book: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    PYQ: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,
    Notes: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3z"/><polyline points="14 3 14 9 20 9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>`,
    Video: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
    Practice: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    Formula: `<svg class="chip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="2" width="12" height="16" rx="2"/><path d="M4 6v12a2 2 0 0 0 2 2h10"/></svg>`
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

export const subjectSymbolHtml = subject => {
    if (subject.symbolMobile) {
        return (
            '<span class="sym-desktop-only">' +
            escapeHtml(subject.symbol) +
            '</span>' +
            '<span class="sym-mobile-only">' +
            escapeHtml(subject.symbolMobile) +
            '</span>'
        );
    }

    return escapeHtml(subject.symbol);
};

export const deriveMathChapter = title => {
    if (!title) return null;

    const lower = String(title).toLowerCase();

    const match = MATH_CHAPTER_KEYWORDS.find(entry =>
        entry.keywords.some(keyword => lower.includes(keyword))
    );

    return match ? match.chapter : null;
};

export const getMathChapterRank = title => {
    const chapter = deriveMathChapter(title);

    if (!chapter) return 999;

    const entry = MATH_CHAPTER_KEYWORDS.find(item => item.chapter === chapter);

    return entry && typeof entry.order === "number" ? entry.order : 999;
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

export const buildSearchIndex = item => {
    return [
        item.title,
        item.subject,
        item.chapter,
        item.type,
        item.desc,
        (item.tags || []).join(" ")
    ]
        .join(" ")
        .toLowerCase();
};

export const matchesSearch = (item, query) => {
    if (!query) return true;

    const haystack = item._searchIndex || buildSearchIndex(item);

    return haystack.includes(query.toLowerCase());
};

export const getFilteredResources = () => {
    return state.resources.filter(item => {
        if (state.subject && item.subject !== state.subject) return false;
        if (state.type && item.type !== state.type) return false;
        if (!matchesSearch(item, state.search)) return false;

        if (state.subject === "Computer" && state.examFilter && state.examFilter !== "All") {
            const exams = (Array.isArray(item.exam) ? item.exam : [item.exam])
                .map(e => (e || "").toUpperCase());
            const filter = state.examFilter.toUpperCase();

            if (!exams.includes(filter) && !exams.includes("ALL")) {
                return false;
            }
        }

        const pyqExamSubjects = [
            "Mathematics",
            "English",
            "Logical Reasoning",
            "Quantitative Aptitude"
        ];

        if (pyqExamSubjects.includes(state.subject) && state.type === "PYQ" && state.examFilter && state.examFilter !== "All") {
            const exams = Array.isArray(item.exam) ? item.exam : [item.exam];
            if (!exams.includes(state.examFilter)) return false;
        }

        if (state.subject === "Mathematics" && state.type === "Practice") {
            if (state.mathOwnerFilter && state.mathOwnerFilter !== "All") {
                if (item.owner !== state.mathOwnerFilter) return false;
            }

            if (state.mathChapterFilter && state.mathChapterFilter !== "All") {
                if (deriveMathChapter(item.title) !== state.mathChapterFilter) return false;
            }
        }

        return true;
    });
};
