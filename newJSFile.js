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

function generateMap() {
    const map = document.querySelector(".map");
    map.innerHTML = ""; // Clear in case of reload

    for (let row of mapData) {
        for (let cell of row) {
            let newDiv = document.createElement("div");
            newDiv.classList.add("tile");

            if (cell === "f") newDiv.classList.add("forest");
            else if (cell === "t") newDiv.classList.add("tree");
            else if (cell === "l") newDiv.classList.add("lake");
            else if (cell === "h") newDiv.classList.add("house");
            else newDiv.classList.add("empty");

            map.appendChild(newDiv);
        }
    }

    const player = document.createElement("div");
    player.classList.add("player");
    map.appendChild(player);
}

function updatePlayerPosition() {
    const player = document.querySelector(".player");
    player.style.left = `${playerPosition.x * tileSize}px`;
    player.style.top = `${playerPosition.y * tileSize}px`;
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && playerPosition.y > 0) {
        playerPosition.y--;
    } else if (e.key === "ArrowDown" && playerPosition.y < mapHeight - 1) {
        playerPosition.y++;
    } else if (e.key === "ArrowLeft" && playerPosition.x > 0) {
        playerPosition.x--;
    } else if (e.key === "ArrowRight" && playerPosition.x < mapWidth - 1) {
        playerPosition.x++;
    }
    updatePlayerPosition();
});

window.onload = () => {
    generateMap();
    updatePlayerPosition();
};
