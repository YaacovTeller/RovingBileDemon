
enum intents {
    persue= "persue", seekFood="eat", loiter="nothing"
}
enum activity_strings {
    eat="eat", fight="fight", die= "die"
}
type activities = {
    move: boolean, eat: boolean, fight: boolean, stunned: boolean, dying: boolean, dead: boolean
}
enum compassPoints {
    
}
interface IChar {
    name:string, 
    health:number, 
    height:number, 
    speed:number, 
    power:number, 
    sounds:{
        pain:Array<sound>, 
        arrive:Array<sound>, 
        move:Array<sound>, 
        die:Array<sound>, 
        attack:Array<sound>,
        hit:Array<sound>,
    }
}
const CharVarients = {
    biledemon:{
        name:"bile",
        health: 100,
        height: 100,
        speed: 10,
        power: 30,
        sounds:{
            pain: bileHitArray,
            arrive: [BileReady],
            move: bileMoveArray,
            die: [BileDie],
            attack: swipeArray,
            hit: [Hit],
        }
    },
    knight:{
        name:"Knight",
        health: 110,
        height: 150,
        speed: 5,
        power: 15,
        sounds:{
            pain: manHitArray,
            arrive: lordTauntArray,
            move: spurArray,
            die: manDieArray,
            attack: swipeArray,
            hit: [SwordHit],
        }
    },
    thief:{
        name:"Thief",
        health: 80,
        height: 75,
        speed: 7,
        power: 8,
        sounds:{
            pain: manHitArray,
            arrive: manShoutArray,
            move: walkArray,
            die: manDieArray,
            attack: swipeArray,
            hit: [SwordHit],
        }
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
}

abstract class sprite {
    public domElement: HTMLImageElement;
    abstract draw();
    constructor() {
        this.draw();
    }
}

abstract class movingSprite extends sprite {
    public movementFlags = new MovementFlags();
    public activity: activities;    
    public charType: IChar;
    public intent: intents;
    protected healthBar: HTMLElement;
    protected health: number;
    protected power: number;
    protected speed: number;
    protected height: number;
    protected mySteps;

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
        this.AnnounceArrival();
    }
    protected changeElementHeight(num?:number){
        num=num||0;
        this.height+=num;
        this.domElement.style.height = this.height + "px";
    }
    protected abstract selectCharType();
    protected setCharDetails(){
        this.speed = this.charType.speed;
        this.power = this.charType.power;
        this.health = this.charType.health;
        this.height = this.charType.height;
    }
    abstract considerIntent();
    abstract startMoving();
    abstract stopMoving();
    abstract stun(severity);
    abstract loiter();
    abstract canEatAnotherChickenCheck(cheat);

    protected updateHealthBar(){
        this.healthBar.style.width = this.health *2 + "px";
    }
    protected eatChick(){
        eatTimeout(this);
        this.updateHealthBar();
    }
    public hit(severity){
        if (!this.pulseCheck()) return

        this.health -= severity;
        this.health = this.health>0?this.health:0;
        this.updateHealthBar();
        if (this.health <= 0){
            this.death();
        }
        else  multiSoundSelector(this.charType.sounds.pain);
    }
    public AnnounceArrival() {
        multiSoundSelector(this.charType.sounds.arrive);
    }
    public fight(){  /////// shouldnt be public?
        if (this.anyActionCheck()){
            multiSoundSelector(this.charType.sounds.attack)
            fightTimeout(this);
        }
    }
    protected death(){
        this.activity.dying = true;
        this.stopMoving();
        multiSoundSelector(this.charType.sounds.die);
    }
    public startWalkingNoise() {
       // this.mySteps = setInterval(()=>multiSoundSelector(this.charType.sounds.move), 500);
        this.mySteps = setInterval(()=>multiSoundSelector(this.charType.sounds.move, true), 500);
    }
    public stopWalkingNoise() {
        clearInterval(this.mySteps);
        this.mySteps = 0;
    }

    public pulseCheck(){
        return this.activity.dying == false && this.activity.dead == false;
    }
    public freeMovementCheck(){
        return this.pulseCheck() && this.activity.stunned == false;
    }
    public anyActionCheck(){
        return this.freeMovementCheck() && this.activity.eat == false && this.activity.fight == false;
    }
}

