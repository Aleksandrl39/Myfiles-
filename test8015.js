(function(){
    let network = new Lampa.Reguest();

    function search(params = {}, oncomplite){
        let url = 'https://torapi.vercel.app/api/search/title/all?query=' + encodeURIComponent(params.query);

        network.silent(url, (json)=>{
            console.log("Ответ от API:", json); // Логируем полный ответ API

            if (json && typeof json === 'object') {
                // Если API вернуло "No matches were found", просто возвращаем пустой массив
                if (json.Result && json.Result.includes("No matches were found")) {
                    console.warn("API не нашло совпадений для:", params.query);
                    oncomplite([]);
                    return;
                }

                let categories = ['RuTracker', 'Kinozal', 'RuTor', 'NoNameClub'];
                let results = [];

                categories.forEach(category => {
                    if (json.hasOwnProperty(category) && Array.isArray(json[category])) {
                        json[category].forEach(item => {
                            if (item.Url || item.Torrent) { // Исключаем пустые ссылки
                                results.push({
                                    title: item.Name || 'Без названия',
                                    poster: '', 
                                    description: `Размер: ${item.Size || 'неизвестно'}, Раздают: ${item.Seeds || 0}, Качают: ${item.Peers || 0}`,
                                    url: item.Url || '',
                                    torrent: item.Torrent || ''
                                });
                            }
                        });
                    }
                });

                console.log("Результаты парсинга:", results); // Логируем обработанные данные

                if (results.length > 0) {
                    oncomplite(results.slice(0, 50));
                } else {
                    console.warn("API вернуло пустой результат", json);
                    oncomplite([]);
                }
            } else {
                console.error("Ошибка: API вернуло неожиданные данные", json);
                oncomplite([]);
            }
        }, (error)=>{
            console.error("Ошибка сети или API недоступен", error);
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

    if (typeof Lampa.Api.availableDiscovery !== 'function') {
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
