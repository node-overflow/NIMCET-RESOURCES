"use strict";

import {
    SUBJECTS,
    TYPES,
    FAQS_FILE,
    HOME_FEATURES,
    HOW_IT_WORKS,
    TELEGRAM_URL,
    FOUNDER_NOTE
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
    elFeatureGrid,
    elStepsGrid,
    elHomeUpdatesPreview,
    elHomeUpdatesBtn,
    elCommunityBtn,
    elFinalCtaBrowseBtn,
    elFinalCtaPyqBtn,
    elFounderNote
} from "./dom.js";

import { state } from "./state.js";

import {
    countBySubject,
    escapeHtml,
    parseDateStr
} from "./utils.js";

import { renderGrid } from "./cards.js";

import { computeDppTotal } from "./dpp.js";

import { buildTimelineItem } from "./updates.js";

const buildStat = (num, label) => {
    const stat = document.createElement("div");

    stat.className = "hero-stat";

    stat.innerHTML =
        '<div class="hero-stat-num"></div>' +
        '<div class="hero-stat-label"></div>';

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

    const resourceStat = buildStat("0+", "Study Materials");
    const pyqStat = buildStat("0+", "PYQ Papers");
    const dppStat = buildStat("0+", "DPPs");
    const visitsStat = buildStat("0+", "Visits");

    fragment.appendChild(resourceStat);
    fragment.appendChild(pyqStat);
    fragment.appendChild(dppStat);
    fragment.appendChild(visitsStat);

    elHeroStats.appendChild(fragment);

    const resourceNum = resourceStat.querySelector(".hero-stat-num");
    const pyqNum = pyqStat.querySelector(".hero-stat-num");
    const dppNum = dppStat.querySelector(".hero-stat-num");
    const visitsNum = visitsStat.querySelector(".hero-stat-num");

    animateCount(visitsNum, 5000);

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

const renderFeatures = () => {
    if (!elFeatureGrid) return;

    elFeatureGrid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    HOME_FEATURES.forEach(feature => {
        const card = document.createElement("div");

        card.className = "feature-card";

        card.innerHTML =
            '<span class="feature-icon" aria-hidden="true"></span>' +
            '<h3 class="feature-title"></h3>' +
            '<p class="feature-desc"></p>';

        card.querySelector(".feature-icon").textContent = feature.icon;
        card.querySelector(".feature-title").textContent = feature.title;
        card.querySelector(".feature-desc").textContent = feature.desc;

        fragment.appendChild(card);
    });

    elFeatureGrid.appendChild(fragment);
};

const renderSteps = () => {
    if (!elStepsGrid) return;

    elStepsGrid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    HOW_IT_WORKS.forEach((step, index) => {
        const card = document.createElement("div");

        card.className = "step-card";

        card.innerHTML =
            '<span class="step-num"></span>' +
            '<h3 class="step-title"></h3>' +
            '<p class="step-desc"></p>';

        card.querySelector(".step-num").textContent = index + 1;
        card.querySelector(".step-title").textContent = step.title;
        card.querySelector(".step-desc").textContent = step.desc;

        fragment.appendChild(card);
    });

    elStepsGrid.appendChild(fragment);
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

const renderFounderNote = () => {
    if (!elFounderNote) return;

    elFounderNote.innerHTML =
        '<h2 class="founder-note-title"></h2>' +
        '<p class="founder-note-body"></p>' +
        '<p class="founder-note-signoff"></p>';

    elFounderNote.querySelector(".founder-note-title").textContent = FOUNDER_NOTE.title;
    elFounderNote.querySelector(".founder-note-body").textContent = FOUNDER_NOTE.body;
    elFounderNote.querySelector(".founder-note-signoff").textContent = FOUNDER_NOTE.signoff;
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

    if (elFinalCtaBrowseBtn && !elFinalCtaBrowseBtn.dataset.wired) {
        elFinalCtaBrowseBtn.dataset.wired = "true";

        elFinalCtaBrowseBtn.addEventListener(
            "click",
            onBrowseAll
        );
    }

    if (elFinalCtaPyqBtn && !elFinalCtaPyqBtn.dataset.wired) {
        elFinalCtaPyqBtn.dataset.wired = "true";

        elFinalCtaPyqBtn.addEventListener(
            "click",
            onPyqsHome
        );
    }

    if (elCommunityBtn) {
        elCommunityBtn.href = TELEGRAM_URL;
    }

    renderFeatures();
    renderSteps();
    renderHomeUpdatesPreview(onUpdatesClick);
    renderFounderNote();

    renderFaqs();

    elSubjectGrid.innerHTML = "";

    SUBJECTS.forEach(subject => {
        const button = document.createElement("button");

        button.className = "subject-card";
        button.type = "button";

        button.innerHTML =
            '<span class="subject-symbol">' +
            escapeHtml(subject.symbol) +
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
        chip.textContent = type.label;

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