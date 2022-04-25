abstract class sprite {
    public domElement: HTMLElement;
    abstract draw();
    constructor() {
        this.draw();
    }
}
// enum statuses {
//     normal="normal", stunned="stunned", dead="dead"
// }
enum intents {
    persue= "persue", seekFood="eat", loiter="nothing"
}
type activities = {
    move: boolean, eat: boolean, fight: boolean, stunned: boolean, dying: boolean, dead: boolean
}
enum activity_strings {
    eat="eat", fight="fight", die= "die"
}
enum compassPoints {
    
}
class MovementFlags {
    public leftMovement: boolean;
    public upMovement: boolean;
    public downMovement: boolean;
    public rightMovement: boolean;
    public movingFlag: string;
    public oldFlag: string;
    public facing: string;
}

abstract class movingSprite extends sprite {
    public movementFlags = new MovementFlags();
    public activity: activities;
    protected stepSound

    public startingHealth: number;
    protected healthBar: HTMLElement;
    public health: number;
    public power: number;
    public intent: intents;

    constructor() {
        super();
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
        }
    }
    
    abstract considerIntent();
    abstract startWalkingNoise();
    abstract stopWalkingNoise();
    abstract startMoving();
    abstract stopMoving();
    abstract stun(severity);
    abstract hit(severity);
    abstract fight();
    abstract canEatAnotherChickenCheck(cheat);

    public updateHealthBar(){
        this.healthBar.style.width = this.health *2 + "px";
    }
    freeMovementCheck(){
        return this.activity.stunned == false && this.activity.dying == false && this.activity.dead == false;
    }
    anyActionCheck(){
        return this.freeMovementCheck() && this.activity.eat == false && this.activity.fight == false;
    }
}

class Bile extends movingSprite {
    constructor() {
        super()
        this.movementFlags.oldFlag = this.movementFlags.movingFlag = 'S';
        this.health = this.startingHealth = 100; ///////////////////STARTING HEALTH 
        this.updateHealthBar();
    }
    public draw() {
        dungeon.innerHTML+=`<img id="bileD" src="Bile gifs/frames/Bile_S frame.gif" style="top:300px; left: 300px" />`
        this.domElement = document.getElementById("bileD");
        this.height = this.domElement.clientHeight|| 90;  ///FIX THIS, height comes in late
        this.AnnounceArrival();
    }
    public movementFlags = new MovementFlags();
    protected healthBar = document.getElementById("playerHealth");

    public speed: number = 15;
    public power: number = 30;
    public height: number;
    public heightAdjust = 5;
    public widthAdjust = 1;
    public chickensEaten: number = 0;
    //public stunFlag: boolean;//?

    public eatChick() {
        eatTimeout(this);
        this.height += 10;
        this.domElement.style.height = `${this.height}px`;
        this.speed += 1.2;
        this.power +=2
        this.health = this.health < 100? this.health+=10 : this.health;
        this.updateHealthBar();
    }
    public startMoving() {
        this.startWalkingNoise();
        this.domElement.setAttribute("src", `Bile gifs/Bile_${this.movementFlags.movingFlag}.gif`)
    };
    public stopMoving() {
        this.stopWalkingNoise();
        this.domElement.setAttribute("src", `Bile gifs/frames/Bile_${this.movementFlags.oldFlag} frame.gif`)
    };
    public AnnounceArrival() {
        BileReady.play();
    }
    public startWalkingNoise() {
        BileMove1.play();
    }
    public stopWalkingNoise() {
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
        multiSoundSelector(swipeArray);
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
    public hit(severity) { 
        Hit.play();
        this.health -= severity;
        this.health = this.health>0?this.health:0;
        this.updateHealthBar();
        if (this.health <= 0){
            this.death();
        }
        else BileHit1.play();
    }
    public death(){
        BileDie.play();
        this.domElement.setAttribute("src", `Bile gifs/bile_collapse_.gif`);
        this.activity.dying = true;
        let _this = this;
        setTimeout(()=>{
            _this.domElement.setAttribute("src", `Bile gifs/frames/bile_SE frame.gif`)
            _this.activity.dead = true;
        },3000)  // FIX
    }
    public canEatAnotherChickenCheck(cheat: boolean){
        return this.activity.eat == false || cheat == true;
    }
}

class Thief extends movingSprite {
    static thiefCount: number = 0;
    static thiefStartPosition = {   
        left: screen.width - 30,
        top: screen.height / 2
    }
    public speed: number = 5;
    public power: number = 10;
    public movementFlags = new MovementFlags();
    protected healthBar = document.getElementById("enemyHealth");

