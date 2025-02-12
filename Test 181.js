(function(){
    var lastfmApiKey = "5e508b11704a1f7de4dd1ab7da50686d";
    var lastfmApiUrl = "https://ws.audioscrobbler.com/2.0/";

    function searchMusic(query) {
        var url = `${lastfmApiUrl}?method=track.search&track=${encodeURIComponent(query)}&api_key=${lastfmApiKey}&format=json`;
        
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                return data.results.trackmatches.track.map(track => ({
                    title: track.name,
                    artist: track.artist,
                    url: track.url,
                    image: track.image.length ? track.image[2]["#text"] : "https://via.placeholder.com/100"
                }));
            })
            .catch(error => {
                console.error("Ошибка при запросе к Last.fm API:", error);
                return [];
            });
    }

    function createSearchPage() {
        document.body.innerHTML = "";

        var container = document.createElement("div");
        container.style.padding = "20px";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.color = "#fff";
        container.style.background = "#121212";

        var searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = "Введите название песни...";
        searchInput.style.width = "100%";
        searchInput.style.padding = "10px";
        searchInput.style.fontSize = "16px";
        searchInput.style.border = "none";
        searchInput.style.borderRadius = "5px";
        searchInput.style.background = "#333";
        searchInput.style.color = "#fff";

        var searchButton = document.createElement("button");
        searchButton.textContent = "Поиск";
        searchButton.style.width = "100%";
        searchButton.style.padding = "10px";
        searchButton.style.marginTop = "10px";
        searchButton.style.border = "none";
        searchButton.style.borderRadius = "5px";
        searchButton.style.background = "#1db954";
        searchButton.style.color = "#fff";
        searchButton.style.fontSize = "16px";
        searchButton.style.cursor = "pointer";

        var resultsContainer = document.createElement("div");
        resultsContainer.style.marginTop = "20px";

        searchButton.addEventListener("click", function() {
            var query = searchInput.value.trim();
            if (query) {
                resultsContainer.innerHTML = "<p style='text-align: center;'>Загрузка...</p>";
                searchMusic(query).then(results => {
                    resultsContainer.innerHTML = "";
                    if (results.length === 0) {
                        resultsContainer.innerHTML = "<p style='text-align: center;'>Ничего не найдено.</p>";
                    } else {
                        results.forEach(track => {
                            var item = document.createElement("div");
                            item.style.display = "flex";
                            item.style.alignItems = "center";
                            item.style.padding = "10px";
                            item.style.borderRadius = "10px";
                            item.style.background = "#222";
                            item.style.marginBottom = "10px";
                            item.style.cursor = "pointer";
                            item.style.transition = "background 0.3s";
                            item.onmouseover = () => item.style.background = "#333";
                            item.onmouseout = () => item.style.background = "#222";

                            var img = document.createElement("img");
                            img.src = track.image;
                            img.style.width = "60px";
                            img.style.height = "60px";
                            img.style.borderRadius = "5px";
                            img.style.marginRight = "10px";

                            var text = document.createElement("div");
                            text.innerHTML = `<strong style="font-size: 16px;">${track.title}</strong><br><span style="color: #bbb;">${track.artist}</span>`;

                            item.appendChild(img);
                            item.appendChild(text);
                            item.addEventListener("click", function() {
                                window.open(track.url, "_blank");
                            });

                            resultsContainer.appendChild(item);
                        });
                    }
                });
            }
        });

        container.appendChild(searchInput);
        container.appendChild(searchButton);
        container.appendChild(resultsContainer);
        document.body.appendChild(container);
    }

    createSearchPage();
})();
