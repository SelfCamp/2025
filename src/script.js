'use strict';

const {Game} = require('./Game');
const {listenForKeyPress, handleSliderChange} = require('./eventHandling');
const {applyConfigToDOM, updateView} = require('./domManipulation');


applyConfigToDOM();
let game = new Game();
let initialBoard = game.currentBoard();
initialBoard.spawnTiles(2);
updateView(initialBoard);
document.addEventListener("keydown", (event) => listenForKeyPress(game, event));
let slider = document.querySelector("#game-history");
slider.addEventListener("change", (event) => handleSliderChange(game,event));
