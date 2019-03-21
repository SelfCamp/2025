'use strict';

const {Game} = require('./Game');
const {listenForKeyPress, handleSliderChange} = require('./eventHandling');
const {applyConfigToDOM, updateView} = require('./domManipulation');
const config = require('./config');

applyConfigToDOM();
let game = new Game(config.MOCK_SCENARIO);
let initialBoard = game.currentBoard();
initialBoard.spawnTiles(2);
updateView(game.currentBoard(), game.status(), false);
document.addEventListener("keydown", (event) => listenForKeyPress(game, event));
let slider = document.querySelector("#game-history");
slider.addEventListener("change", (event) => handleSliderChange(game,event));
