import { randomUUID } from "crypto";

// Reports agent invocations to 99x AI Hub. Works the same on both transports:
// each process reads its own environment — the developer's for stdio, the
// container's for HTTP.
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
  costUsd?: number;
}

interface HubConfig {
  url: string;
  apiKey: string;
}

function readConfig(): HubConfig | undefined {
  const env = process.env;
  const baseUrl = env.IDE_AGENTS_AI_HUB_BASE_URL;
  const apiKey = env.IDE_AGENTS_AI_HUB_API_KEY;
  const nodeId = env.IDE_AGENTS_AI_HUB_NODE_ID;

  if (env.IDE_AGENTS_AI_HUB_ENABLED === "false") return undefined;
  if (!baseUrl || !apiKey || !nodeId) return undefined;

  return {
    url: `${baseUrl.replace(/\/+$/, "")}/metrics/nodes/${encodeURIComponent(nodeId)}/events`,
    apiKey,
  };
}

export const isConfigured = (): boolean => readConfig() !== undefined;

export async function pushEvent(
  correlationId: string,
  agentName: string,
  user?: string,
  dimensions?: Dimensions
): Promise<void> {
  const config = readConfig();
  if (!config) return;

  const actor = user?.trim() || process.env.IDE_AGENTS_AI_HUB_ACTOR?.trim();

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        correlationId,
        activity: agentName,
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

// Fire-and-forget: a metrics push must never delay or fail the prompt it reports
// on. Failures go to stderr, because stdout carries the MCP protocol on stdio.
// Returns the run's correlation id, or undefined when metrics are off.
export function reportInvocation(agentName: string, user?: string): string | undefined {
  if (!isConfigured()) return undefined;

  const correlationId = randomUUID();
  pushEvent(correlationId, agentName, user).catch(error => {
    console.error(`AI Hub push skipped for '${agentName}': ${String(error)}`);
  });
  return correlationId;
}

// The marker travels in the prompt text so the Claude Code usage hook can tie
// token usage in the session log back to this run's correlation id.
export const runMarker = (correlationId: string, agentName: string): string =>
  `<!-- ai-hub-run:${correlationId}:${agentName} -->`;

export const RUN_MARKER_PATTERN = /<!-- ai-hub-run:([0-9a-f-]{36}):([^ ]+) -->/g;
