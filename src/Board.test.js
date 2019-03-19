const {cloneDeep} = require('lodash');

const {Tile} = require('./Tile');
const {Board} = require('./Board');
const {
  squashRowFixtures,
  propagateTileFixtures,
  attemptMergeFixtures
} = require('./Board.testFixtures');


const createSliceMatrixPerDirectionFixtures = (direction) => {
  let original = new Board().matrix;
  let rotated = new Board().sliceMatrixPerDirection(original, direction);
  return {original, rotated};
};

describe('Board.sliceMatrixPerDirection()', () => {

  test("Should rotate matrix 90° clockwise for direction `up`", () => {
    let {original, rotated} = createSliceMatrixPerDirectionFixtures('up');
    expect(original[0][1]).toBe(rotated[1][3]);
  });

  test("Should preserve original arrangement for direction `right`", () => {
    let {original, rotated} = createSliceMatrixPerDirectionFixtures('right');
    expect(original[0][1]).toBe(rotated[0][1]);
  });

  test("Should rotate matrix 90° counter-clockwise for direction `down`", () => {
    let {original, rotated} = createSliceMatrixPerDirectionFixtures('down');
    expect(original[0][1]).toBe(rotated[2][0]);
  });

  test("Should flip matrix along row axis for direction `left`", () => {
    let {original, rotated} = createSliceMatrixPerDirectionFixtures('left');
    expect(original[0][1]).toBe(rotated[0][2]);
  });

});


const testAttemptMergeMutation = (mockRowPair) => {
  let {index, mergedProperly} = mockRowPair;
  let original = cloneDeep(mockRowPair.original);
  new Board().attemptMerge(original, index);
  expect(original).toEqual(mergedProperly);
};

const testAttemptMergeReturnValue = (mockRowPair) => {
  let {index, expectedReturnValue} = mockRowPair;
  let original = cloneDeep(mockRowPair.original);
  let returnValue = new Board().attemptMerge(original, index);
  expect(returnValue).toEqual(expectedReturnValue);

};

describe('Board.attemptMerge()', () => {

  test("Should merge two neighboring tiles of identical value", () => {
    testAttemptMergeMutation(attemptMergeFixtures["0,0,2,2 index=2"])
  });

  test("Should return `true` after successful merge", () => {
    testAttemptMergeReturnValue(attemptMergeFixtures["0,0,2,2 index=2"])
  });

  test("Should not merge tiles of non-identical value", () => {
    testAttemptMergeMutation(attemptMergeFixtures["0,0,4,2 index=2"])
  });

  test("Should return `false` after unsuccessful merge", () => {
    testAttemptMergeReturnValue(attemptMergeFixtures["0,0,4,2 index=2"])
  });

  test("Should not merge tile into one that's already been merged", () => {
    testAttemptMergeMutation(attemptMergeFixtures["0,0,4,!4 index=2"])
  });

});


const testPropagateTileMutation = (mockRowPair) => {
  let {indexFrom, propagatedProperly} = mockRowPair;
  let original = cloneDeep(mockRowPair.original);
  new Board().propagateTile(original, indexFrom);
  expect(original).toEqual(propagatedProperly);
};

const testPropagateTileReturnValue = (mockRowPair) => {
  let {indexFrom, expectedReturnValue} = mockRowPair;
  let original = cloneDeep(mockRowPair.original);
  let returnValue = new Board().propagateTile(original, indexFrom);
  expect(returnValue).toEqual(expectedReturnValue);
};

describe('Board.propagateTile()', () => {

  test("Should not move tile from end of row", () => {
    testPropagateTileMutation(propagateTileFixtures["0,0,0,2 indexFrom=3"])
  });

  test("Should move tile towards end of row", () => {
    testPropagateTileMutation(propagateTileFixtures["2,0,0,0 indexFrom=0"])
  });

  test("Should stop tile movement on meeting another tile of any value", () => {
    testPropagateTileMutation(propagateTileFixtures["2,0,0,2 indexFrom=0"])
  });

  test("Should return index where tile has been moved", () => {
    testPropagateTileReturnValue(propagateTileFixtures["0,0,0,2 indexFrom=3"]);
  });

  test("Should return index where tile has been moved", () => {
    testPropagateTileReturnValue(propagateTileFixtures["2,0,0,0 indexFrom=0"]);
  });

  test("Should return index where tile has been moved", () => {
    testPropagateTileReturnValue(propagateTileFixtures["2,0,0,2 indexFrom=0"]);
  });

});


const testSquashRowMutation = (mockRowPair) => {
  let {squashedProperly, direction} = mockRowPair;
  let original = cloneDeep(mockRowPair.original);
  new Board().squashRow(original, direction);
  expect(original).toEqual(squashedProperly);
};

describe('Board.squashRow()', () => {

  test("Should not move tile from end of row", () =>
      testSquashRowMutation(squashRowFixtures['0,0,0,2'])
  );

  test("Should move tile towards end of row", () =>
      testSquashRowMutation(squashRowFixtures['0,0,2,0'])
  );

  test("Should not merge tiles of non-identical value", () =>
      testSquashRowMutation(squashRowFixtures['0,0,4,2'])
  );

  test("Should stop tile movement on meeting tile of differing value", () =>
      testSquashRowMutation(squashRowFixtures['4,0,0,2'])
  );

  test("Should merge two neighboring tiles of identical value", () =>
      testSquashRowMutation(squashRowFixtures['0,0,2,2'])
  );

  test("Should merge two non-neighboring but mutually visible tiles of identical value", () =>
      testSquashRowMutation(squashRowFixtures['2,0,0,2'])
  );

  test("Should merge two pairs of values in same move", () =>
      testSquashRowMutation(squashRowFixtures['2,2,4,4'])
  );

  test("Should not merge tile into one that's already been merged", () =>
      testSquashRowMutation(squashRowFixtures['4,0,2,2'])
  );

});


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
          testBoard = new Board("testOneMissing");
          expect(testBoard.matrix[1][1].currentValue).toBe(null);
          testBoard.spawnTiles(1);
          expect(testBoard.matrix[1][1].currentValue).not.toEqual(null)
        }
      }
  )
});
