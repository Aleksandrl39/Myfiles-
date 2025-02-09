function startPlugin() {
    window.plugin_muzik = {
        type: 'music',
        name: 'Музыка',
        icon: 'music_note',
        search: function (query, page, call) {
            let url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=20`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    let results = [];
                    if (data.results) {
                        data.results.forEach(track => {
                            results.push({
                                title: track.trackName,
                                artist: track.artistName,
                                album: track.collectionName,
                                cover: track.artworkUrl100,
                                url: track.previewUrl,
                                quality: 'AAC 256kbps'
                            });
                        });
                    }
                    call(results);
                })
                .catch(error => {
                    console.error('Ошибка загрузки данных с Apple Music API:', error);
                    call([]);
                });
        }
    };

    Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') {
            Lampa.Collections.add({
                title: 'Музыка',
                component: 'online',
                type: 'music',
                plugin: 'muzik'
            });
        }
    });

    console.log('Плагин "Музыка" успешно загружен!');
}

startPlugin();
