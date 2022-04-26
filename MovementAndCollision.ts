var oldVal;
var newVal;
enum EOptions  {
    top= 'top',
    left= 'left',
};
function moveLeft(object) {
    oldVal = getStyleVal(object.domElement, EOptions.left);
    if (oldVal > 40 - object.domElement.width / 3) {
        Move(object.domElement, EOptions.left, -object.speed);
        object.movementFlags.leftMovement = true;
    }
}
function moveRight(object) {
    oldVal = getStyleVal(object.domElement, EOptions.left);
    if (oldVal < screen.width - object.domElement.width) {   //-200
        Move(object.domElement, EOptions.left, object.speed);
        object.movementFlags.rightMovement = true;
    }
}
function moveUp(object) {
    oldVal = getStyleVal(object.domElement, EOptions.top);
    if (oldVal > 5000 / object.domElement.height) {
        Move(object.domElement, EOptions.top, -object.speed);
        object.movementFlags.upMovement = true;
    }
}
function moveDown(object) {
    oldVal = getStyleVal(object.domElement, EOptions.top);
    if (oldVal + object.domElement.height < screen.height - 100) {
        Move(object.domElement, EOptions.top, object.speed);
        object.movementFlags.downMovement = true;
    }
}
function Move(elem, prop, step) {
    oldVal = getStyleVal(elem, prop);
    newVal = oldVal + step;
    setStyleVal(elem, prop, newVal);
}

function setMovingFlag(objectInst: movingSprite) {
    objectInst.movementFlags.oldFlag = objectInst.movementFlags.movingFlag;
    var oldFlag = objectInst.movementFlags.oldFlag;
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
    objectInst.movementFlags.facing = oldFlag != "" ? oldFlag : objectInst.movementFlags.facing
    return movingFlag;
}

function clearMovingFlags(object){
    object.movementFlags.downMovement = false;
    object.movementFlags.upMovement = false;
    object.movementFlags.leftMovement = false;
    object.movementFlags.rightMovement = false;
}

function domElementInfo(obj, request) {
    return getStyleVal(obj.domElement, request);
}
function domElementPos(obj, request){
    var info: number;
    if (request=='height'){
        info = obj.domElement.clientHeight;
    }
    else if (request=='width'){
        info = obj.domElement.clientWidth;
    }
    return info;
}

function colCheckLeft(chaser, target){
    if (domElementInfo(chaser, 'left') > domElementInfo(target, 'left') + domElementPos(target, 'width')){ //FIX /2
        return false;
    }
    else return true;
}
function colCheckRight(chaser, target){
    var widthAdjust: number = chaser.widthAdjust;
    if (domElementInfo(chaser, 'left') + domElementPos(chaser, 'width') / widthAdjust <= domElementInfo(target,'left')){
        return false;
    }
    else return true;
}
function colCheckUp(chaser, target){
    var heightAdjust: number = chaser.heightAdjust;
    if (domElementInfo(chaser,'top') + (domElementPos(chaser, 'height') / heightAdjust) > domElementInfo(target, 'top') + domElementPos(target, 'height')/5){
        return false;
    }
    else return true;
}
function colCheckDown(chaser, target){
    if (domElementInfo(chaser, 'top') + domElementPos(chaser, 'height') < domElementInfo(target, 'top') + domElementPos(target, 'height')/2){
        return false;
    }
    else return true;
}

function collisionCheck(objectInst, target) {
    if (colCheckLeft(objectInst, target) && colCheckRight(objectInst, target) &&
          colCheckUp(objectInst, target) && colCheckDown(objectInst, target)) {
        return true;
    }
}