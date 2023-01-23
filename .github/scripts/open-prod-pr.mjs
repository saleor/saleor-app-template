import { spawnSync } from "node:child_process";

const {
  stdout: branchesDiffer,
  stderr,
  status,
} = spawnSync("git", ["log", "main..canary"], {
  encoding: "utf8",
});

if (status !== 0) {
  console.error("Fail reading branches diff");
  console.error(stderr);
  process.exit(1);
}

if (branchesDiffer === "") {
  console.log("Branches canary and main have no different commits");
  process.exit(0);
} else if (branchesDiffer.length > 0) {
  const result = spawnSync(
    "gh",
    [
      "pr",
      "create",
      "-B",
      "main",
      "-H",
      "canary",
      "--title",
      "Merge canary to main",
      "--body",
      "Merge canary to main, to trigger a prod release",
    ],
    {}
  );

  if (result.status === 0) {
    console.log("Successfully opened a PR");
    process.exit(0);
  } else {
    console.error("Error trying to open a PR");
    console.error(result.stderr);
    process.exit(1);
  }
}
