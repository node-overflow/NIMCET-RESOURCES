"use strict";

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

export const MOCK_TYPES = [
    { key: "free", name: "Free Mocks", symbol: "F" },
    { key: "paid", name: "Paid Mocks", symbol: "P" }
];

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

export const FAQS_FILE = "data/other/faqs.json";

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
        keywords: ["application of derivative", "applications of derivative", "aod", "tangent and normal", "maxima and minima", "maxima minima", "increasing and decreasing function", "monotonicity", "rolle's theorem", "mean value theorem", "rate of change"]
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

export const MONTH_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export const TELEGRAM_URL = "https://t.me/nimcet2027group";

/* =========================================================
   EXAM PATTERN
   ========================================================= */

export const EXAM_PATTERN_SECTIONS = [
    { section: "Mathematics", questions: 50, marks: 600, weight: "60%", correct: 12, incorrect: 3 },
    { section: "Analytical Ability & Logical Reasoning", questions: 40, marks: 240, weight: "24%", correct: 6, incorrect: 1.5 },
    { section: "Computer Awareness", questions: 20, marks: 120, weight: "12%", correct: 6, incorrect: 1.5 },
    { section: "General English", questions: 10, marks: 40, weight: "4%", correct: 4, incorrect: 1 }
];

export const EXAM_PATTERN_META = {
    totalQuestions: 120,
    totalMarks: 120,
    duration: "2 Hours",
    negativeMarking: "-1 for every wrong answer",
    mode: "Computer Based Test (CBT)",
    note: "Pattern shown is a general guide based on past years. Always cross-check the latest details on the official NIMCET notification before finalising your strategy."
};

/* =========================================================
   FOCUS AREAS BY SUBJECT (guidance, not official statistics)
   ========================================================= */

export const FOCUS_AREAS = {
    "Mathematics": [
        { chapter: "Coordinate Geometry", level: "High" },
        { chapter: "Calculus (Limits, Continuity, Differentiation)", level: "High" },
        { chapter: "Trigonometry", level: "High" },
        { chapter: "Probability", level: "Medium" },
        { chapter: "Vectors & 3D Geometry", level: "Medium" },
        { chapter: "Algebra & Complex Numbers", level: "Medium" }
    ],
    "Logical Reasoning": [
        { chapter: "Series & Pattern Completion", level: "High" },
        { chapter: "Blood Relations & Direction Sense", level: "Medium" },
        { chapter: "Coding-Decoding", level: "Medium" },
        { chapter: "Syllogisms & Statements", level: "High" },
        { chapter: "Puzzles & Arrangements", level: "Medium" }
    ],
    "Computer": [
        { chapter: "Computer Fundamentals", level: "High" },
        { chapter: "Number Systems", level: "High" },
        { chapter: "Basic Programming Concepts", level: "Medium" },
        { chapter: "Data Representation", level: "Medium" }
    ],
    "Quantitative Aptitude": [
        { chapter: "Percentages, Profit & Loss", level: "High" },
        { chapter: "Time, Speed & Distance", level: "High" },
        { chapter: "Ratio, Proportion & Averages", level: "Medium" },
        { chapter: "Simple & Compound Interest", level: "Medium" }
    ],
    "English": [
        { chapter: "Vocabulary & Synonyms/Antonyms", level: "High" },
        { chapter: "Reading Comprehension", level: "High" },
        { chapter: "Grammar & Error Spotting", level: "Medium" },
        { chapter: "Sentence Rearrangement", level: "Medium" }
    ]
};

/* =========================================================
   PREPARATION ROADMAP
   ========================================================= */

export const PREP_ROADMAP = [
    {
        phase: "Phase 1",
        window: "Foundation",
        title: "Build the base",
        desc: "Cover NCERT-level concepts across all sections. Do not worry about speed yet, focus on clarity. Make a chapter list and tick off each topic as you actually understand it, not just skim through it."
    },
    {
        phase: "Phase 2",
        window: "Practice",
        title: "Chapter-wise drilling",
        desc: "Move into chapter-wise DPPs and practice sets. Time yourself on small sets. This is where weak chapters start showing up, so note them down instead of avoiding them."
    },
    {
        phase: "Phase 3",
        window: "PYQ Immersion",
        title: "Live in the previous papers",
        desc: "Attempt PYQs exam-wise, under real time constraints. Review every wrong answer the same day. Patterns repeat across years far more than people expect."
    },
    {
        phase: "Phase 4",
        window: "Full Mocks",
        title: "Simulate exam day",
        desc: "Full-length mock tests, timed like the real exam. Track your score trend, not just one attempt. Rest and revision matter just as much here."
    },
    {
        phase: "Phase 5",
        window: "Final Sprint",
        title: "Revise, don't relearn",
        desc: "As the exam gets closer, stop learning new topics. Revisit formula sheets, redo mistakes from your mock tests, and keep your confidence steady."
    }
];

