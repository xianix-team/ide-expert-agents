import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { loadAgents } from "./agents.js";
import { reportInvocation, runMarker } from "./telemetry.js";

const agents = loadAgents();

export function createServer(): Server {
  const server = new Server(
    { name: "ide-expert-agents", version: "1.0.0" },
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
    const correlationId = reportInvocation(
      agent.name,
      Array.isArray(actorHeader) ? actorHeader[0] : actorHeader
    );
    const text = correlationId
      ? `${agent.content}\n\n${runMarker(correlationId, agent.name)}`
      : agent.content;

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
