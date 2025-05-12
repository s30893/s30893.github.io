function openGame(){
    window.location.href = "gamePage.html";
}

function generateMap(){
    let map =
        [
            ["f", " ", " ", " ", " ", " ", " ", " "], //f-forest
            [" ", " ", " ", "t", " ", " ", " ", " "],  //t-tree
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", "l", " ", " ", " ", " ", " ", " "],  //l-lake
            [" ", " ", " ", " ", "h", " ", " ", " "]   //h-main character house
        ];

    for(let i = 0; i < map.length; i++){
        for(let j = 0; j < map[i].length; j++){
            let newDiv = document.createElement("div");
            newDiv.classList.add("tile");

            if(map[i][j] === "f") {
                newDiv.classList.add("forest");
            } else if(map[i][j] === "t") {
                newDiv.classList.add("tree");
            } else if(map[i][j] === "l") {
                newDiv.classList.add("lake");
            } else if(map[i][j] === "h") {
                newDiv.classList.add("house");
            } else {
                newDiv.classList.add("empty");
            }


            document.querySelector(".map").appendChild(newDiv);

        }
    }
    let player = document.createElement("div");
    player.classList.add("player");
    document.querySelector(".map").appendChild(player);
}
let playerPosition = {x: 1, y: 2};
let tileSize = 90;

function updatePlayerPosition(){
  let player = document.querySelector(".player");
  player.style.left = `${playerPosition.x * tileSize}px`;
  player.style.top = `${playerPosition.y* tileSize}px`;
}

document.addEventListener("keydown", (e) => {
    if(e.key === "ArrowUp") {
        if(playerPosition.y > 0) playerPosition.y--; /*problem*/
    }else if(e.key === "ArrowDown") {
        if(playerPosition.y < 4) playerPosition.y++;
    }else if(e.key === "ArrowLeft") {
        if(playerPosition.x > 0) playerPosition.x--; /*problem*/
    }else if(e.key === "ArrowRight") {
        if(playerPosition.x < 7) playerPosition.x++;
    }

    updatePlayerPosition();
})

window.onload = function (){
    generateMap();
    updatePlayerPosition();
}