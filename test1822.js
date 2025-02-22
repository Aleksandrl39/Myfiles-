function searchTorrents(query) {
    return fetch(`https://apibay.org/q.php?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => data.filter(item => item.name)) // Убираем пустые результаты
        .catch(error => {
            console.error("Ошибка поиска торрентов:", error);
            return [];
        });
}

function renderTorrents(torrents) {
    resultsContainer.innerHTML = "";
    if (torrents.length === 0) {
        resultsContainer.innerHTML = "<p>Раздачи не найдены.</p>";
        return;
    }

    torrents.forEach(torrent => {
        var div = document.createElement("div");
        div.style.padding = "10px";
        div.style.marginBottom = "5px";
        div.style.backgroundColor = "#222";
        div.style.color = "#fff";
        div.style.borderRadius = "5px";

        var title = document.createElement("p");
        title.innerHTML = `<strong>${torrent.name}</strong>`;

        var seeds = document.createElement("p");
        seeds.innerHTML = `Сидов: ${torrent.seeders}`;

        var link = document.createElement("a");
        link.href = `https://thepiratebay.org/description.php?id=${torrent.id}`;
        link.textContent = "Скачать";
        link.style.color = "#0f9d58";
        link.target = "_blank";

        div.appendChild(title);
        div.appendChild(seeds);
        div.appendChild(link);

        resultsContainer.appendChild(div);
    });
}
