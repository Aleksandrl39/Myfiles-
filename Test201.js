(function() {
    var lastFmApiKey = "5e508b11704a1f7de4dd1ab7da50686d";

    function searchLastFm(query, callback) {
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
                            release_date: "0000",
                            poster: track.image && track.image.length > 2 ? track.image[2]['#text'] : '',
                            url: `https://www.last.fm/music/${encodeURIComponent(track.artist)}/_/${encodeURIComponent(track.name)}`,
                            name: track.name,
                            type: "music",
                            source: "lastfm",
                            id: encodeURIComponent(track.artist + "_" + track.name)
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

    Lampa.Module.add({
        name: "LastFM",
        onSearch: function(query, callback) {
            searchLastFm(query, function(results) {
                callback(results);
            });
        }
    });

    console.log("LastFM плагин загружен!");
})();
