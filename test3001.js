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

    async function searchTorrents(query) {
        var url = `${torrentApiUrl}?query=${encodeURIComponent(query)}`;
        const data = await fetchData(url);
        
        return (data?.RuTracker || []).map(item => ({
            ...item,
            Poster: item.Poster || "https://via.placeholder.com/200",
            Magnet: item.Magnet || ""
        }));
    }

    function createSearchPage() {
        document.body.innerHTML = "";
        
        // Добавляем стили в <style>
        const style = document.createElement("style");
        style.textContent = `
            body { background: #121212; color: #fff; font-family: Arial, sans-serif; padding: 10px; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
            h2 { text-align: center; margin-bottom: 10px; }
            input { width: 100%; background: #333; border: none; outline: none; color: #fff; font-size: 16px; padding: 10px; border-radius: 10px; }
            .result { display: flex; align-items: center; padding: 10px; margin-bottom: 5px; background-color: #333; color: #fff; border-radius: 5px; cursor: pointer; }
            .result img { width: 50px; height: 50px; margin-right: 10px; border-radius: 5px; }
        `;
        document.head.appendChild(style);

        var title = document.createElement("h2");
        title.textContent = "Поиск";
        document.body.appendChild(title);

        var searchInput = document.createElement("input");
        searchInput.type = "search";
        searchInput.placeholder = "Введите текст...";
        searchInput.inputmode = "none";
        document.body.appendChild(searchInput);

        var resultsContainer = document.createElement("div");
        resultsContainer.style.flexGrow = "1";
        resultsContainer.style.overflowY = "auto";
        resultsContainer.style.marginTop = "10px";
        resultsContainer.style.paddingRight = "10px";
        document.body.appendChild(resultsContainer);

        function renderList(items) {
            resultsContainer.innerHTML = items.length === 0 ? "<p>Ничего не найдено.</p>" : "";

            const fragment = document.createDocumentFragment();

            items.forEach(item => {
                var div = document.createElement("div");
                div.classList.add("result");

                var img = document.createElement("img");
                img.classList.add("result-img");
                img.src = item.Poster;

                var text = document.createElement("div");
                text.innerHTML = `
                    <strong>${item.Name || "Неизвестная раздача"}</strong><br>
                    📥 <strong>${item.Seeds || 0}</strong> сидеров | 🟢 <strong>${item.Peers || 0}</strong> личеров
                `;

                div.appendChild(img);
                div.appendChild(text);

                div.addEventListener("click", () => {
                    if (item.Magnet) {
                        window.open(item.Magnet, "_blank");
                    } else {
                        alert("Magnet-ссылка не найдена.");
                    }
                });

                fragment.appendChild(div);
            });

            resultsContainer.appendChild(fragment);
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
