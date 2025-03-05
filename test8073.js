(function(){
    let network = new Lampa.Reguest();

    function search(params = {}, oncomplite){
        let url = 'https://torapi.vercel.app/api/search/title/all?query=' + encodeURIComponent(params.query);
        
        network.silent(url, (json)=>{
            console.log("API response:", json);
            if (json && typeof json === "object") {
                if (json.Result && typeof json.Result === "string" && json.Result.includes("No matches were found")) {
                    console.warn("Нет совпадений для:", params.query);
                    oncomplite([]);
                    return;
                }
                
                let categories = ['RuTracker', 'Kinozal', 'RuTor', 'NoNameClub'];
                let results = [];
                let placeholder = './img/img_broken.svg'; // Заглушка Lampa
                
                categories.forEach(category => {
                    if (json.hasOwnProperty(category) && Array.isArray(json[category])) {
                        json[category].forEach(item => {
                            let year = "";
                            if (item.Date) {
                                let parts = item.Date.split('.');
                                if (parts.length === 3) {
                                    year = parts[2];
                                }
                            }

                            // Проверяем, есть ли реальный постер, иначе подставляем заглушку
                            let poster = item.Poster && item.Poster.trim() ? item.Poster : placeholder;

                            let resultItem = {
                                id: item.Id,
                                title: item.Name || 'Без названия',
                                original_title: item.Name || 'Без названия',
                                release_date: year ? `${year}-01-01` : '',
                                release_year: year,
                                poster_path: poster,
                                backdrop_path: poster,
                                poster: poster,
                                img: poster, // Дополнительное изображение
                                description: `Размер: ${item.Size || 'неизвестно'}. Сиды: ${item.Seeds || 0}, Пиры: ${item.Peers || 0}`,
                                overview: `Категория: ${item.Category || 'Неизвестно'}. Скачиваний: ${item.Download_Count || 0}`,
                                info: `Категория: ${item.Category || 'Неизвестно'} | Скачиваний: ${item.Download_Count || 0}`,
                                url: item.Url || '',
                                torrent: item.Torrent || '',
                                results: []
                            };

                            // Удаляем `noimage`, если он есть
                            if ("noimage" in resultItem) {
                                delete resultItem.noimage;
                            }

                            console.log("Processed result:", resultItem);
                            results.push(resultItem);
                        });
                    }
                });
                
                console.log("Final parsed results:", results);
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
                card_view: 5,
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
