const {updateView} = require('./domManipulation');
const {ANIMATION_SLIDE_DURATION} = require("./config.js");

const listenForKeyPress = (game, event) => {
  if (game.isKeyPressAllowed()) {
    if (isItAnArrowKey(event.key)) {
      handleArrowKeyPress(game, event.key)
    }
    else if (isItAHistoryKey(event.key)) {
      handleHistoryKeyPress(game, event.key)
    }
  }
};

const handleArrowKeyPress = (game, key) => {
  if (game.canRedo()) {
    game.eraseFuture();
  }
  let direction = getDirectionFromKey(key);
  if (game.makeMove(direction)) {
    updateView(
        game.currentBoard(),
        game.status(),
        game.maxHead(),
        game.head,
        true
    );
  }
};

const handleHistoryKeyPress = (game, key) => {
  if (key === 'n') {
    game.browseHistory("next");
  } else if (key === 'p') {
    game.browseHistory("previous");
  }
  updateView(
      game.currentBoard(),
      game.status(),
      game.maxHead(),
      game.head,
      false
  );
};

const handleSliderChange = (game, event) => {
  let requestedHead = +event.target.value;
  game.browseHistory(requestedHead);
  updateView(
      game.currentBoard(),
      game.status(),
      game.maxHead(),
      game.head,
      false
  );
};

const isItAnArrowKey = (key) =>
    ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(key);

const isItAHistoryKey = (key) =>
    ['n', 'p'].includes(key);

const getDirectionFromKey = (key) => {
  let directions = {'ArrowUp': 'up', 'ArrowRight': 'right', 'ArrowDown': 'down', 'ArrowLeft': 'left'};
  return directions[key];
};


module.exports = {
  listenForKeyPress,
  handleSliderChange,
};
