(function () {
    function addMusicButton() {
        setTimeout(() => {
            console.log("Добавляем кнопку 'Музыка' в меню...");

            let menu = $('.menu__list').first();
            let existingButton = menu.find('.menu__item:contains("Музыка")');

            if (existingButton.length === 0) {
                let musicButton = $('<li class="menu__item selector focusable"><span>Музыка</span></li>');

                musicButton.on('hover:enter', function () {
                    console.log("Кнопка 'Музыка' нажата, открываем поиск...");
                    openMusicSearch();
                });

                menu.append(musicButton);
                console.log("Кнопка 'Музыка' добавлена!");
            } else {
                console.log("Кнопка 'Музыка' уже существует.");
            }
        }, 3000);
    }

    function openMusicSearch() {
        Lampa.Activity.push({
            url: '',
            title: 'Поиск музыки',
            component: 'music_search'
        });
    }

    function startMusicSearch() {
        console.log("Выполняем поиск музыки через Last.fm...");

        let apiKey = "5e508b11704a1f7de4dd1ab7da50686d";
        let searchQuery = "The Beatles"; // Можно сделать ввод пользователя
        let apiUrl = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(searchQuery)}&api_key=${apiKey}&format=json`;

        $.get(apiUrl, function (data) {
            if (data.results && data.results.trackmatches && data.results.trackmatches.track) {
                let tracks = data.results.trackmatches.track;
                let resultsHtml = '<div class="music-results">';

                tracks.forEach(track => {
                    resultsHtml += `<div class="track-item">
                        <strong>${track.name}</strong> - ${track.artist}
                    </div>`;
                });

                resultsHtml += '</div>';
                Lampa.Modal.open({
                    title: 'Результаты поиска',
                    html: resultsHtml,
                    size: 'large',
                });
            } else {
                console.log("Музыкальные треки не найдены.");
            }
        }).fail(function () {
            console.log("Ошибка при запросе к Last.fm.");
        });
    }

    Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') {
            addMusicButton();
        }
    });

    Lampa.Component.add('music_search', {
        template: `<div class="music-search"><h2>Поиск музыки</h2></div>`,
        onCreate: function () {
            startMusicSearch();
        }
    });

})();
