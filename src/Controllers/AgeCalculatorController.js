export function formatBirthDateToAge(dateString) {
  let from = dateString.split("-");
  let birthdateTimeStamp = new Date(from[2], from[1] - 1, from[0]);
  let cur = new Date();
  let diff = cur - birthdateTimeStamp;
  // This is the difference in milliseconds
  let currentAge = Math.floor(diff / 31557600000);
  // Divide by 1000*60*60*24*365.25

  return currentAge;
}
