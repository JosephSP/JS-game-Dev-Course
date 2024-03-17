/** @type {HTMLCanvasElement} */
import Player from "./player.js";
import InputHandler from "./input.js";
import {drawStatusText} from "./util.js";




window.addEventListener('load', function(){
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const player = new Player(canvas.width, canvas.height);
    player.draw(ctx);

    const input = new InputHandler;
    
    let lastTime = 1;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0, canvas.width,canvas.height);
        player.update(input.lastKey);
        player.draw(ctx, deltaTime);
        drawStatusText(ctx, input, player);
        requestAnimationFrame(animate);
    }
    animate(20)
})

// quedamos en el minuto 2:24:00 del tutorial
// https://www.youtube.com/watch?v=GFO_txvwK_c&ab_channel=freeCodeCamp.org