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
    { key: "TANCET", name: "TANCET", full: "Tamil Nadu Common Entrance Test (MCA)", symbol: "T" },
    { key: "WB JECA", name: "WB JECA", full: "West Bengal MCA Entrance", symbol: "J" },
    { key: "MAH CET", name: "MAH CET", full: "Maharashtra Common Entrance Test (MCA)", symbol: "M" },
    { key: "JAMIA MCA", name: "JAMIA MCA", full: "Jamia Millia Islamia MCA Entrance", symbol: "J" },
    { key: "DU MCA", name: "DU MCA", full: "Delhi University MCA Entrance", symbol: "D" },
    { key: "BHU MCA", name: "BHU MCA", full: "Banaras Hindu University MCA Entrance", symbol: "B" }
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
    { name: "Logical Reasoning", symbol: "📊︎" },
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
    { chapter: "Quadratic Equations", keywords: ["quadratic"] },
    { chapter: "Probability", keywords: ["probability"] },
    { chapter: "Permutation & Combination", keywords: ["permutation", "combination", "npr", "ncr"] },
    { chapter: "Binomial Theorem", keywords: ["binomial"] },
    { chapter: "Matrices & Determinants", keywords: ["matrix", "matrices", "determinant"] },
    { chapter: "Complex Numbers", keywords: ["complex number", "complex numbers"] },
    { chapter: "Sequence & Series", keywords: ["sequence", "series", "progression", "ap and gp", "arithmetic progression", "geometric progression"] },
    { chapter: "Trigonometry", keywords: ["trigonometry", "trigonometric", "trigonometric ratio", "itf"] },
    { chapter: "Vectors", keywords: ["vector", "vectors"] },
    { chapter: "3D Geometry", keywords: ["3d geometry", "3d", "three dimensional geometry", "three-dimensional geometry"] },
    { chapter: "Straight Lines", keywords: ["straight line", "straight lines"] },
    { chapter: "Circle", keywords: ["circle", "circles"] },
    { chapter: "Parabola", keywords: ["parabola"] },
    { chapter: "Ellipse", keywords: ["ellipse"] },
    { chapter: "Hyperbola", keywords: ["hyperbola"] },
    { chapter: "Limits", keywords: ["limits", "limit"] },
    { chapter: "Continuity & Differentiability", keywords: ["continuity", "differentiability", "continuity differentiability"] },
    { chapter: "Differentiation", keywords: ["differentiation", "derivative", "derivatives"] },
    { chapter: "Application of Derivatives", keywords: ["application of derivatives", "applications of derivatives", "aod"] },
    { chapter: "Indefinite Integration", keywords: ["indefinite integral", "indefinite integration"] },
    { chapter: "Definite Integration", keywords: ["definite integral", "definite integration"] },
    { chapter: "Area Under Curve", keywords: ["area under curve", "area under the curve"] },
    { chapter: "Differential Equations", keywords: ["differential equation", "differential equations", "differential eqn"] },
    { chapter: "Sets", keywords: ["set", "sets", "set theory"] },
    { chapter: "Relations", keywords: ["relation", "relations"] },
    { chapter: "Functions", keywords: ["function", "functions"] },
    { chapter: "Statistics", keywords: ["statistics", "statistical"] },
    { chapter: "Algebra", keywords: ["algebra"] }
];

export const MONTH_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export const TELEGRAM_URL = "https://t.me/nimcet2027group";

export const HOME_FEATURES = [
    {
        icon: "🎯",
        title: "100% Free, Always",
        desc: "No paywalls, no premium plans, every book, note, PYQ, DPP and resources stays free."
    },
    {
        icon: "🗂️",
        title: "Organized, Not Dumped",
        desc: "Everything is sorted by subject and type, so you spend time studying, not searching."
    },
    {
        icon: "🔄",
        title: "Kept Up To Date",
        desc: "New papers, notes and exam notifications get added as they are released, not months later."
    },
    {
        icon: "🤝",
        title: "By Aspirants, For Aspirants",
        desc: "Built from the gaps we felt while preparing, so you do not have to hunt across ten tabs."
    }
];

export const HOW_IT_WORKS = [
    {
        title: "Pick your subject",
        desc: "Mathematics, Logical Reasoning, Computer, Quantitative Aptitude or English, start where you need it most."
    },
    {
        title: "Browse by type",
        desc: "Books, Notes, PYQs, Videos, Practice sets or Formula sheets, filtered exactly the way you want."
    },
    {
        title: "Drill with PYQs & DPPs",
        desc: "Work through exam-wise previous year papers and chapter-wise Daily Practice Problems."
    },
    {
        title: "Stay ahead on updates",
        desc: "Track notifications, exam dates, admit cards and results in one running timeline."
    }
];

