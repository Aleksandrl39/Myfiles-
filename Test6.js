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

    function createMusicSearchComponent() {
        Lampa.Component.add('music_search', {
            template: `<div class="music-search">
                <div class="music-search__input">
                    <input type="text" class="music-search__field" placeholder="Введите название трека">
                    <button class="music-search__button">Поиск</button>
                </div>
                <div class="music-search__results"></div>
            </div>`,

            start: function() {
                this.render();
                this.bindEvents();
            },

            render: function() {
                let html = $(this.template);
                this.inputField = html.find('.music-search__field');
                this.searchButton = html.find('.music-search__button');
                this.resultsContainer = html.find('.music-search__results');
                this.body.append(html);
            },

            bindEvents: function() {
                this.searchButton.on('click', () => {
                    let query = this.inputField.val().trim();
                    if (query.length > 0) {
                        this.searchMusic(query);
                    }
                });
            },

            searchMusic: function(query) {
                let url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=10&media=music`;

                console.log("Отправляем запрос к API Apple Music:", url);

                fetch(url)
                    .then(response => response.json())
                    .then(data => this.displayResults(data))
                    .catch(error => console.error("Ошибка при запросе к API:", error));
            },

            displayResults: function(data) {
                this.resultsContainer.empty();

                if (data.results && data.results.length > 0) {
                    data.results.forEach(track => {
                        let item = $(`
                            <div class="music-search__item">
                                <img src="${track.artworkUrl100}" alt="Обложка">
                                <div class="music-search__info">
                                    <p><b>${track.trackName}</b></p>
                                    <p>${track.artistName} — ${track.collectionName}</p>
                                </div>
                            </div>
                        `);
                        this.resultsContainer.append(item);
                    });
                } else {
                    this.resultsContainer.html('<p>Ничего не найдено</p>');
                }
            }
        });
    }

    addMusicButton();
    createMusicSearchComponent();
})();
