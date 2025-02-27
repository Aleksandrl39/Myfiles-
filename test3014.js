(function () {
    // URL API
    var torrentApiUrl = "https://torapi.vercel.app/api/search/title/all";
    var torrentDetailsApiUrl = "https://torapi.vercel.app/api/search/id";

    // Функция для выполнения запросов к API
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.log("❌ Ошибка API: " + error);
            return null;
        }
    }

    // Функция для поиска торрентов
    async function searchTorrents(query) {
        var url = `${torrentApiUrl}?query=${encodeURIComponent(query)}`;
        const data = await fetchData(url);
        return data || {}; // Возвращаем все трекеры
    }

    // Функция для получения деталей торрента по ID и трекеру
    async function getDetailsById(tracker, id) {
        var url = `${torrentDetailsApiUrl}/${tracker}?query=${id}`;
        const data = await fetchData(url);
        return data?.[0] || {}; // Ответ — массив, берем первый элемент
    }

    // Функция для создания страницы поиска
    function createSearchPage() {
        // Очистка и настройка страницы
        document.body.innerHTML = "";
        document.body.style.background = "#121212";
        document.body.style.color = "#fff";
        document.body.style.fontFamily = "Arial, sans-serif";
        document.body.style.padding = "10px";
        document.body.style.display = "flex";
        document.body.style.flexDirection = "column";
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";

        // Заголовок
        var title = document.createElement("h2");
        title.textContent = "Поиск";
        title.style.textAlign = "center";
        title.style.marginBottom = "10px";
        document.body.appendChild(title);

        // Поле поиска
        var searchInput = document.createElement("input");
        searchInput.type = "search";
        searchInput.placeholder = "Введите текст...";
        searchInput.style.width = "100%";
        searchInput.style.background = "#333";
        searchInput.style.border = "none";
        searchInput.style.outline = "none";
        searchInput.style.color = "#fff";
        searchInput.style.fontSize = "16px";
        searchInput.style.padding = "10px";
        searchInput.style.borderRadius = "10px";
        document.body.appendChild(searchInput);

        // Контейнер для результатов
        var resultsContainer = document.createElement("div");
        resultsContainer.style.flexGrow = "1";
        resultsContainer.style.overflowY = "auto";
        resultsContainer.style.marginTop = "10px";
        resultsContainer.style.paddingRight = "10px";
        document.body.appendChild(resultsContainer);

        // Функция для отображения списка результатов
        async function renderList(items) {
            resultsContainer.innerHTML = "";
            if (Object.keys(items).length === 0) {
                resultsContainer.innerHTML = "<p>Ничего не найдено.</p>";
                return;
            }

            // Обработка каждого трекера
            for (const [tracker, data] of Object.entries(items)) {
                // Пропускаем трекеры, где нет результатов
                if (data.Result && data.Result.includes("No matches")) continue;

                // Обрабатываем массив торрентов
                for (const item of data) {
                    const div = document.createElement("div");
                    div.style.display = "flex";
                    div.style.alignItems = "center";
                    div.style.padding = "10px";
                    div.style.marginBottom = "5px";
                    div.style.backgroundColor = "#333";
                    div.style.color = "#fff";
                    div.style.borderRadius = "5px";
                    div.style.cursor = "pointer";

                    // Изображение постера (заглушка по умолчанию)
                    const img = document.createElement("img");
                    img.style.width = "50px";
                    img.style.height = "50px";
                    img.style.marginRight = "10px";
                    img.style.borderRadius = "5px";
                    img.src = "https://via.placeholder.com/100";
                    img.onerror = function () {
                        img.src = "https://via.placeholder.com/100"; // Заглушка при ошибке
                    };

                    // Текст с названием и статистикой
                    const text = document.createElement("div");
                    text.innerHTML = `
                        <strong>${item.Name || "Неизвестная раздача"}</strong><br>
                        📥 <strong>${item.Seeds || 0}</strong> сидеров | 🟢 <strong>${item.Peers || 0}</strong> личеров
                    `;

                    // Добавляем элементы в контейнер
                    div.appendChild(img);
                    div.appendChild(text);

                    // Запрос деталей для постера и magnet-ссылки
                    const details = await getDetailsById(tracker, item.Id);
                    if (details?.Poster) img.src = details.Poster; // Обновляем постер

                    // Обработчик клика для открытия magnet-ссылки
                    div.addEventListener("click", () => {
                        if (details?.Magnet) {
                            window.open(details.Magnet, "_blank");
                        } else {
                            alert("Magnet-ссылка не найдена.");
                        }
                    });

                    resultsContainer.appendChild(div);
                }
            }
        }

        // Обработчик ввода в поле поиска
        searchInput.addEventListener("keypress", async function (event) {
            if (event.key === "Enter") {
                const query = searchInput.value.trim();
                if (!query) return;

                resultsContainer.innerHTML = "<p>Загрузка...</p>";

                const torrents = await searchTorrents(query);
                renderList(torrents);
            }
        });
    }

    // Создаем страницу поиска
    createSearchPage();
})();
