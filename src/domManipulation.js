/* DEFINE VIEW HANDLING FUNCTIONS */

const {ANIMATION_SLIDE_DURATION} = require("./constants.js");


/**
 * Updates DOM based on values defined in `constants.js`
 */
const applyConfigToDOM = () => {
  let board = document.querySelector('#board');
  board.setAttribute('style', `--slide-duration: ${ANIMATION_SLIDE_DURATION}ms`);
};

/**
 * If no direction is received, we assume this is an undo and animations are ignored
 * @param newBoard
 * @param direction
 */
const updateView = (newBoard, direction=null, head=0) => {
  if (!direction) {
    squashBoardInDOM(newBoard)
  } else {
    updateMvAttributesInDOM(newBoard);
    // newBoard.resetAnimationProperties();
    setTimeout(() => squashBoardInDOM(newBoard), ANIMATION_SLIDE_DURATION);
    let gameStatus = newBoard.gameStatus();
    if (gameStatus !== "ongoing") {
      displayEndOfGame(gameStatus);
    }
  }
};

const displayEndOfGame = (gameStatus) => {
  switch (gameStatus) {
    case 'ongoing':
      break;
    case 'won':
      changeBackgroundInDOM('green');
      break;
    case 'lost':
      changeBackgroundInDOM('red');
      break;
  }
};

const updateMvAttributesInDOM = (newBoard) => {
  for (let row of newBoard.matrix) {
    for (let tile of row) {
      let tileElement = document.querySelector(tile.selector);
      let {slideX, slideY} = tile.previousSlideCoordinates;
      let {wasJustMerged, wasJustSpawned} = tile;
      let isSliding = slideX || slideY;
      tileElement.setAttribute("style", `--slide-x: ${slideX}; --slide-y: ${slideY}`);
      tileElement.setAttribute("data-state",
          isSliding ? 'sliding'
              : wasJustMerged ? 'merged'
              : wasJustSpawned ? 'spawned'
              : ''
      );
    }
  }
};

const squashBoardInDOM = (newBoard) => {
  for (let row of newBoard.matrix) {
    for (let tile of row) {
      let tileElement = document.querySelector(tile.selector);
      tileElement.setAttribute("value", tile.currentValue);
      tileElement.textContent = tile.currentValue;
    }
  }
};

const changeBackgroundInDOM = (color) => {
  let body = document.querySelector('body');
  body.setAttribute('style', `background-color: ${color}`);
};

const updateSliderInDOM = (length) => {
  let slider = document.querySelector("#game-history");
  slider.setAttribute("max", length);
  slider.setAttribute("value", length);
};

module.exports = {
  applyConfigToDOM,
  updateMvAttributesInDOM,
  squashBoardInDOM,
  changeBackgroundInDOM,
  updateView,
  displayEndOfGame,
  updateSliderInDOM
};
