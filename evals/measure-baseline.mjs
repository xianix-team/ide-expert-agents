#!/usr/bin/env node
/**
 * Record structural baseline: lean prompt line/char counts + resource counts.
 * Run from repo root after mcp-server build:
 *   cd mcp-server && npm run build && node ../evals/measure-baseline.mjs
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentsJs = path.join(__dirname, "../mcp-server/dist/agents.js");

if (!fs.existsSync(agentsJs)) {
  console.error("Build mcp-server first: cd mcp-server && npm run build");
  process.exit(1);
}

const { loadAgents } = await import(pathToFileURL(agentsJs).href);
const agents = loadAgents();

const targets = ["ipa", "eu-ai-act-controls-reviewer"];
const rows = targets.map(name => {
  const a = agents.find(x => x.name === name);
  if (!a) return { name, error: "not found" };
  const lines = a.content.split("\n").length;
  const chars = a.content.length;
  return {
    name,
    prompt_lines: lines,
    prompt_chars: chars,
    approx_tokens: Math.round(chars / 4),
    resources: a.resources.length,
    resource_names: a.resources.map(r => r.name),
  };
});

console.log(JSON.stringify({ measured_at: new Date().toISOString(), rows }, null, 2));
