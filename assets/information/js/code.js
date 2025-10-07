document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll(".content-container");
    const navLinks = document.querySelectorAll('.button-container a[href^="#"]');
    const menuButton = document.querySelector(".button-menu");
    const nav = document.querySelector("nav");

    function showPage(hash) {
        containers.forEach(container => {
            container.classList.toggle("active", "#" + container.id === hash);
        });

        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === hash);
        });
    }

    function handleMenuDisplay() {
        if (window.innerWidth <= 480) {
            nav.classList.add("close");
        } else {
            nav.classList.remove("close");
        }
    }

    // при завантаженні сторінки
    showPage(window.location.hash || "#about");
    handleMenuDisplay();

    window.addEventListener("hashchange", () => {
        showPage(window.location.hash);
    });

    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const target = link.getAttribute("href");
            history.pushState(null, "", target);
            showPage(target);

            if (window.innerWidth <= 480) {
                nav.classList.add("close");
            }
        });
    });

    menuButton.addEventListener("click", () => {
        nav.classList.toggle("close");
    });

    window.addEventListener("resize", handleMenuDisplay);
});