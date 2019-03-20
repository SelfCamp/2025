'use strict';

const {Game} = require('./Game');
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
  if (head !== game.timeline.length - 1) {  // FIXME: This doesn't seem to belong here
    game.timeline = game.timeline.slice(0, head + 1);
  }
  let direction = getDirectionFromKey(key);

  // TODO: ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ all of this should be in the Game class
  let currentBoard = game.timeline[head];
  let nextBoard = currentBoard.createNextBoard(direction);
  if (nextBoard.hasChanged()) {
    game.timeline.push(nextBoard);
    head++;
  // TODO: ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ all of this should be in the Game class

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
        && updateView(game.timeline[--head]);
      break;
    case "next":
      (head < game.timeline.length - 1)
        && updateView(game.timeline[++head]);
      break;
    default:
      updateView(game.timeline[whichBoard]);
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
   if (!game.timeline[head].initiatingDirection) {
      return true;
    }
    let timeSinceLastArrowPress = new Date() - game.timeline[head].createdAt;
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

/** Determines current position in `game.timeline` */
let head = 0;


/* MAIN LOGIC */

let game = new Game();
let initialBoard = game.timeline[head];
initialBoard.spawnTiles(2);
applyConfigToDOM();
updateView(initialBoard);
document.addEventListener("keydown", listenForKeyPress);
document.querySelector("#game-history").addEventListener("change", handleSliderChange);
