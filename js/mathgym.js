"use strict";

import {
    elMathgymGrid,
    elMathgymEmpty
} from "./dom.js";

import {
    escapeHtml,
    actionLabel
} from "./utils.js";

import { getCardUrl } from "./cards-shared.js";

const MATHGYM_FILE = "data/mathgym/mathgym.json";

let mathgymCache = null;

const fetchJsonSafe = (path) => {
    return fetch(path)
        .then(response => {
            if (!response.ok) {
                return [];
            }

            return response.json();
        })
        .catch(() => []);
};

const loadMathgymItems = () => {
    if (mathgymCache) {
        return Promise.resolve(mathgymCache);
    }

    return fetchJsonSafe(MATHGYM_FILE).then(items => {
        mathgymCache = Array.isArray(items) ? items : [];

        return mathgymCache;
    });
};

/* =========================================================
   GRAPH WATERMARK — engraved top-right background decoration
   ========================================================= */

const GYM_GRAPH_MARK =
    '<svg viewBox="0 0 120 92" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M2 88h116M2 2v86" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M2 66 26 66M2 44 26 44M2 22 26 22" stroke="currentColor" stroke-width="1" stroke-dasharray="2 4" opacity="0.6"/>' +
    '<path d="M8 74C 28 20, 46 84, 66 34 S 104 10, 116 26" ' +
    'stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/>' +
    '<circle cx="46" cy="63" r="3.2" fill="currentColor"/>' +
    '<circle cx="80" cy="26" r="3.2" fill="currentColor"/>' +
    '<circle cx="116" cy="26" r="3.2" fill="currentColor"/>' +
    '</svg>';

/* =========================================================
   CARD BUILDER
   ========================================================= */

/* per-row accent rotation, desktop only (mobile forces pink via CSS) */
const GYM_ACCENTS = ["--gym-violet", "--gym-pink", "--gym-sky", "--gym-orange"];

const buildMathgymCard = (item, index) => {
    const hasLink = Boolean(item.url) && item.url !== "#";

    const card = document.createElement("div");

    card.className = "gym-card";

    const rowIndex = Math.floor(index / 4);
    const accentVar = GYM_ACCENTS[rowIndex % 4];

    card.style.setProperty("--gym-accent", "var(" + accentVar + ")");

    const indexLabel = String(index + 1).padStart(2, "0");

    const hasCount =
        item.qs_cnt !== undefined &&
        item.qs_cnt !== null &&
        item.qs_cnt !== "";

    const countLabel = hasCount
        ? escapeHtml(String(item.qs_cnt)) + (Number(item.qs_cnt) === 1 ? " Question" : " Questions")
        : "";

    card.innerHTML =
        '<span class="gym-card-num" aria-hidden="true">' + indexLabel + '</span>' +

        '<div class="gym-card-graph" aria-hidden="true">' + GYM_GRAPH_MARK + '</div>' +

        '<div class="gym-card-body">' +
        '<span class="gym-card-kicker">Practice Set</span>' +
        '<h3 class="gym-card-title"></h3>' +

        (
            hasCount
                ? '<span class="gym-card-count">' +
                '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
                '<path d="M3 4.5h10M3 8h10M3 11.5h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
                '</svg>' +
                countLabel +
                '</span>'
                : ""
        ) +

        '</div>' +

        '<div class="gym-card-foot"></div>';

    card.querySelector(".gym-card-title").textContent = item.title || "Untitled Set";

    const foot = card.querySelector(".gym-card-foot");
    const cta = document.createElement(hasLink ? "a" : "button");

    cta.className = "gym-card-cta";

    if (hasLink) {
        let cardUrl = getCardUrl(item);

        if (cardUrl !== "#") {
            cardUrl = escapeHtml(cardUrl);
        }

        cta.href = cardUrl;
        cta.target = "_blank";
        cta.rel = "noopener noreferrer";
    } else {
        cta.type = "button";
        cta.disabled = true;
    }

    cta.innerHTML =
        '<span class="gym-card-cta-text">' + escapeHtml(actionLabel(item)) + '</span>' +
        '<span class="gym-card-cta-arrow" aria-hidden="true">' +
        '<svg viewBox="0 0 16 16" fill="none"><path d="M3.5 8h9M8.2 3.8 12.5 8l-4.3 4.2" ' +
        'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</span>';

    foot.appendChild(cta);

    return card;
};

/* =========================================================
   RENDER
   ========================================================= */

export const renderMathgym = () => {
    elMathgymGrid.hidden = false;
    elMathgymGrid.innerHTML =
        '<p class="empty-sub" style="padding:6px 2px;">Loading MathGym…</p>';

    if (elMathgymEmpty) {
        elMathgymEmpty.hidden = true;
    }

    loadMathgymItems().then(items => {
        elMathgymGrid.innerHTML = "";

        if (items.length === 0) {
            elMathgymGrid.hidden = true;

            if (elMathgymEmpty) {
                elMathgymEmpty.hidden = false;
            }

            return;
        }

        elMathgymGrid.hidden = false;

        if (elMathgymEmpty) {
            elMathgymEmpty.hidden = true;
        }

        const fragment = document.createDocumentFragment();

        items.forEach((item, index) => {
            fragment.appendChild(buildMathgymCard(item, index));
        });

        elMathgymGrid.appendChild(fragment);
    });
};