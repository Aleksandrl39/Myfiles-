(function () {
    var apiUrl = "https://torrent-api-py-14l7.onrender.com/api/v1/all/search?query=";

    function fetchTorrents(query, callback) {
        fetch(apiUrl + encodeURIComponent(query))
            .then(response => response.json())
            .then(json => {
                let torrents = json.data || [];
                let results = torrents.map(item => ({
                    title: item.name || "Неизвестно",
                    url: item.magnet,
                    poster: item.poster || "https://via.placeholder.com/200",
                    seeds: item.seeders || 0,
                    peers: item.leechers || 0,
                    tracker: new URL(item.url).hostname.replace("www.", "")
                }));
                callback(results);
            })
            .catch(error => {
                console.error("Ошибка API поиска:", error);
                callback([]);
            });
    }

    function modifySearch() {
        Lampa.Listener.follow('search', (event) => {
            if (event.type === 'start') {
                let query = event.value;
                if (!query) return;

                Lampa.Noty.show("🔍 Ищем в торрентах...");

                fetchTorrents(query, (results) => {
                    if (results.length > 0) {
                        let searchResults = results.map(item => ({
                            title: item.title,
                            link: item.url,
                            poster: item.poster,
                            seeds: item.seeds,
                            peers: item.peers,
                            tracker: item.tracker,
                            type: 'torrent'
                        }));

                        Lampa.Storage.set("search_results", searchResults);
                        Lampa.Noty.show("✅ Найдено раздач: " + results.length);

                        // Обновляем результаты поиска в интерфейсе
                        Lampa.Listener.send('search_results', { results: searchResults });
                    } else {
                        Lampa.Noty.show("❌ Ничего не найдено.");
                    }
                });
            }
        });
    }

    function startPlugin() {
        Lampa.Plugin.create({
            title: 'Torrent Search',
            description: 'Добавляет поиск торрентов в Lampa',
            version: '1.0.0',
            author: 'Custom Dev',
            onload: modifySearch
        });
    }

    startPlugin();
})();
