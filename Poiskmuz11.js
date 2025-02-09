(function() {
    console.log("Плагин поиска музыки загружен!");

    function addMusicButton() {
        setTimeout(() => {
            let menu = $('.menu__list').first();
            if (menu.find('.menu__item:contains("Музыка")').length === 0) {
                let musicButton = $('<li class="menu__item selector focusable"><span>Музыка</span></li>');
                musicButton.on('hover:enter', function() {
                    Lampa.Activity.push({ component: 'music_search', title: 'Поиск музыки' });
                });
                menu.append(musicButton);
                Lampa.Layer.update();
            }
        }, 3000);
    }

    function createMusicComponent() {
        console.log("Регистрируем компонент поиска музыки...");
console.log("Попытка рендеринга компонента поиска музыки...");
        Lampa.Component.add('music_search', {
            start: function() {
                console.log("Компонент 'music_search' стартовал.");

                this.html = $(`
                    <div class="music-search">
                        <div class="search__input">
                            <input type="text" placeholder="Введите название трека или исполнителя">
                        </div>
                        <div class="search__results"></div>
                    </div>
                `);

                let input = this.html.find('input');
                let results = this.html.find('.search__results');

                input.on('change', () => {
                    let query = input.val().trim();
                    if (query.length > 2) {
                        console.log("Отправляем запрос на поиск:", query);

                        fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music`)
                        .then(response => response.json())
                        .then(data => {
                            console.log("Ответ от API:", data);
                            results.empty();

                            if (data.results && data.results.length > 0) {
                                data.results.forEach(track => {
                                    let item = $(`
                                        <div class="search__result selector">
                                            <img src="${track.artworkUrl100}" class="album-cover">
                                            <span>${track.trackName} - ${track.artistName}</span>
                                        </div>
                                    `);

                                    item.on('hover:enter', function() {
                                        if (track.previewUrl) {
                                            console.log("Воспроизведение превью:", track.previewUrl);
                                            Lampa.Player.play({
                                                title: `${track.trackName} - ${track.artistName}`,
                                                url: track.previewUrl
                                            });
                                        } else {
                                            console.log("Превью недоступно");
                                        }
                                    });

                                    results.append(item);
                                });
                            } else {
                                results.append('<div class="search__result">Ничего не найдено</div>');
                            }
                        })
                        .catch(error => {
                            console.error("Ошибка при загрузке данных:", error);
                            results.append('<div class="search__result">Ошибка загрузки</div>');
                        });
                    }
                });

                this.render = () => this.html;
                Lampa.Layer.update();
            }
        });
    }

    addMusicButton();
    createMusicComponent();
})();
