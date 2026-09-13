"use strict";

/* =========================================================
   DATA FILE WIRING (subjects x resource types -> JSON paths)
   ========================================================= */

const SUBJECT_BY_SLUG = {
    math: "Mathematics",
    reasoning: "Logical Reasoning",
    computer: "Computer",
    quants: "Quantitative Aptitude",
    english: "English"
};

const TYPE_BY_FILE = {
    books: "Book",
    pyqs: "PYQ",
    notes: "Notes",
    videos: "Video",
    practice: "Practice",
    formulas: "Formula"
};

export const DATA_FILE_ENTRIES = Object.keys(SUBJECT_BY_SLUG).flatMap(subjectSlug =>
    Object.keys(TYPE_BY_FILE).map(typeFile => ({
        path: `data/${subjectSlug}/${typeFile}.json`,
        subject: SUBJECT_BY_SLUG[subjectSlug],
        type: TYPE_BY_FILE[typeFile]
    }))
);

export const ANNOUNCEMENTS_FILE = "data/other/announcements.json";
export const PYQS_FILE = "data/other/pyqs.json";
export const FAQS_FILE = "data/other/faqs.json";

/* =========================================================
   DPP FILE WIRING
   ========================================================= */

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

export const DPP_STATS_FILE = "data/dpp/stats.json";

/* =========================================================
   MOCKS
   ========================================================= */

export const MOCK_TYPES = [
    { key: "free", name: "Free Mocks", symbol: "F" },
    { key: "paid", name: "Paid Mocks", symbol: "P" }
];

/* =========================================================
   UPDATES / ANNOUNCEMENTS
   ========================================================= */

export const UPDATE_CATEGORIES = [
    { key: "Notification", label: "Notification", cssVar: "--upd-notification" },
    { key: "Exam Date", label: "Exam Date", cssVar: "--upd-exam-date" },
    { key: "Admit Card", label: "Admit Card", cssVar: "--upd-admit-card" },
    { key: "Result", label: "Result", cssVar: "--upd-result" },
    { key: "Important", label: "Important", cssVar: "--upd-important" }
];

export const UPDATE_CATEGORY_VAR = Object.fromEntries(
    UPDATE_CATEGORIES.map(category => [
        category.key,
        category.cssVar
    ])
);

export const NEW_WITHIN_DAYS = 7;

export const MONTH_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/* =========================================================
   EXAMS (used for PYQ browsing)
   ========================================================= */

export const EXAMS = [
    { key: "NIMCET", name: "NIMCET", full: "NIT MCA Common Entrance Test", symbol: "N" },
    { key: "CUET PG MCA", name: "CUET PG MCA", full: "CUET PG MCA Entrance", symbol: "C" },
    { key: "JEE MAIN MATH", name: "JEE MAIN MATH", full: "JOIN ENTRACE EXAMINATION MAIN", symbol: "JM" },
    { key: "JEE ADVANCED MATH", name: "JEE ADVANCED MATH", full: "JOIN ENTRACE EXAMINATION ADVANCED", symbol: "JA" },
    { key: "TANCET", name: "TANCET", full: "Tamil Nadu Common Entrance Test (MCA)", symbol: "T" },
    { key: "WB JECA", name: "WB JECA", full: "West Bengal MCA Entrance", symbol: "J" },
    { key: "MAH CET", name: "MAH CET", full: "Maharashtra Common Entrance Test (MCA)", symbol: "M" },
    { key: "JAMIA MCA", name: "JAMIA MCA", full: "Jamia Millia Islamia MCA Entrance", symbol: "J" },
    { key: "DU MCA", name: "DU MCA", full: "Delhi University MCA Entrance", symbol: "D" },
    { key: "BHU MCA", name: "BHU MCA", full: "Banaras Hindu University MCA Entrance", symbol: "B" },
    { key: "JNU MCA", name: "JNU MCA", full: "Jawaharlal Nehru University MCA Entrance", symbol: "J" }
];

/* =========================================================
   SUBJECTS / RESOURCE TYPES
   ========================================================= */

export const SUBJECTS = [
    { name: "Mathematics", symbol: "Σ" },
    { name: "Logical Reasoning", symbol: "📊︎", symbolMobile: "?!" },
    { name: "Computer", symbol: "</>" },
    { name: "Quantitative Aptitude", symbol: "%" },
    { name: "English", symbol: "Aa" }
];

