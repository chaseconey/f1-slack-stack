// Import events.json file
import _ from "lodash";
import "dotenv/config";
import axios from "axios";
import { parseLightsoutDate } from "./utils.mjs";

export default async function run(events) {
  // Find the first event that has a startDate in the next 7 days, and where startDate is not in the past
  const now = new Date();
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const event = _.find(events, (event) => {
    const startDate = new Date(event.startDate);

    return startDate > now && startDate < nextWeek;
  });

  if (!event) {
    console.log("No events found in the next 7 days");
    return;
  }

  console.log(`Event found: ${event.name} on ${event.startDate}`);

  // Use Slack API to send a message to a channel
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("No Slack webhook URL found");
    return;
  }

  const circuitImg = event.circuit?.image?.lg;
  const isSprint = event.sessions.filter((s) => s.name === "Sprint").length > 0;

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: process.env.DISPLAY_TZ ?? "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZoneName: "short",
  });

  const payload = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${event.name}* this week at *${event.circuit.name}* :fire: :fire:`,
        },
        fields: [
          {
            type: "mrkdwn",
            text: `*Start*\n${event.startDate}`,
          },
          {
            type: "mrkdwn",
            text: `*Sprint*\n${isSprint ? ":white_check_mark:" : ":x:"}`,
          },
        ],
        accessory: {
          type: "image",
          image_url: circuitImg,
          alt_text: "Circuit Image",
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Weekend Schedule*",
        },
      },
      {
        type: "section",
        fields: event.sessions.map((session) => ({
          type: "mrkdwn",
          text: `*${session.name}*\n${formatter.format(parseLightsoutDate(session.date, session.time))}`,
        })),
      },
      {
        type: "divider",
      },
      {
        type: "actions",
        block_id: "fake-action",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":trophy: Race Results",
              emoji: true,
            },
            url: "https://www.formula1.com/en/results.html/2024/races.html",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":date: Full Calendar",
              emoji: true,
            },
            url: "https://lightsouts.com/formula-1",
          },
        ],
      },
    ],
  };

  await axios.post(webhookUrl, payload);
}
