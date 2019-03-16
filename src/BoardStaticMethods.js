/* TEMPORARY DUPLICATE methods copied from Board */
// TODO: refactor board to allow static methods


const sliceMatrixPerDirection = (matrix, direction) => {  //DUPLICATE
  let temporaryMatrixSlices = [[], [], [], []];  //DUPLICATE
  for (let i of [0, 1, 2, 3]) {  //DUPLICATE
    for (let j of [0, 1, 2, 3]) {  //DUPLICATE
      temporaryMatrixSlices[i].push(  //DUPLICATE
            (direction === 'up')     ? matrix[3-j][i]  // Rotate matrix 90° clockwise  //DUPLICATE
          : (direction === 'down')   ? matrix[j][3-i]  // Rotate matrix 90° counter-clockwise  //DUPLICATE
          : (direction === 'left')   ? matrix[i][3-j]  // Flip matrix along row axis  //DUPLICATE
          :             /* 'right' */  matrix[i][j]    // Leave as is  //DUPLICATE
      )  //DUPLICATE
    }  //DUPLICATE
  }  //DUPLICATE
  return temporaryMatrixSlices  //DUPLICATE
};  //DUPLICATE
  //DUPLICATE
const squashRow = (row) => {  //DUPLICATE
  for (let index of [2, 1 ,0]) {  //DUPLICATE
    if (!row[index].currentValue) {  //DUPLICATE
      continue  //DUPLICATE
    }  //DUPLICATE
    let newIndex = propagateTile(row, index);  //DUPLICATE
    let hasMerged = attemptMerge(row, newIndex);  //DUPLICATE
    row[index].previousValueMvLen = newIndex - index + hasMerged || null;  //DUPLICATE
  }  //DUPLICATE
};  //DUPLICATE
  //DUPLICATE
const propagateTile = (row, indexFrom) => {  //DUPLICATE
  let largerIndexes = [3, 2, 1].filter((num => num > indexFrom));  //DUPLICATE
  for (let indexTo of largerIndexes) {  //DUPLICATE
    if (!row[indexTo].currentValue) {  //DUPLICATE
      [row[indexFrom].currentValue, row[indexTo].currentValue] = [row[indexTo].currentValue, row[indexFrom].currentValue];  //DUPLICATE
      return indexTo;  //DUPLICATE
    }  //DUPLICATE
  }  //DUPLICATE
  return indexFrom;  //DUPLICATE
};  //DUPLICATE
  //DUPLICATE
const attemptMerge = (row, index) => {  //DUPLICATE
  let thisTile = row[index];  //DUPLICATE
  let nextTile = row[index + 1];  //DUPLICATE
  //DUPLICATE
  if (index === 3 || nextTile.wasJustMerged) {  //DUPLICATE
    return false;  //DUPLICATE
  }  //DUPLICATE
  //DUPLICATE
  if (thisTile.currentValue === nextTile.currentValue) {  //DUPLICATE
    thisTile.currentValue = null;  //DUPLICATE
    nextTile.currentValue = nextTile.currentValue * 2;  //DUPLICATE
    nextTile.wasJustMerged = true;  //DUPLICATE
    return true;  //DUPLICATE
  }  //DUPLICATE
  //DUPLICATE
  return false;  //DUPLICATE
};  //DUPLICATE


module.exports = {
  sliceMatrixPerDirection,
  squashRow,
  propagateTile,
  attemptMerge,
};