export const TYPES = [
    { key: "Book", label: "Books" },
    { key: "PYQ", label: "PYQs" },
    { key: "Notes", label: "Notes" },
    { key: "Video", label: "Videos" },
    { key: "Practice", label: "Practice" },
    { key: "Formula", label: "Formulas" }
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

export const TELEGRAM_URL = "https://t.me/nimcet2027group";

/* =========================================================
   MATH CHAPTER DETECTION
   (used to auto-tag Mathematics resources with a chapter)
   ========================================================= */

export const MATH_CHAPTER_KEYWORDS = [
    {
        chapter: "Inverse Trigonometric Functions", order: 15,
        keywords: ["itf", "inverse trigonometric", "inverse trig function", "inverse circular function", "arcsin", "arccos", "arctan"]
    },
    {
        chapter: "Solutions of Triangle", order: 16,
        keywords: ["solution of triangle", "solutions of triangle", "solutions of triangles", "properties of triangle", "properties of triangles"]
    },
    {
        chapter: "Height & Distance", order: 17,
        keywords: ["height and distance", "heights and distances", "height & distance"]
    },
    {
        chapter: "Trigonometry", order: 14,
        keywords: ["trigonometry", "trigonometric", "trig identit", "trigonometric ratio", "trigonometric identit", "trigonometric equation"]
    },
    {
        chapter: "Application of Derivatives", order: 27,
        keywords: ["application of derivative", "applications of derivative", "aod", "tangent and normal", "maxima and minima", "maxima minima", "maxima & minima", "increasing and decreasing function", "increasing & decreasing function", "monotonicity", "rolle's theorem", "mean value theorem", "rate of change"]
    },
    {
        chapter: "Differentiation", order: 26,
        keywords: ["differentiation", "derivative", "derivatives"]
    },
    {
        chapter: "Continuity", order: 24,
        keywords: ["continuity"]
    },
    {
        chapter: "Differentiability", order: 25,
        keywords: ["differentiability"]
    },
    {
        chapter: "Indefinite Integration", order: 28,
        keywords: ["indefinite integral", "indefinite integration", "integration by parts", "integration by substitution", "methods of integration"]
    },
    {
        chapter: "Definite Integration", order: 29,
        keywords: ["definite integral", "definite integration", "fundamental theorem of calculus", "properties of definite integral"]
    },
    {
        chapter: "Area Under Curve", order: 30,
        keywords: ["area under curve", "area under the curve", "area bounded by curve", "area bounded by curves"]
    },
    {
        chapter: "Differential Equations", order: 31,
        keywords: ["differential equation", "differential equations", "differential eqn", "diff eq", "order and degree"]
    },
    {
        chapter: "Matrices", order: 12,
        keywords: ["matrix", "matrices"]
    },
    {
        chapter: "Determinants", order: 13,
        keywords: ["determinant", "determinants"]
    },
    {
        chapter: "Sequence & Series", order: 8,
        keywords: ["sequence", "series", "progression", "ap and gp", "ap-gp", "arithmetic progression", "geometric progression", "harmonic progression"]
    },
    {
        chapter: "Binomial Theorem", order: 9,
        keywords: ["binomial"]
    },
    {
        chapter: "Permutation & Combination", order: 10,
        keywords: ["permutation", "combination", "npr", "ncr", "p and c", "p & c", "fundamental principle of counting", "pnc", "p&c"]
    },
    {
        chapter: "Probability", order: 11,
        keywords: ["probability"]
    },
    {
        chapter: "Quadratic Equations", order: 7,
        keywords: ["quadratic"]
    },
    {
        chapter: "Straight Lines", order: 18,
        keywords: ["straight line", "straight lines"]
    },
    {
        chapter: "Circle", order: 19,
        keywords: ["circle", "circles"]
    },
    {
        chapter: "Parabola", order: 20,
        keywords: ["parabola"]
    },
    {
        chapter: "Ellipse", order: 21,
        keywords: ["ellipse"]
    },
    {
        chapter: "Hyperbola", order: 22,
        keywords: ["hyperbola"]
    },
    {
        chapter: "Limits", order: 23,
        keywords: ["limit", "limits"]
    },
    {
        chapter: "Statistics", order: 32,
        keywords: ["statistics", "statistical", "mean median mode", "standard deviation", "measures of dispersion", "measures of central tendency"]
    },
    {
        chapter: "Sets", order: 4,
        keywords: ["set theory", "sets", "venn diagram"]
    },
    {
        chapter: "Relations", order: 5,
        keywords: ["relation", "relations"]
    },
    {
        chapter: "Basic Mathematics", order: 1,
        keywords: ["basic math", "basic maths", "basic mathematics", "fundamentals of mathematics", "number system"]
    },
    {
        chapter: "Logarithm", order: 2,
        keywords: ["logarithm", "logarithmic", "log function", "log functions"]
    },
    {
        chapter: "Inequalities", order: 3,
        keywords: ["inequalit", "inequation"]
    },
    {
        chapter: "Complex Numbers", order: 33,
        keywords: ["complex number", "complex numbers"]
    },
    {
        chapter: "Vectors", order: 34,
        keywords: ["vector", "vectors"]
    },
    {
        chapter: "3D Geometry", order: 35,
        keywords: ["3d geometry", "three dimensional geometry", "three-dimensional geometry", "3-d geometry"]
    },
    {
        chapter: "Algebra", order: 36,
        keywords: ["algebra"]
    },
    {
        chapter: "Functions", order: 6,
        keywords: ["function", "functions"]
    }
];