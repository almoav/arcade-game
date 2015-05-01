// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.reset();
}

Enemy.prototype.reset = function() {
    this.row = Math.max(Math.round(Math.random() * 3), 1);
    this.speed = (Math.random() + .5) * 200;
    this.x = (Math.random() * 500) - 150;
    this.y = (83 * this.row) -10; 
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers. 
    //console.log(dt);
    

    this.x += (this.speed*dt);

    if (this.y === player.y && Math.abs(player.x-this.x) < 60) {
        player.lives -= 1;
        if (player.lives > 0) {
            console.log("wasted. lives remaining: %".replace("%", player.lives));
            resetLevel();            
        }  else {
            //TODO reset game
            console.log("game over.")
            resetGame();
        }

    } else if (this.x > 500) {
        //wrap the enemy around to start
        this.x = (Math.random() * -450) - 50;
        this.row = Math.max(Math.round(Math.random() * 3), 1);
        this.y = (83 * this.row) -10;
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
    this.lives = 3;
    this.sprite = 'images/char-boy.png';
    this.reset()
}

Player.prototype.reset = function() {
    this.x = 200;
    this.y = (83 * 5) - 10;    
}

Player.prototype.update = function() {
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
}


var Message = function() {
    //used for storing and displaying messages to the canvas
    //message storage/input
    this.msg = "new";
    this.reset();
}

Message.prototype.update = function() {
    //Does nothing
}


Message.prototype.reset = function(msg) {
    this.start = Date.now();
    this.count = 10;
    this.msg = msg;
}
 
Message.prototype.render = function() {
    //display render message to canvas
    //need to track length of message display and microseconds 
    //since dislpay start
    var len = 1500.0;
    var ms = Date.now() - this.start;
    var alpha = 1.0;
    var Cr = 255;
    if (ms < len) {
        //console.log(ms);
        // fade alpha over length of display
        alpha = (len - ms)/len;
        //fade color over time
        Cr *= alpha;
        console.log("$,$,$".replace(/[$]/g, Cr));
        ctx.fillStyle = "rgba(255,255,255,%)".replace("%", alpha);
        ctx.strokeStyle = "rgba(0,120,0,%)".replace("%", alpha);
        ctx.fillText(this.msg, 250, 275);
        ctx.strokeText(this.msg, 250, 275);
    }
    message.count--;
}



var Clock = function() {
    this.start = Date.now();
}

Clock.prototype.timestep = function(dt) {
    //Does nothing
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player, level, allEnemies, clock, message;

var resetGame = function() {
    player = new Player();
    clock = new Clock();
    message = new Message();
    level = 1;
    allEnemies = [new Enemy(), new Enemy(), new Enemy()];
    console.log("level %".replace("%", level));
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
    // handles level progression
    level++;
    //console.log("level %".replace("%", level));
    message.reset("level %".replace("%", level));
    
    // increment the number of enemies
    bug = new Enemy();
    allEnemies.push(bug);

    // bonus life every 10 levels
    if (level % 10 === 0) {
        player.lives++;
        console.log("+1, lives remaining: %".replace("%", player.lives));
    }
}

resetGame();

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
