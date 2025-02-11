(function () {
    console.log("Загрузка плагина 'Музыка'...");

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

    function createMusicSearchComponent() {
        Lampa.Component.add('music_search', {
            template: `<div class="music-search">
                           <div class="music-search__input">
                               <input type="text" class="music-search__field" placeholder="Введите название трека..."/>
                               <button class="music-search__button">Искать</button>
                           </div>
                           <div class="music-search__results"></div>
                       </div>`,

            start: function () {
                console.log("Запущен компонент 'music_search'");

                let inputField = this.render().find('.music-search__field');
                let searchButton = this.render().find('.music-search__button');
                let resultsContainer = this.render().find('.music-search__results');

                searchButton.on('click', function () {
                    let query = inputField.val().trim();
                    if (query) {
                        searchMusic(query, resultsContainer);
                    }
                });
            }
        });
    }

    function searchMusic(query, container) {
        console.log("Отправка запроса к Apple Music API...");

        let url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=10`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("Ответ получен:", data);
                displayResults(data.results, container);
            })
            .catch(error => console.error("Ошибка запроса:", error));
    }

    function displayResults(results, container) {
        container.empty();

        if (results.length === 0) {
            container.append('<div class="music-search__no-results">Ничего не найдено</div>');
            return;
        }

        results.forEach(track => {
            let trackElement = $(`
                <div class="music-search__result">
                    <img src="${track.artworkUrl100}" alt="${track.trackName}" class="music-search__cover">
                    <div class="music-search__info">
                        <div class="music-search__title">${track.trackName}</div>
                        <div class="music-search__artist">${track.artistName}</div>
                        <div class="music-search__album">${track.collectionName}</div>
                    </div>
                </div>
            `);

            container.append(trackElement);
        });
    }

    createMusicSearchComponent();
    addMusicButton();
})();
