export function unixToDateTime(unix) {
  const milliseconds = unix * 1000;
  const dateObject = new Date(milliseconds);
  const date = dateObject.toLocaleDateString();
  const time = dateObject.toLocaleTimeString();

  const humanDateFormat = date + " " + time;
  return humanDateFormat;
}

export function getUnixOfToday() {
  let today = new Date();
  let unix = Math.round(today.getTime());
  return unix;
}
