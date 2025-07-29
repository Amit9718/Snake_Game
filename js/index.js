// Game Constants & Variables
let inputDir = {x: 0, y: 0}; 
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let speed = 9;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13, y: 15}
];

let food = {x: 6, y: 7};
let hiscoreval = 0;
let board = document.getElementById('board');
let scoreBox = document.getElementById('scoreBox');
let hiscoreBox = document.getElementById('hiscoreBox');

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    // console.log(ctime)
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // If you bump into the wall
    if(snake[0].x >= 18 || snake[0].x <=0 || snake[0].y >= 18 || snake[0].y <=0){
        return true;
    }
        
    return false;
}

function gameEngine(){
    // Part 1: Updating the snake array & Food
    if(isCollide(snakeArr)){
        gameOverSound.play().catch(e => console.log('Audio play failed:', e));
        musicSound.pause();
        inputDir = {x: 0, y: 0}; 
        alert("Game Over! Score: " + score + "\nPress any key to play again!");
        snakeArr = [{x: 13, y: 15}];
        musicSound.play().catch(e => console.log('Music play failed:', e));
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if(snakeArr[0].y === food.y && snakeArr[0].x === food.x){
        foodSound.play().catch(e => console.log('Audio play failed:', e));
        score += 1;
        if(score > hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b-a) * Math.random()), y: Math.round(a + (b-a) * Math.random())};
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i>=0; i--) { 
        snakeArr[i+1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if(index === 0){
            snakeElement.classList.add('head');
        }
        else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);


}


// Function to handle direction changes
function changeDirection(direction) {
    console.log('changeDirection called with:', direction);
    console.log('Current inputDir:', inputDir);
    
    moveSound.play().catch(e => console.log('Audio play failed:', e));
    
    // If game hasn't started, start with the requested direction
    if(inputDir.x === 0 && inputDir.y === 0) {
        console.log('Game starting with direction:', direction);
        switch (direction) {
            case "up":
                inputDir = {x: 0, y: -1};
                break;
            case "down":
                inputDir = {x: 0, y: 1};
                break;
            case "left":
                inputDir = {x: -1, y: 0};
                break;
            case "right":
                inputDir = {x: 1, y: 0};
                break;
        }
        return;
    }
    
    // Game is running, change direction with validation
    switch (direction) {
        case "up":
            // Can't go up if currently going down
            if(inputDir.y !== 1) {
                console.log('Changing to up');
                inputDir.x = 0;
                inputDir.y = -1;
            } else {
                console.log('Cannot go up, currently going down');
            }
            break;
        case "down":
            // Can't go down if currently going up
            if(inputDir.y !== -1) {
                console.log('Changing to down');
                inputDir.x = 0;
                inputDir.y = 1;
            } else {
                console.log('Cannot go down, currently going up');
            }
            break;
        case "left":
            // Can't go left if currently going right
            if(inputDir.x !== 1) {
                console.log('Changing to left');
                inputDir.x = -1;
                inputDir.y = 0;
            } else {
                console.log('Cannot go left, currently going right');
            }
            break;
        case "right":
            // Can't go right if currently going left
            if(inputDir.x !== -1) {
                console.log('Changing to right');
                inputDir.x = 1;
                inputDir.y = 0;
            } else {
                console.log('Cannot go right, currently going left');
            }
            break;
    }
    
    console.log('New inputDir:', inputDir);
}

// Main logic starts here
// Try to play music, but handle if blocked by browser
musicSound.play().catch(e => console.log('Music autoplay blocked'));

let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

window.requestAnimationFrame(main);

// Keyboard controls
window.addEventListener('keydown', e => {
    // Prevent default behavior for all game keys
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
    }
    
    switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
            changeDirection("up");
            break;
        case "ArrowDown":
        case "s":
        case "S":
            changeDirection("down");
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            changeDirection("left");
            break;
        case "ArrowRight":
        case "d":
        case "D":
            changeDirection("right");
            break;
        case " ": // Spacebar to start/restart
            if(inputDir.x === 0 && inputDir.y === 0) {
                // Game hasn't started, start moving right instead of down
                changeDirection("right");
            }
            // If game is running, spacebar does nothing (prevents accidental direction change)
            break;
        case "Enter":
            if(inputDir.x === 0 && inputDir.y === 0) {
                // Game hasn't started, start moving right
                changeDirection("right");
            }
            // If game is running, Enter does nothing
            break;
        default:
            break;
    }
});

// Touch controls for mobile - Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    
    if (upBtn) {
        upBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Up button clicked');
            changeDirection("up");
        });
    }
    
    if (downBtn) {
        downBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Down button clicked');
            changeDirection("down");
        });
    }
    
    if (leftBtn) {
        leftBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Left button clicked');
            changeDirection("left");
        });
    }
    
    if (rightBtn) {
        rightBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Right button clicked');
            changeDirection("right");
        });
    }
});

// Touch swipe controls
let touchStartX = 0;
let touchStartY = 0;
let isSwipeEnabled = true;

// Only enable swipe on game board, not on control buttons
document.getElementById('board').addEventListener('touchstart', e => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwipeEnabled = true;
});

document.getElementById('board').addEventListener('touchend', e => {
    e.preventDefault();
    
    if (!touchStartX || !touchStartY || !isSwipeEnabled) {
        touchStartX = 0;
        touchStartY = 0;
        return;
    }

    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;

    let diffX = touchStartX - touchEndX;
    let diffY = touchStartY - touchEndY;
    
    // Minimum swipe distance to register
    let minSwipeDistance = 30;
    
    if (Math.abs(diffX) < minSwipeDistance && Math.abs(diffY) < minSwipeDistance) {
        // Too small movement, ignore
        touchStartX = 0;
        touchStartY = 0;
        return;
    }

    console.log('Swipe detected:', diffX, diffY);

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            console.log('Swipe left');
            changeDirection("left");
        } else {
            console.log('Swipe right');
            changeDirection("right");
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            console.log('Swipe up');
            changeDirection("up");
        } else {
            console.log('Swipe down');
            changeDirection("down");
        }
    }

    touchStartX = 0;
    touchStartY = 0;
});

// Disable swipe when touching control buttons
document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('touchstart', () => {
        isSwipeEnabled = false;
    });
});