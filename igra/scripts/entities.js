function EntitiesPool() {
    this.size = 0;
    this.pool = [];

    this.addObject = function(obj) {
        this.pool.push(obj);
        this.size++;
    };

    this.clear = function() {
        for (var j = 0; j < this.size; j++) {
            if(!this.pool[j].isDraw) {
                this.pool.splice(j, 1);
                this.size--;
            }
        }
    };

    this.animate = function() {
        game.gamePool.pool.sort(function(a, b) {return a.y > b.y ? 1 : -1});
        for (var i = 0; i < this.size; i++) {
            if (this.pool[i].isDraw) {
                this.pool[i].draw();
            }
            if(this.pool[i] instanceof Enemy && this.pool[i].x < -80) {
                game.hero.citizens--;
                audioRepository.citizen_cry_sound.play();
                if(game.hero.citizens == 0) {
                    game.gameOver();
                }
                this.pool.splice(i, 1);
                this.size--;
            }
        }
    };
}
