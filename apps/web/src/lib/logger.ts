import { initLog, log } from "evlog/client";

if (typeof window !== "undefined") {
  initLog({ service: "edunesia-web-browser", minLevel: "info" });
}

export const websiteLogger = log;
