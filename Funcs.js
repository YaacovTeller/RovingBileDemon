var modal = document.getElementById("bileModal");
var playerScore = document.getElementById("playerScore");
var enemyScore = document.getElementById("enemyScore");
var newChickBox = document.getElementById("newChickBox");
var newEnemyBox = document.getElementById("newEnemyBox");
var biledemon;
var chickenInst;
var enemyInst;
var enemyArray = [];
var dungeon = document.getElementById("dungeon");
function begin() {
    biledemon = new Bile();
    chickenInst = new chicken();
    spawnEnemy(Enemy);
    setInterval(update, 50);
    modal.style.display = "none";
}
function spawnEnemy(enemyClass) {
    enemyInst = new enemyClass();
    enemyArray.push(enemyInst);
}
function update() {
    KeysMoveCheck(biledemon); //handles actual movement
    setMovingFlag(biledemon); //ascertains compass direction
    setPicAndSound(biledemon); //handles gif direction
    allEnemyDecisions();
    if (collisionCheck(biledemon, chickenInst)) {
        chickenCollisionFunction(biledemon, false); //only true for 'cheat'!
    }
    ;
    for (let i = 0; i < enemyArray.length; i++) {
        let enemy = enemyArray[i];
        if (!enemy.pulseCheck())
            continue; ///// NEEDED??
        if (collisionCheck(enemyArray[i], chickenInst)) {
            chickenCollisionFunction(enemyArray[i], false);
        }
        ;
        if (collisionCheck(enemy, biledemon)) {
            if (biledemon.pulseCheck()) {
                enemy.fight(); //// called from here?
            }
        }
        ;
    }
}
function allEnemyDecisions() {
    for (let i = 0; i < enemyArray.length; i++) {
        let enemy = enemyArray[i];
        if (!enemy.pulseCheck())
            continue; //// NEEDED??
        enemy.considerIntent();
        switch (enemy.intent) {
            case intents.loiter:
                enemy.loiter();
                break;
            case intents.persue:
                if (biledemon.pulseCheck()) {
                    chase(enemy, biledemon);
                }
                break;
            case intents.seekFood:
                chase(enemy, chickenInst);
                break;
            default:
                break;
        }
    }
}
function chase(chaser, target) {
    if (!chaser.anyActionCheck()) {
        //  chaser.stopNoise();
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
        console.log(chaser.constructor.name + " collided!");
    }
}
function getRandomScreenPosition(top, left) {
    let randomPosition = {
        left: 0,
        top: 0
    };
    if (top) {
        randomPosition.left = Math.round(Math.random()) == 1 ? left + 10 : left - 10;
        randomPosition.top = Math.round(Math.random()) == 1 ? top + 10 : top - 10;
    }
    else {
        randomPosition.left = 40 + Math.round(Math.random() * (screen.width - 100));
        randomPosition.top = 80 + Math.round(Math.random() * (screen.height - 200));
    }
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
    if (!objectInst.anyActionCheck()) {
        return;
    }
    ; ////////////////////// FIX?
    var movementFlags = objectInst.movementFlags;
    if (movementFlags.oldFlag != movementFlags.movingFlag) {
        if (movementFlags.movingFlag == "") {
            objectInst.stopMoving();
        }
        else
            objectInst.startMoving();
    }
}
function actionTimeout(objectInst, action) {
    if (!objectInst.anyActionCheck()) {
        return;
    }
    ; ////////////////////// FIX?
    objectInst.activity[action] = true;
    var myClass = objectInst.charType ? objectInst.charType.name : objectInst.constructor.name;
    var movementFlags = objectInst.movementFlags;
    let direction = action == activity_strings.eat ? "" : movementFlags.facing;
    let img = objectInst.domElement;
    img.setAttribute("src", `${myClass} gifs/${myClass}_${action}_${direction}.gif`);
    img.onerror = () => img.src = `${myClass} gifs/${myClass}_${action}.gif`; //"Pics/flame.gif";
    setTimeout(() => {
        objectInst.activity[action] = false;
        if (movementFlags.movingFlag == "") {
            objectInst.stopMoving();
            objectInst.domElement.src = `${myClass} gifs/frames/${myClass}_${movementFlags.facing} frame.gif`;
        }
        else {
            objectInst.startMoving(); //Attempt to change from eating pic. Better implementation?
        }
    }, 1200);
}
function eatTimeout(objectInst) {
    actionTimeout(objectInst, activity_strings.eat);
}
function fightTimeout(objectInst) {
    actionTimeout(objectInst, activity_strings.fight);
}
function deathTimeout(objectInst) {
    actionTimeout(objectInst, activity_strings.die); // CREATE NEW DEATH TIMEOUT
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
    if (enemyInst) {
        refreshIndivChickCounter(enemyScore, enemyInst.chickensEaten);
    }
}
