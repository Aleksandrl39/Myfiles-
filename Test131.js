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
                            title: track.name,
                            artist: track.artist,
                            poster: track.image[2]['#text'] || 'https://via.placeholder.com/200', 
                            link: `https://www.last.fm/music/${encodeURIComponent(track.artist)}/_/${encodeURIComponent(track.name)}`,
                            type: 'music'
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

    Lampa.Listener.follow('search', function(event) {
        if (event.type === 'start') {
            var query = event.data.query;
            if (query.trim() !== '') {
                searchMusic(query, function(results) {
                    if (results.length > 0) {
                        Lampa.Search.setResults(results, 'lastfm');
                    } else {
                        Lampa.Search.setEmpty();
                    }
                });

                event.data.cancel = true; // Отменяем стандартный поиск TMDb
            }
        }
    });

})();
