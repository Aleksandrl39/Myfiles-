function addMusicButton() {
    setTimeout(() => {
        console.log("Добавляем кнопку 'Музыка' в меню...");

        let menu = $('.menu__list').first();
        let existingButton = menu.find('.menu__item:contains("Музыка")');

        if (existingButton.length === 0) {
            let musicButton = $(`
                <li class="menu__item selector focusable">
                    <div class="menu__ico">
                        <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 3v10.55A4 4 0 0 0 14 14a4 4 0 1 0 0 8 4 4 0 1 0-4-4V7h8V3h-8z"/>
                        </svg>
                    </div>
                    <div class="menu__text">Музыка</div>
                </li>
            `);

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
