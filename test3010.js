(function () {
    var torrentApiUrl = "https://torapi.vercel.app/api/search/title/all";
    var torrentDetailsApiBase = "https://torapi.vercel.app/api/search/id/";

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
        return fetchData(url).then(data => {
            logMessage("🔍 Ответ API (поиск):", data);
            return data || {};
        });
    }

    function getDetailsById(tracker, id) {
        var url = `${torrentDetailsApiBase}${tracker}?query=${id}`;
        return fetchData(url).then(data => {
            logMessage(`🔍 Ответ API (детали для ${tracker}, ID ${id}):`, data);
            return data?.[tracker]?.[0] || {};
        });
    }

    function logMessage(label, data) {
        var logDiv = document.getElementById("debug-log");
        if (!logDiv) return;
        var p = document.createElement("p");
        p.style.margin = "5px 0";
        p.style.fontSize = "12px";
        p.style.color = "#ccc";
        p.textContent = label + " " + JSON.stringify(data, null, 2);
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

        var title = document.createElement("h2");
        title.textContent = "Поиск";
        title.style.textAlign = "center";
        title.style.marginBottom = "10px";
        document.body.appendChild(title);

        var searchInput = document.createElement("input");
        searchInput.type = "search";
        searchInput.placeholder = "Введите текст...";
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
        document.body.appendChild(resultsContainer);

        var logContainer = document.createElement("div");
        logContainer.id = "debug-log";
        logContainer.style.height = "150px";
        logContainer.style.overflowY = "auto";
        logContainer.style.background = "#222";
        logContainer.style.color = "#bbb";
        logContainer.style.fontSize = "12px";
        logContainer.style.padding = "10px";
        logContainer.style.marginTop = "10px";
        logContainer.style.borderRadius = "5px";
        document.body.appendChild(logContainer);

        function renderList(results) {
            resultsContainer.innerHTML = "";
            if (Object.keys(results).length === 0) {
                resultsContainer.innerHTML = "<p>Ничего не найдено.</p>";
                return;
            }

            Object.entries(results).forEach(([tracker, torrents]) => {
                torrents.forEach(torrent => {
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
                        <strong>${torrent.Name || "Неизвестная раздача"}</strong><br>
                        📥 <strong>${torrent.Seeds || 0}</strong> сидеров | 🟢 <strong>${torrent.Peers || 0}</strong> личеров
                    `;

                    div.appendChild(img);
                    div.appendChild(text);

                    div.addEventListener("click", () => {
                        getDetailsById(tracker, torrent.Id).then(details => {
                            if (details.Magnet) {
                                window.open(details.Magnet, "_blank");
                            } else {
                                alert("Magnet-ссылка не найдена.");
                            }
                        });
                    });

                    resultsContainer.appendChild(div);

                    getDetailsById(tracker, torrent.Id).then(details => {
                        if (details.Poster) img.src = details.Poster;
                    });
                });
            });
        }

        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                var query = searchInput.value.trim();
                if (!query) return;

                logMessage("🔎 Поиск:", query);
                resultsContainer.innerHTML = "<p>Загрузка...</p>";

                searchTorrents(query).then(renderList);
            }
        });
    }

    createSearchPage();
})();
