const {cloneDeep} = require('lodash');

const {squashRow, propagateTile, attemptMerge} = require('./BoardStaticMethods');
const {
  mockRowPairsForSquashRowTest,
  mockRowPairsForPropagateTileTest,
  mockRowPairsForAttemptMergeTest
} = require('./Board.testFixtures');


const testAttemptMergeMutation = (mockRowPair) => {
  let {index, mergedProperly} = mockRowPair;
  let original = cloneDeep(mockRowPair.original);
  attemptMerge(original, index);
  expect(original).toEqual(mergedProperly);
};

const testAttemptMergeReturnValue = (mockRowPair) => {
  let {index, expectedReturnValue} = mockRowPair;
  let original = cloneDeep(mockRowPair.original);
  let returnValue = attemptMerge(original, index);
  expect(returnValue).toEqual(expectedReturnValue);

};

describe('Board.attemptMerge()', () => {

  test("Should merge two neighboring tiles of identical value", () => {
    testAttemptMergeMutation(mockRowPairsForAttemptMergeTest["0,0,2,2 index=2"])
  });

  test("Should return `true` after successful merge", () => {
    testAttemptMergeReturnValue(mockRowPairsForAttemptMergeTest["0,0,2,2 index=2"])
  });

  test("Should not merge tiles of non-identical value", () => {
    testAttemptMergeMutation(mockRowPairsForAttemptMergeTest["0,0,4,2 index=2"])
  });

  test("Should return `false` after unsuccessful merge", () => {
    testAttemptMergeReturnValue(mockRowPairsForAttemptMergeTest["0,0,4,2 index=2"])
  });

  test("Should not merge tile into one that's already been merged", () => {
    testAttemptMergeMutation(mockRowPairsForAttemptMergeTest["0,0,4,!4 index=2"])
  });

});


const testPropagateTileMutation = (mockRowPair) => {
  let {indexFrom, propagatedProperly} = mockRowPair;
  let original = cloneDeep(mockRowPair.original);
  propagateTile(original, indexFrom);
  expect(original).toEqual(propagatedProperly);
};

const testPropagateTileReturnValue = (mockRowPair) => {
  let {indexFrom, expectedReturnValue} = mockRowPair;
  let original = cloneDeep(mockRowPair.original);
  let returnValue = propagateTile(original, indexFrom);
  expect(returnValue).toEqual(expectedReturnValue);
};

describe('Board.propagateTile()', () => {

  test("Should not move tile from end of row", () => {
    testPropagateTileMutation(mockRowPairsForPropagateTileTest["0,0,0,2 indexFrom=3"])
  });

  test("Should move tile towards end of row", () => {
    testPropagateTileMutation(mockRowPairsForPropagateTileTest["2,0,0,0 indexFrom=0"])
  });

  test("Should stop tile movement on meeting another tile of any value", () => {
    testPropagateTileMutation(mockRowPairsForPropagateTileTest["2,0,0,2 indexFrom=0"])
  });

  test("Should return index where tile has been moved", () => {
    testPropagateTileReturnValue(mockRowPairsForPropagateTileTest["0,0,0,2 indexFrom=3"]);
  });

  test("Should return index where tile has been moved", () => {
    testPropagateTileReturnValue(mockRowPairsForPropagateTileTest["2,0,0,0 indexFrom=0"]);
  });

  test("Should return index where tile has been moved", () => {
    testPropagateTileReturnValue(mockRowPairsForPropagateTileTest["2,0,0,2 indexFrom=0"]);
  });

});


const testSquashRowMutation = (mockRowPair) => {
  let {squashedProperly} = mockRowPair;
  let original = cloneDeep(mockRowPair.original);
  squashRow(original);
  expect(original).toEqual(squashedProperly);
};

describe('Board.squashRow()', () => {

  test("Should not move tile from end of row", () =>
      testSquashRowMutation(mockRowPairsForSquashRowTest['0,0,0,2'])
  );

  test("Should move tile towards end of row", () =>
      testSquashRowMutation(mockRowPairsForSquashRowTest['0,0,2,0'])
  );

  test("Should not merge tiles of non-identical value", () =>
      testSquashRowMutation(mockRowPairsForSquashRowTest['0,0,4,2'])
  );

  test("Should stop tile movement on meeting tile of differing value", () =>
      testSquashRowMutation(mockRowPairsForSquashRowTest['4,0,0,2'])
  );

  test("Should merge two neighboring tiles of identical value", () =>
      testSquashRowMutation(mockRowPairsForSquashRowTest['0,0,2,2'])
  );

  test("Should merge two non-neighboring but mutually visible tiles of identical value", () =>
      testSquashRowMutation(mockRowPairsForSquashRowTest['2,0,0,2'])
  );

  test("Should merge two pairs of values in same move", () =>
      testSquashRowMutation(mockRowPairsForSquashRowTest['2,2,4,4'])
  );

  test("Should not merge tile into one that's already been merged", () =>
      testSquashRowMutation(mockRowPairsForSquashRowTest['4,0,2,2'])
  );

});
