(function() {
    function addMusicButton() {
        var checkExist = setInterval(function() {
            var menu = document.querySelector("nav"); // Убедись, что селектор правильный
            if (menu) {
                clearInterval(checkExist);

                var existingButton = document.querySelector("#musicButton");
                if (!existingButton) {
                    var musicButton = document.createElement("button");
                    musicButton.textContent = "Музыка";
                    musicButton.id = "musicButton";
                    musicButton.style.padding = "10px";
                    musicButton.style.margin = "5px";
                    musicButton.style.backgroundColor = "#007bff";
                    musicButton.style.color = "#fff";
                    musicButton.style.border = "none";
                    musicButton.style.borderRadius = "5px";
                    musicButton.style.cursor = "pointer";

                    musicButton.addEventListener("click", function() {
                        var script = document.createElement("script");
                        script.src = "https://cdn.jsdelivr.net/gh/Aleksandrl39/Myfiles-/Test185.js";
                        document.body.appendChild(script);
                    });

                    menu.appendChild(musicButton);
                }
            }
        }, 500);
    }

    addMusicButton();
})();
