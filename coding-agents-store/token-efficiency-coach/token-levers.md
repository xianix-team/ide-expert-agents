# Token Levers Reference

Use this reference in S1 and S2. It lists where tokens go in AI-assisted development, and the setting or file that controls each one in each tool. Tool features change often. If what you see in the project doesn't match this list (an unfamiliar file, a missing setting), report it as `[to verify: …]` rather than asserting it.

## Where tokens go

Every turn re-sends the whole context, so a cost that recurs every turn matters far more than a one-off cost.

| Source | When it's paid | Typical size | Main lever |
|---|---|---|---|
| Always-on rules and instructions | Every turn, every session | 0.5k–10k+ tokens | Trim, move rarely needed content into path-scoped rules or skills |
| Tool and MCP server definitions | Every turn while enabled | 0.2k–1k tokens per tool; whole servers can be 10k+ | Disable unused servers and tools per project or per chat |
| Skill and agent descriptions | Every turn (only the description, not the body) | 50–300 tokens each | Keep descriptions tight; uninstall skills nobody uses |
| Conversation history | Every turn, growing | Unbounded | New session per task; compact or summarise; keep sessions short |
| File reads | Once, then every later turn as history | A large file can be 10k–50k tokens | Search first, read line ranges, ignore or deny generated files |
| Command and tool output | Once, then every later turn as history | Test or build logs can be 5k–50k tokens | Quiet flags, scoped runs, `tail` |
| Model output | Once, billed at a higher rate than input | Varies | Ask for diffs and edits, not whole files; short replies |
| The user's prompt | Once | Usually small | Point to files and symbols so the AI doesn't have to explore |

Estimate tokens as **characters ÷ 4** for English and code (for example `wc -c file` ÷ 4). Label every figure as an estimate.

## Claude Code

- **Always-on:** `CLAUDE.md` and `.claude/CLAUDE.md` (project), `CLAUDE.local.md`, `~/.claude/CLAUDE.md` (user), and every `.claude/rules/*.md`. `@path` imports inside `CLAUDE.md` pull the whole imported file into context. Rules in `.claude/rules/` can be scoped to files with `paths:` frontmatter, which is cheaper than putting everything in `CLAUDE.md`.
- **Tools and MCP:** servers come from `.mcp.json` (project) and user or local settings. Disable unused ones with `/mcp` or remove them. `/context` shows the live breakdown of context use, including how much each MCP server and memory file costs.
- **Blocking reads:** use `permissions.deny` entries such as `"Read(./dist/**)"` in `.claude/settings.json`.
- **Habits:** use `/clear` between unrelated tasks and `/compact` when a long task continues. Use subagents for wide exploration, since only their summary returns to the main context. Use `/model` to pick a smaller model for simple tasks.
- **Skills** load only their name and description until they're invoked, so moving rarely needed procedures from `CLAUDE.md` into a skill saves tokens on every turn.

## Cursor

- **Always-on:** `.cursor/rules/*.mdc` with `alwaysApply: true`, the legacy `.cursorrules` file, `AGENTS.md`, and user rules in settings. Rules with `globs:` attach only when matching files are in context, and rules with only a `description:` are pulled in by the agent when relevant. Both are cheaper than always-on.
- **Tools and MCP:** servers come from `.cursor/mcp.json` (project) and `~/.cursor/mcp.json`. Turn off individual tools or servers in settings.
- **Blocking reads:** `.cursorignore` blocks AI access and indexing. `.cursorindexingignore` only skips indexing.
- **Habits:** start a new chat per task. @-mention specific files or symbols instead of the whole codebase, and summarise long chats. Max mode and the largest models use far more tokens, so save them for tasks that need them.

## GitHub Copilot (VS Code)

- **Billing note:** paid Copilot plans charge premium requests multiplied by the model's multiplier, not tokens directly. Context size still affects quality, speed, and how soon a session hits the model's context limit, so the same levers apply. To save on billing, the main lever is model choice and the number of agent requests.
- **Always-on:** `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md` whose `applyTo` matches (`"**"` means always), and `AGENTS.md`. Narrow `applyTo` globs so instructions load only for the files they're about. Put occasional procedures in `.github/prompts/*.prompt.md` or skills instead.
- **Tools and MCP:** servers come from `.vscode/mcp.json` and user settings. Deselect unused tools in the chat tools picker. There is a per-request tool limit, so trimming tools also prevents errors.
- **Blocking reads:** content exclusion is configured in repository or organisation settings on GitHub (Business and Enterprise plans), not in a file in the repo. Mark it `unknown` unless the user confirms it. `.gitignore`d files are generally left out of workspace search.
- **Habits:** start a new chat session per task, reference files with `#file` instead of the whole workspace, and pick a lower-multiplier model for routine work.

## Cross-tool content smells (in always-on files)

- Directory trees, file inventories, or API listings the AI can discover by searching.
- Long code samples, full style guides, or whole docs pasted inline (link to them or move them into a scoped rule).
- The same content duplicated across `CLAUDE.md`, `AGENTS.md`, `.cursor/rules`, and `copilot-instructions.md`. Keep one source and reference it, or accept the duplication only where a tool can't read the shared file.
- Stale instructions about files, commands, or folders that no longer exist (check with Glob).
- Generic advice the model already follows ("write clean code", "be helpful").
