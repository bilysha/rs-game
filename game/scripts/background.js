function Sky() {
    this.speed = 0.2;
    this.draw = function() {
        this.x += this.speed;
        this.context.drawImage(imageRepository.sky, this.x, this.y);
        this.context.drawImage(imageRepository.sky, this.x - imageRepository.sky.width, this.y );
        if (this.x >= imageRepository.sky.width)
            this.x = 0;
    };
}

Sky.prototype = new Drawable();

function Ground() {
    this.draw = function() {
        this.context.drawImage(imageRepository.ground, this.x, this.y);
    }
}

Ground.prototype = new Drawable();
