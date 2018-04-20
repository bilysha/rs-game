var imageRepository = new function() {

    this.sky = new Image();
    this.ground = new Image();
    this.hero = new Image();
    this.bullet = new Image();
    this.enemy = new Image();

    this.sky.src = "images/sky.png";
    this.ground.src = "images/street.png";
    this.hero.src = "images/hero.png";
    this.bullet.src = "images/bullet.png";
    this.enemy.src = "images/zombi.png";

};

var audioRepository = new function() {
    this.arr = [];
    this.shoot_sound = new Audio();
    this.arr.push(this.shoot_sound);
    this.hand_hit_sound = new Audio();
    this.arr.push(this.hand_hit_sound);
    this.zombi_hurt_sound = new Audio();
    this.arr.push(this.zombi_hurt_sound);
    this.avtomat_sound = new Audio();
    this.arr.push(this.avtomat_sound);
    this.hero_hurt_sound = new Audio();
    this.arr.push(this.hero_hurt_sound);
    this.zombi_attack_sound = new Audio();
    this.arr.push(this.zombi_attack_sound);
    this.citizen_cry_sound = new Audio();
    this.arr.push(this.citizen_cry_sound);
    
    this.shoot_sound.src = "sounds/pistol_shoot.mp3";
    this.hand_hit_sound.src = "sounds/hand_hit.mp3";
    this.zombi_hurt_sound.src = "sounds/zombie-6.wav";
    this.avtomat_sound.src = "sounds/avtomat.mp3";
    this.hero_hurt_sound.src = "sounds/hero_hurt.mp3";
    this.zombi_attack_sound.src = "sounds/zombi_attack.mp3";
    this.citizen_cry_sound.src = "sounds/citizen_cry.mp3"

};



function Drawable() {
    this.init = function(x, y) {
        this.x = x;
        this.y = y;
    };

    this.draw = function() {
    };
}
