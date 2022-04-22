//  arraylist met objects te gaan naar 1 object met key values
// from : [ {"04-04-2022": 45}  ,{"04-04-2022": 45}, {"04-04-2022": 45}  ]
// to -->  {"04-04-2022": 45 ,"04-04-2022": 45, "04-04-2022": 45}

export function ReformatArrayList(arraylistWithObjects) {
  let newResults = {};
  let newResult = null;
  console.log(arraylistWithObjects);
  let cloneResults = arraylistWithObjects;
  cloneResults.map(function (cloneResults) {
    newResult += newResults[cloneResults.date] = cloneResults.comparedToNorm;
  });
  console.log(newResults);
  return newResults;
}
