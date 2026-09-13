"use strict";

import {
    escapeHtml,
    actionLabel
} from "./utils.js";

/* =========================================================
   UNIT DETECTION (chapter/title -> topic unit + bg mark)
   ========================================================= */

const UNIT_DEFS = [
    {
        key: "trigonometry", label: "Trigonometry", mark: "sin θ",
        test: /trig|sine|cosine|tangent|identit/i
    },

    {
        key: "calculus", label: "Calculus", mark: "∫dx",
        test: /limit|continuity|differentia|integra|calculus|derivative/i
    },

    {
        key: "coordinate", label: "Coordinate Geometry", mark: "(x,y)",
        test: /coordinate|circle|parabola|ellipse|hyperbola|straight line|conic/i
    },

    {
        key: "vectors", label: "Vectors & 3D", mark: "→v",
        test: /vector|3d geometry|three.?dimensional/i
    },

    {
        key: "probability", label: "Probability & Stats", mark: "P(A)",
        test: /probability|statistic|\bmean\b|median|variance/i
    },

    {
        key: "matrices", label: "Matrices & Determinants", mark: "[M]",
        test: /matri|determinant/i
    },

    {
        key: "algebra", label: "Algebra", mark: "x²",
        test: /quadratic|algebra|complex\s*number|permutation|combination|p\s*(?:&|and|n)\s*c|binomial|sequence|series|progression|\bsets?\b|\brelations?\b|\bfunctions?\b|logarithm|inequalit/i
    }
];

const SUBJECT_FALLBACK = {
    Physics: { key: "physics", label: "Physics", mark: "F=ma" },
    Chemistry: { key: "chemistry", label: "Chemistry", mark: "H₂O" },
    Computer: { key: "computer", label: "Computer", mark: "</>" },
    Mathematics: { key: "mathematics", label: "Mathematics", mark: "∑" },
    English: { key: "english", label: "English", mark: "Aa" },
    Reasoning: { key: "reasoning", label: "Reasoning", mark: "?!" }
};

export const getUnitInfo = (item) => {
    const source = (item.chapter || item.title || "").toString();

    const found = UNIT_DEFS.find(unit => unit.test.test(source));

    if (found) return found;

    return SUBJECT_FALLBACK[item.subject] ||
        { key: "general", label: item.subject || "General", mark: "★" };
};


/* =========================================================
   SHARED CARD HELPERS
   ========================================================= */

export const examTagHtml = (item) => {
    if (item.subject === "Computer" && item.exam) {
        const exams = Array.isArray(item.exam) ? item.exam : [item.exam];

        return exams
            .filter(Boolean)
            .map(exam => '<span class="video-exam-tag">' + escapeHtml(exam) + "</span>")
            .join("");
    }

    return "";
};

export const yearBadgeHtml = (item) => {
    if (!item.year) return "";

    return '<span class="year-badge">' + escapeHtml(String(item.year)) + "</span>";
};

export const cardTopRight = (...parts) => {
    const content = parts.filter(Boolean).join("");

    if (!content) return "";

    return '<span class="card-top-right">' + content + "</span>";
};

export const wireCardAction = (card, item) => {
    const action = card.querySelector(".card-action");

    if (!action) return;

    action.addEventListener("click", event => {
        if (!item.url || item.url === "#") {
            event.preventDefault();
        }
    });
};


/* =========================================================
   CARD URL HANDLER
   ========================================================= */

export const getCardUrl = (item) => {
    if (!item.url || item.url === "#") {
        return "#";
    }

    let url = item.url;

    if (url.includes("github.com/") && url.includes("/blob/")) {
        const match = url.match(
            /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/
        );

        if (match) {
            const [, owner, repo, branch, filePath] = match;

            if (item.cdnjs === true) {
                url = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${filePath}`;
            } else {
                url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
            }
        }
    }

    if (item.reader === true) {
        return (
            "components/pdf-reader/reader.html" +
            "?file=" +
            encodeURIComponent(url) +
            "&title=" +
            encodeURIComponent(item.title || "PDF Reader")
        );
    }

    return url;
};


/* =========================================================
   COVER-STYLE TYPE CARDS (shared builder)
   ========================================================= */

export const buildCoverCard = (item, { className, tcVar, badge, headline, metaLabel, topLabel, hideExamTag }) => {
    const card = document.createElement("div");

    card.className = "resource-card cover-card " + className;
    card.style.setProperty("--tc", tcVar);

    let cardUrl = getCardUrl(item);

    if (cardUrl !== "#") {
        cardUrl = escapeHtml(cardUrl);
    }

    const unit = getUnitInfo(item);

    card.dataset.unit = unit.key;

    card.innerHTML =
        '<div class="cover-top">' +

        '<span class="cover-unit"></span>' +

        cardTopRight(badge || "", hideExamTag ? "" : examTagHtml(item)) +

        "</div>" +

        '<div class="cover-main">' +

        '<span class="cover-bg" data-mark="' + escapeHtml(unit.mark) + '" aria-hidden="true"></span>' +

        '<h3 class="cover-title"></h3>' +

        "</div>" +

        '<div class="cover-bottom">' +

        (headline
            ? '<span class="cover-headline"></span>'
            : "") +

        '<span class="cover-meta"></span>' +

        "</div>" +

        '<div class="card-foot">' +

        '<a class="card-action" href="' +
        cardUrl +
        '" target="_blank" rel="noopener noreferrer">' +

        actionLabel(item) +

        ' <span class="arrow">→</span>' +

        "</a>" +

        "</div>";

    const topText = (topLabel && topLabel.trim()) ? topLabel : unit.label;

    card.querySelector(".cover-unit").textContent = topText;
    card.querySelector(".cover-title").textContent = item.title || "";
    card.querySelector(".cover-meta").textContent = metaLabel || "";

    if (headline) {
        card.querySelector(".cover-headline").textContent = headline;
    }

    wireCardAction(card, item);

    return card;
};