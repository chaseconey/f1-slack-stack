import run from "../lib/processor.mjs";
import { readFileSync } from "fs";
const __dirname = import.meta.dirname;

export const postNextRace = async (event, context) => {
  // Read events.json file in a way that is compatible with lambda runtime
  const events = JSON.parse(
    readFileSync(__dirname + "/../events.json", "utf8"),
  );

  await run(events);

  return;
};
