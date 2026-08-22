"use strict";

import { MOCK_TYPES } from "./config.js";

import {
    elMocksGrid,
    elMocksDetailHeading
} from "./dom.js";

import { escapeHtml } from "./utils.js";

export const renderMocksGrid = (onMockClick) => {
    elMocksGrid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    MOCK_TYPES.forEach(mock => {
        const button = document.createElement("button");

        button.className = "subject-card";
        button.type = "button";

        button.innerHTML =
            '<span class="subject-symbol">' +
            escapeHtml(mock.symbol) +
            '</span>' +

            '<span class="subject-name">' +
            escapeHtml(mock.name) +
            '</span>' +

            '<span class="subject-count">Coming soon</span>';

        button.addEventListener("click", () => {
            onMockClick(mock.key, mock.name);
        });

        fragment.appendChild(button);
    });

    elMocksGrid.appendChild(fragment);
};

export const renderMocksDetail = (name) => {
    elMocksDetailHeading.textContent = name || "Mocks";
};