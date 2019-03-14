/* DEFINE BOARD TRANSFORMING FUNCTIONS */

const {cloneDeep} = require('lodash');

const {Board} = require('./classes');


const createNextBoard = (currentBoard, direction) => {
  let nextBoard = squashBoard(currentBoard, direction);
  if (nextBoard.hasChanged()) {
    nextBoard.spawnTiles(1);
  }
  return nextBoard;
};

const squashBoard = (currentBoard, direction) => {
  let newBoard = new Board();
  newBoard.matrix = cloneDeep(currentBoard.matrix);
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


module.exports = {
  createNextBoard,
  squashBoard,
  sliceMatrixPerDirection,
  squashRow,
  propagateTile,
  attemptMerge,
};
