'use strict';

const {Game} = require('./classes/Game');
const {listenForKeyPress, handleSliderChange, getTimersFromGame} = require('./eventHandling');
const {applyConfigToDOM, updateView, showPageInDOM} = require('./domManipulation');
const config = require('./config');


applyConfigToDOM();

let game = new Game(config.MOCK_SCENARIO);

document.addEventListener("keydown", (event) => listenForKeyPress(game, event));
document.querySelector("#game-history-slider").addEventListener("change", (event) => handleSliderChange(game,event));
document.querySelector("#rules-button").addEventListener("click", () => showPageInDOM("rules"));
document.querySelector("#about-button").addEventListener("click", () => showPageInDOM("about"));
document.querySelector("#game-button").addEventListener("click", () => showPageInDOM("game"));

window.setInterval(() => getTimersFromGame(game.elapsedTimeInSeconds(), game.elapsedCountdownInSeconds()), 1000);

updateView(
    game.currentBoard(),
    game.status(),
    game.maxHead(),
    game.head,
    false
);
