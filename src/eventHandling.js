const {updateView, updateMessageInDOM, prettifySeconds} = require('./domManipulation');
const {ANIMATION_SLIDE_DURATION, ANIMATION_SPAWN_DURATION, COUNTDOWN} = require("./config.js");

const listenForKeyPress = (game, event) => {
  if (isItAnArrowKey(event.key) && game.isKeyPressAllowed()) {
    handleArrowKeyPress(game, event.key)
  }
  else if (isItAHistoryKey(event.key) && game.isKeyPressAllowed("history")) {
    handleHistoryKeyPress(game, event.key)
  }
  else if (isItReplay(event.key) && game.isKeyPressAllowed("history")) {
    replay(game)
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
        game.checkCountDown(),
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
      game.checkCountDown(),
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
        game.score(),
        game.checkCountDown(),);
    frame +=1;
    if (frame === totalFrames) {
      game.onReplay = false;
      clearInterval(replay);
    }
  }, ANIMATION_SLIDE_DURATION + ANIMATION_SPAWN_DURATION );
};

const startCountdown = () => {
  let seconds = COUNTDOWN;
  let countDown = setInterval( () => {
    if (seconds === 0) {
      clearInterval(countDown)
    }
    updateMessageInDOM(`Remaining time: ${prettifySeconds(seconds)}...`);
    seconds -= 1;
  }, 1000)
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
      game.checkCountDown(),
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
