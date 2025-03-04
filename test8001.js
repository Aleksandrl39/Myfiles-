(function(){
    let network = new Lampa.Reguest()

    function search(params = {}, oncomplite){
        let url = 'https://torapi.vercel.app/api/search/title/all?query=' + encodeURIComponent(params.query)

        network.silent(url, (json)=>{
            if (Array.isArray(json)) {
                let results = json.map(item => ({
                    title: item.Name,
                    poster: '',
                    description: `Размер: ${item.Size}, Раздают: ${item.Seeds}, Качают: ${item.Peers}`,
                    url: item.Url,
                    torrent: item.Torrent
                }))
                oncomplite(results)
            } else {
                console.error("Ошибка: API вернуло неожиданные данные", json)
                oncomplite([])
            }
        }, ()=>{
            console.error("Ошибка сети или API недоступен")
            oncomplite([])
        })
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
        }
    }

    Lampa.Api.sources.torapi = {
        search: search,
        discovery: discovery
    }

    if (!Lampa.Api.availableDiscovery) {
        let orig = Lampa.Api.availableDiscovery || function() { return [] }

        Lampa.Api.availableDiscovery = function() {
            let list = orig()
            list.push(discovery())
            return list
        }
    }
})();
