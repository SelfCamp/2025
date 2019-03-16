/* TEMPORARY DUPLICATE methods copied from Board */
// TODO: refactor board to allow static methods


const squashRow = (row) => {  // DON'T MODIFY here, fix in Board and redirect tests there
  for (let index of [2, 1 ,0]) {  // DON'T MODIFY here, fix in Board and redirect tests there
    if (!row[index].currentValue) {  // DON'T MODIFY here, fix in Board and redirect tests there
      continue  // DON'T MODIFY here, fix in Board and redirect tests there
    }  // DON'T MODIFY here, fix in Board and redirect tests there
    let newIndex = propagateTile(row, index);  // DON'T MODIFY here, fix in Board and redirect tests there
    let hasMerged = attemptMerge(row, newIndex);  // DON'T MODIFY here, fix in Board and redirect tests there
    row[index].previousValueMvLen = newIndex - index + hasMerged || null;  // DON'T MODIFY here, fix in Board and redirect tests there
  }  // DON'T MODIFY here, fix in Board and redirect tests there
};  // DON'T MODIFY here, fix in Board and redirect tests there
  // DON'T MODIFY here, fix in Board and redirect tests there
const propagateTile = (row, indexFrom) => {  // DON'T MODIFY here, fix in Board and redirect tests there
    let largerIndexes = [3, 2, 1].filter((num => num > indexFrom));  // DON'T MODIFY here, fix in Board and redirect tests there
    for (let indexTo of largerIndexes) {  // DON'T MODIFY here, fix in Board and redirect tests there
      if (!row[indexTo].currentValue) {  // DON'T MODIFY here, fix in Board and redirect tests there
        [row[indexFrom].currentValue, row[indexTo].currentValue] = [row[indexTo].currentValue, row[indexFrom].currentValue];  // DON'T MODIFY here, fix in Board and redirect tests there
        return indexTo;  // DON'T MODIFY here, fix in Board and redirect tests there
      }  // DON'T MODIFY here, fix in Board and redirect tests there
  }  // DON'T MODIFY here, fix in Board and redirect tests there
  return indexFrom;  // DON'T MODIFY here, fix in Board and redirect tests there
};  // DON'T MODIFY here, fix in Board and redirect tests there
  // DON'T MODIFY here, fix in Board and redirect tests there
const attemptMerge = (row, index) => {  // DON'T MODIFY here, fix in Board and redirect tests there
  let thisTile = row[index];  // DON'T MODIFY here, fix in Board and redirect tests there
  let nextTile = row[index + 1];  // DON'T MODIFY here, fix in Board and redirect tests there
  // DON'T MODIFY here, fix in Board and redirect tests there
  if (index === 3 || nextTile.wasJustMerged) {  // DON'T MODIFY here, fix in Board and redirect tests there
    return false;  // DON'T MODIFY here, fix in Board and redirect tests there
  }  // DON'T MODIFY here, fix in Board and redirect tests there
  // DON'T MODIFY here, fix in Board and redirect tests there
  if (thisTile.currentValue === nextTile.currentValue) {  // DON'T MODIFY here, fix in Board and redirect tests there
    thisTile.currentValue = null;  // DON'T MODIFY here, fix in Board and redirect tests there
    nextTile.currentValue = nextTile.currentValue * 2;  // DON'T MODIFY here, fix in Board and redirect tests there
    nextTile.wasJustMerged = true;  // DON'T MODIFY here, fix in Board and redirect tests there
    return true;  // DON'T MODIFY here, fix in Board and redirect tests there
  }  // DON'T MODIFY here, fix in Board and redirect tests there
  // DON'T MODIFY here, fix in Board and redirect tests there
  return false;  // DON'T MODIFY here, fix in Board and redirect tests there
};  // DON'T MODIFY here, fix in Board and redirect tests there


module.exports = {
  squashRow,
  propagateTile,
  attemptMerge,
};
