"use strict";

import {
    TYPE_CLASS,
    RESOURCE_ORDER
} from "./config.js";

import {
    escapeHtml,
    actionLabel,
    extractYouTubeId
} from "./utils.js";

let activeVideo = null;

export const buildCard = (item) => {
    if (item.type === "Video") {
        return buildVideoCard(item);
    }

    const card = document.createElement("div");
    card.className = "resource-card";

    let typeClass = TYPE_CLASS[item.type];

    if (!typeClass) {
        typeClass = "type-notes";
    }

    let yearHtml = "";

    if (item.year) {
        yearHtml =
            '<span class="type-label" style="margin-left:auto;color:var(--text-faint)">' +
            escapeHtml(String(item.year)) +
            '</span>';
    }

    let cardUrl = "#";

    if (item.url && item.url !== "#") {
        cardUrl = escapeHtml(item.url);
    }

    card.innerHTML =
        '<div class="card-top">' +
        '<span class="type-dot" style="background: var(--' +
        typeClass +
        ')"></span>' +

        '<span class="type-label" style="color: var(--' +
        typeClass +
        ')">' +
        escapeHtml(item.type) +
        '</span>' +

        yearHtml +
        '</div>' +

        '<h3 class="card-title"></h3>' +

        '<p class="card-desc"></p>' +

        '<div class="card-meta">' +
        '<span><b>' +
        escapeHtml(item.difficulty || "") +
        '</b></span>' +

        '<span>' +
        escapeHtml(item.bestFor || "") +
        '</span>' +
        '</div>' +

        '<div class="card-foot">' +
        '<a class="card-action" href="' +
        cardUrl +
        '" target="_blank" rel="noopener noreferrer">' +

        actionLabel(item) +

        ' <span class="arrow">→</span>' +

        '</a>' +
        '</div>';

    card.querySelector(".card-title").textContent = item.title || "";

    card.querySelector(".card-desc").textContent = item.desc || "";

    const action = card.querySelector(".card-action");

    action.addEventListener("click", event => {
        if (!item.url || item.url === "#") {
            event.preventDefault();
        }
    });

    return card;
};

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
            '<div class="video-thumb-fallback">' +
            '<span class="type-label" style="color: var(--type-video)">Video</span>' +
            '</div>';
    }

    card.innerHTML =
        '<div class="video-thumb">' +
        thumbInner +

        '<button class="play-badge" type="button" aria-label="Play video">' +
        '<svg width="14" height="16" viewBox="0 0 14 16" fill="none">' +
        '<path d="M1 1.2v13.6a1 1 0 0 0 1.53.85l11-6.8a1 1 0 0 0 0-1.7l-11-6.8A1 1 0 0 0 1 1.2Z" fill="currentColor"/>' +
        '</svg>' +
        '</button>' +
        '</div>' +

        '<div class="video-card-content">' +

        '<h3 class="card-title video-card-title"></h3>' +

        '<div class="card-meta">' +
        '<span><b></b></span>' +
        '<span class="video-best-for"></span>' +
        '</div>' +

        '<div class="card-foot">' +
        '<a class="card-action" href="' +
        videoUrl +
        '" target="_blank" rel="noopener noreferrer">' +
        'Watch Now <span class="arrow">→</span>' +
        '</a>' +

        '</div>' +

        '</div>';

    card.querySelector(".video-card-title").textContent = item.title || "";

    card.querySelector(".card-meta b").textContent = item.difficulty || "";

    card.querySelector(".video-best-for").textContent = item.bestFor || "";

    const thumbnail = card.querySelector(".video-thumb");

    const playButton = card.querySelector(".play-badge");

    if (!videoId) {
        playButton.style.display = "none";
    }

    playButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        if (!videoId) return;

        if (activeVideo && activeVideo !== thumbnail) {
            activeVideo.innerHTML =
                activeVideo.dataset.originalContent;

            activeVideo.classList.remove("video-playing");

            const oldButton = activeVideo.querySelector(".play-badge");

            if (oldButton) {
                oldButton.style.display = "";
            }
        }

        if (!thumbnail.dataset.originalContent) {
            thumbnail.dataset.originalContent = thumbnail.innerHTML;
        }

        thumbnail.innerHTML =
            '<iframe ' +
            'class="video-embed" ' +
            'src="https://www.youtube.com/embed/' +
            videoId +
            '?autoplay=1&rel=0" ' +
            'title="' +
            escapeHtml(
                item.title ||
                "YouTube video"
            ) +
            '" ' +
            'frameborder="0" ' +
            'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
            'allowfullscreen' +
            '></iframe>';

        thumbnail.classList.add("video-playing");

        activeVideo = thumbnail;
    });

    return card;
};

export const renderGrid = (container, items) => {
    container.innerHTML = "";

    const fragment = document.createDocumentFragment();

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

export const renderDppCards = (container, items) => {
    container.innerHTML = "";

    const fragment = document.createDocumentFragment();

    items.forEach(item => {
        const card = document.createElement("div");

        card.className = "pyq-card dpp-card";

        let dppUrl = "#";

        if (item.url && item.url !== "#") {
            dppUrl = escapeHtml(item.url);
        }

        card.innerHTML =
            '<div class="pyq-card-body">' +

            '<h3 class="pyq-title"></h3>' +

            '<div class="pyq-card-foot">' +

            '<a class="card-action" href="' +
            dppUrl +
            '" target="_blank" rel="noopener noreferrer">' +

            actionLabel(item) +

            ' <span class="arrow">→</span>' +

            '</a>' +

            '</div>' +

            '</div>';

        card.querySelector(".pyq-title").textContent = item.title || "DPP";

        const action = card.querySelector(".card-action");

        action.addEventListener("click", event => {
            if (!item.url || item.url === "#") {
                event.preventDefault();
            }
        });

        fragment.appendChild(card);
    });

    container.appendChild(fragment);
};

export const renderPyqCards = (container, items) => {
    container.innerHTML = "";

    const fragment = document.createDocumentFragment();

    items.forEach(item => {
        const card = document.createElement("div");

        card.className = "pyq-card";

        let pyqUrl = "#";

        if (item.url && item.url !== "#") {
            pyqUrl = escapeHtml(item.url);
        }

        card.innerHTML =
            '<div class="pyq-card-body">' +

            '<h3 class="pyq-title"></h3>' +

            '<div class="pyq-card-foot">' +

            '<a class="card-action" href="' +
            pyqUrl +
            '" target="_blank" rel="noopener noreferrer">' +

            actionLabel(item) +

            ' <span class="arrow">→</span>' +

            '</a>' +

            '</div>' +

            '</div>';

        card.querySelector(".pyq-title").textContent = item.title || "Question Paper";

        const action = card.querySelector(".card-action");

        action.addEventListener("click", event => {
            if (!item.url || item.url === "#") {
                event.preventDefault();
            }
        });

        fragment.appendChild(card);
    });

    container.appendChild(fragment);
};