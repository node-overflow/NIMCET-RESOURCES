"use strict";

import {
    SUBJECTS,
    DPP_SUBJECT_SLUGS,
    dppManifestPath,
    dppChapterPath,
    DPP_STATS_FILE
} from "./config.js";

import {
    elDppSubjectGrid,
    elDppSubjectEmpty,
    elDppChapterHeading,
    elDppChapterGrid,
    elDppChapterEmpty,
    elDppHeading,
    elDppCount,
    elDppGrid,
    elDppEmpty
} from "./dom.js";

import { state } from "./state.js";

import { escapeHtml, subjectSymbolHtml } from "./utils.js";

import { renderDppCards } from "./cards.js";

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

export const loadChapters = (subjectName) => {
    if (state.dppChaptersCache[subjectName]) {
        return Promise.resolve(
            state.dppChaptersCache[subjectName]
        );
    }

    const slug = DPP_SUBJECT_SLUGS[subjectName];

    if (!slug) {
        return Promise.resolve([]);
    }

    return fetchJsonSafe(
        dppManifestPath(slug)
    ).then(chapters => {
        const list = Array.isArray(chapters) ? chapters : [];

        state.dppChaptersCache[subjectName] = list;

        return list;
    });
};

export const loadDppItems = (subjectName, chapterKey) => {
    const cacheKey = subjectName + "::" + chapterKey;

    if (state.dppItemsCache[cacheKey]) {
        return Promise.resolve(
            state.dppItemsCache[cacheKey]
        );
    }

    const slug = DPP_SUBJECT_SLUGS[subjectName];

    if (!slug) {
        return Promise.resolve([]);
    }

    return fetchJsonSafe(
        dppChapterPath(slug, chapterKey)
    ).then(items => {
        const list = Array.isArray(items) ? items : [];

        state.dppItemsCache[cacheKey] = list;

        return list;
    });
};

export const computeDppTotal = () => {
    if (state.dppTotalCount != null) {
        return Promise.resolve(state.dppTotalCount);
    }

    return fetchJsonSafe(DPP_STATS_FILE).then(stats => {
        const fastTotal =
            stats && typeof stats.total === "number"
                ? stats.total
                : null;

        if (fastTotal != null) {
            state.dppTotalCount = fastTotal;
            return fastTotal;
        }

        const subjectNames = Object.keys(DPP_SUBJECT_SLUGS);

        return Promise.all(
            subjectNames.map(subjectName =>
                loadChapters(subjectName).then(chapters =>
                    Promise.all(
                        chapters.map(chapter =>
                            loadDppItems(subjectName, chapter.key).then(
                                items => items.length
                            )
                        )
                    ).then(counts => counts.reduce((a, b) => a + b, 0))
                )
            )
        ).then(subjectTotals => {
            const total = subjectTotals.reduce((a, b) => a + b, 0);

            state.dppTotalCount = total;

            return total;
        });
    });
};

export const renderDppSubjectGrid = (onSubjectClick) => {
    elDppSubjectGrid.innerHTML = "";
    elDppSubjectGrid.hidden = false;
    elDppSubjectEmpty.hidden = true;

    const fragment = document.createDocumentFragment();

    SUBJECTS.forEach(subject => {
        const button = document.createElement("button");

        button.className = "subject-card";
        button.type = "button";

        button.innerHTML =
            '<span class="subject-symbol">' +
            subjectSymbolHtml(subject) +
            '</span>' +

            '<span class="subject-name">' +
            escapeHtml(subject.name) +
            '</span>' +

            '<span class="subject-count">Chapter-wise DPPs</span>';

        button.addEventListener("click", () => {
            onSubjectClick(subject.name);
        });

        fragment.appendChild(button);
    });

    elDppSubjectGrid.appendChild(fragment);

    elDppSubjectEmpty.hidden = SUBJECTS.length > 0;
};

export const renderDppChapters = (onChapterClick) => {
    const subjectName = state.dppSubject;

    elDppChapterHeading.textContent = subjectName || "Chapters";

    elDppChapterGrid.hidden = false;
    elDppChapterEmpty.hidden = true;

    elDppChapterGrid.innerHTML =
        '<p class="empty-sub" style="padding:6px 2px;">Loading chapters…</p>';

    loadChapters(subjectName).then(chapters => {
        // Guard against a stale response landing after the user navigated away.
        if (state.dppSubject !== subjectName) {
            return;
        }

        elDppChapterGrid.innerHTML = "";

        if (chapters.length === 0) {
            elDppChapterGrid.hidden = true;
            elDppChapterEmpty.hidden = false;
            return;
        }

        elDppChapterGrid.hidden = false;
        elDppChapterEmpty.hidden = true;

        const fragment = document.createDocumentFragment();

        chapters.forEach(chapter => {
            const chapterKey = chapter.key;

            if (!chapterKey) return;

            const chapterName = chapter.name || chapterKey;

            const button = document.createElement("button");

            button.className = "subject-card";
            button.type = "button";

            button.innerHTML =
                '<span class="subject-symbol">' +
                escapeHtml(chapterName.charAt(0).toUpperCase()) +
                '</span>' +

                '<span class="subject-name">' +
                escapeHtml(chapterName) +
                '</span>' +

                '<span class="subject-count">Loading…</span>';

            button.addEventListener("click", () => {
                onChapterClick(chapterKey, chapterName);
            });

            fragment.appendChild(button);

            loadDppItems(subjectName, chapterKey).then(items => {
                if (state.dppSubject !== subjectName) return;

                const countEl = button.querySelector(".subject-count");

                if (!countEl) return;

                countEl.textContent =
                    items.length +
                    (items.length === 1 ? " DPP" : " DPPs");
            });
        });

        elDppChapterGrid.appendChild(fragment);
    });
};

export const renderDppChapterItems = () => {
    const subjectName = state.dppSubject;
    const chapterKey = state.dppChapterKey;

    elDppHeading.textContent = state.dppChapterName || "Chapter";

    elDppGrid.innerHTML = "";
    elDppGrid.hidden = false;
    elDppEmpty.hidden = true;

    elDppCount.textContent = "Loading…";

    loadDppItems(subjectName, chapterKey).then(items => {
        // Guard against a stale response landing after the user navigated away.
        if (
            state.dppSubject !== subjectName ||
            state.dppChapterKey !== chapterKey
        ) {
            return;
        }

        let label = " DPPs";

        if (items.length === 1) {
            label = " DPP";
        }

        elDppCount.textContent = items.length + label;

        if (items.length === 0) {
            elDppGrid.innerHTML = "";
            elDppGrid.hidden = true;
            elDppEmpty.hidden = false;
            return;
        }

        elDppGrid.hidden = false;
        elDppEmpty.hidden = true;

        renderDppCards(elDppGrid, items);
    });
};