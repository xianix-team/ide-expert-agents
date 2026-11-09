import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Reports agent invocations to 99x AI Hub. Works the same on both transports:
// each process reads its own env file and environment — the developer's for
// stdio, the container's for HTTP.
//
// Variables are prefixed IDE_AGENTS_ rather than sharing the AI_HUB_* names used
// by the AI-DLC ai-hub-metrics skill. That skill's script lets the environment
// override its per-repo file, so a developer-wide AI_HUB_NODE_ID would redirect
// those repos' events to this node.

const TOOL_ACTOR = "IDE Expert Agents";
const TIMEOUT_MS = 5000;

export interface Dimensions {
  tokens: number;
  model: string;
}

export interface Run {
  correlationId: string;
  agentName: string;
}

interface HubConfig {
  baseUrl: string;
  apiKey: string;
  actor?: string;
  defaultNode?: string;
  agentNodes: Map<string, string>;
}

const SETTING_PREFIX = "IDE_AGENTS_";

// mcp-server/.env, next to dist/. Gitignored, and outside the published files.
const DEFAULT_ENV_FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", ".env");

// One file holds both the settings and the agent-to-node map, because node ids
// differ per team:
//   IDE_AGENTS_AI_HUB_BASE_URL=https://ai-hub-api.99x.io
//   delivery-commitment-health-report=nd_abc123
// Read on every call, so edits apply without restarting the server.
function readEnvFile(): { settings: Map<string, string>; agentNodes: Map<string, string> } {
  const settings = new Map<string, string>();
  const agentNodes = new Map<string, string>();
  const explicit = process.env.IDE_AGENTS_AI_HUB_ENV_FILE;

  let text: string;
  try {
    text = fs.readFileSync(explicit || DEFAULT_ENV_FILE, "utf-8");
  } catch (error) {
    // The default file is optional; a file someone named must exist.
    if (explicit) console.error(`AI Hub env file not read from ${explicit}: ${String(error)}`);
    return { settings, agentNodes };
  }

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim().replace(/^export\s+/, "");
    const separator = line.indexOf("=");
    if (!line || line.startsWith("#") || separator < 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^(["'])(.*)\1$/, "$2");
    if (!key || !value) continue;
    (key.startsWith(SETTING_PREFIX) ? settings : agentNodes).set(key, value);
  }
  return { settings, agentNodes };
}

function readConfig(): HubConfig | undefined {
  const { settings, agentNodes } = readEnvFile();
  // A variable set in the environment wins over the same setting in the file.
  const setting = (name: string): string | undefined =>
    process.env[name]?.trim() || settings.get(name);

  if (setting("IDE_AGENTS_AI_HUB_ENABLED") === "false") return undefined;

  const baseUrl = setting("IDE_AGENTS_AI_HUB_BASE_URL");
  const apiKey = setting("IDE_AGENTS_AI_HUB_API_KEY");
  const defaultNode = setting("IDE_AGENTS_AI_HUB_NODE_ID");
  if (!baseUrl || !apiKey) return undefined;
  if (!defaultNode && agentNodes.size === 0) return undefined;

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    apiKey,
    actor: setting("IDE_AGENTS_AI_HUB_ACTOR"),
    defaultNode,
    agentNodes,
  };
}

// An agent missing from the map goes to the default node, or is not sent.
const nodeFor = (config: HubConfig, agentName: string): string | undefined =>
  config.agentNodes.get(agentName) ?? config.defaultNode;

export const isConfigured = (): boolean => readConfig() !== undefined;

async function send(
  config: HubConfig,
  nodeId: string,
  run: Run,
  user?: string,
  dimensions?: Dimensions
): Promise<void> {
  const actor = user?.trim() || config.actor;
  const url = `${config.baseUrl}/metrics/nodes/${encodeURIComponent(nodeId)}/events`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        correlationId: run.correlationId,
        activity: run.agentName,
        actors: actor ? [actor, TOOL_ACTOR] : [TOOL_ACTOR],
        ...(dimensions ? { dimensions } : {}),
      },
    ]),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (response.status !== 202) {
    throw new Error(`unexpected HTTP ${response.status}`);
  }
}

export async function pushEvent(run: Run, user?: string, dimensions?: Dimensions): Promise<void> {
  const config = readConfig();
  const nodeId = config && nodeFor(config, run.agentName);
  if (config && nodeId) await send(config, nodeId, run, user, dimensions);
}

// Fire-and-forget: a metrics push must never delay or fail the prompt it reports
// on. Failures go to stderr, because stdout carries the MCP protocol on stdio.
// Returns the run, or undefined when this agent's events have nowhere to go.
export function reportInvocation(agentName: string, user?: string): Run | undefined {
  const config = readConfig();
  const nodeId = config && nodeFor(config, agentName);
  if (!config || !nodeId) return undefined;

  const run: Run = { correlationId: randomUUID(), agentName };
  send(config, nodeId, run, user).catch(error => {
    console.error(`AI Hub push skipped for '${agentName}': ${String(error)}`);
  });
  return run;
}

// The marker travels in the prompt text so the Claude Code usage hook can tie
// token usage in the session log back to this run's correlation id.
export const runMarker = ({ correlationId, agentName }: Run): string =>
  `<!-- ai-hub-run:${correlationId}:${agentName} -->`;

export const RUN_MARKER_PATTERN = /<!-- ai-hub-run:([0-9a-f-]{36}):([^ ]+) -->/g;
