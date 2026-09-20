import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 22 || (major === 22 && minor < 13)) {
  console.error("Momentum needs Node.js 22.13 or newer. Update Node.js, then run setup again.");
  process.exit(1);
}

for (const [script, args] of [["run-framework.mjs", ["build"]], ["local-database.mjs", ["migrate"]]]) {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL(script, import.meta.url)), ...args], {
    cwd: projectRoot, stdio: "inherit",
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log("\nMomentum is ready. Run npm run dev, then open http://localhost:5173.\n");
