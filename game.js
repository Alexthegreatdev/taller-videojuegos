const up = document.querySelector('#up');
const left = document.querySelector('#left');
const right = document.querySelector('#right');
const down = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanBestTime = document.querySelector('#bestTime');

const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
let canvasSize;
let elementSize;

let currentLvl = 0;
let lives = 3;

let eventListenerStatus = false;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
};

const giftPosition = {
    x: undefined,
    y: undefined,
};

let enemiesArray = [];
let isTotalenemies = false;

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function eventListeners(status) {
    if (!status) {
        up.addEventListener('click', upFunction = () => { mover(0 , elementSize * -1) });
        left.addEventListener('click', leftFunction = () => { mover((elementSize * -1) ,0) });
        right.addEventListener('click', righttFunction = () => { mover(elementSize ,  0) });
        down.addEventListener('click', downFunction = () => { mover(0 , elementSize ) });
        
        window.addEventListener('keydown', keys = (e) =>{ 
            
            switch (e.code) {
                case 'ArrowUp':
                    mover(0 , elementSize * -1);
                    break;
                case 'ArrowLeft':
                    mover((elementSize * -1) ,0);
                break;
                        
                case 'ArrowRight':
                    mover(elementSize ,  0);
                break;
                
                case 'ArrowDown':
                    mover(0 , elementSize );
                break;
        
                default:
                    console.warn('Solo usar teclas flecha');
                    break;
            }
        });
        eventListenerStatus = true;
    } else {
        up.removeEventListener('click', upFunction, false);
        left.removeEventListener('click', leftFunction, false);
        right.removeEventListener('click', righttFunction, false);
        down.removeEventListener('click', downFunction, false);
        window.removeEventListener('keydown', keys, false);
        eventListenerStatus = false;
    }
}

function setCanvasSize() {
    canvasSize = window.innerHeight > window.innerWidth ? window.innerWidth * 0.8 : window.innerHeight * 0.8;
    
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    
    elementSize = canvasSize / 10;
    startGame();
    eventListeners(eventListenerStatus);
}

function startGame() {
    livesRender();
    bestTimeRender();

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(() => {
            timeRender();
        }, 100);
    }

    game.clearRect(0, 0, canvasSize, canvasSize);

    game.font = elementSize + 'px Verdana';        
    game.textAlign = 'end'; 

    const map = maps[currentLvl];
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementSize * (colI + 1);
            const posY = elementSize * (rowI + 1);

            if(col == 'O' && (playerPosition.x == undefined && playerPosition.y == undefined )) {
                playerPosition.x = posX;
                playerPosition.y = posY;
            }
            game.fillText(emoji, posX, posY);

            if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            }
            if (col == 'X' && !isTotalenemies) {
                enemiesArray.push({
                    x:posX,
                    y:posY
                })
            }
        });
    });

    isTotalenemies = true;

    game.fillText(emojis['PLAYER'], playerPosition.x , playerPosition.y);
}

function mover(x, y) {

    const datax = Math.ceil(playerPosition.x += x);
    const datay = Math.ceil(playerPosition.y += y);

    if ((datax > Math.ceil(canvasSize) || datax <= elementSize) || (datay > Math.ceil(canvasSize) || datay < elementSize)) {
        playerPosition.x -= x;
        playerPosition.y -= y;
        console.warn('No te puedes mover en esa dirrecion pana, intenta pa otro lado');
    } else {
        startGame();
        game.fillText(emojis['PLAYER'],datax , datay);
    }

    if (colision(playerPosition, giftPosition)) {
        if (currentLvl == (maps.length - 1)) {
            localStorage.setItem("bestTime", timePlayer)
            bestTimeRender()
            if (timePlayer <= localStorage.bestTime) {
                bestTimeRender()
            }
            console.warn('terminaste el juego');
            game.fillText(emojis['WIN'], playerPosition.x , playerPosition.y);
            clearInterval(timeInterval);
            return;
            // !al terminar el juego podria mandar un reset
        }
        game.fillText(emojis['WIN'], playerPosition.x , playerPosition.y);
        console.log('pasaste el nivel');
        currentLvl += 1;
        restartGame();
    }
    
    enemiesArray.forEach(enemy => {
        if (colision(playerPosition, enemy) && (lives > 0)) {
            game.fillText(emojis['BOMB_COLLISION'], playerPosition.x , playerPosition.y);
            lives--;
            console.warn(`Te quedan ${lives} vidas`);
            restartGame();
            //!En vez de usar un set.. podria agregar la funcion start.. a un botton para reiniciar el juego
        } else if (!lives) {
            resetGame();
        }
    });
}

function restartGame() {
    isTotalenemies = false;
    enemiesArray = [];
    eventListeners(eventListenerStatus);
    setTimeout(() => {
        playerPosition.y = undefined;
        playerPosition.x = undefined;
        eventListeners(eventListenerStatus);
        startGame();
    },'400');
}

function resetGame() {
    eventListeners(eventListenerStatus);
    livesRender();    
    clearInterval(timeInterval);
    timeStart = undefined;
    setTimeout(() => {
        console.warn('Perdiste el juego');
        currentLvl = 0;
        lives = 3;
        eventListeners(eventListenerStatus);
        restartGame();
    },'100');
}

function colision(player, target) {
    if (Math.ceil(player.x) == Math.ceil(target.x) && Math.ceil(player.y) == Math.ceil(target.y)) {
        return true;
    }
    return false;
}

function livesRender() {
    if (!lives) {
        spanLives.innerText = "";    
    } else {
        spanLives.innerText = "";
        for (let index = 1; index <= lives; index++) {
            spanLives.innerText += emojis['HEART'];
        }
    }   
}

function timeRender() {
    timePlayer =  Math.trunc((Date.now() - timeStart) / 1000);
    spanTime.innerText = timePlayer;
}

function bestTimeRender() {
    spanBestTime.innerText = !localStorage.bestTime ? 0 : localStorage.bestTime ;
}