    public mySteps; // 
    public height: number = 73;
    public heightAdjust = 5;
    public widthAdjust = 2;
    public chickensEaten: number = 0;
    constructor() {
        super()
        this.movementFlags.oldFlag = 'S';
        this.health = 100;
        this.intent = intents.persue;
        this.updateHealthBar();
    }
    public draw() {
  //      let randomPosition = getRandomScreenPosition();        //Random pos?
        Thief.thiefCount++;
        var newThief = `<img id="thief${Thief.thiefCount}" src="Thief gifs/thief_W.gif" style="position:absolute; top:${Thief.thiefStartPosition.top}px; left:${Thief.thiefStartPosition.left}px" />`;
        newThiefBox.innerHTML += newThief;
        this.domElement = document.getElementById(`thief${Thief.thiefCount}`);
        //    this.height = this.domElement.clientHeight;
    }
    public considerIntent(){
        if (this.health<=0){this.intent = null}
        else {this.intent = this.health<50 ? intents.seekFood : intents.persue;}
    }
    public eatChick() {
        eatTimeout(this);
        this.height += 8;
        this.domElement.style.height = `${this.height}px`;
        this.speed += 0.5;
        this.health = this.health < 100? this.health+=10 : this.health;
        this.updateHealthBar();
    }
    public fight(){
        if (this.activity.eat || this.activity.fight || this.activity.dying) return   //FIX
        Swipe1.play();
        fightTimeout(this);
        let num = this.power;
            if (collisionCheck(this, biledemon)) {
                biledemon.hit(num);
            }
    }
    private collapse(){
        this.domElement.setAttribute("src", `Thief gifs/thief_collapse.gif` + "?a=" + Math.random());
    }
    public stun(severity) {
        var timeout = severity * 1000;
        this.collapse();
        this.movementFlags.oldFlag = this.movementFlags.movingFlag = "";
        this.activity.stunned = true;
        let this_ = this;
        setTimeout(function () {
            this_.activity.stunned = false;
        }, timeout);
    }

    public hit(severity) {
        if (this.activity.dead) return
        Hit.play();
        this.health -= severity;
        this.health = this.health>0?this.health:0;
        this.updateHealthBar();
        if (this.health <= 0){
            this.death();
        }
    }

    public death(){
        this.collapse();
        this.intent = intents.loiter;
        this.activity.dying = true;
        this.activity.dead = true;
        this.stopWalkingNoise();

        setTimeout(() => {
            spawnEnemy(Thief);
        }, 500); 
    }

    public startMoving() {
        if (!this.mySteps || this.mySteps == 0) {
            this.startWalkingNoise();
        }
        this.domElement.setAttribute("src", `Thief gifs/thief_${this.movementFlags.movingFlag}.gif`)
        //this.domElement.setAttribute("src", `Thief gifs/thief_SW.gif`)
    }
    public stopMoving() {
        this.stopWalkingNoise();
        this.domElement.setAttribute("src", `Thief gifs/thief_${this.movementFlags.oldFlag}.gif`) /////// CHANGE TO FRAME
    }
    public startWalkingNoise() {
        this.mySteps = setInterval(()=>multiSoundSelector(walkArray), 500);
    }
    public stopWalkingNoise() {
        clearInterval(this.mySteps);
        this.mySteps = 0;
    }
    public canEatAnotherChickenCheck(){
        this.activity.eat == false;
    }
}

class chicken extends sprite {
    constructor() {
        super();
    }
    static chickCount = 0;
    public myCluck;
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