(function () {
    var lastfmApiKey = "5e508b11704a1f7de4dd1ab7da50686d";
    var lastfmApiUrl = "https://ws.audioscrobbler.com/2.0/";
    var torrentApiUrl = "https://torapi.vercel.app/api/search/title/all"; // Новый API торрентов

    function fetchData(url) {  
        return fetch(url)  
            .then(response => response.json())  
            .catch(error => {  
                console.error("Ошибка API:", error);  
                return null;  
            });  
    }  

    function searchTorrents(query) {  
        var url = `https://torapi.vercel.app/api/search/title/all?query=${encodeURIComponent(query)}`;  
        return fetch(url)  
            .then(response => response.json())  
            .then(data => data?.RuTracker || [])  
            .catch(error => {  
                console.error("Ошибка API:", error);
                return [];  
            });  
    } 

    function getArtistImage(artistName) {  
        var url = `${lastfmApiUrl}?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${lastfmApiKey}&format=json`;  
        return fetchData(url).then(data => data?.artist?.image?.[2]?.["#text"] || "https://via.placeholder.com/100");  
    }  

    function createSearchPage() {  
        document.body.innerHTML = "";  

        var container = document.createElement("div");  
        container.style.padding = "10px";  
        container.style.fontFamily = "Arial, sans-serif";  

        var searchInput = document.createElement("input");  
        searchInput.type = "text";  
        searchInput.placeholder = "Введите название альбома или исполнителя";  
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
                img.src = "https://via.placeholder.com/100"; // Заглушка, если нет обложки

                var text = document.createElement("div");
                text.innerHTML = `
                    <strong>${item.Name || "Неизвестная раздача"}</strong><br>
                    📥 <strong>${item.Seeds || 0}</strong> сидеров | 🟢 <strong>${item.Peers || 0}</strong> личеров
                `;

                div.appendChild(img);
                div.appendChild(text);

                div.addEventListener("click", () => {
                    window.open(item.Url, "_blank"); // Открываем ссылку на торрент
                });

                resultsContainer.appendChild(div);

                // Подтягиваем обложку из Last.fm (если включено)
                getArtistImage(item.Name.split("-")[0].trim()).then(imageUrl => {
                    img.src = imageUrl;
                });
            });
        }

        searchButton.addEventListener("click", function () {  
            var query = searchInput.value.trim();  
            if (!query) return;  

            resultsContainer.innerHTML = "<p>Загрузка...</p>";  

            searchTorrents(query).then(torrents => {  
                if (torrents.length === 0) {  
                    resultsContainer.innerHTML = "<p>Торренты не найдены.</p>";  
                    return;  
                }  
                renderList(torrents);  
            });  
        });  

        container.appendChild(searchInput);  
        container.appendChild(searchButton);  
        container.appendChild(resultsContainer);  
        document.body.appendChild(container);  
    }  

    createSearchPage();
})();
