export function unixToDateTime(unix) {
  const humanDateFormat = new Date(unix)
    .toISOString()
    .replace("T", " ")
    .split(".")
    .shift();
  return humanDateFormat;
}

export function getUnixOfToday() {
  let rightDate = new Date().toLocaleDateString()
  let splitDate = String(rightDate).split("-");
  let newDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
  const humanDateFormat= new Date(unix).toLocaleTimeString() + " " + newDate;
  return humanDateFormat;
}
