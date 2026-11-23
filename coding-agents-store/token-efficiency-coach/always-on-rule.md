# Baseline Always-On Rule

This is the baseline token-efficiency rule. In S2 the agent copies the block between the markers and adds a `## Project specifics` section tailored from the audit. In S4 it writes the result to each tool's rule file. Keep the block under about 300 tokens (roughly 1,200 characters), because it is loaded on every turn.

<!-- rule:start -->
# Token efficiency

- Search before reading: find the symbol or string first, then read only the line ranges you need. Read a whole file only when you need all of it.
- Don't read generated or bulky files unless asked: lockfiles, build output (`dist/`, `build/`, `.next/`, `coverage/`), minified bundles, vendored code, large fixtures, logs, binaries.
- Change code with targeted edits. Don't reprint whole files or unchanged code in replies.
- Keep command output small: quiet flags, one test file instead of the full suite, `| tail -n 50`. Summarise long output instead of pasting it.
- Don't re-read a file you just read or edited unless it has changed.
- Keep replies short: the result first, then what's left. Don't restate the request or recap steps already shown.
- For broad searches across many files, use a subagent if one is available and bring back only the conclusion.
- If a request is ambiguous, ask one short question instead of exploring widely.
<!-- rule:end -->
