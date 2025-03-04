(function(){
    let network = new Lampa.Reguest();

    function search(params = {}, oncomplite){
        let url = 'https://torapi.vercel.app/api/search/title/all?query=' + encodeURIComponent(params.query);

        network.silent(url, (json)=>{
            if (json && typeof json === 'object') {
                let categories = ['RuTracker', 'Kinozal', 'RuTor', 'NoNameClub'];
                let results = [];

                categories.forEach(category => {
                    if (Array.isArray(json[category])) {
                        json[category].forEach(item => {
                            results.push({
                                title: item.Name,
                                poster: '', 
                                description: `Размер: ${item.Size || 'неизвестно'}, Раздают: ${item.Seeds || 0}, Качают: ${item.Peers || 0}`,
                                url: item.Url || '',
                                torrent: item.Torrent || ''
                            });
                        });
                    }
                });

                if (results.length > 0) {
                    oncomplite(results.slice(0, 50)); 
                } else {
                    console.error("Ошибка: API вернул пустой результат", json);
                    oncomplite([]);
                }
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
        if (!Array.isArray(list)) list = []; 
        list.push(discovery());
        return list;
    };
})();
