"use strict";

import { escapeHtml } from "./utils.js";

import { buildCoverCard, yearBadgeHtml } from "./cards-shared.js";

/* =========================================================
   NOTES CARD
   ========================================================= */

export const buildNotesCard = (item) => buildCoverCard(item, {
    className: "notes-card",
    tcVar: "var(--type-notes)",
    badge: item.owner
        ? '<span class="cover-chip">' + escapeHtml(item.owner) + "</span>"
        : "",
    headline: "",
    metaLabel: "Chapter Notes"
});


/* =========================================================
   FORMULA CARD
   ========================================================= */

export const buildFormulaCard = (item) => buildCoverCard(item, {
    className: "formula-card",
    tcVar: "var(--type-formula)",
    badge: "",
    headline: "",
    metaLabel: "Formula Sheet"
});


/* =========================================================
   PRACTICE CARD
   ========================================================= */

export const buildPracticeCard = (item) => buildCoverCard(item, {
    className: "practice-card",
    tcVar: "var(--type-practice)",
    badge: item.owner
        ? '<span class="cover-chip">' + escapeHtml(item.owner) + "</span>"
        : "",
    headline: "",
    metaLabel: "Practice Set"
});


/* =========================================================
   PYQ (SUBJECT-WISE RESOURCE) CARD
   ========================================================= */

export const buildPyqTypeCard = (item) => buildCoverCard(item, {
    className: "pyqtype-card",
    tcVar: "var(--type-pyq)",
    badge: yearBadgeHtml(item),
    topLabel: (Array.isArray(item.exam) ? item.exam.join(" / ") : item.exam) || item.subject || "",
    headline: "",
    metaLabel: "Previous Year Questions",
    hideExamTag: true
});


/* =========================================================
   DPP CARD (cover style, matches practice cards)
   ========================================================= */

const dppQsBadgeHtml = (item) => {
    if (!item.qc) return "";

    return (
        '<span class="cover-chip dpp-qs-chip">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="10"></circle>' +
        '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>' +
        '<path d="M12 17h.01"></path>' +
        '</svg>' +
        '<span>' + escapeHtml(String(item.qc)) + ' Qs</span>' +
        '</span>'
    );
};

export const buildDppCard = (item, context = {}) => {
    const subjectName = context.subjectName || "";
    const chapterName = context.chapterName || "";

    const enrichedItem = {
        ...item,
        subject: subjectName,
        chapter: chapterName
    };

    return buildCoverCard(enrichedItem, {
        className: "dpp-cover-card",
        tcVar: "var(--type-practice)",
        badge: dppQsBadgeHtml(item),
        topLabel: chapterName || subjectName,
        headline: "",
        metaLabel: "Daily Practice Problem"
    });
};