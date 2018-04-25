function Hero() {
    
    /*variables*/
    {
        this.context.fillStyle = 'white';

        this.bulletPool = new Pool(20);
        this.bulletPool.init();

        this.image = imageRepository.hero;

        this.isHit = false;
        this.isShoot = false;
        this.isWalk = false;
        this.isHail = false;
        this.isAttackable = true;
        this.isDeath = false;
        this.isCooldawn = false;

        this.isDraw = true;

        this.pistol_counter = 0;
        this.hail_counter = 0;
        this.hand_counter = 0;
        this.walk_counter = 0;
        this.idle_counter = 0;
        this.hurt_counter = 0;
        this.cd_counter = 0;

        this.shoot_delay = 0;
        this.miss = 0;
        this.bah = 0;

        this.health = 3;
        this.citizens = 3;
        this.speed = 2;
        this.catridge = 8;
        this.avtomat_catridge = 64;
        this.fireRate = 30;
        this.cd_index = 40;

        this.pistol_index = 0;
        this.hit_index = 0;
        this.hail_index = 0;
        this.index = 0;
        this.hurt_index = 0;

        this.idle_array = [
            [400, -1],
            [400, 68],
            [400, 135],
            [400, 203],
            [400, 270],
            [400, 337],
            [400, 405],
            [400, 473]
        ];
        this.walk_array = [
            [800, -2],
            [799, 87],
            [799, 172],
            [799, 258],
            [800, 344],
            [799, 430],
            [799, 517],
            [799, 602]
        ];
        this.hit_array = [
            [-2, 4],
            [-2, 115],
            [-2, 223],
            [-2, 335],
            [-2, 440],
            [-2, 552],
            [-2, 663],
            [-2, 775],
            [-2, 885],
            [-2, 995]
        ];
        this.walk_hit_array = [
            [400, 604],
            [400, 715],
            [400, 823],
            [400, 935],
            [400, 1040],
            [400, 1152],
            [400, 1263],
            [400, 1375],
            [800, 1000],
            [800, 1105]
        ];
        this.pistol_array = [
            [600, 0],
            [600, 120],
            [600, 243],
            [600, 362],
            [600, 485],
            [600, 607]
        ];
        this.walk_pistol_array = [
            [600, 750],
            [600, 870],
            [600, 993],
            [600, 1112],
            [600, 1235],
            [600, 1357]
        ];
        this.automat_array = [
            [1000, 0],
            [1000, 125],
            [1000, 248],
            [1000, 372],
            [1000, 497],
            [1000, 620]
        ];
        this.automat_array_move = [
            [1000, 730],
            [1000, 855],
            [1000, 980],
            [1000, 1105],
            [1000, 1230],
            [1000, 1350]
        ];
        this.hurt_array = [
            [200, 10],
            [200, 150],
            [200, 280],
            [200, 420],
            [200, 550],
            [200, 680]
        ];
        this.death_array = [
            [200, 810],
            [200, 940],
            [200, 1070]
        ];
    }
    
    this.draw = function () {
        this.cd_counter++;
        
        if(this.isCooldawn) {
            if(this.cd_counter % 50 == 0) {
                if(this.avtomat_catridge != 64) {
                    this.avtomat_catridge++;                    
                }
                this.cd_index -= 0.6;
            }
            if(this.cd_index < 0) {
                this.isCooldawn = false;
            }
        }
        
        this.bulletPool.animate();
        this.bulletPool.check_hitting();
        this.status();

        if(KEY_STATUS.pause) {
            game.pause();
        }

        this.shoot_delay++;

        this.isWalk = false;
        
        if(this.isDeath) {
            this.death();
            return;
        }
        
        if(!this.isAttackable) {
            this.hurt();
            return;
        }    
        
        if (KEY_STATUS.right) {
                this.isWalk = true;
                this.x += this.speed;
                if (this.x >= this.canvasWidth - 72)
                    this.x = this.canvasWidth - 72;
            }
        if (KEY_STATUS.left) {
                this.isWalk = true;
                this.x -= this.speed;
                if (this.x <= 0)
                    this.x = 0;
            }
        if (KEY_STATUS.up) {
                this.isWalk = true;
                this.y -= this.speed;
                if (this.y <= this.canvasHeight / 2.6 )
                    this.y = this.canvasHeight / 2.6
            }
        if (KEY_STATUS.down) {
                this.isWalk = true;
                this.y += this.speed;
                if (this.y >= this.canvasHeight - 160)
                    this.y = this.canvasHeight - 160;
            }
        
        if(this.isHit && this.isWalk) {
                this.hit(this.walk_hit_array);
                return;
            }
        
        if(this.isShoot && this.isWalk) {
                this.shot(this.walk_pistol_array);
                return;
            }

        if(this.isHail && this.isWalk && !this.isCooldawn) {
                this.hail(this.automat_array_move);
                return;
            }

        if(this.isHit) {
                this.hit(this.hit_array);
                return;
            }
        if(this.isShoot) {
                this.shot(this.pistol_array);
                return;
            }
        if(this.isHail) {
                this.hail(this.automat_array);
                return;
            }

        if (KEY_STATUS.hand) {
                this.isHit = true;
                this.hit();
                return;
            }
        
        if (KEY_STATUS.shoot && this.shoot_delay > this.fireRate && this.catridge > 0) {
                this.isShoot = true;
                this.shoot_delay = 0;
                this.shot();
                return;
            }

        if (KEY_STATUS.hail_key && !this.isCooldawn) {
            this.isHail = true;
            this.hail(this.automat_array);
            return;
        }
        
        if (this.isWalk) {
                this.move();
                return;
            }
            
        this.idle();
    };
    
    this.idle = function () {
        this.context.drawImage(this.image, this.idle_array[this.index][1], this.idle_array[this.index][0], 68, 150, this.x, this.y, 55, 100);
        this.idle_counter++;
        if(this.idle_counter == 8) {
            this.index++;
            if( this.index == 8) {
                this.index = 0;
            }
            this.idle_counter = 0;
        }
    };
    
    this.hurt = function() {
        audioRepository.hero_hurt_sound.play();
        this.hurt_counter++;
        this.context.drawImage(this.image, this.hurt_array[this.hurt_index][1], this.hurt_array[this.hurt_index][0], 100, 150, this.x - 20, this.y, 90, 120);
        if(this.hurt_counter == 8) {
            this.hurt_index++;
            if( this.hurt_index == 6) {
                this.hurt_index = 0;
                this.isAttackable = true;
                this.health--;
                if(this.health == 0) {
                    this.hurt_index = 0;
                    this.hurt_counter = 0;
                    this.isDeath = true;
                    this.death();
                }
            }
            this.hurt_counter = 0;
        }
    };

    this.death = function () {
        this.hurt_counter++;
        this.context.drawImage(this.image, this.death_array[this.hurt_index][1], this.death_array[this.hurt_index][0], 150, 150, this.x - 20, this.y, 120, 120);
        if(this.hurt_counter == 8) {
            this.hurt_index++;
            if( this.hurt_index == 3) {
                game.gameOver();
            }
            this.hurt_counter = 0;
        }
    };

    this.move = function() {
        this.context.drawImage(this.image, this.walk_array[this.index][1], this.walk_array[this.index][0], 88, 150, this.x, this.y, 70, 100);
        this.walk_counter++;
        if(this.walk_counter == 8) {
            this.index++;
            if( this.index == 8) {
                this.index = 0;
            }
            this.walk_counter = 0;
        }
    };

    this.hit = function(array) {
        this.context.drawImage(this.image, array[this.hit_index][1], array[this.hit_index][0], 110, 150, this.x - 15, this.y, 90, 100);
        this.hand_counter++;
        if(this.hand_counter == 3) {
            this.hit_index++;
            if( this.hit_index == 10) {
                this.check_hand_hit();
                audioRepository.hand_hit_sound.play();
                this.hit_index = 0;
                this.isHit = false;
            }
            this.hand_counter = 0;
        }
    };

    this.shot = function (array) {
        this.context.drawImage(this.image, array[this.pistol_index][1], array[this.pistol_index][0], 100, 150, this.x, this.y, 80, 100);
        this.pistol_counter++;

        if(this.pistol_counter == 8) {
            this.pistol_index++;
            if(this.pistol_index == 4) {
                this.fire();
                this.catridge--;
                if(this.catridge == 0) {
                    this.pistol_reload();
                }
                audioRepository.shoot_sound.play();
            }
            if( this.pistol_index == 6) {
                this.pistol_index = 0;
                this.isShoot = false;
            }
            this.pistol_counter = 0;
        }
    };

    this.hail = function(array) {
        this.context.drawImage(this.image, array[this.hail_index][1], array[this.hail_index][0], 100, 150, this.x, this.y, 80, 100);
        this.hail_counter++;
        audioRepository.avtomat_sound.play();
        if(this.hail_counter % 8 == 0) {
            this.hail_index++;
            this.fire();
            this.avtomat_catridge--;
            if( this.hail_index == 6) {
                this.hail_index = 0;

            }
            if(this.hail_counter == 512){
                this.hail_counter = 0;
                this.isHail = false;
                this.isCooldawn = true;
                this.cd_index = 40;
                audioRepository.avtomat_sound.pause();
                audioRepository.avtomat_sound.currentTime = 0;
            }
        }
    };

    this.status = function() {
        this.context.font = "14px finger_paint";
        this.context.fillStyle = 'black';
        this.context.roundRect( 5, this.canvasHeight - 45, 40, 40);
        this.context.drawImage(this.image, 1150, 60, 30, 30, 5, this.canvasHeight - 45, 40, 40);
        this.context.fillText(this.health, 11, this.canvasHeight - 11);

        this.context.roundRect( 55, this.canvasHeight - 45, 40, 40);
        this.context.drawImage(this.image, 1220, 60, 50, 50, 58, this.canvasHeight - 45, 40, 40);
        this.context.fillText(this.citizens, 61, this.canvasHeight - 11);

        this.context.roundRect( 105, this.canvasHeight - 45, 40, 40);
        this.context.drawImage(this.image, 1300, 0, 50, 50, 108, this.canvasHeight - 42, 35, 35);
        
        this.context.roundRect( 155, this.canvasHeight - 45, 40, 40);
        this.context.drawImage(this.image, 1230, 0, 50, 50, 158, this.canvasHeight - 42, 35, 35);
        this.context.fillText(this.catridge, 180, this.canvasHeight - 12);

        this.context.roundRect( 205, this.canvasHeight - 45, 120, 40);
        this.context.drawImage(this.image, 1355, 0, 138, 50, 210, this.canvasHeight - 42, 110, 35);
        this.context.fillText(this.avtomat_catridge, 300, this.canvasHeight - 12);

        this.context.font = "26px finger_paint";
        this.context.roundRect( this.canvasWidth - 95, this.canvasHeight - 45, 90, 40);
        this.context.drawImage(this.image, 800, 800, 50, 50, this.canvasWidth - 43, this.canvasHeight - 42, 35, 35);
        this.context.fillText(game.killed_enemies, this.canvasWidth - 90, this.canvasHeight - 15);

        this.context.roundRect( this.canvasWidth - 290, this.canvasHeight - 45, 185, 40);
        this.context.fillText('Score :', this.canvasWidth - 285, this.canvasHeight - 17);
        this.context.fillText(game.score, this.canvasWidth - 180, this.canvasHeight - 17);

        this.context.roundRect( this.canvasWidth - 440, this.canvasHeight - 45, 140, 40);
        this.context.drawImage(this.image, 1150, 0, 50, 50, this.canvasWidth - 425, this.canvasHeight - 40, 30, 30);
        this.context.fillText(game.time, this.canvasWidth - 380, this.canvasHeight - 17);
        
        if(this.isCooldawn) {
            this.context.fillStyle = 'rgba(255,0,0,0.2)';
            this.context.fillRect( 205, this.canvasHeight - 45, 120,this.cd_index);
        }
        if(this.catridge == 0) {
            this.context.fillStyle = 'rgba(255,0,0,0.2)';
            this.context.fillRect(156, this.canvasHeight - 44, 38, 38);
        }
        if(this.isShoot) {
            this.context.fillStyle = 'rgba(255,255,0,0.1)';
            this.context.fillRect(156, this.canvasHeight - 44, 38, 38);
        }
        if(this.isHit) {
            this.context.fillStyle = 'rgba(255,255,0,0.1)';
            this.context.fillRect( 106, this.canvasHeight - 44, 38, 38);
        }
        if(this.isHail) {
            this.context.fillStyle = 'rgba(255,255,0,0.1)';
            this.context.fillRect( 205, this.canvasHeight - 45, 120,40);
        }
    };

    this.pistol_reload = function() {
          setTimeout(function() {
              game.hero.catridge = 8;
          }, 2000);
    };

    this.fire = function() {
        this.bah++;
        this.bulletPool.get(this.x, this.y, 10);
    };

    this.check_hand_hit = function () {
        for(var r = 0; r < game.gamePool.pool.length; r++) {
            if(game.gamePool.pool[r].isAlive) {
                if ((game.gamePool.pool[r].x < this.x + 40 && game.gamePool.pool[r].y + 100 > this.y + 80 && game.gamePool.pool[r].y + 80 < this.y + 100)){
                    game.gamePool.pool[r].hitting('hand', r);
                }
            }
        }
    }
    
}

Hero.prototype = new Drawable();
