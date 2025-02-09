(function() {
    const apiUrl = 'https://muzis.ru/api/search.api';

    function addMusicSearch() {
        Lampa.Listener.follow('app', function(event) {
            if (event.type === 'ready') {
                const menu = Lampa.Template.get('menu');
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
                const html = $('<div class="music-search"><input type="text" placeholder="Введите название трека или исполнителя" class="music-input"/><div class="music-results"></div></div>');
                const input = html.find('.music-input');
                const results = html.find('.music-results');

                input.on('change', function() {
                    const query = input.val();
                    if (query.length > 2) {
                        fetch(apiUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ q_track: query, size: 10 })
                        })
                        .then(response => response.json())
                        .then(data => {
                            results.empty();
                            data.songs.forEach(track => {
                                const item = $(`<div class="music-item selector focusable"><span>${track.track_name} - ${track.performer}</span></div>`);
                                item.on('hover:enter', function() {
                                    const audio = new Audio(`https://f.muzis.ru/${track.file_mp3}`);
                                    audio.play();
                                });
                                results.append(item);
                            });
                        })
                        .catch(error => console.error("Ошибка загрузки данных:", error));
                    }
                });

                Lampa.Layer.update(html);
            }
        });
    }

    addMusicSearch();
    createMusicComponent();
})();
