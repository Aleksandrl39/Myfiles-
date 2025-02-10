// Добавляем кнопку "Музыка" в меню
function addMusicButton() {
    const waitForMenu = setInterval(() => {
        let menu = $('.menu__list').first();
        if (menu.length > 0) {
            clearInterval(waitForMenu);

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

                musicButton.on('click', function() {
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
        }
    }, 100); // Проверяем каждые 100 мс
}

// Создаём компонент для страницы поиска
Lampa.Component.add('muzis_search', {
    template: `
        <div class="muzis-search">
            <div class="muzis-search__header">
                <h1>Поиск музыки</h1>
            </div>
            <div class="muzis-search__input">
                <input type="text" placeholder="Введите запрос..." class="muzis-search__field" />
            </div>
        </div>
    `,
    mounted() {
        // Фокус на поле ввода при открытии страницы
        this.$el.querySelector('.muzis-search__field').focus();
    }
});

// Запускаем добавление кнопки
addMusicButton();
