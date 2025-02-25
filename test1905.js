(function () {
    var lastfmApiKey = "5e508b11704a1f7de4dd1ab7da50686d";
    var lastfmApiUrl = "https://ws.audioscrobbler.com/2.0/";
    var torrentApiUrl = "https://torapi.vercel.app/api/search/title/all";  

    function fetchData(url) {  
        return fetch(url)  
            .then(response => response.json())  
            .catch(error => {  
                console.error("Ошибка API:", error);  
                return null;  
            });  
    }  

    function searchTorrents(query) {  
        var url = `${torrentApiUrl}?query=${encodeURIComponent(query)}`;  
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
        document.body.style.background = "#121212"; // Тёмный фон  
        document.body.style.color = "#fff";  
        document.body.style.fontFamily = "Arial, sans-serif";  
        document.body.style.padding = "10px";  

        var title = document.createElement("h2");  
        title.textContent = "Поиск";  
        title.style.textAlign = "center";  
        title.style.marginBottom = "20px";  
        document.body.appendChild(title);  

        var searchContainer = document.createElement("div");  
        searchContainer.style.display = "flex";  
        searchContainer.style.alignItems = "center";  
        searchContainer.style.background = "#333";  
        searchContainer.style.borderRadius = "10px";  
        searchContainer.style.padding = "10px";  

        var micIcon = document.createElement("span");  
        micIcon.textContent = "🎤";  
        micIcon.style.fontSize = "18px";  
        micIcon.style.marginRight = "10px";  

        var searchInput = document.createElement("input");  
        searchInput.type = "text";  
        searchInput.placeholder = "Введите текст...";  
        searchInput.style.flex = "1";  
        searchInput.style.background = "transparent";  
        searchInput.style.border = "none";  
        searchInput.style.outline = "none";  
        searchInput.style.color = "#fff";  
        searchInput.style.fontSize = "16px";  

        searchContainer.appendChild(micIcon);  
        searchContainer.appendChild(searchInput);  
        document.body.appendChild(searchContainer);  

        var resultsContainer = document.createElement("div");  
        resultsContainer.style.marginTop = "20px";  
        resultsContainer.style.maxHeight = "500px";  
        resultsContainer.style.overflowY = "auto";  
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
                    <strong>${item.name || "Неизвестная раздача"}</strong><br>
                    📥 <strong>${item.seeds || 0}</strong> сидеров | 🟢 <strong>${item.peers || 0}</strong> личеров
                `;

                div.appendChild(img);
                div.appendChild(text);

                div.addEventListener("click", () => {
                    window.open(item.Torrent, "_blank");  
                });

                resultsContainer.appendChild(div);

                getArtistImage(item.name.split("-")[0].trim()).then(imageUrl => {
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
