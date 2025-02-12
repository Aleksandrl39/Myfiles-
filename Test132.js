(function() {
    var lastFmApiKey = "5e508b11704a1f7de4dd1ab7da50686d";

    function searchMusic(query, callback) {
        var url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${lastFmApiKey}&format=json`;

        $.ajax({
            url: url,
            method: 'GET',
            success: function(response) {
                var results = [];

                if (response.results && response.results.trackmatches && response.results.trackmatches.track.length > 0) {
                    response.results.trackmatches.track.forEach(function(track) {
                        results.push({
                            title: track.name + " - " + track.artist,
                            poster: track.image[2]['#text'] || 'https://via.placeholder.com/200',
                            url: `https://www.last.fm/music/${encodeURIComponent(track.artist)}/_/${encodeURIComponent(track.name)}`,
                            name: track.name,
                            original_title: track.artist,
                            release_date: "Музыка",
                            movie: true
                        });
                    });
                }

                callback(results);
            },
            error: function() {
                callback([]);
            }
        });
    }

    function addLastFmTab() {
        Lampa.Search.addSource({
            title: 'Музыка',
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
