/* SAMPLE TESTS */

const {MEANING_OF_LIFE, sayThat} = require("./testSamples");

test("2 should be 2", () => expect(2).toBe(2));
test("Imported constant should have proper value", () => expect(MEANING_OF_LIFE).toBe(42));
test("Imported function should work", () => expect(sayThat('just wow')).toBe('That is just wow.'));


/* THE REAL DEAL */

const {Tile} = require('./Tile');
const {Board} = require("./Board");

testBoard = new Board();

beforeEach(() => {
    return testBoard = new Board();
});

//TILE TEST

test("Imported Tile should be of type object", () => expect(typeof(new Tile())).toBe('object'));

//BOARD TEST

describe("Board object", () => {
  test("Should be of type object", () => expect(typeof(new Board())).toBe('object'));

  test("Should have matrix property with a 4x4 board",
      () => {
        let dimension = [].concat(testBoard.matrix.length, testBoard.matrix.map(row => row.length ));
        expect(dimension).toEqual([4, 4, 4, 4, 4])
      }
  );

  test("Its matrix should only contain Tile objects",
      () => {
        //TODO: Hard to understand?
        let result = [].concat(...testBoard.matrix.map(row => row.map(object => object instanceof Tile )));
        expect(result.includes(false)).toEqual(false)
      }
  );
});


//BOARD/SPAWNTILES TEST
describe("spawnTitles method", () => {
  test("Can create a single new Tile",
      () => {
        testBoard.spawnTiles(1);
        let result = [].concat(...testBoard.matrix.map(row => row.map(object => !!object.currentValue)));
        expect(result.reduce((acc, val) => acc + val)).toEqual(1)
      }
  );

  test("Can create 16 new Tiles",
      () => {
        testBoard.spawnTiles(16);
        let result = [].concat(...testBoard.matrix.map(row => row.map(object => !!object.currentValue)));
        expect(result.reduce((acc, val) => acc + val)).toEqual(16)
      }
  );

  test("Only adds to empty tiles",
      () => {
        for (let i = 0; i < 10; i++) {
          testBoard.mock("testOneMissing");
          expect(testBoard.matrix[1][1].currentValue).toBe(null);
          testBoard.spawnTiles(1);
          expect(testBoard.matrix[1][1].currentValue).not.toEqual(null)
        }
      }
  )
});

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
