"use strict";

export const DATA_FILES = [
    "math",
    "reasoning",
    "computer",
    "quants",
    "english"
].flatMap(subject =>
    [
        "books",
        "pyqs",
        "notes",
        "videos",
        "practice",
        "formulas"
    ].map(type => `data/${subject}/${type}.json`)
);

export const ANNOUNCEMENTS_FILE = "data/other/announcements.json";
export const PYQS_FILE = "data/other/pyqs.json";

export const DPP_SUBJECT_SLUGS = {
    "Mathematics": "math",
    "Logical Reasoning": "reasoning",
    "Computer": "computer",
    "Quantitative Aptitude": "quants",
    "English": "english"
};

export const dppManifestPath = (subjectSlug) =>
    `data/dpp/${subjectSlug}/manifest.json`;

export const dppChapterPath = (subjectSlug, chapterKey) =>
    `data/dpp/${subjectSlug}/${chapterKey}.json`;

export const MOCK_TYPES = [
    {
        key: "free",
        name: "Free Mocks",
        symbol: "F"
    },
    {
        key: "paid",
        name: "Paid Mocks",
        symbol: "P"
    }
];

export const UPDATE_CATEGORIES = [
    {
        key: "Notification",
        label: "Notification",
        cssVar: "--upd-notification"
    },
    {
        key: "Exam Date",
        label: "Exam Date",
        cssVar: "--upd-exam-date"
    },
    {
        key: "Admit Card",
        label: "Admit Card",
        cssVar: "--upd-admit-card"
    },
    {
        key: "Result",
        label: "Result",
        cssVar: "--upd-result"
    },
    {
        key: "Important",
        label: "Important",
        cssVar: "--upd-important"
    }
];

export const UPDATE_CATEGORY_VAR = Object.fromEntries(
    UPDATE_CATEGORIES.map(category => [
        category.key,
        category.cssVar
    ])
);

export const NEW_WITHIN_DAYS = 7;

export const EXAMS = [
    {
        key: "NIMCET",
        name: "NIMCET",
        full: "NIT MCA Common Entrance Test",
        symbol: "N"
    },
    {
        key: "CUET PG MCA",
        name: "CUET PG MCA",
        full: "CUET PG — MCA Entrance",
        symbol: "C"
    },
    {
        key: "TANCET",
        name: "TANCET",
        full: "Tamil Nadu Common Entrance Test (MCA)",
        symbol: "T"
    },
    {
        key: "DU MCA",
        name: "DU MCA",
        full: "Delhi University MCA Entrance",
        symbol: "D"
    },
    {
        key: "BHU MCA",
        name: "BHU MCA",
        full: "Banaras Hindu University MCA Entrance",
        symbol: "B"
    },
    {
        key: "JMI",
        name: "JMI",
        full: "Jamia Millia Islamia MCA Entrance",
        symbol: "J"
    }
];

export const NITS = [
    { name: "NIT Agartala", city: "Agartala, Tripura", code: "NITA" },
    { name: "NIT Allahabad", city: "Prayagraj, UP", code: "MNNIT" },
    { name: "NIT Bhopal", city: "Bhopal, MP", code: "MANIT" },
    { name: "NIT Delhi", city: "New Delhi", code: "NITD" },
    { name: "NIT Jamshedpur", city: "Jamshedpur, Jharkhand", code: "NITJSR" },
    { name: "NIT Kurukshetra", city: "Kurukshetra, Haryana", code: "NITK" },
    { name: "NIT Meghalaya", city: "Shillong, Meghalaya", code: "NITM" },
    { name: "NIT Patna", city: "Patna, Bihar", code: "NITP" },
    { name: "NIT Raipur", city: "Raipur, Chhattisgarh", code: "NITRR" },
    { name: "NIT Tiruchirappalli", city: "Tiruchirappalli, TN", code: "NITT" },
    { name: "NIT Warangal", city: "Warangal, Telangana", code: "NITW" }
];

export const FAQS = [
    {
        q: "What is NIMCET?",
        a: "NIMCET (NIT MCA Common Entrance Test) is a national-level entrance exam for admission to the MCA programme at participating NITs and IIITs. It's conducted every year by one of the participating NITs on a rotational basis."
    },
    {
        q: "Which institutes accept NIMCET scores?",
        a: "Your NIMCET All India Rank is used for centralised counselling across the participating NITs and IIITs. Check the \"Aim for these NITs\" section above for the full list of institutes."
    },
    {
        q: "Is everything on this site free?",
        a: "Yes. Every book, note, PYQ, DPP and video linked here is free to access — this hub simply curates and organises material that's already publicly available, by subject and difficulty."
    },
    {
        q: "How are DPPs organised?",
        a: "Daily Practice Problems are grouped by subject and then by chapter, so you can drill one topic at a time instead of hunting through a single long PDF."
    },
    {
        q: "Where do I find previous year papers?",
        a: "Head to the PYQs section and pick an exam — papers are sorted by year so you can start with the most recent ones first."
    },
    {
        q: "Are mock tests available?",
        a: "Free and paid mock tests are on the way — the Mocks section will light up as soon as they're ready."
    }
];

export const SUBJECTS = [
    {
        name: "Mathematics",
        symbol: "Σ"
    },
    {
        name: "Logical Reasoning",
        symbol: "→"
    },
    {
        name: "Computer",
        symbol: "{ }"
    },
    {
        name: "Quantitative Aptitude",
        symbol: "%"
    },
    {
        name: "English",
        symbol: "Aa"
    }
];

export const TYPES = [
    {
        key: "Book",
        label: "Books"
    },
    {
        key: "PYQ",
        label: "PYQs"
    },
    {
        key: "Notes",
        label: "Notes"
    },
    {
        key: "Video",
        label: "Videos"
    },
    {
        key: "Practice",
        label: "Practice"
    },
    {
        key: "Formula",
        label: "Formulas"
    }
];

export const TYPE_CLASS = {
    Book: "type-book",
    PYQ: "type-pyq",
    Notes: "type-notes",
    Video: "type-video",
    Practice: "type-practice",
    Formula: "type-formula"
};

export const RESOURCE_ORDER = {
    Book: 1,
    PYQ: 2,
    Notes: 3,
    Practice: 4,
    Formula: 5,
    Video: 6
};

export const MONTH_SHORT = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
];