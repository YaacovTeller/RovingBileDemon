var modal = document.getElementById("bileModal");
var playerScore = document.getElementById("playerScore");
var enemyScore = document.getElementById("enemyScore");
var newChickBox: HTMLElement = document.getElementById("newChickBox");
var newThiefBox: HTMLElement = document.getElementById("newThiefBox");
var biledemon: Bile;
var chickenInst: chicken;
var thiefInst: Thief;
var enemyArray: Array<movingSprite> = [];
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
    };
    allEnemyDecisions();
}
function allEnemyDecisions(){
    for (let i = 0; i < enemyArray.length; i++) {
        let _this = enemyArray[i];
        if(_this.activity.dead) continue
        _this.considerIntent();
        if (_this.intent == intents.persue) {
            if (biledemon.activity.dying == false && biledemon.activity.dead == false){ // Put in SPRITE CLASS
                chase(_this, biledemon);
                if (collisionCheck(_this, biledemon)) {
                    _this.fight();
                };
            }
            else {
                _this.intent = intents.loiter;
            }
        }
        else if (enemyArray[i].intent == intents.seekFood) {
            chase(enemyArray[i], chickenInst);
            if (collisionCheck(enemyArray[i], chickenInst)) {
                chickenCollisionFunction(enemyArray[i], false);
            };
        }
    }
}
function chase(chaser: movingSprite, target: chicken | movingSprite) {  //Combine CHASE with COLLISION CHECK
    if (!chaser.freeMovementCheck() || chaser.activity.eat || chaser.activity.fight) {
      //  chaser.stopNoise();
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

function chickenCollisionFunction(objectInst: Thief | Bile | movingSprite, cheat) {
    if (objectInst.canEatAnotherChickenCheck(cheat)){
        genericChickenCollision(objectInst);
    }
}
function genericChickenCollision(objectInst){
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

function setPicAndSound(objectInst: Bile | Thief | movingSprite) {
    if (!objectInst.anyActionCheck()) { return };  ////////////////////// FIX?
    var movementFlags = objectInst.movementFlags;
    if (movementFlags.oldFlag != movementFlags.movingFlag) {
        if (movementFlags.movingFlag == "") {
            objectInst.stopMoving();
        }
        else objectInst.startMoving();
    }
}

function actionTimeout(objectInst: movingSprite, action) {
    if (!objectInst.anyActionCheck()) { return };  ////////////////////// FIX?
    objectInst.activity[action] = true;
    var myClass = objectInst.constructor.name;
    var movementFlags = objectInst.movementFlags;
    let direction = action == activity_strings.eat ? "" : movementFlags.facing;
    objectInst.domElement.setAttribute("src", `${myClass} gifs/${myClass}_${action}_${direction}.gif`);

    setTimeout(() => {
        objectInst.activity[action] = false;
        if (movementFlags.movingFlag == "") {
            objectInst.stopMoving()
            objectInst.domElement.setAttribute("src", `${myClass} gifs/frames/${myClass}_${movementFlags.facing} frame.gif`);
        }
        else {
            objectInst.startMoving(); //Attempt to change from eating pic. Better implementation?
        }
    }, 1200);
}
function eatTimeout(objectInst) {
    actionTimeout(objectInst, activity_strings.eat)
}
function fightTimeout(objectInst) {
    actionTimeout(objectInst, activity_strings.fight);
}
function deathTimeout(objectInst){
    actionTimeout(objectInst, activity_strings.die); // CREATE NEW DEATH TIMEOUT
}

function shaiCheatPlusTen() {
    biledemon.chickensEaten += 10;
    // chicken.chickCount += 10;
}
function refreshIndivChickCounter(counter: HTMLElement, num: number){
    counter.innerHTML = "" + num;
}
function refreshChickCounter() {
    refreshIndivChickCounter(playerScore, biledemon.chickensEaten);
    if (thiefInst) {
        refreshIndivChickCounter(enemyScore, thiefInst.chickensEaten);
    }
}