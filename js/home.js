"use strict";

import {
    SUBJECTS,
    TYPES,
    EXAMS,
    NITS,
    FAQS_FILE,
    HOME_FEATURES,
    HOW_IT_WORKS,
    TESTIMONIALS,
    TELEGRAM_URL,
    MANIFESTO,
    EXAM_PATTERN_SECTIONS,
    EXAM_PATTERN_META,
    FOCUS_AREAS,
    PREP_ROADMAP,
    COMPARISON_ROWS,
    DAILY_ROUTINE,
    MYTHS_FACTS,
    FOUNDER_NOTE,
    MOTIVATION_LINES
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
    elFaqList,
    elFeatureGrid,
    elStepsGrid,
    elHomeUpdatesPreview,
    elHomeUpdatesBtn,
    elTestimonialGrid,
    elCommunityBtn,
    elFinalCtaBrowseBtn,
    elFinalCtaPyqBtn,
    elManifestoEyebrow,
    elManifestoTitle,
    elManifestoText,
    elManifestoSignoff,
    elExamPatternGrid,
    elExamPatternMeta,
    elExamPatternDisclaimer,
    elFocusSubjectTabs,
    elFocusAreaList,
    elRoadmapTimeline,
    elComparisonTable,
    elRoutineGrid,
    elMythFactGrid,
    elFounderNote,
    elMotivationMarquee
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
    animateCount(pyqNum, state.pyqs.length);

    computeDppTotal().then(total => {
        if (!resourceNum || !dppNum) return;

        if (total > 0) {
            animateCount(dppNum, total);

            const materialTotal =
                state.resources.length +
                state.pyqs.length +
                total;

            animateCount(resourceNum, materialTotal);
        } else {
            dppNum.textContent = "Soon";

            const materialTotal =
                state.resources.length +
                state.pyqs.length;

            animateCount(resourceNum, materialTotal);
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

let marqueeObserverInitialized = false;

const initMarqueeObserver = () => {
    if (marqueeObserverInitialized) return;

    marqueeObserverInitialized = true;

    if (!("IntersectionObserver" in window)) return;

    const wraps = [elExamMarquee, elNitMarquee, elMotivationMarquee]
        .filter(Boolean)
        .map(track => track.closest(".marquee-wrap"))
        .filter(Boolean);

    if (!wraps.length) return;

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

    wraps.forEach(wrap => observer.observe(wrap));

    document.addEventListener("visibilitychange", () => {
        wraps.forEach(wrap => {
            wrap.classList.toggle("is-offscreen", document.hidden);
        });
    });
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

const renderManifesto = () => {
    if (!elManifestoText) return;

    if (elManifestoEyebrow) {
        elManifestoEyebrow.textContent = MANIFESTO.eyebrow;
    }

    if (elManifestoTitle) {
        elManifestoTitle.textContent = MANIFESTO.title;
    }

    elManifestoText.innerHTML = "";

    MANIFESTO.paragraphs.forEach(paragraph => {
        const p = document.createElement("p");

        p.textContent = paragraph;

        elManifestoText.appendChild(p);
    });

    if (elManifestoSignoff) {
        elManifestoSignoff.textContent = MANIFESTO.signoff;
    }
};

const renderExamPattern = () => {
    if (!elExamPatternGrid) return;

    elExamPatternGrid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    EXAM_PATTERN_SECTIONS.forEach(section => {
        const card = document.createElement("div");

        card.className = "pattern-card";

        card.innerHTML =
            '<h3 class="pattern-section-name"></h3>' +
            '<div class="pattern-bar-track"><div class="pattern-bar-fill"></div></div>' +
            '<div class="pattern-card-foot">' +
            '<span class="pattern-questions"></span>' +
            '<span class="pattern-marks"></span>' +
            '</div>';

        card.querySelector(".pattern-section-name").textContent = section.section;
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
            [EXAM_PATTERN_META.negativeMarking, "Marking"],
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

const renderComparisonTable = () => {
    if (!elComparisonTable) return;

    elComparisonTable.innerHTML = "";

    const header = document.createElement("div");

    header.className = "comparison-row comparison-header";

    header.innerHTML =
        '<span></span>' +
        '<span class="comparison-us-label">This Hub</span>' +
        '<span class="comparison-them-label">Typical Paid Coaching</span>';

    elComparisonTable.appendChild(header);

    const fragment = document.createDocumentFragment();

    COMPARISON_ROWS.forEach(row => {
        const rowEl = document.createElement("div");

        rowEl.className = "comparison-row";

        rowEl.innerHTML =
            '<span class="comparison-label"></span>' +
            '<span class="comparison-us"></span>' +
            '<span class="comparison-them"></span>';

        rowEl.querySelector(".comparison-label").textContent = row.label;
        rowEl.querySelector(".comparison-us").textContent = row.us;
        rowEl.querySelector(".comparison-them").textContent = row.them;

        fragment.appendChild(rowEl);
    });

    elComparisonTable.appendChild(fragment);
};

const renderRoutine = () => {
    if (!elRoutineGrid) return;

    elRoutineGrid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    DAILY_ROUTINE.forEach(block => {
        const card = document.createElement("div");

        card.className = "routine-card";

        card.innerHTML =
            '<span class="routine-time"></span>' +
            '<h3 class="routine-title"></h3>' +
            '<p class="routine-desc"></p>';

        card.querySelector(".routine-time").textContent = block.time;
        card.querySelector(".routine-title").textContent = block.title;
        card.querySelector(".routine-desc").textContent = block.desc;

        fragment.appendChild(card);
    });

    elRoutineGrid.appendChild(fragment);
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

const renderMotivationMarquee = () => {
    if (!elMotivationMarquee) return;

    elMotivationMarquee.innerHTML = "";

    const fragment = document.createDocumentFragment();

    [...MOTIVATION_LINES, ...MOTIVATION_LINES].forEach(line => {
        const chip = document.createElement("div");

        chip.className = "logo-card motivation-card";

        chip.innerHTML = '<span class="motivation-text"></span>';

        chip.querySelector(".motivation-text").textContent = line;

        fragment.appendChild(chip);
    });

    elMotivationMarquee.appendChild(fragment);
};

const renderTestimonials = () => {
    if (!elTestimonialGrid) return;

    elTestimonialGrid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    TESTIMONIALS.forEach(testimonial => {
        const card = document.createElement("div");

        card.className = "testimonial-card";

        card.innerHTML =
            '<p class="testimonial-quote"></p>' +
            '<p class="testimonial-source"></p>';

        card.querySelector(".testimonial-quote").textContent =
            `“${testimonial.quote}”`;

        card.querySelector(".testimonial-source").textContent =
            testimonial.source;

        fragment.appendChild(card);
    });

    elTestimonialGrid.appendChild(fragment);
};

export const renderHome = (
    onSubjectClick,
    onTypeClick,
    onExamClick,
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

    renderManifesto();
    renderFeatures();
    renderExamPattern();
    renderFocusAreas();
    renderSteps();
    renderRoadmap();
    renderHomeUpdatesPreview(onUpdatesClick);
    renderComparisonTable();
    renderRoutine();
    renderMotivationMarquee();
    renderTestimonials();
    renderMythsFacts();
    renderFounderNote();

    renderExamMarquee(onExamClick);
    renderNitMarquee();
    initMarqueeObserver();
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