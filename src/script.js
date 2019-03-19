'use strict';

const {Board} = require('./Board');
const {applyConfigToDOM, updateView, updateSliderInDOM} = require('./domManipulation');
const {ARROW_PRESS_TIMEOUT} = require("./constants");


/* DEFINE TOP EVENT HANDLING FUNCTIONS */

const listenForKeyPress = event => {
  if (isKeyPressAllowed()) {
    if (isItAnArrowKey(event.key)) {
      handleArrowKeyPress(event.key)
    }
    else if (isItAHistoryKey(event.key)) {
      handleHistoryKeyPress(event.key)
    }
  }
};

const handleArrowKeyPress = (key) => {
  if (head !== boardHistory.length - 1) {  // FIXME: This doesn't seem to belong here
    boardHistory = boardHistory.slice(0, head + 1);
    arrowPressHistory = arrowPressHistory.slice(0, head + 1);
  }
  let direction = getDirectionFromKey(key);
  let currentBoard = boardHistory[head];
  let nextBoard = currentBoard.createNextBoard(direction);
  if (nextBoard.hasChanged()) {
    arrowPressHistory.push({direction: direction, timestamp: new Date()});
    boardHistory.push(nextBoard);
    head++;
    updateView(nextBoard, direction, head);
    updateSliderInDOM(head);

  }
};

const handleHistoryKeyPress = (key) => {
  (key === 'n')
      ? browseHistory("next")
      : browseHistory("previous")
};

const handleSliderChange = (event) => {
  browseHistory(+event.target.value);
};

const browseHistory = (whichBoard) => {
  switch (whichBoard) {
    case "previous":
      if (head > 0) {
        head--;
        updateView(boardHistory[head]);
      }
      break;
    case "next":
      if (head < boardHistory.length - 1) {
        head++;
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

const isItAnArrowKey = (key) =>
    ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(key);

const isItAHistoryKey = (key) =>
    ['n', 'p'].includes(key);

const getDirectionFromKey = (key) => {
  let directions = {'ArrowUp': 'up', 'ArrowRight': 'right', 'ArrowDown': 'down', 'ArrowLeft': 'left'};
  return directions[key];
};

/* INITIALIZE OBJECTS */

const board = new Board();
board.spawnTiles(2);

let boardHistory = [board];
let arrowPressHistory = [];
let head = 0;


/* MAIN LOGIC */

let currentBoard = boardHistory[boardHistory.length-1];
applyConfigToDOM();
updateView(currentBoard);
document.addEventListener("keydown", listenForKeyPress);
document.querySelector("#game-history").addEventListener("change", handleSliderChange);
