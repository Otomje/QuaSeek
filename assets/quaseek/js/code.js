document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("search-text");
    const searchBtn = document.getElementById("search");
    const clearBtn = document.getElementById("clear");
    const settingsBtn = document.getElementById("settings-button");
    const settingsContainer = document.querySelector(".settings-container");
    const menu = document.getElementById("menu");
    const searchSysOpen = document.getElementById("search-system-open");
    const searchContainer = document.querySelector(".search-container");
    const searchSysBtn = document.getElementById("search-system");

    // --- default значение поисковой системы ---
    let currentSearchSystem = localStorage.getItem("searchSystem") || "Google";

    // --- функция поиска ---
    const search = (inNewTab = false) => {
        const query = input.value.trim();
        if (!query) {
            input.classList.add("error");
            setTimeout(() => input.classList.remove("error"), 1000);
            return;
        }
        const urls = {
            Google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            Yahoo: `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`,
            Bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`
        };
        const url = urls[currentSearchSystem] || urls.Google;
        inNewTab ? window.open(url, "_blank") : (window.location.href = url);
    };

    // --- фокус по клику на контейнер ---
    searchContainer.addEventListener("click", () => input.focus());

    // --- кнопки поиска ---
    searchBtn.addEventListener("click", () => search());
    clearBtn.addEventListener("click", () => (input.value = ""));
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") e.ctrlKey ? search(true) : search();
        if (e.key === "Backspace" && e.shiftKey) {
            input.value = "";
            e.preventDefault();
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

    // --- кнопка Settings ---
    settingsBtn.addEventListener("click", e => {
        e.stopPropagation();
        const isActive = settingsContainer.classList.toggle("active");
        settingsBtn.classList.toggle("active", isActive);
        searchSysOpen.classList.remove("active");
        searchSysBtn.classList.remove("active");
    });

    // --- меню: открытие Search System ---
    menu.addEventListener("click", e => {
        if (e.target.id === "search-system") {
            e.stopPropagation();
            const isOpen = searchSysOpen.classList.toggle("active");
            searchSysBtn.classList.toggle("active", isOpen);
        }
    });

    // --- выбор поисковой системы ---
    searchSysOpen.addEventListener("click", e => {
        if (["google", "yahoo", "bing"].includes(e.target.id)) {
            currentSearchSystem = e.target.textContent;
            localStorage.setItem("searchSystem", currentSearchSystem);

            // выделяем выбранный поисковик
            searchSysOpen.querySelectorAll(".button").forEach(btn => {
                btn.classList.toggle("active", btn.id === e.target.id);
            });

            // закрываем все панели и снимаем актив
            searchSysOpen.classList.remove("active");
            settingsContainer.classList.remove("active");
            settingsBtn.classList.remove("active");
            searchSysBtn.classList.remove("active");
        }
    });

    // --- универсальная функция активации кнопок (если понадобится) ---
    const setActive = (container, id) => {
        container.querySelectorAll(".button").forEach(btn => {
            btn.classList.toggle("active", btn.id.toLowerCase() === id.toLowerCase());
        });
    };

    // --- role="button" + tabindex --- Enter/Space клик
    document.querySelectorAll('[role="button"]').forEach(btn => {
        btn.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                btn.click();
            }
        });
    });

    // --- клик вне меню/Settings ---
    document.addEventListener("click", e => {
        if (!settingsContainer.contains(e.target) && !settingsBtn.contains(e.target)) {
            settingsContainer.classList.remove("active");
            settingsBtn.classList.remove("active");
            searchSysOpen.classList.remove("active");
            searchSysBtn.classList.remove("active");
        }
    });

    // --- инициализация при загрузке ---
    setActive(searchSysOpen, currentSearchSystem.toLowerCase());
});