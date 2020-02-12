abstract class sprite {
    public domElement: HTMLElement;
    abstract draw();
    constructor() {
        this.draw();
    }
}
class MovementFlags {
    public leftMovement: boolean;
    public upMovement: boolean;
    public downMovement: boolean;
    public rightMovement: boolean;
    public movingFlag: string;
    public oldFlag: string;
    public facing: string;
    public eatFlag: boolean;
}

abstract class movingSprite extends sprite {
    public movementFlags = new MovementFlags();
    public fightFlag: boolean;
    public health: number;
    public power: number;
    public intent: string;
    public stunFlag: boolean;

    constructor() {
        super();
    }
    
    abstract considerIntent();
    abstract startNoise();
    abstract stopNoise();
    abstract startMoving();
    abstract stopMoving();
    abstract stun(severity);
    abstract hit(severity);
}

class Bile extends movingSprite {
    constructor() {
        super()
        this.movementFlags.oldFlag = this.movementFlags.movingFlag = 'S';
        this.movementFlags.eatFlag = false;
        this.health = 100;
        this.power = 30;
    }
    public draw() {
        this.domElement = document.getElementById("bileD");
        this.AnnounceArrival();
    }
    public movementFlags = new MovementFlags();

    public speed: number = 15;
    public domElement: HTMLElement;
    public height: number = this.domElement.clientHeight;
    public heightAdjust = 5;
    public widthAdjust = 1;
    public chickensEaten: number = 0;
    public stunFlag: boolean;//?

    public eatChick() {
        eatTimeout(this);
        this.height += 10;
        this.domElement.style.height = `${this.height}px`;
        this.speed += 1.2;

    }
    public startMoving() {
        this.startNoise();
        this.domElement.setAttribute("src", `Bile gifs/Bile_${this.movementFlags.movingFlag}.gif`)
    };
    public stopMoving() {
        this.stopNoise();
        this.domElement.setAttribute("src", `Bile gifs/frames/Bile_${this.movementFlags.oldFlag} frame.gif`)
    };
    public AnnounceArrival() {
        BileReady.play();
    }
    public startNoise() {
        BileMove1.play();
    }
    public stopNoise() {
        BileMove1.stop();
    }
    public passWind() {
        let num = multiSoundSelector(windArray);
        for (let i = 0; i<enemyArray.length; i++){
            if (collisionCheck(biledemon, enemyArray[i])) {
                enemyArray[i].stun(num);
            }
        }
    }
    public fight(){
        Swipe1.play();
        fightTimeout(this);
        let num = this.power;
        for (let i = 0; i<enemyArray.length; i++){
            if (collisionCheck(biledemon, enemyArray[i])) {
                enemyArray[i].hit(num);
            }
        }
    }
    public considerIntent(){}
    public stun(num){}
    public hit(num){}
}

class Thief extends movingSprite {
    static thiefCount: number = 0;
    static thiefStartPosition = {
        left: screen.width - 30,
        top: screen.height / 2
    }
    public speed: number = 5;
    public movementFlags = new MovementFlags();

    public mySteps;
    public domElement: HTMLElement;
    public height: number = 73;
    public heightAdjust = 5;
    public widthAdjust = 2;
    public stunFlag: boolean;
    public intent: string;
    public chickensEaten: number = 0;
    constructor() {
        super()
        this.movementFlags.oldFlag = 'S';
        this.stunFlag = false;
        this.health = 100;
        this.intent = "pursue";
    }
    public draw() {
        var newThief = `<img id="thief${Thief.thiefCount}" src="Thief gifs/thief_W.gif" style="position:absolute; top:${Thief.thiefStartPosition.top}px; left:${Thief.thiefStartPosition.left}px" />`;
        newThiefBox.innerHTML += newThief;
        this.domElement = document.getElementById(`thief${Thief.thiefCount}`);
        //    this.height = this.domElement.clientHeight;
    }
    public considerIntent(){
        if (this.health<=0){this.intent = null}
        else {this.intent = this.health<50 ? "eat" : "pursue";}
    }
    public eatChick() {
        eatTimeout(this);
        this.height += 8;
        this.domElement.style.height = `${this.height}px`;
        this.speed += 0.5;
        this.health = this.health < 100? this.health+=10 : this.health;
        this.updateHealthBar();
    }
    public stun(severity) {
        var timeout = severity * 1000;
        this.domElement.setAttribute("src", `Thief gifs/thief_collapse.gif`);
        this.movementFlags.oldFlag = this.movementFlags.movingFlag = "";
        this.stunFlag = true;
        let this_ = this;
        setTimeout(function () {
            this_.stunFlag = false;
        }, timeout);
    }
    public hit(severity) { 
        Hit.play();
        this.health -= severity;
        this.health = this.health>0?this.health:0;
        this.updateHealthBar();
        if (this.health <= 0){
            this.death();
        }
    }
    public updateHealthBar(){
        document.getElementById("enemyHealth").style.width = this.health *2 + "px";
    }
    public death(){
        this.domElement.setAttribute("src", `Thief gifs/thief_collapse.gif`);
        this.stunFlag = true;
        this.domElement = null;
        this.intent = null;
    }

    public startMoving() {
        if (!this.mySteps || this.mySteps == 0) {
            this.startNoise();
        }
        this.domElement.setAttribute("src", `Thief gifs/thief_${this.movementFlags.movingFlag}.gif`)
        //this.domElement.setAttribute("src", `Thief gifs/thief_SW.gif`)
    }
    public stopMoving() {
        this.stopNoise();
        this.domElement.setAttribute("src", `Thief gifs/thief_${this.movementFlags.oldFlag}.gif`) /////// CHANGE TO FRAME
    }
    public startNoise() {
        this.mySteps = setInterval(()=>multiSoundSelector(walkArray), 500);
    }
    public stopNoise() {
        clearInterval(this.mySteps);
        this.mySteps = 0;
    }
}

class chicken extends sprite {
    constructor() {
        super();
    }
    static chickCount = 0;
    public myCluck;
    public domElement: HTMLElement;
    public draw() {
        var randomPosition = getRandomScreenPosition();
        var newChick = `<img id="chick${chicken.chickCount}" src="Pics/chicken.gif" style="position:absolute; top:${randomPosition.randomTop}px; left:${randomPosition.randomLeft}px" />`;
        newChickBox.innerHTML += newChick;
        this.domElement = document.getElementById(`chick${chicken.chickCount}`);
        this.cluck();
    }
    public chickSounds() {
        multiSoundSelector(chickArray);
    }
    public cluck() {
        this.myCluck = setInterval(this.chickSounds, 3000);
    }
    public perish(eater) {
        ChickDie1.play();
        this.domElement.parentNode.removeChild(this.domElement);
        clearInterval(this.myCluck);
        eater.chickensEaten += 1;
        // chicken.chickCount++;
        refreshChickCounter();
    }
}