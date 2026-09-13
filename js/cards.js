"use strict";

import { RESOURCE_ORDER } from "./config.js";

import { clearActiveVideoIfInside, buildVideoCard } from "./cards-video.js";
import { buildBookCard } from "./cards-book.js";

import {
    buildNotesCard,
    buildFormulaCard,
    buildPracticeCard,
    buildPyqTypeCard,
    buildDppCard
} from "./cards-types.js";

import { renderPyqCards } from "./cards-pyq.js";

export { renderPyqCards };


/* =========================================================
   NORMAL RESOURCE CARD DISPATCH
   ========================================================= */

export const buildCard = (item) => {
    switch (item.type) {
        case "Video":
            return buildVideoCard(item);

        case "Book":
            return buildBookCard(item);

        case "Formula":
            return buildFormulaCard(item);

        case "Practice":
            return buildPracticeCard(item);

        case "PYQ":
            return buildPyqTypeCard(item);

        case "Notes":
        default:
            return buildNotesCard(item);
    }
};


/* =========================================================
   RESOURCE GRID
   ========================================================= */

export const renderGrid = (container, items) => {

    clearActiveVideoIfInside(container);

    container.innerHTML = "";

    const fragment =
        document.createDocumentFragment();

    [...items]
        .sort(
            (a, b) => {
                if (a.subject === "Mathematics" && b.subject === "Mathematics") {
                    return 0;
                }

                return (RESOURCE_ORDER[a.type] || 99) -
                    (RESOURCE_ORDER[b.type] || 99);
            }
        )
        .forEach(item => {

            fragment.appendChild(
                buildCard(item)
            );

        });

    container.appendChild(fragment);
};


/* =========================================================
   DPP CARDS
   ========================================================= */

export const renderDppCards = (container, items, context = {}) => {

    container.innerHTML = "";

    const fragment =
        document.createDocumentFragment();

    items.forEach(item => {
        fragment.appendChild(
            buildDppCard(item, context)
        );
    });

    container.appendChild(fragment);
};