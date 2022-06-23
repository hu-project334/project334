export function unixToDateTime(unix) {
  const humanDateFormat = new Date(unix)
    .toISOString()
    .replace("T", " ")
    .split(".")
    .shift();
  return humanDateFormat;
}

export function getUnixOfToday() {
  return new Date().getTime();
}
