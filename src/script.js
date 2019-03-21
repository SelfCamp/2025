'use strict';

const {Game} = require('./classes/Game');
const {listenForKeyPress, handleSliderChange} = require('./eventHandling');
const {applyConfigToDOM, updateView} = require('./domManipulation');
const config = require('./config');


applyConfigToDOM();

let game = new Game(config.MOCK_SCENARIO);

document.addEventListener("keydown", (event) => listenForKeyPress(game, event));
let slider = document.querySelector("#game-history");
slider.addEventListener("change", (event) => handleSliderChange(game,event));

updateView(
    game.currentBoard(),
    game.status(),
    game.maxHead(),
    game.head,
    false
);
