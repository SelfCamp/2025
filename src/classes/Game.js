const {cloneDeep} = require('lodash');

const {Board} = require('./Board');
const {ARROW_PRESS_TIMEOUT} = require('../config');


/**
 * Create new Game object
 *
 * - Contains all state required to play 1 game and move in its history
 *
 * @param mockScenario {"noMock"|"almostLost"|"almostWon"|"oneMissing"}
 * @constructor
 */
function Game(mockScenario='noMock') {
  /** Contains all Board objects created throughout the game (except those destroyed by undo + new move) */
  this.timeline = [new Board(mockScenario)];
  /** Determines current position in `Game.timeline` */
  this.head = 0;
  this.createdAt = new Date();
  this.onReplay = false;
  this.tempScore = 0;

  /**
   * Determines whether enough time has passed since last keypress to perform a new one
   *
   * - Makes sure board transformation finishes before starting a new one, avoiding UI glitches
   * @returns {boolean}
   */
  this.isKeyPressAllowed = () => {
    if (this.timeline.length === 1) {
      return true;
    }
    let timeSinceLastArrowPress = new Date() - this.currentBoard().createdAt;
    return timeSinceLastArrowPress > ARROW_PRESS_TIMEOUT &&
        !this.onReplay;
  };

  this.score = () => {
    return this.timeline.slice(0, this.length()).map(board => board.score).reduce((acc, val) => acc + val)
  };

  /**
   * @returns {Board}
   * The board `Game.head` is currently pointing to
   */
  this.currentBoard = () =>
      this.timeline[this.head];

  /**
   * @returns {number}
   * Number of boards in history, up to and including current one (NOT including 'future' boards present after undo)
   */
  this.length = () =>
      this.head + 1;

  /**
   * @returns {number}
   * Number of boards in timeline (including 'future' boards when present after undo)
   */
  this.lengthWithFuture = () =>
      this.timeline.length;

  /**
   * @returns {number}
   * Latest position `Game.head` can be set to
   */
  this.maxHead = () =>
      this.timeline.length -1;

  /**
   * Erase all boards after `currentBoard` (killing ability to redo)
   */
  this.eraseFuture = () =>
      this.timeline = this.timeline.slice(0, this.head + 1);

  /**
   * Move `head` to requested position
   *
   * @param whichBoard {number|'previous'|'next'}
   */
  this.browseHistory = (whichBoard) => {
    switch (whichBoard) {
      case "previous":
        if (this.canUndo())
          this.head--;
        break;
      case "next":
        if (this.canRedo())
          this.head++;
        break;
      default:
        console.log(whichBoard);
        this.head = whichBoard;
    }
  };

  /**
   * @returns {boolean}
   * `true` if current board is NOT first in timeline (`head` not at 0, undo is possible)
   * `false` if current board is first in timeline (`head` at 0, undo is NOT possible)
   */
  this.canUndo = () =>
      (this.head > 0);

  /**
   * @returns {boolean}
   * `true` if current board is NOT last in timeline (`head` not at end, redo is possible)
   * `false` if current board is last in timeline (`head` at end, redo is NOT possible)
   */
  this.canRedo = () =>
      (this.head < this.timeline.length - 1);

  /**
   * Return string describing game status by analyzing board given as input (default: `currentBoard`)
   *
   * @param whenBoardIs
   * @returns {'ongoing'|'timeForTheOne'|'won'|'lost'}
   */
  this.status = (whenBoardIs=this.currentBoard()) => {
    let hasEmptySpots;
    let hasOne;
    let maxValue = 0;
    for (let tile of whenBoardIs.tiles()) {
      if (tile.currentValue > maxValue) {
        maxValue = tile.currentValue;
      }
      if (!tile.currentValue) {
        hasEmptySpots = true;
      }
      if (tile.currentValue === 1) {
        hasOne = true;
      }
    }
    if (maxValue === 2049) {
      return 'won'
    }
    if (maxValue === 2048 && hasOne && hasEmptySpots) {
      return "finale"
    }
    if (maxValue === 2048 && hasEmptySpots) {
      return 'timeForTheOne'  // TODO: continue expanding +1 logic outwards from here
    }
    if (hasEmptySpots) {
      return 'ongoing'
    }
    for (let direction of ["up", "right", "down", "left"]) {
      let testBoardCopy = this.nextBoard(direction);
      if (testBoardCopy) {
        return "ongoing"
      }
    }
    return "lost";
  };

  /**
   * @param direction
   * @returns {boolean}
   */
  this.makeMove = (direction) => {
    let nextBoard = this.nextBoard(direction);
    if (nextBoard) {
      let nextStatus = this.status(nextBoard);
      if (nextStatus === "timeForTheOne") {
        nextBoard.spawnTiles(1, true)
      }
      else if (nextStatus === 'ongoing' || "finale") {
        nextBoard.spawnTiles(1);
      }
      this.timeline.push(nextBoard);
      this.head++;
      return true;
    }
    return false;
  };

  /**
   * Return clone of Game.currentBoard squashed in given direction, or `false` if squashing results in no change
   *
   * @param direction
   * @returns {*}
   */
  this.nextBoard = (direction) => {
    let nextBoard = this.squashBoard(this.currentBoard(), direction);
    if (nextBoard.hasChanged()) {
      return nextBoard;
    }
    return false;
  };

  this.squashBoard = (currentBoard, direction) => {
    this.tempScore = 0;
    let newBoard = new Board();
    newBoard.initiatingDirection = direction;
    newBoard.matrix = cloneDeep(currentBoard.matrix);
    newBoard.clearTileAnimationProperties();
    let temporaryBoardSlices = this.sliceMatrixPerDirection(newBoard.matrix, direction);
    for (let row of temporaryBoardSlices) {
      this.squashRow(row, direction)  // mutates tiles in input
    }
    newBoard.score = this.tempScore;
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
   * Mutate tiles in input `row` by moving and merging tiles according to game rules
   *
   * - Direction-agnostic: propagates tiles towards last index
   * - Doesn't care about other rows in `Board.matrix`
   * - Processes tiles one by one
   * - Start with tile at latest index
   * - For each tile:
   *   - Move to furthest empty spot towards last index
   *   - Merge with next tile if it has the same value and hasn't been merged already in this round
   *
   * Examples:
   *
   * ```
   *   → → → →
   *   4 2 . 2
   *   4 . 2 2  // moved
   *   4 . .!4  // merged and flagged
   *   . . 4!4  // moved
   *   . . 4!4  // can't merge again
   *
   *   → → → →
   *   2 2 2 2
   *   2 2 .!4  // merged and flagged
   *   2 . 2!4  // moved
   *   2 . 2!4  // can't merge different value
   *   . 2 2!4  // moved
   *   . .!4!4  // merged and flagged
   * ```
   *
   * @param row
   * Array of four `Tile` objects, arranged to be squashed towards end of Array
   *
   * @param direction
   * Used to calculate `previousSlideCoordinates`
   */
  this.squashRow = (row, direction) => {
    for (let index of [2, 1 ,0]) {
      if (!row[index].currentValue) {
        continue
      }
      let newIndex = this.propagateTile(row, index);
      let hasMerged = this.attemptMerge(row, newIndex);
      let mvLen = newIndex - index + hasMerged || 0;
      switch (direction) {
        case 'up':
          row[index].previousSlideCoordinates = {slideX: 0, slideY: mvLen * -1 + 0}; // +0 to convert possible -0 to 0
          break;
        case 'right':
          row[index].previousSlideCoordinates = {slideX: mvLen, slideY: 0};
          break;
        case 'down':
          row[index].previousSlideCoordinates = {slideX: 0, slideY: mvLen};
          break;
        case 'left':
          row[index].previousSlideCoordinates = {slideX: mvLen * -1 + 0, slideY: 0};
      }
    }
  };

  /**
   * Mutate input `row` by moving one `Tile` at given index to furthest empty spot towards last index
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
      this.tempScore += nextTile.currentValue;
      nextTile.wasJustMerged = true;
      return true;
    }
    else if (thisTile.currentValue === 2048 && nextTile.currentValue === 1 || thisTile.currentValue === 1 && nextTile.currentValue === 2048) {
      thisTile.currentValue = null;
      nextTile.currentValue = 2049;
      nextTile.wasJustMerged = true;
      this.tempScore += 1;
      return true;
    }

    return false;
  };

  this.elapsedTimeInSeconds = () => parseInt((new Date() - this.createdAt) / 1000)
  ;

  if (this.currentBoard().isEmpty()) {
    this.currentBoard().spawnTiles(2);
  }

}


module.exports = {
  Game,
};
