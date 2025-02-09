(function () {
    var plugin_id = 'muzis_button';
    var plugin_name = 'Музыка';

    function startPlugin() {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                addMusicButton();
            }
        });
    }

    function addMusicButton() {
        var menu = Lampa.Settings.main().render().find('.settings__items');
        var button = $('<div class="settings__item selector" data-action="' + plugin_id + '">')
            .text(plugin_name)
            .append('<div class="settings__icon"><i class="icon mdi mdi-music"></i></div>');

        button.on('hover:enter', function () {
            Lampa.Activity.push({
                url: '',
                title: plugin_name,
                component: 'more'
            });
        });

        menu.append(button);
    }

    Lampa.Plugin.create(plugin_id, {
        title: plugin_name,
        onStart: startPlugin
    });
})();
