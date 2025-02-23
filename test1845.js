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
    var cleanAlbumName = albumName.replace(/(\s?-\s?)?\bSingle\b/gi, "").trim(); // Убираем " - Single"  
    var query = `${artistName} ${cleanAlbumName}`;  
    var url = `${torrentApiUrl}?query=${encodeURIComponent(query)}`;  
    return fetchData(url).then(data => data?.data || []);  
}

function getArtistImage(artistName) {  
    var url = `${lastfmApiUrl}?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${lastfmApiKey}&format=json`;  
    return fetchData(url).then(data => data?.artist?.image?.[2]?.["#text"] || "https://via.placeholder.com/100");  
}  

function createSearchPage() {
    var searchContainer = document.createElement("div");
    searchContainer.className = "search layer";

    var searchInput = document.createElement("input");
    searchInput.className = "search__input selector";
    searchInput.type = "text";
    searchInput.placeholder = "Введите имя исполнителя";
    
    var searchButton = document.createElement("div");
    searchButton.className = "button selector";
    searchButton.innerText = "Поиск";

    var resultsContainer = document.createElement("div");
    resultsContainer.className = "search__results";

    searchButton.addEventListener("click", function () {
        var query = searchInput.value.trim();
        if (!query) return;

        resultsContainer.innerHTML = "<p class='search__loading'>Загрузка...</p>";
        searchArtists(query).then(artists => {
            resultsContainer.innerHTML = "";
            if (artists.length === 0) {
                resultsContainer.innerHTML = "<p class='search__not-found'>Ничего не найдено.</p>";
                return;
            }

            artists.forEach(artist => {
                var item = document.createElement("div");
                item.className = "search__item selector";
                item.innerHTML = `<div class="search__title">${artist.artistName}</div>`;
                item.addEventListener("click", function () {
                    resultsContainer.innerHTML = "<p class='search__loading'>Загрузка альбомов...</p>";
                    getAlbums(artist.artistName).then(albums => {
                        resultsContainer.innerHTML = "";
                        if (albums.length === 0) {
                            resultsContainer.innerHTML = "<p class='search__not-found'>Альбомы не найдены.</p>";
                            return;
                        }

                        albums.forEach(album => {
                            var albumItem = document.createElement("div");
                            albumItem.className = "search__item selector";
                            albumItem.innerHTML = `<div class="search__title">${album.collectionName}</div>`;
                            albumItem.addEventListener("click", function () {
                                resultsContainer.innerHTML = "<p class='search__loading'>Поиск торрентов...</p>";
                                searchTorrents(artist.artistName, album.collectionName).then(torrents => {
                                    resultsContainer.innerHTML = "";
                                    if (torrents.length === 0) {
                                        resultsContainer.innerHTML = "<p class='search__not-found'>Торренты не найдены.</p>";
                                        return;
                                    }

                                    torrents.forEach(torrent => {
                                        var torrentItem = document.createElement("div");
                                        torrentItem.className = "search__item selector";
                                        torrentItem.innerHTML = `
                                            <div class="search__title">${torrent.name}</div>
                                            <div class="search__info">📥 ${torrent.seeders} сидеров | 🟢 ${torrent.leechers} личеров</div>
                                        `;
                                        torrentItem.addEventListener("click", function () {
                                            window.open(torrent.magnet, "_blank");
                                        });

                                        resultsContainer.appendChild(torrentItem);
                                    });
                                });
                            });

                            resultsContainer.appendChild(albumItem);
                        });
                    });
                });

                resultsContainer.appendChild(item);
            });
        });
    });

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);
    searchContainer.appendChild(resultsContainer);
    document.body.innerHTML = "";
    document.body.appendChild(searchContainer);
}

createSearchPage();

})();

