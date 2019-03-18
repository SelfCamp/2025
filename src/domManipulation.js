/* DEFINE VIEW HANDLING FUNCTIONS */

const {ANIMATION_DURATION} = require("./constants.js");

/**
 * If no direction is received, we assume this is an undo and animations are ignored
 * @param newBoard
 * @param direction
 */
const updateView = (newBoard, direction=null, head=0) => {
  if (!direction) {
    squashBoardInDOM(newBoard)
  } else {
    updateMvAttributesInDOM(newBoard, direction);
    newBoard.resetAnimationProperties();
    setTimeout(() => squashBoardInDOM(newBoard), ANIMATION_DURATION);
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

const updateMvAttributesInDOM = (newBoard, direction) => {
  for (let row of newBoard.matrix) {
    for (let tile of row) {
      let tileElement = document.querySelector(tile.selector);
      tileElement.setAttribute("data-mv-dir", direction);
      tileElement.setAttribute("data-mv-len", tile.previousValueMvLen ? tile.previousValueMvLen : "");
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
  let slider = document.querySelector("#gameHistory");
  slider.setAttribute("max", length);
  slider.setAttribute("value", length);
};

module.exports = {
  updateMvAttributesInDOM,
  squashBoardInDOM,
  changeBackgroundInDOM,
  updateView,
  displayEndOfGame,
  updateSliderInDOM
};
