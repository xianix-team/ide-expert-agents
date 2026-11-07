import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  loadAgents,
  listAllResources,
  findResource,
  readResourceText,
} from "./agents.js";

const agents = loadAgents();

export function createServer(): Server {
  const server = new Server(
    { name: "ide-expert-agents", version: "1.0.0" },
    { capabilities: { prompts: {}, resources: {} } }
  );

  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: agents.map(({ name, description }) => ({ name, description })),
  }));

  server.setRequestHandler(GetPromptRequestSchema, async request => {
    const agent = agents.find(a => a.name === request.params.name);
    if (!agent) throw new Error(`Agent '${request.params.name}' not found`);
    return {
      description: agent.description,
      messages: [
        {
          role: "user" as const,
          content: { type: "text" as const, text: agent.content },
        },
      ],
    };
  });

  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: listAllResources(agents).map(({ uri, name, description, mimeType }) => ({
      uri,
      name,
      description,
      mimeType,
    })),
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async request => {
    const resource = findResource(agents, request.params.uri);
    if (!resource) {
      throw new Error(`Resource '${request.params.uri}' not found`);
    }
    return {
      contents: [
        {
          uri: resource.uri,
          mimeType: resource.mimeType,
          text: readResourceText(resource),
        },
      ],
    };
  });

  return server;
}
