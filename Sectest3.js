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

            // Поле для ввода
            let searchInput = $(`
                <input type="text" class="music-search-input" placeholder="Введите запрос..." style="display: none; width: 100%; padding: 5px; margin-top: 10px;">
            `);

            // Обработчик нажатия на кнопку
            musicButton.on('hover:enter', function() {
                console.log("Кнопка 'Музыка' нажата, показываем поле ввода...");
                if (searchInput.is(':visible')) {
                    searchInput.hide(); // Если поле уже видно, скрываем его
                } else {
                    searchInput.show().focus(); // Иначе показываем и фокусируем
                }
            });

            // Обработчик ввода запроса
            searchInput.on('keypress', function(event) {
                if (event.which === 13) { // 13 = Enter
                    let query = $(this).val().trim();
                    if (query) {
                        console.log("Выполняем поиск по запросу: " + query);
                        Lampa.Activity.push({
                            url: '',
                            title: 'Результаты поиска: ' + query,
                            component: 'muzis_search',
                            search: query
                        });
                        $(this).val('').hide(); // Очищаем и скрываем поле после ввода
                    }
                }
            });

            menu.append(musicButton);
            menu.append(searchInput); // Добавляем поле для ввода
            console.log("Кнопка 'Музыка' добавлена!");
        } else {
            console.log("Кнопка 'Музыка' уже есть.");
        }
    }, 3000);
}

addMusicButton();
