// different days work because they have different keys

export function ReformatArrayList(arraylistWithObjects) {
  let newResults = {};
  let cloneResults = arraylistWithObjects;
  cloneResults.map(function (cloneResults) {
    let splitDate = String(cloneResults.date).split("-");
    let newDate = splitDate[1] + "-" + splitDate[0] + "-" + splitDate[2];
    newResults[newDate] = cloneResults.comparedToNorm;
  });

  return newResults;
}

export function unixToDateTimeReverse(unix) {
  console.log(unix);
  const milliseconds = unix * 1000;
  const dateObject = new Date(milliseconds);
  // const date = dateObject.toLocaleDateString("en-US");
  var dateString =
    dateObject.getUTCFullYear() +
    "-" +
    ("0" + (dateObject.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("0" + dateObject.getUTCDate()).slice(-2) +
    " " +
    ("0" + dateObject.getUTCHours()).slice(-2) +
    ":" +
    ("0" + dateObject.getUTCMinutes()).slice(-2) +
    ":" +
    ("0" + dateObject.getUTCSeconds()).slice(-2);

  // const time = dateObject.toLocaleTimeString();

  const humanDateFormat = dateString;
  console.log(humanDateFormat);
  return humanDateFormat;
}

// from : [ {"04-04-2022": 45}  ,{"04-04-2022": 45}, {"04-04-2022": 45}  ]
// function DateInRightOrder(arraylistWithObjects) {}

// calculate average movement function
