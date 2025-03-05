(function () {
    let network = new Lampa.Reguest();

    function search(params = {}, oncomplite) {
        let url = 'https://torapi.vercel.app/api/search/title/all?query=' + encodeURIComponent(params.query);

        network.silent(url, (json) => {
            console.log("API response:", json);
            if (json && typeof json === "object") {
                // Если API сообщает, что совпадений не найдено – возвращаем пустой результат
                if (json.Result && typeof json.Result === "string" && json.Result.includes("No matches were found")) {
                    console.warn("Нет совпадений для:", params.query);
                    oncomplite([]);
                    return;
                }

                let categories = ['RuTracker', 'Kinozal', 'RuTor', 'NoNameClub'];
                let results = [];

                categories.forEach(category => {
                    if (json.hasOwnProperty(category) && Array.isArray(json[category])) {
                        json[category].forEach(item => {
                            results.push({
                                id: item.Id || 'unknown',
                                name: item.Name || 'Без названия',
                                author: 'Автор неизвестен',
                                url: item.Url || '',
                                status: 1,
                                premium: false,
                                descr: `Размер: ${item.Size || 'неизвестно'}. Сиды: ${item.Seeds || 0}, Пиры: ${item.Peers || 0}`,
                                results: []
                            });
                        });
                    }
                });

                console.log("Parsed results:", results);
                oncomplite(Array.isArray(results) && results.length > 0 ? results.slice(0, 50) : []);
            } else {
                console.error("Unexpected API data:", json);
                oncomplite([]);
            }
        }, (error) => {
            console.error("Network error:", error);
            oncomplite([]);
        });
    }

    function discovery() {
        return {
            title: 'TorAPI',
            search: search,
            params: {
                align_left: true,
                object: { source: 'torapi' }
            }
        };
    }

    if (!Lampa.Api.sources) {
        Lampa.Api.sources = {};
    }
    Lampa.Api.sources.torapi = { search: search, discovery: discovery };

    if (typeof Lampa.Api.availableDiscovery !== "function") {
        Lampa.Api.availableDiscovery = function () { return []; };
    }
    let orig = Lampa.Api.availableDiscovery;
    Lampa.Api.availableDiscovery = function () {
        let list = orig();
        if (!Array.isArray(list)) list = [];
        list.push(discovery());
        return list;
    };
})();
