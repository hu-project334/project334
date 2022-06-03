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

// from : [ {"04-04-2022": 45}  ,{"04-04-2022": 45}, {"04-04-2022": 45}  ]
// function DateInRightOrder(arraylistWithObjects) {}

// calculate average movement function
