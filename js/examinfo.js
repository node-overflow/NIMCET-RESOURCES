"use strict";

import {
    NITS,
    EXAM_PATTERN_SECTIONS,
    EXAM_PATTERN_META,
    EXAM_INFO_NAV,
    ELIGIBILITY_CRITERIA,
    ELIGIBILITY_NOTE,
    EXAM_TIMELINE_PHASES,
    EXAM_TIMELINE_NOTE,
    SYLLABUS,
    SYLLABUS_NOTE,
    FOCUS_AREAS,
    SECTION_STRATEGY,
    SECTION_STRATEGY_NOTE,
    PREP_ROADMAP,
    RECOMMENDED_BOOKS,
    EXAM_DAY_CHECKLIST,
    COMMON_MISTAKES,
    MYTHS_FACTS,
    EXAM_INFO_FAQS
} from "./config.js";

import {
    elExamInfoNav,
    elExamPatternGrid,
    elExamPatternMeta,
    elExamPatternDisclaimer,
    elEligibilityGrid,
    elEligibilityNote,
    elExamTimeline,
    elExamTimelineNote,
    elSyllabusSubjectTabs,
    elSyllabusChapterList,
    elSyllabusNote,
    elFocusSubjectTabs,
    elFocusAreaList,
    elStrategyGrid,
    elStrategyNote,
    elRoadmapTimeline,
    elBooksGrid,
    elExamDayChecklist,
    elMistakesList,
    elNitMarquee,
    elMythFactGrid,
    elExamFaqList
} from "./dom.js";

/* =========================================================
   QUICK NAV (jump links + scrollspy)
   ========================================================= */

let quickNavObserver = null;

const scrollToSection = (id) => {
    const target = document.getElementById(id);

    if (!target) return;

    const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        86;

    window.scrollTo({
        top: Math.max(top, 0),
        behavior: "smooth"
    });
};

const setActiveNavChip = (id) => {
    if (!elExamInfoNav) return;

    elExamInfoNav.querySelectorAll(".chip").forEach(chip => {
        chip.dataset.active =
            chip.dataset.target === id ? "true" : "false";
    });
};

const initQuickNavScrollspy = () => {
    if (!elExamInfoNav) return;

    if (!("IntersectionObserver" in window)) return;

    if (quickNavObserver) {
        quickNavObserver.disconnect();
    }

    const sections = EXAM_INFO_NAV
        .map(item => document.getElementById(item.id))
        .filter(Boolean);

    if (!sections.length) return;

    quickNavObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveNavChip(entry.target.id);
                }
            });
        },
        { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach(section => quickNavObserver.observe(section));
};

const renderQuickNav = () => {
    if (!elExamInfoNav) return;

    elExamInfoNav.innerHTML = "";

    const fragment = document.createDocumentFragment();

    EXAM_INFO_NAV.forEach((item, index) => {
        const chip = document.createElement("button");

        chip.className = "chip";
        chip.type = "button";
        chip.textContent = item.label;
        chip.dataset.target = item.id;
        chip.dataset.active = index === 0 ? "true" : "false";

        chip.addEventListener("click", () => {
            scrollToSection(item.id);
            setActiveNavChip(item.id);
        });

        fragment.appendChild(chip);
    });

    elExamInfoNav.appendChild(fragment);

    initQuickNavScrollspy();
};

/* =========================================================
   NIT MARQUEE
   ========================================================= */

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

/* =========================================================
   EXAM PATTERN
   ========================================================= */

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
            [EXAM_PATTERN_META.negativeMarking, "Negative Marking"],
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

/* =========================================================
   ELIGIBILITY
   ========================================================= */

const renderEligibility = () => {
    if (!elEligibilityGrid) return;

    elEligibilityGrid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    ELIGIBILITY_CRITERIA.forEach(criterion => {
        const card = document.createElement("div");

        card.className = "feature-card";

        card.innerHTML =
            '<span class="feature-icon" aria-hidden="true"></span>' +
            '<h3 class="feature-title"></h3>' +
            '<p class="feature-desc"></p>';

        card.querySelector(".feature-icon").textContent = criterion.icon;
        card.querySelector(".feature-title").textContent = criterion.title;
        card.querySelector(".feature-desc").textContent = criterion.desc;

        fragment.appendChild(card);
    });

    elEligibilityGrid.appendChild(fragment);

    if (elEligibilityNote) {
        elEligibilityNote.textContent = ELIGIBILITY_NOTE;
    }
};

/* =========================================================
   GENERIC TIMELINE RENDERER (used by roadmap + exam timeline)
   ========================================================= */

