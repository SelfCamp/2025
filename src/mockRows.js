const {Tile} = require("./Tile.js");


/**
 * Mocks first row of `Board.matrix`
 * @param values `currentValue` option of each `Tile`
 * @returns {(Tile|*)[]} Array of `Tile` objects
 */
const rowFromValues = (...values) => values.map(tileFromValue);

const tileFromValue = (value, i) => new Tile(`#r0c${i}`, value);


const mockRowPairs = {

  '0,0,0,2': {
    original: rowFromValues(0, 0, 0, 2),
    squashedProperly: rowFromValues(0, 0, 0, 2),
  },

  '0,0,2,0': {
    original: rowFromValues(0, 0, 2, 0),
    squashedProperly: [
      new Tile("#r0c0", 0),
      new Tile("#r0c1", 0),
      new Tile("#r0c2", 0, false, false, 1),
      new Tile("#r0c3", 2)
    ],
  },

  '0,0,4,2': {
    original: rowFromValues(0, 0, 4, 2),
    squashedProperly: rowFromValues(0, 0, 4, 2),
  },

  '4,0,0,2': {
    original: rowFromValues(4, 0, 0, 2),
    squashedProperly: [
      new Tile("#r0c0", 0, false, false, 2),
      new Tile("#r0c1", 0),
      new Tile("#r0c2", 4),
      new Tile("#r0c3", 2)
    ],
  },

  '0,0,2,2': {
    original: rowFromValues(4, 0, 0, 2),
    squashedProperly: [
      new Tile("#r0c0", 0, false, false, 2),
      new Tile("#r0c1", 0),
      new Tile("#r0c2", 4),
      new Tile("#r0c3", 2)
    ],
  },

  '2,0,0,2': {
    original: rowFromValues(4, 0, 0, 2),
    squashedProperly: [
      new Tile("#r0c0", 0, false, false, 2),
      new Tile("#r0c1", 0),
      new Tile("#r0c2", 4),
      new Tile("#r0c3", 2)
    ],
  },

  '2,2,4,4': {
    original: rowFromValues(2, 2, 4, 4),
    squashedProperly: [
      new Tile("#r0c0", 0, false, false, 2),
      new Tile("#r0c1", 0, false, false, 1),
      new Tile("#r0c2", 4, true, false, 1),
      new Tile("#r0c3", 8, true)
    ],
  },

  '4,0,2,2': {
    original: rowFromValues(4, 0, 2, 2),
    squashedProperly: [
      new Tile("#r0c0", 0, false, false, 2),
      new Tile("#r0c1", 0),
      new Tile("#r0c2", 4, false, false, 1),
      new Tile("#r0c3", 4, true)
    ],
  },

};


module.exports = {
  mockRowPairs,
};
