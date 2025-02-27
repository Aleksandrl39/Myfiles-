(function () {
    // URL API
    var torrentApiUrl = "https://torapi.vercel.app/api/search/title/all";
    var torrentDetailsApiUrl = "https://torapi.vercel.app/api/search/id";

    // Функция для выполнения запросов к API
    function fetchData(url) {
        return fetch(url)
            .then(response => response.json())
            .catch(error => {
                logMessage(`❌ Ошибка API: ${error}`);
                return null;
            });
    }

    // Функция для поиска торрентов
    function searchTorrents(query) {
        var url = `${torrentApiUrl}?query=${encodeURIComponent(query)}`;
        logMessage(`🔎 Поиск торрентов: <a href="${url}" target="_blank">${url}</a>`);
        return fetchData(url).then(data => data || {});
    }

    // Функция для получения деталей торрента по ID и трекеру
    function getDetailsById(tracker, id) {
        var url = `${torrentDetailsApiUrl}/${tracker}?query=${id}`;
        logMessage(`📡 Запрос деталей: <a href="${url}" target="_blank">${url}</a>`);
        return fetchData(url).then(data => data?.[tracker]?.[0] || {});
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

        // Контейнер для логов
        var logContainer = document.createElement("div");
        logContainer.id = "debug-log";
        logContainer.style.height = "150px";
        logContainer.style.overflowY = "auto";
        logContainer.style.background = "#222";
        logContainer.style.color = "#bbb";
        logContainer.style.fontSize = "12px";
        logContainer.style.padding = "5px";
        logContainer.style.marginTop = "10px";
        logContainer.style.borderRadius = "5px";
        document.body.appendChild(logContainer);

        // Функция для логирования сообщений
        function logMessage(message) {
            var p = document.createElement("p");
            p.innerHTML = message;
            logContainer.appendChild(p);
            logContainer.scrollTop = logContainer.scrollHeight;
        }

        // Функция для отображения списка результатов
        function renderList(items) {
            resultsContainer.innerHTML = "";
            if (Object.keys(items).length === 0) {
                resultsContainer.innerHTML = "<p>Ничего не найдено.</p>";
                return;
            }

            // Обработка каждого трекера и торрента
            Object.entries(items).forEach(([tracker, torrents]) => {
                torrents.forEach(item => {
                    var div = document.createElement("div");
                    div.style.display = "flex";
                    div.style.alignItems = "center";
                    div.style.padding = "10px";
                    div.style.marginBottom = "5px";
                    div.style.backgroundColor = "#333";
                    div.style.color = "#fff";
                    div.style.borderRadius = "5px";
                    div.style.cursor = "pointer";

                    // Изображение постера (заглушка по умолчанию)
                    var img = document.createElement("img");
                    img.style.width = "50px";
                    img.style.height = "50px";
                    img.style.marginRight = "10px";
                    img.style.borderRadius = "5px";
                    img.src = "https://via.placeholder.com/100";
                    img.onerror = function() {
                        img.src = "https://via.placeholder.com/100"; // Заглушка при ошибке
                    };

                    // Текст с названием и статистикой
                    var text = document.createElement("div");
                    text.innerHTML = `
                        <strong>${item.Name || "Неизвестная раздача"}</strong><br>
                        📥 <strong>${item.Seeds || 0}</strong> сидеров | 🟢 <strong>${item.Peers || 0}</strong> личеров
                    `;

                    // Добавляем элементы в контейнер
                    div.appendChild(img);
                    div.appendChild(text);

                    // Запрос деталей для постера и magnet-ссылки
                    getDetailsById(tracker, item.Id).then(details => {
                        if (details?.Poster) img.src = details.Poster; // Обновляем постер
                        item.details = details; // Сохраняем детали
                    });

                    // Обработчик клика для открытия magnet-ссылки
                    div.addEventListener("click", () => {
                        if (item.details?.Magnet) {
                            window.open(item.details.Magnet, "_blank");
                        } else {
                            alert("Magnet-ссылка не найдена.");
                        }
                    });

                    resultsContainer.appendChild(div);
                });
            });
        }

        // Обработчик ввода в поле поиска
        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                var query = searchInput.value.trim();
                if (!query) {
                    logMessage("❌ Введите запрос для поиска.");
                    return;
                }

                logMessage(`🔎 Поиск запроса: ${query}`);
                resultsContainer.innerHTML = "<p>Загрузка...</p>";

                // Выполняем поиск и отображаем результаты
                searchTorrents(query).then(torrents => {
                    renderList(torrents);
                });
            }
        });
    }

    // Создаем страницу поиска
    createSearchPage();
})();
