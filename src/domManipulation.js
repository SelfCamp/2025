const {ANIMATION_SLIDE_DURATION, ANIMATION_SPAWN_DURATION, ANIMATION_NEEDED, COUNTDOWN} = require("./config.js");

let countDownNeeded = false;
let countDownOnGoing = false;

/**
 * Updates DOM based on values defined in `config.js`
 */
const applyConfigToDOM = () => {
  let board = document.querySelector('#board');
  board.setAttribute('style', `--slide-duration: ${ANIMATION_SLIDE_DURATION}ms;--spawn-duration: ${ANIMATION_SPAWN_DURATION}ms`);
};

/**
 * @param newBoard {object}
 * @param gameStatus {'ongoing'|'timeForTheOne'|'won'|'lost'}
 * @param sliderLength {number}
 * @param sliderPosition {number}
 * @param slide {boolean}
 * @param score (number)
 * Whether slide animation should appear (may not want to slide when doing undo/redo)
 */
const updateView = (newBoard, gameStatus, sliderLength, sliderPosition, slide=true, score=0, checkCountDown=false) => {
  countDownNeeded = checkCountDown;
  if (countDownOnGoing && !countDownNeeded) {
    countDownOnGoing = false;
  }
  if (!slide) {
    initiateMergeSpawnInDOM(newBoard)
  } else {
    if (ANIMATION_NEEDED) {
      initiateSlideInDOM(newBoard);
    }
    setTimeout(() => initiateMergeSpawnInDOM(newBoard, ANIMATION_NEEDED), ANIMATION_SLIDE_DURATION);
  }
  updateSliderInDOM(sliderLength, sliderPosition);
  updateScoreInDOM(score);
  handleGameEvent(gameStatus);
  if (countDownNeeded) {
    startCountdown()
  }
};

const initiateSlideInDOM = (newBoard) => {
  for (let tile of newBoard.tiles()) {
    let tileElement = document.querySelector(tile.selector);
    let {slideX, slideY} = tile.previousSlideCoordinates;
    let isSliding = slideX || slideY;
    tileElement.setAttribute("style", `--slide-x: ${slideX}; --slide-y: ${slideY}`);
    tileElement.setAttribute("data-state", isSliding ? 'sliding' : '');
  }
};

const initiateMergeSpawnInDOM = (newBoard, ANIMATION_NEEDED=false) => {
  for (let tile of newBoard.tiles()) {
    let tileElement = document.querySelector(tile.selector);
    if (ANIMATION_NEEDED) {
      let {wasJustMerged, wasJustSpawned} = tile;
      tileElement.setAttribute("data-state",
          wasJustMerged ? 'merged'
              : wasJustSpawned ? 'spawned'
              : ''
      );
    }
    tileElement.setAttribute("value", tile.currentValue);
    tileElement.textContent = tile.currentValue;
  }
};

const handleGameEvent = (gameStatus) => {
  switch (gameStatus) {
    case 'ongoing':
      changeBackgroundInDOM();
      break;
    case 'won':
      gameWon();
      break;
    case 'lost':
      gameLost();
      break;
  }
};

const gameLost = () => {
  setTimeout(() => changeBackgroundInDOM('red'), ANIMATION_SLIDE_DURATION + ANIMATION_SPAWN_DURATION);
  setTimeout(() => updateMessageInDOM('I hate to tell you, but this game is lost. How about starting a new one?'), ANIMATION_SLIDE_DURATION + ANIMATION_SPAWN_DURATION);
  countDownOnGoing = false;
  countDownNeeded = false;
};

const gameWon = () => {
  setTimeout(() => changeBackgroundInDOM('green'), ANIMATION_SLIDE_DURATION + ANIMATION_SPAWN_DURATION);
  setTimeout(() => updateMessageInDOM('Good news! You have won the game. How about an another play?'), ANIMATION_SLIDE_DURATION + ANIMATION_SPAWN_DURATION);
  countDownOnGoing = false;
  countDownNeeded = false;
};

const changeBackgroundInDOM = (color) => {
  let body = document.querySelector('body');
  color ? body.setAttribute('style', `background-color: ${color}`) : body.removeAttribute('style');
};

/**
 * Sets history slider in DOM based on 1-indexed values it receives
 *
 * @param max {!number}
 * @param value {!number}
 */
const updateSliderInDOM = (max, value) => {
  let slider = document.querySelector("#game-history-slider");
  slider.setAttribute("max", max);
  slider.value = value;
};

const updateTimerInDOM = (gameTime) => {
  let timer = document.querySelector("#time");
  timer.innerHTML = prettifySeconds(gameTime)
};

const updateScoreInDOM = (score) => {
  let scoreTab = document.querySelector("#score");
  scoreTab.innerHTML = score
};

const updateMessageInDOM = (messageToUpdate) => {
  let message = document.querySelector("#message");
  message.innerHTML = messageToUpdate
};

const prettifySeconds = (secondsToCalc) => {
  let hours = parseInt( secondsToCalc / 3600);
  secondsToCalc -= hours * 3600;
  let minutes = parseInt( secondsToCalc / 60);
  secondsToCalc -= minutes * 60;
  return (
      (hours ? `${hours}:` : "") +
          `${String(minutes).padStart(2, '0')}:` +
          String(secondsToCalc).padStart(2, '0')
  )
};

const startCountdown = () => {
  if (!countDownOnGoing) {
    countDownOnGoing = true;
    let seconds = COUNTDOWN;
    let countDown = setInterval( () => {
      if (!countDownOnGoing) {
        clearInterval(countDown);
        updateMessageInDOM("OK, timer removed. Nice cheating, I guess.")
      } else if (seconds === 0) {
        clearInterval(countDown);
        gameLost();
      } else {
        updateMessageInDOM(`Remaining time: ${prettifySeconds(seconds)}...`);
      }
      seconds -= 1;
    }, 1000)
  }
};

const changeDisplay = (newDisplay) => {
  let rulesElement = document.querySelector("#rules");
  let aboutElement =  document.querySelector("#about");
  switch (newDisplay) {
    case "game":
      rulesElement.setAttribute("style", "visibility: hidden");
      aboutElement.setAttribute("style", "visibility: hidden");
      break;
    case "about":
      rulesElement.setAttribute("style", "visibility: hidden");
      aboutElement.setAttribute("style", "visibility: visible");
      break;
    case "rules":
      rulesElement.setAttribute("style", "visibility: visible");
      aboutElement.setAttribute("style", "visibility: hidden");
      break;
  }
};


module.exports = {
  applyConfigToDOM,
  updateView,
  updateTimerInDOM,
  updateMessageInDOM,
  prettifySeconds,
  changeDisplay,
};
