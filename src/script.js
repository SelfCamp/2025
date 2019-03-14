'use strict';

const {Board} = require('./classes');
const {updateMvAttributesInDOM, squashBoardInDOM, changeBackgroundInDOM} = require('./domManipulation');
const {createNextBoard} = require('./boardTransformation');


/* DEFINE TOP EVENT HANDLING FUNCTIONS */

const listenForArrowPress = event => {
  let isItAnArrow = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(event.key);
  if (isItAnArrow && isArrowPressAllowed()) {
    handleArrowPress(event.key)
  }
};

const handleArrowPress = (key) => {
  let directions = {'ArrowUp': 'up', 'ArrowRight': 'right', 'ArrowDown': 'down', 'ArrowLeft': 'left'};
  let direction = directions[key];
  arrowPressHistory.push({direction: direction, timestamp: new Date()});
  // console.log(direction);

  let currentBoard = boardHistory[boardHistory.length-1];
  // console.log("Previous board matrix: ", [...currentBoard.matrix]);

  let nextBoard = createNextBoard(currentBoard, direction);
  // console.log("New board matrix: ", nextBoard.matrix);
  boardHistory.push(nextBoard);

  updateMvAttributesInDOM(nextBoard, direction);
  nextBoard.resetAnimationProperties();
  setTimeout(() => squashBoardInDOM(nextBoard, direction), ANIMATION_DURATION);
  switch (nextBoard.gameStatus()) {
    case 'ongoing':
      break;
    case 'won':
      changeBackgroundInDOM('green');
      // TODO: handle win
      break;
    case 'lost':
      changeBackgroundInDOM('red');
      // TODO: handle loss
      break;
  }
};

const isArrowPressAllowed = () => {
    if (!arrowPressHistory.length) {
      return true
    }
    let previousArrowPress = arrowPressHistory[arrowPressHistory.length-1];
    let timeSinceLastArrowPress = new Date() - previousArrowPress.timestamp;
    return timeSinceLastArrowPress > ARROW_PRESS_TIMEOUT;
};


/* DEFINE CONSTANTS */

const ARROW_PRESS_TIMEOUT = 100;  // ms
const ANIMATION_DURATION = 0;


/* INITIALIZE OBJECTS */  //  Will be `resetGame` logic

const board = new Board();
board.spawnTiles(2);

const boardHistory = [board];
const arrowPressHistory = [];


/* MAIN LOGIC */

let currentBoard = boardHistory[boardHistory.length-1];
squashBoardInDOM(currentBoard);
document.addEventListener("keydown", listenForArrowPress);
