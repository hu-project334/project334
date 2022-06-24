// different days work because they have different keys



export function unixToDateTimeReverse(unix) {
 const humanDateFormat= new Date(unix).toLocaleTimeString() + " " + new Date().toLocaleDateString();
 console.log(humanDateFormat)
 const slecteTijd = new Date(unix)
    .toISOString()
    .replace("T", " ")
    .split(".")
    .shift();

    console.log(slechte)

  return humanDateFormat;
}

