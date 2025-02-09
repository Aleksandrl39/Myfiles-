(function() {
    const plugin_id = "muzis_search";
    const plugin_name = "Музыка";

    function log(message) {
        console.log(`[${plugin_name}] ${message}`);
    }

    log("Плагин поиска музыки загружается...");

    // Проверяем существование Lampa и его меню
    if (typeof Lampa !== "undefined" && Lampa.Settings) {
        log("Инициализация плагина поиска музыки...");

        // Добавляем кнопку в основное меню
        Lampa.Settings.main().render().find('.selector').first().before(`
            <div class="selector" id="${plugin_id}" style="font-size: 1.4rem; padding: 10px; text-align: center;">
                ${plugin_name}
            </div>
        `);

        log(`Кнопка "${plugin_name}" добавлена в меню.`);

        // Обработчик клика по кнопке
        document.getElementById(plugin_id).addEventListener("click", function() {
            log(`Кнопка "${plugin_name}" нажата.`);

            // Открываем окно поиска
            Lampa.Search.open({
                search: '',
                placeholder: 'Введите запрос для поиска музыки...',
                onSearch: function(query) {
                    log(`Выполняем поиск по запросу: ${query}`);

                    let url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=20&media=music`;

                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            let results = data.results.map(track => ({
                                title: track.trackName,
                                artist: track.artistName,
                                album: track.collectionName,
                                url: track.previewUrl
                            }));

                            log(`Найдено ${results.length} треков.`);
                            Lampa.Noty.show(`Найдено ${results.length} треков.`);
                        })
                        .catch(error => {
                            log("Ошибка при запросе к API: " + error);
                            Lampa.Noty.show("Ошибка поиска музыки.");
                        });
                }
            });
        });

        log(`Компонент "${plugin_id}" зарегистрирован!`);
    } else {
        log("Ошибка: Lampa не загружена.");
    }

    log("Плагин поиска музыки загружен!");
})();
