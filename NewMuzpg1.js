function addMusicButton() {
    setTimeout(() => {
        console.log("Добавляем кнопку 'Музыка' в меню...");

        let menu = $('.menu__list').first();
        let existingButton = menu.find('.menu__item:contains("Музыка")');

        if (existingButton.length === 0) {
            let musicButton = $('<li class="menu__item selector focusable"><span>Музыка</span></li>');

            musicButton.on('hover:enter', function() {
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

function musicSearchComponent() {
    let html = $('<div class="music-search-page"><h1>Поиск музыки</h1><input type="text" id="music-query" placeholder="Введите запрос..."><button id="music-search-btn">Поиск</button><div id="music-results"></div></div>');

    html.find('#music-search-btn').on('click', function() {
        let query = html.find('#music-query').val();
        if (query) searchMusic(query);
    });

    this.create = function() {
        return html;
    };

    function searchMusic(query) {
        let url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=10&entity=musicTrack`;

        $.getJSON(url, function(data) {
            let results = html.find('#music-results');
            results.empty();

            if (data.results.length > 0) {
                data.results.forEach(track => {
                    let item = `<div class="music-item">
                        <p><strong>${track.trackName}</strong> - ${track.artistName}</p>
                        <p>Альбом: ${track.collectionName}</p>
                    </div>`;
                    results.append(item);
                });
            } else {
                results.html("<p>Ничего не найдено.</p>");
            }
        }).fail(() => {
            html.find('#music-results').html("<p>Ошибка запроса.</p>");
        });
    }
}

Lampa.Component.add('music_search', musicSearchComponent);
addMusicButton();
