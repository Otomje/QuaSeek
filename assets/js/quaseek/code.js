document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchQuery");
  const searchContainer = document.querySelector(".search-container");
  const searchIcon = document.getElementById("searchIcon");
  const optionIcon = document.getElementById("optionIcon");
  const settingsButton = document.querySelector('.footer-left-link[aria-label="Settings"]');
  const settingsContainer = document.querySelector(".settings-container");
  const settingsMenuContainer = document.querySelector(".settings-menu-container[aria-label='Menu Panel']");
  const settingsSearchSystemContainer = document.querySelector(".settings-menu-container[aria-label='Search System Panel']");
  const menuButton = document.querySelector(".settings-button-menu[aria-label='Search System Menu']");

  // Храним текущую поисковую систему в localStorage (по умолчанию Google)
  let currentSearchSystem = localStorage.getItem("searchSystem") || "Google";

  // Устанавливаем активную кнопку при загрузке
  const searchSystemButtons = document.querySelectorAll(".settings-button-menu:not([aria-label='Search System Menu'])");
  searchSystemButtons.forEach(button => {
    if (button.textContent === currentSearchSystem) button.classList.add("active");
  });

  // Функция для выполнения поиска
  const search = (inNewTab = false) => {
    const query = input.value.trim();
    if (!query) {
      input.classList.add("error");
      setTimeout(() => input.classList.remove("error"), 1000);
      return;
    }
    const searchUrls = {
      Google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      Yahoo: `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`,
      Bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`
    };
    const url = searchUrls[currentSearchSystem] || searchUrls.Google;
    inNewTab ? window.open(url, "_blank") : (window.location.href = url);
  };

  // Управление фокусом и ховером для searchContainer
  const setFocused = state => {
    searchContainer.classList.toggle("focused", state);
    if (state) searchContainer.classList.remove("hovered");
  };

  // Обработчики для input
  input.addEventListener("focus", () => setFocused(true), { passive: true });
  input.addEventListener("blur", () => setFocused(false), { passive: true });
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.ctrlKey ? search(true) : search();
    } else if (e.key === "Backspace" && e.shiftKey) {
      input.value = "";
      e.preventDefault();
    } else if (e.key === "Escape") {
      input.blur();
    }
  });

  // Обработчики для searchContainer
  searchContainer.addEventListener("click", e => {
    if (e.target !== input) input.focus();
  }, { passive: true });
  searchContainer.addEventListener("mouseenter", () => {
    if (!input.matches(":focus")) searchContainer.classList.add("hovered");
  }, { passive: true });
  searchContainer.addEventListener("mouseleave", () => {
    searchContainer.classList.remove("hovered");
  }, { passive: true });

  // Обработчик для иконок
  searchIcon.addEventListener("click", e => {
    e.stopPropagation();
    search();
  }, { passive: true });
  optionIcon.addEventListener("click", e => {
    e.stopPropagation();
    input.value = "";
  }, { passive: true });

  // Быстрый фокус на input по "/" или "\"
  document.addEventListener("keydown", e => {
    if ((e.key === "/" || e.key === "\\") && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    }
  });

  // Управление видимостью settings
  const toggleSettings = (isActive) => {
    settingsButton.classList.toggle("active", isActive);
    settingsContainer.classList.toggle("visible", isActive);
    settingsMenuContainer.classList.toggle("visible", isActive);
    if (!isActive) {
      settingsSearchSystemContainer.classList.remove("visible");
      menuButton.classList.remove("active");
      menuButton.setAttribute("aria-expanded", "false");
    }
  };

  settingsButton.addEventListener("click", e => {
    e.stopPropagation();
    toggleSettings(!settingsButton.classList.contains("active"));
  }, { passive: true });

  settingsButton.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      toggleSettings(!settingsButton.classList.contains("active"));
    }
  });

  // Управление видимостью панели поисковых систем
  menuButton.addEventListener("click", e => {
    e.stopPropagation();
    const isActive = !menuButton.classList.contains("active");
    menuButton.classList.toggle("active", isActive);
    menuButton.setAttribute("aria-expanded", isActive);
    settingsSearchSystemContainer.classList.toggle("visible", isActive);
  }, { passive: true });

  menuButton.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      const isActive = !menuButton.classList.contains("active");
      menuButton.classList.toggle("active", isActive);
      menuButton.setAttribute("aria-expanded", isActive);
      settingsSearchSystemContainer.classList.toggle("visible", isActive);
    }
  });

  // Делегирование событий для выбора поисковой системы с закрытием панелей
  settingsSearchSystemContainer.addEventListener("click", e => {
    const button = e.target.closest(".settings-button-menu:not([aria-label='Search System Menu'])");
    if (button) {
      e.stopPropagation();
      searchSystemButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      currentSearchSystem = button.textContent;
      localStorage.setItem("searchSystem", currentSearchSystem);
      // Закрываем все панели после выбора
      toggleSettings(false);
    }
  }, { passive: true });

  // Обработчик Enter для кнопок поисковых систем
  settingsSearchSystemContainer.addEventListener("keydown", e => {
    const button = e.target.closest(".settings-button-menu:not([aria-label='Search System Menu'])");
    if (button && e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      searchSystemButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      currentSearchSystem = button.textContent;
      localStorage.setItem("searchSystem", currentSearchSystem);
      // Закрываем все панели после выбора
      toggleSettings(false);
    }
  });

  // Закрытие панелей при клике вне settings-container
  document.addEventListener("click", e => {
    if (!settingsContainer.contains(e.target) && !settingsButton.contains(e.target)) {
      toggleSettings(false);
    }
  }, { passive: true });
});