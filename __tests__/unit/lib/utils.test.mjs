import { parseLightsoutDate } from "../../../src/lib/utils.mjs";

describe("parseLightsoutDate", () => {
  it("should convert date and time to the specified timezone", () => {
    const date = "2022-01-01";
    const time = "12:00";
    const expected = new Date("2022-01-01T12:00:00.000Z");

    const result = parseLightsoutDate(date, time);

    expect(result).toEqual(expected);
  });
});
