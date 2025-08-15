const maintenanceMode = false; // false r true

const protectedPages = ["update.html"];
const currentPage = window.location.pathname.split("/").pop();

if (maintenanceMode && !protectedPages.includes(currentPage)) {
  window.location.href = "update";
}

if (!maintenanceMode && protectedPages.includes(currentPage)) {
  window.location.href = "index";
}
