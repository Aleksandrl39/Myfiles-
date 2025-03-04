(function() {
    function createMusicButton() {
        // Найдём контейнер с главным меню
        var menu = document.querySelector('.menu__list');

        if (!menu) {
            console.error('Music Plugin: не найден контейнер меню');
            return;
        }

        // Создаём новый элемент кнопки
        var musicButton = document.createElement('li');
        musicButton.className = 'menu__item selector';
        musicButton.innerHTML = '<span>Музыка</span>';
        musicButton.addEventListener('click', function() {
            Noty.show('Музыкальный раздел в разработке!');
        });

        // Добавляем кнопку в меню
        menu.appendChild(musicButton);

        console.log('Music Plugin: кнопка "Музыка" добавлена');
    }

    // Регистрируем плагин в Lampa
    if (window.lampa && typeof window.lampa.registerPlugin === 'function') {
        window.lampa.registerPlugin('MusicPlugin', {
            init: createMusicButton
        });
    } else {
        console.error('Music Plugin: Lampa не поддерживает плагины');
    }
})();
