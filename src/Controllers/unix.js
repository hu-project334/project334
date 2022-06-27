export function unixToDateTime(unix) {
   let rightDate = new Date().toLocaleDateString()
  let splitDate = String(rightDate).split("-");
  let newDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
  const humanDateFormat= new Date(unix).toLocaleTimeString() + " " + newDate;
  return humanDateFormat;
}

export function getUnixOfToday() {
  return String(new Date().toLocaleDateString()).replaceAll('/', '-') +  " " +  new Date().toLocaleTimeString();
}



