(function() {
    console.log("Плагин Muzis загружен!");

    function addMusicButton() {
        setTimeout(() => {
            console.log("Добавляем кнопку 'Музыка' в меню...");

            let menu = $('.menu__list').first();
            let existingButton = menu.find('.menu__item:contains("Музыка")');

            if (existingButton.length === 0) {
                let musicButton = $('<li class="menu__item selector focusable"><span>Музыка</span></li>');

                musicButton.on('hover:enter', function() {
                    console.log("Кнопка 'Музыка' нажата, пробуем открыть компонент...");

                    try {
                        Lampa.Activity.push({
                            component: 'muzis_search',
                            title: 'Поиск музыки'
                        });
                        console.log("Компонент 'muzis_search' отправлен в Activity!");
                    } catch (error) {
                        console.error("Ошибка при Lampa.Activity.push:", error);
                    }
                });

                menu.append(musicButton);
                console.log("Кнопка 'Музыка' добавлена!");
                Lampa.Layer.update();
            } else {
                console.log("Кнопка 'Музыка' уже есть.");
            }
        }, 3000);
    }

    function createMusicComponent() {
        console.log("Регистрируем компонент поиска музыки...");

        try {
            Lampa.Component.add('muzis_search', {
                start: function() {
                    console.log("Компонент 'muzis_search' стартовал!");

                    let html = $('<div class="music-search"></div>');
                    let input = $('<input type="text" class="music-input selector" placeholder="Введите название трека или исполнителя" autofocus/>');
                    let results = $('<div class="music-results"></div>');

                    html.append(input).append(results);

                    console.log("HTML компонента создан:", html);

                    this.render = function() {
                        console.log("Рендер компонента 'muzis_search'.");
                        return html;
                    };

                    console.log("Компонент 'muzis_search' полностью готов!");
                    Lampa.Layer.update();
                }
            });

            console.log("Компонент 'muzis_search' зарегистрирован!");

            // Принудительный запуск компонента
            setTimeout(() => {
                console.log("Пробуем запустить 'muzis_search' вручную...");
                try {
                    Lampa.Activity.push({
                        component: 'muzis_search',
                        title: 'Поиск музыки'
                    });
                    console.log("Принудительный запуск 'muzis_search' выполнен!");
                } catch (error) {
                    console.error("Ошибка при принудительном запуске 'muzis_search':", error);
                }
            }, 5000);

        } catch (error) {
            console.error("Ошибка при регистрации компонента:", error);
        }
    }

    addMusicButton();
    createMusicComponent();
})();
