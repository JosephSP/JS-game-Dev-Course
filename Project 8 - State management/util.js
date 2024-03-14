export function drawStatusText(context, input){
    context.font = '50px Helvetica';
    context.fillText('last input: ' + input.lastKey, 50 , 100);
}