const {cloneDeep} = require('lodash');

const {squashRow, propagateTile, attemptMerge} = require('./BoardStaticMethods');
const {mockRowPairsForPropagateTileTest, mockRowPairsForSquashRowTest} = require('./mockRows');


const propagateTileTestMutation = (mockRowPair) => {
  let {indexFrom, propagatedProperly} = mockRowPair;
  let original = cloneDeep(mockRowPair.original);
  propagateTile(original, indexFrom);
  expect(original).toEqual(propagatedProperly);
};

const propagateTileTestReturnValue = (mockRowPair) => {
  let {indexFrom, expectedReturnValue} = mockRowPair;
  let original = cloneDeep(mockRowPair.original);
  let returnValue = propagateTile(original, indexFrom);
  expect(returnValue).toEqual(expectedReturnValue);
};

const squashRowTest = (mockRowPair) => {
  squashRow(mockRowPair.original);
  expect(mockRowPair.original).toEqual(mockRowPair.squashedProperly);
};


describe('attemptMerge()', () => {

  // TODO

});


describe('propagateTile()', () => {

  test("Should not move tile from end of row", () => {
    propagateTileTestMutation(mockRowPairsForPropagateTileTest["0,0,0,2 indexFrom=3"])
  });

  test("Should move tile towards end of row", () => {
    propagateTileTestMutation(mockRowPairsForPropagateTileTest["2,0,0,0 indexFrom=0"])
  });

  test("Should stop tile movement on meeting another tile of any value", () => {
    propagateTileTestMutation(mockRowPairsForPropagateTileTest["2,0,0,2 indexFrom=0"])
  });

  test("Should return index where tile has been moved", () => {
    propagateTileTestReturnValue(mockRowPairsForPropagateTileTest["0,0,0,2 indexFrom=3"]);
  });

  test("Should return index where tile has been moved", () => {
    propagateTileTestReturnValue(mockRowPairsForPropagateTileTest["2,0,0,0 indexFrom=0"]);
  });

  test("Should return index where tile has been moved", () => {
    propagateTileTestReturnValue(mockRowPairsForPropagateTileTest["2,0,0,2 indexFrom=0"]);
  });

});


describe('squashRow()', () => {

  test("Should not move tile from end of row", () =>
      squashRowTest(mockRowPairsForSquashRowTest['0,0,0,2'])
  );

  test("Should move tile towards end of row", () =>
      squashRowTest(mockRowPairsForSquashRowTest['0,0,2,0'])
  );

  test("Should not merge tiles of non-identical value", () =>
      squashRowTest(mockRowPairsForSquashRowTest['0,0,4,2'])
  );

  test("Should stop tile movement on meeting tile of differing value", () =>
      squashRowTest(mockRowPairsForSquashRowTest['4,0,0,2'])
  );

  test("Should merge two neighboring tiles of identical value", () =>
      squashRowTest(mockRowPairsForSquashRowTest['0,0,2,2'])
  );

  test("Should merge two non-neighboring but mutually visible tiles of identical value", () =>
      squashRowTest(mockRowPairsForSquashRowTest['2,0,0,2'])
  );

  test("Should merge two pairs of values in same move", () =>
      squashRowTest(mockRowPairsForSquashRowTest['2,2,4,4'])
  );

  test("Should not merge tile into one that's already been merged", () =>
      squashRowTest(mockRowPairsForSquashRowTest['4,0,2,2'])
  );

});
