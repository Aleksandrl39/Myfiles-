(function () {
    var torrentApiUrl = "https://torapi.vercel.app/api/search/title/all";

    function fetchData(url) {
        return fetch(url)
            .then(response => response.json())
            .catch(error => {
                console.log("❌ Ошибка API: " + error);
                return null;
            });
    }

    function searchTorrents(query) {
        var url = `${torrentApiUrl}?query=${encodeURIComponent(query)}`;
        return fetchData(url).then(data => data?.RuTracker || []);
    }

    function getPosterById(id, tracker) {
        var url = `https://torapi.vercel.app/api/search/id/${tracker.toLowerCase()}?query=${id}`;
        return fetchData(url).then(data => data?.[tracker]?.[0]?.Poster || "https://via.placeholder.com/200");
    }

    function getMagnetById(id, tracker) {
        var url = `https://torapi.vercel.app/api/search/id/${tracker.toLowerCase()}?query=${id}`;
        return fetchData(url).then(data => data?.[tracker]?.[0]?.Magnet || "");
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
                    getMagnetById(item.Id, item.Tracker).then(magnetLink => {
                        if (magnetLink) {
                            window.open(magnetLink, "_blank");
                        } else {
                            alert("Magnet-ссылка не найдена.");
                        }
                    });
                });

                resultsContainer.appendChild(div);

                // Подгружаем обложку
                getPosterById(item.Id, item.Tracker).then(imageUrl => {
                    img.src = imageUrl;
                });
            });
        }

        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                var query = searchInput.value.trim();
                if (!query) return;

                resultsContainer.innerHTML = "<p>Загрузка...</p>";

                searchTorrents(query).then(torrents => {
                    renderList(torrents);
                });
            }
        });
    }

    createSearchPage();
})();
