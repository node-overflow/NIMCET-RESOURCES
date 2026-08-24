"use strict";

export const $ = (selector, context = document) =>
    context.querySelector(selector);

export const $$ = (selector, context = document) =>
    Array.from(context.querySelectorAll(selector));

export const elSidebar = $("#sidebar");
export const elOverlay = $("#overlay");
export const elSidebarClose = $("#sidebarClose");
export const elMenuBBtn = $('.bnav-item[data-bottom="menu"]');

export const elViewHome = $("#view-home");
export const elViewResources = $("#view-resources");
export const elViewUpdates = $("#view-updates");
export const elViewPyqs = $("#view-pyqs");
export const elViewPyqsExam = $("#view-pyqs-exam");
export const elViewDpps = $("#view-dpps");
export const elViewDppsSubject = $("#view-dpps-subject");
export const elViewDppsChapter = $("#view-dpps-chapter");
export const elViewMocks = $("#view-mocks");
export const elViewMocksDetail = $("#view-mocks-detail");

export const VIEWS = {
    home: elViewHome,
    resources: elViewResources,
    updates: elViewUpdates,
    pyqs: elViewPyqs,
    "pyqs-exam": elViewPyqsExam,
    dpps: elViewDpps,
    "dpps-subject": elViewDppsSubject,
    "dpps-chapter": elViewDppsChapter,
    mocks: elViewMocks,
    "mocks-detail": elViewMocksDetail
};

export const elUpdatesBadge = $("#updatesBadge");
export const elUpdateFilters = $("#updateFilters");
export const elUpdatesTimeline = $("#updatesTimeline");
export const elUpdatesEmpty = $("#updatesEmpty");

export const elExamGrid = $("#examGrid");
export const elExamsEmpty = $("#examsEmpty");

export const elPyqsBackBtn = $("#pyqsBackBtn");
export const elPyqsExamHeading = $("#pyqsExamHeading");
export const elPyqsExamCount = $("#pyqsExamCount");
export const elPyqsExamGrid = $("#pyqsExamGrid");
export const elPyqsExamEmpty = $("#pyqsExamEmpty");

export const elDppSubjectGrid = $("#dppSubjectGrid");
export const elDppSubjectEmpty = $("#dppSubjectEmpty");

export const elDppChapterBackBtn = $("#dppChapterBackBtn");
export const elDppChapterHeading = $("#dppChapterHeading");
export const elDppChapterGrid = $("#dppChapterGrid");
export const elDppChapterEmpty = $("#dppChapterEmpty");

export const elDppBackBtn = $("#dppBackBtn");
export const elDppHeading = $("#dppHeading");
export const elDppCount = $("#dppCount");
export const elDppGrid = $("#dppGrid");
export const elDppEmpty = $("#dppEmpty");

export const elMocksGrid = $("#mocksGrid");

export const elMocksBackBtn = $("#mocksBackBtn");
export const elMocksDetailHeading = $("#mocksDetailHeading");

export const elSubjectGrid = $("#subjectGrid");
export const elTypeChips = $("#typeChips");
export const elFeaturedGrid = $("#featuredGrid");

export const elHeroStats = $("#heroStats");
export const elHeroBrowseBtn = $("#heroBrowseBtn");
export const elHeroPyqBtn = $("#heroPyqBtn");
export const elExamMarquee = $("#examMarquee");
export const elNitMarquee = $("#nitMarquee");
export const elFaqList = $("#faqList");
export const elFaqCategories = document.getElementById("faqCategories");

export const elResourcesHeading = $("#resourcesHeading");
export const elResourcesCount = $("#resourcesCount");
export const elFilterPills = $("#filterPills");
export const elSearchInput = $("#searchInput");
export const elResourcesGrid = $("#resourcesGrid");
export const elEmptyState = $("#emptyState");