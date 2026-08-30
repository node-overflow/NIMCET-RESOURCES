"use strict";

import {
    NITS,
    EXAM_PATTERN_SECTIONS,
    EXAM_PATTERN_META,
    FOCUS_AREAS,
    PREP_ROADMAP,
    MYTHS_FACTS
} from "./config.js";

import {
    elExamPatternGrid,
    elExamPatternMeta,
    elExamPatternDisclaimer,
    elFocusSubjectTabs,
    elFocusAreaList,
    elRoadmapTimeline,
    elNitMarquee,
    elMythFactGrid
} from "./dom.js";

const buildLogoItem = (logo, name, sub) => {
    const item = document.createElement("div");

    item.className = "logo-card";

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

    return item;
};

let marqueeObserverInitialized = false;

const initMarqueeObserver = () => {
    if (marqueeObserverInitialized) return;

    marqueeObserverInitialized = true;

    if (!("IntersectionObserver" in window)) return;

    const wrap = elNitMarquee && elNitMarquee.closest(".marquee-wrap");

    if (!wrap) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                entry.target.classList.toggle(
                    "is-offscreen",
                    !entry.isIntersecting
                );
            });
        },
        { threshold: 0 }
    );

    observer.observe(wrap);

    document.addEventListener("visibilitychange", () => {
        wrap.classList.toggle("is-offscreen", document.hidden);
    });
};

const renderNitMarquee = () => {
    if (!elNitMarquee) return;

    elNitMarquee.innerHTML = "";

    const fragment = document.createDocumentFragment();

    [...NITS, ...NITS].forEach(nit => {
        fragment.appendChild(
            buildLogoItem(nit.logo, nit.name, nit.city)
        );
    });

    elNitMarquee.appendChild(fragment);
};

const renderExamPattern = () => {
    if (!elExamPatternGrid) return;

    elExamPatternGrid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    EXAM_PATTERN_SECTIONS.forEach(section => {
        const card = document.createElement("div");

        card.className = "pattern-card";

        card.innerHTML =
            '<div class="pattern-card-head">' +
            '<h3 class="pattern-section-name"></h3>' +
            '<div class="pattern-marking">' +
            '<span class="pattern-mark-pill pattern-mark-pos"></span>' +
            '<span class="pattern-mark-pill pattern-mark-neg"></span>' +
            '</div>' +
            '</div>' +
            '<div class="pattern-bar-track"><div class="pattern-bar-fill"></div></div>' +
            '<div class="pattern-card-foot">' +
            '<span class="pattern-questions"></span>' +
            '<span class="pattern-marks"></span>' +
            '</div>';

        card.querySelector(".pattern-section-name").textContent = section.section;
        card.querySelector(".pattern-mark-pos").textContent = "+" + section.correct;
        card.querySelector(".pattern-mark-neg").textContent = "-" + section.incorrect;
        card.querySelector(".pattern-bar-fill").style.width = section.weight;
        card.querySelector(".pattern-questions").textContent = section.questions + " Qs";
        card.querySelector(".pattern-marks").textContent = section.marks + " Marks";

        fragment.appendChild(card);
    });

    elExamPatternGrid.appendChild(fragment);

    if (elExamPatternMeta) {
        elExamPatternMeta.innerHTML = "";

        const metaItems = [
            [EXAM_PATTERN_META.totalQuestions + " Questions", "Total"],
            [EXAM_PATTERN_META.totalMarks + " Marks", "Total"],
            [EXAM_PATTERN_META.duration, "Duration"],
            [EXAM_PATTERN_META.mode, "Mode"]
        ];

        metaItems.forEach(([value, label]) => {
            const item = document.createElement("div");

            item.className = "pattern-meta-item";

            item.innerHTML =
                '<span class="pattern-meta-value"></span>' +
                '<span class="pattern-meta-label"></span>';

            item.querySelector(".pattern-meta-value").textContent = value;
            item.querySelector(".pattern-meta-label").textContent = label;

            elExamPatternMeta.appendChild(item);
        });
    }

    if (elExamPatternDisclaimer) {
        elExamPatternDisclaimer.textContent = EXAM_PATTERN_META.note;
    }
};

