//  arraylist met objects te gaan naar 1 object met key values
// from : [ {"04-04-2022": 45}  ,{"04-04-2022": 45}, {"04-04-2022": 45}  ]
// to -->  {"04-04-2022": 45 ,"04-04-2022": 45, "04-04-2022": 45}

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
