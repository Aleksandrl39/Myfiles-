(function () {
    var torrentApiUrl = "https://torapi.vercel.app/api/search/title/all";
    var torrentDetailsApiUrl = "https://torapi.vercel.app/api/search/id/rutracker?query=";

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.log("❌ Ошибка API: " + error);
            return null;
        }
    }

    async function searchTorrents(query) {
        var url = `${torrentApiUrl}?query=${encodeURIComponent(query)}`;
        const data = await fetchData(url);
        return data?.RuTracker || [];
    }

    async function getPosterById(id) {
        var url = `${torrentDetailsApiUrl}${id}`;
        const data = await fetchData(url);
        return data?.[0]?.Poster || "https://via.placeholder.com/200";
    }

    async function getMagnetById(id) {
        var url = `${torrentDetailsApiUrl}${id}`;
        const data = await fetchData(url);
        return data?.[0]?.Magnet || "";
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
        resultsContainer.style.minHeight = "0"; // Важно для корректного скролла
        resultsContainer.style.paddingBottom = "20px"; // Чтобы последняя запись не прилипала к краю        
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

                div.addEventListener("click", async () => {
                    const magnetLink = await getMagnetById(item.Id);
                    if (magnetLink) {
                        window.open(magnetLink, "_blank");
                    } else {
                        alert("Magnet-ссылка не найдена.");
                    }
                });

                resultsContainer.appendChild(div);

                // Подгружаем обложку
                getPosterById(item.Id).then(imageUrl => {
                    img.src = imageUrl;
                });
            });
        }

        searchInput.addEventListener("keypress", async function (event) {
            if (event.key === "Enter") {
                var query = searchInput.value.trim();
                if (!query) return;

                resultsContainer.innerHTML = "<p>Загрузка...</p>";

                const torrents = await searchTorrents(query);
                renderList(torrents);
            }
        });
    }

    createSearchPage();
})();

