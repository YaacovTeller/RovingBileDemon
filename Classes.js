var intents;
(function (intents) {
    intents["persue"] = "persue";
    intents["seekFood"] = "eat";
    intents["loiter"] = "nothing";
})(intents || (intents = {}));
var activity_strings;
(function (activity_strings) {
    activity_strings["eat"] = "eat";
    activity_strings["fight"] = "fight";
    activity_strings["die"] = "die";
})(activity_strings || (activity_strings = {}));
var compassPoints;
(function (compassPoints) {
})(compassPoints || (compassPoints = {}));
const CharVarients = {
    biledemon: {
        name: "bile",
        health: 100,
        height: 100,
        speed: 10,
        power: 30,
        sounds: {
            pain: bileHitArray,
            arrive: [BileReady],
            move: bileMoveArray,
            die: [BileDie],
            attack: swipeArray,
            hit: [Hit],
        }
    },
    knight: {
        name: "Knight",
        health: 110,
        height: 150,
        speed: 5,
        power: 15,
        sounds: {
            pain: manHitArray,
            arrive: lordTauntArray,
            move: spurArray,
            die: manDieArray,
            attack: swipeArray,
            hit: [SwordHit],
        }
    },
    thief: {
        name: "Thief",
        health: 80,
        height: 75,
        speed: 7,
        power: 8,
        sounds: {
            pain: manHitArray,
            arrive: manShoutArray,
            move: walkArray,
            die: manDieArray,
            attack: swipeArray,
            hit: [SwordHit],
        }
    }
};
class MovementFlags {
}
class sprite {
    constructor() {
        this.draw();
    }
}
class movingSprite extends sprite {
    constructor() {
        super();
        this.movementFlags = new MovementFlags();
        // for (let item in this.activity){
        //     this.activity[item] = false;
        // }
        this.activity = {
            dead: false,
            dying: false,
            stunned: false,
            eat: false,
            move: false,
            fight: false
        };
        this.AnnounceArrival();
    }
    changeElementHeight(num) {
        num = num || 0;
        this.height += num;
        this.domElement.style.height = this.height + "px";
    }
    setCharDetails() {
        this.speed = this.charType.speed;
        this.power = this.charType.power;
        this.health = this.charType.health;
        this.height = this.charType.height;
    }
    updateHealthBar() {
        this.healthBar.style.width = this.health * 2 + "px";
    }
    eatChick() {
        eatTimeout(this);
        this.updateHealthBar();
    }
    hit(severity) {
        if (!this.pulseCheck())
            return;
        this.health -= severity;
        this.health = this.health > 0 ? this.health : 0;
        this.updateHealthBar();
        if (this.health <= 0) {
            this.death();
        }
        else
            multiSoundSelector(this.charType.sounds.pain);
    }
    AnnounceArrival() {
        multiSoundSelector(this.charType.sounds.arrive);
    }
    fight() {
        if (this.anyActionCheck()) {
            multiSoundSelector(this.charType.sounds.attack);
            fightTimeout(this);
        }
    }
    death() {
        this.activity.dying = true;
        this.stopMoving();
        multiSoundSelector(this.charType.sounds.die);
    }
    startWalkingNoise() {
        // this.mySteps = setInterval(()=>multiSoundSelector(this.charType.sounds.move), 500);
        this.mySteps = setInterval(() => multiSoundSelector(this.charType.sounds.move, true), 500);
    }
    stopWalkingNoise() {
        clearInterval(this.mySteps);
        this.mySteps = 0;
    }
    pulseCheck() {
        return this.activity.dying == false && this.activity.dead == false;
    }
    freeMovementCheck() {
        return this.pulseCheck() && this.activity.stunned == false;
    }
    anyActionCheck() {
        return this.freeMovementCheck() && this.activity.eat == false && this.activity.fight == false;
    }
}
class Bile extends movingSprite {
    constructor() {
        super();
        this.movementFlags = new MovementFlags();
        this.healthBar = document.getElementById("playerHealth");
        this.heightAdjust = 5;
        this.widthAdjust = 1;
        this.chickensEaten = 0;
        this.movementFlags.oldFlag = this.movementFlags.movingFlag = 'S';
        this.updateHealthBar();
        this.setCharDetails();
        this.changeElementHeight();
    }
    draw() {
        this.selectCharType();
        dungeon.innerHTML += `<img id="bileD" src="Bile gifs/frames/Bile_S frame.gif" style="top:300px; left: 300px" />`;
        this.domElement = document.getElementById("bileD");
        this.AnnounceArrival();
    }
    selectCharType() {
        this.charType = CharVarients.biledemon;
    }
    eatChick() {
        this.health = this.health < 120 ? this.health += 10 : this.health;
        super.eatChick();
        let growthRate = 10;
        this.changeElementHeight(growthRate);
        this.speed += 1;
        this.power += 2;
    }
    startMoving() {
        if (!this.mySteps || this.mySteps == 0) {
            this.startWalkingNoise();
        }
        this.domElement.setAttribute("src", `Bile gifs/Bile_${this.movementFlags.movingFlag}.gif`);
    }
    ;
    stopMoving() {
        this.stopWalkingNoise();
        this.domElement.setAttribute("src", `Bile gifs/frames/Bile_${this.movementFlags.oldFlag} frame.gif`);
    }
    ;
    passWind() {
        let num = multiSoundSelector(windArray);
        for (let i = 0; i < enemyArray.length; i++) {
            if (collisionCheck(biledemon, enemyArray[i])) {
                enemyArray[i].stun(num);
            }
        }
    }
    fight() {
        super.fight();
        let num = this.power;
        for (let i = 0; i < enemyArray.length; i++) {
            if (collisionCheck(biledemon, enemyArray[i])) {
                enemyArray[i].hit(num);
                multiSoundSelector(this.charType.sounds.hit);
            }
        }
    }
    considerIntent() { }
    stun(num) { }
    loiter() { }
    death() {
        super.death();
        BileDie.play();
        this.domElement.setAttribute("src", `Bile gifs/bile_collapse_.gif`);
        let _this = this;
        setTimeout(() => {
            _this.domElement.setAttribute("src", `Bile gifs/frames/bile_SE frame.gif`);
            _this.activity.dead = true;
        }, 3000); // FIX
    }
    canEatAnotherChickenCheck(cheat) {
        return this.activity.eat == false || cheat == true;
    }
}
class Enemy extends movingSprite {
    constructor() {
        super();
        this.movementFlags = new MovementFlags();
        this.healthBar = document.getElementById("enemyHealth");
        //  public height: number = 73;
        this.heightAdjust = 5;
        this.widthAdjust = 2;
        this.chickensEaten = 0;
        this.movementFlags.oldFlag = 'S';
        this.health = 100;
        this.intent = intents.persue;
        this.updateHealthBar();
    }
    draw() {
        this.selectCharType();
        //      let randomPosition = getRandomScreenPosition();        //Random pos?
        Enemy.enemyCount++;
        var newEnemy = `<img id="enemy${Enemy.enemyCount}" src="${this.charType.name} gifs/${this.charType.name}_W.gif" style="position:absolute; top:${Enemy.enemyStartPosition.top}px; left:${Enemy.enemyStartPosition.left}px" />`;
        newEnemyBox.innerHTML += newEnemy;
        this.domElement = document.getElementById(`enemy${Enemy.enemyCount}`);
        this.setCharDetails();
        this.changeElementHeight();
    }
    selectCharType() {
        this.charType = Math.round(Math.random()) == 1 ? CharVarients.thief : CharVarients.knight;
    }
    considerIntent() {
        if (this.health <= 0) {
            this.intent = null;
        }
        else if (!biledemon.pulseCheck()) {
            this.intent = intents.loiter;
        }
        else {
            this.intent = this.health < 50 ? intents.seekFood : intents.persue;
        }
    }
    loiter_roving() {
        chase(this, this.idleTarget);
    }
    loiter_standing() {
    }
    loiter() {
        let myClass = this.charType.name;
        this.stopMoving(); //// HACK, should happen at setpicandsound
        //  this.domElement.src = `${myClass} gifs/frames/${myClass}_${this.movementFlags.facing} frame.gif`;
        this.domElement.src = `${myClass} gifs/${myClass}_rest.gif`;
        this.domElement.onerror = () => this.domElement.src = `${myClass} gifs/${myClass}_rest.gif`;
        // if (!this.idleTarget || this.idleTarget.pointReached != false){
        //     let pos:position = {top:parseInt(this.domElement.style.top), left:parseInt(this.domElement.style.left)}
        //     this.idleTarget = new targetPoint(pos);
        //   //  this.speed /=5;
        //     let myClass = this.charType.name;
        //     this.domElement.src = `${myClass} gifs/frames/${myClass}_${this.movementFlags.facing} frame.gif`;
        //     setTimeout(() => {
        //         this.idleTarget.pointReached = false
        //     }, 3000);
        // }
        // this.loiter_roving();
        // if (collisionCheck(this,this.idleTarget)){
        //     this.idleTarget.pointReached = true;
        // }
    }
    eatChick() {
        this.health = this.health < 100 ? this.health += 10 : this.health;
        super.eatChick();
        let growthRate = 10;
        this.changeElementHeight(growthRate);
        this.speed += 0.5;
        this.power += 2;
    }
    fight() {
        if (!this.anyActionCheck())
            return; //FIX
        super.fight();
        let num = this.power;
        if (collisionCheck(this, biledemon)) {
            biledemon.hit(num);
            multiSoundSelector(this.charType.sounds.hit);
        }
    }
    collapse() {
        this.domElement.setAttribute("src", `${this.charType.name} gifs/${this.charType.name}_collapse.gif` + "?a=" + Math.random());
    }
    stun(severity) {
        var timeout = severity * 1000;
        this.collapse();
        this.movementFlags.oldFlag = this.movementFlags.movingFlag = "";
        this.activity.stunned = true;
        let this_ = this;
        setTimeout(function () {
            this_.activity.stunned = false;
        }, timeout);
    }
    death() {
        super.death();
        this.collapse();
        this.activity.dead = true;
        this.stopWalkingNoise();
        setTimeout(() => {
            spawnEnemy(Enemy);
        }, 1500);
    }
    startMoving() {
        if (!this.mySteps || this.mySteps == 0) {
            this.startWalkingNoise();
        }
        this.domElement.setAttribute("src", `${this.charType.name} gifs/${this.charType.name}_${this.movementFlags.movingFlag}.gif`);
        //this.domElement.setAttribute("src", `Thief gifs/thief_SW.gif`)
    }
    stopMoving() {
        this.stopWalkingNoise();
        this.domElement.setAttribute("src", `${this.charType.name} gifs/${this.charType.name}_${this.movementFlags.oldFlag}.gif`); /////// CHANGE TO FRAME
    }
    canEatAnotherChickenCheck() {
        return this.activity.eat == false;
    }
}
Enemy.enemyCount = 0;
Enemy.enemyStartPosition = {
    left: screen.width - 30,
    top: screen.height / 2
};
class targetPoint extends sprite {
    constructor(pos) {
        super();
        this.position = pos;
    }
    draw() {
        this.domElement = document.createElement("img");
        dungeon.appendChild(this.domElement);
        this.shift();
    }
    assignCurrentPosition() {
        this.domElement.style.top = this.position.top + 'px';
        this.domElement.style.left = this.position.left + 'px';
    }
    shift() {
        let randomPosition = getRandomScreenPosition(this.position);
        this.position = randomPosition;
        this.domElement.style.position = 'absolute';
        this.assignCurrentPosition();
    }
}
class chicken extends sprite {
    constructor() {
        super();
    }
    draw() {
        var randomPosition = getRandomScreenPosition();
        var newChick = `<img id="chick${chicken.chickCount}" src="Pics/chicken.gif" style="position:absolute; top:${randomPosition.top}px; left:${randomPosition.left}px" />`;
        newChickBox.innerHTML += newChick;
        this.domElement = document.getElementById(`chick${chicken.chickCount}`);
        this.cluck();
    }
    chickSounds() {
        multiSoundSelector(chickArray);
    }
    cluck() {
        this.myCluck = setInterval(this.chickSounds, 3000);
    }
    perish(eater) {
        ChickDie1.play();
        this.domElement.parentNode.removeChild(this.domElement);
        clearInterval(this.myCluck);
        eater.chickensEaten += 1;
        // chicken.chickCount++;
        refreshChickCounter();
    }
}
chicken.chickCount = 0;