const renderTimelineList = (container, items) => {
    if (!container) return;

    container.innerHTML = "";

    const fragment = document.createDocumentFragment();

    items.forEach(phase => {
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

    container.appendChild(fragment);
};

/* =========================================================
   SYLLABUS (tabbed checklist)
   ========================================================= */

let activeSyllabusSubject = null;

const renderSyllabusChapterList = (subjectName) => {
    if (!elSyllabusChapterList) return;

    elSyllabusChapterList.innerHTML = "";

    const chapters = SYLLABUS[subjectName] || [];

    const fragment = document.createDocumentFragment();

    chapters.forEach(chapter => {
        const pill = document.createElement("span");

        pill.className = "syllabus-chip";
        pill.textContent = chapter;

        fragment.appendChild(pill);
    });

    elSyllabusChapterList.appendChild(fragment);
};

const renderSyllabus = () => {
    if (!elSyllabusSubjectTabs) return;

    const subjectNames = Object.keys(SYLLABUS);

    if (!activeSyllabusSubject || !subjectNames.includes(activeSyllabusSubject)) {
        activeSyllabusSubject = subjectNames[0];
    }

    elSyllabusSubjectTabs.innerHTML = "";

    const fragment = document.createDocumentFragment();

    subjectNames.forEach(subjectName => {
        const chip = document.createElement("button");

        chip.className = "chip";
        chip.type = "button";
        chip.textContent = subjectName;
        chip.dataset.active = subjectName === activeSyllabusSubject ? "true" : "false";

        chip.addEventListener("click", () => {
            if (activeSyllabusSubject === subjectName) return;

            activeSyllabusSubject = subjectName;

            elSyllabusSubjectTabs
                .querySelectorAll(".chip")
                .forEach(other => {
                    other.dataset.active = "false";
                });

            chip.dataset.active = "true";

            renderSyllabusChapterList(subjectName);
        });

        fragment.appendChild(chip);
    });

    elSyllabusSubjectTabs.appendChild(fragment);

    renderSyllabusChapterList(activeSyllabusSubject);

    if (elSyllabusNote) {
        elSyllabusNote.textContent = SYLLABUS_NOTE;
    }
};

/* =========================================================
   FOCUS AREAS
   ========================================================= */

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

/* =========================================================
   SECTION STRATEGY
   ========================================================= */

const renderSectionStrategy = () => {
    if (!elStrategyGrid) return;

    elStrategyGrid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    SECTION_STRATEGY.forEach(item => {
        const card = document.createElement("div");

        card.className = "strategy-card";

        card.innerHTML =
            '<div class="strategy-head">' +
            '<h3 class="strategy-section-name"></h3>' +
            '<span class="strategy-time"></span>' +
            '</div>' +
            '<p class="strategy-approach"></p>';

        card.querySelector(".strategy-section-name").textContent = item.section;
        card.querySelector(".strategy-time").textContent = item.suggestedTime;
        card.querySelector(".strategy-approach").textContent = item.approach;

        fragment.appendChild(card);
    });

    elStrategyGrid.appendChild(fragment);

    if (elStrategyNote) {
        elStrategyNote.textContent = SECTION_STRATEGY_NOTE;
    }
};

/* =========================================================
   RECOMMENDED BOOKS
   ========================================================= */

const renderBooks = () => {
    if (!elBooksGrid) return;

    elBooksGrid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    RECOMMENDED_BOOKS.forEach(book => {
        const card = document.createElement("div");

        card.className = "rec-book-card";

        card.innerHTML =
            '<span class="rec-book-subject"></span>' +
            '<h3 class="rec-book-title"></h3>' +
            '<p class="rec-book-note"></p>';

        card.querySelector(".rec-book-subject").textContent = book.subject;
        card.querySelector(".rec-book-title").textContent = book.title;
        card.querySelector(".rec-book-note").textContent = book.note;

        fragment.appendChild(card);
    });

    elBooksGrid.appendChild(fragment);
};

/* =========================================================
   EXAM DAY CHECKLIST
   ========================================================= */

const renderExamDayChecklist = () => {
    if (!elExamDayChecklist) return;

    elExamDayChecklist.innerHTML = "";

    const fragment = document.createDocumentFragment();

    EXAM_DAY_CHECKLIST.forEach((text, index) => {
        const item = document.createElement("div");

        item.className = "checklist-item";

        item.innerHTML =
            '<span class="checklist-num"></span>' +
            '<p></p>';

        item.querySelector(".checklist-num").textContent = index + 1;
        item.querySelector("p").textContent = text;

        fragment.appendChild(item);
    });

    elExamDayChecklist.appendChild(fragment);
};

/* =========================================================
   COMMON MISTAKES
   ========================================================= */

const renderMistakes = () => {
    if (!elMistakesList) return;

    elMistakesList.innerHTML = "";

    const fragment = document.createDocumentFragment();

    COMMON_MISTAKES.forEach(pair => {
        const card = document.createElement("div");

        card.className = "myth-fact-card";

        card.innerHTML =
            '<div class="myth-row"><span class="myth-fact-tag myth-tag">Mistake</span><p></p></div>' +
            '<div class="fact-row"><span class="myth-fact-tag fact-tag">Fix</span><p></p></div>';

        card.querySelector(".myth-row p").textContent = pair.mistake;
        card.querySelector(".fact-row p").textContent = pair.fix;

        fragment.appendChild(card);
    });

    elMistakesList.appendChild(fragment);
};

/* =========================================================
   MYTH VS FACT
   ========================================================= */

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

/* =========================================================
   EXAM-INFO FAQ ACCORDION
   ========================================================= */

const renderExamFaqs = () => {
    if (!elExamFaqList) return;

    elExamFaqList.innerHTML = "";

    const fragment = document.createDocumentFragment();

    EXAM_INFO_FAQS.forEach(faq => {
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

            elExamFaqList.querySelectorAll(".faq-item").forEach(other => {
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

    elExamFaqList.appendChild(fragment);
};

/* =========================================================
   ORCHESTRATOR
   ========================================================= */

export const renderExamInfo = () => {
    renderQuickNav();
    renderExamPattern();
    renderEligibility();
    renderTimelineList(elExamTimeline, EXAM_TIMELINE_PHASES);

    if (elExamTimelineNote) {
        elExamTimelineNote.textContent = EXAM_TIMELINE_NOTE;
    }

    renderSyllabus();
    renderFocusAreas();
    renderSectionStrategy();
    renderTimelineList(elRoadmapTimeline, PREP_ROADMAP);
    renderBooks();
    renderExamDayChecklist();
    renderMistakes();
    renderNitMarquee();
    initMarqueeObserver();
    renderMythsFacts();
    renderExamFaqs();
};