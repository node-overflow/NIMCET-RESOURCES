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

    const oldBar = document.getElementById("examFilterBar");
    if (oldBar) oldBar.remove();

    const allPill = document.createElement("button");
    allPill.className = "pill";
    allPill.type = "button";
    allPill.textContent = "All";
    allPill.dataset.active = state.type ? "false" : "true";
    allPill.addEventListener("click", () => {
        state.type = null;
        state.examFilter = null;
        renderResources();
    });
    elFilterPills.appendChild(allPill);

    TYPES.forEach(type => {
        const pill = document.createElement("button");
        pill.className = "pill";
        pill.type = "button";
        pill.textContent = type.label;
        pill.dataset.active = state.type === type.key ? "true" : "false";
        pill.addEventListener("click", () => {
            state.type = state.type === type.key ? null : type.key;
            state.examFilter = null;
            renderResources();
        });
        elFilterPills.appendChild(pill);
    });

    if (state.subject === "Computer") {

        if (state.examFilter === null) {
            state.examFilter = "All";
        }

        const bar = document.createElement("div");
        bar.id = "examFilterBar";
        bar.className = "exam-filter-bar";

        const label = document.createElement("span");
        label.className = "exam-filter-label";
        label.textContent = "Select Exam";
        bar.appendChild(label);

        ["All", "NIMCET", "CUET PG"].forEach(name => {
            const btn = document.createElement("button");
            btn.className = "exam-filter-btn";
            btn.type = "button";
            btn.textContent = name;

            if (state.examFilter === name) {
                btn.dataset.active = "true";
            }

            btn.addEventListener("click", () => {
                state.examFilter = name;
                renderResources();
            });

            bar.appendChild(btn);
        });

        const toolbar = document.querySelector(".toolbar");
        if (toolbar) {
            toolbar.insertAdjacentElement("afterend", bar);
        }
    }
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