import fs from "fs";
import os from "os";
import path from "path";
import {
  isConfigured,
  pushEvent,
  RUN_MARKER_PATTERN,
  type Dimensions,
  type Run,
} from "./telemetry.js";

// Claude Code Stop hook: adds token and model data to agent runs. It reads
// what the session log has gained since the last Stop, attributes usage to the
// most recent agent run, and pushes it under that run's correlation id. A run
// stays open until the next agent is invoked, so later work in the session counts
// towards it. Always exits 0: metrics must never interrupt a session.

interface State {
  offsets: Record<string, number>;
  run?: Run;
  recentMessageIds: string[];
}

interface Usage {
  input_tokens?: number;
  output_tokens?: number;
  cache_creation_input_tokens?: number;
}

interface LogEntry {
  type?: string;
  message?: {
    id?: string;
    model?: string;
    usage?: Usage;
    content?: unknown;
  };
}

interface MessageUsage {
  model: string;
  usage: Usage;
}

const LOCK_STALE_MS = 60_000;
const RECENT_ID_LIMIT = 500;
const STATE_DIR = path.join(os.homedir(), ".cache", "ide-expert-agents");

// Only complete lines: Claude Code may still be appending to the file.
function readNewLines(file: string, offset: number): { lines: string[]; offset: number } {
  const data = fs.readFileSync(file).subarray(offset);
  const end = data.lastIndexOf(0x0a);
  if (end < 0) return { lines: [], offset };
  return {
    lines: data.subarray(0, end).toString("utf-8").split("\n"),
    offset: offset + end + 1,
  };
}

function parse(line: string): LogEntry | undefined {
  try {
    return JSON.parse(line) as LogEntry;
  } catch {
    return undefined;
  }
}

function findRun(entry: LogEntry, line: string): Run | undefined {
  // Prompts are logged as user entries. Other entries repeat them (request copies)
  // and tool output can quote a marker from elsewhere.
  if (entry.type !== "user" || line.includes('"tool_result"')) return undefined;
  const match = [...line.matchAll(RUN_MARKER_PATTERN)].at(-1);
  return match ? { correlationId: match[1], agentName: match[2] } : undefined;
}

function subagentLogs(transcript: string): string[] {
  const dir = path.join(transcript.replace(/\.jsonl$/, ""), "subagents");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(file => file.endsWith(".jsonl"))
    .map(file => path.join(dir, file));
}

function summarize(messages: Iterable<MessageUsage>): Dimensions {
  let tokens = 0;
  const tokensByModel = new Map<string, number>();

  for (const { model, usage } of messages) {
    // Cache reads are left out: they would dwarf the real work in long sessions.
    const billed =
      (usage.input_tokens ?? 0) +
      (usage.output_tokens ?? 0) +
      (usage.cache_creation_input_tokens ?? 0);
    tokens += billed;
    tokensByModel.set(model, (tokensByModel.get(model) ?? 0) + billed);
  }

  const model = [...tokensByModel].sort((a, b) => b[1] - a[1])[0][0];
  return { tokens, model };
}

async function report(transcript: string, sessionId: string): Promise<void> {
  const stateFile = path.join(STATE_DIR, `${path.basename(sessionId)}.json`);
  const state: State = fs.existsSync(stateFile)
    ? (JSON.parse(fs.readFileSync(stateFile, "utf-8")) as State)
    : { offsets: {}, recentMessageIds: [] };

  const offsets = { ...state.offsets };
  const seen = new Set(state.recentMessageIds);
  const pending = new Map<string, { run: Run; messages: Map<string, MessageUsage> }>();
  let run = state.run;

  // The main log comes first, so subagent usage joins the latest run it found.
  for (const file of [transcript, ...subagentLogs(transcript)]) {
    const { lines, offset } = readNewLines(file, offsets[file] ?? 0);
    offsets[file] = offset;

    for (const line of lines) {
      const entry = parse(line);
      if (!entry) continue;

      run = findRun(entry, line) ?? run;

      const { id, model, usage } = entry.message ?? {};
      if (entry.type !== "assistant" || !id || !usage || !model) continue;
      if (model === "<synthetic>" || !run || seen.has(id)) continue;

      // One API message spans several log lines that repeat the same usage, so
      // key by message id or the totals nearly double.
      const group = pending.get(run.correlationId) ?? { run, messages: new Map() };
      group.messages.set(id, { model, usage });
      pending.set(run.correlationId, group);
    }
  }

  const save = (next: State) => fs.writeFileSync(stateFile, JSON.stringify(next));
  const recentIds = () => [...seen].slice(-RECENT_ID_LIMIT);

  // Offsets advance only after every push succeeds, so a failure retries on the
  // next Stop. Each successful push records its message ids straight away, so
  // that retry re-reads the same lines but skips runs already sent.
  for (const group of pending.values()) {
    await pushEvent(group.run, undefined, summarize(group.messages.values()));
    for (const id of group.messages.keys()) seen.add(id);
    save({ ...state, recentMessageIds: recentIds() });
  }

  save({ offsets, run, recentMessageIds: recentIds() });
}

// Stop hooks can overlap; a later Stop picks up anything a skipped one left.
function acquireLock(lockFile: string): boolean {
  try {
    fs.closeSync(fs.openSync(lockFile, "wx"));
    return true;
  } catch {
    const age = Date.now() - fs.statSync(lockFile).mtimeMs;
    if (age < LOCK_STALE_MS) return false;
    fs.utimesSync(lockFile, new Date(), new Date());
    return true;
  }
}

async function main(): Promise<void> {
  if (!isConfigured()) return;

  const input = JSON.parse(fs.readFileSync(0, "utf-8")) as {
    session_id?: string;
    transcript_path?: string;
  };
  if (!input.session_id || !input.transcript_path) return;
  if (!fs.existsSync(input.transcript_path)) return;

  fs.mkdirSync(STATE_DIR, { recursive: true });
  const lockFile = path.join(STATE_DIR, `${path.basename(input.session_id)}.lock`);
  if (!acquireLock(lockFile)) return;

  try {
    await report(input.transcript_path, input.session_id);
  } finally {
    fs.rmSync(lockFile, { force: true });
  }
}

main().catch(error => {
  console.error(`AI Hub usage hook skipped: ${String(error)}`);
});
