document.addEventListener("DOMContentLoaded", () => {
    // Получаем элементы с проверками
    const input = document.getElementById("search-text");
    const searchBtn = document.getElementById("search");
    const clearBtn = document.getElementById("clear");
    const settingsBtn = document.getElementById("settings-button");
    const settingsContainer = document.querySelector(".settings-container");

    const searchSystemButton = document.getElementById("search-system");
    const searchSystemSettings = document.getElementById("search-system-settings");
    const mainSettings = document.getElementById("settings"); // <div id="settings">

    // Проверяем наличие ключевых элементов
    if (!input || !searchBtn || !clearBtn || !settingsBtn || !settingsContainer ||
        !searchSystemButton || !searchSystemSettings || !mainSettings) {
        console.warn("Некоторые элементы не найдены. Скрипт может работать некорректно.");
        return;
    }

    // --- default поисковая система ---
    let currentSearchSystem = localStorage.getItem("searchSystem") || "google";

    // --- Конфигурация поисковых систем (легко расширяемо) ---
    const searchSystems = {
        google: query => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        yahoo: query => `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`,
        bing: query => `https://www.bing.com/search?q=${encodeURIComponent(query)}`
    };

    // --- функция поиска ---
    const search = (inNewTab = false) => {
        const query = input.value.trim();
        if (!query) {
            input.classList.add("error");
            setTimeout(() => input.classList.remove("error"), 1000);
            return;
        }
        const buildUrl = searchSystems[currentSearchSystem] || searchSystems.google;
        const url = buildUrl(query);
        inNewTab ? window.open(url, "_blank") : (window.location.href = url);
    };

    // --- фокус на input по клику на контейнер ---
    const searchContainer = document.querySelector(".search-container");
    if (searchContainer) {
        searchContainer.addEventListener("click", () => input.focus());
    }

    // --- кнопки поиска и очистки ---
    searchBtn.addEventListener("click", () => search());
    clearBtn.addEventListener("click", () => (input.value = ""));
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault(); // Добавлено для предотвращения отправки формы, если input в form
            e.ctrlKey ? search(true) : search();
        }
        if (e.key === "Escape") input.blur();
    });

    // --- быстрый фокус по "/" или "\" ---
    document.addEventListener("keydown", e => {
        if ((e.key === "/" || e.key === "\\") && document.activeElement !== input) {
            e.preventDefault();
            input.focus();
        }
    });

    // --- Утилита для toggle-класса с ARIA ---
    const toggleElement = (element, className, isActive) => {
        element.classList.toggle(className, isActive);
        if (element.hasAttribute("aria-expanded")) {
            element.setAttribute("aria-expanded", isActive.toString());
        }
        if (element.hasAttribute("aria-hidden")) {
            element.setAttribute("aria-hidden", (!isActive).toString());
        }
    };

    // --- кнопка Settings ---
    settingsBtn.addEventListener("click", e => {
        e.stopPropagation();
        const isActive = settingsContainer.classList.toggle("active");
        toggleElement(settingsBtn, "active", isActive);
        // по дефолту открываем mainSettings
        toggleElement(mainSettings, "active", isActive);
        // закрываем выбор поисковой системы, если открыт
        toggleElement(searchSystemSettings, "active", false);
    });

    // --- открытие панели выбора поисковой системы ---
    searchSystemButton.addEventListener("click", e => {
        e.stopPropagation();
        const isOpen = searchSystemSettings.classList.toggle("active");
        // Закрываем mainSettings при открытии подменю
        toggleElement(mainSettings, "active", !isOpen);
        // Обновляем ARIA без class active для кнопки меню
        if (searchSystemButton.hasAttribute("aria-expanded")) {
            searchSystemButton.setAttribute("aria-expanded", isOpen.toString());
        }
    });

    // --- выбор поисковой системы ---
    searchSystemSettings.addEventListener("click", e => {
        const target = e.target.closest(".button"); // Более robust: ищем ближайшую кнопку
        if (!target || !["google", "yahoo", "bing"].includes(target.id)) {
            return; // Игнорируем клики не по кнопкам
        }

        // снимаем актив у всех
        searchSystemSettings.querySelectorAll(".button").forEach(btn => {
            toggleElement(btn, "active", false);
        });
        // ставим актив на выбранную
        toggleElement(target, "active", true);

        // сохраняем выбор
        currentSearchSystem = target.id;
        localStorage.setItem("searchSystem", currentSearchSystem);

        // закрываем меню
        toggleElement(searchSystemSettings, "active", false);
        toggleElement(settingsContainer, "active", false);
        toggleElement(settingsBtn, "active", false);
        toggleElement(mainSettings, "active", true); // Возвращаем к mainSettings
        // Обновляем ARIA для кнопки меню (закрыто)
        if (searchSystemButton.hasAttribute("aria-expanded")) {
            searchSystemButton.setAttribute("aria-expanded", "false");
        }
    });

    // --- role="button" + Enter/Space ---
    document.querySelectorAll('[role="button"]').forEach(btn => {
        btn.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                btn.click();
            }
        });
    });

    // --- клик вне Settings закрывает все ---
    document.addEventListener("click", e => {
        if (!settingsContainer.contains(e.target) && !settingsBtn.contains(e.target)) {
            toggleElement(settingsContainer, "active", false);
            toggleElement(settingsBtn, "active", false);
            toggleElement(searchSystemSettings, "active", false);
            toggleElement(mainSettings, "active", false);
            // Обновляем ARIA для кнопки меню (закрыто)
            if (searchSystemButton.hasAttribute("aria-expanded")) {
                searchSystemButton.setAttribute("aria-expanded", "false");
            }
        }
    });

    // --- инициализация выбранной поисковой системы ---
    const initActiveSearchSystem = () => {
        searchSystemSettings.querySelectorAll(".button").forEach(btn => {
            toggleElement(btn, "active", btn.id === currentSearchSystem);
        });
    };
    initActiveSearchSystem();

    // Инициализация ARIA (если нужно добавить в HTML)
    settingsBtn.setAttribute("aria-expanded", "false");
    settingsBtn.setAttribute("aria-controls", "settings");
    mainSettings.setAttribute("aria-hidden", "true");
    searchSystemButton.setAttribute("aria-expanded", "false");
    searchSystemSettings.setAttribute("aria-hidden", "true");
});