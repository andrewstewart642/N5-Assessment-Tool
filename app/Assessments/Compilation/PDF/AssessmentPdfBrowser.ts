import {
  existsSync,
} from "node:fs";

import puppeteer, {
  type Browser,
} from "puppeteer-core";

import chromium from "@sparticuz/chromium";


function getExistingPath(
  candidates:
    Array<
      string | undefined
    >
): string | null {
  for (
    const candidate
    of candidates
  ) {
    if (
      candidate &&
      existsSync(
        candidate
      )
    ) {
      return candidate;
    }
  }

  return null;
}


function getLocalBrowserExecutablePath():
  string | null {
  const explicitPath =
    process.env
      .CHROME_EXECUTABLE_PATH;


  if (
    explicitPath &&
    existsSync(
      explicitPath
    )
  ) {
    return explicitPath;
  }


  if (
    process.platform ===
    "win32"
  ) {
    return getExistingPath([
      process.env
        .PROGRAMFILES
        ? `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`
        : undefined,

      process.env[
        "PROGRAMFILES(X86)"
      ]
        ? `${process.env["PROGRAMFILES(X86)"]}\\Google\\Chrome\\Application\\chrome.exe`
        : undefined,

      process.env
        .LOCALAPPDATA
        ? `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
        : undefined,

      process.env
        .PROGRAMFILES
        ? `${process.env.PROGRAMFILES}\\Microsoft\\Edge\\Application\\msedge.exe`
        : undefined,

      process.env[
        "PROGRAMFILES(X86)"
      ]
        ? `${process.env["PROGRAMFILES(X86)"]}\\Microsoft\\Edge\\Application\\msedge.exe`
        : undefined,
    ]);
  }


  if (
    process.platform ===
    "darwin"
  ) {
    return getExistingPath([
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",

      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",

      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ]);
  }


  return getExistingPath([
    "/usr/bin/google-chrome",

    "/usr/bin/google-chrome-stable",

    "/usr/bin/chromium",

    "/usr/bin/chromium-browser",

    "/usr/bin/microsoft-edge",

    "/usr/bin/microsoft-edge-stable",
  ]);
}


export async function launchAssessmentPdfBrowser():
  Promise<Browser> {
  const localExecutablePath =
    getLocalBrowserExecutablePath();


  if (
    localExecutablePath
  ) {
    return puppeteer.launch({
      executablePath:
        localExecutablePath,

      headless:
        true,

      args: [
        "--disable-dev-shm-usage",
        "--no-first-run",
        "--no-default-browser-check",
      ],
    });
  }


  const serverExecutablePath =
    await chromium.executablePath();


  if (
    !serverExecutablePath
  ) {
    throw new Error(
      "No Chromium executable could be resolved for PDF generation."
    );
  }


  return puppeteer.launch({
    executablePath:
      serverExecutablePath,

    headless:
      true,

    args: [
      ...chromium.args,
    ],
  });
}