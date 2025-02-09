(function() {
    console.log("Плагин Muzis загружается...");

    function addMusicButton() {
        Lampa.Listener.follow('app', function(event) {
            if (event.type === 'ready') {
                console.log("Lampa загрузилась, добавляем кнопку в меню...");

                let menu = $('.menu__list').first();
                let existingButton = menu.find('.menu__item:contains("Музыка")');

                // Проверяем, что кнопка ещё не добавлена
                if (existingButton.length === 0) {
                    let musicButton = $('<li class="menu__item selector focusable"><span>Музыка</span></li>');

                    musicButton.on('hover:enter', function() {
                        console.log("Кнопка 'Музыка' нажата, открываем поиск...");
                        Lampa.Activity.push({
                            url: '',
                            title: 'Поиск музыки',
                            component: 'muzis_search'
                        });
                    });

                    menu.append(musicButton);
                    console.log("Кнопка 'Музыка' добавлена!");
                } else {
                    console.log("Кнопка 'Музыка' уже есть в меню.");
                }
            }
        });
    }

    function createMusicComponent() {
        console.log("Регистрируем компонент поиска музыки...");

        Lampa.Component.add('muzis_search', {
            start: function() {
                console.log("Компонент 'muzis_search' запущен.");

                let html = $(`
                    <div class="music-search">
                        <input type="text" placeholder="Введите название трека или исполнителя" class="music-input"/>
                        <div class="music-results"></div>
                    </div>
                `);

                let input = html.find('.music-input');
                let results = html.find('.music-results');

                input.on('change', function() {
                    let query = input.val().trim();
                    if (query.length > 2) {
                        console.log("Отправляем запрос на поиск:", query);

                        fetch('https://muzis.ru/api/search.api', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ q_track: query, size: 10 })
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log("Ответ от API:", data);

                            results.empty();
                            if (data.songs && data.songs.length > 0) {
                                data.songs.forEach(track => {
                                    let item = $(`<div class="music-item selector focusable"><span>${track.track_name} - ${track.performer}</span></div>`);
                                    item.on('hover:enter', function() {
                                        let audioUrl = `https://f.muzis.ru/${track.file_mp3}`;
                                        console.log("Запуск трека:", audioUrl);

                                        let audio = new Audio(audioUrl);
                                        audio.play();
                                    });
                                    results.append(item);
                                });
                            } else {
                                results.append('<div class="music-item">Ничего не найдено</div>');
                            }
                        })
                        .catch(error => {
                            console.error("Ошибка при загрузке данных:", error);
                            results.append('<div class="music-item">Ошибка загрузки</div>');
                        });
                    }
                });

                Lampa.Layer.update(html);
            }
        });
    }

    addMusicButton();
    createMusicComponent();
})();
