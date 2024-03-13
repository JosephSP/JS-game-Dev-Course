/** @type {HTMLCanvasElement} */
window.addEventListener('load', function(){
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1400;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;
    const fullScreenButton = document.getElementById('fullScreenButton');

    class InputHandler {
        constructor(){
            this.keys = [];
            this.posibleKeys = ['ArrowUp', 'w', 'swipe up', 'ArrowDown', 's', 'swipe down', 'ArrowLeft','a', 'ArrowRight', 'd'];
            this.touchY = '';
            this.touchTreshold = 30;
            window.addEventListener('keydown', e =>{
                if (this.posibleKeys.includes(e.key) && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                } else if (e.key === 'Enter' && gameOver) restartGame();
            })
            window.addEventListener('keyup', e =>{
                if (this.keys.includes(e.key) ){
                    this.keys.splice(this.keys.indexOf(e.key),1);
                }
            })
            window.addEventListener('touchstart', e =>{
                this.touchY = e.changedTouches[0].pageY
            })
            window.addEventListener('touchmove', e =>{
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                if( swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
                else if ( swipeDistance >this.touchTreshold && this.keys.indexOf('swipe down') === -1) {
                    this.keys.push('swipe down');
                    if (gameOver) restartGame();
                };
            })
            window.addEventListener('touchend', e =>{
                this.keys.splice(this.keys.indexOf('swipe up'), 1);
                this.keys.splice(this.keys.indexOf('swipe down'), 1);

            })

        }

    }

    class Player {
        constructor(gameWidth,gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 100;
            this.y = this.gameHeight-this.height;
            this.image = document.getElementById('playerImage');
            this.leftMovKeys = ['ArrowLeft','a']
            this.rightMovKeys = ['ArrowRight', 'd']
            this.jumpMovKeys = ['ArrowUp', 'w', 'swipe up']
            this.frameX = 0;
            this.frameY = 0;
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
            this.maxframe = 8;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/ this.fps;

        }

        restart(){
            this.x = 100;
            this.y = this.gameHeight-this.height;
            this.frameY = 0;
            this.maxframe = 8;


        }
        draw(context){
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, 
                this.width, this.height, this.x,this.y,this.width,this.height);
        }
        update(input, deltaTime, enemies){
            // colision detection
            enemies.forEach(enemy => {
                const dx = enemy.x + enemy.width/2 - 20 - this.x - this.width/2;
                const dy = enemy.y + enemy.height/2 - this.y - this.height/2 - 20;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < enemy.width/3 + this.width/3){
                    gameOver = true;
                }
            })

            // Sprite animation
            if (this.frameTimer > this.frameInterval){
                if (this.frameX >= this.maxframe) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }

            // Controls:
            // horizontal movement:
            if (input.keys.includes(this.leftMovKeys[0]) || input.keys.includes(this.leftMovKeys[1])){
                this.speed = -5;
            } else if (input.keys.includes(this.rightMovKeys[0]) || input.keys.includes(this.rightMovKeys[1])){
                this.speed = 5;
            } else if ((input.keys.includes(this.jumpMovKeys[0]) || input.keys.includes(this.jumpMovKeys[1])
            || input.keys.includes(this.jumpMovKeys[2])) 
            && this.onGround()){
                this.vy -= 30 ;
            } else {
                this.speed = 0;
            }

            this.x += this.speed;

            if (this.x <0) this.x =0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth -this.width;


            this.y += this.vy;

            if (!this.onGround()){
                this.vy += this.weight;
                this.frameY = 1;
                this.maxframe = 5;
            } else {
                this.vy = 0;
                this.frameY = 0;
                this.maxframe = 8;


            }

            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;

        }

        onGround(){
            return this.y >= this.gameHeight - this.height;
        }

    }

    class Background {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            
            this.speed = 8 ;
        }
        draw(context){
            context.drawImage(this.image, this.x,this.y, this.width,this.height);
            context.drawImage(this.image, this.x + this.width - this.speed,this.y, this.width,this.height);

        }
        update(){
            this.x -= this.speed;
            if (this.x < 0 - this.width) this.x = 0;
        }
        restart(){
            this.x = 0;
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('enemyImage');
            this.width = 160;
            this.height = 119;
            this.frameX = 0;
            this.frameY = 0;
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.speed = 8;
            this.maxframe = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/ this.fps;
            this.markedForDeletion = false;
        }
        draw(context){
            context.drawImage(this.image,  this.frameX * this.width,0, 
                this.width, this.height, this.x,this.y, this.width,this.height);
        }
        update(deltaTime){
            if (this.frameTimer > this.frameInterval){
                if (this.frameX >= this.maxframe) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            
            this.x -= this.speed;
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score++;
            }
        }
    }

    function handleEnemies(deltaTime){
        if (enemyTimer > enemyInterval + randomEnemyInterval){
            enemies.push(new Enemy(canvas.width,canvas.height));
            randomEnemyInterval = Math.random() * 1000 + 500

            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }

        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        })

        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    }

    function displayStatusText(context){
        context.textAlign = 'left'
        context.fillStyle = 'white';
        context.font = '40px Helvetica';
        context.fillText('Score: ' + score , 20, 50)
        if (gameOver){
            context.textAlign = 'center';
            context.fillStyle = 'white';
            context.fillText('GAME OVER, try again!, press enter to restart or swipe down', canvas.width/2, 200);
        }
    }

    function restartGame(){
        player.restart();
        background.restart();
        enemies = [];
        score = 0;
        gameOver = false;
        animate(0);
    }

    function toggleFullscreen(){
        if (!document.fullscreenElement){
            canvas.requestFullscreen().catch(err =>{
                alert(`Error, can't enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    fullScreenButton.addEventListener('click', toggleFullscreen);

    const input = new InputHandler();
    const player = new Player(canvas.width,canvas.height);
    const background = new Background(canvas.width,canvas.height);

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 750;
    let randomEnemyInterval = Math.random() * 1000 + 500

    function animate(timestamp){
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        background.draw(ctx);
        // background.update();

        player.draw(ctx);
        player.update(input, deltaTime, enemies);
        handleEnemies(deltaTime)
        displayStatusText(ctx);

        if (!gameOver) requestAnimationFrame(animate);

    }
    animate(0)
})


// quedamos en el minuto 2:24:00 del tutorial
// https://www.youtube.com/watch?v=GFO_txvwK_c&ab_channel=freeCodeCamp.org