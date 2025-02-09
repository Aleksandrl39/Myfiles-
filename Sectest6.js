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

            // Обработчик нажатия на кнопку "Музыка"
            musicButton.on('hover:enter', function() {
                console.log("Открываем страницу ввода запроса...");

                // Проверяем, существует ли компонент, перед тем как открыть
                Lampa.Activity.push({
                    url: '',
                    title: 'Поиск музыки',
                    component: 'music_search_page'
                });
            });

            menu.append(musicButton);
            console.log("Кнопка 'Музыка' добавлена!");
        } else {
            console.log("Кнопка 'Музыка' уже есть.");
        }
    }, 3000);
}

// Регистрация нового компонента для поиска
Lampa.Component.add('music_search_page', function() {
    let html = $(`
        <div class="music-search-page">
            <h2 style="text-align: center;">Поиск музыки</h2>
            <input type="text" class="music-search-input" placeholder="Введите запрос..." style="width: 80%; padding: 10px; display: block; margin: 20px auto;">
        </div>
    `);

    let input = html.find('.music-search-input');

    // Фокусируем поле ввода при загрузке страницы
    setTimeout(() => input.focus(), 100);

    // Обработчик нажатия Enter
    input.on('keypress', function(event) {
        if (event.which === 13) { // 13 = Enter
            let query = $(this).val().trim();
            if (query) {
                console.log("Ищем музыку: " + query);
                Lampa.Activity.replace({
                    url: '',
                    title: 'Результаты поиска: ' + query,
                    component: 'muzis_search',
                    search: query
                });
            }
        }
    });

    return {
        render: function() {
            $('body').append(html);
        },
        destroy: function() {
            html.remove();
        }
    };
});

addMusicButton();
