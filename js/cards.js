"use strict";

import { RESOURCE_ORDER } from "./config.js";

import {
    escapeHtml,
    actionLabel,
    extractYouTubeId
} from "./utils.js";

import { state } from "./state.js";

let activeVideo = null;


/* =========================================================
   SHARED CARD HELPERS
   ========================================================= */

const shouldShowTypeLabel = (item) => !(state.type && state.type === item.type);

const typeLabelChip = (item, cssVar, text) => {
    if (!shouldShowTypeLabel(item)) return "";

    return '<span class="type-label" style="color: var(' + cssVar + ')">' +
        escapeHtml(text) +
        "</span>";
};

const examTagHtml = (item) => {
    if (item.subject === "Computer" && item.exam) {
        return '<span class="video-exam-tag">' + escapeHtml(item.exam) + "</span>";
    }

    return "";
};

const yearBadgeHtml = (item) => {
    if (!item.year) return "";

    return '<span class="year-badge">' + escapeHtml(String(item.year)) + "</span>";
};

const cardTopRight = (...parts) => {
    const content = parts.filter(Boolean).join("");

    if (!content) return "";

    return '<span class="card-top-right">' + content + "</span>";
};

const wireCardAction = (card, item) => {
    const action = card.querySelector(".card-action");

    if (!action) return;

    action.addEventListener("click", event => {
        if (!item.url || item.url === "#") {
            event.preventDefault();
        }
    });
};


/* =========================================================
   CARD URL HANDLER
   ========================================================= */

