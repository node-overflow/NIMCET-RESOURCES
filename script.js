(() => {
    "use strict";

    /* ---------------- Config ---------------- */
    const DATA_FILES = [
        "data/math.json",
        "data/reasoning.json",
        "data/computer.json",
        "data/quants.json",
        "data/english.json"
    ];

    const SUBJECTS = [
        { name: "Mathematics", symbol: "\u03A3" },
        { name: "Logical Reasoning", symbol: "\u2192" },
        { name: "Computer", symbol: "{ }" },
        { name: "Quantitative Aptitude", symbol: "%" },
        { name: "English", symbol: "Aa" }
    ];

    const TYPES = [
        { key: "Book", label: "Books" },
        { key: "PYQ", label: "PYQs" },
        { key: "Notes", label: "Notes" },
        { key: "Video", label: "Videos" },
        { key: "Practice", label: "Practice" },
        { key: "Formula", label: "Formulas" }
    ];

    const TYPE_CLASS = {
        Book: "type-book",
        PYQ: "type-pyq",
        Notes: "type-notes",
        Video: "type-video",
        Practice: "type-practice",
        Formula: "type-formula"
    };

    /* ---------------- State ---------------- */
    const state = {
        resources: [],
        view: "home",
        subject: null,
        type: null,
        search: ""
    };

    /* ---------------- DOM refs ---------------- */
    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));

    const elSidebar = $("#sidebar");
    const elOverlay = $("#overlay");
    const elSidebarClose = $("#sidebarClose");
    const elMenuBBtn = $('.bnav-item[data-bottom="menu"]');

    const elViewHome = $("#view-home");
    const elViewResources = $("#view-resources");

    const elSubjectGrid = $("#subjectGrid");
    const elTypeChips = $("#typeChips");
    const elFeaturedGrid = $("#featuredGrid");

    const elResourcesHeading = $("#resourcesHeading");
    const elResourcesCount = $("#resourcesCount");
    const elFilterPills = $("#filterPills");
    const elSearchInput = $("#searchInput");
    const elResourcesGrid = $("#resourcesGrid");
    const elEmptyState = $("#emptyState");

    /* ---------------- Data loading ---------------- */
    const loadData = () => {
        return Promise.all(
            DATA_FILES.map((path) => {
                return fetch(path).then((res) => {
                    if (!res.ok) throw new Error("Failed to load " + path);
                    return res.json();
                });
            })
        ).then((lists) => {
            let merged = [];
            lists.forEach((list) => { merged = merged.concat(list); });
            state.resources = merged;
        });
    };

    /* ---------------- Helpers ---------------- */
    const countBySubject = (name) => {
        return state.resources.filter((r) => r.subject === name).length;
    };

    const typeLabelPlural = (key) => {
        const t = TYPES.filter((t) => t.key === key)[0];
        return t ? t.label : key;
    };

    const actionLabel = (item) => {
        return item.action === "download" ? "Download" : "Open";
    };

    const extractYouTubeId = (url) => {
        if (!url) return null;
        const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
        return m ? m[1] : null;
    };

    const matchesSearch = (item, q) => {
        if (!q) return true;
        const haystack = [
            item.title, item.subject, item.chapter, item.type, item.desc,
            (item.tags || []).join(" ")
        ].join(" ").toLowerCase();
        return haystack.indexOf(q.toLowerCase()) !== -1;
    };

    const getFilteredResources = () => {
        return state.resources.filter((item) => {
            if (state.subject && item.subject !== state.subject) return false;
            if (state.type && item.type !== state.type) return false;
            if (!matchesSearch(item, state.search)) return false;
            return true;
        });
    };

    /* ---------------- Card rendering ---------------- */
    const buildCard = (item) => {
        if (item.type === "Video") return buildVideoCard(item);

        const card = document.createElement("div");
        card.className = "resource-card";

        const typeClass = TYPE_CLASS[item.type] || "type-notes";

        card.innerHTML =
            '<div class="card-top">' +
            '<span class="type-dot" style="background: var(--' + typeClass + ')"></span>' +
            '<span class="type-label" style="color: var(--' + typeClass + ')">' + escapeHtml(item.type) + '</span>' +
            '</div>' +

            '<h3 class="card-title"></h3>' +

            '<p class="card-desc"></p>' +

            '<div class="card-meta">' +
            '<span><b>' + escapeHtml(item.difficulty || "") + '</b></span>' +
            '<span>' + escapeHtml(item.bestFor || "") + '</span>' +
            '</div>' +

            '<div class="card-foot">' +
            '<a class="card-action" href="' +
            (item.url && item.url !== "#" ? escapeHtml(item.url) : "#") +
            '" target="_blank" rel="noopener noreferrer">' +
            actionLabel(item) +
            ' <span class="arrow">\u2192</span>' +
            '</a>' +
            '</div>';

        card.querySelector(".card-title").textContent = item.title;
        card.querySelector(".card-desc").textContent = item.desc;

        const action = card.querySelector(".card-action");

        action.addEventListener("click", (e) => {
            if (!item.url || item.url === "#") {
                e.preventDefault();
            }
        });

        return card;
    };

    const buildVideoCard = (item) => {
        const card = document.createElement("div");
        card.className = "resource-card video-card";

        const videoId = extractYouTubeId(item.url);

        const thumbInner = videoId
            ? '<img class="video-thumb-img" src="https://img.youtube.com/vi/' +
            videoId +
            '/hqdefault.jpg" alt="" loading="lazy" />'
            : '<div class="video-thumb-fallback">' +
            '<span class="type-label" style="color: var(--type-video)">Video</span>' +
            '</div>';

        const videoUrl =
            item.url && item.url !== "#"
                ? escapeHtml(item.url)
                : "#";

        card.innerHTML =
            '<a class="video-thumb" href="' + videoUrl + '" target="_blank" rel="noopener noreferrer">' +
            thumbInner +
            '<span class="play-badge">' +
            '<svg width="14" height="16" viewBox="0 0 14 16" fill="none">' +
            '<path d="M1 1.2v13.6a1 1 0 0 0 1.53.85l11-6.8a1 1 0 0 0 0-1.7l-11-6.8A1 1 0 0 0 1 1.2Z" fill="currentColor"/>' +
            '</svg>' +
            '</span>' +
            '</a>' +

            '<div class="video-card-content">' +

            '<h3 class="card-title video-card-title"></h3>' +

            '<div class="card-meta">' +
            '<span><b></b></span>' +
            '<span class="video-best-for"></span>' +
            '</div>' +

            '<div class="card-foot">' +
            '<a class="card-action" href="' + videoUrl + '" target="_blank" rel="noopener noreferrer">' +
            'Watch Now <span class="arrow">\u2192</span>' +
            '</a>' +
            '</div>' +

            '</div>';

        card.querySelector(".video-card-title").textContent = item.title;
        card.querySelector(".card-meta b").textContent = item.difficulty || "";
        card.querySelector(".video-best-for").textContent = item.bestFor || "";

        const thumbnail = card.querySelector(".video-thumb");
        const action = card.querySelector(".card-action");

        thumbnail.addEventListener("click", (e) => {
            if (!item.url || item.url === "#") {
                e.preventDefault();
            }
        });

        action.addEventListener("click", (e) => {
            if (!item.url || item.url === "#") {
                e.preventDefault();
            }
        });

        return card;
    };

    const escapeHtml = (str) => {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    };

    const renderGrid = (container, items) => {
        container.innerHTML = "";
        const frag = document.createDocumentFragment();

        const order = {
            Book: 1,
            PYQ: 2,
            Notes: 3,
            Practice: 4,
            Formula: 5,
            Video: 6
        };

        [...items]
            .sort((a, b) => (order[a.type] || 99) - (order[b.type] || 99))
            .forEach((item) => {
                frag.appendChild(buildCard(item));
            });

        container.appendChild(frag);
    };

    /* ---------------- Home view ---------------- */
    const renderHome = () => {
        elSubjectGrid.innerHTML = "";

        SUBJECTS.forEach((s) => {
            const btn = document.createElement("button");
            btn.className = "subject-card";
            btn.type = "button";
            btn.innerHTML =
                '<span class="subject-symbol">' + s.symbol + '</span>' +
                '<span class="subject-name">' + escapeHtml(s.name) + '</span>' +
                '<span class="subject-count">' + countBySubject(s.name) + ' resources</span>';
            btn.addEventListener("click", () => {
                goToResources({ subject: s.name, type: null, search: "" });
            });
            elSubjectGrid.appendChild(btn);
        });

        elTypeChips.innerHTML = "";

        TYPES.forEach((t) => {
            const chip = document.createElement("button");
            chip.className = "chip";
            chip.type = "button";
            chip.textContent = t.label;
            chip.addEventListener("click", () => {
                goToResources({ subject: null, type: t.key, search: "" });
            });
            elTypeChips.appendChild(chip);
        });

        const featured = state.resources.filter((r) => r.featured);
        renderGrid(elFeaturedGrid, featured);
    };

    /* ---------------- Resources view ---------------- */
    const renderFilterPills = () => {
        elFilterPills.innerHTML = "";

        const allPill = document.createElement("button");
        allPill.className = "pill";
        allPill.type = "button";
        allPill.textContent = "All";
        allPill.dataset.active = state.type ? "false" : "true";
        allPill.addEventListener("click", () => {
            state.type = null;
            renderResources();
        });
        elFilterPills.appendChild(allPill);

        TYPES.forEach((t) => {
            const pill = document.createElement("button");
            pill.className = "pill";
            pill.type = "button";
            pill.textContent = t.label;
            pill.dataset.active = state.type === t.key ? "true" : "false";
            pill.addEventListener("click", () => {
                state.type = state.type === t.key ? null : t.key;
                renderResources();
            });
            elFilterPills.appendChild(pill);
        });
    };

    const renderHeading = () => {
        let heading = "All Resources";
        if (state.subject) {
            heading = state.subject;
        } else if (state.type) {
            heading = typeLabelPlural(state.type);
        }
        elResourcesHeading.textContent = heading;
    };

    const renderResources = () => {
        renderHeading();
        renderFilterPills();

        const results = getFilteredResources();

        elResourcesCount.textContent =
            results.length +
            (results.length === 1 ? " resource" : " resources");

        if (results.length === 0) {
            elResourcesGrid.innerHTML = "";
            elResourcesGrid.hidden = true;
            elEmptyState.hidden = false;
            return;
        }

        elResourcesGrid.hidden = false;
        elEmptyState.hidden = true;

        renderGrid(elResourcesGrid, results);
    };

    /* ---------------- View switching ---------------- */
    const setActiveNav = () => {
        $$(".nav-item").forEach((btn) => { btn.dataset.active = "false"; });
        $$(".bnav-item").forEach((btn) => { btn.dataset.active = "false"; });

        if (state.view === "home") {
            const homeBtn = $('.nav-item[data-nav="home"]');
            if (homeBtn) homeBtn.dataset.active = "true";
            const homeBBtn = $('.bnav-item[data-bottom="home"]');
            if (homeBBtn) homeBBtn.dataset.active = "true";
        } else if (state.view === "resources") {
            if (state.subject) {
                const subBtn = $('.nav-item[data-subject="' + state.subject + '"]');
                if (subBtn) subBtn.dataset.active = "true";
            } else if (!state.type) {
                const allBtn = $('.nav-item[data-nav="all"]');
                if (allBtn) allBtn.dataset.active = "true";
                const allBBtn = $('.bnav-item[data-bottom="all"]');
                if (allBBtn) allBBtn.dataset.active = "true";
            }
        }
    };

    const showView = (name) => {
        state.view = name;
        elViewHome.hidden = name !== "home";
        elViewResources.hidden = name !== "resources";
        setActiveNav();
        closeSidebar();
        window.scrollTo(0, 0);
    };

    const goHome = () => {
        showView("home");
        renderHome();
    };

    const goToResources = (opts) => {
        opts = opts || {};
        state.subject = "subject" in opts ? opts.subject : state.subject;
        state.type = "type" in opts ? opts.type : state.type;
        state.search = "search" in opts ? opts.search : state.search;
        elSearchInput.value = state.search;
        showView("resources");
        renderResources();
    };

    /* ---------------- Sidebar / mobile drawer ---------------- */
    const openSidebar = () => {
        elSidebar.classList.add("open");
        elOverlay.classList.add("active");
        document.body.classList.add("no-scroll");
        if (elMenuBBtn) elMenuBBtn.dataset.active = "true";
    };

    const closeSidebar = () => {
        elSidebar.classList.remove("open");
        elOverlay.classList.remove("active");
        document.body.classList.remove("no-scroll");
        if (elMenuBBtn) elMenuBBtn.dataset.active = "false";
    };

    const toggleSidebar = () => {
        if (elSidebar.classList.contains("open")) closeSidebar();
        else openSidebar();
    };

    /* ---------------- Wiring ---------------- */
    const wireStaticEvents = () => {
        elOverlay.addEventListener("click", closeSidebar);
        elSidebarClose.addEventListener("click", closeSidebar);

        $$(".nav-item").forEach((btn) => {
            btn.addEventListener("click", () => {
                const nav = btn.dataset.nav;
                if (nav === "home") {
                    goHome();
                } else if (nav === "all") {
                    goToResources({ subject: null, type: null, search: "" });
                } else if (nav === "subject") {
                    goToResources({ subject: btn.dataset.subject, type: null, search: "" });
                }
            });
        });

        elSearchInput.addEventListener("input", (e) => {
            state.search = e.target.value;
            renderResources();
        });

        $$(".bnav-item").forEach((btn) => {
            btn.addEventListener("click", () => {
                const action = btn.dataset.bottom;
                if (action === "home") {
                    goHome();
                } else if (action === "all") {
                    goToResources({ subject: null, type: null, search: "" });
                } else if (action === "menu") {
                    // Acts as the app's only "hamburger" trigger — toggles the
                    // Subjects drawer open/closed without ever hiding the bar itself.
                    toggleSidebar();
                } else if (action === "search") {
                    closeSidebar();
                    if (state.view !== "resources") {
                        goToResources({});
                    }
                    setTimeout(() => {
                        elSearchInput.focus();
                        elSearchInput.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 50);
                }
            });
        });
    };

    /* ---------------- Init ---------------- */
    loadData()
        .then(() => {
            wireStaticEvents();
            goHome();
        })
        .catch((err) => {
            console.error(err);
            elViewHome.innerHTML =
                '<div class="empty-state" style="margin-top:40px;">' +
                '<p class="empty-title">Could not load resources</p>' +
                '<p class="empty-sub">Serve this folder with a local server (data files are fetched via HTTP) and reload.</p>' +
                '</div>';
        });
})();