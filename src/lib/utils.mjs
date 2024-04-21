export function parseLightsoutDate(date, time) {
  const [year, month, day] = date.split("-");
  const [hours, minutes] = time.split(":");

  return new Date(Date.UTC(year, month - 1, day, hours, minutes));
}
