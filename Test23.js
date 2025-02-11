(function () {
    var lastFmApiKey = "5e508b11704a1f7de4dd1ab7da50686d";

    function searchMusic(query, callback) {
        var url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${lastFmApiKey}&format=json`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.trackmatches && data.results.trackmatches.track) {
                    var results = data.results.trackmatches.track.map(track => ({
                        title: track.name,
                        artist: track.artist,
                        url: track.url
                    }));
                    callback(results);
                } else {
                    callback([]);
                }
            })
            .catch(error => {
                console.error("Ошибка при запросе к Last.fm:", error);
                callback([]);
            });
    }

    function createMusicSearchPage() {
        var html = `
            <div class="music-search">
                <input id="music-query" type="text" placeholder="Введите название трека">
                <button id="search-music">Искать</button>
                <ul id="music-results"></ul>
            </div>`;

        Lampa.Activity.push({
            title: 'Поиск музыки',
            component: 'music_search',
            page: true
        });

        Lampa.Listener.follow('activity', function (e) {
            if (e.type === 'start' && e.component === 'music_search') {
                $('.activity-full').html(html);

                $('#search-music').on('click', function () {
                    var query = $('#music-query').val();
                    searchMusic(query, function (results) {
                        var resultsList = $('#music-results');
                        resultsList.empty();

                        if (results.length > 0) {
                            results.forEach(result => {
                                resultsList.append(`<li><a href="${result.url}" target="_blank">${result.artist} - ${result.title}</a></li>`);
                            });
                        } else {
                            resultsList.append('<li>Ничего не найдено</li>');
                        }
                    });
                });
            }
        });
    }

    function addMusicButton() {
        var menu = Lampa.Settings.main().render().find('.settings-container');
        var button = $('<div class="settings-item selector"><div class="settings-item-title">Музыка</div></div>');

        button.on('hover:enter', function () {
            createMusicSearchPage();
        });

        menu.append(button);
    }

    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
            addMusicButton();
        }
    });
})();
