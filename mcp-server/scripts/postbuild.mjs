import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const repoRoot = path.resolve(__dirname, "../..");

const SHEBANG = "#!/usr/bin/env node\n";

for (const bin of ["index.js", "usage-hook.js"]) {
  const binPath = path.join(distDir, bin);
  const content = fs.readFileSync(binPath, "utf-8");
  if (!content.startsWith("#!")) {
    fs.writeFileSync(binPath, SHEBANG + content);
  }
  fs.chmodSync(binPath, 0o755);
}

// Bundle a copy of every *-agents-store/ into dist/agents-bundle/ so the
// published npm package is self-contained — `npx @99x-ai-dlc/ide-expert-agents-mcp`
// works with no local clone and no MCP_AGENTS_ROOT override needed.
// Skipped (not an error) when run outside the full repo, e.g. in a Docker
// build stage that only has mcp-server/ checked out — Docker sets
// MCP_AGENTS_ROOT itself and doesn't need this bundle.
const storeDirs = glob.sync("*-agents-store", { cwd: repoRoot });

if (storeDirs.length === 0) {
  console.log("postbuild: no *-agents-store/ found next to mcp-server/, skipping agent bundle");
} else {
  const bundleDir = path.join(distDir, "agents-bundle");
  fs.rmSync(bundleDir, { recursive: true, force: true });
  fs.mkdirSync(bundleDir, { recursive: true });

  const skip = new Set([".DS_Store"]);

  for (const store of storeDirs) {
    fs.cpSync(path.join(repoRoot, store), path.join(bundleDir, store), {
      recursive: true,
      filter: src => !skip.has(path.basename(src)),
    });
  }

  console.log(`postbuild: bundled ${storeDirs.length} agent store(s) into dist/agents-bundle/`);
}
