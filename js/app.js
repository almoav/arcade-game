// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.type = "enemy";
    this.sprite = 'images/enemy-bug.png';
    this.move = true;
    this.reset();
}

Enemy.prototype.reset = function() {
    this.row = Math.max(Math.round(Math.random() * 3), 1);
    this.speed = (Math.random() + .5) * 200;
    this.x = (Math.random() * 500) - 150;
    this.y = (83 * this.row) -36;
    this.move = true; 
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers. 
    if (this.move === true) {
        this.x += (dt * this.speed);
    }
    detectCollision(this);
}

Enemy.prototype.wrap = function() {
    if (this.x > 500) {
        
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Heart = function() {
    //heart item player interacts with
    this.type = "heart";
    this.sprite = 'images/Heart.png';
    //this.x = -50;
    //this.y = 0*83 - 36;
    this.speed = 200;
}




// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.type = "player";
    this.lives = 3;
    this.sprite = 'images/char-boy.png';
    this.reset()
    this.move = true;
}

Player.prototype.reset = function() {
    //place player back at start position
    this.x = 200;
    this.y = (83 * 5) - 36;    
}

Player.prototype.update = function() {
    if (this.y < 0) {
        //do when player reaches water tiles
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
    // only if move attribute is set to true
    if (this.move === true) {
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
        
}

var Selector = function() {
    //subclass of player used in start screen to select
    //character sprite
    Player.call(this);
    this.type = "selector";
    this.sprite = 'images/Selector.png';
    this.x = 0;
    this.y = 83*3-36;
    this.charImages = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
        ];

}
Selector.prototype = Object.create(Player.prototype);
Selector.prototype.constructor = Selector;

Selector.prototype.handleInput = function(key) {
    if (key === "left"){
        ((this.x === -2) ? null : this.x -= 101);
    } else if (key === "right") {
        ((this.x === 402) ? null : this.x += 101);
    } else if (key === "enter") {
        select =  this.x/101;
        player.sprite = this.charImages[select];
        startGame();

    }
}


var Message = function() {
    //used for storing and displaying messages to the canvas
    this.msg = "new";
    this.reset("new game", "regular");
}

Message.prototype.update = function() {
    //Does nothing
}

Message.prototype.reset = function(msg, msgtype) {
    //starts a new message
    this.start = Date.now();
    this.count = 10;
    this.msg = msg;
    this.msgtype = msgtype;
}
 
Message.prototype.render = function() {
    //display render message to canvas
    var len = 1500.0;
    var ms = Date.now() - this.start;
    var alpha = 1.0;
    var Cr = 255;
    var fill = "rgba(#,#,#,%)";
    var bkgfill = "rgba(20,20,20,%)";
    if (ms < len) {
        // fade alpha over length of display
        alpha = (len - ms)/len;
        fill = fill.replace("%", alpha);
        bkgfill = bkgfill.replace("%", alpha);

        //fade color over time
        Cr = parseInt(Cr * alpha * 1.5);
        fill = fill.replace(/[#]/g, Cr);

        //switch stroke color for different message types
        if (this.msgtype === "regular") {
            ctx.strokeStyle = "rgba(0,120,0,%)".replace("%", alpha);            
        } else {
            //disable player movement for death messages
            player.move = false;
            ctx.fillStyle = bkgfill;    
            ctx.fillRect(0,0,505,606);
            ctx.strokeStyle = "rgba(90,0,0,%)".replace("%", alpha);
        }
        
        //text render
        ctx.fillStyle = fill;
        ctx.fillText(this.msg, 250, 275);
        ctx.strokeText(this.msg, 250, 275);
        
    } else {
        player.move = true;
    }
    message.count--;
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player, level, allEnemies, allItems, message, gameStatus, selector;

message = new Message();

var resetGame = function() {
    player = new Player();
    selector = new Selector();
    level = 0;
    allEnemies = [new Enemy(), new Enemy()];
    allItems = [];
    gameStatus = "start";
}

var startGame = function() {
    gameStatus = "run";
    nextLevel();
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
    resetLevel();
    // handles level progression
    level++;
    message.reset("level %".replace("%", level), "regular");
    
    // increment the number of enemies
    bug = new Enemy();
    allEnemies.push(bug);

    // bonus life every 10 levels
    if (level % 10 === 0) {
        player.lives++;
        message.reset("+1", "regular");
    }
}

var detectCollision = function(obj) {
    //container for actions executed with player collisions
    //param: object invoking this method
    if (this.y === player.y && Math.abs(player.x-this.x) < 60) {
        //object has collided
        if (obj.type === "enemy") {
            player.lives -= 1;
            if (player.lives > 0) {
                message.reset("wasted", "death");
                resetLevel();            
            }  else {
                //if player lives less than 1 game is over
                message.reset("game over", "end");
                player.reset();
                setTimeout(resetGame, 2000);
            }        
        } else {
            //TODO collide with other objects
        }
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
        40: 'down',
        13: 'enter'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    selector.handleInput(allowedKeys[e.keyCode]);
});
