import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { projectRoot } from "./sites-env.mjs";

const action = process.argv[2];
if (!["migrate", "leads"].includes(action)) {
  console.error("Usage: node scripts/local-database.mjs migrate|leads");
  process.exit(1);
}
const builtConfigPath = path.join(projectRoot, "dist/server/wrangler.json");
if (!existsSync(builtConfigPath)) {
  console.error("Build the project first with npm run build, or run npm run setup:local.");
  process.exit(1);
}
const config = JSON.parse(readFileSync(builtConfigPath, "utf8"));
const binding = config.d1_databases?.find(item => item.binding === "DB");
if (!binding) throw new Error("The build has no DB binding. Check .openai/hosting.json, then rebuild.");
binding.migrations_dir = path.join(projectRoot, "drizzle");
binding.migrations_table = "d1_migrations";
config.main = path.join(projectRoot, "dist/server/index.js");
if (config.assets) config.assets.directory = path.join(projectRoot, "dist/client");
const localConfigPath = path.join(projectRoot, ".sites-runtime/wrangler.local.json");
writeFileSync(localConfigPath, JSON.stringify(config, null, 2) + "\n");

const args = action === "migrate"
  ? ["d1", "migrations", "apply", "DB"]
  : ["d1", "execute", "DB", "--command", 'SELECT business_name, email, business_url, monthly_ad_spend, status, created_at FROM "Leads" ORDER BY created_at DESC;'];
// Every command is explicitly local. Hosted leads and Cloudflare credentials
// are never read or changed by this helper.
args.push("--local", "--config", localConfigPath, "--persist-to", path.join(projectRoot, ".wrangler/state"));
const result = spawnSync(process.execPath, [
  "--import", fileURLToPath(new URL("./sites-env.mjs", import.meta.url)),
  path.join(projectRoot, "node_modules/wrangler/bin/wrangler.js"), ...args,
], { cwd: projectRoot, stdio: "inherit", env: { ...process.env, CI: "true" } });
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
