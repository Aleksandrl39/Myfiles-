(function() {
    var buttonExists = document.querySelector('.menu-item[data-action="music"]');
    if (buttonExists) return; // Если кнопка уже есть, не добавляем заново.

    function addMusicButton() {
        var menu = document.querySelector('.menu-list');
        if (!menu) return;

        var musicButton = document.createElement('li');
        musicButton.classList.add('menu-item');
        musicButton.setAttribute('data-action', 'music');
        musicButton.innerHTML = '<span class="menu-item__icon"><i class="fa fa-music"></i></span><span class="menu-item__text">Музыка</span>';
        
        // Добавляем в начало списка
        menu.insertBefore(musicButton, menu.firstChild);

        // Обработчик клика
        musicButton.addEventListener('click', function() {
            Lampa.Activity.replace({
                component: 'music_main',
                type: 'main',
                page: 1
            });
        });

        console.log("Кнопка 'Музыка' успешно добавлена!");
    }

    setTimeout(addMusicButton, 1000); // Даем время на загрузку интерфейса
})();
