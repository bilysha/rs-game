var game = new Game();
var animation;
var isRestart = false;
var isMenu = false;

function start_game() {
    hide_pregame();
    show_canvas();
    init_game();
}

function init_game() {
    if(game.init())
        game.start();
}

function printNumbersInterval(a, b) {
    let sec = b;
    let min = a;
    return function () {
        sec++;
        if (sec === 60) {
            min++;
            sec = 0;
        }
        if (min < 10 && min[0] != '0') {
            min = "0" + min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }
        game.time = min + ":" + sec;
    };
}

function Game() {
    this.init = function() {

        this.canvas = document.getElementById('background');
        this.canvas.height = 630;
        this.canvas.width = 1200;

        if (this.canvas.getContext) {
            this.context = this.canvas.getContext('2d');
            
            Sky.prototype.context = this.context;
            Ground.prototype.context = this.context;

            Hero.prototype.context = this.context;
            Hero.prototype.canvasWidth = this.canvas.width;
            Hero.prototype.canvasHeight = this.canvas.height;

            Bullet.prototype.context = this.context;
            Bullet.prototype.canvasWidth = this.canvas.width;
            Bullet.prototype.canvasHeight = this.canvas.height;

            Enemy.prototype.context = this.context;
            Enemy.prototype.canvasWidth = this.canvas.width;
            Enemy.prototype.canvasHeight = this.canvas.height;

            this.enemy_arr = ['boy', 'man', 'girl'];
            this.killed_enemies = 0;

            this.score = 0;
            
            this.headShots = 0;
            this.bodyShots = 0;
            this.legsShots = 0;

            this.time = '00:00';
            this.timer = setInterval(printNumbersInterval(0, 0), 1000);

            this.sky = new Sky();
            this.sky.init(0,0);
            this.ground = new Ground();
            this.ground.init(0, 0);


            this.hero = new Hero();
            this.hero.init(50,350);
            this.enemy = new Enemy('boy');
            this.enemy.init(1200, 400);

            this.gamePool = new EntitiesPool();
            this.gamePool.addObject(game.enemy);
            this.gamePool.addObject(game.hero);

            this.pool = setInterval(function() {
                game.enemy = new Enemy(game.enemy_arr[Math.floor(Math.random() * 3)]);
                game.enemy.init(1250,  Math.round(250 - 0.5 + Math.random() * (470 - 250 + 1)));
                game.gamePool.addObject(game.enemy);
            }, 2100);

            return true;
        } else {
            return false;
        }
    };

    this.start = function() {
        animate();
    };

    this.gameOver = function() {
        window.cancelAnimationFrame(animation);
        clearInterval(game.pool);
        clearInterval(game.timer);
        document.getElementsByClassName('hero_score')[0].innerHTML = game.score;
        document.getElementsByClassName('hero_time')[0].innerHTML = game.time;
        document.getElementsByClassName('hero_kills')[0].innerHTML = game.killed_enemies;
        document.getElementsByClassName('hero_accuracy')[0].innerHTML = ((game.hero.bah - game.hero.miss)/game.hero.bah * 100).toFixed(1) + '%';
        document.getElementsByClassName('hero_totalShoots')[0].innerHTML = game.hero.bah;
        document.getElementsByClassName('hero_missed')[0].innerHTML = game.hero.miss;
        document.getElementsByClassName('hero_headShots')[0].innerHTML = game.headShots;
        document.getElementsByClassName('hero_bodyShots')[0].innerHTML = game.bodyShots;
        document.getElementsByClassName('gameover_container')[0].classList.remove('hide');
    };

    this.pause = function() {
        clearInterval(game.timer);
        clearInterval(game.pool);
        window.cancelAnimationFrame(animation);
        document.getElementsByClassName('game_pause')[0].classList.remove('hide');
        if(!document.getElementsByClassName('confirm_buttons')[0].classList.contains('hide')) {
            document.getElementsByClassName('confirm_buttons')[0].classList.add('hide')
        }
        isRestart = false;
        isMenu = false;
    };
    
    this.continue = function() {
        game.time = game.time.slice(0,2) + ':' + game.time.slice(3,5);
        game.timer = setInterval(printNumbersInterval(+game.time.slice(0,2), +game.time.slice(3,5)),1000);
        
        document.getElementsByClassName('game_pause')[0].classList.add('hide');
        game.pool = setInterval(function() {
            game.enemy = new Enemy(game.enemy_arr[Math.floor(Math.random() * 3)]);
            game.enemy.init(1200,  Math.round(250 - 0.5 + Math.random() * (470 - 250 + 1)));
            game.gamePool.addObject(game.enemy);
        }, 2100);
        set_volume();
        animate();
    }
}

