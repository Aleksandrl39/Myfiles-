// Инициализация плагина
console.log("Инициализация плагина поиска музыки...");

// Создание компонента поиска
function createSearchComponent() {
    console.log("Создаем компонент поиска...");

    let searchComponent = {
        id: "muzis_search",
        name: "Музыкальный поиск",
        type: "search",
        onSearch: function (query) {
            console.log(`Поиск музыки по запросу: ${query}`);
            searchMusic(query);
        }
    };

    registerComponent(searchComponent);
}

// Регистрация компонента
function registerComponent(component) {
    console.log(`Регистрируем компонент поиска музыки: ${component.id}`);
    
    if (typeof Lampa !== "undefined" && Lampa.Component) {
        Lampa.Component.add(component);
        console.log(`Компонент '${component.id}' зарегистрирован!`);
    } else {
        console.error("Ошибка: Lampa.Component не доступен.");
    }
}

// Функция поиска музыки через API Apple
function searchMusic(query) {
    let apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=10`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Получены результаты поиска:", data);
            displayResults(data.results);
        })
        .catch(error => console.error("Ошибка при получении данных из API:", error));
}

// Отображение результатов поиска
function displayResults(results) {
    console.log("Рендер результатов поиска...");

    if (results.length === 0) {
        console.log("Нет результатов.");
        return;
    }

    results.forEach(track => {
        console.log(`🎵 ${track.trackName} - ${track.artistName}`);
    });
}

// Запуск плагина
console.log("Плагин поиска музыки загружается...");
createSearchComponent();
console.log("Плагин поиска музыки загружен!");
