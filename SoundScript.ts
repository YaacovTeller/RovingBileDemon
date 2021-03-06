
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
var BileDie   = new sound("Sound/HORNDIE1.WAV");

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

var Foot1 = new sound("Sound/FOOT1A.WAV");
var Foot2 = new sound("Sound/FOOT2A.WAV");
var Foot3 = new sound("Sound/FOOT3A.WAV");
var Foot4 = new sound("Sound/FOOT4A.WAV");

var Spur1 = new sound("Sound/SPUR1.WAV");
var Spur2 = new sound("Sound/SPUR2.WAV");
var Spur3 = new sound("Sound/SPUR3.WAV");
var Spur4 = new sound("Sound/SPUR4.WAV");

var Swipe1 = new sound("Sound/Combat/SWIPE1.WAV");
var Swipe2 = new sound("Sound/Combat/SWIPE2.WAV");
var Swipe3 = new sound("Sound/Combat/SWIPE3.WAV");
var Swipe4 = new sound("Sound/Combat/SWIPE4.WAV");
var Swipe5 = new sound("Sound/Combat/SWIPE5.WAV");
var Hit    = new sound("Sound/Combat/FISTHIT.WAV");

var windArray = [Fart1,Fart2,Fart3,Fart4,Fart5,Fart6];
var walkArray = [Foot1,Foot2,Foot3,Foot4];
var swipeArray = [Swipe1,Swipe2,Swipe3,Swipe4,Swipe5];
var chickArray = [Chick1,Chick2,Chick3,Chick4,Chick5,Chick6];

BileMove1.sound.setAttribute("loop", "infinite");

function multiSoundSelector(soundArray){
    let num: number = soundArray.length;
    let rand: number = Math.floor(Math.random() * num);
    soundArray[rand].play();
    return rand;
}