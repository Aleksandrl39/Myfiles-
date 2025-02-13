(function() {
    var lastfmApiKey = "5e508b11704a1f7de4dd1ab7da50686d";
    var lastfmApiUrl = "https://ws.audioscrobbler.com/2.0/";

    function fetchData(method, params) {
        var url = `${lastfmApiUrl}?method=${method}&api_key=${lastfmApiKey}&format=json&${params}`;
        return fetch(url).then(response => response.json()).catch(error => {
            console.error("Ошибка API:", error);
            return null;
        });
    }

    function searchArtists(query) {
        return fetchData("artist.search", `artist=${encodeURIComponent(query)}`)
            .then(data => data?.results?.artistmatches?.artist || []);
    }

    function getAlbums(artist) {
        return fetchData("artist.gettopalbums", `artist=${encodeURIComponent(artist)}`)
            .then(data => data?.topalbums?.album || []);
    }

    function getTracks(artist, album) {
        return fetchData("album.getinfo", `artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`)
            .then(data => data?.album?.tracks?.track || []);
    }

    function createSearchPage() {
        var overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
        overlay.style.zIndex = "1000";
        overlay.style.overflowY = "auto";
        overlay.style.padding = "20px";

        var closeButton = document.createElement("button");
        closeButton.textContent = "Закрыть";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "20px";
        closeButton.style.padding = "10px";
        closeButton.style.backgroundColor = "#ff4d4d";
        closeButton.style.color = "#fff";
        closeButton.style.border = "none";
        closeButton.style.cursor = "pointer";
        closeButton.addEventListener("click", function() {
            document.body.removeChild(overlay);
        });

        var container = document.createElement("div");
        container.style.maxWidth = "500px";
        container.style.margin = "auto";
        container.style.background = "#222";
        container.style.padding = "20px";
        container.style.borderRadius = "10px";
        container.style.color = "#fff";
        container.style.textAlign = "center";

        var searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = "Введите исполнителя";
        searchInput.style.width = "100%";
        searchInput.style.padding = "10px";
        searchInput.style.borderRadius = "5px";
        searchInput.style.border = "1px solid #ccc";
        searchInput.style.marginBottom = "10px";

        var searchButton = document.createElement("button");
        searchButton.textContent = "Поиск";
        searchButton.style.width = "100%";
        searchButton.style.padding = "10px";
        searchButton.style.backgroundColor = "#28a745";
        searchButton.style.color = "#fff";
        searchButton.style.border = "none";
        searchButton.style.cursor = "pointer";

        var resultsContainer = document.createElement("div");
        resultsContainer.style.marginTop = "20px";
        resultsContainer.style.maxHeight = "400px";
        resultsContainer.style.overflowY = "auto";

        function renderList(items, onClick) {
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
                div.style.backgroundColor = "#444";
                div.style.borderRadius = "5px";
                div.style.cursor = "pointer";

                var img = document.createElement("img");
                img.src = item.image?.[2]?.["#text"] || "https://via.placeholder.com/50";
                img.style.width = "50px";
                img.style.height = "50px";
                img.style.marginRight = "10px";
                img.style.borderRadius = "5px";

                var text = document.createElement("div");
                text.innerHTML = `<strong>${item.name}</strong>${item.artist ? `<br>${item.artist}` : ""}`;

                div.appendChild(img);
                div.appendChild(text);
                div.addEventListener("click", () => onClick(item));
                resultsContainer.appendChild(div);
            });
        }

        searchButton.addEventListener("click", function() {
            var query = searchInput.value.trim();
            if (!query) return;

            resultsContainer.innerHTML = "<p>Загрузка...</p>";
            searchArtists(query).then(artists => {
                renderList(artists, artist => {
                    resultsContainer.innerHTML = "<p>Загрузка альбомов...</p>";
                    getAlbums(artist.name).then(albums => {
                        renderList(albums, album => {
                            resultsContainer.innerHTML = "<p>Загрузка треков...</p>";
                            getTracks(artist.name, album.name).then(tracks => {
                                renderList(tracks, () => {});
                            });
                        });
                    });
                });
            });
        });

        container.appendChild(searchInput);
        container.appendChild(searchButton);
        container.appendChild(resultsContainer);
        overlay.appendChild(closeButton);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
    }

    function addMusicButton() {
        var checkExist = setInterval(function() {
            var menu = document.querySelector("nav"); // Убедись, что селектор правильный
            if (menu) {
                clearInterval(checkExist);

                var existingButton = document.querySelector("#musicButton");
                if (!existingButton) {
                    var musicButton = document.createElement("button");
                    musicButton.textContent = "Музыка";
                    musicButton.id = "musicButton";
                    musicButton.style.padding = "10px";
                    musicButton.style.margin = "5px";
                    musicButton.style.backgroundColor = "#007bff";
                    musicButton.style.color = "#fff";
                    musicButton.style.border = "none";
                    musicButton.style.borderRadius = "5px";
                    musicButton.style.cursor = "pointer";

                    musicButton.addEventListener("click", createSearchPage);
                    menu.appendChild(musicButton);
                }
            }
        }, 500);
    }

    addMusicButton();
})();
