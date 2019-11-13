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
        _this.chickensEaten = 0;
        _this.movementFlags.oldFlag = _this.movementFlags.movingFlag = 'S';
        _this.movementFlags.eatFlag = false;
        return _this;
    }
    Bile.prototype.draw = function () {
        this.domElement = document.getElementById("bileD");
        this.AnnounceArrival();
    };
    Bile.prototype.eatChick = function () {
        finishEatingSetPic(this);
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
    Bile.prototype.passWind = function (victim) {
        var num = Math.floor(Math.random() * (6) + 1);
        if (num == 1) {
            Fart1.play();
        }
        else if (num == 2) {
            Fart2.play();
        }
        else if (num == 3) {
            Fart3.play();
        }
        else if (num == 4) {
            Fart4.play();
        }
        else if (num == 5) {
            Fart5.play();
        }
        else if (num == 6) {
            Fart6.play();
        }
        if (collisionCheck(biledemon, victim)) {
            thiefInst.stun(num);
        }
    };
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
        _this.chickensEaten = 0;
        _this.movementFlags.oldFlag = 'S';
        _this.stunFlag = false;
        return _this;
    }
    Thief.prototype.draw = function () {
        var newThief = "<img id=\"thief" + Thief.thiefCount + "\" src=\"Thief gifs/thief_W.gif\" style=\"position:absolute; top:" + Thief.thiefStartPosition.top + "px; left:" + Thief.thiefStartPosition.left + "px\" />";
        newThiefBox.innerHTML += newThief;
        this.domElement = document.getElementById("thief" + Thief.thiefCount);
        //    this.height = this.domElement.clientHeight;
    };
    Thief.prototype.eatChick = function () {
        finishEatingSetPic(this);
        this.height += 8;
        this.domElement.style.height = this.height + "px";
        this.speed += 0.5;
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
        this.mySteps = setInterval(stepSounds, 500);
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
        var num = Math.floor(Math.random() * (6) + 1);
        if (num == 1) {
            Chick1.play();
        }
        else if (num == 2) {
            Chick2.play();
        }
        else if (num == 3) {
            Chick3.play();
        }
        else if (num == 4) {
            Chick4.play();
        }
        else if (num == 5) {
            Chick5.play();
        }
        else if (num == 6) {
            Chick6.play();
        }
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
