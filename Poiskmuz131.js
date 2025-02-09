(function () {
    var plugin_id = 'muzis_search';

    console.log("Инициализация плагина поиска музыки...");

    function startPlugin() {
        console.log("Плагин поиска музыки загружается...");

        if (!window.Lampa) {
            console.log("Ошибка: Lampa не загружена!");
            return;
        }

        console.log("Регистрируем компонент поиска музыки...");

        function createSearchComponent() {
            console.log("Создаем компонент поиска...");

            var component = {
                name: plugin_id,
                type: 'search',
                template: `<div class="search-music"><input type="text" id="music-search-input" placeholder="Введите название трека..."></div>`,
                onStart: function () {
                    console.log("Компонент 'muzis_search' стартует...");
                },
                onSearch: function (query) {
                    console.log("Поиск музыки по запросу:", query);
                    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=10`)
                        .then(response => response.json())
                        .then(data => {
                            console.log("Ответ от API:", data);
                            if (data.results && data.results.length > 0) {
                                Lampa.Controller.addItems(data.results.map(track => ({
                                    title: track.trackName,
                                    subtitle: track.artistName,
                                    poster: track.artworkUrl100,
                                    url: track.previewUrl
                                })));
                                console.log("Добавлены результаты поиска.");
                            } else {
                                console.log("Музыка не найдена.");
                            }
                        })
                        .catch(error => console.log("Ошибка при запросе к API:", error));
                },
                onRender: function () {
                    console.log("Рендер компонента 'muzis_search'...");
                }
            };

            Lampa.Component.add(plugin_id, component);
            console.log(`Компонент '${plugin_id}' зарегистрирован!`);
        }

        createSearchComponent();
    }

    if (window.Lampa) {
        startPlugin();
    } else {
        document.addEventListener("DOMContentLoaded", startPlugin);
    }

    console.log("Плагин поиска музыки загружен!");
})();
