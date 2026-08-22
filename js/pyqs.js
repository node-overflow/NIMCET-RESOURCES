"use strict";

import { EXAMS } from "./config.js";

import {
    elExamGrid,
    elExamsEmpty,
    elPyqsExamHeading,
    elPyqsExamCount,
    elPyqsExamGrid,
    elPyqsExamEmpty
} from "./dom.js";

import { state } from "./state.js";

import {
    countByExam,
    escapeHtml
} from "./utils.js";

import { renderPyqCards } from "./cards.js";

export const examByKey = key => {
    return EXAMS.find(exam => exam.key === key) || null;
};

export const renderExamGrid = onExamClick => {
    elExamGrid.innerHTML = "";

    EXAMS.forEach(exam => {
        const button = document.createElement("button");

        button.className = "subject-card";
        button.type = "button";

        const count = countByExam(exam.key);

        let paperLabel = " papers";

        if (count === 1) {
            paperLabel = " paper";
        }

        button.innerHTML =
            '<span class="subject-symbol">' +
            escapeHtml(exam.symbol) +
            '</span>' +

            '<span class="subject-name">' +
            escapeHtml(exam.name) +
            '</span>' +

            '<span class="subject-count">' +
            count +
            paperLabel +
            '</span>';

        button.title = exam.full;

        button.addEventListener("click", () => {
            onExamClick(exam.key);
        });

        elExamGrid.appendChild(button);
    });

    elExamsEmpty.hidden = EXAMS.length > 0;
};

export const renderPyqsExam = () => {
    const exam = examByKey(state.examKey);

    let name = state.examKey;

    if (exam) {
        name = exam.name;
    }

    elPyqsExamHeading.textContent = name || "Exam";

    const results = state.pyqs
        .filter(
            paper =>
                paper.exam ===
                state.examKey
        )
        .slice()
        .sort(
            (a, b) =>
                (b.year || 0) -
                (a.year || 0)
        );

    let paperLabel = " papers";

    if (results.length === 1) {
        paperLabel = " paper";
    }

    let examLabel = "";

    if (exam) {
        examLabel = " — " + exam.full;
    }

    elPyqsExamCount.textContent =
        results.length +
        paperLabel +
        examLabel;

    if (results.length === 0) {
        elPyqsExamGrid.innerHTML = "";
        elPyqsExamGrid.hidden = true;
        elPyqsExamEmpty.hidden = false;
        return;
    }

    elPyqsExamGrid.hidden = false;
    elPyqsExamEmpty.hidden = true;

    renderPyqCards(
        elPyqsExamGrid,
        results
    );
};