const {Tile} = require("./Tile.js");

const mockList = {
  "noMock": false,
  "almostLost": [[new Tile("#r0c0", 2), new Tile("#r0c1", 8), new Tile("#r0c2", 32), new Tile("#r0c3", 2)],
    [new Tile("#r1c0", 16), new Tile("#r1c1", 128), new Tile("#r1c2", 64), new Tile("#r1c3", 8)],
    [new Tile("#r2c0", 4), new Tile("#r2c1", 32), new Tile("#r2c2", 128), new Tile("#r2c3", 4)],
    [new Tile("#r3c0", 2), new Tile("#r3c1", 4), new Tile("#r3c2", 16), new Tile("#r3c3", null)]],
  "almostWon":[[new Tile("#r0c0", 2), new Tile("#r0c1", 8), new Tile("#r0c2", 32), new Tile("#r0c3", 2)],
    [new Tile("#r1c0", 16), new Tile("#r1c1", 128), new Tile("#r1c2", 64), new Tile("#r1c3", 8)],
    [new Tile("#r2c0", 4), new Tile("#r2c1", 32), new Tile("#r2c2", 128), new Tile("#r2c3", 4)],
    [new Tile("#r3c0", 1024), new Tile("#r3c1", 1024), new Tile("#r3c2", 16), new Tile("#r3c3", null)]]
};

module.exports = {
  mockList,
};