export const TESTIMONIALS = [
    {
        quote: "Having every subject's PYQs in one place saved me hours I used to spend tracking them down.",
        source: "Shivam"
    },
    {
        quote: "The chapter-wise DPPs made it easy to tell which topics actually needed more practice.",
        source: "Shivani"
    },
    {
        quote: "Simple, fast, and nothing locked behind a paywall, exactly what free prep should look like.",
        source: "Vipin"
    }
];

/* =========================================================
   MANIFESTO / MISSION
   ========================================================= */

export const MANIFESTO = {
    eyebrow: "Our Manifesto",
    title: "Preparation shouldn't have a price tag.",
    paragraphs: [
        "Every year, thousands of NIMCET aspirants start their prep by opening ten different tabs, joining five different Telegram channels, and still not knowing if the notes they find are even reliable.",
        "Meanwhile, big coaching brands sell the same PDFs you can find for free, wrapped in subscription plans that cost more than some families can afford.",
        "We built this platform because we were those aspirants. We know what it feels like to lose a week just searching for reliable PYQs. So we did the searching once, organised everything, and made it free, permanently."
    ],
    signoff: "No paywalls. No 'contact us for pricing.' Just prep, organised."
};

/* =========================================================
   EXAM PATTERN (general guide — verify against official notification)
   ========================================================= */

export const EXAM_PATTERN_SECTIONS = [
    { section: "Mathematics", questions: 50, marks: 200, weight: "42%" },
    { section: "Analytical Ability & Logical Reasoning", questions: 40, marks: 160, weight: "33%" },
    { section: "Computer Awareness", questions: 10, marks: 40, weight: "8%" },
    { section: "General English", questions: 20, marks: 80, weight: "17%" }
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
   US VS TYPICAL PAID COACHING
   ========================================================= */

export const COMPARISON_ROWS = [
    { label: "Cost", us: "Free, always", them: "₹15,000 – ₹60,000+ per course" },
    { label: "Access", us: "Instant, no signup, no waitlist", them: "Batch start dates, admission process" },
    { label: "Content organisation", us: "Subject × type, chapter-tagged", them: "Varies by faculty, often scattered" },
    { label: "PYQs", us: "Exam-wise, sorted by year", them: "Usually bundled behind test series" },
    { label: "DPPs", us: "Chapter-wise, free forever", them: "Often a separate paid add-on" },
    { label: "Updates", us: "Live exam-updates timeline", them: "Mostly through batch announcements" },
    { label: "Who it's for", us: "Every NIMCET aspirant, any budget", them: "Aspirants who can afford a seat" }
];

/* =========================================================
   DAILY STUDY ROUTINE (suggested, not prescriptive)
   ========================================================= */

export const DAILY_ROUTINE = [
    { time: "Morning", title: "Concept Block", desc: "60–90 minutes on your weakest subject, while your mind is freshest." },
    { time: "Midday", title: "Practice Block", desc: "Chapter-wise Practice sets or DPPs — focused, timed, no distractions." },
    { time: "Evening", title: "PYQ Block", desc: "One PYQ set or a mixed set of previous questions across subjects." },
    { time: "Night", title: "Revise & Reflect", desc: "10-minute formula-sheet skim and a quick note on what went wrong today." }
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
    }
];

/* =========================================================
   FOUNDER'S NOTE
   ========================================================= */

export const FOUNDER_NOTE = {
    title: "A note from the team behind this website",
    body: "We are not a company. We are just a small group of NIMCET aspirants and alumni who know how difficult it can be to find good study material. We built this site to make that easier. We are bringing together useful resources, one subject, one PYQ, and one DPP at a time. As more students need resources, we will keep adding more.",
    signoff: "— Built by aspirants, for aspirants."
};

/* =========================================================
   MOTIVATIONAL LINES (marquee)
   ========================================================= */

export const MOTIVATION_LINES = [
    "Consistency beats intensity.",
    "Every PYQ you solve today is a rank you protect tomorrow.",
    "You don't need more resources. You need to start with what's here.",
    "Discipline is choosing between what you want now and what you want most.",
    "Your only competition is who you were last week.",
    "Small, daily progress beats occasional, dramatic effort.",
    "The syllabus doesn't care how you feel. Show up anyway.",
    "An NIT seat is built one solved question at a time."
];