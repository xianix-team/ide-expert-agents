import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { loadAgents } from "./agents.js";
import { reportInvocation, runMarker } from "./telemetry.js";
import { createRequire } from "module";

// package.json sits one level above both src/ (tsx dev) and dist/ (build,
// npm package, Docker), so this resolves in every run mode.
const { version } = createRequire(import.meta.url)("../package.json") as { version: string };

const agents = loadAgents();

export function createServer(): Server {
  const server = new Server(
    { name: "ide-expert-agents", version },
    { capabilities: { prompts: {} } }
  );

  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: agents.map(({ name, description }) => ({ name, description })),
  }));

  server.setRequestHandler(GetPromptRequestSchema, async (request, extra) => {
    const agent = agents.find(a => a.name === request.params.name);
    if (!agent) throw new Error(`Agent '${request.params.name}' not found`);

    // Only HTTP requests carry headers; stdio relies on IDE_AGENTS_AI_HUB_ACTOR.
    const actorHeader = extra.requestInfo?.headers["x-ai-hub-actor"];
    const run = reportInvocation(
      agent.name,
      Array.isArray(actorHeader) ? actorHeader[0] : actorHeader
    );
    const text = run ? `${agent.content}\n\n${runMarker(run)}` : agent.content;

    return {
      description: agent.description,
      messages: [
        {
          role: "user" as const,
          content: { type: "text" as const, text },
        },
      ],
    };
  });

  return server;
}
