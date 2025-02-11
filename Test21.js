(function() {
    function addMusicButton() {
        setTimeout(() => {
            console.log("Добавляем кнопку 'Музыка' в меню...");

            let menu = $('.menu__list').first();
            let existingButton = menu.find('.menu__item:contains("Музыка")');

            if (existingButton.length === 0) {
                let musicButton = $('<li class="menu__item selector focusable"><span>Музыка</span></li>');

                musicButton.on('hover:enter', function() {
                    console.log("Кнопка 'Музыка' нажата, открываем поиск...");
                    Lampa.Activity.push({
                        url: '',
                        title: 'Поиск музыки',
                        component: 'music_search'
                    });
                });

                menu.append(musicButton);
                console.log("Кнопка 'Музыка' добавлена!");
            } else {
                console.log("Кнопка 'Музыка' уже есть.");
            }
        }, 3000);
    }

    function MusicSearch() {
        let html = $('<div class="music-search"><input type="text" class="search-input" placeholder="Введите название трека..."><div class="search-results"></div></div>');
        let input = html.find('.search-input');
        let results = html.find('.search-results');

        input.on('keydown', function(e) {
            if (e.keyCode === 13) {
                let query = input.val().trim();
                if (query.length > 0) {
                    searchMusic(query);
                }
            }
        });

        function searchMusic(query) {
            let apiKey = '5e508b11704a1f7de4dd1ab7da50686d';
            let url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${apiKey}&format=json`;

            results.empty().append('<div>Загрузка...</div>');

            $.ajax({
                url: url,
                method: 'GET',
                success: function(data) {
                    results.empty();
                    if (data.results && data.results.trackmatches && data.results.trackmatches.track.length > 0) {
                        data.results.trackmatches.track.forEach(track => {
                            let item = $(`<div class="track-item">
                                <b>${track.artist}</b> - ${track.name}
                            </div>`);
                            results.append(item);
                        });
                    } else {
                        results.append('<div>Ничего не найдено.</div>');
                    }
                },
                error: function() {
                    results.empty().append('<div>Ошибка при загрузке данных.</div>');
                }
            });
        }

        this.create = function() {
            return html;
        };
    }

    Lampa.Component.add('music_search', MusicSearch);

    addMusicButton();
})();
