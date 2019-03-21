const {Board} = require('./Board');
const {ARROW_PRESS_TIMEOUT} = require('./config');


/**
 * Create new Game object
 *
 * - Contains all state required to play 1 game and move in its history
 *
 * @param mockScenario {"noMock"|"almostLost"|"almostWon"|"oneMissing"}
 * @constructor
 */
function Game(mockScenario) {
  /** Contains all Board objects created throughout the game (except those destroyed by undo + new move) */
  this.timeline = [new Board(mockScenario)];
  /** Determines current position in `Game.timeline` */
  this.head = 0;

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
    return timeSinceLastArrowPress > ARROW_PRESS_TIMEOUT;
  };

  /**
   * @returns {Board}
   * The board `Game.head` is currently pointing to
   */
  this.currentBoard = () =>
      this.timeline[this.head];

  /**
   * @returns {number}
   * Number of boards in history, including current one (NOT including 'future' boards when browsing history)
   */
  this.length = () =>
      this.head + 1;

  /**
   * Erase all boards after `currentBoard` (killing ability to redo)
   */
  this.eraseFuture = () =>
      this.timeline = this.timeline.slice(0, this.head + 1);

  /**
   * @param direction
   * @returns {boolean}
   */
  this.makeMove = (direction) => {
    let nextBoard = this.currentBoard().createNextBoard(direction);
    if (nextBoard) {
      this.timeline.push(nextBoard);
      this.head++;
      return true;
    }
    return false;
  };

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

  this.status = () => {
    let hasEmptySpots;
    for (let row of this.currentBoard().matrix) {
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
      let testBoardCopy = this.currentBoard().createNextBoard(direction);
      if (testBoardCopy) {
        return "ongoing"
      }
    }
    return "lost";
  };

}


module.exports = {
  Game,
};
