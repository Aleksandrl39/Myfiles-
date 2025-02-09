// Исправленный код плагина поиска музыки для Lampa

(function() {
    const Plugin = {
        id: 'muzis_search',
        name: 'Поиск музыки',
        version: '1.3.5',
        description: 'Плагин для поиска музыки через API Apple Music'
    };

    function init() {
        console.log('Инициализация плагина поиска музыки...');
        
        // Проверяем наличие Lampa
        if (typeof Lampa === 'undefined') {
            console.error('Ошибка: Lampa не загружена!');
            return;
        }

        // Добавляем кнопку "Музыка" в верхнее меню
        Lampa.Listener.follow('app', function(event) {
            if (event.type === 'ready') {
                addMusicButton();
            }
        });

        // Регистрация компонента поиска музыки
        Lampa.Component.add('music_search', {
            template: `<div class="music-search"><h1>Поиск музыки</h1></div>`,
            onCreate: function() {
                console.log('Компонент music_search создан');
            }
        });
    }

    function addMusicButton() {
        console.log('Добавляем кнопку "Музыка"...');

        const menu = Lampa.Settings.main().render().find('.settings-container');
        
        if (!menu.length) {
            console.error('Ошибка: не найден контейнер меню');
            return;
        }

        // Удаляем старую кнопку, если она есть
        menu.find('.music-search-btn').remove();

        // Создаём новую кнопку
        const button = $('<div class="settings-item selector music-search-btn"><div class="settings-item__name">Музыка</div></div>');
        button.on('hover:enter', function() {
            Lampa.Activity.push({
                url: '',
                title: 'Музыка',
                component: 'music_search'
            });
        });

        // Добавляем кнопку в меню выше фильмов
        menu.prepend(button);
        console.log('Кнопка "Музыка" добавлена в меню');
    }

    // Исправление ошибки settings_undefined
    if (!Lampa.Settings.has('music_plugin_settings')) {
        Lampa.Settings.add({
            key: 'music_plugin_settings',
            name: 'Настройки поиска музыки',
            type: 'select',
            values: ['Apple Music', 'Spotify'],
            default: 'Apple Music'
        });
    }

    // Запускаем плагин
    init();

    console.log(`Плагин "${Plugin.name}" версии ${Plugin.version} загружен!`);
})();
