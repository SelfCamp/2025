'use strict';

const {Board} = require('./Board');
const {updateView} = require('./domManipulation');
const {ARROW_PRESS_TIMEOUT} = require("./constants.js");


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
  let currentBoard = boardHistory[boardHistory.length-1];

  let nextBoard = currentBoard.createNextBoard(direction);
    // displayEndOfGame(gameStatus);
    if (nextBoard.hasChanged()) {
      arrowPressHistory.push({direction: direction, timestamp: new Date()});
      boardHistory.push(nextBoard);
      updateView(nextBoard, direction);
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


/* INITIALIZE OBJECTS */  //  Will be `resetGame` logic

const board = new Board();
board.spawnTiles(2);
board.mock("1");

const boardHistory = [board];
const arrowPressHistory = [];


/* MAIN LOGIC */

//TODO: change to update view
let currentBoard = boardHistory[boardHistory.length-1];
updateView(currentBoard);
document.addEventListener("keydown", listenForArrowPress);
