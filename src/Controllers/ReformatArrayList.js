// different days work because they have different keys

export function ReformatArrayList(arraylistWithObjects) {
  let newResults = {};
  let cloneResults = arraylistWithObjects;
  cloneResults.map(function (cloneResults) {
    let splitDate = String(cloneResults.date).split('-')
    let newDate = splitDate[1] + "-" + splitDate[0] + "-" + splitDate[2]
    newResults[newDate] = cloneResults.comparedToNorm;
  });
  
  return newResults;
}
