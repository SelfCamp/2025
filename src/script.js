'use strict';

const {Game} = require('./classes/Game');
const {listenForKeyPress, handleSliderChange, getTimersFromGame, switchPage, replay} = require('./eventHandling');
const {applyConfigToDOM, updateView} = require('./domManipulation');
const config = require('./config');

const requestNewGame = () => {
  applyConfigToDOM();
  let game = new Game(config.MOCK_SCENARIO);
  updateView(
      game.currentBoard(),
      game.status(),
      game.maxHead(),
      game.head,
      false
  );
  return game
};

let game = requestNewGame();

document.addEventListener("keydown", (event) => listenForKeyPress(game, event));
document.querySelector("#game-history-slider").addEventListener("change", (event) => handleSliderChange(game,event));
document.querySelector("#rules-button").addEventListener("click", () => switchPage("rules", game.setIgnoreKeystrokes));
document.querySelector("#about-button").addEventListener("click", () => switchPage("about", game.setIgnoreKeystrokes));
document.querySelector("#game-button").addEventListener("click", () => switchPage("game", game.setIgnoreKeystrokes));
document.querySelector("#newgame-button").addEventListener("click", () => game = requestNewGame());
document.querySelector("#replay-button").addEventListener("click", () => replay(game));
window.setInterval(() => getTimersFromGame(game.elapsedTimeInSeconds(), game.elapsedCountdownInSeconds()), 1000);

