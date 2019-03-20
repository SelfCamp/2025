'use strict';

const {Game} = require('./Game');
const {applyConfigToDOM, updateView, updateSliderInDOM} = require('./domManipulation');
const {ARROW_PRESS_TIMEOUT} = require("./constants");


/* DEFINE TOP EVENT HANDLING FUNCTIONS */

const listenForKeyPress = (game, event) => {
  if (game.isKeyPressAllowed()) {
    if (isItAnArrowKey(event.key)) {
      handleArrowKeyPress(event.key)
    }
    else if (isItAHistoryKey(event.key)) {
      handleHistoryKeyPress(event.key)
    }
  }
};

const handleArrowKeyPress = (key) => {
  if (game.head !== game.timeline.length - 1) {  // FIXME: This doesn't seem to belong here
    game.timeline = game.timeline.slice(0, game.head + 1);
  }
  let direction = getDirectionFromKey(key);

  // TODO: ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ all of this should be in the Game class
  let currentBoard = game.timeline[game.head];
  let nextBoard = currentBoard.createNextBoard(direction);
  if (nextBoard.hasChanged()) {
    game.timeline.push(nextBoard);
    game.head++;
  // TODO: ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ all of this should be in the Game class

    updateView(nextBoard, direction, game.head);
    updateSliderInDOM(game.head);

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
      (game.head > 0)
        && updateView(game.timeline[--game.head]);
      break;
    case "next":
      (game.head < game.timeline.length - 1)
        && updateView(game.timeline[++game.head]);
      break;
    default:
      updateView(game.timeline[whichBoard]);
  }
};

const isItAnArrowKey = (key) =>
    ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(key);

const isItAHistoryKey = (key) =>
    ['n', 'p'].includes(key);

const getDirectionFromKey = (key) => {
  let directions = {'ArrowUp': 'up', 'ArrowRight': 'right', 'ArrowDown': 'down', 'ArrowLeft': 'left'};
  return directions[key];
};


/* MAIN LOGIC */

let game = new Game();
let initialBoard = game.timeline[game.head];
initialBoard.spawnTiles(2);
applyConfigToDOM();
updateView(initialBoard);
document.addEventListener("keydown", (event) => listenForKeyPress(game, event));
document.querySelector("#game-history").addEventListener("change", handleSliderChange);
