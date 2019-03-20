const {Board} = require('./Board');
const {ARROW_PRESS_TIMEOUT} = require('./constants');


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

  // TODO: Implement

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

  this.length = () =>
      this.timeline.slice(0, this.head + 1).length;
}

module.exports = {
  Game,
};
