document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("search-text");
    const searchBtn = document.getElementById("search");
    const clearBtn = document.getElementById("clear");
    const settingsBtn = document.getElementById("settings-button");
    const settingsContainer = document.querySelector(".settings-container");
    const searchSystemButton = document.getElementById("search-system");
    const searchSystemSettings = document.getElementById("search-system-settings");
    const mainSettings = document.getElementById("settings");
    const searchContainer = document.querySelector(".search-container");

    // --- Дефолтная поисковая система ---
    let currentSearchSystem = localStorage.getItem("searchSystem") || "google";
    if (!localStorage.getItem("searchSystem")) {
        localStorage.setItem("searchSystem", currentSearchSystem);
    }

    // --- Список поисковых систем ---
    const searchSystems = {
        google: q => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
        yahoo: q => `https://search.yahoo.com/search?p=${encodeURIComponent(q)}`,
        bing: q => `https://www.bing.com/search?q=${encodeURIComponent(q)}`
    };

    // --- Поиск ---
    const search = (inNewTab = false) => {
        const query = input.value.trim();
        if (!query) {
            input.classList.add("error");
            setTimeout(() => input.classList.remove("error"), 1000);
            return;
        }
        const url = (searchSystems[currentSearchSystem] || searchSystems.google)(query);
        inNewTab ? window.open(url, "_blank") : (window.location.href = url);
    };

    // --- Фокус по клику на контейнер ---
    searchContainer.addEventListener("click", () => input.focus());

    // --- Кнопки поиска и очистки ---
    searchBtn.addEventListener("click", () => search());
    clearBtn.addEventListener("click", () => (input.value = ""));
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.ctrlKey ? search(true) : search();
        }
        if (e.key === "Escape") input.blur();
    });

    // --- Быстрый фокус по "/" или "\" ---
    document.addEventListener("keydown", e => {
        if ((e.key === "/" || e.key === "\\") && document.activeElement !== input) {
            e.preventDefault();
            input.focus();
        }
    });

    // --- Утилита для переключения классов и ARIA ---
    const toggleElement = (el, className, active) => {
        el.classList.toggle(className, active);
        if (el.hasAttribute("aria-expanded")) el.setAttribute("aria-expanded", active);
        if (el.hasAttribute("aria-hidden")) el.setAttribute("aria-hidden", !active);
    };

    // --- Кнопка настроек ---
    settingsBtn.addEventListener("click", e => {
        e.stopPropagation();
        const active = settingsContainer.classList.toggle("active");
        toggleElement(settingsBtn, "active", active);
        toggleElement(mainSettings, "active", active);
        toggleElement(searchSystemSettings, "active", false);
    });

    // --- Меню выбора поисковой системы ---
    searchSystemButton.addEventListener("click", e => {
        e.stopPropagation();
        const open = searchSystemSettings.classList.toggle("active");
        toggleElement(mainSettings, "active", !open);
        searchSystemButton.setAttribute("aria-expanded", open);
    });

    // --- Выбор поисковой системы ---
    searchSystemSettings.addEventListener("click", e => {
        const btn = e.target.closest(".button");
        if (!btn) return;

        searchSystemSettings.querySelectorAll(".button").forEach(b => toggleElement(b, "active", false));
        toggleElement(btn, "active", true);

        currentSearchSystem = btn.id;
        localStorage.setItem("searchSystem", currentSearchSystem);

        toggleElement(searchSystemSettings, "active", false);
        toggleElement(settingsContainer, "active", false);
        toggleElement(settingsBtn, "active", false);
        toggleElement(mainSettings, "active", true);
        searchSystemButton.setAttribute("aria-expanded", "false");
    });

    // --- role="button" поддержка клавиатуры ---
    document.querySelectorAll('[role="button"]').forEach(btn => {
        btn.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                btn.click();
            }
        });
    });

    // --- Клик вне меню закрывает всё ---
    document.addEventListener("click", e => {
        if (!settingsContainer.contains(e.target) && !settingsBtn.contains(e.target)) {
            toggleElement(settingsContainer, "active", false);
            toggleElement(settingsBtn, "active", false);
            toggleElement(searchSystemSettings, "active", false);
            toggleElement(mainSettings, "active", false);
            searchSystemButton.setAttribute("aria-expanded", "false");
        }
    });

    // --- Инициализация активной системы ---
    const initActiveSearchSystem = () => {
        searchSystemSettings.querySelectorAll(".button").forEach(btn => {
            toggleElement(btn, "active", btn.id === currentSearchSystem);
        });
    };
    setTimeout(initActiveSearchSystem, 20);

    // --- ARIA атрибуты ---
    settingsBtn.setAttribute("aria-expanded", "false");
    settingsBtn.setAttribute("aria-controls", "settings");
    mainSettings.setAttribute("aria-hidden", "true");
    searchSystemButton.setAttribute("aria-expanded", "false");
    searchSystemSettings.setAttribute("aria-hidden", "true");
});