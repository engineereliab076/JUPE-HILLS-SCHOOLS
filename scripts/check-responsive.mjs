import { existsSync } from "node:fs";
import { chromium } from "playwright";
import { publicPages, startTestServer } from "./test-server.mjs";

const viewports = [
  [320, 568],
  [360, 640],
  [375, 667],
  [390, 844],
  [412, 915],
  [568, 320],
  [768, 1024],
  [820, 1180],
  [1024, 768],
  [1280, 720],
  [1366, 768],
  [1440, 900],
  [1920, 1080],
  [2560, 1440],
];
const browserPaths = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);
const executablePath = browserPaths.find((candidate) => existsSync(candidate));
const server = await startTestServer();
const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
});
const failures = [];

try {
  for (const [width, height] of viewports) {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    for (const route of publicPages) {
      const page = await context.newPage();
      await page.goto(`${server.baseUrl}${route}`, {
        waitUntil: "load",
      });
      const overflow = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }));
      if (overflow.documentWidth > overflow.viewportWidth + 1) {
        failures.push(
          `${route} at ${width}x${height}: horizontal overflow ${overflow.documentWidth}px > ${overflow.viewportWidth}px`,
        );
      }
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
  await server.close();
}

if (failures.length) {
  console.error(`Responsive smoke check failed:\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(
    `Responsive overflow check passed for ${publicPages.length} pages across ${viewports.length} viewports.`,
  );
}
