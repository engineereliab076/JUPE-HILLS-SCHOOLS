import { existsSync } from "node:fs";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { startTestServer } from "./test-server.mjs";

const routes = ["/", "/admissions.html", "/contact.html", "/gallery.html"];
const browserPaths = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);
const chromePath = browserPaths.find((candidate) => existsSync(candidate));
const server = await startTestServer();
const chrome = await launch({
  chromePath,
  chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
});

try {
  // Warm up Chrome so the first measured route is not penalised by a cold
  // start (which can otherwise report a zeroed run).
  await lighthouse(`${server.baseUrl}/`, {
    port: chrome.port,
    output: "json",
    logLevel: "error",
    onlyCategories: ["performance"],
  });

  for (const route of routes) {
    const result = await lighthouse(`${server.baseUrl}${route}`, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    });
    const scores = Object.fromEntries(
      Object.entries(result.lhr.categories).map(([key, category]) => [
        key,
        Math.round(category.score * 100),
      ]),
    );
    console.log(`${route} ${JSON.stringify(scores)}`);
  }
} finally {
  // Windows sometimes reports EPERM while removing Chrome's temp profile even
  // after a clean run; ignore cleanup-only failures so scores still surface.
  try {
    await chrome.kill();
  } catch (error) {
    if (error?.code !== "EPERM") throw error;
  }
  await server.close();
}
