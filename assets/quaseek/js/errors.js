document.addEventListener('DOMContentLoaded', function () {
    const connectionEl = document.querySelector('.connection');
    const displayEl = document.querySelector('.display');

    let currentActive = null;
    let currentTimer = null;

    function handleError(el) {
        if (currentActive && currentActive !== el) {
            currentActive.classList.remove('active');
            if (currentTimer) {
                clearTimeout(currentTimer);
            }
        }

        if (!el.classList.contains('active')) {
            el.classList.add('active');
            currentTimer = setTimeout(() => {
                el.classList.remove('active');
                currentActive = null;
                currentTimer = null;
            }, 10000);
            currentActive = el;
        }
    }

    window.addEventListener('offline', function () {
        handleError(connectionEl);
    });

    function checkScreenSize() {
        if (window.innerWidth <= 250) {
            handleError(displayEl);
        }
    }

    window.addEventListener('resize', checkScreenSize);

    checkScreenSize();
});