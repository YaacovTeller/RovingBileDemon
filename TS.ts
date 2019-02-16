var pic;
var bileD = document.getElementById("bileD");
var biledemon: bile;
var chickenInst: chicken;
var chick;
let num: number = 1;
let step: number = 5;
let eatFlag: boolean = false;

let upMovement: boolean = false;
let downMovement: boolean = false;
let rightMovement: boolean = false;
let leftMovement: boolean = false;
let movingFlag: string = ""
let oldFlag: string = ""

function sound(src: string) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    //   this.sound.setAttribute("loop", "infinite");  For a sort of macabre doom-rap experience
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}
var BileMove1 = new sound("Sound/BIGFOOT1.WAV");
var BileMove2 = new sound("Sound/BIGFOOT2.WAV");
var BileReady = new sound("Sound/HORNDROP.WAV");
var BileHappy = new sound("Sound/HORNHAPY.WAV");
var BileDie = new sound("Sound/HORNDIE1.WAV");

var Chick1 = new sound("Sound/CHICK1A.WAV");
var Chick2 = new sound("Sound/CHICK1B.WAV");
var Chick3 = new sound("Sound/CHICK1C.WAV");
var Chick4 = new sound("Sound/CHICK1D.WAV");
var Chick5 = new sound("Sound/CHICK1E.WAV");
var Chick6 = new sound("Sound/CHICK1F.WAV");

var Fart1 = new sound("Sound/FART1.WAV");
var Fart2 = new sound("Sound/FART2.WAV");
var Fart3 = new sound("Sound/FART3.WAV");
var Fart4 = new sound("Sound/FART4.WAV");
var Fart5 = new sound("Sound/FART5.WAV");
var Fart6 = new sound("Sound/FART6.WAV");
var ChickDie1 = new sound("Sound/CHICK4A.WAV");
var ChickDie2 = new sound("Sound/CHICK4B.WAV");

BileMove1.sound.setAttribute("loop", "infinite");

window.onload = function GameStart() {
    biledemon = new bile;
    BileReady.play();
    pic = bileD;
    step = biledemon.speed;
    options.resetSpeed();
    chickenInst = new chicken;
    chickenInst.draw();
    chickenInst.cluck();
    setInterval(update, 50);
}

abstract class sprite {
    abstract draw();
}
class bile extends sprite {
    girth = bileD.clientWidth;
    speed = 15;
    public eatChick() {
        pic.setAttribute("src", `Pics/bile_eat.gif`);
        eatFlag = true;
        setTimeout(function () { eatFlag = false }, 500);
        biledemon.girth += 10;
        pic.style.width = `${biledemon.girth}px`;
        this.speed += 2;
        step = this.speed;
        options.resetSpeed();
    }
    public draw() { }
}
class chicken extends sprite {
    static chickCount = 0;
    public myCluck;
    public draw() {
        chicken.chickCount++;
        var randomLeft = 40 + Math.round(Math.random() * (screen.width - 100));
        var randomTop = 80 + Math.round(Math.random() * (screen.height - 200));
        var newChick = `<img id="chick${chicken.chickCount}" src="Pics/chicken.gif" style="position:absolute; top:${randomTop}px; left:${randomLeft}px" />`;
        document.getElementById("test").innerHTML += newChick;
        chick = document.getElementById(`chick${chicken.chickCount}`);
    }
    public chickSounds() {
        num = Math.floor(Math.random() * (6) + 1);
        if (num == 1) { Chick1.play() }
        else if (num == 2) { Chick2.play() }
        else if (num == 3) { Chick3.play() }
        else if (num == 4) { Chick4.play() }
        else if (num == 5) { Chick5.play() }
        else if (num == 6) { Chick6.play() }
    }
    public cluck() { this.myCluck = setInterval(this.chickSounds, 2500); }
    public perish() {
        ChickDie1.play();
        chick.style.display = "none";
    }
}


function chickenCollisionCheck() {
    // move down
    if (parseInt(pic.style.top) + pic.clientHeight >= parseInt(chick.style.top)
        //  move right
        && parseInt(pic.style.left) + pic.clientWidth >= parseInt(chick.style.left)
        //  move up
        && parseInt(pic.style.top) + (pic.clientHeight / 2) <= parseInt(chick.style.top) + chick.clientHeight
        //  move left
        && parseInt(pic.style.left) <= parseInt(chick.style.left) + chick.clientWidth
    ) {
        biledemon.eatChick();
        chickenInst.perish();
        chickenInst.draw();
        // eatFlag = true;
        // clearInterval(chSo);
        // pic.style.height*=100;
        // pic.style.height=500;
        // pic.style.width=`biledemon.girth`;
        // pic.style.transform=`scale(${biledemon.girth})`;
    }
}
var options = {
    resetSpeed() {
        options.step = step;
        options.stepBack = -step;
    },
    step: step,
    stepBack: -step,
    top: 'top',
    left: 'left',
};

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
function Move(elem, prop, step) {
    BileMove1.play()
    oldVal = getStyleVal(elem, prop);
    newVal = oldVal + step;
    setStyleVal(elem, prop, newVal);
}
function moveLeft(elem) {
    oldVal = getStyleVal(elem, options.left);
    if (oldVal > 40 - elem.width / 3) {
        Move(elem, options.left, options.stepBack);
    }
}
function moveRight(elem) {
    oldVal = getStyleVal(elem, options.left);
    if (oldVal < screen.width - 200) {
        Move(elem, options.left, options.step);
    }
}
function moveUp(elem) {
    oldVal = getStyleVal(elem, options.top);
    if (oldVal > 5000 / elem.height) {
        Move(elem, options.top, options.stepBack);
    }
}
function moveDown(elem) {
    oldVal = getStyleVal(elem, options.top);
    if (oldVal + elem.height < screen.height - 100) {
        Move(elem, options.top, options.step);
    }
}
function setMovingFlag() {
    movingFlag = "";
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
}
function setPic() {
    if (eatFlag == false) {
        if (oldFlag != movingFlag) {
            if (movingFlag == "") {
                BileMove1.stop()
                pic.setAttribute("src", `Bile gifs/Bile_${oldFlag} frames/1.gif`)
            }
            else pic.setAttribute("src", `Bile gifs/Bile_${movingFlag}.gif`)
        }
    }
}
function moveCheck() {
    oldFlag = movingFlag;
    if (keys[37]) {
        moveLeft(pic)
        leftMovement = true;
    }
    else leftMovement = false;
    if (keys[38]) {
        moveUp(pic)
        upMovement = true;
    }
    else upMovement = false;
    if (keys[39]) {
        moveRight(pic)
        rightMovement = true;
    }
    else rightMovement = false;
    if (keys[40]) {
        moveDown(pic)
        downMovement = true;
    }
    else downMovement = false;
}
function update() {
    chickenCollisionCheck();
    moveCheck();
    setMovingFlag();
    setPic();
}

var keys = [];
window.addEventListener('keydown', function (e) {
    keys = (keys || []);
    keys[e.keyCode] = true;
    keyCommands(e);
    if (e.keyCode == 49) {
        Fart1.play();
  //      BileDie.play();
    }
})
window.addEventListener('keyup', function (e) {
    keys[e.keyCode] = false;
})

function keyCommands(e: KeyboardEvent) {
    if (e.keyCode == 49) {
        Fart1.play();
    }
    else if (e.key === "2") {
        Fart2.play();
    }
    else if (e.key === "3") {
        Fart3.play();
    }
    else if (e.key === "4") {
        Fart4.play();
    }
    else if (e.key === "5") {
        Fart5.play();
    }
    else if (e.key === "6") {
        Fart6.play();
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