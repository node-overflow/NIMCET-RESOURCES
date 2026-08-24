"use strict";

import {
    SUBJECTS,
    TYPES,
    EXAMS,
    NITS,
    FAQS_FILE
} from "./config.js";

import {
    elSubjectGrid,
    elTypeChips,
    elFeaturedGrid,
    elHeroStats,
    elHeroBrowseBtn,
    elHeroPyqBtn,
    elExamMarquee,
    elNitMarquee,
    elFaqCategories,
    elFaqList
} from "./dom.js";

import { state } from "./state.js";

import {
    countBySubject,
    escapeHtml
} from "./utils.js";

import { renderGrid } from "./cards.js";

import { computeDppTotal } from "./dpp.js";

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

const renderHeroStats = () => {
    if (!elHeroStats) return;

    elHeroStats.innerHTML = "";

    const fragment = document.createDocumentFragment();

    const resourceStat = buildStat("0+", "Resources");
    const pyqStat = buildStat("0+", "PYQ Papers");
    const dppStat = buildStat("0+", "DPPs");
    const visitsStat = buildStat("0+", "Visits");

    fragment.appendChild(resourceStat);
    fragment.appendChild(pyqStat);
    fragment.appendChild(dppStat);
    fragment.appendChild(visitsStat);

    elHeroStats.appendChild(fragment);

    const visitsNum = visitsStat.querySelector(".hero-stat-num");
    animateCount(visitsNum, 5000);

    const resourceNum = resourceStat.querySelector(".hero-stat-num");
    const pyqNum = pyqStat.querySelector(".hero-stat-num");
    const dppNum = dppStat.querySelector(".hero-stat-num");

    animateCount(resourceNum, state.resources.length);
    animateCount(pyqNum, state.pyqs.length);

    computeDppTotal().then(total => {
        if (!dppNum) return;

        if (total > 0) {
            animateCount(dppNum, total);
        } else {
            dppNum.textContent = "Soon";
        }
    });
};

const buildLogoItem = (logo, name, sub, onClick) => {
    const item = document.createElement(onClick ? "button" : "div");

    item.className = "logo-card";

    if (onClick) {
        item.type = "button";
    }

    item.innerHTML =
        '<span class="logo-badge">' +
        '<img src="" alt="" loading="lazy">' +
        '</span>' +
        '<span>' +
        '<span class="logo-card-name" style="display:block;"></span>' +
        '<span class="logo-card-sub" style="display:block;"></span>' +
        '</span>';

    const img = item.querySelector(".logo-badge img");

    img.src = logo;
    img.alt = `${name} logo`;

    item.querySelector(".logo-card-name").textContent = name;
    item.querySelector(".logo-card-sub").textContent = sub;

    if (onClick) {
        item.addEventListener("click", onClick);
    }

    return item;
};

const renderExamMarquee = (onExamClick) => {
    if (!elExamMarquee) return;

    elExamMarquee.innerHTML = "";

    const fragment = document.createDocumentFragment();

    [...EXAMS, ...EXAMS].forEach(exam => {
        const item = document.createElement("button");

        item.className = "logo-card";
        item.type = "button";

        item.innerHTML =
            '<span class="logo-badge"></span>' +
            '<span>' +
            '<span class="logo-card-name" style="display:block;"></span>' +
            '<span class="logo-card-sub" style="display:block;"></span>' +
            '</span>';

        item.querySelector(".logo-badge").textContent = exam.symbol;
        item.querySelector(".logo-card-name").textContent = exam.name;
        item.querySelector(".logo-card-sub").textContent = exam.full;

        item.addEventListener("click", () => {
            onExamClick(exam.key);
        });

        fragment.appendChild(item);
    });

    elExamMarquee.appendChild(fragment);
};

const renderNitMarquee = () => {
    if (!elNitMarquee) return;

    elNitMarquee.innerHTML = "";

    const fragment = document.createDocumentFragment();

    [...NITS, ...NITS].forEach(nit => {
        fragment.appendChild(
            buildLogoItem(
                nit.logo,
                nit.name,
                nit.city,
                null
            )
        );
    });

    elNitMarquee.appendChild(fragment);
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

    faqs.forEach((faq => {
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
                other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
            });

            if (!isOpen) {
                item.dataset.open = "true";
                button.setAttribute("aria-expanded", "true");
            }
        });

        fragment.appendChild(item);
    }));

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
        button.dataset.active = category.key === activeFaqCategory ? "true" : "false";

        button.addEventListener("click", () => {
            if (activeFaqCategory === category.key) return;

            activeFaqCategory = category.key;

            elFaqCategories.querySelectorAll(".faq-cat-btn").forEach(other => {
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

    if (!activeFaqCategory || !categories.some(category => category.key === activeFaqCategory)) {
        activeFaqCategory = categories[0].key;
    }

    renderFaqCategoryTabs(categories);

    const active = categories.find(category => category.key === activeFaqCategory);

    renderFaqQuestions(active ? active.faqs : []);
};

export const renderHome = (
    onSubjectClick,
    onTypeClick,
    onExamClick,
    onBrowseAll,
    onPyqsHome
) => {
    renderHeroStats();

    if (elHeroBrowseBtn && !elHeroBrowseBtn.dataset.wired) {
        elHeroBrowseBtn.dataset.wired = "true";

        elHeroBrowseBtn.addEventListener("click", onBrowseAll);
    }

    if (elHeroPyqBtn && !elHeroPyqBtn.dataset.wired) {
        elHeroPyqBtn.dataset.wired = "true";

        elHeroPyqBtn.addEventListener("click", onPyqsHome);
    }

    renderExamMarquee(onExamClick);
    renderNitMarquee();
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