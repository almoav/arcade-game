/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire 'scene'
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        topScore = 0;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    
    //ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.font = 'bold 36pt impact';
    ctx.textAlign = 'center';

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    };

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        if (gameScore > topScore) {
            topScore = gameScore;
        }
        // count the current frame
        //clock.timestep(dt);
        // checkCollisions();
    };
    /*
    function checkCollisons();
         allEnemies.forEach(function(enemy) {
            if (enemy.y === player.y) {
                //console.log(player.x/this.x);
                if (Math.abs(player.x-enemy.x) < 60) {
                    console.log('collide');    
        }
        });       
    */
    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allObstacles.forEach(function(obstacle) {
            obstacle.update();
        });

        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        
        allItems.forEach(function(item) {
            item.update(dt);
        });
        
        player.update();
        events.update(dt);
    };

    /* This function initially draws the 'game level', it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        //fill bkg with white
        ctx.save();

        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,505,606);


        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ], 
            charImages = selector.charImages,
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the 'grid'
         */

        //switch between rendering start screen and game play
        if (gameStatus == 'run') {
            //render environment
            for (row = 0; row < numRows; row++) {
                for (col = 0; col < numCols; col++) {
                    ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                }
            }
            renderHud();
            renderEntities();

        } else {
            // start menu
            //fill bkg with grass
            for (row = 0; row < numRows; row++) {
                for (col = 0; col < numCols; col++) {
                    ctx.drawImage(Resources.get('images/grass-block.png'), col * 101, row * 83);
                }            
            }
            //render characters
            selector.render();
            for (image in charImages) {
                ctx.drawImage(Resources.get(charImages[image]), image * 101, 83 * 3 - 30);  
            }
            renderStart();
        }
        ctx.restore();
    };

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allObstacles.forEach(function(item) {
            item.render();
        });  

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        allItems.forEach(function(item) {
            item.render();
        });    

        player.render();
        message.render();
    };

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function renderHud() {
        //render player life, score etc.
        
        ctx.save();

        ctx.font = '16pt impact';
        ctx.textAlign = 'left';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#191919';

        
        //life
        ctx.drawImage(Resources.get(player.sprite), 0, 5, 30, 50)
        if (player.lives < 4){
            for (i=0; i < player.lives; i++) {
                ctx.drawImage(Resources.get('images/Heart.png'), (i+1) * 28, 15, 25, 40)
            };
        } else {
            ctx.drawImage(Resources.get('images/Heart.png'), 28, 15, 25, 40)
            ctx.fillText('x%'.replace('%', player.lives), 68, 45);
        }
        
        //score
        ctx.strokeText('score: %'.replace('%', gameScore), 140, 45);
        ctx.fillText('score: %'.replace('%', gameScore), 140, 45);
        ctx.strokeText('x: %'.replace('%', gameMultiply), 320, 45);
        ctx.fillText('x: %'.replace('%', gameMultiply), 320, 45);

        //level
        ctx.strokeText('level %'.replace('%', gameLevel), 420, 45);
        ctx.fillText('level %'.replace('%', gameLevel), 420, 45);

        ctx.font = '12pt impact';
        //ctx.shadowColor = 'white';
        ctx.strokeText('press q to quit', 10, 602);
        ctx.fillText('press q to quit', 10, 602);

        ctx.restore();

    };

    function renderStart() {
        // render start screen
        ctx.save();

        //game title
        ctx.font = 'bold 48pt impact';
        ctx.textAlign = 'center';
        
        grad = ctx.createLinearGradient(0,120,0,160);
        grad.addColorStop(.1, '#FFD980');
        grad.addColorStop(.3, 'white');
        grad.addColorStop(.8, '#FFCC00');
        
        ctx.fillStyle = grad;
        ctx.strokeStyle = 'black 10px';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#191919';
        
        ctx.strokeText('Bug Force 5', 250, 160);
        ctx.fillText('Bug Force 5', 250, 160);

        ctx.restore(); 

        ctx.font = '16pt impact';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#33CC33';
        ctx.fillStyle = '#FF5050'
        ctx.strokeStyle = 'black 1px';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#191919';
        
        ctx.strokeText('top score: %'.replace('%', topScore), 250, 195);
        ctx.fillText('top score: %'.replace('%', topScore), 250, 195);
        ctx.strokeText('press [enter] to start', 250, 425);
        ctx.fillText('press [enter] to start', 250, 425);
        
        ctx.restore();
    };


    function reset() {
        //console.log('reset');
    };

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Selector.png',
        'images/Heart.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Rock.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
    global.canvas = canvas;

})(this);
