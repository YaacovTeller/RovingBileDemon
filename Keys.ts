var keys = [];
window.addEventListener('keydown', function (e) {
    keys = (keys || []);
    keys[e.keyCode] = true;
    keyCommands(e);
})
window.addEventListener('keyup', function (e) {
    keys[e.keyCode] = false;
})

function keyCommands(e: KeyboardEvent) {
    if (e.keyCode == 49) {  // e.key === "1"
        biledemon.passWind(thiefInst);
    }
    // else if (e.key === "2") {
    //     Fart2.play();
    // }
    // else if (e.key === "3") {
    //     Fart3.play();
    // }
    // else if (e.key === "4") {
    //     Fart4.play();
    // }
    // else if (e.key === "5") {
    //     Fart5.play();
    // }
    // else if (e.key === "6") {
    //     Fart6.play();
    // }
    else if (e.key === "c") {
        shaiCheatPlusTen();
        refreshChickCounter();
    }
    else if (e.key === "p") {
        chickenCollisionFunction(biledemon ,true);
    }
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