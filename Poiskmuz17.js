(function () {
    const plugin_id = 'muzis_search';
    const plugin_name = 'Музыка поиск';

    function startPlugin() {
        console.log('Плагин запущен');

        if (!Lampa.Menu) {
            console.error('Lampa.Menu не найден');
            return;
        }

        // Проверяем, зарегистрирован ли компонент 'music_search'
        if (!Lampa.Component.has('music_search')) {
            Lampa.Component.add('music_search', {
                template: '<div class="music-search"><h1>Поиск музыки</h1></div>',
                onCreate: function () {
                    console.log('Компонент "music_search" создан');
                }
            });
        }

        // Создаём кнопку меню
        let menuItem = {
            id: plugin_id,
            title: plugin_name,
            icon: 'https://cdn-icons-png.flaticon.com/512/727/727245.png',
            onClick: () => {
                console.log('Кнопка "Музыка поиск" нажата');
                if (Lampa.Component.has('music_search')) {
                    Lampa.Activity.push({
                        url: '',
                        title: plugin_name,
                        component: 'music_search',
                        page: 1
                    });
                } else {
                    console.error('Компонент "music_search" не найден');
                    Lampa.Noty.show('Ошибка: компонент "music_search" не найден');
                }
            }
        };

        // Проверяем, есть ли кнопка уже в меню
        if (!Lampa.Menu.get(plugin_id)) {
            Lampa.Menu.add(menuItem);
            console.log('Кнопка "Музыка поиск" добавлена в меню');
        } else {
            console.warn('Кнопка "Музыка поиск" уже существует');
        }
    }

    function checkLampaReady() {
        if (typeof Lampa !== 'undefined' && typeof Lampa.Menu !== 'undefined') {
            startPlugin();
        } else {
            console.warn('Lampa не загружена, повторная попытка через 1 секунду');
            setTimeout(checkLampaReady, 1000);
        }
    }

    checkLampaReady();
})();
