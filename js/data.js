"use strict";

import {
    DATA_FILE_ENTRIES,
    ANNOUNCEMENTS_FILE,
    PYQS_FILE
} from "./config.js";

import { state } from "./state.js";

import { deriveMathChapter } from "./utils.js";

const loadFile = (entry) => {
    return fetch(entry.path).then(response => {
        if (!response.ok) {
            throw new Error(
                `Failed to load ${entry.path}`
            );
        }

        return response.json();
    }).then(items => {
        const list = Array.isArray(items) ? items : [];

        return list.map(item => {
            const merged = {
                subject: entry.subject,
                type: entry.type,
                ...item
            };

            if (merged.subject === "Mathematics" && !merged.chapter) {
                const guessed = deriveMathChapter(merged.title);

                if (guessed) {
                    merged.chapter = guessed;
                }
            }

            return merged;
        });
    });
};

const loadOptional = (path) => {
    return fetch(path)
        .then(response => {
            if (response.ok) {
                return response.json();
            }

            return [];
        })
        .catch(() => []);
};

export const loadData = () => {
    return Promise.all(
        DATA_FILE_ENTRIES.map(loadFile)
    ).then(lists => {
        state.resources = lists.flat();
    });
};

export const loadOptionalData = () => {
    return Promise.all([
        loadOptional(ANNOUNCEMENTS_FILE),
        loadOptional(PYQS_FILE)
    ]).then(([announcements, pyqs]) => {
        if (Array.isArray(announcements)) {
            state.announcements = announcements;
        } else {
            state.announcements = [];
        }

        if (Array.isArray(pyqs)) {
            state.pyqs = pyqs;
        } else {
            state.pyqs = [];
        }
    });
};

export const loadAllData = () => {
    return loadData()
        .then(loadOptionalData);
};