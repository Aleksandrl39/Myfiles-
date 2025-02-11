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
                        component: 'search',
                        search: true,
                        search_type: 'lastfm_music'
                    });
                });

                menu.append(musicButton);
                console.log("Кнопка 'Музыка' добавлена!");
            } else {
                console.log("Кнопка 'Музыка' уже есть.");
            }
        }, 3000); // Ждём 3 секунды, чтобы убедиться, что меню загружено
    }

    function extendSearch() {
        let originalSearch = Lampa.Search;

        Lampa.Search = function(data, call) {
            if (data.type === 'lastfm_music') {
                console.log("Выполняем поиск музыки через Last.fm:", data.query);

                let apiKey = '5e508b11704a1f7de4dd1ab7da50686d';
                let url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(data.query)}&api_key=${apiKey}&format=json`;

                $.ajax({
                    url: url,
                    method: 'GET',
                    success: function(response) {
                        console.log("Ответ от Last.fm:", response);
                        let results = [];

                        if (response.results && response.results.trackmatches && response.results.trackmatches.track) {
                            response.results.trackmatches.track.forEach(track => {
                                results.push({
                                    title: `${track.artist} - ${track.name}`,
                                    image: track.image && track.image.length > 0 ? track.image[2]['#text'] : '',
                                    url: track.url
                                });
                            });
                        }

                        call({ results: results });
                    },
                    error: function(error) {
                        console.error("Ошибка при запросе к Last.fm:", error);
                        call({ results: [] });
                    }
                });
            } else {
                originalSearch(data, call);
            }
        };
    }

    Lampa.Listener.follow('app', function(event) {
        if (event.type === 'ready') {
            addMusicButton();
            extendSearch();
        }
    });
})();
