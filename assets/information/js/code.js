document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll(".content-container");
    const navLinks = document.querySelectorAll('.button-container a[href^="#"]');
    const menuButton = document.querySelector(".button-menu");
    const nav = document.querySelector("nav");

    function showPage(hash) {
        // показати потрібну секцію
        containers.forEach(container => {
            container.classList.toggle("active", "#" + container.id === hash);
        });

        // підсвітка активної кнопки
        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === hash);
        });
    }

    // при завантаженні сторінки
    showPage(window.location.hash || "#about");

    // при зміні хешу
    window.addEventListener("hashchange", () => {
        showPage(window.location.hash);
    });

    // клік по пунктам меню
    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const target = link.getAttribute("href");
            history.pushState(null, "", target);
            showPage(target);

            // автоматично закривати меню на мобільних
            if (window.innerWidth < 450) {
                nav.classList.add("close");
            }
        });
    });

    // кнопка меню — відкриває/закриває нав
    menuButton.addEventListener("click", () => {
        nav.classList.toggle("close");
    });
});
