// Make a http request to https://api.lightsouts.com/v1/series/formula-1

import axios from "axios";
import fs from "fs";
import jsonDiff from "json-diff";
import { createInterface } from "readline";

const data = await axios.get("https://api.lightsouts.com/v1/series/formula-1");

const events = data.data.events;

// Show difference between current file and new file
const old = fs.readFileSync("./src/events.json", "utf8");

console.dir(jsonDiff.diffString(JSON.parse(old), events), { depth: null });

// Take user input for overriding the file
const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("Override events.json? (y/n) ", (answer) => {
  if (answer === "y") {
    fs.writeFileSync("./src/events.json", JSON.stringify(events));
  }
  readline.close();
});
