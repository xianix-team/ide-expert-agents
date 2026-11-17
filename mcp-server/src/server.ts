import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { loadAgents, type Agent } from "./agents.js";
import { reportInvocation, runMarker } from "./telemetry.js";
import { createRequire } from "module";

// package.json sits one level above both src/ (tsx dev) and dist/ (build,
// npm package, Docker), so this resolves in every run mode.
const { version } = createRequire(import.meta.url)("../package.json") as { version: string };

const agents = loadAgents();

// Every agent is served two ways:
//   - as an MCP prompt — a slash command the user picks (Claude Code, Cursor,
//     and VS Code Copilot Chat as /mcp.ide-expert-agents.<name>);
//   - through two tools — for clients and agent modes that only use tools, the
//     model calls list_agents to choose one, then get_agent to load and follow it.
const LIST_TOOL = "list_agents";
const GET_TOOL = "get_agent";

type Headers = Record<string, string | string[] | undefined> | undefined;

// Returns the agent's instructions, reporting the invocation to AI Hub.
// Only HTTP requests carry headers; stdio relies on IDE_AGENTS_AI_HUB_ACTOR.
function invoke(agent: Agent, headers: Headers): string {
  const actorHeader = headers?.["x-ai-hub-actor"];
  const run = reportInvocation(agent.name, Array.isArray(actorHeader) ? actorHeader[0] : actorHeader);
  return run ? `${agent.content}\n\n${runMarker(run)}` : agent.content;
}

const toolError = (text: string) => ({ isError: true, content: [{ type: "text" as const, text }] });

export function createServer(): Server {
  const server = new Server(
    { name: "ide-expert-agents", version },
    { capabilities: { prompts: {}, tools: {} } }
  );

  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: agents.map(({ name, description }) => ({ name, description })),
  }));

  server.setRequestHandler(GetPromptRequestSchema, async (request, extra) => {
    const agent = agents.find(a => a.name === request.params.name);
    if (!agent) throw new Error(`Agent '${request.params.name}' not found`);

    return {
      description: agent.description,
      messages: [
        {
          role: "user" as const,
          content: { type: "text" as const, text: invoke(agent, extra.requestInfo?.headers) },
        },
      ],
    };
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: LIST_TOOL,
        description:
          "Lists the IDE expert agents (pre-sales, analysis, architecture, coding, QA, DevOps, data platform, UX, delivery, compliance) and multi-agent runbooks, with when to use each. Call this to find an agent for the user's task, then call get_agent with its name.",
        inputSchema: { type: "object" as const, properties: {} },
        annotations: { readOnlyHint: true, openWorldHint: false },
      },
      {
        name: GET_TOOL,
        description:
          "Loads an IDE expert agent's full instructions by name (from list_agents). Follow the returned instructions as your workflow for the user's request, starting with its first stage — usually scope questions to ask the user before doing any work.",
        inputSchema: {
          type: "object" as const,
          properties: {
            name: {
              type: "string",
              description: "The agent or runbook name, e.g. 'estimate'.",
              enum: agents.map(a => a.name),
            },
          },
          required: ["name"],
        },
        annotations: { readOnlyHint: true, openWorldHint: false },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
    const { name, arguments: args } = request.params;

    if (name === LIST_TOOL) {
      const text = agents.map(a => `- **${a.name}** — ${a.description}`).join("\n");
      return { content: [{ type: "text" as const, text: `${agents.length} agents and runbooks:\n\n${text}` }] };
    }

    if (name === GET_TOOL) {
      const agentName = typeof args?.name === "string" ? args.name.trim() : "";
      const agent = agents.find(a => a.name === agentName);
      if (!agent) return toolError(`No agent named '${agentName}'. Call ${LIST_TOOL} to see the available names.`);
      return { content: [{ type: "text" as const, text: invoke(agent, extra.requestInfo?.headers) }] };
    }

    return toolError(`Unknown tool '${name}'.`);
  });

  return server;
}
