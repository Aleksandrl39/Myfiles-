(function(){
    let network = new Lampa.Reguest();

    function search(params = {}, oncomplite){
        let url = 'https://torapi.vercel.app/api/search/title/all?query=' + encodeURIComponent(params.query);

        network.silent(url, (json)=>{
            console.log("Ответ от API:", json);
            if (json && typeof json === 'object') {
                // Если API возвращает сообщение об отсутствии совпадений, сразу возвращаем пустой массив.
                if (json.Result && typeof json.Result === 'string' && json.Result.includes("No matches were found")) {
                    console.warn("API не нашёл совпадений для:", params.query);
                    oncomplite([]);
                    return;
                }
                
                let categories = ['RuTracker', 'Kinozal', 'RuTor', 'NoNameClub'];
                let results = [];

                // Здесь мы ожидаем, что по каждому ключу API возвращает массив объектов
                categories.forEach(category => {
                    if (json.hasOwnProperty(category) && Array.isArray(json[category])) {
                        json[category].forEach(item => {
                            // Если есть хотя бы одна ссылка, добавляем объект
                            if (item.Url || item.Torrent) {
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

                console.log("Обработанные результаты:", results);
                // Всегда вызываем oncomplite с массивом. Если результатов нет – передаем пустой массив.
                oncomplite(Array.isArray(results) ? results.slice(0, 50) : []);
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

    // Обеспечиваем наличие Lampa.Api.sources
    if (!Lampa.Api.sources) {
        Lampa.Api.sources = {};
    }

    Lampa.Api.sources.torapi = {
        search: search,
        discovery: discovery
    };

    // Если Lampa.Api.availableDiscovery не определён, создаём его как функцию, возвращающую массив.
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
