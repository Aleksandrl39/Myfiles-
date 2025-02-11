(function() {
    var lastfmApiKey = "5e508b11704a1f7de4dd1ab7da50686d";

    function addMusicButton() {
        setTimeout(() => {
            console.log("Добавляем кнопку 'Музыка' в меню...");

            let menu = $('.menu__list').first();
            let existingButton = menu.find('.menu__item:contains("Музыка")');

            if (existingButton.length === 0) {
                let musicButton = $('<li class="menu__item selector focusable"><span>Музыка</span></li>');

                musicButton.on('hover:enter', function() {
                    console.log("Кнопка 'Музыка' нажата, открываем страницу поиска...");
                    openMusicSearchPage();
                });

                menu.append(musicButton);
                console.log("Кнопка 'Музыка' добавлена!");
            } else {
                console.log("Кнопка 'Музыка' уже есть.");
            }
        }, 3000);
    }

    function openMusicSearchPage() {
        Lampa.Activity.push({
            url: '',
            title: 'Поиск музыки',
            component: 'music_search'
        });
    }

    function musicSearchComponent() {
        Lampa.Component.add('music_search', {
            name: 'Поиск музыки',
            render: function() {
                this.create();
            },
            create: function() {
                var html = $('<div class="music-search"><input type="text" class="music-input" placeholder="Введите название трека..."><button class="music-button">Поиск</button><div class="music-results"></div></div>');

                html.find('.music-button').on('click', () => {
                    var query = html.find('.music-input').val();
                    if (query) {
                        searchMusic(query, html.find('.music-results'));
                    }
                });

                this.rendered = html;
                Lampa.Activity.active().render().append(html);
            },
            destroy: function() {
                this.rendered.remove();
            }
        });
    }

    function searchMusic(query, resultsContainer) {
        var url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${lastfmApiKey}&format=json`;

        $.getJSON(url, function(data) {
            resultsContainer.empty();
            if (data.results && data.results.trackmatches && data.results.trackmatches.track) {
                data.results.trackmatches.track.forEach(track => {
                    var item = $('<div class="music-item"></div>');
                    item.append(`<p><strong>${track.artist}</strong> - ${track.name}</p>`);
                    resultsContainer.append(item);
                });
            } else {
                resultsContainer.append('<p>Ничего не найдено</p>');
            }
        }).fail(() => {
            resultsContainer.append('<p>Ошибка загрузки данных</p>');
        });
    }

    addMusicButton();
    musicSearchComponent();
})();
