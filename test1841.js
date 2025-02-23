(function () {
var iTunesApiUrl = "https://itunes.apple.com/search";
var lastfmApiKey = "5e508b11704a1f7de4dd1ab7da50686d";
var lastfmApiUrl = "https://ws.audioscrobbler.com/2.0/";
var torrentApiUrl = "http://127.0.0.1:8009/api/v1/all/search"; // URL API торрентов

function fetchData(url) {  
    return fetch(url)  
        .then(response => response.json())  
        .catch(error => {  
            console.error("Ошибка API:", error);  
            return null;  
        });  
}  

function searchArtists(query) {  
    var url = `${iTunesApiUrl}?term=${encodeURIComponent(query)}&entity=musicArtist&limit=20&media=music`;  
    return fetchData(url).then(data => data?.results || []);  
}  

function getAlbums(artistName) {  
    var url = `${iTunesApiUrl}?term=${encodeURIComponent(artistName)}&entity=album&limit=20&media=music`;  
    return fetchData(url).then(data => data?.results || []);  
}  

function searchTorrents(artistName, albumName) {  
    var query = `${artistName} ${albumName}`;  
    var url = `${torrentApiUrl}?query=${encodeURIComponent(query)}`;  
    return fetchData(url).then(data => data?.data || []);  
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
    searchInput.placeholder = "Введите имя исполнителя";  
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

    function renderList(items, type, onClick) {
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

        var text = document.createElement("div");

        if (type === "artist") {
            getArtistImage(item.artistName).then(imageUrl => {
                img.src = imageUrl || "https://via.placeholder.com/100";
            });
            text.innerHTML = `<strong>${item.artistName || "Неизвестный исполнитель"}</strong>`;
        } 
        else if (type === "album") {
            img.src = item.artworkUrl100 || "https://via.placeholder.com/100";
            text.innerHTML = `<strong>${item.collectionName || "Неизвестный альбом"}</strong>`;
        } 
        else if (type === "torrent") {
            img.src = item.poster || "https://via.placeholder.com/100"; // Берем постер, если есть
            text.innerHTML = `
                <strong>${item.name || "Неизвестная раздача"}</strong><br>
                📥 <strong>${item.seeders || 0}</strong> сидеров | 🟢 <strong>${item.leechers || 0}</strong> личеров
            `;
        }

        div.appendChild(img);
        div.appendChild(text);
        div.addEventListener("click", () => onClick(item));
        resultsContainer.appendChild(div);
    });
}

    searchButton.addEventListener("click", function () {  
        var query = searchInput.value.trim();  
        if (!query) return;  

        resultsContainer.innerHTML = "<p>Загрузка...</p>";  
        searchArtists(query).then(artists => {  
            renderList(artists, "artist", artist => {  
                resultsContainer.innerHTML = "<p>Загрузка альбомов...</p>";  
                getAlbums(artist.artistName).then(albums => {  
                    renderList(albums, "album", album => {  
                        resultsContainer.innerHTML = "<p>Поиск торрентов...</p>";  
                        searchTorrents(artist.artistName, album.collectionName).then(torrents => {  
                            if (torrents.length === 0) {  
                                resultsContainer.innerHTML = "<p>Торренты не найдены.</p>";  
                                return;  
                            }  
                            renderList(torrents, "torrent", torrent => {  
                                window.open(torrent.magnet, "_blank");  
                            });  
                        });  
                    });  
                });  
            });  
        });  
    });  

    container.appendChild(searchInput);  
    container.appendChild(searchButton);  
    container.appendChild(resultsContainer);  
    document.body.appendChild(container);  
}  

createSearchPage();

})();

