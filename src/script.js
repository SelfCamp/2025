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
    && browseHistory("next");
  (key === 'p')
    && browseHistory("previous");
};

const handleSliderChange = (event) => {
  browseHistory(+event.target.value);
};

const browseHistory = (whichBoard) => {
  switch (whichBoard) {
    case "previous":
      (head > 0)
        && updateView(boardHistory[--head]);
      break;
    case "next":
      (head < boardHistory.length - 1)
        && updateView(boardHistory[++head]);
      break;
    default:
      updateView(boardHistory[whichBoard]);
  }
};

/**
 * Determines whether enough time has passed since last keypress to perform a new one
 *
 * - Makes sure board transformation finishes before starting a new one, avoiding UI glitches
 * @returns {boolean}
 */
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


/* INITIALIZE GAME STATE OBJECTS */

let boardHistory = [new Board()];

/**
 * Contains the direction and timestamp of all previous player moves
 * TODO: Add this to boardHistory as initiatingArrowPress and merge as gameTimeline
 */
let arrowPressHistory = [];

/**
 * Determines current position in `boardHistory`
 * */
let head = 0;


/* MAIN LOGIC */

let initialBoard = boardHistory[head];
initialBoard.spawnTiles(2); // TODO: this should happen inside the Board constructor when it isn't mocked
applyConfigToDOM();
updateView(initialBoard);
document.addEventListener("keydown", listenForKeyPress);
document.querySelector("#game-history").addEventListener("change", handleSliderChange);
