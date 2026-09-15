"use strict";

import {
    SUBJECTS,
    TYPES,
    FAQS_FILE,
    TELEGRAM_URL
} from "./config.js";

import {
    elSubjectGrid,
    elTypeChips,
    elFeaturedGrid,
    elHeroStats,
    elHeroBrowseBtn,
    elHeroPyqBtn,
    elFaqCategories,
    elFaqList,
    elHomeUpdatesPreview,
    elHomeUpdatesBtn,
    elCommunityBtn
} from "./dom.js";

import { state } from "./state.js";

import {
    countBySubject,
    escapeHtml,
    parseDateStr,
    subjectSymbolHtml,
    TYPE_CHIP_ICONS
} from "./utils.js";

import { renderGrid } from "./cards.js";

import { computeDppTotal } from "./dpp.js";

import { buildTimelineItem } from "./updates.js";

const STAT_ICONS = {
    materials: `<svg class="hero-stat-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    pyq: `<svg class="hero-stat-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,
    dpp: `<svg class="hero-stat-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    video: `<svg class="hero-stat-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
    book: `<svg class="hero-stat-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8"/><path d="M8 11h6"/></svg>`,
    practice: `<svg class="hero-stat-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/></svg>`
};

const buildStat = (num, label, iconKey) => {
    const stat = document.createElement("div");

    stat.className = "hero-stat";

    const iconHtml = STAT_ICONS[iconKey] || "";

    stat.innerHTML =
        iconHtml +
        '<div class="hero-stat-text">' +
        '<div class="hero-stat-num"></div>' +
        '<div class="hero-stat-label"></div>' +
        '</div>';

    stat.querySelector(".hero-stat-num").textContent = num;
    stat.querySelector(".hero-stat-label").textContent = label;

    return stat;
};

const animateCount = (element, target) => {
    const duration = Math.min(
        3000,
        Math.max(1800, target * 15)
    );

    const start = performance.now();

    const update = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * eased);

        element.textContent = current + "+";

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target + "+";
        }
    };

    requestAnimationFrame(update);
};

let heroStatsAnimated = false;

const floorToTens = num => Math.floor(num / 10) * 10;

const renderHeroStats = () => {
    if (!elHeroStats || heroStatsAnimated) return;

    heroStatsAnimated = true;

    elHeroStats.innerHTML = "";

    const fragment = document.createDocumentFragment();

    const resourceStat = buildStat("0+", "Study Materials", "materials");
    const pyqStat = buildStat("0+", "PYQ Papers", "pyq");
    const dppStat = buildStat("0+", "DPPs", "dpp");
    const videoStat = buildStat("0+", "Videos", "video");
    const bookStat = buildStat("0+", "Books", "book");
    const practiceStat = buildStat("0+", "Practice Sheets", "practice");

    fragment.appendChild(resourceStat);
    fragment.appendChild(pyqStat);
    fragment.appendChild(dppStat);
    fragment.appendChild(videoStat);
    fragment.appendChild(bookStat);
    fragment.appendChild(practiceStat);

    elHeroStats.appendChild(fragment);

    const resourceNum = resourceStat.querySelector(".hero-stat-num");
    const pyqNum = pyqStat.querySelector(".hero-stat-num");
    const dppNum = dppStat.querySelector(".hero-stat-num");
    const videoNum = videoStat.querySelector(".hero-stat-num");
    const bookNum = bookStat.querySelector(".hero-stat-num");
    const practiceNum = practiceStat.querySelector(".hero-stat-num");

    const videoTotal = state.resources.filter(
        resource => resource.type === "Video"
    ).length;

    const bookTotal = state.resources.filter(
        resource => resource.type === "Book"
    ).length;

    const practiceTotal = state.resources.filter(
        resource => resource.type === "Practice"
    ).length;

    animateCount(videoNum, floorToTens(videoTotal));
    animateCount(bookNum, floorToTens(bookTotal));
    animateCount(practiceNum, floorToTens(practiceTotal));

    animateCount(pyqNum, floorToTens(state.pyqs.length));

    computeDppTotal().then(total => {
        if (!resourceNum || !dppNum) return;

        if (total > 0) {
            animateCount(dppNum, floorToTens(total));

            const materialTotal =
                state.resources.length +
                state.pyqs.length +
                total;

            animateCount(resourceNum, floorToTens(materialTotal));
        } else {
            dppNum.textContent = "Soon";

            const materialTotal =
                state.resources.length +
                state.pyqs.length;

            animateCount(resourceNum, floorToTens(materialTotal));
        }
    });
};

let faqCategoriesCache = null;
let activeFaqCategory = null;

const loadFaqCategories = async () => {
    if (faqCategoriesCache) return faqCategoriesCache;

    try {
        const response = await fetch(FAQS_FILE);

        faqCategoriesCache = await response.json();
    } catch (err) {
        faqCategoriesCache = [];
    }

    return faqCategoriesCache;
};

