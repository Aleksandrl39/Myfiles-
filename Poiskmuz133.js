(function () {
    console.log("🔄 Инициализация плагина поиска музыки...");

    function createMusicButton() {
        console.log("🔹 Попытка добавить кнопку поиска музыки...");
        
        var menu = document.querySelector('.menu'); // Проверяем существующий элемент
        if (!menu) {
            console.error("❌ Ошибка: Элемент .menu не найден!");
            return;
        }

        var existingButton = document.querySelector('.menu-item[data-action="search-music"]');
        if (existingButton) {
            console.warn("⚠️ Кнопка поиска музыки уже добавлена!");
            return;
        }

        var button = document.createElement('div');
        button.className = "menu-item";
        button.setAttribute("data-action", "search-music");
        button.innerText = "Музыка";
        menu.appendChild(button);
        
        console.log("✅ Кнопка 'Музыка' добавлена!");

        button.addEventListener("click", function () {
            console.log("🎵 Нажата кнопка 'Музыка'. Выполняем поиск...");
            searchMusic("test"); // Пробный запрос
        });
    }

    function searchMusic(query) {
        console.log(`🔍 Выполняем поиск музыки: ${query}`);

        var url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=5`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("📥 Ответ от API Apple:", data);
                if (data.resultCount > 0) {
                    console.log("🎶 Найденные треки:", data.results);
                } else {
                    console.warn("❌ Музыка не найдена!");
                }
            })
            .catch(error => console.error("⚠️ Ошибка при запросе к API:", error));
    }

    function initPlugin() {
        console.log("🔄 Регистрация компонента поиска музыки...");

        createMusicButton();

        console.log("✅ Плагин поиска музыки загружен!");
    }

    setTimeout(initPlugin, 3000); // Даем время Lampa загрузиться
})();
