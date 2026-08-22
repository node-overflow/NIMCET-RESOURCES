"use strict";

import {
    UPDATE_CATEGORIES,
    UPDATE_CATEGORY_VAR,
    MONTH_SHORT
} from "./config.js";

import {
    elUpdatesBadge,
    elUpdateFilters,
    elUpdatesTimeline,
    elUpdatesEmpty
} from "./dom.js";

import { state } from "./state.js";

import {
    parseDateStr,
    isRecent,
    escapeHtml
} from "./utils.js";

export const updateUnreadBadge = () => {
    if (!elUpdatesBadge) return;

    const count = state.announcements.filter(
        announcement =>
            isRecent(
                parseDateStr(
                    announcement.date
                )
            )
    ).length;

    if (count > 0) {
        elUpdatesBadge.hidden = false;

        if (count > 9) {
            elUpdatesBadge.textContent = "9+";
        } else {
            elUpdatesBadge.textContent = String(count);
        }
    } else {
        elUpdatesBadge.hidden = true;
        elUpdatesBadge.textContent = "";
    }
};

export const renderUpdateFilters = () => {
    elUpdateFilters.innerHTML = "";

    const allChip = document.createElement("button");

    allChip.className = "chip";
    allChip.type = "button";
    allChip.textContent = "All";

    if (state.updateCategory) {
        allChip.dataset.active = "false";
    } else {
        allChip.dataset.active = "true";
    }

    allChip.addEventListener("click", () => {
        state.updateCategory = null;
        renderUpdates();
    });

    elUpdateFilters.appendChild(allChip);

    UPDATE_CATEGORIES.forEach(category => {
        const has = state.announcements.some(
            announcement =>
                announcement.category ===
                category.key
        );

        if (!has) return;

        const chip = document.createElement("button");

        chip.className = "chip";
        chip.type = "button";
        chip.textContent = category.label;

        if (state.updateCategory === category.key) {
            chip.dataset.active = "true";
        } else {
            chip.dataset.active = "false";
        }

        chip.addEventListener("click", () => {
            if (state.updateCategory === category.key) {
                state.updateCategory = null;
            } else {
                state.updateCategory = category.key;
            }

            renderUpdates();
        });

        elUpdateFilters.appendChild(chip);
    });
};

const buildTimelineItem = item => {
    const dateObj = parseDateStr(item.date);

    const li = document.createElement("div");

    li.className = "timeline-item";

    const dot = document.createElement("span");

    dot.className = "timeline-dot";

    if (item.category && UPDATE_CATEGORY_VAR[item.category]) {
        dot.style.borderColor =
            "var(" +
            UPDATE_CATEGORY_VAR[item.category] +
            ")";
    }

    li.appendChild(dot);

    const card = document.createElement("div");

    card.className = "timeline-card";
    card.dataset.expanded = "false";

    const dateBox = document.createElement("div");

    dateBox.className = "timeline-date";

    let day = "—";
    let month = "";

    if (dateObj) {
        day = dateObj.getDate();
        month = MONTH_SHORT[dateObj.getMonth()];
    }

    dateBox.innerHTML =
        '<span class="tl-day">' +
        day +
        '</span>' +

        '<span class="tl-month">' +
        month +
        '</span>';

    card.appendChild(dateBox);

    const body = document.createElement("div");

    body.className = "timeline-body";

    const top = document.createElement("div");

    top.className = "timeline-top";

    if (item.category) {
        const tag = document.createElement("span");

        tag.className = "update-tag";

        const cssVar = UPDATE_CATEGORY_VAR[item.category];

        if (cssVar) {
            tag.style.color = "var(" + cssVar + ")";
            tag.style.borderColor = "var(" + cssVar + ")";
            tag.style.background =
                "color-mix(in srgb, var(" +
                cssVar +
                ") 12%, transparent)";
        }

        tag.textContent = item.category;

        top.appendChild(tag);
    }

    if (isRecent(dateObj)) {
        const badge = document.createElement("span");

        badge.className = "update-new";
        badge.textContent = "New";

        top.appendChild(badge);
    }

    body.appendChild(top);

    const title = document.createElement("h3");

    title.className = "timeline-title";
    title.textContent = item.title || "";

    body.appendChild(title);

    if (item.desc) {
        const desc = document.createElement("p");

        desc.className = "timeline-desc";
        desc.textContent = item.desc;

        body.appendChild(desc);

        const foot = document.createElement("div");

        foot.className = "timeline-foot";

        const toggle = document.createElement("span");

        toggle.className = "timeline-toggle";
        toggle.textContent = "Read more";

        foot.appendChild(toggle);

        if (item.url && item.url !== "#") {
            const link = document.createElement("a");

            link.className = "timeline-link";

            link.href = item.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            link.textContent = "View source →";

            link.addEventListener(
                "click",
                event => event.stopPropagation()
            );

            foot.appendChild(link);
        }

        body.appendChild(foot);

        card.addEventListener("click", () => {
            const expanded =
                card.dataset.expanded === "true";

            if (expanded) {
                card.dataset.expanded = "false";
                toggle.textContent = "Read more";
            } else {
                card.dataset.expanded = "true";
                toggle.textContent = "Show less";
            }
        });
    } else if (item.url && item.url !== "#") {
        const foot = document.createElement("div");

        foot.className = "timeline-foot";

        const link = document.createElement("a");

        link.className = "timeline-link";

        link.href = item.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        link.textContent = "View source →";

        foot.appendChild(link);
        body.appendChild(foot);
    }

    card.appendChild(body);
    li.appendChild(card);

    return li;
};

export const renderUpdates = () => {
    renderUpdateFilters();

    const results = state.announcements
        .filter(
            announcement =>
                !state.updateCategory ||
                announcement.category ===
                state.updateCategory
        )
        .slice()
        .sort((a, b) => {
            const dateA = parseDateStr(a.date);
            const dateB = parseDateStr(b.date);

            let timeA = 0;
            let timeB = 0;

            if (dateA) {
                timeA = dateA.getTime();
            }

            if (dateB) {
                timeB = dateB.getTime();
            }

            return timeB - timeA;
        });

    elUpdatesTimeline.innerHTML = "";

    if (results.length === 0) {
        elUpdatesTimeline.hidden = true;
        elUpdatesEmpty.hidden = false;
        return;
    }

    elUpdatesTimeline.hidden = false;
    elUpdatesEmpty.hidden = true;

    const fragment = document.createDocumentFragment();

    results.forEach(item => {
        fragment.appendChild(
            buildTimelineItem(item)
        );
    });

    elUpdatesTimeline.appendChild(fragment);
};