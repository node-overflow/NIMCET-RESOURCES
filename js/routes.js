"use strict";

import { EXAMS } from "./config.js";

/* =========================================================
   SLUG MAPS (kept in sync with config.js's own slug scheme)
   ========================================================= */

export const SUBJECT_SLUG_BY_NAME = {
    "Mathematics": "math",
    "Logical Reasoning": "reasoning",
    "Computer": "computer",
    "Quantitative Aptitude": "quants",
    "English": "english"
};

export const SUBJECT_NAME_BY_SLUG = Object.fromEntries(
    Object.entries(SUBJECT_SLUG_BY_NAME).map(([name, slug]) => [slug, name])
);

export const TYPE_SLUG_BY_KEY = {
    Book: "books",
    PYQ: "pyqs",
    Notes: "notes",
    Video: "videos",
    Practice: "practice",
    Formula: "formulas"
};

export const TYPE_KEY_BY_SLUG = Object.fromEntries(
    Object.entries(TYPE_SLUG_BY_KEY).map(([key, slug]) => [slug, key])
);

const slugify = (value) =>
    encodeURIComponent(String(value || "").trim().toLowerCase().replace(/\s+/g, "-"));

const EXAM_SLUG_BY_KEY = Object.fromEntries(
    EXAMS.map(exam => [exam.key, slugify(exam.key)])
);

const EXAM_KEY_BY_SLUG = Object.fromEntries(
    EXAMS.map(exam => [slugify(exam.key), exam.key])
);

const encSeg = (value) => encodeURIComponent(String(value == null ? "" : value));

/* =========================================================
   STATE -> URL
   ========================================================= */

export const pathForState = (state) => "#" + rawPathForState(state);

const rawPathForState = (state) => {
    switch (state.view) {
        case "home":
            return "/";

        case "resources": {
            if (state.subject && SUBJECT_SLUG_BY_NAME[state.subject]) {
                const subjectSlug = SUBJECT_SLUG_BY_NAME[state.subject];

                if (state.type && TYPE_SLUG_BY_KEY[state.type]) {
                    return `/${subjectSlug}/${TYPE_SLUG_BY_KEY[state.type]}`;
                }

                return `/${subjectSlug}`;
            }

            if (state.type && TYPE_SLUG_BY_KEY[state.type]) {
                return `/resources/type/${TYPE_SLUG_BY_KEY[state.type]}`;
            }

            return "/resources";
        }

        case "updates":
            return "/updates";

        case "pyqs":
            return "/pyqs";

        case "pyqs-exam":
            return `/pyqs/${EXAM_SLUG_BY_KEY[state.examKey] || slugify(state.examKey)}`;

        case "dpps":
            return "/dpps";

        case "dpps-subject":
            return `/dpps/${SUBJECT_SLUG_BY_NAME[state.dppSubject] || slugify(state.dppSubject)}`;

        case "dpps-chapter":
            return `/dpps/${SUBJECT_SLUG_BY_NAME[state.dppSubject] || slugify(state.dppSubject)}/${encSeg(state.dppChapterKey)}`;

        case "mocks":
            return "/mocks";

        case "mocks-detail":
            return `/mocks/${encSeg(state.mockKey)}`;

        case "mathgym":
            return "/mathgym";

        default:
            return "/";
    }
};

/* =========================================================
   URL -> ROUTE
   ========================================================= */

export const routeFromPath = (pathname) => {
    const parts = pathname
        .split("/")
        .filter(Boolean)
        .map(part => decodeURIComponent(part));

    if (parts.length === 0) {
        return { view: "home" };
    }

    const [first, second, third] = parts;

    if (first === "resources") {
        if (second === "type" && third && TYPE_KEY_BY_SLUG[third]) {
            return { view: "resources", subject: null, type: TYPE_KEY_BY_SLUG[third] };
        }

        return { view: "resources", subject: null, type: null };
    }

    if (first === "updates") {
        return { view: "updates" };
    }

    if (first === "pyqs") {
        if (second) {
            const examKey = EXAM_KEY_BY_SLUG[second] || null;

            if (examKey) {
                return { view: "pyqs-exam", examKey };
            }
        }

        return { view: "pyqs" };
    }

    if (first === "dpps") {
        if (second && SUBJECT_NAME_BY_SLUG[second]) {
            const dppSubject = SUBJECT_NAME_BY_SLUG[second];

            if (third) {
                return { view: "dpps-chapter", dppSubject, dppChapterKey: third };
            }

            return { view: "dpps-subject", dppSubject };
        }

        return { view: "dpps" };
    }

    if (first === "mocks") {
        if (second) {
            return { view: "mocks-detail", mockKey: second };
        }

        return { view: "mocks" };
    }

    if (first === "mathgym") {
        return { view: "mathgym" };
    }

    if (SUBJECT_NAME_BY_SLUG[first]) {
        const subject = SUBJECT_NAME_BY_SLUG[first];

        if (second && TYPE_KEY_BY_SLUG[second]) {
            return { view: "resources", subject, type: TYPE_KEY_BY_SLUG[second] };
        }

        return { view: "resources", subject, type: null };
    }

    return { view: "home" };
};