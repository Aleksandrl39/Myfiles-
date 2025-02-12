(function() {
    var lastFmApiKey = "5e508b11704a1f7de4dd1ab7da50686d";

    function searchMusic(query, callback) {
        var url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${lastFmApiKey}&format=json`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                var results = [];

                if (data.results && data.results.trackmatches && data.results.trackmatches.track.length > 0) {
                    data.results.trackmatches.track.forEach(track => {
                        results.push({
                            title: track.name,
                            original_title: track.artist,
                            poster: track.image[2]['#text'] || 'https://via.placeholder.com/200',
                            url: `https://www.last.fm/music/${encodeURIComponent(track.artist)}/_/${encodeURIComponent(track.name)}`,
                            year: "Музыка",
                            type: "music",
                            data: {
                                title: track.name,
                                artist: track.artist
                            }
                        });
                    });
                }

                callback(results);
            })
            .catch(error => {
                console.error("Ошибка запроса к Last.fm:", error);
                callback([]);
            });
    }

    function addLastFmTab() {
        Lampa.Search.addSource({
            title: 'Музыка',
            type: 'lastfm',
            search: function(query, callback) {
                searchMusic(query, function(results) {
                    callback({ results: results });
                });
            },
            empty: function(callback) {
                callback({ results: [] });
            }
        });
    }

    Lampa.Listener.follow('app', function(event) {
        if (event.type === 'ready') {
            addLastFmTab();
        }
    });

})();
