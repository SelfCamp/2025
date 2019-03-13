/**
 * Example: sayThat('just wow') => 'that is just wow'
 * @param that
 * @returns {string}
 */
const sayThat = (that) => {
  return `That is ${that}.`;
};

/**
 * The unambigous constant value of the meaning of life
 * @type {number}
 */
const MEANING_OF_LIFE = 42;

function Tile(selector, currentValue=null, wasJustMerged=false, wasJustSpawned=false, previousValueMvLen=null) {
  this.currentValue = currentValue;
  this.wasJustMerged = wasJustMerged;
  this.wasJustSpawned = wasJustSpawned;
  this.previousValueMvLen = previousValueMvLen;
  this.selector = selector;
}


module.exports = {
  MEANING_OF_LIFE,
  sayThat,
  Tile,
};
