'use strict';

const {Game} = require('./classes/Game');
const {listenForKeyPress, handleSliderChange} = require('./eventHandling');
const {applyConfigToDOM, updateView, updateTimerInDOM, displayAbout, displayRules} = require('./domManipulation');
const config = require('./config');


applyConfigToDOM();

let game = new Game(config.MOCK_SCENARIO);

document.addEventListener("keydown", (event) => listenForKeyPress(game, event));
document.querySelector("#game-history-slider").addEventListener("change", (event) => handleSliderChange(game,event));
document.querySelector("#rules-button").addEventListener("click", () => displayRules());
document.querySelector("#about-button").addEventListener("click", () => displayAbout());
window.setInterval(() => updateTimerInDOM(game.elapsedTimeInSeconds()), 1000);

updateView(
    game.currentBoard(),
    game.status(),
    game.maxHead(),
    game.head,
    false
);
