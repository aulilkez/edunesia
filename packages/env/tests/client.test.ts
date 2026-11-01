import { expect, test } from "vite-plus/test";
import { clientEnv } from "../src/client";

test("client environment exposes only approved public settings", () => {
  expect(Object.keys(clientEnv).sort()).toEqual(["APP_NAME", "APP_URL"]);
  expect(clientEnv.APP_NAME).toBe("Edunesia");
  expect(clientEnv.APP_URL).toBe("");
});
