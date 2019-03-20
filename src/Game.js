const {Board} = require('./Board');


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
  this.timeline = [new Board()];
  this.head = 0;

  // TODO: Implement

}

module.exports = {
  Game,
};
