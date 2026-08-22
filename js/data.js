"use strict";

import {
    DATA_FILES,
    ANNOUNCEMENTS_FILE,
    PYQS_FILE
} from "./config.js";

import { state } from "./state.js";

const loadFile = (path) => {
    return fetch(path).then(response => {
        if (!response.ok) {
            throw new Error(
                `Failed to load ${path}`
            );
        }

        return response.json();
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
        DATA_FILES.map(loadFile)
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