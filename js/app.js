// Enemies our player must avoid
var Enemy = function(row, offset) {
    /*  param: row      | int [1-3]     | cobblestone tile 
        row to birth enemy object

        param: offset   |   int         | x-offset birth 
        position
    */
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = offset;
    this.y = (83 * row) -20;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    //console.log("update enemy");
    //console.log(dt);
    this.x += (200*dt);


}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = (83 * 5) - 20;
}

Player.prototype.update = function(dt) {
    //clamp x between -2 and 402;
    //this.x = Math.min(Math.max(this.x, -2), 402);
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
}

Player.prototype.handleInput = function(key) {
    //TODO: translate key presses into directional movement
    if (key === "left"){
        ((this.x === -2) ? null : this.x -= 101);
    } else if (key === "up") {
        ((this.y === -20) ? null : this.y -= 83);
    } else if (key === "right") {
        ((this.x === 402) ? null : this.x += 101);
    } else if (key === "down") {
        ((this.y === 395) ? null : this.y += 83);
    }        
    

    //Player.update(move);
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var bug1 = new Enemy(2, -200);
var bug2 = new Enemy(3, -400);
var allEnemies = [bug1, bug2];



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
