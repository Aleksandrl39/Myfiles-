(function(){
    let network = new Lampa.Reguest();

    function search(params = {}, oncomplite){
        let url = 'https://torapi.vercel.app/api/search/title/all?query=' + encodeURIComponent(params.query);
        
        network.silent(url, (json)=>{
            console.log("API response:", json);
            if (json && typeof json === "object") {
                // Если API сообщает, что совпадений не найдено, возвращаем пустой массив
                if (json.Result && typeof json.Result === "string" && json.Result.includes("No matches were found")) {
                    console.warn("No matches found for query:", params.query);
                    oncomplite([]);
                    return;
                }
                
                let categories = ['RuTracker', 'Kinozal', 'RuTor', 'NoNameClub'];
                let results = [];

                categories.forEach(category => {
                    if (json.hasOwnProperty(category) && Array.isArray(json[category])) {
                        json[category].forEach(item => {
                            // Формируем объект результата в формате Lampa
                            results.push({
                                id: item.Id,
                                title: item.Name || 'Без названия',
                                original_title: item.Name || 'Без названия',
                                year: item.Date ? item.Date.split('.').pop() : '',
                                poster: '', // API не предоставляет изображения
                                description: `Размер: ${item.Size || 'неизвестно'}, Раздают: ${item.Seeds || 0}, Качают: ${item.Peers || 0}`,
                                info: `Категория: ${item.Category || 'Неизвестно'} | Скачиваний: ${item.Download_Count || 0}`,
                                url: item.Url || '',
                                torrent: item.Torrent || '',
                                results: [] // Для совместимости с Lampa
                            });
                        });
                    }
                });
                
                console.log("Parsed results:", results);
                // Возвращаем срез массива (до 50 элементов) или пустой массив, если ничего не найдено
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

    // Обеспечиваем, что Lampa.Api.sources существует
    if (!Lampa.Api.sources) {
        Lampa.Api.sources = {};
    }
    Lampa.Api.sources.torapi = {
        search: search,
        discovery: discovery
    };

    // Расширяем availableDiscovery, чтобы добавить наш источник
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
