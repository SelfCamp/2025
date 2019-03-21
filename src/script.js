'use strict';

const {Game} = require('./Game');
const {listenForKeyPress, handleSliderChange} = require('./eventHandling');
const {applyConfigToDOM, updateView} = require('./domManipulation');


applyConfigToDOM();
let game = new Game();
let initialBoard = game.currentBoard();
initialBoard.spawnTiles(2);
updateView(game.currentBoard(), game.currentBoard().gameStatus(), false);  // TODO: move status into game
document.addEventListener("keydown", (event) => listenForKeyPress(game, event));
let slider = document.querySelector("#game-history");
slider.addEventListener("change", (event) => handleSliderChange(game,event));
