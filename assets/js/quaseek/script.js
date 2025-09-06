const input = document.getElementById("searchQuery");
const searchContainer = document.querySelector(".search-container");
const searchIcon = document.getElementById("searchIcon");
const optionIcon = document.getElementById("optionIcon");
const footerLinks = document.querySelectorAll(".footer-link");

input.focus();
input.value = "";

// Фокус при натисненні на контейнер
searchContainer.addEventListener("click", () => input.focus(), { passive: true });

// Стилі при фокусі
input.addEventListener("focus", () => searchContainer.classList.add("focused"), { passive: true });
input.addEventListener("blur", () => searchContainer.classList.remove("focused"), { passive: true });

// Функція пошуку
const search = (inNewTab = false) => {
  const query = input.value.trim();
  if (!query) return;

  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  inNewTab ? window.open(url, "_blank") : (window.location.href = url);
};

// Обробка клавіш
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

// Кнопки
searchIcon.addEventListener("click", (e) => {
  e.stopPropagation(); // теперь клик не даст фокус контейнеру
  search();
}, { passive: true });

optionIcon.addEventListener("click", (e) => {
  e.stopPropagation(); // теперь клик не даст фокус контейнеру
  input.value = "";
}, { passive: true });

// Швидкий фокус на поле
document.addEventListener("keydown", e => {
  if ((e.key === "/" || e.key === "\\") && document.activeElement !== input) {
    e.preventDefault();
    input.focus();
  }
});