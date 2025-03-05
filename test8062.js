(function(){
    let network = new Lampa.Reguest();

    function search(params = {}, oncomplite){
        let url = 'https://torapi.vercel.app/api/search/title/all?query=' + encodeURIComponent(params.query);
        
        network.silent(url, (json)=>{
            console.log("API response:", json);
            if (json && typeof json === "object") {
                // Если API сообщает, что совпадений не найдено – возвращаем пустой массив
                if (json.Result && typeof json.Result === "string" && json.Result.includes("No matches were found")) {
                    console.warn("API не нашло совпадений для:", params.query);
                    oncomplite([]);
                    return;
                }
                
                let categories = ['RuTracker', 'Kinozal', 'RuTor', 'NoNameClub'];
                let results = [];

                categories.forEach(category => {
                    if (json.hasOwnProperty(category) && Array.isArray(json[category])) {
                        json[category].forEach(item => {
                            results.push({
                                id: item.Id,
                                title: item.Name || 'Без названия',
                                original_title: item.Name || 'Без названия',
                                year: item.Date ? item.Date.split('.').pop() : '',
                                poster: '',
                                // Используем оба поля: description и overview
                                description: `Размер: ${item.Size || 'неизвестно'}, Сидов: ${item.Seeds || 0}, Пиров: ${item.Peers || 0}. Категория: ${item.Category || 'Неизвестно'}. Скачиваний: ${item.Download_Count || 0}`,
                                overview: `Размер: ${item.Size || 'неизвестно'}, Сидов: ${item.Seeds || 0}, Пиров: ${item.Peers || 0}. Категория: ${item.Category || 'Неизвестно'}. Скачиваний: ${item.Download_Count || 0}`,
                                info: `Категория: ${item.Category || 'Неизвестно'} | Скачиваний: ${item.Download_Count || 0}`,
                                url: item.Url || '',
                                torrent: item.Torrent || '',
                                results: [] // Поле для совместимости с Lampa
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
        }, (error)=>{
            console.error("Network error:", error);
            oncomplite([]);
        });
    }

    function discovery(){
        return {
            title: 'TorAPI',
            search: search,
            params: {
                align_left: true,
                object: {
                    source: 'torapi'
                }
            }
        };
    }

    if (!Lampa.Api.sources) {
        Lampa.Api.sources = {};
    }
    Lampa.Api.sources.torapi = {
        search: search,
        discovery: discovery
    };

    if (typeof Lampa.Api.availableDiscovery !== "function") {
        Lampa.Api.availableDiscovery = function() { return []; };
    }
    let orig = Lampa.Api.availableDiscovery;
    Lampa.Api.availableDiscovery = function() {
        let list = orig();
        if (!Array.isArray(list)) list = [];
        list.push(discovery());
        return list;
    };
})();
