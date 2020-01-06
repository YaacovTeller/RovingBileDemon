var modal = document.getElementById("bileModal");
var playerScore = document.getElementById("playerScore");
var enemyScore = document.getElementById("enemyScore");
var newChickBox: HTMLElement = document.getElementById("newChickBox");
var newThiefBox: HTMLElement = document.getElementById("newThiefBox");
var biledemon: Bile;
var chickenInst: chicken;
var thiefInst: Thief;
var chaseFlag: boolean = true;

function begin() {
    biledemon = new Bile();
    chickenInst = new chicken();
    thiefInst = new Thief();
    setInterval(update, 50);
    modal.style.display = "none";
}
function update() {
    KeysMoveCheck(biledemon);
    setMovingFlag(biledemon);
    setPicAndSound(biledemon);
    collisionCheck(biledemon, chickenInst);
    fightCheck(biledemon);
    // setMovingFlag(thiefInst);
    // setPicAndSound(thiefInst);
    if (chaseFlag) {
        chase(thiefInst, chickenInst);
        collisionCheck(thiefInst, chickenInst);
    }
}
function chase(chaser: Thief, target: chicken) {  //Combine CHASE with COLLISION CHECK
    if (chaser.stunFlag){
        chaser.stopNoise();
        return
    };
    setMovingFlag(chaser);
    setPicAndSound(chaser);
    clearMovingFlags(chaser)
    var collisionCheckFlag = true;
    if (!colCheckLeft(chaser, target)) {
        moveLeft(chaser);
        collisionCheckFlag = false;
    }
    if (!colCheckRight(chaser, target)) {
        moveRight(chaser);
        collisionCheckFlag = false;
    }
    if (!colCheckUp(chaser, target)) {
        moveUp(chaser);
        collisionCheckFlag = false;
    }
    if (!colCheckDown(chaser, target)) {
        moveDown(chaser);
        collisionCheckFlag = false;
    }
    if (collisionCheckFlag == true){
        
    }
}

function getRandomScreenPosition() {
    var randomPosition = {
        randomLeft: 0,
        randomTop: 0
    };
    randomPosition.randomLeft = 40 + Math.round(Math.random() * (screen.width - 100));
    randomPosition.randomTop = 80 + Math.round(Math.random() * (screen.height - 200));
    return randomPosition
}



function chickenCollisionFunction(objectInst, cheat) {
    var myClass = objectInst.constructor.name;
    if (myClass == 'Bile') {
        if (objectInst.movementFlags.eatFlag == false || cheat == true) {
            objectInst.eatChick();
            chickenInst.perish(objectInst);
            chickenInst = new chicken();
     //       chaseFlag = true;
        }
    }
    else if (myClass == 'Thief') {
        if (  objectInst.stunFlag == false){
        objectInst.eatChick();
        chickenInst.perish(objectInst);
        chickenInst = new chicken();
 //       chaseFlag = false;
     //   objectInst.stopMoving();
        }
    }
}

function setStyleVal(elem, prop, newVal) {
    elem.style[prop] = newVal + "px";
}
function getStyleVal(elem, prop) {
    if (!elem.style[prop]) {
        return 0;
    }
    return parseInt(elem.style[prop]);
}

function setPicAndSound(objectInst: Bile | Thief) {
    var movementFlags = objectInst.movementFlags;
    if (movementFlags.eatFlag == true) { return };
    if (movementFlags.oldFlag != movementFlags.movingFlag) {
        if (movementFlags.movingFlag == "") {
            objectInst.stopMoving();
        }
        else objectInst.startMoving();
    }
}

function finishEatingSetPic(objectInst) {
    var myClass = objectInst.constructor.name;
    var movementFlags = objectInst.movementFlags;
    objectInst.domElement.setAttribute("src", `${myClass} gifs/${myClass}_eat.gif`);

    movementFlags.eatFlag = true;
    setTimeout(function () {
        movementFlags.eatFlag = false
        if (movementFlags.movingFlag == "") {
            objectInst.stopMoving()
            objectInst.domElement.setAttribute("src", `${myClass} gifs/frames/${myClass}_SE frame.gif`);
        }
        else {
            objectInst.startMoving();//Attempt to change from eating pic. Bad idea
        }
    }, 1200);
}
function fightCheck(objectInst) {
    if (keys[50]) {
        fightSetPic(objectInst);
        objectInst.startFighting();
    }
}
function fightSetPic(objectInst){
 //   objectInst.fightFlag = false;
    var myClass = objectInst.constructor.name;
    var movementFlags = objectInst.movementFlags;
    objectInst.domElement.setAttribute("src", `${myClass} gifs/fight/${myClass}_fight_${movementFlags.movingFlag}.gif`);
}

function shaiCheatPlusTen() {
    biledemon.chickensEaten += 10;
   // chicken.chickCount += 10;
}
function refreshChickCounter() {
    playerScore.innerHTML = "" + biledemon.chickensEaten;//chicken.chickCount;
    enemyScore.innerHTML = "" + thiefInst.chickensEaten;
}