const {cloneDeep} = require('lodash');

const {boardMatrixFixtures} = require("./Board.testFixtures");


/**
 * Create new Board object
 *
 * @param mockScenario {"noMock"|"almostLost"|"almostWon"|"oneMissing"}
 * @constructor
 */
function Board(mockScenario='noMock') {
  this.createdAt = new Date();
  this.initiatingDirection = null;
  this.hasChanged = false;
  this.matrix = cloneDeep(boardMatrixFixtures[mockScenario]);

  /**
   * Add starter values to `howMany` empty tiles at random locations
   *
   * @param {number} howMany - How many tiles to add to the board.
   * @param {boolean} isItTheOneAlready - Return special tile if param is TRUE.
   */
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

  this.clearTileAnimationProperties = () => {
    for (let row of this.matrix) {
      for (let tile of row) {
        tile.wasJustMerged = false;
        tile.wasJustSpawned = false;
        tile.previousSlideCoordinates = {slideX: 0, slideY: 0};
      }
    }
  };

  this.hasChanged = () => {
    for (let row of this.matrix) {
      for (let tile of row) {
        if (tile.previousSlideCoordinates.slideY || tile.previousSlideCoordinates.slideX || tile.wasJustMerged) {
          return true;
        }
      }
    }
    return false;
  };

  this.isEmpty = () => {
    for (let row of this.matrix) {
      for (let tile of row) {
        if (tile.currentValue) {
          return false;
        }
      }
    }
    return true;
  };

  this.forEachTile = () => {
    let listOfTiles = [];
    for (let row of this.matrix) {
      for (let tile of row) {
        listOfTiles.push(tile)
      }
    }
    return listOfTiles
  }
}


module.exports = {
  Board,
};
