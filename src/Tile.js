/**
 * @param selector {string}
 * @param currentValue {?number}
 * @param wasJustMerged {boolean}
 * @param wasJustSpawned {boolean}
 * @param previousSlideCoordinates {?object}
 * @constructor
 */
function Tile(selector, currentValue=null, wasJustMerged=false, wasJustSpawned=false, previousSlideCoordinates={slideX: 0, slideY: 0}) {
  this.currentValue = currentValue || null;  // Turns `0` argument into `null`
  this.wasJustMerged = wasJustMerged;
  this.wasJustSpawned = wasJustSpawned;
  this.previousSlideCoordinates = previousSlideCoordinates;  // Turns `0` argument into `null`
  this.selector = selector;
}

module.exports = {
  Tile,
};
