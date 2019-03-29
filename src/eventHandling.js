const {updateView} = require('./domManipulation');
const {ANIMATION_SLIDE_DURATION, ANIMATION_SPAWN_DURATION} = require("./config.js");

const listenForKeyPress = (game, event) => {
  if (game.isKeyPressAllowed()) {
    if (isItAnArrowKey(event.key)) {
      handleArrowKeyPress(game, event.key)
    }
    else if (isItAHistoryKey(event.key)) {
      handleHistoryKeyPress(game, event.key)
    }
    else if (isItReplay(event.key)) {
      replay(game)
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
        true,
        game.score(),
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
      false,
      game.score(),
  );
};

const replay = (game) => {
  let frame = 0;
  let totalFrames = game.length();
  game.onReplay = true;
  let replay = setInterval(() => {
    game.browseHistory(frame);
    updateView(
        game.currentBoard(),
        game.status(),
        game.maxHead(),
        game.head,
        true,
        game.score());
    frame +=1;
    if (frame === totalFrames) {
      game.onReplay = false;
      clearInterval(replay);
    }
  }, ANIMATION_SLIDE_DURATION + ANIMATION_SPAWN_DURATION );
};


const handleSliderChange = (game, event) => {
  let requestedHead = +event.target.value;
  game.browseHistory(requestedHead);
  updateView(
      game.currentBoard(),
      game.status(),
      game.maxHead(),
      game.head,
      false,
      game.score,
  );
};

const isItAnArrowKey = (key) =>
    ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(key);

const isItAHistoryKey = (key) =>
    ['n', 'p',].includes(key);

const isItReplay = (key) =>
    ['r'].includes(key);

const getDirectionFromKey = (key) => {
  let directions = {'ArrowUp': 'up', 'ArrowRight': 'right', 'ArrowDown': 'down', 'ArrowLeft': 'left'};
  return directions[key];
};


module.exports = {
  listenForKeyPress,
  handleSliderChange,
};
