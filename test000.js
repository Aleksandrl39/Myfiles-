(function(){
    // Конструктор плагина
    function HelloLampaPlugin(){
        this.name = "HelloLampaPlugin";
        this.init = function(){
            console.log("HelloLampaPlugin инициализирован");

            // Пытаемся найти контейнер интерфейса Lampa (например, с id "lampa_interface").
            // Если не найден, используем document.body.
            var container = document.getElementById("lampa_interface") || document.body;
            
            // Создаем элемент для отображения результата работы плагина
            var pluginDiv = document.createElement("div");
            pluginDiv.id = "hello-lampa-plugin";
            pluginDiv.style.background = "#ffcc00";
            pluginDiv.style.padding = "10px";
            pluginDiv.style.margin = "10px";
            pluginDiv.style.textAlign = "center";
            pluginDiv.style.fontSize = "18px";
            pluginDiv.textContent = "Hello, Lampa! Плагин работает.";
            
            // Вставляем созданный элемент в контейнер
            container.appendChild(pluginDiv);
        }
    }

    // Если объект Lampa и функция регистрации плагинов доступны, регистрируем плагин
    if(window.lampa && typeof window.lampa.registerPlugin === "function"){
        window.lampa.registerPlugin("HelloLampaPlugin", new HelloLampaPlugin());
    } else {
        // Иначе сразу запускаем инициализацию плагина для демонстрации
        new HelloLampaPlugin().init();
    }
})();
