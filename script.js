const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const boxSize =10;  // Size of each snake segment
let score = 0;
let snake;
let direction;
let food;
let lastRenderTime = 0;
const speed = 5; // Speed of the snake

// Initialize game settings
function initGame() {
    snake = [{x: 9 * boxSize, y: 10 * boxSize}]; // Initial position of the snake
    direction = "RIGHT";
    food = {
        x: Math.floor(Math.random() * 20) * boxSize,
        y: Math.floor(Math.random() * 20) * boxSize
    };
    score = 0;
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("restartButton").style.display = "none";
    requestAnimationFrame(gameLoop);
}

// Control the snake with arrow keys or on-screen buttons
document.addEventListener("keydown", directionChange);

// Attach mobile controls
document.getElementById("up").addEventListener("click", () => setDirection("UP"));
document.getElementById("down").addEventListener("click", () => setDirection("DOWN"));
document.getElementById("left").addEventListener("click", () => setDirection("LEFT"));
document.getElementById("right").addEventListener("click", () => setDirection("RIGHT"));

function directionChange(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode === 38 && direction !== "DOWN") {
        direction = "UP";
    } else if (event.keyCode === 39 && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode === 40 && direction !== "UP") {
        direction = "DOWN";
    }
}

// Set direction from on-screen buttons
function setDirection(newDirection) {
    if (newDirection === "LEFT" && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (newDirection === "UP" && direction !== "DOWN") {
        direction = "UP";
    } else if (newDirection === "RIGHT" && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (newDirection === "DOWN" && direction !== "UP") {
        direction = "DOWN";
    }
}

// Main game loop
function gameLoop(currentTime) {
    const timeElapsed = currentTime - lastRenderTime;
    if (timeElapsed > 1000 / speed) {
        lastRenderTime = currentTime;
        draw();
    }
    requestAnimationFrame(gameLoop);
}

// Draw the snake and food
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "lime" : "white"; // Head is green, body is white
        ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }

    // Draw the food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    // Move the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= boxSize;
    if (direction === "UP") snakeY -= boxSize;
    if (direction === "RIGHT") snakeX += boxSize;
    if (direction === "DOWN") snakeY += boxSize;

    // Wrap-around logic for boundaries
    if (snakeX < 0) {
        snakeX = canvas.width - boxSize;  // Wrap to right
    } else if (snakeX >= canvas.width) {
        snakeX = 0;  // Wrap to left
    }

    if (snakeY < 0) {
        snakeY = canvas.height - boxSize;  // Wrap to bottom
    } else if (snakeY >= canvas.height) {
        snakeY = 0;  // Wrap to top
    }

    // If the snake eats the food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById("score").innerText = `Score: ${score}`;
        food = {
            x: Math.floor(Math.random() * 20) * boxSize,
            y: Math.floor(Math.random() * 20) * boxSize
        };
    } else {
        // Remove the tail
        snake.pop();
    }

    // Add new head
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Check for collision with itself
    if (checkSelfCollision(newHead, snake)) {
        cancelAnimationFrame(gameLoop);
        document.getElementById("restartButton").style.display = "inline-block";
        alert("Game Over! Your score is " + score);
    }

    snake.unshift(newHead);
}

// Check if the snake collides with itself
function checkSelfCollision(head, array) {
    for (let i = 1; i < array.length; i++) {  // Start checking from index 1 to skip the head itself
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Restart the game
function restartGame() {
    initGame();
}

// Initialize the game when the page loads
initGame();
