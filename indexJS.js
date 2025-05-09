function openGame(){
    window.location.href = "gamePage.html";
}

function generateMap(){
    let map =
        [["f", " ", " ", " ", " ", " ", " ", " "], //f-forest
        [" ", " ", " ", "t", " ", " ", " ", " "],  //t-tree
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", "l", " ", " ", " ", " ", " ", " "],  //l-lake
        [" ", " ", " ", " ", "h", " ", " ", " "]]; //h-main character house

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
}

window.onload = function (){
    generateMap();
}