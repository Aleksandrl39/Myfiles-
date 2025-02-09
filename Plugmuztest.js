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
                    component: 'muzis_search'
                });
            });

            menu.append(musicButton);
            console.log("Кнопка 'Музыка' добавлена!");
        } else {
            console.log("Кнопка 'Музыка' уже есть.");
        }
    }, 3000); // Ждём 3 секунды, чтобы убедиться, что меню загружено
}

addMusicButton();
