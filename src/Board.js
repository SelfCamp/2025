const {cloneDeep} = require('lodash');

const {Tile} = require('./Tile');
const {mockList} = require("./mockBoards");

/**
 * Create new Board object.
 * @constructor
 */
function Board(scenario="noMock") {
  this.hasChanged = false;
  this.matrix = mockList[scenario];
  /**
   * Add new tile(s) to the board.
   * @param {number} howMany - How many tiles to add to the board.
   * @param {boolean} isItTheOneAlready - Return special tile if param is TRUE.
   */
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
      let testBoardCopy = this.createNextBoard(direction);
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

  /**
   * Return rotated matrix with references to original `Tile` objects
   *
   * - Prepares Board.matrix to be squashed direction-agnostically
   *
   * @param matrix {Tile[][]}
   * 4x4 matrix of `Tile` objects
   *
   * @param direction {'up'|'right'|'down'|'left'}
   * Determines which direction will become 'right' in the rotated matrix
   *
   * @returns {Tile[][]}
   * Rotated matrix with references to original `Tile` objects
   */
  this.sliceMatrixPerDirection = (matrix, direction) => {
    let temporaryMatrixSlices = [[], [], [], []];
    for (let i of [0, 1, 2, 3]) {
      for (let j of [0, 1, 2, 3]) {
        temporaryMatrixSlices[i].push(
            (direction === 'up')     ? matrix[3-j][i]  // Rotate matrix 90° clockwise
          : (direction === 'down')   ? matrix[j][3-i]  // Rotate matrix 90° counter-clockwise
          : (direction === 'left')   ? matrix[i][3-j]  // Flip matrix along row axis
          :             /* 'right' */  matrix[i][j]    // Leave as is
        )
      }
    }
    return temporaryMatrixSlices
  };

  /**
   * Mutate input `row` by moving and merging tiles according to game rules
   *
   * - Direction-agnostic: works towards last index
   * - Doesn't care about other rows in `Board.matrix`
   *
   * @param row - Array of four `Tile` objects, arranged to be squashed towards end of Array
   */
  this.squashRow = (row) => {
    for (let index of [2, 1 ,0]) {
      if (!row[index].currentValue) {
        continue
      }
      let newIndex = this.propagateTile(row, index);
      let hasMerged = this.attemptMerge(row, newIndex);
      row[index].previousValueMvLen = newIndex - index + hasMerged || null;
    }
  };

  /**
   * Mutate input `row` by moving one `Tile` at given index to to furthest empty spot towards last index
   *
   * - Handles one `Tile` only
   * - Implements move by swapping `Tile.currentValue` between two indexes
   * - Other `Tile` attributes aren't modified (they are assumed to be empty at this point)
   *
   * @param row {Array}
   * Array of four `Tile` objects, arranged to be squashed towards end of Array
   *
   * @param indexFrom {number}
   * Index of `Tile` to be moved
   *
   * @returns {number}
   * Index where `Tile` was moved to
   */
  this.propagateTile = (row, indexFrom) => {
    let largerIndexes = [3, 2, 1].filter((num => num > indexFrom));
    for (let indexTo of largerIndexes) {
      if (!row[indexTo].currentValue) {
        [row[indexFrom].currentValue, row[indexTo].currentValue] = [row[indexTo].currentValue, row[indexFrom].currentValue];
        return indexTo;
      }
    }
    return indexFrom;
  };

  /**
   * Mutate input `row` by merging one `Tile` at given index into the next one, if appropriate
   *
   * Appropriate if:
   *   - next `Tile` is of same value
   *   - next `Tile` hasn't been merged yet in this move
   *
   * @param row {Array}
   * Array of four `Tile` objects, arranged to be squashed towards end of Array
   *
   * @param index {number}
   * Index of `Tile` to be merged
   *
   * @returns {boolean}
   * Whether merge has been made or not
   */
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
