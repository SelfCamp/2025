'use strict';

const {Game} = require('./Game');
const {applyConfigToDOM, updateView, updateSliderInDOM} = require('./domManipulation');


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
  if (key === 'n') {
    game.browseHistory("next");
  } else if (key === 'p') {
    game.browseHistory("previous");
  }
  updateView(game.currentBoard());
};

const handleSliderChange = (event) => {
  let requestedPosition = +event.target.value;
  game.browseHistory(requestedPosition);
  updateView(game.currentBoard());

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

applyConfigToDOM();
let game = new Game();
let initialBoard = game.currentBoard();
initialBoard.spawnTiles(2);
updateView(initialBoard);
document.addEventListener("keydown", (event) => listenForKeyPress(game, event));
document.querySelector("#game-history").addEventListener("change", handleSliderChange);
