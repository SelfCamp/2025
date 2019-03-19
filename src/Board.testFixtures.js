const {Tile} = require("./Tile.js");


/**
 * Mocks first row of `Board.matrix`
 * @param values `currentValue` option of each `Tile`
 * @returns {(Tile|*)[]} Array of `Tile` objects
 */
const rowFromValues = (...values) => values.map(tileFromValue);

const tileFromValue = (value, i) => new Tile(`#r0c${i}`, value);


const propagateTileFixtures = {

  '0,0,0,2 indexFrom=3': {
    original: rowFromValues(0, 0, 0, 2),
    indexFrom: 3,
    propagatedProperly: rowFromValues(0, 0, 0, 2),
    expectedReturnValue: 3,
  },

  '2,0,0,0 indexFrom=0': {
    original: rowFromValues(2, 0, 0, 0),
    indexFrom: 0,
    propagatedProperly: rowFromValues(0, 0, 0, 2),
    expectedReturnValue: 3,
  },

  '2,0,0,2 indexFrom=0': {
    original: rowFromValues(2, 0, 0, 2),
    indexFrom: 0,
    propagatedProperly: rowFromValues(0, 0, 2, 2),
    expectedReturnValue: 2,
  },

};


const attemptMergeFixtures = {

  '0,0,2,2 index=2': {
    original: rowFromValues(0, 0, 2, 2),
    index: 2,
    mergedProperly: [
      new Tile("#r0c0", 0),
      new Tile("#r0c1", 0),
      new Tile("#r0c2", 0),
      new Tile("#r0c3", 4, true)
    ],
    expectedReturnValue: true,
  },

  "0,0,4,2 index=2": {
    original: rowFromValues(0, 0, 4, 2),
    index: 2,
    mergedProperly: rowFromValues(0, 0, 4, 2),
    expectedReturnValue: false,
  },

  "0,0,4,!4 index=2": {
    original: [
      new Tile("#r0c0", 0),
      new Tile("#r0c1", 0),
      new Tile("#r0c2", 4),
      new Tile("#r0c3", 4, true)
    ],
    index: 2,
    mergedProperly: [
      new Tile("#r0c0", 0),
      new Tile("#r0c1", 0),
      new Tile("#r0c2", 4),
      new Tile("#r0c3", 4, true)
    ],
    expectedReturnValue: false,
  },

};


const squashRowFixtures = {

  '0,0,0,2': {
    original: rowFromValues(0, 0, 0, 2),
    direction: "up",
    squashedProperly: rowFromValues(0, 0, 0, 2),
  },

  '0,0,2,0': {
    original: rowFromValues(0, 0, 2, 0),
    direction: "right",
    squashedProperly: [
      new Tile("#r0c0", 0),
      new Tile("#r0c1", 0),
      new Tile("#r0c2", 0, false, false, {slideX: 1, slideY: 0}),
      new Tile("#r0c3", 2)
    ],
  },

  '0,0,4,2': {
    original: rowFromValues(0, 0, 4, 2),
    direction: "left",
    squashedProperly: rowFromValues(0, 0, 4, 2),
  },

  '4,0,0,2': {
    original: rowFromValues(4, 0, 0, 2),
    direction: "down",
    squashedProperly: [
      new Tile("#r0c0", 0, false, false, {slideX: 0, slideY: 2}),
      new Tile("#r0c1", 0),
      new Tile("#r0c2", 4),
      new Tile("#r0c3", 2)
    ],
  },

  '0,0,2,2': {
    original: rowFromValues(0, 0, 2, 2),
    direction: "left",
    squashedProperly: [
      new Tile("#r0c0", 0),
      new Tile("#r0c1", 0),
      new Tile("#r0c2", 0, false, false, {slideX: -1, slideY: 0}),
      new Tile("#r0c3", 4, true)
    ],
  },

  '2,0,0,2': {
    original: rowFromValues(2, 0, 0, 2),
    direction: "up",
    squashedProperly: [
      new Tile("#r0c0", 0, false, false, {slideX: 0, slideY: -3}),
      new Tile("#r0c1", 0),
      new Tile("#r0c2", 0),
      new Tile("#r0c3", 4, true)
    ],
  },

  '2,2,4,4': {
    original: rowFromValues(2, 2, 4, 4),
    direction: "right",
    squashedProperly: [
      new Tile("#r0c0", 0, false, false, {slideX: 2, slideY: 0}),
      new Tile("#r0c1", 0, false, false, {slideX: 1, slideY: 0}),
      new Tile("#r0c2", 4, true, false, {slideX: 1, slideY: 0}),
      new Tile("#r0c3", 8, true)
    ],
  },

  '4,0,2,2': {
    original: rowFromValues(4, 0, 2, 2),
    direction: "down",
    squashedProperly: [
      new Tile("#r0c0", 0, false, false, {slideX: 0, slideY: 2}),
      new Tile("#r0c1", 0),
      new Tile("#r0c2", 4, false, false, {slideX: 0, slideY: 1}),
      new Tile("#r0c3", 4, true)
    ],
  },

};


