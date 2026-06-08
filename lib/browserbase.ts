import Browserbase from "@browserbasehq/sdk";

export function createBrowserbase() {
  return new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
}
