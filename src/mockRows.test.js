const {squashRow, propagateTile, attemptMerge} = require('./BoardStaticMethods');
const {mockRowPairs} = require('./mockRows');


const squashRowTest = (mockRowPair) => {
  squashRow(mockRowPair.original);
  expect(mockRowPair.original).toEqual(mockRowPair.squashedProperly);
};


describe('squashRow()', () => {

  test("Should not move tile from end of row", () =>
      squashRowTest(mockRowPairs['0,0,0,2'])
  );

  test("Should move tile towards end of row", () =>
      squashRowTest(mockRowPairs['0,0,2,0'])
  );

  test("Should not merge tiles of non-identical value", () =>
      squashRowTest(mockRowPairs['0,0,4,2'])
  );

  test("Should stop tile movement on meeting tile of differing value", () =>
      squashRowTest(mockRowPairs['4,0,0,2'])
  );

  test("Should merge two neighboring tiles of identical value", () =>
      squashRowTest(mockRowPairs['0,0,2,2'])
  );

  test("Should merge two non-neighboring but mutually visible tiles of identical value" , () =>
      squashRowTest(mockRowPairs['2,0,0,2'])
  );

  test("Should merge two pairs of values in same move" , () =>
      squashRowTest(mockRowPairs['2,2,4,4'])
  );

  test("Should not merge tile into one that's already been merged" , () =>
      squashRowTest(mockRowPairs['4,0,2,2'])
  );

});


// TODO
// describe('propagateTile()', () => {});


// TODO
// describe('attemptMerge()', () => {});
