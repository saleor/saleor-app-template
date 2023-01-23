import { exec } from "node:child_process";
import { promisify } from "node:util";

const promiseExec = promisify(exec);

const branchesDiffResult = await promiseExec("git log main..canary").catch((e) => {
  console.error(e);
  process.exit(1);
});

if (branchesDiffResult.stdout === "") {
  console.log("Branches canary and main have no different commits");
  process.exit(0);
} else if (branchesDiffResult.stdout.length > 0) {
  console.log("Found different commits, open a PR");
  await promiseExec(
    "gh pr create -B main -H canary --title 'Merge canary to main' --body 'Merge canary to main, to trigger a prod release"
  )
    .then(() => {
      console.log("PR opened successfully");
    })
    .catch((e) => {
      console.error("Fail opening a PR");
      console.error(e);
      process.exit(1);
    });
}
