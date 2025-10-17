document.addEventListener("DOMContentLoaded", () => {
    const messageContainer = document.querySelector(".message-container");
    const connectionStatus = document.querySelector(".connection-status");
    const displayStatus = document.querySelector(".display-status");

    let messageTimeout = null;

    // Функція показу повідомлення
    function showMessage(target) {
        // Скидаємо попереднє повідомлення, якщо ще активне
        clearTimeout(messageTimeout);
        messageContainer.classList.remove("active");
        connectionStatus.classList.remove("active");
        displayStatus.classList.remove("active");

        // Активуємо нове
        messageContainer.classList.add("active");
        target.classList.add("active");

        // Автоматично сховати через 10 секунд
        messageTimeout = setTimeout(() => {
            messageContainer.classList.remove("active");
            target.classList.remove("active");
        }, 10000);
    }

    // Коли пропадає інтернет
    function checkConnection() {
        if (!navigator.onLine) {
            showMessage(connectionStatus);
        }
    }

    // Коли екран занадто малий
    function checkScreen() {
        if (window.innerWidth <= 250) {
            showMessage(displayStatus);
        }
    }

    // Слухаємо події
    window.addEventListener("offline", checkConnection);
    window.addEventListener("resize", checkScreen);

    // Перевірка при завантаженні
    checkScreen();
});