const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
let canvasSize;
let elementSize;
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    canvasSize = window.innerHeight > window.innerWidth ? Math.floor(window.innerWidth * 0.8) : Math.floor(window.innerHeight * 0.8);
    
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    
    elementSize = Math.floor(canvasSize / 10);
    startGame()
}

function startGame() {
    console.log({elementSize, canvasSize});

    game.font = elementSize + 'px Verdana';        
    game.textAlign = 'end';  
    
    const map = maps[0];
    const mapRows = map.trim().split('\n')
    const mapCols = mapRows.map(row => row.trim().split(''))
    console.log(map, mapRows, mapCols);

    for (let row = 1; row <= 10; row++) {
        for (let col = 1; col <= 10; col++) {
            game.fillText(emojis[mapCols[row - 1][col - 1]], elementSize * col , elementSize * row );    
        }
    }
}