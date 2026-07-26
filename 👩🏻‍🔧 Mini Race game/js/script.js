const road = document.getElementById('road');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const menu = document.getElementById('menu');
const gameOverScreen = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');

let isPlaying = false;
let score = 0;
let playerX = 95;

// Snelheden & Moeilijkheidsgraad
let speed = 5;
let enemySpeed = 4;
let speedMultiplier = 0.2;

let keys = {};
let lines = [];
let enemies = [];

document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Wegbelijning aanmaken
for (let i = 0; i < 5; i++) {
    let line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * 150) + 'px';
    road.appendChild(line);
    lines.push(line);
}

function createEnemy() {
    let enemy = document.createElement('div');
    enemy.classList.add('enemy');
    resetEnemyPosition(enemy);
    road.appendChild(enemy);
    enemies.push(enemy);
}

function resetEnemyPosition(enemy) {
    enemy.style.top = '-120px';
    enemy.style.left = Math.floor(Math.random() * 180) + 'px';
}

function startGame(difficulty) {
    // Instellen van snelheden per moeilijkheidsgraad
    if (difficulty === 'easy') {
        speed = 4;
        enemySpeed = 4;
        speedMultiplier = 0.1;
    } else if (difficulty === 'medium') {
        speed = 7;
        enemySpeed = 6;
        speedMultiplier = 0.25;
    } else if (difficulty === 'hardcore') {
        speed = 10;
        enemySpeed = 9;
        speedMultiplier = 0.4;
    }

    score = 0;
    playerX = 95;
    player.style.left = playerX + 'px';
    scoreDisplay.innerText = `Score: ${score}`;
    
    // Oude tegenstanders opruimen
    enemies.forEach(enemy => enemy.remove());
    enemies = [];

    createEnemy();
    setTimeout(createEnemy, 1200);

    menu.style.display = 'none';
    gameOverScreen.style.display = 'none';
    isPlaying = true;

    requestAnimationFrame(gameLoop);
}

function showMenu() {
    gameOverScreen.style.display = 'none';
    menu.style.display = 'flex';
}

function isColliding(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function gameLoop() {
    if (!isPlaying) return;

    // Speler beweging
    if ((keys['ArrowLeft'] || keys['a'] || keys['A']) && playerX > 5) {
        playerX -= 5;
    }
    if ((keys['ArrowRight'] || keys['d'] || keys['D']) && playerX < 185) {
        playerX += 5;
    }
    player.style.left = playerX + 'px';

    // Wegbelijning
    lines.forEach(line => {
        let top = parseFloat(line.style.top) + speed;
        if (top >= 700) top = -100;
        line.style.top = top + 'px';
    });

    // Tegenstanders & Botsingen
    enemies.forEach(enemy => {
        let top = parseFloat(enemy.style.top) + enemySpeed;
        
        if (top >= 700) {
            resetEnemyPosition(enemy);
            
            score++;
            scoreDisplay.innerText = `Score: ${score}`;

    
            speed += speedMultiplier;
            enemySpeed += speedMultiplier;
        } else {
            enemy.style.top = top + 'px';
        }

        if (isColliding(player, enemy)) {
            endGame();
        }
    });

    if (isPlaying) {
        requestAnimationFrame(gameLoop);
    }
}

function endGame() {
    isPlaying = false;
    finalScore.innerText = `Jouw Score: ${score}`;
    gameOverScreen.style.display = 'flex';
}