const {ANIMATION_SLIDE_DURATION, ANIMATION_SPAWN_DURATION, ANIMATION_NEEDED, WAIT_TIME_BEFORE_WIN_LOSS_SCREEN} = require("./config.js");


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
const updateView = (newBoard, gameStatus, sliderLength, sliderPosition, slide=true, score=0) => {
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
  displayGameStatusChange(gameStatus);
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

/**
 * Goes through all board tile elements in DOM and updates their merge and spawn status according to tiles in Game object.
 * @param newBoard {object}
 * @param ANIMATION_NEEDED {boolean}
 */
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

/**
 * Function receives gameStatus and updates the DOM based on it.
 * @param gameStatus
 */
const displayGameStatusChange = (gameStatus) => {
  switch (gameStatus) {
    case 'ongoing':
    case 'finale':
      changeBackgroundInDOM();
      break;
    case 'won':
      setTimeout(() => changeBackgroundInDOM('green'), ANIMATION_SLIDE_DURATION + ANIMATION_SPAWN_DURATION);
      setTimeout(() => showPageInDOM("victory"), ANIMATION_SLIDE_DURATION + ANIMATION_SPAWN_DURATION + WAIT_TIME_BEFORE_WIN_LOSS_SCREEN);
      break;
    case 'lost':
      setTimeout(() => changeBackgroundInDOM('red'), ANIMATION_SLIDE_DURATION + ANIMATION_SPAWN_DURATION);
      setTimeout(() => showPageInDOM("defeat"), ANIMATION_SLIDE_DURATION + ANIMATION_SPAWN_DURATION + WAIT_TIME_BEFORE_WIN_LOSS_SCREEN);
      break;
  }
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

/**
 * Updates timer on board header. It accepts gameTime (number, elapsed seconds) and color (string, for styling)
 * @param gameTime {number}
 * @param color {string}
 */
const updateTimerInDOM = (gameTime, color="white") => {
  let timer = document.querySelector("#time");
  timer.innerHTML = gameTime;
  switch (color) {
    case "white":
      timer.setAttribute("style", "color: #FFC9A4");
      break;
    case "red":
      timer.setAttribute("style", "color: #FF001E");
      break;
  }
};

/**
 * Updates score on board header.
 * @param score {number}
 */
const updateScoreInDOM = (score) => {
  let scoreTab = document.querySelector("#score");
  scoreTab.innerHTML = score
};

/**
 * Activates requested page on game.
 * @param newDisplay {string}
 */
const showPageInDOM = (newDisplay) => {
  let rulesElement = document.querySelector("#rules");
  let aboutElement =  document.querySelector("#about");
  let victoryElement = document.querySelector("#victory");
  let defeatElement = document.querySelector("#defeat");

  rulesElement.setAttribute("style", "visibility: hidden");
  aboutElement.setAttribute("style", "visibility: hidden");
  victoryElement.setAttribute("style", "visibility: hidden");
  defeatElement.setAttribute("style", "visibility: hidden");

  switch (newDisplay) {
    case "about":
      aboutElement.setAttribute("style", "visibility: visible");
      break;
    case "rules":
      rulesElement.setAttribute("style", "visibility: visible");
      break;
    case "victory":
      victoryElement.setAttribute("style", "visibility: visible");
      break;
    case "defeat":
      defeatElement.setAttribute("style", "visibility: visible");
      break;
  }
};


module.exports = {
  applyConfigToDOM,
  updateView,
  updateTimerInDOM,
  showPageInDOM,
};
