(function() {
    var lastFmApiKey = "5e508b11704a1f7de4dd1ab7da50686d";

    function createMusicButton() {
        var button = $('<li class="menu__item selector focus" data-action="music"><div class="menu__ico"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 3V14.17A3.5 3.5 0 0 0 8 14A3.5 3.5 0 1 0 11.5 17.5V7H16V14.17A3.5 3.5 0 0 0 15 14A3.5 3.5 0 1 0 18.5 17.5V3H9Z" /></svg></div><div class="menu__text">Музыка</div></li>');

        button.on("hover:enter", function() {
            Lampa.Activity.push({
                url: '',
                title: 'Поиск музыки',
                component: 'music_search'
            });
        });

        $('.menu__list').eq(0).append(button);
    }

    function createMusicSearchComponent() {
        Lampa.Component.add('music_search', {
            template: function() {
                return $('<div class="music-search"><div class="music-search__input"><input type="text" placeholder="Введите название трека или исполнителя"/><button class="search-btn">Поиск</button></div><div class="music-search__results"></div></div>');
            },
            create: function() {
                var _this = this;
                this.html = this.template();

                this.html.find('.search-btn').on('click', function() {
                    var query = _this.html.find('input').val();
                    if (query.trim() !== '') {
                        searchMusic(query, _this.html.find('.music-search__results'));
                    }
                });

                this.render();
            },
            render: function() {
                Lampa.Controller.add('content', {
                    toggle: function() {
                        Lampa.Controller.collectionSet($('.music-search'));
                        Lampa.Controller.collectionFocus(false, $('.music-search'));
                    }
                });

                Lampa.Controller.toggle('content');
                $('body').append(this.html);
            },
            destroy: function() {
                this.html.remove();
            }
        });
    }

    function searchMusic(query, resultContainer) {
        var url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${lastFmApiKey}&format=json`;

        $.ajax({
            url: url,
            method: 'GET',
            success: function(response) {
                resultContainer.empty();
                if (response.results && response.results.trackmatches && response.results.trackmatches.track.length > 0) {
                    response.results.trackmatches.track.forEach(function(track) {
                        var item = $('<div class="music-item selector"><img src="' + (track.image[2]['#text'] || 'https://via.placeholder.com/64') + '" alt=""><div class="music-info"><div class="music-title">' + track.name + '</div><div class="music-artist">' + track.artist + '</div></div></div>');
                        resultContainer.append(item);
                    });

                    Lampa.Controller.collectionSet(resultContainer);
                    Lampa.Controller.collectionFocus(false, resultContainer);
                } else {
                    resultContainer.append('<div class="music-no-results">Ничего не найдено</div>');
                }
            },
            error: function() {
                resultContainer.append('<div class="music-no-results">Ошибка запроса</div>');
            }
        });
    }

    Lampa.Listener.follow('app', function(event) {
        if (event.type === 'ready') {
            createMusicButton();
            createMusicSearchComponent();
        }
    });

})();
