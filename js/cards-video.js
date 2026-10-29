"use strict";

import { escapeHtml, extractYouTubeId } from "./utils.js";

import { examTagHtml } from "./cards-shared.js";

/* =========================================================
   VIDEO CARD
   ========================================================= */

// Tracks the single currently-playing inline video thumbnail so that
// starting a new video collapses any previously playing one.
let activeVideo = null;

export const clearActiveVideoIfInside = (container) => {
    if (activeVideo && container.contains(activeVideo)) {
        activeVideo = null;
    }
};

const restoreThumbnail = (thumbnail) => {
    if (!thumbnail || !thumbnail.dataset.originalContent) {
        return;
    }

    thumbnail.innerHTML = thumbnail.dataset.originalContent;
    thumbnail.classList.remove("video-playing");

    if (activeVideo === thumbnail) {
        activeVideo = null;
    }
};

const playInlineVideo = (thumbnail) => {
    const videoId = thumbnail.dataset.videoId;
    if (!videoId) {
        return;
    }

    // Already playing this one — ignore
    if (activeVideo === thumbnail) {
        return;
    }

    // Stop any other currently playing video
    if (activeVideo && activeVideo !== thumbnail) {
        restoreThumbnail(activeVideo);
    }

    // Capture original thumbnail HTML once (before first play)
    if (!thumbnail.dataset.originalContent) {
        thumbnail.dataset.originalContent = thumbnail.innerHTML;
    }

    const title = thumbnail.dataset.videoTitle || "YouTube video";

    thumbnail.innerHTML =
        '<iframe ' +
        'class="video-embed" ' +
        'src="https://www.youtube.com/embed/' +
        videoId +
        '?autoplay=1&rel=0" ' +
        'title="' +
        escapeHtml(title) +
        '" ' +
        'frameborder="0" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
        "allowfullscreen>" +
        "</iframe>";

    thumbnail.classList.add("video-playing");
    activeVideo = thumbnail;
};

export const buildVideoCard = (item) => {

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
    } else {
        // Persist id/title on the thumbnail so play works after restore
        thumbnail.dataset.videoId = videoId;
        thumbnail.dataset.videoTitle = item.title || "YouTube video";

        // Save original content NOW, before any play, so restore is clean
        thumbnail.dataset.originalContent = thumbnail.innerHTML;

        // Event delegation on the stable thumbnail element.
        // The play button is destroyed/recreated on play/restore, but
        // the thumbnail node itself never is — so this listener always works.
        thumbnail.addEventListener("click", event => {
            // Only react to clicks on the play badge (or its children, e.g. SVG)
            const badge = event.target.closest(".play-badge");
            if (!badge || !thumbnail.contains(badge)) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            playInlineVideo(thumbnail);
        });
    }

    return card;
};
