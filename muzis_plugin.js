(function() {
    const apiUrl = 'https://muzis.ru/api/search.api';

    function addMusicSearch() {
        Lampa.Listener.follow('app', function(event) {
            if (event.type === 'ready') {
                const menu = $('.menu__list').first();
                const musicButton = $('<li class="menu__item selector focusable"><span>Музыка</span></li>');

                musicButton.on('hover:enter', function() {
                    Lampa.Activity.push({
                        url: '',
                        title: 'Поиск музыки',
                        component: 'muzis_search'
                    });
                });

                menu.append(musicButton);
            }
        });
    }

    function createMusicComponent() {
        Lampa.Component.add('muzis_search', {
            start: function() {
                let html = $('<div class="music-search"><input type="text" placeholder="Введите название трека или исполнителя" class="music-input"/><div class="music-results"></div></div>');
                let input = html.find('.music-input');
                let results = html.find('.music-results');

                input.on('change', function() {
                    let query = input.val().trim();
                    if (query.length > 2) {
                        console.log("Отправляем запрос:", query);

                        fetch(apiUrl, {
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

    addMusicSearch();
    createMusicComponent();
})();
