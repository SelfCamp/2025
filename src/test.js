/* SAMPLE TESTS */

const {MEANING_OF_LIFE, sayThat} = require("./testSamples");

test("2 should be 2", () => expect(2).toBe(2));
test("Imported constant should have proper value", () => expect(MEANING_OF_LIFE).toBe(42));
test("Imported function should work", () => expect(sayThat('just wow')).toBe('That is just wow.'));


/* THE REAL DEAL */

const {Tile} = require('./Tile');

test("Imported Tile should be of type object", () => expect(typeof(new Tile())).toBe('object'));


/* TEST SQUASH-BOARD */

// const mockBoard = new Board();
// mockBoard.spawnTiles(10);
// console.log('Before squashBoard: ', mockBoard);
//
// let squashedBoard = squashBoard(mockBoard, 'right');
// console.log('After squashBoard: ', squashedBoard);


/* TEST SQUASH-ROW */

// let mockRow = [
//   new Tile('r0c0', 4),
//   new Tile('r0c1', null),
//   new Tile('r0c2', 2),
//   new Tile('r0c3', 2)
// ];
// let mockRowCopy = [...mockRow];
// console.log("Before squashRow: ", mockRowCopy);
// squashRow(mockRow);
// console.log("After squashRow: ", mockRow);
