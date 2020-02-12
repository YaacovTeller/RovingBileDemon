var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var sprite = /** @class */ (function () {
    function sprite() {
        this.draw();
    }
    return sprite;
}());
var MovementFlags = /** @class */ (function () {
    function MovementFlags() {
    }
    return MovementFlags;
}());
var movingSprite = /** @class */ (function (_super) {
    __extends(movingSprite, _super);
    function movingSprite() {
        var _this = _super.call(this) || this;
        _this.movementFlags = new MovementFlags();
        return _this;
    }
    return movingSprite;
}(sprite));
var Bile = /** @class */ (function (_super) {
    __extends(Bile, _super);
    function Bile() {
        var _this = _super.call(this) || this;
        _this.movementFlags = new MovementFlags();
        _this.speed = 15;
        _this.height = _this.domElement.clientHeight;
        _this.heightAdjust = 5;
        _this.widthAdjust = 1;
        _this.chickensEaten = 0;
        _this.movementFlags.oldFlag = _this.movementFlags.movingFlag = 'S';
        _this.movementFlags.eatFlag = false;
        _this.health = 100;
        _this.power = 30;
        return _this;
    }
    Bile.prototype.draw = function () {
        this.domElement = document.getElementById("bileD");
        this.AnnounceArrival();
    };
    Bile.prototype.eatChick = function () {
        eatTimeout(this);
        this.height += 10;
        this.domElement.style.height = this.height + "px";
        this.speed += 1.2;
    };
    Bile.prototype.startMoving = function () {
        this.startNoise();
        this.domElement.setAttribute("src", "Bile gifs/Bile_" + this.movementFlags.movingFlag + ".gif");
    };
    ;
    Bile.prototype.stopMoving = function () {
        this.stopNoise();
        this.domElement.setAttribute("src", "Bile gifs/frames/Bile_" + this.movementFlags.oldFlag + " frame.gif");
    };
    ;
    Bile.prototype.AnnounceArrival = function () {
        BileReady.play();
    };
    Bile.prototype.startNoise = function () {
        BileMove1.play();
    };
    Bile.prototype.stopNoise = function () {
        BileMove1.stop();
    };
    Bile.prototype.passWind = function () {
        var num = multiSoundSelector(windArray);
        for (var i = 0; i < enemyArray.length; i++) {
            if (collisionCheck(biledemon, enemyArray[i])) {
                enemyArray[i].stun(num);
            }
        }
    };
    Bile.prototype.fight = function () {
        Swipe1.play();
        fightTimeout(this);
        var num = this.power;
        for (var i = 0; i < enemyArray.length; i++) {
            if (collisionCheck(biledemon, enemyArray[i])) {
                enemyArray[i].hit(num);
            }
        }
    };
    Bile.prototype.considerIntent = function () { };
    Bile.prototype.stun = function (num) { };
    Bile.prototype.hit = function (num) { };
    return Bile;
}(movingSprite));
var Thief = /** @class */ (function (_super) {
    __extends(Thief, _super);
    function Thief() {
        var _this = _super.call(this) || this;
        _this.speed = 5;
        _this.movementFlags = new MovementFlags();
        _this.height = 73;
        _this.heightAdjust = 5;
        _this.widthAdjust = 2;
        _this.chickensEaten = 0;
        _this.movementFlags.oldFlag = 'S';
        _this.stunFlag = false;
        _this.health = 100;
        _this.intent = "pursue";
        return _this;
    }
    Thief.prototype.draw = function () {
        var newThief = "<img id=\"thief" + Thief.thiefCount + "\" src=\"Thief gifs/thief_W.gif\" style=\"position:absolute; top:" + Thief.thiefStartPosition.top + "px; left:" + Thief.thiefStartPosition.left + "px\" />";
        newThiefBox.innerHTML += newThief;
        this.domElement = document.getElementById("thief" + Thief.thiefCount);
        //    this.height = this.domElement.clientHeight;
    };
    Thief.prototype.considerIntent = function () {
        if (this.health <= 0) {
            this.intent = null;
        }
        else {
            this.intent = this.health < 50 ? "eat" : "pursue";
        }
    };
    Thief.prototype.eatChick = function () {
        eatTimeout(this);
        this.height += 8;
        this.domElement.style.height = this.height + "px";
        this.speed += 0.5;
        this.health = this.health < 100 ? this.health += 10 : this.health;
        this.updateHealthBar();
    };
    Thief.prototype.stun = function (severity) {
        var timeout = severity * 1000;
        this.domElement.setAttribute("src", "Thief gifs/thief_collapse.gif");
        this.movementFlags.oldFlag = this.movementFlags.movingFlag = "";
        this.stunFlag = true;
        var this_ = this;
        setTimeout(function () {
            this_.stunFlag = false;
        }, timeout);
    };
    Thief.prototype.hit = function (severity) {
        Hit.play();
        this.health -= severity;
        this.health = this.health > 0 ? this.health : 0;
        this.updateHealthBar();
        if (this.health <= 0) {
            this.death();
        }
    };
    Thief.prototype.updateHealthBar = function () {
        document.getElementById("enemyHealth").style.width = this.health * 2 + "px";
    };
    Thief.prototype.death = function () {
        this.domElement.setAttribute("src", "Thief gifs/thief_collapse.gif");
        this.stunFlag = true;
        this.domElement = null;
        this.intent = null;
    };
    Thief.prototype.startMoving = function () {
        if (!this.mySteps || this.mySteps == 0) {
            this.startNoise();
        }
        this.domElement.setAttribute("src", "Thief gifs/thief_" + this.movementFlags.movingFlag + ".gif");
        //this.domElement.setAttribute("src", `Thief gifs/thief_SW.gif`)
    };
    Thief.prototype.stopMoving = function () {
        this.stopNoise();
        this.domElement.setAttribute("src", "Thief gifs/thief_" + this.movementFlags.oldFlag + ".gif"); /////// CHANGE TO FRAME
    };
    Thief.prototype.startNoise = function () {
        this.mySteps = setInterval(function () { return multiSoundSelector(walkArray); }, 500);
    };
    Thief.prototype.stopNoise = function () {
        clearInterval(this.mySteps);
        this.mySteps = 0;
    };
    Thief.thiefCount = 0;
    Thief.thiefStartPosition = {
        left: screen.width - 30,
        top: screen.height / 2
    };
    return Thief;
}(movingSprite));
var chicken = /** @class */ (function (_super) {
    __extends(chicken, _super);
    function chicken() {
        return _super.call(this) || this;
    }
    chicken.prototype.draw = function () {
        var randomPosition = getRandomScreenPosition();
        var newChick = "<img id=\"chick" + chicken.chickCount + "\" src=\"Pics/chicken.gif\" style=\"position:absolute; top:" + randomPosition.randomTop + "px; left:" + randomPosition.randomLeft + "px\" />";
        newChickBox.innerHTML += newChick;
        this.domElement = document.getElementById("chick" + chicken.chickCount);
        this.cluck();
    };
    chicken.prototype.chickSounds = function () {
        multiSoundSelector(chickArray);
    };
    chicken.prototype.cluck = function () {
        this.myCluck = setInterval(this.chickSounds, 3000);
    };
    chicken.prototype.perish = function (eater) {
        ChickDie1.play();
        this.domElement.parentNode.removeChild(this.domElement);
        clearInterval(this.myCluck);
        eater.chickensEaten += 1;
        // chicken.chickCount++;
        refreshChickCounter();
    };
    chicken.chickCount = 0;
    return chicken;
}(sprite));
