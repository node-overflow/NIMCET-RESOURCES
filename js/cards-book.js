"use strict";

import { escapeHtml, actionLabel } from "./utils.js";

import { getCardUrl } from "./cards-shared.js";

/* =========================================================
   BOOK CARD
   ========================================================= */

export const buildBookCard = (item) => {

    const card = document.createElement("div");

    card.className = "resource-card book-card";

    let cardUrl = getCardUrl(item);

    if (cardUrl !== "#") {
        cardUrl = escapeHtml(cardUrl);
    }

    const imageUrl = item.image
        ? escapeHtml(item.image)
        : "";

    card.innerHTML =

        '<div class="book-cover">' +

        (
            imageUrl
                ? '<img src="' +
                imageUrl +
                '" alt="' +
                escapeHtml(item.title || "Book") +
                '" loading="lazy">'

                : '<div class="book-cover-placeholder"></div>'
        ) +

        "</div>" +

        '<div class="book-card-content">' +

        '<h3 class="card-title"></h3>' +

        '<div class="book-best-for"></div>' +

        '<div class="card-foot">' +

        '<a class="card-action" href="' +
        cardUrl +
        '" target="_blank" rel="noopener noreferrer">' +

        actionLabel(item) +

        ' <span class="arrow">→</span>' +

        "</a>" +

        "</div>" +

        "</div>";

    card.querySelector(".card-title").textContent =
        item.title || "";

    card.querySelector(".book-best-for").textContent =
        item.bestFor || "";

    const action = card.querySelector(".card-action");

    action.addEventListener("click", event => {
        if (!item.url || item.url === "#") {
            event.preventDefault();
        }
    });

    return card;
};