function animate() {
    animation = requestAnimFrame(animate);
    game.sky.draw();
    game.ground.draw();
    game.gamePool.animate();
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback, element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    this.beginPath();
    this.moveTo(x + radius.tl, y);
    this.lineTo(x + width - radius.tr, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    this.lineTo(x + width, y + height - radius.br);
    this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    this.lineTo(x + radius.bl, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    this.lineTo(x, y + radius.tl);
    this.quadraticCurveTo(x, y, x + radius.tl, y);
    this.closePath();
    if (fill) {
        this.fill();
    }
    if (stroke) {
        this.stroke();
    }

};

function hide_pregame() {
    document.getElementsByClassName('pre_game')[0].classList.remove('show');
    document.getElementsByClassName('pre_game')[0].classList.add('hide');
}
function show_canvas() {
    document.getElementById('background').classList.remove('hide');
    document.getElementById('background').classList.add('show');
}

function premain_menu() {
    if(document.getElementsByClassName('confirm_buttons')[0].classList.contains('hide')) {
        document.getElementsByClassName('confirm_buttons')[0].classList.remove('hide')
    }
    isRestart = false;
    isMenu = true;
    
}
function main_menu() {
    window.cancelAnimationFrame(animation);
    clearInterval(game.kok);
    clearInterval(game.timer);
    if(!document.getElementsByClassName('gameover_container')[0].classList.contains('hide')) {
        document.getElementsByClassName('gameover_container')[0].classList.add('hide');
    }
    document.getElementById('background').classList.remove('show');
    document.getElementById('background').classList.add('hide');
    document.getElementsByClassName('pre_game')[0].classList.remove('hide');
    document.getElementsByClassName('pre_game')[0].classList.add('show');
}

function show_options() {
    document.getElementsByClassName('options')[0].classList.toggle('show_options');
}
function show_about() {
    document.getElementsByClassName('about')[0].classList.toggle('show_about');
}

function prerestart_game() {
    if(document.getElementsByClassName('confirm_buttons')[0].classList.contains('hide')) {
        document.getElementsByClassName('confirm_buttons')[0].classList.remove('hide')
    }
    isRestart = true;
    isMenu = false;
}
function restart_game() {
    if(!document.getElementsByClassName('gameover_container')[0].classList.contains('hide')) {
        document.getElementsByClassName('gameover_container')[0].classList.add('hide');
    }
    init_game();
}

function confirm_controller() {
    if(isRestart) {
        if(!document.getElementsByClassName('gameover_container')[0].classList.contains('hide')) {
            document.getElementsByClassName('gameover_container')[0].classList.add('hide');
        }
        if(!document.getElementsByClassName('game_pause')[0].classList.contains('hide')) {
            document.getElementsByClassName('game_pause')[0].classList.add('hide');
        }
        init_game();
    }
    
    if(isMenu) {
        window.cancelAnimationFrame(animation);
        clearInterval(game.kok);
        clearInterval(game.timer);
        if(!document.getElementsByClassName('gameover_container')[0].classList.contains('hide')) {
            document.getElementsByClassName('gameover_container')[0].classList.add('hide');
        }
        if(!document.getElementsByClassName('game_pause')[0].classList.contains('hide')) {
            document.getElementsByClassName('game_pause')[0].classList.add('hide');
        }
        document.getElementById('background').classList.remove('show');
        document.getElementById('background').classList.add('hide');
        document.getElementsByClassName('pre_game')[0].classList.remove('hide');
        document.getElementsByClassName('pre_game')[0].classList.add('show');
    }
}

function desagree() {
    isRestart = false;
    isMenu = false;
    document.getElementsByClassName('confirm_buttons')[0].classList.add('hide')
}

function set_volume() {
    let elements = document.getElementsByName('sound');
    let param;
    elements.forEach(function(item){
        if (item.checked) {
            param = item.getAttribute('value');
        }
    });
    audioRepository.arr.forEach(function(i) {
        i.volume = param;
    });
}

function onLoad() {
    document.getElementsByClassName('pre_game_btnStart')[0].addEventListener('click', start_game);
    document.getElementsByClassName('pre_game_btnPrologue')[0].addEventListener('click', show_about);
    document.getElementsByClassName('pre_game_btnOptions')[0].addEventListener('click', show_options);
    document.getElementsByClassName('gameover_btnRestart')[0].addEventListener('click', restart_game);
    document.getElementsByClassName('gameover_btnMenu')[0].addEventListener('click', main_menu);
    document.getElementsByClassName('pause_btnContinue')[0].addEventListener('click', game.continue);
    document.getElementsByClassName('pause_btnRestart')[0].addEventListener('click', prerestart_game);
    document.getElementsByClassName('pause_btnMenu')[0].addEventListener('click', premain_menu);
    document.getElementsByClassName('pause_btnConfirm')[0].addEventListener('click', confirm_controller);
    document.getElementsByClassName('pause_btnNo')[0].addEventListener('click', desagree);
}

document.addEventListener("DOMContentLoaded", onLoad);

