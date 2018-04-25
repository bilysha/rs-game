function Bullet() {
    this.isAlive = false;

    this.spawn = function(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.isAlive = true;
    };

    this.draw = function() {
        this.x += this.speed;
        if (this.x >= this.canvasWidth) {
            game.hero.miss++;
            return true;
        }
        else {
            this.context.drawImage(imageRepository.bullet, this.x + 60, this.y + 50);
        }
    };

    this.clear = function() {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.isAlive = false;
    };
}

function Pool(maxSize) {
    var size = maxSize; 
    this.pool = [];

    this.init = function() {
        for (var i = 0; i < size; i++) {
            var bullet = new Bullet();
            bullet.init(0,0, imageRepository.bullet.width, imageRepository.bullet.height);
            this.pool[i] = bullet;
        }
    };

    this.getPool = function() {
        return this.pool;
    };
    
    this.get = function(x, y, speed) {
        if(!this.pool[size - 1].isAlive) {
            this.pool[size - 1].spawn(x, y, speed);
            this.pool.unshift(this.pool.pop());
        }
    };

    this.animate = function() {
        for (var i = 0; i < size; i++) {
            if (this.pool[i].isAlive) {
                if (this.pool[i].draw()) {
                    this.pool[i].clear();
                    this.pool.push((this.pool.splice(i,1))[0]);
                }
            }
            else
                break;
        }
    };
    
    this.check_hitting = function() {
        for(var i = 0; i < size; i++) {
            if(this.pool[i].isAlive) {
                for(var j = 0 ; j < game.gamePool.pool.length; j++)
                {
                    if(game.gamePool.pool[j].isAlive) {
                        if((this.pool[i].x + 40 > game.gamePool.pool[j].x) &&
                            (this.pool[i].x + 40 < game.gamePool.pool[j].x + 40) &&
                            (this.pool[i].y > game.gamePool.pool[j].y - 60) &&
                            (this.pool[i].y < game.gamePool.pool[j].y + 50)) {
                            game.gamePool.pool[j].hitting('pistol', j, this.pool[i].y, game.gamePool.pool[j].y);
                            this.pool[i].clear();
                        }
                    }
                }
                if (this.pool[i].draw()) {
                    this.pool[i].clear();
                    this.pool.push((this.pool.splice(i,1))[0]);
                }
            }
        }
    }
}

Bullet.prototype = new Drawable();
