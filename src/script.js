'use strict';

const {Game} = require('./Game');
const {applyConfigToDOM, updateView, updateSliderInDOM} = require('./domManipulation');
const {ARROW_PRESS_TIMEOUT} = require("./constants");


/* DEFINE TOP EVENT HANDLING FUNCTIONS */

const listenForKeyPress = (game, event) => {
  if (game.isKeyPressAllowed()) {
    if (isItAnArrowKey(event.key)) {
      handleArrowKeyPress(game, event.key)
    }
    else if (isItAHistoryKey(event.key)) {
      handleHistoryKeyPress(event.key)
    }
  }
};

const handleArrowKeyPress = (game, key) => {
  if (game.isBrowsingHistory()) {
    game.eraseFuture();
  }
  let direction = getDirectionFromKey(key);
  if (game.makeMove(direction)) {
    updateView(game.currentBoard(), direction, game.head);
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
