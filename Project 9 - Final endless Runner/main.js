/** @type {HTMLCanvasElement} */
import Player from "./JS_Code/player.js";
import InputHandler from "./JS_Code/input.js";
import {drawStatusText} from "./JS_Code/util.js";
import {Background} from "./JS_Code/background.js";
import {FlyingEnemy, GroundEnemy, ClimbingEnemy} from "./JS_Code/enemies.js";
import {UI} from "./JS_Code/UI.js";



window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    class Game {
        constructor(width,height){
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 3;
            this.background = new Background(this);

            this.player  = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.particles = [];
            this.collisions = [];
            this.maxParticles = 200;

            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;

            this.debug = false;
            this.score = 0;

            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 2000 * 5;
            this.gameOver = false;
            this.lives = 5;
            this.floatingMessages = [];
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();

        }
        update(deltaTime){
            // timer handle
            this.time += deltaTime;
            if (this.time > this.maxTime) this.gameOver = true;

            // Background Handle
            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            // handleEnemies
            if (this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                enemy.markedForDeletion ? this.enemies.splice(this.enemies.indexOf(enemy), 1): NaN;
            })

            // message handler floatingMessages

            this.floatingMessages.forEach(message => {
                message.update(deltaTime);
                message.markedForDeletion ? this.floatingMessages.splice(this.floatingMessages.indexOf(message), 1): NaN;
            })
            // Particles handle
            this.particles.forEach((particle, index) => {
                particle.update();
                particle.markedForDeletion ? this.particles.splice(index, 1): NaN;
            })
            this.particles.length > this.maxParticles ? this.particles = this.particles.slice(0, this.maxParticles): NaN;

            // handle colliions sprites
            this.collisions.forEach((collision, index) =>{
                collision.update(deltaTime);
                collision.markedForDeletion ? this.collisions.splice(index, 1) : NaN ;
            })
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            })
            this.particles.forEach(particle => {
                particle.draw(context);
            })
            this.collisions.forEach(collision => {
                collision.draw(context);
            })
            this.floatingMessages.forEach(message => {
                message.draw(context);
            })
            this.ui.draw(context)

        }
        addEnemy(){
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this))
            this.enemies.push(new FlyingEnemy(this));
        }
    }



    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width,canvas.height)
        game.update(deltaTime);
        game.draw(ctx);
        !game.gameOver ? requestAnimationFrame(animate): NaN;
    }
    animate(0)
})

// quedamos en el minuto 2:24:00 del tutorial
// https://www.youtube.com/watch?v=GFO_txvwK_c&ab_channel=freeCodeCamp.org