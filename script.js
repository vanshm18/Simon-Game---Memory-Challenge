let boxes = document.querySelectorAll(".box");
let idArr = [];
let body = document.querySelector("body");
let gameArr = [];
let userArr = [];
let h1 = document.querySelector("h1");
let cont = document.querySelector(".container");
let h3 = document.querySelector("h3");

let highScore = localStorage.getItem("highScore") || 0; // Default to 0 if no high score is stored
let score = 0; // Current score

function randBox() {
    let rand = Math.floor(Math.random() * 4);
    boxes[rand].classList.add("simon");
    gameArr.push(boxes[rand].id);
    setTimeout(() => {
        boxes[rand].classList.remove("simon");
    }, 100);
} 

function startGame() {
    gameArr = [];
    userArr = [];
    h1.innerText = "Simon Game";
    h1.style.color = "black";

    let restartBtn = document.querySelector(".restart");
    if (restartBtn) restartBtn.remove();

    for (let i = 0; i < boxes.length; i++) {
        boxes[i].addEventListener("click", boxClickHandler); // Add the event listener
    }

    setTimeout(() => {
        randBox(); // Start with a random box
    }, 400);
}

function boxClickHandler(event) {
    userArr.push(event.target.id);
    event.target.classList.add("simon");
    setTimeout(() => {
        event.target.classList.remove("simon");
    }, 100);

    let isCorrect = true;
    for (let i = 0; i < userArr.length; i++) {
        if (userArr[i] !== gameArr[i]) {
            isCorrect = false;
            break; // Stop checking if there's a mistake
        }
    }

    if (!isCorrect) {
        let score = gameArr.length - 1;
        console.log(`Game Over! High Score: ${score}`);

        if (gameArr.length - 1 > highScore) {
            highScore = gameArr.length - 1;
            localStorage.setItem("highScore", highScore); // Store the new high score
        }

        // Remove any previous score display before adding a new one
        let oldScore = document.querySelector(".score");
        if (oldScore) oldScore.remove();

        let displayScore = document.createElement("pre");
        displayScore.classList.add("score");
        displayScore.innerText = `High Score : ${highScore}
Your Score : ${gameArr.length - 1}`;
        cont.prepend(displayScore);

        gameArr = [];
        userArr = [];
        h1.innerText = "GAME OVER!";
        h1.style.color = "red";
        body.style.backgroundColor = "red";
        setTimeout(() => {
            body.style.backgroundColor = "white";
        }, 150);

        let restart = document.createElement("button");
        restart.classList.add("restart");
        restart.innerText = "Restart";
        h3.remove();
        cont.prepend(restart);
        restart.addEventListener("click", startGame);

        // Remove event listeners when game ends
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].removeEventListener("click", boxClickHandler);
        }

        return;
    }

    // If user completes the full sequence, add a new move
    if (userArr.length === gameArr.length) {
        setTimeout(() => {
            userArr = [];
            randBox();
        }, 1000);
    }
}

// Initial body click event to start the game
body.addEventListener("click", function () {
    randBox();
    for (let box of boxes) {
        box.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }
}, { once: true });

// Attach event listeners correctly
for (let box of boxes) {
    box.addEventListener("click", boxClickHandler);
}
