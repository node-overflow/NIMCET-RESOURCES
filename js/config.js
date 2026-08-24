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
        full: "CUET PG MCA Entrance",
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
    { name: "NIT Agartala", city: "Agartala, Tripura", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLNpH4mRl0Hp-OMiwN-rgp66Ir2Qc-uq65MnSluGpGdA&s" },
    { name: "NIT Allahabad", city: "Prayagraj, UP", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCjlJmzy3SwbXTToC1g4J5U3ivse_DitryBGq31zqMNg&s" },
    { name: "NIT Bhopal", city: "Bhopal, MP", logo: "https://upload.wikimedia.org/wikipedia/en/4/4f/Maulana_Azad_National_Institute_of_Technology_Logo.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original" },
    { name: "NIT Delhi", city: "New Delhi", logo: "https://media.licdn.com/dms/image/v2/C4D0BAQGXwJsFdmcZAQ/company-logo_200_200/company-logo_200_200/0/1631334583369?e=2147483647&v=beta&t=ePdZd3zMeBCVTJgw_Jn2RwIpyIovgQbV3KdeS5xLhR4" },
    { name: "NIT Jamshedpur", city: "Jamshedpur, Jharkhand", logo: "https://www.upgrad.com/_ww3-next/image/?url=https%3A%2F%2Fd2o2utebsixu4k.cloudfront.net%2FLOGO_12_optimized_100-40bce995e88c457c8ae65fe283df2b59.png&w=3840&q=75" },
    { name: "NIT Kurukshetra", city: "Kurukshetra, Haryana", logo: "https://www.upgrad.com/_ww3-next/image/?url=https%3A%2F%2Fd2o2utebsixu4k.cloudfront.net%2FNIT%20Kurukshetra-f4e0725b871e412ba740bdafdf61e616.jpeg&w=3840&q=75" },
    { name: "NIT Meghalaya", city: "Shillong, Meghalaya", logo: "https://nitm.ac.in/icepe2023/assets/img/nitmlogo.jpg" },
    { name: "NIT Patna", city: "Patna, Bihar", logo: "https://upload.wikimedia.org/wikipedia/en/b/b5/National_Institute_of_Technology%2C_Patna_Logo.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original" },
    { name: "NIT Raipur", city: "Raipur, Chhattisgarh", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/National_Institute_of_Technology%2C_Raipur_Logo.png/250px-National_Institute_of_Technology%2C_Raipur_Logo.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail" },
    { name: "NIT Tiruchirappalli", city: "Tiruchirappalli, TN", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/National_Institute_of_Technology%2C_Tiruchirappalli.svg/1280px-National_Institute_of_Technology%2C_Tiruchirappalli.svg.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail" },
    { name: "NIT Warangal", city: "Warangal, Telangana", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU8qaAPsQDPlcMDb_dKjRUYmMen8C_aglNt0ayZNZaBj6GY0XH4cfuM1eD&s=10" }
];

export const FAQS = [
    {
        q: "What is NIMCET?",
        a: "NIMCET is a national-level entrance exam for admission to the MCA programme at participating NITs and IIITs. It is conducted every year by one of the participating NITs."
    },
    {
        q: "Which institutes accept NIMCET scores?",
        a: "Your NIMCET All India Rank is used for counselling and admission to the participating NITs and IIITs. Check the \"Aim for these NITs\" section above to see the full list."
    },
    {
        q: "Is everything on this site free?",
        a: "Yes. All the books, notes, PYQs, DPPs and videos linked here are free to access. This site simply collects and organises study material that is already publicly available."
    },
    {
        q: "How are DPPs organised?",
        a: "DPPs are organised by subject and then by chapter. This makes it easier to practise one topic at a time without searching through a long PDF."
    },
    {
        q: "Where do I find previous year papers?",
        a: "Go to the PYQs section and select an exam. The papers are organised by year, with the latest papers listed first."
    },
    {
        q: "Are mock tests available?",
        a: "Mock tests are coming soon. The Mocks section will be available once they are ready."
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