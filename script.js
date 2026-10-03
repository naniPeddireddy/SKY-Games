/* =========================
   GAME VARIABLES
========================= */

let gameRunning = false;

let playerLane = 1;

let score = 0;

let coins = 0;

let speed = 5;

let highScore = 0;


/* TIMERS */

let obstacleTimer;

let coinTimer;

let scoreTimer;


/* =========================
   HTML ELEMENTS
========================= */

const game =
    document.getElementById("game");

const player =
    document.getElementById("player");

const scoreText =
    document.getElementById("score");

const coinsText =
    document.getElementById("coins");

const highScoreText =
    document.getElementById("highScore");


/* =========================
   LANES
========================= */

const lanes = [
    33,
    50,
    67
];


/* =========================
   LOAD HIGH SCORE
========================= */

highScore =
    Number(
        localStorage.getItem("skyRunnerHighScore")
    ) || 0;

highScoreText.innerText =
    highScore;


/* =========================
   START GAME
========================= */

document
    .getElementById("startButton")
    .addEventListener(
        "click",
        startGame
    );


function startGame() {

    document
        .getElementById("startScreen")
        .style.display = "none";


    document
        .getElementById("gameOver")
        .classList.remove("show");


    /* RESET */

    gameRunning = true;

    playerLane = 1;

    score = 0;

    coins = 0;

    speed = 5;


    /* PLAYER POSITION */

    player.style.left =
        lanes[playerLane] + "%";


    /* DISPLAY */

    scoreText.innerText =
        score;

    coinsText.innerText =
        coins;

    highScoreText.innerText =
        highScore;


    /* START TIMERS */

    obstacleTimer =
        setInterval(
            createObstacle,
            1000
        );


    coinTimer =
        setInterval(
            createCoin,
            700
        );


    scoreTimer =
        setInterval(
            increaseScore,
            100
        );
}


/* =========================
   SCORE
========================= */

function increaseScore() {

    if (!gameRunning) {
        return;
    }


    score++;


    scoreText.innerText =
        score;


    /* INCREASE SPEED */

    if (score % 100 === 0) {

        speed += 0.5;
    }
}


/* =========================
   MOVE LEFT
========================= */

function moveLeft() {

    if (!gameRunning) {
        return;
    }


    if (playerLane > 0) {

        playerLane--;

        player.style.left =
            lanes[playerLane] + "%";
    }
}


/* =========================
   MOVE RIGHT
========================= */

function moveRight() {

    if (!gameRunning) {
        return;
    }


    if (playerLane < 2) {

        playerLane++;

        player.style.left =
            lanes[playerLane] + "%";
    }
}


/* =========================
   JUMP
========================= */

function jump() {

    if (!gameRunning) {
        return;
    }


    if (
        !player.classList.contains("jump")
    ) {

        player.classList.add("jump");


        setTimeout(
            function () {

                player.classList.remove(
                    "jump"
                );

            },
            650
        );
    }
}


/* =========================
   CREATE OBSTACLE
========================= */

function createObstacle() {

    if (!gameRunning) {
        return;
    }


    const obstacle =
        document.createElement("div");


    obstacle.classList.add(
        "obstacle"
    );


    /* RANDOM LANE */

    const lane =
        Math.floor(
            Math.random() * 3
        );


    obstacle.dataset.lane =
        lane;


    obstacle.style.left =
        lanes[lane] + "%";


    obstacle.style.transform =
        "translateX(-50%)";


    obstacle.style.top =
        "-70px";


    game.appendChild(
        obstacle
    );


    let position = -70;


    const movement =
        setInterval(
            function () {

                /* GAME STOPPED */

                if (!gameRunning) {

                    clearInterval(
                        movement
                    );

                    obstacle.remove();

                    return;
                }


                /* MOVE */

                position += speed;


                obstacle.style.top =
                    position + "px";


                /* COLLISION */

                checkObstacleCollision(
                    obstacle,
                    movement
                );


                /* REMOVE */

                if (
                    position >
                    window.innerHeight
                ) {

                    clearInterval(
                        movement
                    );

                    obstacle.remove();
                }

            },
            20
        );
}


/* =========================
   OBSTACLE COLLISION
========================= */

function checkObstacleCollision(
    obstacle,
    movement
) {

    const obstacleRect =
        obstacle.getBoundingClientRect();


    const playerRect =
        player.getBoundingClientRect();


    const sameLane =
        Number(
            obstacle.dataset.lane
        ) === playerLane;


    const jumping =
        player.classList.contains(
            "jump"
        );


    if (
        sameLane &&
        !jumping &&
        obstacleRect.bottom >
        playerRect.top + 20 &&
        obstacleRect.top <
        playerRect.bottom
    ) {

        clearInterval(
            movement
        );


        endGame();
    }
}


