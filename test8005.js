(function(){
    let network = new Lampa.Reguest();

    function search(params = {}, oncomplite){
        let url = 'https://torapi.vercel.app/api/search/title/all?query=' + encodeURIComponent(params.query);

        network.silent(url, (json)=>{
            if (json && json.RuTracker && Array.isArray(json.RuTracker)) {
                let results = json.RuTracker
                    .filter(item => item.Name && item.Size && item.Seeds && item.Peers) // фильтруем пустые значения
                    .map(item => ({
                        title: item.Name,
                        poster: '',
                        description: `Размер: ${item.Size}, Раздают: ${item.Seeds}, Качают: ${item.Peers}`,
                        url: item.Url,
                        torrent: item.Torrent
                    }));
                oncomplite(results);
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
