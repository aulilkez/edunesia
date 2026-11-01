import { readFileSync } from "node:fs";

const messagePath = process.argv[2];

if (!messagePath) {
  throw new Error("Expected the Git commit message file path.");
}

const message = readFileSync(messagePath, "utf8").split("\n", 1)[0]?.trim() ?? "";
const conventionalCommit =
  /^(feat|fix|refactor|perf|docs|test|build|ci|chore|style)\([a-z0-9]+(?:[/-][a-z0-9]+)*\)!?: [a-z0-9][^\n]*$/;

if (/^(Merge|Revert)\b/.test(message)) {
  process.exit(0);
}

if (!conventionalCommit.test(message)) {
  console.error(
    "Commit message must use type(scope): description with a supported Conventional Commit type.",
  );
  process.exit(1);
}