/* =========================
   CREATE COIN
========================= */

function createCoin() {

    if (!gameRunning) {
        return;
    }


    const coin =
        document.createElement("div");


    coin.classList.add(
        "coin"
    );


    const lane =
        Math.floor(
            Math.random() * 3
        );


    coin.dataset.lane =
        lane;


    coin.style.left =
        lanes[lane] + "%";


    coin.style.transform =
        "translateX(-50%)";


    coin.style.top =
        "-40px";


    coin.innerText = "C";


    game.appendChild(
        coin
    );


    let position = -40;


    const movement =
        setInterval(
            function () {

                if (!gameRunning) {

                    clearInterval(
                        movement
                    );

                    coin.remove();

                    return;
                }


                position += speed;


                coin.style.top =
                    position + "px";


                checkCoinCollision(
                    coin,
                    movement
                );


                if (
                    position >
                    window.innerHeight
                ) {

                    clearInterval(
                        movement
                    );

                    coin.remove();
                }

            },
            20
        );
}


/* =========================
   COIN COLLISION
========================= */

function checkCoinCollision(
    coin,
    movement
) {

    const coinRect =
        coin.getBoundingClientRect();


    const playerRect =
        player.getBoundingClientRect();


    const sameLane =
        Number(
            coin.dataset.lane
        ) === playerLane;


    if (
        sameLane &&
        coinRect.bottom >
        playerRect.top &&
        coinRect.top <
        playerRect.bottom
    ) {

        /* ADD COIN */

        coins++;
        checkLevel();


        coinsText.innerText =
            coins;


        /* BONUS SCORE */

        score += 25;


        scoreText.innerText =
            score;


        clearInterval(
            movement
        );


        coin.remove();
    }
}


/* =========================
   GAME OVER
========================= */

function endGame() {

    gameRunning = false;


    /* STOP TIMERS */

    clearInterval(
        obstacleTimer
    );

    clearInterval(
        coinTimer
    );

    clearInterval(
        scoreTimer
    );


    /* HIGH SCORE */

    if (score > highScore) {

        highScore = score;


        localStorage.setItem(
            "skyRunnerHighScore",
            highScore
        );
    }


    /* FINAL SCORE */

    document.getElementById(
        "finalScore"
    ).innerText =
        score;


    document.getElementById(
        "finalCoins"
    ).innerText =
        coins;


    document.getElementById(
        "finalHighScore"
    ).innerText =
        highScore;


    highScoreText.innerText =
        highScore;


    /* SHOW GAME OVER */

    document
        .getElementById("gameOver")
        .classList.add("show");
}


/* =========================
   RESTART
========================= */

document
    .getElementById("restartButton")
    .addEventListener(
        "click",
        function () {

            location.reload();

        }
    );


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        /* LEFT */

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            moveLeft();
        }


        /* RIGHT */

        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            moveRight();
        }


        /* JUMP */

        if (
            event.key === "ArrowUp" ||
            event.key === " " ||
            event.key.toLowerCase() === "w"
        ) {

            event.preventDefault();

            jump();
        }

    }
);


/* =========================
   MOBILE BUTTONS
========================= */

document
    .getElementById("leftButton")
    .addEventListener(
        "click",
        moveLeft
    );


document
    .getElementById("rightButton")
    .addEventListener(
        "click",
        moveRight
    );


document
    .getElementById("jumpButton")
    .addEventListener(
        "click",
        jump
    );

    function checkLevel() {

    let newLevel = 1;

    if (score >= 2000) {
        newLevel = 5;
    } 
    else if (score >= 1500) {
        newLevel = 4;
    } 
    else if (score >= 1000) {
        newLevel = 3;
    } 
    else if (score >= 500) {
        newLevel = 2;
    }

    if (newLevel > level) {

        level = newLevel;

        levelText.innerText = level;

        // Increase game speed
        levelSpeed += 0.25;

        showLevelMessage();
    }
}
// MOBILE TOUCH CONTROLS

let startX = 0;
let startY = 0;

document.addEventListener("touchstart", function(event) {

    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;

});

document.addEventListener("touchend", function(event) {

    let endX = event.changedTouches[0].clientX;
    let endY = event.changedTouches[0].clientY;

    let differenceX = endX - startX;
    let differenceY = endY - startY;

    // Swipe left
    if (differenceX < -50) {
        moveLeft();
    }

    // Swipe right
    else if (differenceX > 50) {
        moveRight();
    }

    // Swipe up
    else if (differenceY < -50) {
        jump();
    }

});