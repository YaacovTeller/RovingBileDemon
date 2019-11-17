var modal = document.getElementById("bileModal");
var playerScore = document.getElementById("playerScore");
var enemyScore = document.getElementById("enemyScore");
var keyMoved_object;
// var keyMoved_element: HTMLElement;
var newChickBox: HTMLElement = document.getElementById("newChickBox");
var newThiefBox: HTMLElement = document.getElementById("newThiefBox");
var biledemon: Bile;
var chickenInst: chicken;
var thiefInst: Thief;

var chaseFlag: boolean = true;

// window.onload = function GameStart() {
//     biledemon = new bile;
//     setTimeout(function () { BileReady.play() }, 1000);
//     pic = bileD;
//     step = biledemon.speed;
//     options.resetSpeed();
//     chickenInst = new chicken;
//     chickenInst.draw();
//     chickenInst.cluck();
//     setInterval(update, 50);
// }

function begin() {
    biledemon = new Bile;
    keyMoved_object = biledemon;
    //   keyMoved_element = biledemon.domElement;
    chickenInst = new chicken;
    thiefInst = new Thief;
    setInterval(update, 50);
    modal.style.display = "none";
}
function update() {
    KeysMoveCheck(biledemon);
    setMovingFlag(biledemon);
    setPicAndSound(biledemon);
    collisionCheck(biledemon, chickenInst);
    // setMovingFlag(thiefInst);
    // setPicAndSound(thiefInst);
    if (chaseFlag) {
        chase(thiefInst, chickenInst);
        collisionCheck(thiefInst, chickenInst);
    }
}
function chase(chaser: Thief, target: chicken) {
    //chaser.startNoise(); //// BAD PRACTICE?? ONLY BY MOVEMENT?
    if (chaser.stunFlag){
        chaser.stopNoise();
        return
    };
    setMovingFlag(chaser);
    setPicAndSound(chaser);
    var targetLeft = parseInt(target.domElement.style.left);
    var targetWidth = target.domElement.clientWidth;
    var targetTop = parseInt(target.domElement.style.top);
    var targetHeight = target.domElement.clientHeight;
    var chaserLeft = parseInt(chaser.domElement.style.left);
    var chaserWidth = chaser.domElement.clientWidth;
    var chaserTop = parseInt(chaser.domElement.style.top);
    var chaserHeight = chaser.domElement.clientHeight;
    if (targetLeft + targetWidth/4 < chaserLeft) {
        moveLeft(chaser);
        chaser.movementFlags.leftMovement = true;   //SHould call a class function to change internally
    }
    else chaser.movementFlags.leftMovement = false; //Needs work
    if (targetLeft >= chaserLeft+chaserWidth/2) {
        moveRight(chaser);
        chaser.movementFlags.rightMovement = true;
    }
    else chaser.movementFlags.rightMovement = false;
    if (targetTop + targetHeight/4 < chaserTop) {
        moveUp(chaser);
        chaser.movementFlags.upMovement = true;
    }
    else chaser.movementFlags.upMovement = false;
    if (targetTop >= chaserTop+chaserHeight) {
        moveDown(chaser);
        chaser.movementFlags.downMovement = true;
    }
    else chaser.movementFlags.downMovement = false;
}
function stepSounds() {
    let num: number = Math.floor(Math.random() * (4) + 1);
    if (num == 1) { Foot1.play() }
    else if (num == 2) { Foot2.play() }
    else if (num == 3) { Foot3.play() }
    else if (num == 4) { Foot4.play() }
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

function collisionCheck(objectInst, target) {
    var heightAdjust: number = objectInst.heightAdjust;
    // move down
    if (parseInt(objectInst.domElement.style.top) + objectInst.domElement.clientHeight >= parseInt(target.domElement.style.top)
        //  move right
        && parseInt(objectInst.domElement.style.left) + objectInst.domElement.clientWidth >= parseInt(target.domElement.style.left)
        //  move up
        && parseInt(objectInst.domElement.style.top) + (objectInst.domElement.clientHeight / heightAdjust) <= parseInt(target.domElement.style.top) + target.domElement.clientHeight
        //  move left
        && parseInt(objectInst.domElement.style.left) <= parseInt(target.domElement.style.left) + target.domElement.clientWidth
    ) {
        if(target.constructor.name == 'chicken') {
            chickenCollisionFunction(objectInst, false); //only true for 'cheat'!
        }
        return true;
    }
}
var options = {
    // resetSpeed(speed) {
    //     options.step = speed;
    //     options.stepBack = -speed;
    // },
    // step: step,
    // stepBack: -step,
    top: 'top',
    left: 'left',
};
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
var oldVal;
var newVal;

function moveLeft(object) {
    oldVal = getStyleVal(object.domElement, options.left);
    if (oldVal > 40 - object.domElement.width / 3) {
        Move(object.domElement, options.left, -object.speed);
    }
}
function moveRight(object) {
    oldVal = getStyleVal(object.domElement, options.left);
    if (oldVal < screen.width - object.domElement.width) {   //-200
        Move(object.domElement, options.left, object.speed);
    }
}
function moveUp(object) {
    oldVal = getStyleVal(object.domElement, options.top);
    if (oldVal > 5000 / object.domElement.height) {
        Move(object.domElement, options.top, -object.speed);
    }
}
function moveDown(object) {
    oldVal = getStyleVal(object.domElement, options.top);
    if (oldVal + object.domElement.height < screen.height - 100) {
        Move(object.domElement, options.top, object.speed);
    }
}
function Move(elem, prop, step) {
    oldVal = getStyleVal(elem, prop);
    newVal = oldVal + step;
    setStyleVal(elem, prop, newVal);
}

function setMovingFlag(objectInst: movingSprite) {
    objectInst.movementFlags.oldFlag = objectInst.movementFlags.movingFlag;
    var movingFlag = objectInst.movementFlags.movingFlag = "";
    var leftMovement = objectInst.movementFlags.leftMovement;
    var upMovement = objectInst.movementFlags.upMovement;
    var rightMovement = objectInst.movementFlags.rightMovement;
    var downMovement = objectInst.movementFlags.downMovement;

    if (leftMovement == true) {
        if (upMovement == true) { movingFlag = "NW" }
        else if (downMovement == true) { movingFlag = "SW" }
        else movingFlag = "W"
    }
    if (upMovement == true) {
        if (leftMovement == true) { movingFlag = "NW" }
        else if (rightMovement == true) { movingFlag = "NE" }
        else movingFlag = "N"
    }
    if (rightMovement == true) {
        if (upMovement == true) { movingFlag = "NE" }
        else if (downMovement == true) { movingFlag = "SE" }
        else movingFlag = "E"
    }
    if (downMovement == true) {
        if (leftMovement == true) { movingFlag = "SW" }
        else if (rightMovement == true) { movingFlag = "SE" }
        else movingFlag = "S"
    }
    objectInst.movementFlags.movingFlag = movingFlag;
    return movingFlag;
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
    // else {
    //     if (movementFlags.movingFlag == "") {
    //         objectInst.stopMoving();
    //     }
    // }
}

function finishEatingSetPic(objectInst) {////   make generic  ////
    var myClass = objectInst.constructor.name;
    var movementFlags = objectInst.movementFlags;
    objectInst.domElement.setAttribute("src", `${myClass} gifs/${myClass}_eat.gif`);
  //  var trueHeight = parseInt(biledemon.domElement.style.height);
    // biledemon.domElement.style.left = parseInt(biledemon.domElement.style.left) + 15 +"px";
    // biledemon.height = biledemon.height * 0.9;
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
        //    biledemon.domElement.style.left = parseInt(biledemon.domElement.style.left) - 50 +"px";
        //      biledemon.height = biledemon.height / 0.9;
    }, 1200);
}

function KeysMoveCheck(objectInst: movingSprite) {
    var movementFlags = objectInst.movementFlags;
    movementFlags.oldFlag = movementFlags.movingFlag;
    if (keys[37]) {
        moveLeft(objectInst)
        movementFlags.leftMovement = true;
    }
    else movementFlags.leftMovement = false;
    if (keys[38]) {
        moveUp(objectInst)
        movementFlags.upMovement = true;
    }
    else movementFlags.upMovement = false;
    if (keys[39]) {
        moveRight(objectInst)
        movementFlags.rightMovement = true;
    }
    else movementFlags.rightMovement = false;
    if (keys[40]) {
        moveDown(objectInst)
        movementFlags.downMovement = true;
    }
    else movementFlags.downMovement = false;
    objectInst.movementFlags = movementFlags;
}

function shaiCheatPlusTen() {
    biledemon.chickensEaten += 10;
   // chicken.chickCount += 10;
}
function refreshChickCounter() {
    playerScore.innerHTML = "" + biledemon.chickensEaten;//chicken.chickCount;
    enemyScore.innerHTML = "" + thiefInst.chickensEaten;
}