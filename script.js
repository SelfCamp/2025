'use strict';


/* DEFINE CLASSES */

function Tile(selector, currentValue=null, isCurrentValueFromMerge=false, previousValueMoveLength=null) {
  this.currentValue = currentValue;
  this.isCurrentValueFromMerge = isCurrentValueFromMerge;
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
              : 4
    }
  };
  this.resetMergeFlags = () => {
    for (let row of this.matrix) {
      for (let tile of row) {
        tile.isCurrentValueFromMerge = false;
      }
    }
  }
}


/* DEFINE BOARD TRANSFORMING FUNCTIONS */

// TODO
// const createNextBoard = (currentBoard, direction) => {
//   let nextBoard = squashBoard(currentBoard, direction);
//   nextBoard.spawnTiles(1);
//   return nextBoard;
// };



const squashBoard = (currentBoard, direction) => {
  let newBoard = new Board();
  newBoard.matrix = JSON.parse(JSON.stringify(currentBoard.matrix));  // TODO: simpler deep copy if possible
  newBoard.resetMergeFlags();
  // TODO: split into rows based on direction - keep references to tiles
  let temporaryBoardSlices = sliceMatrixPerDirection(newBoard.matrix, direction)
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
    attemptMerge(row, newIndex);
  }
};

const propagateTile = (row, indexFrom) => {
  for (let indexTo of [3, 2, 1].filter((num => num > indexFrom))) {
    if (!row[indexTo].currentValue) {
      // TODO: add index difference to previousValueMvLen
      [row[indexFrom].currentValue, row[indexTo].currentValue] = [row[indexTo].currentValue, row[indexFrom].currentValue];
      return indexTo
    }

  }
  return indexFrom
};

const attemptMerge = (row, index) => {
  let thisTile = row[index];
  let nextTile = row[index + 1];

  if (index === 3 || nextTile.isCurrentValueFromMerge) {
    return false
  }

  if (thisTile.currentValue === nextTile.currentValue) {
    thisTile.currentValue = null;
    nextTile.currentValue = nextTile.currentValue * 2;
    nextTile.isCurrentValueFromMerge = true;
  }
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

// TODO: finish
const handleArrowPress = (key) => {
  let directions = {'ArrowUp': 'up', 'ArrowRight': 'right', 'ArrowDown': 'down', 'ArrowLeft': 'left'};
  let direction = directions[key];
  arrowPressHistory.push({direction: direction, timestamp: new Date()});
  console.log(direction);

  let currentBoard = boardHistory[boardHistory.length-1];
  // let nextBoard = createNextBoard(currentBoard, direction)
  // boardHistory.push(nextBoard);
  //
  // updateMvAttributesInDOM(nextBoard, direction);
  // setTimeout(() => squashBoardInDOM(nextBoard, direction), animationDuration);
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

const ARROW_PRESS_TIMEOUT = 2000;  // ms


/* INITIALIZE OBJECTS */  //  Will be `resetGame` logic

const board = new Board();
board.spawnTiles(2);

const boardHistory = [board];
const arrowPressHistory = [];


/* MAIN LOGIC */

document.addEventListener("keydown", listenForArrowPress);

// Mock of what will be looped in `handleArrowPress`
let currentBoard = boardHistory[boardHistory.length-1];
updateMvAttributesInDOM(currentBoard, "left");
squashBoardInDOM(currentBoard);
let squashedBoard = squashBoard(currentBoard);

if (!isGameOngoing(currentBoard)) {
  handleEndOfGame();
}


/* TEST SQUASH-BOARD */

// const mockBoard = new Board();
// mockBoard.spawnTiles(10);
// console.log('Before squashBoard: ', mockBoard);
//
// let squashedBoard = squashBoard(mockBoard);
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
