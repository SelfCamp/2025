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
  if (head !== gameTimeline.length - 1) {  // FIXME: This doesn't seem to belong here
    gameTimeline = gameTimeline.slice(0, head + 1);
    arrowPressHistory = arrowPressHistory.slice(0, head + 1);  // TODO: remove after testing
  }
  let direction = getDirectionFromKey(key);
  let currentBoard = gameTimeline[head];
  let nextBoard = currentBoard.createNextBoard(direction);
  if (nextBoard.hasChanged()) {

    // BEFORE
    arrowPressHistory.push({direction: direction, timestamp: new Date()}); // TODO: remove after testing
    // AFTER
    // nextBoard.initiatingDirection = direction; // TODO: Test  - next: let Board set this based on direction

    gameTimeline.push(nextBoard);
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
        && updateView(gameTimeline[--head]);
      break;
    case "next":
      (head < gameTimeline.length - 1)
        && updateView(gameTimeline[++head]);
      break;
    default:
      updateView(gameTimeline[whichBoard]);
  }
};

/**
 * Determines whether enough time has passed since last keypress to perform a new one
 *
 * - Makes sure board transformation finishes before starting a new one, avoiding UI glitches
 * - TODO: make Game method
 * @returns {boolean}
 */
const isKeyPressAllowed = () => {

    // BEFORE
    if (!arrowPressHistory.length) {  // TODO: remove after testing
      return true
    }
    // AFTER
    // if (!gameTimeline[head].initiatingDirection) {
    //   return true;
    // }

    // BEFORE
    let previousArrowPress = arrowPressHistory[arrowPressHistory.length-1];  // TODO: remove after testing
    let timeSinceLastArrowPress = new Date() - previousArrowPress.timestamp;  // TODO: remove after testing

    // AFTER
    // let timeSinceLastArrowPress = new Date() - gameTimeline[head].createdAt;

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

/** TODO
 * Will contain all boards, including initiatingDirection and createdAt
 */
let gameTimeline = [new Board()];

/** TODO: Merge into gameTimeline */
let arrowPressHistory = [];

/** Determines current position in `gameTimeline` */
let head = 0;


/* MAIN LOGIC */

let initialBoard = gameTimeline[head];
initialBoard.spawnTiles(2);
applyConfigToDOM();
updateView(initialBoard);
document.addEventListener("keydown", listenForKeyPress);
document.querySelector("#game-history").addEventListener("change", handleSliderChange);
