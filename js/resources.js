"use strict";

import { TYPES } from "./config.js";

import {
    elFilterPills,
    elResourcesHeading,
    elResourcesCount,
    elResourcesGrid,
    elEmptyState
} from "./dom.js";

import { state } from "./state.js";

import {
    typeLabelPlural,
    getFilteredResources
} from "./utils.js";

import { renderGrid } from "./cards.js";

export const renderFilterPills = () => {
    elFilterPills.innerHTML = "";

    const allPill = document.createElement("button");

    allPill.className = "pill";
    allPill.type = "button";
    allPill.textContent = "All";

    if (state.type) {
        allPill.dataset.active = "false";
    } else {
        allPill.dataset.active = "true";
    }

    allPill.addEventListener("click", () => {
        state.type = null;
        renderResources();
    });

    elFilterPills.appendChild(allPill);

    TYPES.forEach(type => {
        const pill = document.createElement("button");

        pill.className = "pill";
        pill.type = "button";
        pill.textContent = type.label;

        if (state.type === type.key) {
            pill.dataset.active = "true";
        } else {
            pill.dataset.active = "false";
        }

        pill.addEventListener("click", () => {
            if (state.type === type.key) {
                state.type = null;
            } else {
                state.type = type.key;
            }

            renderResources();
        });

        elFilterPills.appendChild(pill);
    });
};

export const renderHeading = () => {
    let heading = "All Resources";

    if (state.subject) {
        heading = state.subject;
    } else if (state.type) {
        heading = typeLabelPlural(state.type);
    }

    elResourcesHeading.textContent = heading;
};

export const renderResources = () => {
    renderHeading();
    renderFilterPills();

    const results = getFilteredResources();

    let resourceLabel = " resources";

    if (results.length === 1) {
        resourceLabel = " resource";
    }

    elResourcesCount.textContent =
        results.length +
        resourceLabel;

    if (results.length === 0) {
        elResourcesGrid.innerHTML = "";
        elResourcesGrid.hidden = true;
        elEmptyState.hidden = false;
        return;
    }

    elResourcesGrid.hidden = false;
    elEmptyState.hidden = true;

    renderGrid(
        elResourcesGrid,
        results
    );
};