const boardMatrixFixtures = {

  "noMock": [
    [new Tile("#r0c0"),       new Tile("#r0c1"),       new Tile("#r0c2"),       new Tile("#r0c3")],
    [new Tile("#r1c0"),       new Tile("#r1c1"),       new Tile("#r1c2"),       new Tile("#r1c3")],
    [new Tile("#r2c0"),       new Tile("#r2c1"),       new Tile("#r2c2"),       new Tile("#r2c3")],
    [new Tile("#r3c0"),       new Tile("#r3c1"),       new Tile("#r3c2"),       new Tile("#r3c3")]
  ],

  "almostLost": [
    [new Tile("#r0c0", 2),    new Tile("#r0c1", 8),    new Tile("#r0c2", 32),   new Tile("#r0c3", 2)],
    [new Tile("#r1c0", 16),   new Tile("#r1c1", 128),  new Tile("#r1c2", 64),   new Tile("#r1c3", 8)],
    [new Tile("#r2c0", 4),    new Tile("#r2c1", 32),   new Tile("#r2c2", 128),  new Tile("#r2c3", 4)],
    [new Tile("#r3c0", 2),    new Tile("#r3c1", 4),    new Tile("#r3c2", 16),   new Tile("#r3c3", null)]
  ],

  "almostWon":[
    [new Tile("#r0c0", 2),    new Tile("#r0c1", 8),    new Tile("#r0c2", 32),   new Tile("#r0c3", 2)],
    [new Tile("#r1c0", 16),   new Tile("#r1c1", 128),  new Tile("#r1c2", 64),   new Tile("#r1c3", 8)],
    [new Tile("#r2c0", 4),    new Tile("#r2c1", 32),   new Tile("#r2c2", 128),  new Tile("#r2c3", 4)],
    [new Tile("#r3c0", 1024), new Tile("#r3c1", 1024), new Tile("#r3c2", 16),   new Tile("#r3c3", null)]
  ],

  "testOneMissing":[
    [new Tile("#r0c0", 2),    new Tile("#r0c1", 8),    new Tile("#r0c2", 32),   new Tile("#r0c3", 2)],
    [new Tile("#r1c0", 16),   new Tile("#r1c1", null), new Tile("#r1c2", 64),   new Tile("#r1c3", 8)],
    [new Tile("#r2c0", 4),    new Tile("#r2c1", 32),   new Tile("#r2c2", 128),  new Tile("#r2c3", 4)],
    [new Tile("#r3c0", 1024), new Tile("#r3c1", 1024), new Tile("#r3c2", 16),   new Tile("#r3c3", 8)]
  ],

};


module.exports = {
  propagateTileFixtures,
  attemptMergeFixtures,
  squashRowFixtures,
  boardMatrixFixtures
};
