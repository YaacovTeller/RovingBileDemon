var keys = [];
window.addEventListener('keydown', function (e) {
    keys = (keys || []);
    keys[e.keyCode] = true;
    keyCommands(e);
});
window.addEventListener('keyup', function (e) {
    keys[e.keyCode] = false;
});
function keyCommands(e) {
    if (keys[50]) {
        biledemon.fight();
    }
    if (e.keyCode == 49) { // e.key === "1"
        biledemon.passWind();
    }
    else if (e.key === "o") {
        shaiCheatPlusTen();
        refreshChickCounter();
    }
    else if (e.key === "p") {
        chickenCollisionFunction(biledemon, true);
    }
}
function KeysMoveCheck(objectInst) {
    if (!objectInst.freeMovementCheck()) {
        return;
    }
    var movementFlags = objectInst.movementFlags;
    movementFlags.oldFlag = movementFlags.movingFlag;
    if (keys[37]) {
        moveLeft(objectInst);
        movementFlags.leftMovement = true;
    }
    else
        movementFlags.leftMovement = false;
    if (keys[38]) {
        moveUp(objectInst);
        movementFlags.upMovement = true;
    }
    else
        movementFlags.upMovement = false;
    if (keys[39]) {
        moveRight(objectInst);
        movementFlags.rightMovement = true;
    }
    else
        movementFlags.rightMovement = false;
    if (keys[40]) {
        moveDown(objectInst);
        movementFlags.downMovement = true;
    }
    else
        movementFlags.downMovement = false;
    objectInst.movementFlags = movementFlags;
}
//document.addEventListener('keydown', function (ev) {
//     if (ev.key === "ArrowUp") {
//         moveUp(pic)
//         if (movingFlag != "N") {
//             pic.setAttribute("src", `Bile gifs/Bile_N.gif`)
//             movingFlag = "N";
//         }
//     }
//     else if (ev.key === "ArrowDown") {
//         moveDown(pic)
//         if (movingFlag != "S") {
//             pic.setAttribute("src", `Bile gifs/Bile_S.gif`)
//             movingFlag = "S";
//         }
//     }
//     else if (ev.key === "ArrowLeft") {
//         moveLeft(pic)
//         if (movingFlag != "W") {
//             pic.setAttribute("src", `Bile gifs/Bile_W.gif`)
//             movingFlag = "W";
//         }
//     }
//     else if (ev.key === "ArrowRight") {
//         moveRight(pic)
//         if (movingFlag != "E") {
//             pic.setAttribute("src", `Bile gifs/Bile_E.gif`)
//             movingFlag = "E";
//         }
//     }
// }
// )
// document.addEventListener('keyup', function (ev) {
//     if (ev.key === "ArrowUp") {
//         pic.setAttribute("src", `Bile gifs/Bile_N frames/${num}.gif`)
//         movingFlag = "none"
//     }
//     else if (ev.key === "ArrowDown") {
//         pic.setAttribute("src", `Bile gifs/Bile_S frames/${num}.gif`)
//         movingFlag = "none"
//     }
//     else if (ev.key === "ArrowLeft") {
//         pic.setAttribute("src", `Bile gifs/Bile_W frames/${num}.gif`)
//         movingFlag = "none"
//     }
//     else if (ev.key === "ArrowRight")
//         pic.setAttribute("src", `Bile gifs/Bile_E frames/${num}.gif`)
//     movingFlag = "none"
// }
// )
