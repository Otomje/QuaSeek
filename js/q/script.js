const input = document.getElementById("searchQuery");
const searchContainer = document.querySelector(".search-container");
const searchIcon = document.getElementById("searchIcon");
const optionIcon = document.getElementById("optionIcon");
const footerLinks = document.querySelectorAll(".footer-link");
const modeToggle = document.querySelector(".footer-left span:last-child");
const rootLink = document.querySelector('link[href*="root/q/"]');

input.focus();
input.value = "";

[searchIcon, optionIcon, ...footerLinks].forEach(element => {
  element.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  }, { passive: false });
  element.addEventListener("click", (e) => {
    e.stopPropagation();
  }, { passive: false });
});

searchContainer.addEventListener("click", () => {
  input.focus();
}, { passive: true });

input.addEventListener("focus", () => {
  searchContainer.classList.add("focused");
}, { passive: true });

input.addEventListener("blur", () => {
  searchContainer.classList.remove("focused");
}, { passive: true });

const performSearch = () => {
  const queryRaw = input.value.trim();
  if (queryRaw.length > 0) {
    window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(queryRaw);
  }
};

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    performSearch();
  } else if (e.key === "Backspace" && e.shiftKey) {
    input.value = "";
    e.preventDefault();
  }
}, { passive: false });

searchIcon.addEventListener("click", performSearch, { passive: true });
optionIcon.addEventListener("click", () => {
  input.value = "";
  input.focus();
}, { passive: true });

// 🌗 Theme toggle logic
const applyMode = (mode) => {
  if (mode === "light") {
    rootLink.href = "css/root/q/light/root.css";
    searchIcon.src = "img/a/searicol.svg";
    optionIcon.src = "img/a/deleicol.svg";
  } else {
    rootLink.href = "css/root/q/night/root.css";
    searchIcon.src = "img/a/searico.svg";
    optionIcon.src = "img/a/deleico.svg";
  }
};

const toggleMode = () => {
  const currentMode = localStorage.getItem("quaseek-mode") || "night";
  const newMode = currentMode === "night" ? "light" : "night";
  localStorage.setItem("quaseek-mode", newMode);
  applyMode(newMode);
};

document.addEventListener("DOMContentLoaded", () => {
  const savedMode = localStorage.getItem("quaseek-mode") || "night";
  applyMode(savedMode);
});

modeToggle.addEventListener("click", toggleMode);
