"use strict";

import { escapeHtml, actionLabel } from "./utils.js";

import { getCardUrl } from "./cards-shared.js";

/* =========================================================
   PYQ DETAIL ROW BUILDERS
   ========================================================= */

const detailRow = (iconSvg, text) => {
    if (text == null || text === "") return "";

    return (
        '<div class="pyq-detail">' +
        '<div class="pyq-detail-icon">' +
        iconSvg +
        '</div>' +
        '<span>' + text + '</span>' +
        '</div>'
    );
};

const ICON_QUESTIONS =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="10"></circle>' +
    '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>' +
    '<path d="M12 17h.01"></path>' +
    '</svg>';

const ICON_DURATION =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 6v6l4 2"></path>' +
    '<circle cx="12" cy="12" r="10"></circle>' +
    '</svg>';

const ICON_MARKS =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21.801 10A10 10 0 1 1 17 3.335"></path>' +
    '<path d="m9 11 3 3L22 4"></path>' +
    '</svg>';

const ICON_DATE =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="3" y="4" width="18" height="18" rx="2"></rect>' +
    '<line x1="16" y1="2" x2="16" y2="6"></line>' +
    '<line x1="8" y1="2" x2="8" y2="6"></line>' +
    '<line x1="3" y1="10" x2="21" y2="10"></line>' +
    '</svg>';

const ICON_SHIFT =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="3" y="4" width="18" height="16" rx="2"></rect>' +
    '<path d="M7 8h10"></path>' +
    '<path d="M7 12h4"></path>' +
    '<path d="M7 16h6"></path>' +
    '</svg>';

const buildPyqDetails = (item) => {
    return [
        detailRow(ICON_QUESTIONS, item.questions != null && item.questions !== ""
            ? escapeHtml(String(item.questions)) + " Questions" : ""),

        detailRow(ICON_DURATION, item.duration != null && item.duration !== ""
            ? escapeHtml(String(item.duration)) + " Minutes" : ""),

        detailRow(ICON_MARKS, item.marks != null && item.marks !== ""
            ? escapeHtml(String(item.marks)) + " Marks" : ""),

        detailRow(ICON_DATE, item.date != null && item.date !== ""
            ? escapeHtml(String(item.date)) : ""),

        detailRow(ICON_SHIFT, item.shift != null && item.shift !== ""
            ? escapeHtml(String(item.shift)) : "")
    ].join("");
};


/* =========================================================
   PYQ CARDS (question-paper style)
   ========================================================= */

const buildPyqPaperCard = (item) => {
    const card = document.createElement("div");

    card.className = "pyq-card";
    card.style.setProperty("--tc", "var(--type-pyq)");

    let pyqUrl = getCardUrl(item);

    if (pyqUrl !== "#") {
        pyqUrl = escapeHtml(pyqUrl);
    }

    card.innerHTML =

        '<div class="pyq-card-body">' +

        '<h3 class="pyq-title"></h3>' +

        '<div class="pyq-details">' +
        buildPyqDetails(item) +
        "</div>" +

        '<div class="pyq-card-foot">' +

        '<a class="card-action" href="' +
        pyqUrl +
        '" target="_blank" rel="noopener noreferrer">' +

        actionLabel(item) +

        ' <span class="arrow">→</span>' +

        "</a>" +

        "</div>" +

        "</div>";

    card.querySelector(".pyq-title").textContent =
        item.title || "Question Paper";

    const action = card.querySelector(".card-action");

    action.addEventListener("click", event => {
        if (!item.url || item.url === "#") {
            event.preventDefault();
        }
    });

    return card;
};

export const renderPyqCards = (container, items) => {

    container.innerHTML = "";

    const fragment = document.createDocumentFragment();

    items.forEach(item => {
        fragment.appendChild(
            buildPyqPaperCard(item)
        );
    });

    container.appendChild(fragment);
};