/* =========================================================
   MYTH VS FACT
   ========================================================= */

export const MYTHS_FACTS = [
    {
        myth: "You need an expensive coaching program to crack NIMCET.",
        fact: "Consistent self-study with the right PYQs, DPPs and notes has helped aspirants reach NITs for years. Good resources matter more than price tags."
    },
    {
        myth: "Only Mathematics matters for NIMCET.",
        fact: "Math carries the highest weight, but Logical Reasoning and Computer Awareness can be scoring sections that many aspirants under-prepare for."
    },
    {
        myth: "Solving new questions is more valuable than PYQs.",
        fact: "PYQs show the exact style and difficulty NIMCET tends to repeat year after year. They are often the most useful practice you can do."
    },
    {
        myth: "You should start mocks only after finishing the syllabus.",
        fact: "Starting mocks early, even with an incomplete syllabus, helps you get comfortable with the pressure and timing you will face on the actual day."
    },
    {
        myth: "A free platform can't offer serious mock tests.",
        fact: "Our mock tests stay free by default. A premium mock series is planned for aspirants who want deeper score analysis, but it will never replace the free tier."
    }
];

/* =========================================================
   EXAM INFO — QUICK NAV
   ========================================================= */

export const EXAM_INFO_NAV = [
    { id: "overview", label: "Exam Pattern" },
    { id: "eligibility", label: "Eligibility" },
    { id: "timeline", label: "Key Dates" },
    { id: "syllabus", label: "Syllabus" },
    { id: "focus-areas", label: "Focus Areas" },
    { id: "strategy", label: "Section Strategy" },
    { id: "roadmap", label: "Prep Roadmap" },
    { id: "books", label: "Books" },
    { id: "exam-day", label: "Exam Day" },
    { id: "mistakes", label: "Mistakes to Avoid" },
    { id: "nits", label: "Target NITs" },
    { id: "myths", label: "Myth vs Fact" },
    { id: "faq", label: "FAQs" }
];

/* =========================================================
   ELIGIBILITY
   ========================================================= */

export const ELIGIBILITY_CRITERIA = [
    {
        icon: "🎓",
        title: "Academic qualification",
        desc: "A Bachelor's degree (BCA / B.Sc. in Computer Science, Information Technology, Mathematics, Statistics or a related discipline) with Mathematics as a subject at the 10+2 or graduation level, from a recognised university."
    },
    {
        icon: "📊",
        title: "Minimum marks",
        desc: "Typically 60% aggregate (or equivalent CGPA) for General/OBC/EWS candidates and 55% for SC/ST/PwD candidates in the qualifying degree. Confirm the exact figure for the current cycle in the official brochure."
    },
    {
        icon: "📝",
        title: "Final-year candidates",
        desc: "Students in the final year of their qualifying degree can usually apply, subject to producing proof of graduation with the required percentage before counselling and admission."
    },
    {
        icon: "🌐",
        title: "Nationality",
        desc: "Open to Indian nationals. A limited number of seats at some NITs are separately available to foreign nationals through DASA, which runs outside NIMCET."
    },
    {
        icon: "⏳",
        title: "No upper age limit",
        desc: "NIMCET has generally not enforced an upper age limit, and there is typically no cap on the number of attempts, as long as eligibility is met each year."
    },
    {
        icon: "Σ",
        title: "Mathematics requirement",
        desc: "Since Mathematics carries the largest weight in the exam, most participating institutes require it to have been studied as a full subject, not just an applied or minor component."
    }
];

export const ELIGIBILITY_NOTE = "Eligibility criteria can be revised every year by the conducting NIT. Treat the points above as a general guide and always cross-check the current year's official information brochure before applying.";

/* =========================================================
   EXAM TIMELINE (application cycle, not exam-day roadmap)
   ========================================================= */

export const EXAM_TIMELINE_PHASES = [
    { phase: "1", window: "Typically Feb – Mar", title: "Notification", desc: "The conducting NIT releases the official information brochure covering eligibility, pattern, fees and important dates." },
    { phase: "2", window: "Typically Mar – Apr", title: "Application Window", desc: "Online registration opens. Fill the form carefully, mistakes in category or personal details can cause problems later at counselling." },
    { phase: "3", window: "Typically May", title: "Admit Card", desc: "Admit cards are released roughly two to three weeks before the exam. Download early and verify your centre, photo and details immediately." },
    { phase: "4", window: "Typically Late May / June", title: "Exam Day", desc: "The Computer Based Test is conducted in a single national sitting across designated centres on one day." },
    { phase: "5", window: "Typically 2 – 3 Weeks Later", title: "Result & Rank List", desc: "Results are declared along with an all-India rank list, which becomes the basis for the counselling rounds that follow." },
    { phase: "6", window: "Typically June – July", title: "Counselling & Seat Allotment", desc: "Centralised counselling for seat allotment across participating NITs, based on rank, category and the choices you fill." }
];

