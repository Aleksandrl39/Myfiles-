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
    // Загружаем стили Lampa, если их нет
    if (!document.querySelector("#lampa-styles")) {
        var styleLink = document.createElement("link");
        styleLink.id = "lampa-styles";
        styleLink.rel = "stylesheet";
        styleLink.href = "https://yumata.github.io/lampa-source/style.css"; // Подключаем стили
        document.head.appendChild(styleLink);
    }

    // Создаём контейнер плагина
    var searchContainer = document.createElement("div");
    searchContainer.className = "content search layer";

    var searchHeader = document.createElement("div");
    searchHeader.className = "search__head";

    var searchInput = document.createElement("input");
    searchInput.className = "search__input selector";
    searchInput.type = "text";
    searchInput.placeholder = "Введите имя исполнителя";

    var resultsContainer = document.createElement("div");
    resultsContainer.className = "search__results";

    var backButton = document.createElement("div");
    backButton.className = "search__back selector";
    backButton.innerText = "Назад";
    backButton.addEventListener("click", function () {
        Lampa.Controller.back();
    });

    searchHeader.appendChild(searchInput);
    searchHeader.appendChild(backButton);
    searchContainer.appendChild(searchHeader);
    searchContainer.appendChild(resultsContainer);

    function renderList(items, type, onClick) {
        resultsContainer.innerHTML = "";
        if (items.length === 0) {
            resultsContainer.innerHTML = "<div class='search__not-found'>Ничего не найдено.</div>";
            return;
        }

        items.forEach(item => {
            var div = document.createElement("div");
            div.className = "search__item selector";
            div.setAttribute("tabindex", "0");

            if (type === "artist") {
                div.innerHTML = `<div class="search__title">${item.artistName}</div>`;
            } else if (type === "album") {
                div.innerHTML = `<div class="search__title">${item.collectionName}</div>`;
            } else if (type === "torrent") {
                div.innerHTML = `
                    <div class="search__title">${item.name}</div>
                    <div class="search__info">📥 ${item.seeders} сидеров | 🟢 ${item.leechers} личеров</div>
                `;
            }

            div.addEventListener("click", () => onClick(item));
            resultsContainer.appendChild(div);
        });
    }

    searchInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            var query = searchInput.value.trim();
            if (!query) return;

            resultsContainer.innerHTML = "<div class='search__loading'>Загрузка...</div>";
            searchArtists(query).then(artists => {
                renderList(artists, "artist", artist => {
                    resultsContainer.innerHTML = "<div class='search__loading'>Загрузка альбомов...</div>";
                    getAlbums(artist.artistName).then(albums => {
                        renderList(albums, "album", album => {
                            resultsContainer.innerHTML = "<div class='search__loading'>Поиск торрентов...</div>";
                            searchTorrents(artist.artistName, album.collectionName).then(torrents => {
                                renderList(torrents, "torrent", torrent => {
                                    window.open(torrent.magnet, "_blank");
                                });
                            });
                        });
                    });
                });
            });
        }
    });

    document.body.innerHTML = "";
    document.body.appendChild(searchContainer);
    Lampa.Controller.add("search-plugin", { toggle: () => Lampa.Controller.collectionSet(searchContainer) });
    Lampa.Controller.toggle("search-plugin");
}

createSearchPage();

})();

