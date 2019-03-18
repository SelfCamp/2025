'use strict';

const {Board} = require('./Board');
const {applyConfigToDOM, updateView, updateSliderInDOM} = require('./domManipulation');
const {ARROW_PRESS_TIMEOUT} = require("./constants");


/* DEFINE TOP EVENT HANDLING FUNCTIONS */

const listenForArrowPress = event => {
  let isItAValidKey = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'n', "p"].includes(event.key);
  if (isItAValidKey && isKeyPressAllowed()) {
    handleKeyPress(event.key)
  }
};

const handleKeyPress = (key) => {
  switch (key) {
    case "ArrowUp":
    case "ArrowRight":
    case "ArrowDown":
    case "ArrowLeft":
      if (head !== boardHistory.length - 1) {
        boardHistory = boardHistory.slice(0, head + 1);
        arrowPressHistory = arrowPressHistory.slice(0, head + 1);

      }
      let directions = {'ArrowUp': 'up', 'ArrowRight': 'right', 'ArrowDown': 'down', 'ArrowLeft': 'left'};
      let direction = directions[key];
      let currentBoard = boardHistory[head];
      let nextBoard = currentBoard.createNextBoard(direction);
      if (nextBoard.hasChanged()) {
        arrowPressHistory.push({direction: direction, timestamp: new Date()});
        boardHistory.push(nextBoard);
        head += 1;
        updateView(nextBoard, direction, head);
        updateSliderInDOM(head);

      }
      break;

    case "n":
      browseHistory("next");
      break;

    case "p":
      browseHistory("previous");
      break;
  }
};

const handleSliderChange = (event) => {
  browseHistory(+event.target.value);
};

const browseHistory = (whichBoard) => {
  switch (whichBoard) {
    case "previous":
      if (head > 0) {
        head -= 1;
        updateView(boardHistory[head]);
      }
      break;
    case "next":
      if (head < boardHistory.length - 1) {
        head += 1;
        updateView(boardHistory[head]);
      }
      break;
    default:
      head = whichBoard;
      updateView(boardHistory[head]);
  }
};

const isKeyPressAllowed = () => {
    if (!arrowPressHistory.length) {
      return true
    }
    let previousArrowPress = arrowPressHistory[arrowPressHistory.length-1];
    let timeSinceLastArrowPress = new Date() - previousArrowPress.timestamp;
    return timeSinceLastArrowPress > ARROW_PRESS_TIMEOUT;
};


/* INITIALIZE OBJECTS */

const board = new Board();
board.spawnTiles(2);

board.mock("noMock");
// board.mock("almostWon");
// board.mock("almostLost");

let boardHistory = [board];
let arrowPressHistory = [];
let head = 0;


/* MAIN LOGIC */

let currentBoard = boardHistory[boardHistory.length-1];
applyConfigToDOM();
updateView(currentBoard);
document.addEventListener("keydown", listenForArrowPress);
document.querySelector("#game-history").addEventListener("change", handleSliderChange);
