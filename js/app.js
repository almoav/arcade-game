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
    if (this.x > 500) {
        this.wrap();
    }
}

Enemy.prototype.wrap = function() {
    this.x = (Math.random() * -450) - 50;
    this.row = Math.max(Math.round(Math.random() * 3), 1);
    this.y = (83 * this.row) -36;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    scale = 150;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y + 171-scale, 96, scale);    
    //ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Heart = function() {
    //heart item player interacts with
    Enemy.call(this);
    this.type = "heart";
    this.sprite = 'images/Heart.png';
    this.x = -500;
    this.speed = 200;
}
Heart.prototype = Object.create(Enemy.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.render = function() {
    scale = 100;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y + 171-scale, 72, scale);
    
}

Heart.prototype.wrap = function() {
    this.move = false;
}

var GemBlue = function() {
    Enemy.call(this);
    this.type = "gem blue";
    this.sprite = 'images/Gem Blue.png';
    this.speed = 150;
}
GemBlue.prototype = Object.create(Enemy.prototype);
GemBlue.prototype.constructor = GemBlue;

GemBlue.prototype.render = function() {
    scale = 60;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y + 145-scale, 45, scale);
    
}

var GemGreen = function() {
    GemBlue.call(this);
    this.type = "gem green";
    this.sprite = 'images/Gem Green.png';   
}

GemGreen.prototype = Object.create(GemBlue.prototype);
GemGreen.prototype.constructor = GemGreen;

var GemOrange = function() {
    GemBlue.call(this);
    this.type = "gem orange";
    this.sprite = 'images/Gem Orange.png';   
}

GemOrange.prototype = Object.create(GemBlue.prototype);
GemOrange.prototype.constructor = GemOrange;

var Rock = function() {
    //impassable object restricts players movement
    this.type = "rock";
    this.sprite = 'images/Rock.png'
    this.reset();
}

Rock.prototype.reset = function() {
    this.row = Math.max(Math.round(Math.random() * 4), 1);
    this.col = Math.round((Math.random() * 6));
    this.y = (83 * this.row) -36;
    this.x = 101 * this.col;
}

Rock.prototype.update = function() {
    detectCollision(this);
}

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
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
        gameScore += (100 * gameLevel * gameMultiply);
        nextLevel();
        resetLevel();
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
}

