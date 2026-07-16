#!/usr/bin/env node
/**
 * Smoke-test: lean prompts + MCP resource listing/reading.
 * Run after `npm run build` from mcp-server/:
 *   node scripts/smoke-resources.mjs
 */
import path from "path";
import { pathToFileURL } from "url";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { loadAgents, findResource, readResourceText } = await import(
  pathToFileURL(path.join(__dirname, "../dist/agents.js")).href
);

const agents = loadAgents();
if (agents.length === 0) {
  console.error("FAIL: no agents loaded");
  process.exit(1);
}

const ipa = agents.find(a => a.name === "ipa");
if (!ipa) {
  console.error("FAIL: agent 'ipa' not found");
  process.exit(1);
}

const workflowResource = ipa.resources.find(r => r.name === "workflow.md");
if (!workflowResource) {
  console.error(
    "FAIL: ipa missing workflow.md resource (expected top-level supporting doc)"
  );
  process.exit(1);
}

if (!ipa.content.includes(workflowResource.uri)) {
  console.error("FAIL: ipa prompt missing resource index URI for workflow.md");
  process.exit(1);
}

const workflowText = readResourceText(workflowResource);
if (workflowText.length < 100) {
  console.error("FAIL: workflow.md resource empty/too short");
  process.exit(1);
}

if (ipa.content.includes(workflowText.slice(0, 120))) {
  console.error("FAIL: workflow.md body still concatenated into prompt");
  process.exit(1);
}

const eu = agents.find(a => a.name === "eu-ai-act-controls-reviewer");
if (!eu) {
  console.error("FAIL: eu-ai-act-controls-reviewer not found");
  process.exit(1);
}
if (eu.resources.length < 5) {
  console.error(
    `FAIL: expected multiple control modules as resources, got ${eu.resources.length}`
  );
  process.exit(1);
}

const sample = findResource(agents, eu.resources[0].uri);
if (!sample) {
  console.error("FAIL: findResource miss");
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      agentCount: agents.length,
      ipaPromptLines: ipa.content.split("\n").length,
      ipaResources: ipa.resources.length,
      euResources: eu.resources.length,
      sampleUri: sample.uri,
    },
    null,
    2
  )
);
