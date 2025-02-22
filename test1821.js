(function () {
    var lastfmApiKey = "5e508b11704a1f7de4dd1ab7da50686d";
    var lastfmApiUrl = "https://ws.audioscrobbler.com/2.0/";

    function fetchData(url) {
        return fetch(url)
            .then(response => response.json())
            .catch(error => {
                console.error("Ошибка API:", error);
                return null;
            });
    }

    function searchArtists(query) {
        return fetchData(`${lastfmApiUrl}?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${lastfmApiKey}&format=json`)
            .then(data => data?.results?.artistmatches?.artist || []);
    }

    function getAlbums(artist) {
        return fetchData(`https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=album&limit=10`)
            .then(data => data?.results || []);
    }

    function searchTorrents(query) {
        return new Promise((resolve, reject) => {
            // Динамически загружаем torrent-search-api
            var script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/torrent-search-api@1.0.1/index.min.js"; // Загружаем API
            script.onload = function () {
                var TorrentSearchApi = window.TorrentSearchApi;
                TorrentSearchApi.enableProvider('1337x'); // Включаем 1337x
                TorrentSearchApi.search(query, 'Music', 5)
                    .then(resolve)
                    .catch(reject);
            };
            script.onerror = function () {
                reject(new Error("Ошибка загрузки torrent-search-api"));
            };
            document.head.appendChild(script);
        });
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

        function renderList(items, onClick, isAlbum = false) {
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
                img.src = isAlbum ? item.artworkUrl100 : item.image?.[2]?.["#text"] || "https://via.placeholder.com/50";
                img.style.width = "50px";
                img.style.height = "50px";
                img.style.marginRight = "10px";
                img.style.borderRadius = "5px";

                var text = document.createElement("div");
                text.innerHTML = `<strong>${item.collectionName || item.name}</strong>`;

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
                seeds.innerHTML = `Сидов: ${torrent.seeds}`;

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

        searchButton.addEventListener("click", function () {
            var query = searchInput.value.trim();
            if (!query) return;

            resultsContainer.innerHTML = "<p>Загрузка...</p>";
            searchArtists(query).then(artists => {
                renderList(artists, artist => {
                    resultsContainer.innerHTML = "<p>Загрузка альбомов...</p>";
                    getAlbums(artist.name).then(albums => {
                        renderList(albums, album => {
                            var searchQuery = `${artist.name} ${album.collectionName}`;
                            resultsContainer.innerHTML = "<p>Поиск торрентов...</p>";
                            searchTorrents(searchQuery).then(torrents => {
                                renderTorrents(torrents);
                            });
                        }, true);
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
