"use strict";

import { loadAllData } from "./data.js";

import { wireStaticEvents } from "./events.js";

import { wireThemeToggle } from "./theme.js";

import { updateUnreadBadge } from "./updates.js";

import { goHome, initHistoryNavigation } from "./navigation.js";

import { elViewHome } from "./dom.js";

import { TELEGRAM_URL } from "./config.js";

const wireFooterCommunityLink = () => {
    const link = document.querySelector(".footer-social-link");

    if (link) {
        link.href = TELEGRAM_URL;
    }
};

const showLoadError = error => {
    console.error(error);

    elViewHome.innerHTML =
        '<div class="empty-state" style="margin-top:40px;">' +

        '<p class="empty-title">' +
        'Could not load resources' +
        '</p>' +

        '<p class="empty-sub">' +
        'Serve this folder with a local server ' +
        '(data files are fetched via HTTP) and reload.' +
        '</p>' +

        '</div>';
};

const init = async () => {
    wireThemeToggle();
    wireFooterCommunityLink();

    try {
        await loadAllData();

        wireStaticEvents();

        updateUnreadBadge();

        goHome();

        initHistoryNavigation();

    } catch (error) {
        showLoadError(error);
    }
};

init();