const renderFaqQuestions = (faqs) => {
    if (!elFaqList) return;

    elFaqList.innerHTML = "";

    const fragment = document.createDocumentFragment();

    faqs.forEach(faq => {
        const item = document.createElement("div");

        item.className = "faq-item";
        item.dataset.open = "false";

        item.innerHTML =
            '<button class="faq-question" type="button" aria-expanded="false">' +
            '<span></span>' +
            '<span class="faq-icon">' +
            '<svg width="12" height="12" viewBox="0 0 12 12" fill="none">' +
            '<path d="M6 1.2V10.8M1.2 6H10.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
            '</svg>' +
            '</span>' +
            '</button>' +
            '<div class="faq-answer-wrap">' +
            '<div class="faq-answer-inner">' +
            '<p class="faq-answer"></p>' +
            '</div>' +
            '</div>';

        item.querySelector(".faq-question > span").textContent = faq.q;
        item.querySelector(".faq-answer").textContent = faq.a;

        const button = item.querySelector(".faq-question");

        button.addEventListener("click", () => {
            const isOpen = item.dataset.open === "true";

            elFaqList.querySelectorAll(".faq-item").forEach(other => {
                other.dataset.open = "false";
                other
                    .querySelector(".faq-question")
                    .setAttribute("aria-expanded", "false");
            });

            if (!isOpen) {
                item.dataset.open = "true";
                button.setAttribute("aria-expanded", "true");
            }
        });

        fragment.appendChild(item);
    });

    elFaqList.appendChild(fragment);
};

const renderFaqCategoryTabs = (categories) => {
    if (!elFaqCategories) return;

    elFaqCategories.innerHTML = "";

    const fragment = document.createDocumentFragment();

    categories.forEach(category => {
        const button = document.createElement("button");

        button.className = "faq-cat-btn";
        button.type = "button";
        button.textContent = category.label;
        button.dataset.active =
            category.key === activeFaqCategory
                ? "true"
                : "false";

        button.addEventListener("click", () => {
            if (activeFaqCategory === category.key) return;

            activeFaqCategory = category.key;

            elFaqCategories
                .querySelectorAll(".faq-cat-btn")
                .forEach(other => {
                    other.dataset.active = "false";
                });

            button.dataset.active = "true";

            renderFaqQuestions(category.faqs);
        });

        fragment.appendChild(button);
    });

    elFaqCategories.appendChild(fragment);
};

const renderFaqs = async () => {
    if (!elFaqCategories && !elFaqList) return;

    const categories = await loadFaqCategories();

    if (!categories.length) return;

    if (
        !activeFaqCategory ||
        !categories.some(
            category => category.key === activeFaqCategory
        )
    ) {
        activeFaqCategory = categories[0].key;
    }

    renderFaqCategoryTabs(categories);

    const active = categories.find(
        category => category.key === activeFaqCategory
    );

    renderFaqQuestions(active ? active.faqs : []);
};

const renderHomeUpdatesPreview = (onUpdatesClick) => {
    if (!elHomeUpdatesPreview) return;

    if (elHomeUpdatesBtn && !elHomeUpdatesBtn.dataset.wired) {
        elHomeUpdatesBtn.dataset.wired = "true";

        elHomeUpdatesBtn.addEventListener(
            "click",
            onUpdatesClick
        );
    }

    const results = state.announcements
        .slice()
        .sort((a, b) => {
            const dateA = parseDateStr(a.date);
            const dateB = parseDateStr(b.date);

            const timeA = dateA ? dateA.getTime() : 0;
            const timeB = dateB ? dateB.getTime() : 0;

            return timeB - timeA;
        })
        .slice(0, 3);

    elHomeUpdatesPreview.innerHTML = "";

    if (results.length === 0) {
        elHomeUpdatesPreview.innerHTML =
            '<p class="empty-sub" style="padding:6px 2px;">' +
            'No updates yet — check back soon.' +
            '</p>';

        return;
    }

    const fragment = document.createDocumentFragment();

    results.forEach(item => {
        fragment.appendChild(
            buildTimelineItem(item)
        );
    });

    elHomeUpdatesPreview.appendChild(fragment);
};

export const renderHome = (
    onSubjectClick,
    onTypeClick,
    onBrowseAll,
    onPyqsHome,
    onUpdatesClick
) => {
    renderHeroStats();

    if (elHeroBrowseBtn && !elHeroBrowseBtn.dataset.wired) {
        elHeroBrowseBtn.dataset.wired = "true";

        elHeroBrowseBtn.addEventListener(
            "click",
            onBrowseAll
        );
    }

    if (elHeroPyqBtn && !elHeroPyqBtn.dataset.wired) {
        elHeroPyqBtn.dataset.wired = "true";

        elHeroPyqBtn.addEventListener(
            "click",
            onPyqsHome
        );
    }

    if (elCommunityBtn) {
        elCommunityBtn.href = TELEGRAM_URL;
    }

    renderHomeUpdatesPreview(onUpdatesClick);

    renderFaqs();

    elSubjectGrid.innerHTML = "";

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

            '<span class="subject-count">' +
            countBySubject(subject.name) +
            ' resources' +
            '</span>';

        button.addEventListener("click", () => {
            onSubjectClick(subject.name);
        });

        elSubjectGrid.appendChild(button);
    });

    elTypeChips.innerHTML = "";

    TYPES.forEach(type => {
        const chip = document.createElement("button");

        chip.className = "chip";
        chip.type = "button";
        chip.innerHTML =
            (TYPE_CHIP_ICONS[type.key] || "") +
            "<span>" +
            escapeHtml(type.label) +
            "</span>";

        chip.addEventListener("click", () => {
            onTypeClick(type.key);
        });

        elTypeChips.appendChild(chip);
    });

    const featured = state.resources.filter(
        resource => resource.featured
    );

    renderGrid(
        elFeaturedGrid,
        featured
    );
};
