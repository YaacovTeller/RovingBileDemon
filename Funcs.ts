var modal = document.getElementById("bileModal");
var playerScore = document.getElementById("playerScore");
var enemyScore = document.getElementById("enemyScore");
var newChickBox: HTMLElement = document.getElementById("newChickBox");
var newThiefBox: HTMLElement = document.getElementById("newThiefBox");
var biledemon: Bile;
var chickenInst: chicken;
var thiefInst: Thief;
var enemyArray: Array<movingSprite> = [];

function begin() {
    biledemon = new Bile();
    chickenInst = new chicken();
    spawnEnemy(Thief);
    setInterval(update, 50);
    modal.style.display = "none";
}
function spawnEnemy(enemyClass) {
    thiefInst = new enemyClass();
    enemyArray.push(thiefInst);
}
function update() {
    KeysMoveCheck(biledemon); //handles actual movement
    setMovingFlag(biledemon); //ascertains compass direction
    setPicAndSound(biledemon); //handles gif direction
    if (collisionCheck(biledemon, chickenInst)) {
        chickenCollisionFunction(biledemon, false); //only true for 'cheat'!
    };
    for (let i = 0; i < enemyArray.length; i++) {
        enemyArray[i].considerIntent();
        if (enemyArray[i].intent == 'pursue') {
            chase(enemyArray[i], biledemon);
            collisionCheck(enemyArray[i], biledemon);
        }
        else if (enemyArray[i].intent == 'eat') {
            chase(enemyArray[i], chickenInst);
            if (collisionCheck(enemyArray[i], chickenInst)) {
                chickenCollisionFunction(enemyArray[i], false);
            };
        }
    }
}
function chase(chaser: movingSprite, target: chicken | movingSprite) {  //Combine CHASE with COLLISION CHECK
    if (chaser.stunFlag) {
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
    if (collisionCheckFlag == true) {

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
        }
    }
    else if (myClass == 'Thief') {
        if (objectInst.stunFlag == false) {
            objectInst.eatChick();
            chickenInst.perish(objectInst);
            chickenInst = new chicken();
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

function setPicAndSound(objectInst: Bile | Thief | movingSprite) {
    var movementFlags = objectInst.movementFlags;
    if (movementFlags.eatFlag == true) { return };
    if (movementFlags.oldFlag != movementFlags.movingFlag) {
        if (movementFlags.movingFlag == "") {
            objectInst.stopMoving();
        }
        else objectInst.startMoving();
    }
}

function actionTimeout(objectInst, action) {
    var myClass = objectInst.constructor.name;
    var movementFlags = objectInst.movementFlags;
    let direction = action == "eat" ? "" : movementFlags.facing;
    objectInst.domElement.setAttribute("src", `${myClass} gifs/${myClass}_${action}_${direction}.gif`);

    movementFlags.eatFlag = true
    setTimeout(() => {
        movementFlags.eatFlag = false
        if (movementFlags.movingFlag == "") {
            objectInst.stopMoving()
            objectInst.domElement.setAttribute("src", `${myClass} gifs/frames/${myClass}_${movementFlags.facing} frame.gif`);
        }
        else {
            objectInst.startMoving();//Attempt to change from eating pic. Bad idea
        }
    }, 1200);
}
function eatTimeout(objectInst) {
    actionTimeout(objectInst, "eat")
}
function fightTimeout(objectInst) {
    actionTimeout(objectInst, "fight");
}

function shaiCheatPlusTen() {
    biledemon.chickensEaten += 10;
    // chicken.chickCount += 10;
}
function refreshChickCounter() {
    playerScore.innerHTML = "" + biledemon.chickensEaten;//chicken.chickCount;
    enemyScore.innerHTML = "" + thiefInst.chickensEaten;
}