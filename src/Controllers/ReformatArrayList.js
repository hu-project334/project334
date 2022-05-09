// different days work because they have different keys

export function ReformatArrayList(arraylistWithObjects) {
  let newResults = {};
  // console.log(arraylistWithObjects);
  let cloneResults = arraylistWithObjects;
  cloneResults.map(function (cloneResults) {
    newResults[cloneResults.date] = cloneResults.comparedToNorm;
    console.log(newResults);
  });
  // console.log(newResults);
  return newResults;
}

// from : [ {"04-04-2022": 45}  ,{"04-04-2022": 45}, {"04-04-2022": 45}  ]
// function DateInRightOrder(arraylistWithObjects) {}

// calculate average movement function
