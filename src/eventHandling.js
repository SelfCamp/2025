const {updateView, updateSliderInDOM} = require('./domManipulation');


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
  if (game.isBrowsingHistory()) {
    game.eraseFuture();
  }
  let direction = getDirectionFromKey(key);
  if (game.makeMove(direction)) {
    updateView(game.currentBoard(), direction, game.head);
    updateSliderInDOM(game.head);
  }
};

const handleHistoryKeyPress = (game, key) => {
  if (key === 'n') {
    game.browseHistory("next");
  } else if (key === 'p') {
    game.browseHistory("previous");
  }
  updateView(game.currentBoard());
};

const handleSliderChange = (game, event) => {
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


module.exports = {
  listenForKeyPress,
  handleSliderChange,
};
