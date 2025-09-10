const input = document.getElementById("searchQuery");
const searchContainer = document.querySelector(".search-container");
const searchIcon = document.getElementById("searchIcon");
const optionIcon = document.getElementById("optionIcon");

const footerLinks = document.querySelectorAll(".footer-left-link, .footer-right-link");

input.focus();
input.value = "";

const setFocused = state => {
  searchContainer.classList.toggle("focused", state);
  if (state) searchContainer.classList.remove("hovered");
};

input.addEventListener("focus", () => setFocused(true), { passive: true });
input.addEventListener("blur", () => setFocused(false), { passive: true });

searchContainer.addEventListener("click", e => {
  if (e.target !== input) input.focus();
}, { passive: true });

searchContainer.addEventListener("mouseenter", () => {
  if (!input.matches(":focus")) searchContainer.classList.add("hovered");
}, { passive: true });

searchContainer.addEventListener("mouseleave", () => searchContainer.classList.remove("hovered"), { passive: true });

const search = (inNewTab = false) => {
  const query = input.value.trim();
  if (!query) return;
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  inNewTab ? window.open(url, "_blank") : (window.location.href = url);
};

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.ctrlKey ? search(true) : search();
  } else if (e.key === "Backspace" && e.shiftKey) {
    input.value = "";
    e.preventDefault();
  } else if (e.key === "Escape") {
    input.blur();
  }
}, { passive: false });

searchIcon.addEventListener("click", e => {
  e.stopPropagation();
  search();
}, { passive: true });

optionIcon.addEventListener("click", e => {
  e.stopPropagation();
  input.value = "";
}, { passive: true });

document.addEventListener("keydown", e => {
  if ((e.key === "/" || e.key === "\\") && document.activeElement !== input) {
    e.preventDefault();
    input.focus();
  }
});