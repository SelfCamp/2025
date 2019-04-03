const {updateView, updateTimerInDOM, showPageInDOM} = require('./domManipulation');
const {ANIMATION_SLIDE_DURATION, ANIMATION_SPAWN_DURATION, FINALE_COUNTDOWN_FROM} = require("./config.js");

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
  game.ignoreKeystrokes = true;
  let replay = setInterval(() => {
    game.browseHistory(frame);
    updateView(
        game.currentBoard(),
        game.status(),
        game.maxHead(),
        game.head,
        true,
        game.score(),
        );
    frame +=1;
    if (frame === totalFrames) {
      game.ignoreKeystrokes = false;
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
      game.score(),
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

const getTimersFromGame = (elapsedTimeInSeconds, elapsedCountdownInSeconds) => {
  if (elapsedCountdownInSeconds) {
    updateTimerInDOM(prettifySeconds(FINALE_COUNTDOWN_FROM - elapsedCountdownInSeconds), "red");
  } else {
    updateTimerInDOM(prettifySeconds(elapsedTimeInSeconds), "white");
  }
};

const prettifySeconds = (secondsToCalc) => {
  let hours = parseInt( secondsToCalc / 3600);
  secondsToCalc -= hours * 3600;
  let minutes = parseInt( secondsToCalc / 60);
  secondsToCalc -= minutes * 60;
  return (
      (hours ? `${hours}:` : "") +
      `${String(minutes).padStart(2, '0')}:` +
      String(secondsToCalc).padStart(2, '0')
  )
};

switchPage = (page, ignoreKeyStrokes) => {
  switch (page) {
    case "rules":
      ignoreKeyStrokes(true);
      showPageInDOM("rules");
      break;
    case "about":
      ignoreKeyStrokes(true);
      showPageInDOM("about");
      break;
    case "game":
      ignoreKeyStrokes(false);
      showPageInDOM("game");
      break;
  }
};

module.exports = {
  listenForKeyPress,
  handleSliderChange,
  getTimersFromGame,
  switchPage,
};
