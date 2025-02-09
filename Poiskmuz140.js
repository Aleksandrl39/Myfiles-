(function () {
    const plugin_id = 'muzis_search';
    const plugin_name = 'Музыка поиск';
    
    function startPlugin() {
        let menuItem = {
            id: plugin_id,
            title: plugin_name,
            icon: 'https://cdn-icons-png.flaticon.com/512/727/727245.png',
            onClick: () => {
                Lampa.Activity.push({
                    url: '',
                    title: plugin_name,
                    component: 'music_search',
                    page: 1
                });
            }
        };

        Lampa.Menu.add(menuItem);
    }

    function checkLampaReady() {
        if (typeof Lampa !== 'undefined' && typeof Lampa.Menu !== 'undefined') {
            startPlugin();
        } else {
            setTimeout(checkLampaReady, 1000);
        }
    }

    checkLampaReady();
})();
