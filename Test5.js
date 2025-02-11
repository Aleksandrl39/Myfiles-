(function () {
    console.log("Плагин Музыка загружен");

    function addMusicButton() {
        setTimeout(() => {
            console.log("Добавляем кнопку 'Музыка' в меню...");

            let menu = $('.menu__list').first();
            let existingButton = menu.find('.menu__item:contains("Музыка")');

            if (existingButton.length === 0) {
                let musicButton = $('<li class="menu__item selector focusable"><span>Музыка</span></li>');

                musicButton.on('hover:enter', function () {
                    console.log("Кнопка 'Музыка' нажата, открываем страницу поиска...");
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

    function MusicSearchComponent() {
        let html = $('<div class="music-search"><input type="text" class="search-input" placeholder="Введите название трека"></div>');
        let input = html.find('.search-input');

        input.on('change', function () {
            let query = $(this).val();
            if (query.length > 2) {
                searchMusic(query);
            }
        });

        this.create = function () {
            return html;
        };

        function searchMusic(query) {
            let url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=10`;

            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: function (data) {
                    let results = data.results.map(item => `<div>${item.artistName} - ${item.trackName} (${item.collectionName})</div>`).join('');
                    html.append(`<div class="search-results">${results}</div>`);
                },
                error: function () {
                    html.append('<div class="search-results">Ошибка при загрузке данных</div>');
                }
            });
        }
    }

    Lampa.Component.add('music_search', MusicSearchComponent);
    addMusicButton();
})();
