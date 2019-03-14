const {cloneDeep} = require('lodash');

const {Tile} = require('./Tile');


function Board() {
  this.hasChanged = false;
  this.matrix = [];
  for (let row = 0; row < 4; row++) {
    this.matrix[row] = [];
    for (let column = 0; column < 4; column++) {
      this.matrix[row].push(new Tile(`#r${row}c${column}`));
    }
  }
  this.spawnTiles = (howMany, isItTheOneAlready = false) => {
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

  this.hasChanged = () => {
    for (let row of this.matrix) {
      for (let tile of row) {
        if (tile.previousValueMvLen || tile.wasJustMerged) {
          return true;
        }
      }
    }
    return false;
  };

  this.gameStatus = () => {
    let hasEmptySpots;
    for (let row of this.matrix) {
      for (let tile of row) {
        if (tile.currentValue === 2048) {
          return 'won';
        }
        if (tile.currentValue === null) {
          hasEmptySpots = true;
        }
      }
    }
    if (hasEmptySpots) {
      return 'ongoing'
    }
    for (let direction of ["up", "right", "down", "left"]) {
      let testBoardCopy = this.createNextBoard(this, direction);
      if (testBoardCopy.hasChanged()) {
        return "ongoing"
      }
    }
    return "lost";
  };

  this.createNextBoard = (direction) => {
    let nextBoard = this.squashBoard(this, direction);
    if (nextBoard.hasChanged()) {
      nextBoard.spawnTiles(1);
    }
    return nextBoard;
  };

  this.squashBoard = (currentBoard, direction) => {
    let newBoard = new Board();
    newBoard.matrix = cloneDeep(currentBoard.matrix);
    let temporaryBoardSlices = this.sliceMatrixPerDirection(newBoard.matrix, direction);
    for (let row of temporaryBoardSlices) {
      this.squashRow(row)  // mutates tiles in input
    }
    return newBoard;
  };

  this.sliceMatrixPerDirection = (matrix, direction) => {
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

  this.squashRow = (row) => {
    for (let index of [2, 1 ,0]) {
      if (!row[index].currentValue) {
        continue
      }
      let newIndex = this.propagateTile(row, index);
      let hasMerged = this.attemptMerge(row, newIndex);
      row[index].previousValueMvLen = newIndex - index + hasMerged;
    }
  };

  this.propagateTile = (row, indexFrom) => {
    for (let indexTo of [3, 2, 1].filter((num => num > indexFrom))) {
      if (!row[indexTo].currentValue) {
        [row[indexFrom].currentValue, row[indexTo].currentValue] = [row[indexTo].currentValue, row[indexFrom].currentValue];
        return indexTo
      }
    }
    return indexFrom
  };

  this.attemptMerge = (row, index) => {
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
}


module.exports = {
  Board,
};
