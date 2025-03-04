(function(){
    let network = new Lampa.Reguest()

    function search(params = {}, oncomplite){
        let url = 'https://torapi.vercel.app/api/search/title/all?query=' + encodeURIComponent(params.query)

        network.silent(url, (json)=>{
            let results = json.map(item => ({
                title: item.Name,
                poster: '', // В API нет изображений, можно оставить пустым
                description: `Размер: ${item.Size}, Раздают: ${item.Seeds}, Качают: ${item.Peers}`,
                url: item.Url, // Можно использовать для перехода на страницу раздачи
                torrent: item.Torrent // Прямая ссылка на торрент
            }))
            oncomplite(results)
        }, ()=>{
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
