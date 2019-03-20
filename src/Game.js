const {Board} = require('./Board');
const {ARROW_PRESS_TIMEOUT} = require('./constants');


// TODO: Implement
/**
 * Create new Game object
 *
 * - Contains all state required to play 1 game and move in its history
 *
 * @param difficulty
 * @constructor
 */
function Game(difficulty=1) {
  this.difficulty = difficulty;
  this.score = 0;
  /** Contains all Board objects created throughout the game (except those destroyed by undo + new move) */
  this.timeline = [new Board()];
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
      head + 1
  this.timeline.slice(0, this.head + 1).length;

  /**
   * @returns {boolean}
   * `true` if current board is NOT last in timeline (`head` not at end, redo is possible)
   * `false` if current board is last in timeline (`head` at end, redo is NOT possible)
   */
  this.isBrowsingHistory = () =>
      this.head !== this.timeline.length - 1;

  /**
   * Erase all boards after `currentBoard` (killing ability to redo)
   */
  this.eraseFuture = () =>
      this.timeline = this.timeline.slice(0, this.head + 1);

  /**
   * TODO: write this
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

}


module.exports = {
  Game,
};
