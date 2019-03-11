'use strict';

/* DEFINE CLASSES */

function Tile(selector, currentValue=null, isCurrentValueFromMerge=false, previousValueMoveDirection=null, previousValueMoveLength=null ) {
  this.currentValue = currentValue;
  this.isCurrentValueFromMerge = isCurrentValueFromMerge;
  this.previousValueMoveDirection = previousValueMoveDirection;
  this.previousValueMvLen = previousValueMoveLength;
  this.selector = selector
}

function Board() {
  this.matrix = [];
  for (let row = 0; row < 4; row++) {
    this.matrix[row] = [];
    for (let column = 0; column < 4; column++) {
      this.matrix[row].push(new Tile(`#r${row}c${column}`));
    }
  }
  this.spawnTiles = (howMany, isItTheOneAlready=false) => {
    let emptyTiles = [];
    for (let row of this.matrix) {
      emptyTiles.push(...row.filter(tile => !tile.currentValue))
    }
    let choiceIndex = Math.floor(Math.random() * emptyTiles.length);
    emptyTiles[choiceIndex].currentValue =
        isItTheOneAlready
        ? 1
        : Math.random() < 0.9
            ? 2
            : 4
  }
}

/* DEFINE CONSTANTS */

const ARROW_PRESS_TIMEOUT = 2000;

/* CREATE OBJECTS */

const boardHistory = [];
const arrowPressHistory = [];

const board = new Board();
board.spawnTiles(2);
boardHistory.push(board);


/* GAME LOGIC */

let currentBoard = boardHistory[boardHistory.length-1];

const isArrowPressAllowed = () => {
    if (!arrowPressHistory.length) {
      return true
    }
    let previousArrowPress = arrowPressHistory[arrowPressHistory.length-1];
    let timeSinceLastArrowPress = new Date() - previousArrowPress.timestamp;
    return timeSinceLastArrowPress > ARROW_PRESS_TIMEOUT;
};

document.addEventListener("keydown", (event => {
  let isItAnArrow = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(event.key);
  if (isItAnArrow && isArrowPressAllowed()) {
      handleArrowPress(event.key)
  }
}));


// TODO
const handleArrowPress = (key) => {
  let directions = {'ArrowUp': 'up', 'ArrowRight': 'right', 'ArrowDown': 'down', 'ArrowLeft': 'left'};
  let direction = directions[key];
  arrowPressHistory.push({direction: direction, timestamp: new Date()});
  console.log(direction);

//   let currentBoard = boardHistory[boardHistory.length-1];
//   let nextBoard = createNextBoard(currentBoard, direction)
//   boardHistory.push(nextBoard);
//
//   updateMvAttributesInDOM(currentBoard, direction);
//   setTimeout(() => squashBoardInDOM(nextBoard, direction), animationDuration);
};



// console.log(currentBoard);

const updateMvAttributesInDOM = (board, direction) => {
  for (let row of board.matrix) {
    for (let tile of row) {
      let tileElement = document.querySelector(tile.selector);
      tileElement.setAttribute("data-mv-dir", direction);
      tileElement.setAttribute("data-mv-len", tile.previousValueMvLen ? tile.previousValueMvLen : "");
    }

  }
};

updateMvAttributesInDOM(currentBoard, "left");