export const EXAM_TIMELINE_NOTE = "These windows are indicative, based on how past cycles have generally played out, and are not official dates. The exact schedule for the current cycle is set by the conducting NIT, follow the Updates tab on this site and the official website for the real dates.";

/* =========================================================
   SYLLABUS, SECTION BY SECTION
   ========================================================= */

export const SYLLABUS = {
    "Mathematics": MATH_CHAPTER_KEYWORDS.map(item => item.chapter),
    "Logical Reasoning": [
        "Number & Letter Series",
        "Coding–Decoding",
        "Blood Relations",
        "Direction Sense",
        "Syllogisms",
        "Statements, Assumptions & Conclusions",
        "Seating Arrangement & Puzzles",
        "Analogies",
        "Classification (Odd One Out)",
        "Data Sufficiency",
        "Venn Diagrams",
        "Clocks & Calendars",
        "Non-Verbal Reasoning (Mirror & Water Images)",
        "Ranking & Ordering"
    ],
    "Computer": [
        "Computer Organization & Architecture Basics",
        "Number Systems & Conversions",
        "Boolean Algebra & Logic Gates",
        "Basic Programming Concepts & Flowcharts",
        "Data Structures Basics (Arrays, Stacks, Queues)",
        "Operating Systems Fundamentals",
        "Memory & Storage Devices",
        "Networking Basics",
        "Internet & Web Fundamentals",
        "MS Office & Software Basics",
        "Computer Abbreviations & General Awareness"
    ],
    "Quantitative Aptitude": [
        "Number System",
        "Percentages",
        "Profit & Loss",
        "Simple & Compound Interest",
        "Ratio, Proportion & Variation",
        "Averages",
        "Time, Speed & Distance",
        "Time & Work",
        "Mixtures & Alligation",
        "Mensuration",
        "Data Interpretation",
        "Simplification & Approximation"
    ],
    "English": [
        "Vocabulary (Synonyms & Antonyms)",
        "One-Word Substitution",
        "Idioms & Phrasal Verbs",
        "Grammar (Tenses, Articles, Prepositions)",
        "Error Spotting & Sentence Correction",
        "Sentence Rearrangement (Para Jumbles)",
        "Reading Comprehension",
        "Fill in the Blanks",
        "Cloze Test"
    ]
};

export const SYLLABUS_NOTE = "This is a comprehensive study checklist compiled from patterns across previous years, not an official syllabus document. Use it to track coverage, not as a substitute for the official brochure.";

/* =========================================================
   SECTION-WISE TIME STRATEGY
   ========================================================= */

export const SECTION_STRATEGY = [
    {
        section: "Mathematics",
        suggestedTime: "50–55 min",
        approach: "Attempt your strongest chapters first (Coordinate Geometry, Calculus, Trigonometry) to bank marks early. Skip lengthy calculation-heavy questions on the first pass and return to them only if time allows."
    },
    {
        section: "Analytical Ability & Logical Reasoning",
        suggestedTime: "30–35 min",
        approach: "Usually quicker and less calculation-heavy than Math. Puzzles and arrangements can eat time, so leave them for last within this section if you're running behind."
    },
    {
        section: "Computer Awareness",
        suggestedTime: "8–10 min",
        approach: "Fewer questions, so a clean pass here is high value for the time spent. Skip a question the moment it feels unfamiliar rather than guessing blind, given the negative marking."
    },
    {
        section: "General English",
        suggestedTime: "15–18 min",
        approach: "Reading comprehension passages can be time-expensive. Clear the direct vocabulary and grammar questions first, then return to passage-based ones."
    }
];

export const SECTION_STRATEGY_NOTE = "These are suggested time splits based on typical question distribution, not an official rule. Adjust them based on your own strengths after a few mock attempts.";

/* =========================================================
   RECOMMENDED BOOKS
   ========================================================= */

