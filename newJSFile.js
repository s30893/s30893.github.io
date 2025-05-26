function openGame(){
    window.location.href = "gamePageNew.html";
}
const mapData = [
    ["f", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", "t", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
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
            else {
                newDiv.classList.add("empty");
            }

            map.appendChild(newDiv);
        }
    }

    const player = document.createElement("div");
    player.classList.add("player");
    map.appendChild(player);

    hint = document.createElement("div");
    hint.classList.add("hint");
    hint.classList.add("hidden");
    hint.textContent = "Naciśnij E";
    document.querySelector(".map").appendChild(hint);
}

function updatePlayerPosition() {
    const player = document.querySelector(".player");
    player.style.left = `${playerPosition.x * tileSize}px`;
    player.style.top = `${playerPosition.y * tileSize}px`;
}

document.addEventListener("keydown", (e) => {
    let newX = playerPosition.x;
    let newY = playerPosition.y;
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
        }
    } else if (e.key === "ArrowRight" && playerPosition.x < mapWidth - 1) {
        newX = newX + 1;
        if(mapData[newY][newX] !== " "){
        } else{
            playerPosition.x++;
        }
    }
    updatePlayerPosition();
    //dialog with home
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

    if (nearHouse || nearTree || nearLake || nearForest) {
        hint.classList.remove("hidden");
        hint.style.left = `${x * tileSize + 10}px`;
        hint.style.top = `${y * tileSize}px`;
    } else {
        hint.classList.add("hidden");
    }

    if(e.key === "e" || e.key === "E") {
        if (mapData[y - 1]?.[x] === "h" || mapData[y + 1]?.[x] === "h" || mapData[y]?.[x - 1] === "h" || mapData[y]?.[x + 1] === "h") {
            let dialog = document.querySelector(".dialog");
            dialog.classList.remove("hidden");
            dialog.querySelector("p").textContent = "Nie ma to jak w domu!";
            dialog.querySelector("img.portrait").src = "images/NPC.jpg";

        }
    }
    if(e.key === "e" || e.key === "E") {
        // dialog with tree - start of quest
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

        // collecting berries
        if (berryQuestAccepted && forestReady &&
            (mapData[y - 1]?.[x] === "f" || mapData[y + 1]?.[x] === "f" || mapData[y]?.[x - 1] === "f" || mapData[y]?.[x + 1] === "f")) {

            berriesCollected++;
            updateInfoBox("🍓 Zbieraj jagody w lesie!", berriesCollected);
            if (berriesCollected === 3) {
                forestReady = false;
                document.querySelector(".forest").classList.remove("glow");
            }
        }
    }
    //end of quest
    if(e.key === "e" || e.key === "E"){
            if (berriesCollected === 3 && !berryQuestCompleted &&
                (mapData[y - 1]?.[x] === "t" || mapData[y + 1]?.[x] === "t" || mapData[y]?.[x - 1] === "t" || mapData[y]?.[x + 1] === "t")) {

                berryQuestCompleted = true;
                let dialog = document.querySelector(".dialog");
                dialog.classList.remove("hidden");
                dialog.querySelector("p").textContent = "Dziękuję bardzo sąsiedzie!";
                updateInfoBox("Zadanie zakończone.");
                setTimeout(() => {
                    let questionBox = document.querySelector(".question");
                    questionBox.classList.add("hidden");
                }, 3000);
            }
        }
});

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
    const tile = document.querySelector(".forest");

    tile.classList.add("glow");
    forestReady = true;
}


window.onload = function () {
    generateMap();
    updatePlayerPosition();
};
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        let dialog = document.querySelector(".dialog");
        dialog.classList.add("hidden");
    }
});
