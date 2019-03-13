(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';


/* DEFINE CLASSES */

function Tile(selector, currentValue=null, wasJustMerged=false, wasJustSpawned=false, previousValueMvLen=null) {
  this.currentValue = currentValue;
  this.wasJustMerged = wasJustMerged;
  this.wasJustSpawned = wasJustSpawned;
  this.previousValueMvLen = previousValueMvLen;
  this.selector = selector;
}

function Board() {
  this.hasChanged = false;
  this.matrix = [];
  for (let row = 0; row < 4; row++) {
    this.matrix[row] = [];
    for (let column = 0; column < 4; column++) {
      this.matrix[row].push(new Tile(`#r${row}c${column}`));
    }
  }
  this.spawnTiles = (howMany, isItTheOneAlready=false) => {
    for (let i = 0; i < howMany; i++) {
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
              : 4;
      emptyTiles[choiceIndex].wasJustSpawned = true;
    }
  };
  this.resetAnimationProperties = () => {
    for (let row of this.matrix) {
      for (let tile of row) {
        tile.wasJustMerged = false;
        tile.wasJustSpawned = false;
        tile.previousValueMvLen = null;
      }
    }
  };
  // TODO: implement (use wasJustMerged & previousValueMvLen to check if anything changed since last board)
  this.hasChanged = () => {}
}


/* DEFINE BOARD TRANSFORMING FUNCTIONS */

const createNextBoard = (currentBoard, direction) => {
  let nextBoard = squashBoard(currentBoard, direction);
  // TODO: do only if Board.hasChanged()
  nextBoard.spawnTiles(1);
  return nextBoard;
};

const squashBoard = (currentBoard, direction) => {
  let newBoard = new Board();
  newBoard.matrix = JSON.parse(JSON.stringify(currentBoard.matrix));  // TODO: simpler deep copy if possible
  let temporaryBoardSlices = sliceMatrixPerDirection(newBoard.matrix, direction);
  for (let row of temporaryBoardSlices) {
    squashRow(row)  // mutates tiles in input
  }
  return newBoard;
};

const sliceMatrixPerDirection = (matrix, direction) => {
  let temporaryMatrixSlices = [[], [], [], []];
  switch (direction) {
    case "up":
      for (let columnIndex of [0, 1, 2, 3]) {
        for (let rowIndex of [3, 2, 1, 0]) {
          temporaryMatrixSlices[columnIndex].push(matrix[rowIndex][columnIndex])
        }
      }
      break;
    case "down":
      for (let columnIndex of [0, 1, 2, 3]) {
        for (let rowIndex of [0, 1, 2, 3]) {
          temporaryMatrixSlices[columnIndex].push(matrix[rowIndex][columnIndex])
        }
      }
      break;
    case "left":
      for (let rowIndex of [0, 1, 2, 3]) {
        for (let columnIndex of [3, 2, 1, 0]) {
          temporaryMatrixSlices[rowIndex].push(matrix[rowIndex][columnIndex])
        }
      }
      break;
    case "right":
      return matrix
  }
  return temporaryMatrixSlices
};

const squashRow = (row) => {
  for (let index of [2, 1 ,0]) {
    if (!row[index].currentValue) {
      continue
    }
    let newIndex = propagateTile(row, index);
    let hasMerged = attemptMerge(row, newIndex);
    row[index].previousValueMvLen = newIndex - index + hasMerged;
  }
};

const propagateTile = (row, indexFrom) => {
  for (let indexTo of [3, 2, 1].filter((num => num > indexFrom))) {
    if (!row[indexTo].currentValue) {
      [row[indexFrom].currentValue, row[indexTo].currentValue] = [row[indexTo].currentValue, row[indexFrom].currentValue];
      return indexTo
    }
  }
  return indexFrom
};

const attemptMerge = (row, index) => {
  let thisTile = row[index];
  let nextTile = row[index + 1];

  if (index === 3 || nextTile.wasJustMerged) {
    return false;
  }

  if (thisTile.currentValue === nextTile.currentValue) {
    thisTile.currentValue = null;
    nextTile.currentValue = nextTile.currentValue * 2;
    nextTile.wasJustMerged = true;
    return true;
  }

  return false;
};


/* DEFINE VIEW HANDLING FUNCTIONS */

const updateMvAttributesInDOM = (board, direction) => {
  for (let row of board.matrix) {
    for (let tile of row) {
      let tileElement = document.querySelector(tile.selector);
      tileElement.setAttribute("data-mv-dir", direction);
      tileElement.setAttribute("data-mv-len", tile.previousValueMvLen ? tile.previousValueMvLen : "");
    }
  }
};

const squashBoardInDOM = (nextBoard) => {
  for (let row of nextBoard.matrix) {
    for (let tile of row) {
      let tileElement = document.querySelector(tile.selector);
      tileElement.setAttribute("value", tile.currentValue);
      tileElement.textContent = tile.currentValue;
    }
  }
};

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
  console.log(direction);

  let currentBoard = boardHistory[boardHistory.length-1];
  // console.log("Previous board matrix: ", [...currentBoard.matrix]);

  let nextBoard = createNextBoard(currentBoard, direction);
  // console.log("New board matrix: ", nextBoard.matrix);
  boardHistory.push(nextBoard);

  updateMvAttributesInDOM(nextBoard, direction);
  nextBoard.resetAnimationProperties();
  setTimeout(() => squashBoardInDOM(nextBoard, direction), ANIMATION_DURATION);
};

const isArrowPressAllowed = () => {
    if (!arrowPressHistory.length) {
      return true
    }
    let previousArrowPress = arrowPressHistory[arrowPressHistory.length-1];
    let timeSinceLastArrowPress = new Date() - previousArrowPress.timestamp;
    return timeSinceLastArrowPress > ARROW_PRESS_TIMEOUT;
};


/* DEFINE OTHER FUNCTIONS */

const isGameOngoing = (board) => {
  return true;  // TODO: return (maxTileValue < 2048 && !isBoardFull)
};

const handleEndOfGame = () => {
  // TODO
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

// if (!isGameOngoing(currentBoard)) {
//   handleEndOfGame();
// }


/* TEST SQUASH-BOARD */

// const mockBoard = new Board();
// mockBoard.spawnTiles(10);
// console.log('Before squashBoard: ', mockBoard);
//
// let squashedBoard = squashBoard(mockBoard, 'right');
// console.log('After squashBoard: ', squashedBoard);


/* TEST SQUASH-ROW */

// let mockRow = [
//   new Tile('r0c0', 4),
//   new Tile('r0c1', null),
//   new Tile('r0c2', 2),
//   new Tile('r0c3', 2)
// ];
// let mockRowCopy = [...mockRow];
// console.log("Before squashRow: ", mockRowCopy);
// squashRow(mockRow);
// console.log("After squashRow: ", mockRow);

},{}]},{},[1]);
