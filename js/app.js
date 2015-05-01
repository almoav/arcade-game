// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.row = Math.max(Math.round(Math.random() * 3), 1);
    this.speed = (Math.random() + .5) * 200;
    this.x = (Math.random() * 450) - 50;
    this.y = (83 * this.row) -10;
}

Enemy.prototype.reset = function() {
    this.row = Math.max(Math.round(Math.random() * 3), 1);
    this.speed = (Math.random() + .5) * 200;
    this.x = (Math.random() * -500) - 50;
    this.y = (83 * this.row) -10;    
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers. 
    this.x += (this.speed*dt);

    if (this.y === player.y && Math.abs(player.x-this.x) < 60) {
        console.log("wasted");
        resetLevel();
    } else if (this.x > 500) {
        this.reset();
    }
}


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.reset()
}

Player.prototype.reset = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = (83 * 5) - 10;    
}


Player.prototype.update = function(dt) {
    if (this.y < 0) {
        //console.log("level beaten");
        nextLevel();
        resetLevel();
    }
}


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
}


Player.prototype.handleInput = function(key) {
    // takes player input and translates into player position
    if (key === "left"){
        ((this.x === -2) ? null : this.x -= 101);
    } else if (key === "up") {
        ((this.y === -10) ? null : this.y -= 83);
    } else if (key === "right") {
        ((this.x === 402) ? null : this.x += 101);
    } else if (key === "down") {
        ((this.y === 405) ? null : this.y += 83);
    }        

    //console.log(this.x, this.y);
}

// level stuff

var resetLevel = function() {
    // convenience function for resetting enemies and player 
    // simultaneously
    player.reset()
    for (enemy in allEnemies) {
        allEnemies[enemy].reset();
    }
}

var nextLevel = function() {
    // increment the number of enemies
    level++;
    console.log("level ", level);
    bug = new Enemy();
    allEnemies.push(bug);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
//var bug1 = new Enemy();
//var bug2 = new Enemy();
//var bug3 = new Enemy();
var level = 1;
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];

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