let activeFocusSubject = null;

const renderFocusAreaList = (subjectName) => {
    if (!elFocusAreaList) return;

    elFocusAreaList.innerHTML = "";

    const areas = FOCUS_AREAS[subjectName] || [];

    const fragment = document.createDocumentFragment();

    areas.forEach(area => {
        const row = document.createElement("div");

        row.className = "focus-area-row";

        row.innerHTML =
            '<span class="focus-area-chapter"></span>' +
            '<span class="focus-area-level"></span>';

        row.querySelector(".focus-area-chapter").textContent = area.chapter;

        const levelEl = row.querySelector(".focus-area-level");

        levelEl.textContent = area.level;
        levelEl.dataset.level = area.level.toLowerCase();

        fragment.appendChild(row);
    });

    elFocusAreaList.appendChild(fragment);
};

const renderFocusAreas = () => {
    if (!elFocusSubjectTabs) return;

    const subjectNames = Object.keys(FOCUS_AREAS);

    if (!activeFocusSubject || !subjectNames.includes(activeFocusSubject)) {
        activeFocusSubject = subjectNames[0];
    }

    elFocusSubjectTabs.innerHTML = "";

    const fragment = document.createDocumentFragment();

    subjectNames.forEach(subjectName => {
        const chip = document.createElement("button");

        chip.className = "chip";
        chip.type = "button";
        chip.textContent = subjectName;
        chip.dataset.active = subjectName === activeFocusSubject ? "true" : "false";

        chip.addEventListener("click", () => {
            if (activeFocusSubject === subjectName) return;

            activeFocusSubject = subjectName;

            elFocusSubjectTabs
                .querySelectorAll(".chip")
                .forEach(other => {
                    other.dataset.active = "false";
                });

            chip.dataset.active = "true";

            renderFocusAreaList(subjectName);
        });

        fragment.appendChild(chip);
    });

    elFocusSubjectTabs.appendChild(fragment);

    renderFocusAreaList(activeFocusSubject);
};

const renderRoadmap = () => {
    if (!elRoadmapTimeline) return;

    elRoadmapTimeline.innerHTML = "";

    const fragment = document.createDocumentFragment();

    PREP_ROADMAP.forEach(phase => {
        const item = document.createElement("div");

        item.className = "roadmap-item";

        item.innerHTML =
            '<div class="roadmap-marker"><span class="roadmap-phase"></span></div>' +
            '<div class="roadmap-content">' +
            '<span class="roadmap-window"></span>' +
            '<h3 class="roadmap-title"></h3>' +
            '<p class="roadmap-desc"></p>' +
            '</div>';

        item.querySelector(".roadmap-phase").textContent = phase.phase;
        item.querySelector(".roadmap-window").textContent = phase.window;
        item.querySelector(".roadmap-title").textContent = phase.title;
        item.querySelector(".roadmap-desc").textContent = phase.desc;

        fragment.appendChild(item);
    });

    elRoadmapTimeline.appendChild(fragment);
};

const renderMythsFacts = () => {
    if (!elMythFactGrid) return;

    elMythFactGrid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    MYTHS_FACTS.forEach(pair => {
        const card = document.createElement("div");

        card.className = "myth-fact-card";

        card.innerHTML =
            '<div class="myth-row"><span class="myth-fact-tag myth-tag">Myth</span><p></p></div>' +
            '<div class="fact-row"><span class="myth-fact-tag fact-tag">Fact</span><p></p></div>';

        card.querySelector(".myth-row p").textContent = pair.myth;
        card.querySelector(".fact-row p").textContent = pair.fact;

        fragment.appendChild(card);
    });

    elMythFactGrid.appendChild(fragment);
};

export const renderExamInfo = () => {
    renderExamPattern();
    renderFocusAreas();
    renderNitMarquee();
    initMarqueeObserver();
    renderRoadmap();
    renderMythsFacts();
};