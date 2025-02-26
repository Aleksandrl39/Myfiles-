(function () {
    var torrentApiUrl = "https://torapi.vercel.app/api/search/title/all";
    var torrentDetailsApiUrlTemplate = "https://torapi.vercel.app/api/search/id/{tracker}?query=";

    function fetchData(url) {
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                logMessage(`✅ Успех: ${url}`, data);
                return data;
            })
            .catch(error => {
                logMessage(`❌ Ошибка: ${url} - ${error}`);
                return null;
            });
    }

    function searchTorrents(query) {
        var url = `${torrentApiUrl}?query=${encodeURIComponent(query)}`;
        return fetchData(url).then(data => data || {});
    }

    function getTrackerById(id, tracker) {
        var url = torrentDetailsApiUrlTemplate.replace("{tracker}", tracker) + id;
        return fetchData(url).then(data => data || {});
    }

    function logMessage(message, data = null) {
        var logDiv = document.getElementById("debug-log");
        if (!logDiv) return;

        var p = document.createElement("p");
        p.style.margin = "2px 0";
        p.style.fontSize = "12px";
        p.style.color = "#bbb";
        p.textContent = message;

        logDiv.appendChild(p);
        if (data) {
            var pre = document.createElement("pre");
            pre.style.fontSize = "10px";
            pre.style.whiteSpace = "pre-wrap";
            pre.style.wordWrap = "break-word";
            pre.textContent = JSON.stringify(data, null, 2);
            logDiv.appendChild(pre);
        }

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
        logContainer.style.height = "150px";
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
            if (Object.keys(items).length === 0) {
                resultsContainer.innerHTML = "<p>Ничего не найдено.</p>";
                return;
            }

            Object.keys(items).forEach(tracker => {
                items[tracker].forEach(item => {
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
                        🏷 <strong>${tracker}</strong> | 📥 <strong>${item.Seeds || 0}</strong> сидеров | 🟢 <strong>${item.Peers || 0}</strong> личеров
                    `;

                    div.appendChild(img);
                    div.appendChild(text);

                    div.addEventListener("click", () => {
                        getTrackerById(item.Id, tracker).then(data => {
                            let magnetLink = data?.[tracker]?.[0]?.Magnet || "";
                            if (magnetLink) {
                                window.open(magnetLink, "_blank");
                            } else {
                                alert("Magnet-ссылка не найдена.");
                            }
                        });
                    });

                    resultsContainer.appendChild(div);

                    getTrackerById(item.Id, tracker).then(data => {
                        let poster = data?.[tracker]?.[0]?.Poster || "https://via.placeholder.com/200";
                        img.src = poster;
                    });
                });
            });
        }

        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                var query = searchInput.value.trim();
                if (!query) return;

                resultsContainer.innerHTML = "<p>Загрузка...</p>";
                logMessage(`🔎 Поиск: ${query}`);

                searchTorrents(query).then(torrents => {
                    renderList(torrents);
                });
            }
        });
    }

    createSearchPage();
})();
