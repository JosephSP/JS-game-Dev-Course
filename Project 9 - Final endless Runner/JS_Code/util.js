export function drawStatusText(context, input, player){
    context.font = '50px Helvetica';
    context.fillText('last input: ' + input.lastKey, 50 , 100);
    context.fillText('Active state: ' + player.currentState.state, 20, 30);
}