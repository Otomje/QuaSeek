const input = document.getElementById("searchQuery");
const searchContainer = document.querySelector(".search-container");
const searchIcon = document.getElementById("searchIcon");
const optionIcon = document.getElementById("optionIcon");
const footerLinks = document.querySelectorAll(".footer-link");

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

const performSearchInNewTab = () => {
  const queryRaw = input.value.trim();
  if (queryRaw.length > 0) {
    window.open("https://www.google.com/search?q=" + encodeURIComponent(queryRaw), "_blank");
  }
};

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.shiftKey) {
    performSearchInNewTab();
  } else if (e.key === "Enter") {
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
