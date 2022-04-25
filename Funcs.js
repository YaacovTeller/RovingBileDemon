var modal = document.getElementById("bileModal");
var playerScore = document.getElementById("playerScore");
var enemyScore = document.getElementById("enemyScore");
var newChickBox = document.getElementById("newChickBox");
var newThiefBox = document.getElementById("newThiefBox");
var biledemon;
var chickenInst;
var thiefInst;
var enemyArray = [];
var dungeon = document.getElementById("dungeon");
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
    }
    ;
    for (var i = 0; i < enemyArray.length; i++) {
        var _this = enemyArray[i];
        _this.considerIntent();
        if (_this.intent == 'pursue') {
            chase(_this, biledemon);
            if (collisionCheck(_this, biledemon)) {
                _this.fight();
            }
            ;
        }
        else if (enemyArray[i].intent == 'eat') {
            chase(enemyArray[i], chickenInst);
            if (collisionCheck(enemyArray[i], chickenInst)) {
                chickenCollisionFunction(enemyArray[i], false);
            }
            ;
        }
    }
}
function chase(chaser, target) {
    if (chaser.stunFlag) {
        chaser.stopNoise();
        return;
    }
    ;
    setMovingFlag(chaser);
    setPicAndSound(chaser);
    clearMovingFlags(chaser);
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
    return randomPosition;
}
function chickenCollisionFunction(objectInst, cheat) {
    if (objectInst.canEatAnotherChickenCheck(cheat)) {
        genericChickenCollision(objectInst);
    }
}
function genericChickenCollision(objectInst) {
    objectInst.eatChick();
    chickenInst.perish(objectInst);
    chickenInst = new chicken();
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
function setPicAndSound(objectInst) {
    var movementFlags = objectInst.movementFlags;
    if (movementFlags.eatFlag == true) {
        return;
    }
    ;
    if (movementFlags.oldFlag != movementFlags.movingFlag) {
        if (movementFlags.movingFlag == "") {
            objectInst.stopMoving();
        }
        else
            objectInst.startMoving();
    }
}
function actionTimeout(objectInst, action) {
    var myClass = objectInst.constructor.name;
    var movementFlags = objectInst.movementFlags;
    var direction = action == "eat" ? "" : movementFlags.facing;
    objectInst.domElement.setAttribute("src", myClass + " gifs/" + myClass + "_" + action + "_" + direction + ".gif");
    movementFlags.eatFlag = true;
    setTimeout(function () {
        movementFlags.eatFlag = false;
        if (movementFlags.movingFlag == "") {
            objectInst.stopMoving();
            objectInst.domElement.setAttribute("src", myClass + " gifs/frames/" + myClass + "_" + movementFlags.facing + " frame.gif");
        }
        else {
            objectInst.startMoving(); //Attempt to change from eating pic. Bad idea
        }
    }, 1200);
}
function eatTimeout(objectInst) {
    actionTimeout(objectInst, "eat");
}
function fightTimeout(objectInst) {
    actionTimeout(objectInst, "fight");
}
function deathTimeout(objectInst) {
    actionTimeout(objectInst, "die"); // CREATE NEW DEATH TIMEOUT
}
function shaiCheatPlusTen() {
    biledemon.chickensEaten += 10;
    // chicken.chickCount += 10;
}
function refreshIndivChickCounter(counter, num) {
    counter.innerHTML = "" + num;
}
function refreshChickCounter() {
    refreshIndivChickCounter(playerScore, biledemon.chickensEaten);
    if (thiefInst) {
        refreshIndivChickCounter(enemyScore, thiefInst.chickensEaten);
    }
}
