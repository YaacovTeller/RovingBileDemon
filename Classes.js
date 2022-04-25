var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
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
        var _this_1 = _super.call(this) || this;
        _this_1.movementFlags = new MovementFlags();
        return _this_1;
    }
    movingSprite.prototype.updateHealthBar = function () {
        this.healthBar.style.width = this.health * 2 + "px";
    };
    return movingSprite;
}(sprite));
var Bile = /** @class */ (function (_super) {
    __extends(Bile, _super);
    function Bile() {
        var _this_1 = _super.call(this) || this;
        _this_1.movementFlags = new MovementFlags();
        _this_1.healthBar = document.getElementById("playerHealth");
        _this_1.speed = 15;
        _this_1.power = 30;
        _this_1.heightAdjust = 5;
        _this_1.widthAdjust = 1;
        _this_1.chickensEaten = 0;
        _this_1.movementFlags.oldFlag = _this_1.movementFlags.movingFlag = 'S';
        _this_1.movementFlags.eatFlag = false;
        _this_1.health = _this_1.startingHealth = 200;
        _this_1.updateHealthBar();
        return _this_1;
    }
    Bile.prototype.draw = function () {
        dungeon.innerHTML += "<img id=\"bileD\" src=\"Bile gifs/frames/Bile_S frame.gif\" style=\"top:300px; left: 300px\" />";
        this.domElement = document.getElementById("bileD");
        this.height = this.domElement.clientHeight || 90; ///FIX THIS, height comes in late
        this.AnnounceArrival();
    };
    Bile.prototype.eatChick = function () {
        eatTimeout(this);
        this.height += 10;
        this.domElement.style.height = this.height + "px";
        this.speed += 1.2;
        this.power += 2;
        this.health = this.health < 100 ? this.health += 10 : this.health;
        this.updateHealthBar();
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
    Bile.prototype.hit = function (severity) {
        Hit.play();
        this.health -= severity;
        this.health = this.health > 0 ? this.health : 0;
        this.updateHealthBar();
        if (this.health <= 0) {
            this.death();
        }
        else
            BileHit1.play();
    };
    Bile.prototype.death = function () {
        BileDie.play();
        this.domElement.setAttribute("src", "Bile gifs/bile_collapse.gif");
        var _this = this;
        setTimeout(function () {
            _this.domElement.setAttribute("src", "Bile gifs/frames/bile_SE frame.gif");
            _this.domElement = null;
        }, 3000); // FIX
        //   this.stunFlag = true;
        //    this.intent = null;
        this.stopMoving();
    };
    Bile.prototype.canEatAnotherChickenCheck = function (cheat) {
        return this.movementFlags.eatFlag == false || cheat == true;
    };
    return Bile;
}(movingSprite));
var Thief = /** @class */ (function (_super) {
    __extends(Thief, _super);
    function Thief() {
        var _this_1 = _super.call(this) || this;
        _this_1.speed = 5;
        _this_1.power = 10;
        _this_1.movementFlags = new MovementFlags();
        _this_1.healthBar = document.getElementById("enemyHealth");
        _this_1.height = 73;
        _this_1.heightAdjust = 5;
        _this_1.widthAdjust = 2;
        _this_1.chickensEaten = 0;
        _this_1.movementFlags.oldFlag = 'S';
        _this_1.stunFlag = false;
        _this_1.health = 100;
        _this_1.intent = "pursue";
        _this_1.updateHealthBar();
        return _this_1;
    }
    Thief.prototype.draw = function () {
        //      let randomPosition = getRandomScreenPosition();        //Random pos?
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
    Thief.prototype.fight = function () {
        if (this.movementFlags.eatFlag == true)
            return; //FIX
        Swipe1.play();
        fightTimeout(this);
        var num = this.power;
        if (collisionCheck(this, biledemon)) {
            biledemon.hit(num);
        }
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
    Thief.prototype.death = function () {
        this.domElement.setAttribute("src", "Thief gifs/thief_collapse.gif");
        this.stunFlag = true;
        this.domElement = null;
        this.intent = null;
        this.stopMoving();
        spawnEnemy(Thief);
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
    Thief.prototype.canEatAnotherChickenCheck = function () {
        this.stunFlag == false;
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
