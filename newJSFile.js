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
    if (
        mapData[y - 1]?.[x] === "h" ||
        mapData[y + 1]?.[x] === "h" ||
        mapData[y]?.[x - 1] === "h" ||
        mapData[y]?.[x + 1] === "h"
    ) {
        hint.classList.remove("hidden");
        hint.style.left = `${x * tileSize + 10}px`;
        hint.style.top = `${y * tileSize}px`;
    } else {
        hint.classList.add("hidden");
    }
    if(e.key === "e" || e.key === "E"){
        if(mapData[y-1]?.[x] === "h" || mapData[y+1]?.[x] === "h" || mapData[y]?.[x-1] === "h" || mapData[y]?.[x+1] === "h"){
            let dialog = document.querySelector(".dialog");
            dialog.classList.remove("hidden");
            document.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    const dialog = document.querySelector(".dialog");
                    dialog.classList.add("hidden");
                }
            });

        }
    }
});

window.onload = function () {
    generateMap();
    updatePlayerPosition();
};
