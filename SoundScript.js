// function sound(src: string) {
//     this.sound = document.createElement("audio");
//     this.sound.src = src;
//     this.sound.setAttribute("preload", "auto");
//     this.sound.setAttribute("controls", "none");
//     //   this.sound.setAttribute("loop", "infinite");  For a sort of macabre doom-rap experience
//     this.sound.style.display = "none";
//     document.body.appendChild(this.sound);
//     this.play = function () {
//         this.sound.play();
//     }
//     this.stop = function () {
//         this.sound.pause();
//     }
// }
class sound {
    constructor(src) {
        this.play = function () {
            this.sound.play();
            this.sound.playcount++;
        };
        this.stop = function () {
            this.sound.pause();
        };
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        this.sound.playcount = 0;
        document.body.appendChild(this.sound);
    }
    toggleInfinite() {
        this.sound.setAttribute("loop", "infinite");
    }
}
function multiSoundSelector(soundArray, inSeries) {
    if (soundArray.length == 1) {
        soundArray[0].play();
    }
    else {
        if (inSeries) {
            let lowestPlayCount;
            for (let s of soundArray) {
                if (lowestPlayCount == undefined || s.playcount < lowestPlayCount) {
                    lowestPlayCount = s.playcount;
                }
            }
        }
    }
    let num = soundArray.length;
    let rand = Math.floor(Math.random() * num);
    soundArray[rand].play();
    return rand;
}
let bilefolder = "Sound/Bilesound/";
let enemyfolder = "Sound/Enemysound/";
let combatfolder = "Sound/Combat/";
var BileMove1 = new sound(bilefolder + "BIGFOOT1.WAV");
var BileMove2 = new sound(bilefolder + "BIGFOOT2.WAV");
var BileMove3 = new sound(bilefolder + "BIGFOOT1.WAV"); //REPEATS!
var BileMove4 = new sound(bilefolder + "BIGFOOT2.WAV"); //REPEATS!
var BileReady = new sound(bilefolder + "HORNDROP.WAV");
var BileHappy = new sound(bilefolder + "HORNHAPY.WAV");
var BileDie = new sound(bilefolder + "HORNDIE1.WAV");
var BileHit1 = new sound(bilefolder + "HORNHIT1.WAV");
var BileHit2 = new sound(bilefolder + "HORNHIT2.WAV");
var BileHit3 = new sound(bilefolder + "HORNHIT3.WAV");
var BileSlap = new sound(bilefolder + "HORNSLAP.WAV");
var BileSad = new sound(bilefolder + "HORNSAD1.WAV");
var BilePain1 = new sound(bilefolder + "HORNTOR1.WAV");
var BilePain2 = new sound(bilefolder + "HORNTOR2.WAV");
var BilePain3 = new sound(bilefolder + "HORNTOR3.WAV");
var Fart1 = new sound(bilefolder + "FART1.WAV");
var Fart2 = new sound(bilefolder + "FART2.WAV");
var Fart3 = new sound(bilefolder + "FART3.WAV");
var Fart4 = new sound(bilefolder + "FART4.WAV");
var Fart5 = new sound(bilefolder + "FART5.WAV");
var Fart6 = new sound(bilefolder + "FART6.WAV");
var ManDie1 = new sound(enemyfolder + "MAN1DIE1.WAV");
var ManDie2 = new sound(enemyfolder + "MAN1DIE2.WAV");
var ManDie3 = new sound(enemyfolder + "MAN2DIE1.WAV");
var ManDie4 = new sound(enemyfolder + "MAN2DIE2.WAV");
var ManDrop = new sound(enemyfolder + "MAN2DROP.WAV");
var ManShout1 = new sound(enemyfolder + "MAN1FGT1.WAV");
var ManShout2 = new sound(enemyfolder + "MAN1FGT2.WAV");
var ManShout3 = new sound(enemyfolder + "MAN1FGT3.WAV");
var LordTaunt1 = new sound(enemyfolder + "HTAUNT01.WAV");
var LordTaunt2 = new sound(enemyfolder + "HTAUNT02.WAV");
var LordTaunt3 = new sound(enemyfolder + "HTAUNT03.WAV");
var LordTaunt4 = new sound(enemyfolder + "HTAUNT04.WAV");
var LordTaunt5 = new sound(enemyfolder + "HTAUNT05.WAV");
var LordTaunt6 = new sound(enemyfolder + "HTAUNT06.WAV");
var LordTaunt7 = new sound(enemyfolder + "HTAUNT07.WAV");
var LordTaunt8 = new sound(enemyfolder + "HTAUNT08.WAV");
var ManHit1 = new sound(enemyfolder + "MAN1HIT1.WAV");
var ManHit2 = new sound(enemyfolder + "MAN1HIT2.WAV");
var ManHit3 = new sound(enemyfolder + "MAN1HIT3.WAV");
var Foot1 = new sound(enemyfolder + "FOOT1A.WAV");
var Foot2 = new sound(enemyfolder + "FOOT2A.WAV");
var Foot3 = new sound(enemyfolder + "FOOT3A.WAV");
var Foot4 = new sound(enemyfolder + "FOOT4A.WAV");
var Spur1 = new sound(enemyfolder + "SPUR1.WAV");
var Spur2 = new sound(enemyfolder + "SPUR2.WAV");
var Spur3 = new sound(enemyfolder + "SPUR3.WAV");
var Spur4 = new sound(enemyfolder + "SPUR4.WAV");
var Chick1 = new sound("Sound/CHICK1A.WAV");
var Chick2 = new sound("Sound/CHICK1B.WAV");
var Chick3 = new sound("Sound/CHICK1C.WAV");
var Chick4 = new sound("Sound/CHICK1D.WAV");
var Chick5 = new sound("Sound/CHICK1E.WAV");
var Chick6 = new sound("Sound/CHICK1F.WAV");
var ChickDie1 = new sound("Sound/CHICK4A.WAV");
var ChickDie2 = new sound("Sound/CHICK4B.WAV");
var Swipe1 = new sound(combatfolder + "SWIPE1.WAV");
var Swipe2 = new sound(combatfolder + "SWIPE2.WAV");
var Swipe3 = new sound(combatfolder + "SWIPE3.WAV");
var Swipe4 = new sound(combatfolder + "SWIPE4.WAV");
var Swipe5 = new sound(combatfolder + "SWIPE5.WAV");
var Hit = new sound(combatfolder + "FISTHIT.WAV");
var SwordHit = new sound(combatfolder + "SWORDHIT.WAV");
var bileHitArray = [BileHit1, BileHit2, BileHit3];
var windArray = [Fart1, Fart2, Fart3, Fart4, Fart5, Fart6];
var swipeArray = [Swipe1, Swipe2, Swipe3, Swipe4, Swipe5];
var bileMoveArray = [BileMove1, BileMove2, BileMove3, BileMove4];
var chickArray = [Chick1, Chick2, Chick3, Chick4, Chick5, Chick6];
var chickDieArray = [ChickDie1, ChickDie2];
var walkArray = [Foot1, Foot2, Foot3, Foot4];
var spurArray = [Spur1, Spur2, Spur3, Spur4];
var manDieArray = [ManDie1, ManDie2, ManDie3, ManDie4];
var manHitArray = [ManHit1, ManHit2];
var manShoutArray = [ManDrop, ManShout1, ManShout2, ManShout3];
var lordTauntArray = [LordTaunt1, LordTaunt2, LordTaunt3, LordTaunt4, LordTaunt5, LordTaunt6, LordTaunt7, LordTaunt8];
//BileMove1.toggleInfinite();
