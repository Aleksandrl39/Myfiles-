(function () {
    var iTunesApiUrl = "https://itunes.apple.com/search";
    var torrentApiUrl = "https://torapi.vercel.app/api/search/title/all";

    function fetchData(url) {
        return fetch(url)
            .then(response => response.json())
            .catch(error => {
                logMessage("❌ Ошибка API: " + error);
                return null;
            });
    }

    function searchTorrents(query) {
        var url = `${torrentApiUrl}?query=${encodeURIComponent(query)}`;
        return fetch(url)
            .then(response => response.json())
            .then(data => data?.RuTracker || [])
            .catch(error => {
                logMessage("❌ Ошибка при поиске торрентов: " + error);
                return [];
            });
    }

    function extractArtistAndAlbum(title) {
    // Удаляем текст в скобках [], (), {}
    title = title.replace(/.*?|.*?|\{.*?\}/g, "").trim();

    // Оставляем только "Исполнитель - Альбом", удаляя лишние символы
    let match = title.match(/^(.+?)\s*-\s*(.+?)\s*$/);
    if (match) {
        return { artist: match[1].trim(), album: match[2].trim() };
    }

    // Если не нашли " - ", считаем, что это только исполнитель
    return { artist: title.trim(), album: "" };
}

    function getAlbumCover(title) {
        let { artist, album } = extractArtistAndAlbum(title);
        let query = album ? `${artist} ${album}` : artist;

        logMessage("🔍 iTunes API запрос: " + query);
        var url = `${iTunesApiUrl}?term=${encodeURIComponent(query)}&entity=album&limit=1`;

        return fetchData(url).then(data => {
            if (data?.results?.length > 0) {
                return data.results[0].artworkUrl100.replace("100x100", "200x200");
            }
            logMessage("❌ Обложка не найдена для: " + query);
            return "https://via.placeholder.com/200";
        });
    }

    function logMessage(message) {
        var logDiv = document.getElementById("debug-log");
        if (!logDiv) return;
        var p = document.createElement("p");
        p.style.margin = "2px 0";
        p.style.fontSize = "12px";
        p.textContent = message;
        logDiv.appendChild(p);
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    function createSearchPage() {
        document.body.innerHTML = "";
        document.body.style.background = "#121212";
        document.body.style.color = "#fff";
        document.body.style.fontFamily = "Arial, sans-serif";
        document.body.style.padding = "10px";
        document.body.style.display = "flex";
        document.body.style.flexDirection = "column";
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";

        var title = document.createElement("h2");
        title.textContent = "Поиск";
        title.style.textAlign = "center";
        title.style.marginBottom = "10px";
        document.body.appendChild(title);

        var searchInput = document.createElement("input");
        searchInput.type = "search";
        searchInput.placeholder = "Введите текст...";
        searchInput.inputmode = "none";
        searchInput.style.width = "100%";
        searchInput.style.background = "#333";
        searchInput.style.border = "none";
        searchInput.style.outline = "none";
        searchInput.style.color = "#fff";
        searchInput.style.fontSize = "16px";
        searchInput.style.padding = "10px";
        searchInput.style.borderRadius = "10px";
        document.body.appendChild(searchInput);

        var resultsContainer = document.createElement("div");
        resultsContainer.style.flexGrow = "1";
        resultsContainer.style.overflowY = "auto";
        resultsContainer.style.marginTop = "10px";
        resultsContainer.style.paddingRight = "10px";
        document.body.appendChild(resultsContainer);

        var logContainer = document.createElement("div");
        logContainer.id = "debug-log";
        logContainer.style.height = "100px";
        logContainer.style.overflowY = "auto";
        logContainer.style.background = "#222";
        logContainer.style.color = "#bbb";
        logContainer.style.fontSize = "12px";
        logContainer.style.padding = "5px";
        logContainer.style.marginTop = "10px";
        logContainer.style.borderRadius = "5px";
        document.body.appendChild(logContainer);

        function renderList(items) {
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
                img.style.width = "50px";
                img.style.height = "50px";
                img.style.marginRight = "10px";
                img.style.borderRadius = "5px";
                img.src = "https://via.placeholder.com/100";

                var text = document.createElement("div");
                text.innerHTML = `
                    <strong>${item.Name || "Неизвестная раздача"}</strong><br>
                    📥 <strong>${item.Seeds || 0}</strong> сидеров | 🟢 <strong>${item.Peers || 0}</strong> личеров
                `;

                div.appendChild(img);
                div.appendChild(text);

                div.addEventListener("click", () => {
                    window.open(item.Torrent, "_blank");
                });

                resultsContainer.appendChild(div);

                getAlbumCover(item.Name).then(imageUrl => {
                    img.src = imageUrl;
                });
            });
        }

        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                var query = searchInput.value.trim();
                if (!query) return;

                logMessage("🔎 Поиск: " + query);
                resultsContainer.innerHTML = "<p>Загрузка...</p>";

                searchTorrents(query).then(torrents => {
                    renderList(torrents);
                });
            }
        });
    }

    createSearchPage();
})();
