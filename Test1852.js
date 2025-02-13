(function() {
    var pluginId = 'music-plugin';
    if (window.lampa_plugins && window.lampa_plugins.includes(pluginId)) return;
    window.lampa_plugins = window.lampa_plugins || [];
    window.lampa_plugins.push(pluginId);

    function addMusicButton() {
        var menu = Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                var menuItem = $('<li class="menu__item selector focusable" data-action="music"><div class="menu__ico"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 17V5l12-2v12h-2V6l-8 1v10H9zm-4 2a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm12 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg></div><div class="menu__text">Музыка</div></li>');
                
                $('.menu__list').append(menuItem);

                menuItem.on('click', function () {
                    loadMusicPlugin();
                });

                Lampa.Listener.remove('app', menu);
            }
        });
    }

    function loadMusicPlugin() {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/Aleksandrl39/Myfiles-/Test185.js';
        script.onload = function() {
            Lampa.Noty.show('Музыкальный плагин загружен!');
        };
        script.onerror = function() {
            Lampa.Noty.show('Ошибка загрузки плагина.');
        };
        document.body.appendChild(script);
    }

    addMusicButton();
})();