export const RECOMMENDED_BOOKS = [
    { subject: "Mathematics", title: "NCERT Mathematics (Class 11 & 12)", note: "Build the conceptual base before moving on to problem-heavy books." },
    { subject: "Mathematics", title: "Objective Mathematics — R.D. Sharma", note: "Strong for chapter-wise objective practice at NIMCET's difficulty level." },
    { subject: "Logical Reasoning", title: "A Modern Approach to Verbal & Non-Verbal Reasoning — R.S. Aggarwal", note: "Covers nearly every reasoning topic that shows up in NIMCET." },
    { subject: "Quantitative Aptitude", title: "Quantitative Aptitude — R.S. Aggarwal", note: "A dependable base for percentages, time-speed-distance and interest problems." },
    { subject: "Quantitative Aptitude", title: "How to Prepare for Quantitative Aptitude — Arun Sharma", note: "Useful once the basics are solid and you want tougher, exam-style variety." },
    { subject: "Computer Awareness", title: "Computer Fundamentals — P.K. Sinha", note: "Good for building the core computer awareness concepts NIMCET tests." },
    { subject: "English", title: "High School English Grammar & Composition — Wren & Martin", note: "The standard reference for grammar rules and error-spotting practice." },
    { subject: "PYQs", title: "NIMCET Previous Year Papers (last 10–15 years)", note: "The single highest-value resource, available free on this site under PYQs." }
];

/* =========================================================
   EXAM DAY CHECKLIST
   ========================================================= */

export const EXAM_DAY_CHECKLIST = [
    "Carry your admit card (printed) and a valid original photo ID, exactly as specified in the exam instructions.",
    "Reach the exam centre at least 45–60 minutes before the reporting time, verification queues always take longer than expected.",
    "Visit the exam centre a day in advance if it's an unfamiliar city, so exam-day logistics are one less thing to worry about.",
    "Carry only the items permitted on your admit card, electronic devices, smartwatches and personal calculators are almost always disallowed.",
    "Get a full night's sleep before the exam, a rested mind consistently outperforms one that crammed until 3 AM.",
    "Read all on-screen instructions carefully in the first minute, understand the navigation and marking scheme before you start.",
    "Attempt sections and questions in the order that suits your strengths, not necessarily the order they are presented in.",
    "Keep an eye on the on-screen timer and switch sections deliberately, don't let one section eat into another's time.",
    "Mark uncertain questions for review instead of leaving them blank or guessing immediately, come back if time allows.",
    "Stay calm if a section starts poorly, one tough section does not decide the whole paper."
];

/* =========================================================
   COMMON MISTAKES
   ========================================================= */

export const COMMON_MISTAKES = [
    { mistake: "Guessing blindly on unfamiliar questions.", fix: "Negative marking means a wrong guess costs more than an unattempted question. Guess only after eliminating at least two options." },
    { mistake: "Over-preparing Mathematics, under-preparing everything else.", fix: "Reasoning, Computer Awareness and English are comparatively easier to score well in with focused, limited effort. Don't ignore them." },
    { mistake: "Starting mocks too late in the preparation.", fix: "Begin full-length mocks well before your target date, even with an incomplete syllabus, to build timing and stamina early." },
    { mistake: "Not reviewing mistakes from practice sets.", fix: "Solving more questions without reviewing errors just repeats the same mistakes. Keep a running log of what went wrong and why." },
    { mistake: "Ignoring official notifications and updates.", fix: "Exam dates, pattern tweaks and eligibility details can change year to year. Track the official NIMCET site and this site's Updates tab." },
    { mistake: "Cramming new topics in the final week.", fix: "The last week is for revision and formula recall, not for learning new chapters from scratch." }
];

/* =========================================================
   EXAM-INFO FAQs
   ========================================================= */

export const EXAM_INFO_FAQS = [
    { q: "Is NIMCET conducted more than once a year?", a: "No, NIMCET has historically been conducted once a year in a single national-level sitting, not across multiple shifts or attempts." },
    { q: "Is there a sectional cutoff?", a: "Based on past years' pattern, NIMCET has not applied section-wise cutoffs, only the overall score and rank have mattered for counselling. Always confirm this in the current brochure." },
    { q: "Is normalization applied to scores?", a: "Since the exam is typically held in a single shift for all candidates, normalization across shifts has generally not been necessary in past years." },
    { q: "How is counselling conducted after NIMCET?", a: "Admission to participating NITs after NIMCET is usually managed through a centralised counselling process where candidates fill choices of institute and are allotted seats by rank." },
    { q: "Can I reattempt NIMCET the next year to improve my rank?", a: "Yes, there is generally no restriction on the number of attempts, as long as you continue to meet the eligibility criteria for that year's exam." },
    { q: "Do all NITs offering MCA accept NIMCET scores?", a: "Most NITs offering an MCA programme participate in NIMCET admissions, but the exact list can vary by year. Check the official notification for the current list of participating institutes." }
];
