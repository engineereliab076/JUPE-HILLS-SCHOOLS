import AxeBuilder from "@axe-core/playwright";
import { existsSync } from "node:fs";
import { chromium } from "playwright";
import { publicPages, startTestServer } from "./test-server.mjs";

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
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  for (const route of publicPages) {
    const page = await context.newPage();
    const runtimeErrors = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });
    const response = await page.goto(`${server.baseUrl}${route}`, {
      waitUntil: "load",
    });
    if (!response || !response.ok())
      failures.push(
        `${route}: page returned ${response?.status() ?? "no response"}`,
      );
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact),
    );
    serious.forEach((violation) =>
      failures.push(
        `${route}: ${violation.id} (${violation.impact}) — ${violation.help}`,
      ),
    );
    runtimeErrors.forEach((error) =>
      failures.push(`${route}: runtime error — ${error}`),
    );
    await page.close();
  }
  await context.close();
} finally {
  await browser.close();
  await server.close();
}

if (failures.length) {
  console.error(`Accessibility smoke check failed:\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(
    `Accessibility smoke check passed on ${publicPages.length} pages with no serious or critical axe findings.`,
  );
}