class Bile extends movingSprite {
    constructor() {
        super()
        this.movementFlags.oldFlag = this.movementFlags.movingFlag = 'S';
        this.updateHealthBar();
        this.setCharDetails();
        this.changeElementHeight();
    }
    public draw() {
        this.selectCharType();
        dungeon.innerHTML+=`<img id="bileD" src="Bile gifs/frames/Bile_S frame.gif" style="top:300px; left: 300px" />`
        this.domElement = document.getElementById("bileD") as HTMLImageElement;
        this.AnnounceArrival();
    }
    public movementFlags = new MovementFlags();
    protected healthBar = document.getElementById("playerHealth");

    public heightAdjust = 5;
    public widthAdjust = 1;
    public chickensEaten: number = 0;

    protected selectCharType() {
        this.charType = CharVarients.biledemon;
    }
    public eatChick() {
        this.health = this.health < 120? this.health+=10 : this.health;
        super.eatChick();
        let growthRate = 10;
        this.changeElementHeight(growthRate);

        this.speed += 1;
        this.power +=2
    }
    public startMoving() {
        if (!this.mySteps || this.mySteps == 0) {
            this.startWalkingNoise();
        }
        this.domElement.setAttribute("src", `Bile gifs/Bile_${this.movementFlags.movingFlag}.gif`)
    };
    public stopMoving() {
        this.stopWalkingNoise();
        this.domElement.setAttribute("src", `Bile gifs/frames/Bile_${this.movementFlags.oldFlag} frame.gif`)
    };

    public passWind() {
        let num = multiSoundSelector(windArray);
        for (let i = 0; i<enemyArray.length; i++){
            if (collisionCheck(biledemon, enemyArray[i])) {
                enemyArray[i].stun(num);
            }
        }
    }
    public fight(){
        super.fight();
        let num = this.power;
        for (let i = 0; i<enemyArray.length; i++){
            if (collisionCheck(biledemon, enemyArray[i])) {
                enemyArray[i].hit(num);
                multiSoundSelector(this.charType.sounds.hit)
            }
        }
    }
    public considerIntent(){}
    public stun(num){}
    public loiter(){}
    
    public death(){
        super.death();
        BileDie.play();
        this.domElement.setAttribute("src", `Bile gifs/bile_collapse_.gif`);
        let _this = this;
        setTimeout(()=>{
            _this.domElement.setAttribute("src", `Bile gifs/frames/bile_SE frame.gif`);
            _this.activity.dead = true;
        },3000)  // FIX
    }

    public canEatAnotherChickenCheck(cheat: boolean){
        return this.activity.eat == false || cheat == true;
    }
}

class Enemy extends movingSprite {
    static enemyCount: number = 0;
    static enemyStartPosition = {
        left: screen.width - 30,
        top: screen.height / 2
    }
    public movementFlags = new MovementFlags();
    protected healthBar = document.getElementById("enemyHealth");

  //  public height: number = 73;
    public heightAdjust = 5;
    public widthAdjust = 2;
    public chickensEaten: number = 0;
    public idleTarget: targetPoint;
    constructor() {
        super()
        this.movementFlags.oldFlag = 'S';
        this.health = 100;
        this.intent = intents.persue;
        this.updateHealthBar();
    }

