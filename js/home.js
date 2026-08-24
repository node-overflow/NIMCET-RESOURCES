"use strict";

import {
    SUBJECTS,
    TYPES,
    EXAMS,
    NITS,
    FAQS
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

const renderHeroStats = () => {
    if (!elHeroStats) return;

    elHeroStats.innerHTML = "";

    const fragment = document.createDocumentFragment();

    fragment.appendChild(
        buildStat(state.resources.length + "+", "Resources")
    );

    fragment.appendChild(
        buildStat(SUBJECTS.length, "Subjects")
    );

    fragment.appendChild(
        buildStat(state.pyqs.length + "+", "PYQ Papers")
    );

    const dppStat = buildStat("…", "DPPs");

    fragment.appendChild(dppStat);

    elHeroStats.appendChild(fragment);

    computeDppTotal().then(total => {
        const numEl = dppStat.querySelector(".hero-stat-num");

        if (!numEl) return;

        numEl.textContent = total > 0 ? total + "+" : "Soon";
    });
};

const buildLogoCard = (badgeText, name, sub, onClick) => {
    const card = document.createElement(onClick ? "button" : "div");

    card.className = "logo-card";

    if (onClick) {
        card.type = "button";
    }

    card.innerHTML =
        '<span class="logo-badge"></span>' +
        '<span>' +
        '<span class="logo-card-name" style="display:block;"></span>' +
        '<span class="logo-card-sub" style="display:block;"></span>' +
        '</span>';

    card.querySelector(".logo-badge").textContent = badgeText;
    card.querySelector(".logo-card-name").textContent = name;
    card.querySelector(".logo-card-sub").textContent = sub;

    if (onClick) {
        card.addEventListener("click", onClick);
    }

    return card;
};

const renderExamMarquee = (onExamClick) => {
    if (!elExamMarquee) return;

    elExamMarquee.innerHTML = "";

    const fragment = document.createDocumentFragment();

    // Duplicated once so the track can loop seamlessly.
    [...EXAMS, ...EXAMS].forEach(exam => {
        fragment.appendChild(
            buildLogoCard(
                exam.symbol,
                exam.name,
                exam.full,
                () => onExamClick(exam.key)
            )
        );
    });

    elExamMarquee.appendChild(fragment);
};

const renderNitMarquee = () => {
    if (!elNitMarquee) return;

    elNitMarquee.innerHTML = "";

    const fragment = document.createDocumentFragment();

    [...NITS, ...NITS].forEach(nit => {
        fragment.appendChild(
            buildLogoCard(nit.code, nit.name, nit.city, null)
        );
    });

    elNitMarquee.appendChild(fragment);
};

const renderFaqs = () => {
    if (!elFaqList) return;

    elFaqList.innerHTML = "";

    const fragment = document.createDocumentFragment();

    FAQS.forEach((faq, index) => {
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

        if (index === 0) {
            item.dataset.open = "true";
            button.setAttribute("aria-expanded", "true");
        }

        fragment.appendChild(item);
    });

    elFaqList.appendChild(fragment);
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