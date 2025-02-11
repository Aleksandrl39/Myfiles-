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
                    image: track.image.length ? track.image[2]["#text"] : ""
                }));
            })
            .catch(error => {
                console.error("Ошибка при запросе к Last.fm API:", error);
                return [];
            });
    }

    function createSearchPage() {
        var searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = "Введите название песни";
        searchInput.style.width = "100%";
        searchInput.style.padding = "10px";
        searchInput.style.fontSize = "16px";

        var searchButton = document.createElement("button");
        searchButton.textContent = "Поиск";
        searchButton.style.marginTop = "10px";

        var resultsContainer = document.createElement("div");
        resultsContainer.style.marginTop = "20px";

        searchButton.addEventListener("click", function() {
            var query = searchInput.value.trim();
            if (query) {
                resultsContainer.innerHTML = "<p>Загрузка...</p>";
                searchMusic(query).then(results => {
                    resultsContainer.innerHTML = "";
                    if (results.length === 0) {
                        resultsContainer.innerHTML = "<p>Ничего не найдено.</p>";
                    } else {
                        results.forEach(track => {
                            var item = document.createElement("div");
                            item.style.display = "flex";
                            item.style.alignItems = "center";
                            item.style.marginBottom = "10px";
                            item.style.cursor = "pointer";

                            var img = document.createElement("img");
                            img.src = track.image;
                            img.style.width = "50px";
                            img.style.height = "50px";
                            img.style.marginRight = "10px";

                            var text = document.createElement("div");
                            text.innerHTML = `<strong>${track.title}</strong><br>${track.artist}`;
                            
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

        var container = document.createElement("div");
        container.appendChild(searchInput);
        container.appendChild(searchButton);
        container.appendChild(resultsContainer);

        document.body.innerHTML = ""; 
        document.body.appendChild(container);
    }

    createSearchPage();
})();
