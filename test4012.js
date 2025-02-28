(function () {
    var apiUrl = "https://torrent-api-py-14l7.onrender.com/api/v1/all/search?query=";

    function fetchMusic(query, callback) {
        fetch(apiUrl + encodeURIComponent(query))
            .then(response => response.json())
            .then(json => {
                let torrents = json.data || [];
                let results = torrents.map(item => ({
                    title: item.name || "Неизвестно",
                    link: item.magnet,
                    poster: item.poster || "https://via.placeholder.com/200",
                    seeds: item.seeders || 0,
                    peers: item.leechers || 0,
                    tracker: new URL(item.url).hostname.replace("www.", ""),
                    type: "torrent"
                }));
                callback(results);
            })
            .catch(error => {
                console.error("Ошибка API:", error);
                callback([]);
            });
    }

    function addMusicSource() {
        Lampa.Search.addSource({
            name: "Музыка",
            search: function (query, page, callback) {
                Lampa.Noty.show("🔍 Ищем музыку...");
                fetchMusic(query, (results) => {
                    if (results.length > 0) {
                        Lampa.Noty.show(`✅ Найдено ${results.length} раздач`);
                        callback(results);
                    } else {
                        Lampa.Noty.show("❌ Ничего не найдено.");
                        callback([]);
                    }
                });
            }
        });
    }

    function renderMusicResults(results) {
        let list = [];
        results.forEach(item => {
            let card = {
                title: item.title,
                link: item.link,
                poster: item.poster,
                seeds: item.seeds,
                peers: item.peers,
                tracker: item.tracker,
                type: "torrent"
            };
            list.push(Lampa.Template.get("card", card));
        });

        Lampa.Search.displayResults(list);
    }

    function waitForLampa(callback) {
    if (typeof Lampa !== "undefined" && Lampa.hasOwnProperty("create")) {
        callback();
    } else {
        setTimeout(() => waitForLampa(callback), 500);
    }
}

waitForLampa(startPlugin);
    
    function startPlugin() {
        Lampa.Plugin.create({
            title: "Музыка (Torrent)",
            description: "Добавляет поиск музыкальных торрентов",
            version: "1.0.0",
            author: "Custom Dev",
            onload: addMusicSource
        });
    }

    startPlugin();
})();