    public draw() {
        this.selectCharType();
        //      let randomPosition = getRandomScreenPosition();        //Random pos?
        Enemy.enemyCount++;
        var newEnemy = `<img id="enemy${Enemy.enemyCount}" src="${this.charType.name} gifs/${this.charType.name}_W.gif" style="position:absolute; top:${Enemy.enemyStartPosition.top}px; left:${Enemy.enemyStartPosition.left}px" />`;
        newEnemyBox.innerHTML += newEnemy;
        this.domElement = document.getElementById(`enemy${Enemy.enemyCount}`) as HTMLImageElement;
        this.setCharDetails();
        this.changeElementHeight();
    }
    protected selectCharType(){
        this.charType = Math.round(Math.random()) == 1 ? CharVarients.thief : CharVarients.knight;
    }

    public considerIntent(){
        if (this.health<=0){this.intent = null}
        else if (!biledemon.pulseCheck()){
            this.intent = intents.loiter;
        }
        else {this.intent = this.health < 50 ? intents.seekFood : intents.persue;}

    }
    public loiter_roving(){
        chase(this, this.idleTarget);
    }
    public loiter_standing(){
        
    }
    public loiter(){
        let myClass = this.charType.name;
        this.stopMoving();   //// HACK, should happen at setpicandsound
      //  this.domElement.src = `${myClass} gifs/frames/${myClass}_${this.movementFlags.facing} frame.gif`;
      this.domElement.src = `${myClass} gifs/${myClass}_rest.gif`;
      this.domElement.onerror = ()=> this.domElement.src = `${myClass} gifs/${myClass}_rest.gif`;
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
    
    public eatChick() {
        this.health = this.health < 100? this.health+=10 : this.health;
        super.eatChick();

        let growthRate = 10;
        this.changeElementHeight(growthRate);
        this.speed += 0.5;
        this.power += 2;
    }
    public fight(){
        if (!this.anyActionCheck()) return   //FIX
        super.fight();
        let num = this.power;
        if (collisionCheck(this, biledemon)) {
            biledemon.hit(num);
            multiSoundSelector(this.charType.sounds.hit)
        }
    }
    private collapse(){
        this.domElement.setAttribute("src", `${this.charType.name} gifs/${this.charType.name}_collapse.gif` + "?a=" + Math.random());
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

    public death(){
        super.death();
        this.collapse();
        this.activity.dead = true;
        this.stopWalkingNoise();

        setTimeout(() => {
            spawnEnemy(Enemy);
        }, 1500); 
    }

    public startMoving() {
        if (!this.mySteps || this.mySteps == 0) {
            this.startWalkingNoise();
        }
        this.domElement.setAttribute("src", `${this.charType.name} gifs/${this.charType.name}_${this.movementFlags.movingFlag}.gif`)
        //this.domElement.setAttribute("src", `Thief gifs/thief_SW.gif`)
    }
    public stopMoving() {
        this.stopWalkingNoise();
        this.domElement.setAttribute("src", `${this.charType.name} gifs/${this.charType.name}_${this.movementFlags.oldFlag}.gif`) /////// CHANGE TO FRAME
    }

    public canEatAnotherChickenCheck(){
        return this.activity.eat == false;
    }
}
class targetPoint extends sprite{
    constructor(pos: position) {
        super();
        this.position = pos;
    }
    private position:position;
    public pointReached: boolean;
    public draw() {
        this.domElement = document.createElement("img");
        dungeon.appendChild(this.domElement);
        this.shift();
    }
    public assignCurrentPosition(){
        this.domElement.style.top = this.position.top+'px';
        this.domElement.style.left = this.position.left+'px';
    }
    public shift(){
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
    static chickCount = 0;
    public myCluck;
    public draw() {
        var randomPosition = getRandomScreenPosition();
        var newChick = `<img id="chick${chicken.chickCount}" src="Pics/chicken.gif" style="position:absolute; top:${randomPosition.top}px; left:${randomPosition.left}px" />`;
        newChickBox.innerHTML += newChick;
        this.domElement = document.getElementById(`chick${chicken.chickCount}`) as HTMLImageElement;
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