Player.prototype.handleInput = function(key) {
    // takes player input and translates into player position
    //store previous position for collision purposes
    this.x_last = this.x;
    this.y_last = this.y;
    // only if move attribute is set to true
    if (this.move === true) {
        if (key === "left"){
            ((this.x === -2) ? null : this.x -= 101);
        } else if (key === "up") {
            ((this.y === -10) ? null : this.y -= 83);
        } else if (key === "right") {
            ((this.x === 402) ? null : this.x += 101);
        } else if (key === "down") {
            ((this.y === 379) ? null : this.y += 83);
        } else if (key === "quit") {
            resetGame();
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
        ((this.x === 0) ? null : this.x -= 101);
    } else if (key === "right") {
        ((this.x === 404) ? null : this.x += 101);
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
    var len = 1200.0;
    if (this.msgtype === "end") {
        len = 2000.0;
    }
    var ms = Date.now() - this.start;
    var alpha = 1.0;
    var Cr = 255;
    var fill = "rgba(#,#,#,%)";
    var bkgfill = "rgba(20,20,20,%)";
    var redFill = "rgba(255,80,80,%";
    if (ms < len) {
        // fade alpha over length of display
        
        alpha = (len - ms)/len;
        fill = fill.replace("%", alpha);
        bkgfill = bkgfill.replace("%", alpha);
        redFill = redFill.replace("%", alpha);

        //fade color over time
        Cr = parseInt(Cr * alpha * 1.5);
        fill = fill.replace(/[#]/g, Cr);

        //switch stroke color for different message types
        if (this.msgtype === "regular") {
            ctx.strokeStyle = "rgba(0,0,0,%)".replace("%", alpha);            
            ctx.fillStyle = fill;
        } else if (this.msgtype === "death") {
            //disable player movement for death messages
            player.move = false;
            ctx.fillStyle = bkgfill;    
            ctx.fillRect(0,0,505,606);
            //ctx.strokeStyle = "rgba(90,0,0,%)".replace("%", alpha);
            ctx.fillStyle = redFill;
            ctx.strokeStyle = "rgba(0,0,0,%)".replace("%", alpha);
        } else if (this.msgtype === "end") {
            player.move = false;
            ctx.fillStyle = "rgb(20,20,20)";
            ctx.fillRect(0,0,505,606);
            ctx.fillStyle = redFill;
            ctx.strokeStyle = "rgba(0,0,0,%)".replace("%", alpha);
        }
        
        //text render
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#191919";        
        ctx.strokeText(this.msg, 250, 275);
        ctx.fillText(this.msg, 250, 275);
        
        
    } else {
        player.move = true;   
    }
    message.count--;

}

var Events = function() {
    //set start time when game starts
    this.gameStart = 0;
    this.levelStart = 0;
    this.gameElapsed = 0;
    this.levelElapsed = 0;
    //heart item genration count down
    this.heartCD = 1000;
    this.multCD = 100;
}

Events.prototype.update = function(dt) {
    this.gameElapsed = Date.now() - this.gameStart;
    this.levelElapsed = Date.now() - this.levelStart;
    //keep the score an integer
    gameScore = parseInt(gameScore);

    //decrease the score multiplier by a factor of delta time
    if (this.multCD <= 0 && gameMultiply > 1) {
        gameMultiply -= 0.25;
        this.multCD = 100;
    }
    this.multCD--; 

    //start generating hearts based on time elapsed
    if (gameLevel > 5) {
        this.genHeart();
    }
}

Events.prototype.resetLevel = function() {
    this.levelStart = Date.now();
}

Events.prototype.genHeart = function() {
    if (this.heartCD <= 0) {
        //console.log("gen heart");
        heart = new Heart();
        allItems.push(heart);
        this.heartCD = 1000;
    }   
    this.heartCD--; 
    //console.log(this.heartCD);

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

//declare object variables
var player, allEnemies, allItems, allObstacles, message, events, selector;
//declare game mechanics variables
var gameLevel, gameScore, gameStatus, gameMultiply;


var resetGame = function() {
    player = new Player();
    selector = new Selector();
    events = new Events();
    message = new Message();
    gameLevel = 0;
    allEnemies = [new Enemy(), new Enemy()];
    allItems = [];
    allObstacles = [];
    gameStatus = "start";
    gameScore = 0;
}

var startGame = function() {
    gameStatus = "run";
    events.start = Date.now();
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
    gameMultiply = 3;
    //allItems.length = 0;
    events.resetLevel();
}

var nextLevel = function() {
    resetLevel();
    // handles level progression
    gameLevel++;
    message.reset("level %".replace("%", gameLevel), "regular");
    
    // increment the number of enemies
    bug = new Enemy();
    allEnemies.push(bug);

    // bonus life every 10 levels
    if (gameLevel % 10 === 0) {
        player.lives++;
        message.reset("level %, +1".replace("%", gameLevel), "regular");
    }

    //append the level items
    allItems = [];
    allObstacles = [];
    //blue gems
    for(i=1; i<gameLevel; i++) {
        allItems.push(new GemBlue());
    }
    //green gems
    for(i=3; i<gameLevel; i+=2) {
        allItems.push(new GemGreen());   
    }
    //orange gems
    for(i=9; i<gameLevel; i+=3) {
        allItems.push(new GemOrange());   
    }

    //rocks
    for(i=9; i<gameLevel; i+=4) {
        allObstacles.push(new Rock());   
    }    
}

var detectCollision = function(obj) {
    //container for actions executed with player collisions
    //param: object invoking this method
    if (obj.y === player.y && Math.abs(player.x-obj.x) < 40) {
        //object has collided
        if (obj.type === "enemy") {
            player.lives--;
            if (player.lives > 0) {
                message.reset("wasted", "death");
                resetLevel();            
            }  else {
                //if player lives less than 1 game is over
                message.reset("game over", "end");
                player.reset();
                setTimeout(resetGame, 2000);
            }        
        } else if (obj.type === "heart") {
            player.lives++
            gameScore += (50 * gameLevel * gameMultiply);
            removeItem(allItems, obj);

        } else if (obj.type === "gem blue") {
            gameScore += (10 * gameLevel * gameMultiply);
            removeItem(allItems, obj);
        } else if (obj.type === "gem green") {
            gameScore += (50 * gameLevel * gameMultiply);
            removeItem(allItems, obj);
        } else if (obj.type === "gem orange") {
            gameScore += (150 * gameLevel * gameMultiply);
            removeItem(allItems, obj);
        } else if (obj.type === "rock") {
            player.x = player.x_last;
            player.y = player.y_last;
        }
    }    
}

var removeItem = function(array, item) {
    //removes an item from an array
    var index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
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
        13: 'enter',
        81: 'quit'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    selector.handleInput(allowedKeys[e.keyCode]);
});


