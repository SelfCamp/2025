const {ANIMATION_SLIDE_DURATION} = require("./config.js");


/**
 * Updates DOM based on values defined in `config.js`
 */
const applyConfigToDOM = () => {
  let board = document.querySelector('#board');
  board.setAttribute('style', `--slide-duration: ${ANIMATION_SLIDE_DURATION}ms`);
};

/**
 * @param newBoard {object}
 * @param gameStatus {'ongoing'|'timeForTheOne'|'won'|'lost'}
 * @param slide {boolean}
 * Whether slide animation should appear (may be omitted when doing undo/redo)
 */
const updateView = (newBoard, gameStatus, slide=true) => {
  if (!slide) {
    initiateMergeSpawnInDOM(newBoard)
  } else {
    initiateSlideInDOM(newBoard);
    setTimeout(() => initiateMergeSpawnInDOM(newBoard), ANIMATION_SLIDE_DURATION);
  }
  displayEndOfGame(gameStatus);
};

const initiateSlideInDOM = (newBoard) => {
  for (let row of newBoard.matrix) {
    for (let tile of row) {
      let tileElement = document.querySelector(tile.selector);
      let {slideX, slideY} = tile.previousSlideCoordinates;
      let isSliding = slideX || slideY;
      tileElement.setAttribute("style", `--slide-x: ${slideX}; --slide-y: ${slideY}`);
      tileElement.setAttribute("data-state", isSliding ? 'sliding' : '');
    }
  }
};

const initiateMergeSpawnInDOM = (newBoard) => {
  for (let row of newBoard.matrix) {
    for (let tile of row) {
      let tileElement = document.querySelector(tile.selector);
      let {wasJustMerged, wasJustSpawned} = tile;
      tileElement.setAttribute("data-state",
              wasJustMerged ? 'merged'
              : wasJustSpawned ? 'spawned'
              : ''
      );
      tileElement.setAttribute("value", tile.currentValue);
      tileElement.textContent = tile.currentValue;
    }
  }
};

const displayEndOfGame = (gameStatus) => {
  switch (gameStatus) {
    case 'ongoing':
      changeBackgroundInDOM('white');
      break;
    case 'won':
      changeBackgroundInDOM('green');
      break;
    case 'lost':
      changeBackgroundInDOM('red');
      break;
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
  updateView,
  updateSliderInDOM
};
