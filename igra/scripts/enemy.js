function Enemy(type) {
    this.image = imageRepository.enemy;
    switch(type) {
        case 'boy' :
            this.health = 25;
            this.speed = 10;
            this.health_count = 2.4;
            this.walk_array = [
                [0, 30],
                [0, 150],
                [0, 265],
                [0, 365],
                [0, 480],
                [0, 600]
            ];
            this.tomb_array = [
                [600, 0],
                [600, 210],
                [600, 420],
                [600, 630],
                [600, 840],
                [600, 1050],
                [600, 1260],
                [600, 1470]
            ];
            this.hurt_array = [
                [0, 1480],
                [0, 1360],
                [0, 1240],
                [0, 1125],
                [0, 1010]
            ];
            this.attack_array = [
                [0, 1725],
                [0, 1850],
                [0, 1975],
                [0, 2100],
                [0, 2220],
                [0, 2345]
            ];
            break;
        case 'man' :
            this.health = 35;
            this.health_count = 1.7;
            this.speed = 5;
            this.walk_array = [
                [200, 30],
                [200, 155],
                [200, 275],
                [200, 390],
                [200, 505],
                [200, 625]
            ];
            this.tomb_array = [
                [800, 0],
                [800, 215],
                [800, 430],
                [800, 640],
                [800, 860],
                [800, 1070],
                [800, 1280],
                [800, 1490]
            ];
            this.hurt_array = [
                [200, 1500],
                [200, 1380],
                [200, 1260],
                [200, 1135],
                [200, 1010]
            ];
            this.attack_array = [
                [200, 1728],
                [200, 1855],
                [200, 1983],
                [200, 2110],
                [200, 2235],
                [200, 2362]
            ];
            break;
        case 'girl' :
            this.health = 20;
            this.health_count = 3;
            this.speed = 15;
            this.walk_array = [
                [400, 10],
                [400, 120],
                [400, 225],
                [400, 325],
                [400, 430],
                [400, 530]
            ];
            this.tomb_array = [
                [1000, 20],
                [1000, 275],
                [1000, 490],
                [1000, 730],
                [1000, 1015],
                [1000, 1250],
                [1000, 1460],
                [1000, 1670]
            ];
            this.hurt_array = [
                [400, 1470],
                [400, 1365],
                [400, 1247],
                [400, 1120],
                [400, 1000]
            ];    
            this.attack_array = [
                [400, 1715],
                [400, 1825],
                [400, 1940],
                [400, 2055],
                [400, 2170],
                [400, 2285]
            ];
            break;
        default:
            break;
    }

    this.context.fillStyle = 'black';
    
    this.isDraw = true;
    this.isAlive = true;
    this.isHurt = false;
    this.isAttack = false;
    
    this.walk_counter = 0;
    this.hurt_counter = 0;
    this.tomb_counter = 0;
    this.attack_counter = 0;
    
    this.walk_index = 5;
    this.tomb_index = 7;
    this.hurt_index = 4;
    this.attack_index = 5;
    
    this.draw = function() {
        if(this.isDraw) {
            if(this.isHurt) {
                this.attack_index = 5;
                this.hurt();
                return;
            }
            if(this.isAlive){
                if(this.isAttack) {
                    this.attack();
                    return;
                }
                this.move();
            }
            else {
                this.tomb();
            } 
        }
    };
    
    this.move = function() {
        this.walk_counter++;
        this.context.drawImage(this.image, this.walk_array[this.walk_index][1], this.walk_array[this.walk_index][0], 100, 150, this.x, this.y, 80,100);
        this.context.fillStyle = 'black';
        for(var j = 0; j < this.health; j++) {
            this.context.fillRect(this.x + j * this.health_count, this.y - 10, this.health_count, 2);
        }
        if(this.walk_counter == 10){
            this.walk_index--;
            if(this.walk_index == -1) {
                this.walk_index = 5;
            }
            if( (this.x < game.hero.x + 40) && (this.x > game.hero.x + 20)  && (this.y + 90 > game.hero.y + 70) && (this.y + 70 < game.hero.y + 90) && game.hero.isAttackable){
                this.isAttack = true;
                this.attack();
            }
            else {
                this.x -= this.speed;
            }
            this.walk_counter = 0;
        }
    };
    
    this.hurt = function() {
        this.hurt_counter++;
        this.context.drawImage(this.image, this.hurt_array[this.hurt_index][1], this.hurt_array[this.hurt_index][0], 120, 150, this.x, this.y, 90,100);
        this.context.fillStyle = 'black';
        for(var i = 0; i < this.health; i++) {
            this.context.fillRect(this.x + i * this.health_count, this.y - 10, this.health_count, 2);
        }
        if(this.hurt_counter % 5 == 0){
            this.hurt_index--;
            if(this.hurt_index == -1) {
                this.hurt_index = 4;
                this.isHurt = false;
            }
        }
    };

    this.tomb = function() {
        this.tomb_counter++;
        this.context.drawImage(this.image, this.tomb_array[this.tomb_index][1], this.tomb_array[this.tomb_index][0], 220, 150, this.x - 50, this.y, 150,100);

        if(this.tomb_counter % 10 == 0){
            this.tomb_index--;
            if(this.tomb_index == -1) {
                this.isDraw = false;
                game.killed_enemies++;
                game.gamePool.clear();
            }
        }
    };

    this.attack = function() {
        this.attack_counter++;
        this.context.drawImage(this.image, this.attack_array[this.attack_index][1], this.attack_array[this.attack_index][0],100, 150, this.x, this.y, 80, 100);
        for(var j = 0; j < this.health; j++) {
            this.context.fillRect(this.x + j * this.health_count, this.y - 10, this.health_count, 2);
        }
        if(this.attack_index == 2) {
            audioRepository.zombi_attack_sound.play();
        }
        if(this.attack_index == 1) {
            if( (this.x < game.hero.x + 40) && (this.x > game.hero.x + 20)  && (this.y + 90 > game.hero.y + 70) && (this.y + 70 < game.hero.y + 90) && game.hero.isAttackable) {
                game.hero.isAttackable = false;
            }
        }
        if(this.attack_counter == 10) {
            this.attack_index--;
            if(this.attack_index == -1) {
                this.isAttack = false;
                this.attack_index = 5;
            }
            this.attack_counter = 0;
        }
    };

    this.hitting = function(obj, j, y1, y2) {
        audioRepository.zombi_hurt_sound.pause();
        audioRepository.zombi_hurt_sound.currentTime = 0;
        audioRepository.zombi_hurt_sound.play();
        
        if(y1 < y2 - 40) {
            game.headShots++;
        }
        else if( y1 < y2 - 10 ) {
            game.bodyShots++;
        }
        else {
            game.legsShots++;
        }
        
        if(obj === 'pistol') {
            game.score += 10;
            this.health -= 10;
        }
        if(obj === 'hand') {
            this.health -= 5;
            game.score += 5;
        }
        if(this.health <= 0) {
            game.score += 100;
            this.isAlive = false;
        }
        else {
            game.gamePool.pool[j].isHurt = true; 
        }
    }

}

Enemy.prototype = new Drawable();
