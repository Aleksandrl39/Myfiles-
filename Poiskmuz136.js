(function() {
    let component = {
        name: 'muzis_search',
        version: '1.3.5',
        description: 'Поиск музыки для Lampa',
        start: function() {
            console.log('Плагин поиска музыки загружается...');
            
            // Проверяем, зарегистрирован ли компонент
            if (Lampa.Component.has('muzis_search')) {
                console.warn('Компонент уже зарегистрирован!');
                return;
            }

            // Регистрируем компонент поиска музыки
            Lampa.Component.add({
                name: 'muzis_search',
                template: 'search',  // Исправлено: указываем существующий шаблон
                onCreate: function() {
                    console.log('Создан компонент поиска музыки');
                },
                onDestroy: function() {
                    console.log('Компонент поиска музыки удален');
                }
            });

            console.log('Компонент "muzis_search" зарегистрирован!');
        }
    };

    Lampa.Plugins.add(component);
})();
