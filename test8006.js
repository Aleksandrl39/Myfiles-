(function(){
    let network = new Lampa.Reguest();

    function search(params = {}, oncomplite){
        let url = 'https://torapi.vercel.app/api/search/title/all?query=' + encodeURIComponent(params.query);

        network.silent(url, (json)=>{
            if (json && json.RuTracker && Array.isArray(json.RuTracker)) {
                let results = json.RuTracker
                    .filter(item => item && typeof item.Name === 'string' && item.Name.trim()) // защита от пустых элементов
                    .map(item => ({
                        title: item.Name,
                        poster: '',
                        description: `Размер: ${item.Size || 'неизвестно'}, Раздают: ${item.Seeds || 0}, Качают: ${item.Peers || 0}`,
                        url: item.Url || '',
                        torrent: item.Torrent || ''
                    }));

                oncomplite(results.slice(0, 50)); // добавил ограничение по количеству, чтобы не вызвать ошибку
            } else {
                console.error("Ошибка: API вернуло неожиданные данные", json);
                oncomplite([]);
            }
        }, ()=>{
            console.error("Ошибка сети или API недоступен");
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
        if (!Array.isArray(list)) list = []; // защита от ошибки
        list.push(discovery());
        return list;
    };
})();
