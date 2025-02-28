(function () {
    // Ждем загрузки Lampa
    let checkLampa = setInterval(() => {
        if (typeof window.Lampa !== "undefined") {
            console.log("✅ Lampa загружена!");
            clearInterval(checkLampa);
            startPlugin();
        } else {
            console.log("⏳ Ждем загрузки Lampa...");
        }
    }, 1000);

    function startPlugin() {
        console.log("🚀 Запуск плагина!");

        if (!window.plugin_list) {
            window.plugin_list = [];
        }

        // Добавляем наш плагин в список
        window.plugin_list.push({
            name: "Музыка",
            version: "1.0",
            description: "Поиск музыки через торренты",
            author: "Ты знаешь кто",
        });

        // Подключаем новый источник поиска
        window.Lampa.Listener.follow("search", (event) => {
            if (event.type === "start" && event.source === "Музыка") {
                console.log("🔎 Начат поиск музыки: ", event.query);
                searchMusic(event.query);
            }
        });

        function searchMusic(query) {
            var searchUrl = `https://torrent-api-py-14l7.onrender.com/api/v1/all/search?query=${encodeURIComponent(query)}`;

            fetch(searchUrl)
                .then((response) => response.json())
                .then((data) => {
                    if (data && data.data) {
                        console.log("✅ Найдено:", data.data.length);
                        renderResults(data.data);
                    } else {
                        console.log("❌ Ничего не найдено");
                        window.Lampa.Noty.show("Музыка не найдена");
                    }
                })
                .catch((error) => {
                    console.error("Ошибка API:", error);
                    window.Lampa.Noty.show("Ошибка при загрузке музыки");
                });
        }

        function renderResults(results) {
            let items = results.map((item) => ({
                title: item.name || "Неизвестный альбом",
                poster: item.poster || "https://via.placeholder.com/200",
                magnet: item.magnet,
                seeds: item.seeders || 0,
                peers: item.leechers || 0,
                tracker: new URL(item.url).hostname.replace("www.", ""),
            }));

            window.Lampa.Activity.push({
                url: "",
                title: "Музыкальные торренты",
                component: "feed",
                search: true,
                results: items.map((item) => ({
                    title: item.title,
                    poster: item.poster,
                    onClick: () => {
                        console.log("Открытие magnet:", item.magnet);
                        window.open(item.magnet, "_blank");
                    },
                    subtitle: `📥 ${item.seeds} сидеров | 🟢 ${item.peers} личеров\n🌍 ${item.tracker}`,
                })),
            });
        }
    }
})();
