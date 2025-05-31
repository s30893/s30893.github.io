function openGame(){
    localStorage.removeItem("whimsySave");
    localStorage.removeItem("resumeGame");
    window.location.href = "gamePageNew.html";
}
function back(){
    window.location.href= "index.html";
}
function form(){
    window.location.href ="form.html";
}
const mapData = [
    ["f", " ", " ", " ", " ", " ", " ", "m"],
    [" ", " ", " ", "t", " ", " ", " ", "m"],
    [" ", " ", " ", " ", " ", " ", " ", "m"],
    [" ", "l", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", "h", " ", " ", " "]
];

const tileSize = 90;
const mapWidth = 8;
const mapHeight = 5;
let playerPosition = {x: 1, y: 1};
let hint;

let berriesCollected = 0;
let berryQuestStarted = false;
let berryQuestAccepted = false;
let berryQuestCompleted = false;
let forestReady = false;

let cakeQuestStarted = false;
let cakeQuestCompleted = false;

let amuletQuestStarted = false;
let amuletFound = false;
let amuletQuestCompleted = false;
let amuletTile = null;

let endingUnlocked = false;


function generateMap() {
    const map = document.querySelector(".map");

    for (let row of mapData) {
        for (let cell of row) {
            let newDiv = document.createElement("div");
            newDiv.classList.add("tile");

            if (cell === "f") {
                newDiv.classList.add("forest");
            }
            else if (cell === "t") {
                newDiv.classList.add("tree");
            }
            else if (cell === "l") {
                newDiv.classList.add("lake");
            }
            else if (cell === "h") {
                newDiv.classList.add("house");
            }
            else if(cell === "m") {
                newDiv.classList.add("mountain")
            }
            else {
                newDiv.classList.add("empty");
            }

            map.appendChild(newDiv);
        }
    }

    let player = document.createElement("div");
    player.classList.add("player");
    map.appendChild(player);

    hint = document.createElement("div");
    hint.classList.add("hint");
    hint.classList.add("hidden");
    hint.textContent = "Naciśnij E";
    document.querySelector(".map").appendChild(hint);
}

function updatePlayerPosition() {
    let player = document.querySelector(".player");
    player.style.left = `${playerPosition.x * tileSize}px`;
    player.style.top = `${playerPosition.y * tileSize}px`;
}
//movement
document.addEventListener("keydown", (e) => {
    let newX = playerPosition.x;
    let newY = playerPosition.y;
    let player = document.querySelector(".player");
    if (e.key === "ArrowUp" && playerPosition.y > 0) {
        newY = newY - 1;
        if(mapData[newY][newX] !== " "){
        } else{
            playerPosition.y--;
        }
    } else if (e.key === "ArrowDown" && playerPosition.y < mapHeight - 1) {
        newY = newY + 1;
        if(mapData[newY][newX] !== " "){
        } else{
            playerPosition.y++;
        }
    } else if (e.key === "ArrowLeft" && playerPosition.x > 0) {
        newX = newX - 1;
        if(mapData[newY][newX] !== " "){
        } else{
            playerPosition.x--;
            player.classList.add("flipped");
        }
    } else if (e.key === "ArrowRight" && playerPosition.x < mapWidth - 1) {
        newX = newX + 1;
        if(mapData[newY][newX] !== " "){
        } else{
            playerPosition.x++;
            player.classList.remove("flipped");
        }
    }
    updatePlayerPosition();

    let x = playerPosition.x;
    let y = playerPosition.y;
    const adjacentTile = [
        mapData[y - 1]?.[x],
        mapData[y + 1]?.[x],
        mapData[y]?.[x - 1],
        mapData[y]?.[x + 1]
    ];

//hints for special tiles
    let nearHouse = adjacentTile.includes("h");
    let nearTree = adjacentTile.includes("t");
    let nearLake = adjacentTile.includes("l");
    let nearForest = adjacentTile.includes("f") && berryQuestAccepted;
    let nearMountain = adjacentTile.includes("m") && amuletQuestStarted;

    if (nearHouse || nearTree || nearLake || nearForest || nearMountain) {
        hint.classList.remove("hidden");
        hint.style.left = `${x * tileSize + 10}px`;
        hint.style.top = `${y * tileSize}px`;
    } else {
        hint.classList.add("hidden");
    }
//dialog with house
    if(e.key === "e" || e.key === "E") {
        if (mapData[y - 1]?.[x] === "h" || mapData[y + 1]?.[x] === "h" || mapData[y]?.[x - 1] === "h" || mapData[y]?.[x + 1] === "h") {
            let dialog = document.querySelector(".dialog");
            dialog.classList.remove("hidden");
            dialog.querySelector("p").textContent = "Nie ma to jak w domu!";
            dialog.querySelector("img.portrait").src = "images/NPC.jpg";

        }
    }
//dialog with tree
    if(e.key === "e" || e.key === "E") {
        if (mapData[y - 1]?.[x] === "t" || mapData[y + 1]?.[x] === "t" || mapData[y]?.[x - 1] === "t" || mapData[y]?.[x + 1] === "t") {
            let dialog = document.querySelector(".dialog");
            dialog.classList.remove("hidden");
            dialog.querySelector("p").textContent = "Witaj w mojej dziupli!";
            dialog.querySelector("img.portrait").src = "images/squirrel.jpg";

        }
    }
//dialog with lake
    if(e.key === "e" || e.key === "E") {
        if (mapData[y - 1]?.[x] === "l" || mapData[y + 1]?.[x] === "l" || mapData[y]?.[x - 1] === "l" || mapData[y]?.[x + 1] === "l") {
            let dialog = document.querySelector(".dialog");
            dialog.classList.remove("hidden");
            dialog.querySelector("p").textContent = "Spokój to podstawa. Spokój to życie.";
            dialog.querySelector("img.portrait").src = "images/kapibara.jpg";

        }
    }
//dialog with tree - start of quest
    if(e.key === "e" || e.key === "E") {
        if (!berryQuestStarted &&
            (mapData[y - 1]?.[x] === "t" || mapData[y + 1]?.[x] === "t" || mapData[y]?.[x - 1] === "t" || mapData[y]?.[x + 1] === "t")) {

            berryQuestStarted = true;
            let dialog = document.querySelector(".dialog");
            dialog.classList.remove("hidden");
            dialog.querySelector("p").textContent = "Witaj sąsiedzie, potrzebuję twojej pomocy. Piekę ciasto ale zapomniałam o jagodach, czy możesz je dla mnie zebrać w lesie?";
            dialog.querySelector("img.portrait").src = "images/squirrel.jpg";

            setTimeout(() => {
                updateInfoBox("Czy chcesz pomóc zebrać jagody? (Naciśnij Y - Tak, N - Nie)");
            }, 3000);
        }


        document.addEventListener("keydown", function acceptQuest(ev) {
            if (!berryQuestAccepted && berryQuestStarted) {
                if (ev.key === "y" || ev.key === "Y") {
                    berryQuestStarted = true;
                    berryQuestAccepted = true;
                    let dialog = document.querySelector(".dialog");
                    dialog.classList.add("hidden");
                    updateInfoBox("Zbieraj jagody w lesie!", berriesCollected);
                    flashForestTile();
                    document.removeEventListener("keydown", acceptQuest);
                } else if (ev.key === "n" || ev.key === "N") {
                    let dialog = document.querySelector(".dialog");
                    dialog.classList.add("hidden");

                    let question = document.querySelector(".question");
                    question.classList.add("hidden");

                    berryQuestStarted = false;

                    document.removeEventListener("keydown", acceptQuest);
                }
            }
        });
 //collecting berries
        if (berryQuestAccepted && forestReady &&
            (mapData[y - 1]?.[x] === "f" || mapData[y + 1]?.[x] === "f" || mapData[y]?.[x - 1] === "f" || mapData[y]?.[x + 1] === "f")) {

            berriesCollected++;
            updateInfoBox(" Zbieraj jagody w lesie!", berriesCollected);
            if (berriesCollected === 3) {
                forestReady = false;
                document.querySelector(".forest").classList.remove("glow");
            }
        }
    }
//end of quest 1/3 and start of quest 2/3
    if(e.key === "e" || e.key === "E"){
            if (berriesCollected === 3 && !berryQuestCompleted &&
                (mapData[y - 1]?.[x] === "t" || mapData[y + 1]?.[x] === "t" || mapData[y]?.[x - 1] === "t" || mapData[y]?.[x + 1] === "t")) {

                berryQuestCompleted = true;
                let dialog = document.querySelector(".dialog");
                dialog.classList.remove("hidden");
                dialog.querySelector("p").textContent = "Dziękuję bardzo sąsiedzie! Mam jeszcze jedną prośbę. Zanieś proszę to ciasto drogiemu Kapibarze.";
                updateInfoBox("Zadanie zakończone.");
                cakeQuestStarted = true;
                setTimeout(() => {
                    updateInfoBox("Zanieś ciasto Kapibarze nad jezioro.");
                }, 2000);
            }
        }
//end of quest 2/3 and start of quest 3/3
    if (e.key === "e" || e.key === "E") {
        if (cakeQuestStarted && !cakeQuestCompleted &&
            (mapData[y - 1]?.[x] === "l" || mapData[y + 1]?.[x] === "l" ||
                mapData[y]?.[x - 1] === "l" || mapData[y]?.[x + 1] === "l")) {

            cakeQuestCompleted = true;
            amuletQuestStarted = true;

            let dialog = document.querySelector(".dialog");
            dialog.classList.remove("hidden");
            dialog.querySelector("p").textContent = "Dziękuję za ciasto! Mam kłopot, sąsiedzie. Zgubiłem mój amulet w górach. Możesz go poszukać?";
            dialog.querySelector("img.portrait").src = "images/kapibara.jpg";

            updateInfoBox("Zadanie zakończone");
            setTimeout(() => {
                updateInfoBox("Znajdź amulet w górach.");
            }, 2000);

            setTimeout(placeAmuletInMountains, 2000);
        }
    }
    if (e.key === "e" || e.key === "E") {
        if (amuletQuestStarted && !amuletFound &&
            (mapData[y - 1]?.[x] === "m" || mapData[y + 1]?.[x] === "m" ||
                mapData[y]?.[x - 1] === "m" || mapData[y]?.[x + 1] === "m")) {


            let mapIndex = (y - 1 >= 0 && mapData[y - 1][x] === "m") ? y - 1 :
                (y + 1 < mapHeight && mapData[y + 1][x] === "m") ? y + 1 :
                    (mapData[y]?.[x - 1] === "m") ? y :
                        (mapData[y]?.[x + 1] === "m") ? y : null;

            if (amuletTile && amuletTile.classList.contains("amulet")) {
                amuletFound = true;
                amuletTile.classList.remove("amulet");

                let dialog = document.querySelector(".dialog");
                dialog.classList.remove("hidden");

                updateInfoBox("Amulet znaleziony!");
            }
        }
//end of quest 3/3
        if (amuletFound && !amuletQuestCompleted &&
            (mapData[y - 1]?.[x] === "l" || mapData[y + 1]?.[x] === "l" ||
                mapData[y]?.[x - 1] === "l" || mapData[y]?.[x + 1] === "l")) {

            amuletQuestCompleted = true;
            endingUnlocked = true;


            let dialog = document.querySelector(".dialog");
            dialog.classList.remove("hidden");
            dialog.querySelector("p").textContent = "Dziękuję za odzyskanie amuletu!";
            dialog.querySelector("img.portrait").src = "images/kapibara.jpg";

            updateInfoBox("Zadanie zakończone");
            setTimeout(() => {
                updateInfoBox("Wróć do domku");
            }, 3000);

            let questionBox = document.querySelector(".question");
            questionBox.classList.add("hidden");

        }
    }
//end of game
    if (e.key === "e" || e.key === "E") {
        if (endingUnlocked &&
            (mapData[y - 1]?.[x] === "h" || mapData[y + 1]?.[x] === "h" ||
                mapData[y]?.[x - 1] === "h" || mapData[y]?.[x + 1] === "h")) {

            window.location.href = "thanks.html";
        }
    }
//save game
    if (e.key === "s" || e.key === "S") {
        const data = {
            position: playerPosition,
            berriesCollected,
            berryQuestStarted,
            berryQuestAccepted,
            berryQuestCompleted,
            forestReady,
            cakeQuestStarted,
            cakeQuestCompleted,
            amuletFound,
            amuletQuestStarted,
            amuletQuestCompleted,
            endingUnlocked,
        };
        localStorage.setItem("whimsySave", JSON.stringify(data));
        alert("Gra zapisana!");
    }
});
function placeAmuletInMountains() {
    let mountainTiles = document.querySelectorAll(".mountain"); // zakładamy, że "m" => class="mountain"
    if (mountainTiles.length === 0) return;

    let index = Math.floor(Math.random() * mountainTiles.length);
    amuletTile = mountainTiles[index];
    amuletTile.classList.add("amulet");
}

//progress bar
function updateInfoBox(text = "", berries = null) {
    let questionBox = document.querySelector(".question");
    questionBox.classList.remove("hidden");

    let html = `<p>${text}</p>`;
    if (berries !== null) {
        html += `<p>Jagody: ${berries}/3</p>`;
    }
    questionBox.innerHTML = html;
}

//flashing forest tile
function flashForestTile() {
    let tile = document.querySelector(".forest");

    tile.classList.add("glow");
    forestReady = true;
}
function continueGame() {
    let saveData = localStorage.getItem("whimsySave");
    if (saveData) {
        localStorage.setItem("resumeGame", "true");
        window.location.href = "gamePageNew.html";
    } else {
        window.location.href= "noSave.html";
    }
}

window.onload = function () {
    let resume = localStorage.getItem("resumeGame");
    if (resume === "true") {
        let save = JSON.parse(localStorage.getItem("whimsySave"));
        if (save) {
            playerPosition = save.position || { x: 1, y: 1 };
            berriesCollected = save.berriesCollected || 0;
            berryQuestStarted = save.berryQuestStarted || false;
            berryQuestAccepted = save.berryQuestAccepted || false;
            berryQuestCompleted = save.berryQuestCompleted || false;
            forestReady = save.forestReady || false;
            cakeQuestStarted = save.cakeQuestStarted || false
            cakeQuestCompleted = save.cakeQuestCompleted || false;
            amuletFound = save.amuletFound || false;
            amuletQuestStarted = save.amuletQuestStarted || false;
            amuletQuestCompleted = save.amuletQuestCompleted || false;
            endingUnlocked = save.endingUnlocked || false;
        }
        localStorage.removeItem("resumeGame");
    }

    generateMap();
    updatePlayerPosition();
};
//close dialog
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        let dialog = document.querySelector(".dialog");
        dialog.classList.add("hidden");
    }
});

