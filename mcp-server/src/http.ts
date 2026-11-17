import express from "express";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "crypto";
import { createServer } from "./server.js";

const PORT = parseInt(process.env.PORT ?? "3000", 10);

// Session map: sessionId → transport
const sessions = new Map<string, StreamableHTTPServerTransport>();

// createMcpExpressApp sets up host-header validation middleware.
// Passing host: "0.0.0.0" disables automatic DNS-rebinding protection so the
// server is reachable from any hostname (appropriate for a shared team server
// behind a reverse proxy or firewall).
const app = createMcpExpressApp({ host: "0.0.0.0" });
app.use(express.json());

// POST /mcp — initialize a new session or forward a message in an existing one
app.post("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  let transport: StreamableHTTPServerTransport;

  if (sessionId && sessions.has(sessionId)) {
    transport = sessions.get(sessionId)!;
  } else if (sessionId) {
    // Unknown session — typically the server restarted. The spec requires 404
    // here: it is the client's signal to re-initialize. A 400 leaves clients
    // (e.g. VS Code) stuck on the dead session with an empty prompt list.
    res.status(404).json({
      jsonrpc: "2.0",
      error: { code: -32001, message: "Session not found" },
      id: null,
    });
    return;
  } else if (!isInitializeRequest(req.body)) {
    res.status(400).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Bad Request: no session ID; send initialize first" },
      id: null,
    });
    return;
  } else {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: id => {
        sessions.set(id, transport);
      },
      onsessionclosed: id => {
        sessions.delete(id);
      },
    });
    await createServer().connect(transport);
  }

  await transport.handleRequest(req, res, req.body);
});

// GET /mcp — SSE stream for server-to-client notifications
app.get("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  const transport = sessionId ? sessions.get(sessionId) : undefined;
  if (!transport) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  await transport.handleRequest(req, res);
});

// DELETE /mcp — explicit session teardown
app.delete("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  const transport = sessionId ? sessions.get(sessionId) : undefined;
  if (!transport) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  await transport.close();
  res.status(200).end();
});

app.listen(PORT, "0.0.0.0", () => {
  console.error(
    `IDE Expert Agents MCP server listening on http://0.0.0.0:${PORT}/mcp`
  );
});
