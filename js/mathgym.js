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
   ICON — used as the decorative mark on every set card
   ========================================================= */

const GYM_SPARK_ICON =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M13 2 4.2 13.4h5.6L11 22l8.8-11.4h-5.6L13 2Z" ' +
    'stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" fill="currentColor" fill-opacity="0.14"/>' +
    '</svg>';

/* =========================================================
   CARD BUILDER
   ========================================================= */

const buildMathgymCard = (item, index) => {
    const hasLink = Boolean(item.url) && item.url !== "#";

    const card = document.createElement("div");

    card.className = "gym-card";
    card.style.setProperty("--gym-i", index % 6);

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

        '<div class="gym-card-orb" aria-hidden="true">' + GYM_SPARK_ICON + '</div>' +

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