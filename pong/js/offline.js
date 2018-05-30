function startOfflineWithAI(isAIEnabled) {
    configureOffline();

    drawGame();
    startGameLoopAfterTimeout(function () {
        return calculateOffline(isAIEnabled);
    }, waitForNewRound);
}

function configureOffline() {
    leftPadPosX = 0;
    leftPadPosY = $("#gameContainer")[0].height / 2 - padHeight / 2;
    rightPadPosX = $("#gameContainer")[0].width - blockSize;
    rightPadPosY = leftPadPosY;
    ballPosX = $("#gameContainer")[0].width / 2;
    ballPosY = $("#gameContainer")[0].height / 2;
}

function calculateOffline(isAIEnabled) {
    if (isAIEnabled) {
        if (keyWPressed || keyUpPressed) leftPadPosY -= padSpeed;
        if (keySPressed || keyDownPressed) leftPadPosY += padSpeed;
        calculateNextAIMove();
    } else {
        if (keyWPressed) leftPadPosY -= padSpeed;
        if (keySPressed) leftPadPosY += padSpeed;
        if (keyUpPressed) rightPadPosY -= padSpeed;
        if (keyDownPressed) rightPadPosY += padSpeed;
    }

    if (rightPadPosY <= blockSize) rightPadPosY = blockSize;
    if (rightPadPosY + padHeight >= $("#gameContainer")[0].height - blockSize) rightPadPosY = $("#gameContainer")[0].height - blockSize - padHeight;
    if (leftPadPosY <= blockSize) leftPadPosY = blockSize;
    if (leftPadPosY + padHeight >= $("#gameContainer")[0].height - blockSize) leftPadPosY = $("#gameContainer")[0].height - blockSize - padHeight;

    if (ballPosY - ballSize <= blockSize || ballPosY + ballSize >= $("#gameContainer")[0].height - blockSize) ballIncrementY *= -1;

    var collisionOnRight = ballPosX + ballSize >= $("#gameContainer")[0].width - blockSize;
    var collisionOnLeft = ballPosX - ballSize <= blockSize;
    var isGoalOnRight = collisionOnRight && (rightPadPosY > ballPosY || rightPadPosY + padHeight < ballPosY);
    var isGoalOnLeft = collisionOnLeft && (leftPadPosY > ballPosY || leftPadPosY + padHeight < ballPosY);

    if (isGoalOnRight) {
        playerOneScore++;
        showAlertWithDelay("Goal for player one!", 1000);
        fireGoalEvents(isAIEnabled);
    } else if (isGoalOnLeft) {
        playerTwoScore++;
        isAIEnabled ? showAlertWithDelay("The computer is owning you!", 1000) : showAlertWithDelay("Goal for player two!", 1000);
        fireGoalEvents(isAIEnabled);
    } else if (collisionOnRight) {
        if (ballPosY <= rightPadPosY + padHeight / 2) {

        } else {

        }
        fireNoGoalEvents();
    } else if (collisionOnLeft) {
        if (ballPosY <= leftPadPosY + padHeight / 2) {

        } else {

        }
        fireNoGoalEvents();
    }

    if (!isGoalOnLeft && !isGoalOnRight) {
        ballPosX += ballIncrementX * speedIncrement;
        ballPosY += ballIncrementY * speedIncrement;

        if (ballPosY + ballSize >= $("#gameContainer")[0].height - blockSize) ballPosY = $("#gameContainer")[0].height - blockSize - ballSize;
        else if (ballPosY - ballSize <= blockSize) ballPosY = blockSize + ballSize;
        if (ballPosX + ballSize >= $("#gameContainer")[0].width - blockSize) ballPosX = $("#gameContainer")[0].width - blockSize - ballSize;
        else if (ballPosX - ballSize <= blockSize) ballPosX = blockSize + ballSize;
    }
}

function fireNoGoalEvents() {
    noGoalHitsCount++;

    if (noGoalHitsCount == noGoalHitsToSpeedUp) {
        noGoalHitsCount = 0;
        speedIncrement += 0.5;
        showWarningWithDelay("Game speed increased! [" + speedIncrement * 100 + " %]", 1000);
    }

    ballIncrementX *= -1;
}

function fireGoalEvents(isAIEnabled) {
    noGoalHitsCount = 0;
    speedIncrement = 1.0;
    ballPosX = $("#gameContainer")[0].width / 2;

    ballIncrementX *= -1;

    startGameLoopAfterTimeout(function () {
        return calculateOffline(isAIEnabled);
    }, waitForNewRound);
}

function calculateNextAIMove() {
    //TODO Do a real AI.
    rightPadPosY = ballPosY - padHeight / 2;
}