const getCardUrl = (item) => {
    if (!item.url || item.url === "#") {
        return "#";
    }

    let url = item.url;

    if (url.includes("github.com/") && url.includes("/blob/")) {
        const match = url.match(
            /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/
        );

        if (match) {
            const [, owner, repo, branch, filePath] = match;

            if (item.cdnjs === true) {
                url = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${filePath}`;
            } else {
                url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
            }
        }
    }

    if (item.reader === true) {
        return (
            "components/pdf-reader/reader.html" +
            "?file=" +
            encodeURIComponent(url) +
            "&title=" +
            encodeURIComponent(item.title || "PDF Reader")
        );
    }

    return url;
};


/* =========================================================
   NORMAL RESOURCE CARD
   ========================================================= */

export const buildCard = (item) => {
    switch (item.type) {
        case "Video":
            return buildVideoCard(item);

        case "Book":
            return buildBookCard(item);

        case "Formula":
            return buildFormulaCard(item);

        case "Practice":
            return buildPracticeCard(item);

        case "PYQ":
            return buildPyqTypeCard(item);

        case "Notes":
        default:
            return buildNotesCard(item);
    }
};


/* =========================================================
   NOTES CARD
   ========================================================= */

const buildNotesCard = (item) => {
    const card = document.createElement("div");

    card.className = "resource-card notes-card";
    card.style.setProperty("--tc", "var(--type-notes)");

    let cardUrl = getCardUrl(item);

    if (cardUrl !== "#") {
        cardUrl = escapeHtml(cardUrl);
    }

    const metaBits = [item.chapter || item.subject, item.bestFor]
        .filter(Boolean);

    card.innerHTML =
        '<div class="card-top-v2">' +

        (shouldShowTypeLabel(item)
            ? '<span class="card-icon-badge" style="--tc: var(--type-notes)">✎</span>'
            : "") +

        typeLabelChip(item, "--type-notes", "Notes") +

        cardTopRight(examTagHtml(item)) +

        "</div>" +

        '<h3 class="card-title"></h3>' +

        (metaBits.length
            ? '<div class="card-meta">' +
            metaBits
                .map(bit => "<span>" + escapeHtml(bit) + "</span>")
                .join("") +
            "</div>"
            : "") +

        '<div class="card-foot">' +

        '<a class="card-action" href="' +
        cardUrl +
        '" target="_blank" rel="noopener noreferrer">' +

        actionLabel(item) +

        ' <span class="arrow">→</span>' +

        "</a>" +

        "</div>";

    card.querySelector(".card-title").textContent = item.title || "";

    wireCardAction(card, item);

    return card;
};


/* =========================================================
   FORMULA CARD
   ========================================================= */

const buildFormulaCard = (item) => {
    const card = document.createElement("div");

    card.className = "resource-card formula-card";
    card.style.setProperty("--tc", "var(--type-formula)");

    let cardUrl = getCardUrl(item);

    if (cardUrl !== "#") {
        cardUrl = escapeHtml(cardUrl);
    }

    const chapterLabel = item.chapter || item.subject || "";

    card.innerHTML =
        '<div class="card-top-v2">' +

        (shouldShowTypeLabel(item)
            ? '<span class="card-icon-badge" style="--tc: var(--type-formula)">∑</span>'
            : "") +

        typeLabelChip(item, "--type-formula", "Formula") +

        cardTopRight(examTagHtml(item)) +

        "</div>" +

        '<h3 class="card-title"></h3>' +

        (chapterLabel
            ? '<div class="formula-chapter"></div>'
            : "") +

        '<div class="card-foot">' +

        '<a class="card-action" href="' +
        cardUrl +
        '" target="_blank" rel="noopener noreferrer">' +

        actionLabel(item) +

        ' <span class="arrow">→</span>' +

        "</a>" +

        "</div>";

    card.querySelector(".card-title").textContent = item.title || "";

    const chapterEl = card.querySelector(".formula-chapter");

    if (chapterEl) {
        chapterEl.textContent = chapterLabel;
    }

    wireCardAction(card, item);

    return card;
};


/* =========================================================
   PRACTICE CARD
   ========================================================= */

const buildPracticeCard = (item) => {
    const card = document.createElement("div");

    card.className = "resource-card practice-card";
    card.style.setProperty("--tc", "var(--type-practice)");

    let cardUrl = getCardUrl(item);

    if (cardUrl !== "#") {
        cardUrl = escapeHtml(cardUrl);
    }

    card.innerHTML =
        '<div class="card-top-v2">' +

        (shouldShowTypeLabel(item)
            ? '<span class="card-icon-badge" style="--tc: var(--type-practice)">✓</span>'
            : "") +

        typeLabelChip(item, "--type-practice", "Practice") +

        cardTopRight(examTagHtml(item)) +

        "</div>" +

        '<h3 class="card-title"></h3>' +

        (item.owner
            ? '<div class="card-meta">' +
            '<span>' + escapeHtml(item.owner) + '</span>' +
            "</div>"
            : "") +

        '<div class="card-foot">' +

        '<a class="card-action" href="' +
        cardUrl +
        '" target="_blank" rel="noopener noreferrer">' +

        actionLabel(item) +

        ' <span class="arrow">→</span>' +

        "</a>" +

        "</div>";

    card.querySelector(".card-title").textContent = item.title || "";

    wireCardAction(card, item);

    return card;
};


/* =========================================================
   PYQ (SUBJECT-WISE RESOURCE) CARD
   ========================================================= */

const buildPyqTypeCard = (item) => {
    const card = document.createElement("div");

    card.className = "resource-card pyqtype-card";
    card.style.setProperty("--tc", "var(--type-pyq)");

    let cardUrl = getCardUrl(item);

    if (cardUrl !== "#") {
        cardUrl = escapeHtml(cardUrl);
    }

    const metaBits = [item.exam, item.year].filter(Boolean);

    card.innerHTML =
        '<div class="card-top-v2">' +

        (shouldShowTypeLabel(item)
            ? '<span class="card-icon-badge">✎</span>'
            : "") +

        typeLabelChip(item, "--type-pyq", "PYQ") +

        cardTopRight(examTagHtml(item)) +

        "</div>" +

        '<h3 class="card-title"></h3>' +

        (metaBits.length
            ? '<div class="card-meta">' +
            metaBits
                .map(bit => "<span>" + escapeHtml(bit) + "</span>")
                .join("") +
            "</div>"
            : "") +

        '<div class="card-foot">' +

        '<a class="card-action" href="' +
        cardUrl +
        '" target="_blank" rel="noopener noreferrer">' +

        actionLabel(item) +

        ' <span class="arrow">→</span>' +

        "</a>" +

        "</div>";

    card.querySelector(".card-title").textContent = item.title || "";

    wireCardAction(card, item);

    return card;
};


/* =========================================================
   BOOK CARD
   ========================================================= */

const buildBookCard = (item) => {

    const card = document.createElement("div");

    card.className = "resource-card book-card";

    let cardUrl = getCardUrl(item);

    if (cardUrl !== "#") {
        cardUrl = escapeHtml(cardUrl);
    }

    const imageUrl = item.image
        ? escapeHtml(item.image)
        : "";

    card.innerHTML =

        '<div class="book-cover">' +

        (
            imageUrl
                ? '<img src="' +
                imageUrl +
                '" alt="' +
                escapeHtml(item.title || "Book") +
                '" loading="lazy">'

                : '<div class="book-cover-placeholder"></div>'
        ) +

        "</div>" +

        '<div class="book-card-content">' +

        '<h3 class="card-title"></h3>' +

        '<div class="book-best-for"></div>' +

        '<div class="card-foot">' +

        '<a class="card-action" href="' +
        cardUrl +
        '" target="_blank" rel="noopener noreferrer">' +

        actionLabel(item) +

        ' <span class="arrow">→</span>' +

        "</a>" +

        "</div>" +

        "</div>";

    card.querySelector(".card-title").textContent =
        item.title || "";

    card.querySelector(".book-best-for").textContent =
        item.bestFor || "";

    const action = card.querySelector(".card-action");

    action.addEventListener("click", event => {
        if (!item.url || item.url === "#") {
            event.preventDefault();
        }
    });

    return card;
};


/* =========================================================
   VIDEO CARD
   ========================================================= */

const buildVideoCard = (item) => {

    const card = document.createElement("div");

    card.className = "resource-card video-card";

    const videoId = extractYouTubeId(item.url);

    let videoUrl = "#";

    if (item.url && item.url !== "#") {
        videoUrl = escapeHtml(item.url);
    }

    let thumbInner = "";

    if (videoId) {

        thumbInner =
            '<img class="video-thumb-img" src="https://img.youtube.com/vi/' +
            videoId +
            '/hqdefault.jpg" alt="" loading="lazy" />';

    } else {

        thumbInner =
            '<div class="video-thumb-fallback"></div>';
    }

    card.innerHTML =

        '<div class="video-thumb">' +

        thumbInner +

        '<button class="play-badge" type="button" aria-label="Play video">' +

        '<svg width="15" height="17" viewBox="0 0 14 16" fill="none">' +

        '<path d="M1 1.2v13.6a1 1 0 0 0 1.53.85l11-6.8a1 1 0 0 0 0-1.7l-11-6.8A1 1 0 0 0 1 1.2Z" fill="currentColor"/>' +

        "</svg>" +

        "</button>" +

        "</div>" +

        '<div class="video-card-content">' +

        '<h3 class="card-title video-card-title"></h3>' +

        '<div class="video-best-for"></div>' +

        examTagHtml(item) +

        '<div class="card-foot">' +

        '<a class="card-action" href="' +
        videoUrl +
        '" target="_blank" rel="noopener noreferrer">' +

        "Watch Now" +

        '<span class="arrow">→</span>' +

        "</a>" +

        "</div>" +

        "</div>";

    card.querySelector(".video-card-title").textContent =
        item.title || "";

    card.querySelector(".video-best-for").textContent =
        item.bestFor || "";

    const thumbnail =
        card.querySelector(".video-thumb");

    const playButton =
        card.querySelector(".play-badge");

    if (!videoId) {
        playButton.style.display = "none";
    }

    playButton.addEventListener("click", event => {

        event.preventDefault();
        event.stopPropagation();

        if (!videoId) {
            return;
        }

        if (activeVideo && activeVideo !== thumbnail) {

            activeVideo.innerHTML =
                activeVideo.dataset.originalContent;

            activeVideo.classList.remove("video-playing");

            const oldButton =
                activeVideo.querySelector(".play-badge");

            if (oldButton) {
                oldButton.style.display = "";
            }
        }

        if (!thumbnail.dataset.originalContent) {

            thumbnail.dataset.originalContent =
                thumbnail.innerHTML;
        }

        thumbnail.innerHTML =

            '<iframe ' +

            'class="video-embed" ' +

            'src="https://www.youtube.com/embed/' +
            videoId +
            '?autoplay=1&rel=0" ' +

            'title="' +
            escapeHtml(item.title || "YouTube video") +
            '" ' +

            'frameborder="0" ' +

            'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +

            "allowfullscreen>" +

            "</iframe>";

        thumbnail.classList.add("video-playing");

        activeVideo = thumbnail;
    });

    return card;
};


/* =========================================================
   RESOURCE GRID
   ========================================================= */

export const renderGrid = (container, items) => {

    // If a video is currently playing inside the grid we're about to wipe,
    // drop the reference so it can be garbage collected and so the "stop
    // the previous video" logic never runs against a detached node.
    if (activeVideo && container.contains(activeVideo)) {
        activeVideo = null;
    }

    container.innerHTML = "";

    const fragment =
        document.createDocumentFragment();

    [...items]
        .sort(
            (a, b) =>
                (RESOURCE_ORDER[a.type] || 99) -
                (RESOURCE_ORDER[b.type] || 99)
        )
        .forEach(item => {

            fragment.appendChild(
                buildCard(item)
            );

        });

    container.appendChild(fragment);
};


/* =========================================================
   DPP CARDS
   ========================================================= */

export const renderDppCards = (container, items) => {

    container.innerHTML = "";

    const fragment =
        document.createDocumentFragment();

    items.forEach(item => {

        const card = document.createElement("div");

        card.className = "pyq-card dpp-card";

        card.style.setProperty("--tc", "var(--type-practice)");

        let dppUrl = getCardUrl(item);

        if (dppUrl !== "#") {
            dppUrl = escapeHtml(dppUrl);
        }

        card.innerHTML =

            '<div class="pyq-card-body">' +

            '<div class="dpp-card-header">' +

            '<h3 class="pyq-title"></h3>' +

            (item.qc
                ? '<span class="dpp-badge">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<circle cx="12" cy="12" r="10"></circle>' +
                '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>' +
                '<path d="M12 17h.01"></path>' +
                '</svg>' +
                '<span>' + escapeHtml(String(item.qc)) + ' Qs</span>' +
                '</span>'
                : "") +

            '</div>' +

            '<div class="pyq-card-foot">' +

            '<a class="card-action" href="' +
            dppUrl +
            '" target="_blank" rel="noopener noreferrer">' +

            actionLabel(item) +

            ' <span class="arrow">→</span>' +

            "</a>" +

            "</div>" +

            "</div>";

        card.querySelector(".pyq-title").textContent =
            item.title || "DPP";

        const action =
            card.querySelector(".card-action");

        action.addEventListener("click", event => {

            if (!item.url || item.url === "#") {
                event.preventDefault();
            }

        });

        fragment.appendChild(card);
    });

    container.appendChild(fragment);
};


/* =========================================================
   PYQ CARDS
   ========================================================= */

export const renderPyqCards = (container, items) => {

    container.innerHTML = "";

    const fragment =
        document.createDocumentFragment();

    items.forEach(item => {

        const card = document.createElement("div");

        card.className = "pyq-card";
        card.style.setProperty("--tc", "var(--type-pyq)");


        /* ---------- URL ---------- */

        let pyqUrl = getCardUrl(item);

        if (pyqUrl !== "#") {
            pyqUrl = escapeHtml(pyqUrl);
        }


        /* ---------- QUESTIONS ---------- */

        const questionsDetail =

            item.questions != null &&
                item.questions !== ""

                ? '<div class="pyq-detail">' +

                '<div class="pyq-detail-icon">' +

                '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +

                '<circle cx="12" cy="12" r="10"></circle>' +

                '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>' +

                '<path d="M12 17h.01"></path>' +

                "</svg>" +

                "</div>" +

                "<span>" +
                escapeHtml(String(item.questions)) +
                " Questions</span>" +

                "</div>"

                : "";


        /* ---------- DURATION ---------- */

        const durationDetail =

            item.duration != null &&
                item.duration !== ""

                ? '<div class="pyq-detail">' +

                '<div class="pyq-detail-icon">' +

                '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +

                '<path d="M12 6v6l4 2"></path>' +

                '<circle cx="12" cy="12" r="10"></circle>' +

                "</svg>" +

                "</div>" +

                "<span>" +
                escapeHtml(String(item.duration)) +
                " Minutes</span>" +

                "</div>"

                : "";


        /* ---------- MARKS ---------- */

        const marksDetail =

            item.marks != null &&
                item.marks !== ""

                ? '<div class="pyq-detail">' +

                '<div class="pyq-detail-icon">' +

                '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +

                '<path d="M21.801 10A10 10 0 1 1 17 3.335"></path>' +

                '<path d="m9 11 3 3L22 4"></path>' +

                "</svg>" +

                "</div>" +

                "<span>" +
                escapeHtml(String(item.marks)) +
                " Marks</span>" +

                "</div>"

                : "";


        /* ---------- DATE ---------- */

        const dateDetail =

            item.date != null &&
                item.date !== ""

                ? '<div class="pyq-detail">' +

                '<div class="pyq-detail-icon">' +

                '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +

                '<rect x="3" y="4" width="18" height="18" rx="2"></rect>' +

                '<line x1="16" y1="2" x2="16" y2="6"></line>' +

                '<line x1="8" y1="2" x2="8" y2="6"></line>' +

                '<line x1="3" y1="10" x2="21" y2="10"></line>' +

                "</svg>" +

                "</div>" +

                "<span>" +
                escapeHtml(String(item.date)) +
                "</span>" +

                "</div>"

                : "";


        /* ---------- SHIFT ---------- */

        const shiftDetail =

            item.shift != null &&
                item.shift !== ""

                ? '<div class="pyq-detail">' +

                '<div class="pyq-detail-icon">' +

                '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +

                '<rect x="3" y="4" width="18" height="16" rx="2"></rect>' +

                '<path d="M7 8h10"></path>' +

                '<path d="M7 12h4"></path>' +

                '<path d="M7 16h6"></path>' +

                "</svg>" +

                "</div>" +

                "<span>" +
                escapeHtml(String(item.shift)) +
                "</span>" +

                "</div>"

                : "";


        /* ---------- CARD ---------- */

        card.innerHTML =

            '<div class="pyq-card-body">' +

            '<h3 class="pyq-title"></h3>' +

            '<div class="pyq-details">' +

            questionsDetail +
            durationDetail +
            marksDetail +
            dateDetail +
            shiftDetail +

            "</div>" +

            '<div class="pyq-card-foot">' +

            '<a class="card-action" href="' +
            pyqUrl +
            '" target="_blank" rel="noopener noreferrer">' +

            actionLabel(item) +

            ' <span class="arrow">→</span>' +

            "</a>" +

            "</div>" +

            "</div>";


        card.querySelector(".pyq-title").textContent =
            item.title || "Question Paper";


        const action =
            card.querySelector(".card-action");


        action.addEventListener("click", event => {

            if (!item.url || item.url === "#") {
                event.preventDefault();
            }

        });


        fragment.appendChild(card);
    });

    container.appendChild(fragment);
};