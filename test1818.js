(function(){
    var iTunesApiUrl = "https://itunes.apple.com/search";
    var lastfmApiKey = "5e508b11704a1f7de4dd1ab7da50686d";
    var lastfmApiUrl = "https://ws.audioscrobbler.com/2.0/";

    const TorrentSearchApi = require('torrent-search-api');
    TorrentSearchApi.enableProvider('1337x'); // Включаем 1337x

    function fetchData(url) {
        return fetch(url).then(response => response.json()).catch(error => {
            console.error("Ошибка API:", error);
            return null;
        });
    }

    function searchArtists(query) {
        var url = `${iTunesApiUrl}?term=${encodeURIComponent(query)}&entity=musicArtist&limit=20&media=music`;
        return fetchData(url).then(data => data?.results || []);
    }

    function getAlbums(artistName) {
        var url = `${iTunesApiUrl}?term=${encodeURIComponent(artistName)}&entity=album&limit=20&media=music`;
        return fetchData(url).then(data => data?.results || []);
    }

    function getArtistImage(artistName) {
        var url = `${lastfmApiUrl}?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${lastfmApiKey}&format=json`;
        return fetchData(url).then(data => data?.artist?.image?.[2]?.["#text"] || "https://via.placeholder.com/100");
    }

    async function searchTorrents(query) {
        try {
            const results = await TorrentSearchApi.search(query, 'Music', 5);
            return results;
        } catch (error) {
            console.error("Ошибка поиска торрентов:", error);
            return [];
        }
    }

    function createSearchPage() {
        document.body.innerHTML = "";

        var container = document.createElement("div");
        container.style.padding = "10px";
        container.style.fontFamily = "Arial, sans-serif";

        var searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = "Введите имя исполнителя";
        searchInput.style.width = "100%";
        searchInput.style.padding = "10px";
        searchInput.style.fontSize = "16px";
        searchInput.style.borderRadius = "5px";
        searchInput.style.border = "1px solid #ccc";

        var searchButton = document.createElement("button");
        searchButton.textContent = "Поиск";
        searchButton.style.width = "100%";
        searchButton.style.marginTop = "10px";
        searchButton.style.padding = "10px";
        searchButton.style.backgroundColor = "#28a745";
        searchButton.style.color = "#fff";
        searchButton.style.border = "none";
        searchButton.style.borderRadius = "5px";
        searchButton.style.cursor = "pointer";

        var resultsContainer = document.createElement("div");
        resultsContainer.style.marginTop = "20px";
        resultsContainer.style.maxHeight = "500px";
        resultsContainer.style.overflowY = "auto";

        function renderList(items, type, onClick) {
            resultsContainer.innerHTML = "";
            if (items.length === 0) {
                resultsContainer.innerHTML = "<p>Ничего не найдено.</p>";
                return;
            }
            items.forEach(item => {
                var div = document.createElement("div");
                div.style.display = "flex";
                div.style.alignItems = "center";
                div.style.padding = "10px";
                div.style.marginBottom = "5px";
                div.style.backgroundColor = "#333";
                div.style.color = "#fff";
                div.style.borderRadius = "5px";
                div.style.cursor = "pointer";

                var img = document.createElement("img");

                if (type === "artist") {
                    getArtistImage(item.artistName).then(imageUrl => {
                        img.src = imageUrl;
                    });
                } else {
                    img.src = item.artworkUrl100 || "https://via.placeholder.com/100";
                }

                img.style.width = "50px";
                img.style.height = "50px";
                img.style.marginRight = "10px";
                img.style.borderRadius = "5px";

                var text = document.createElement("div");
                text.innerHTML = `<strong>${type === "artist" ? item.artistName : item.collectionName}</strong>`;

                div.appendChild(img);
                div.appendChild(text);
                div.addEventListener("click", () => onClick(item));
                resultsContainer.appendChild(div);
            });
        }

        function renderTorrents(torrents) {
            resultsContainer.innerHTML = "";
            if (torrents.length === 0) {
                resultsContainer.innerHTML = "<p>Раздачи не найдены.</p>";
                return;
            }

            torrents.forEach(torrent => {
                var div = document.createElement("div");
                div.style.padding = "10px";
                div.style.marginBottom = "5px";
                div.style.backgroundColor = "#222";
                div.style.color = "#fff";
                div.style.borderRadius = "5px";

                var title = document.createElement("p");
                title.innerHTML = `<strong>${torrent.title}</strong>`;

                var seeds = document.createElement("p");
                seeds.innerHTML = `Сидов: ${torrent.seeds} / Пиров: ${torrent.peers}`;

                var link = document.createElement("a");
                link.href = torrent.desc;
                link.textContent = "Открыть на 1337x";
                link.style.color = "#0f9d58";
                link.target = "_blank";

                div.appendChild(title);
                div.appendChild(seeds);
                div.appendChild(link);

                resultsContainer.appendChild(div);
            });
        }

        searchButton.addEventListener("click", function() {
            var query = searchInput.value.trim();
            if (!query) return;

            resultsContainer.innerHTML = "<p>Загрузка...</p>";
            searchArtists(query).then(artists => {
                renderList(artists, "artist", artist => {
                    resultsContainer.innerHTML = "<p>Загрузка альбомов...</p>";
                    getAlbums(artist.artistName).then(albums => {
                        renderList(albums, "album", async album => {
                            var searchQuery = `${artist.artistName} ${album.collectionName}`;
                            resultsContainer.innerHTML = "<p>Поиск торрентов...</p>";
                            const torrents = await searchTorrents(searchQuery);
                            renderTorrents(torrents);
                        });
                    });
                });
            });
        });

        container.appendChild(searchInput);
        container.appendChild(searchButton);
        container.appendChild(resultsContainer);
        document.body.appendChild(container);
    }

    createSearchPage();
})();
