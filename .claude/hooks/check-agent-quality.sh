#!/bin/sh
# PostToolUse (Write|Edit) hook: after an agent.md/SKILL.md under a
# *-agents-store/<agent-name>/ folder is written or edited, remind Claude
# to run the agent-quality-review skill against it. Never blocks the write.

input="$(cat)"

file_path="$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_response.filePath // empty' 2>/dev/null)"

[ -z "$file_path" ] && exit 0

case "$file_path" in
  *-agents-store/*/agent.md|*-agents-store/*/SKILL.md)
    ;;
  *)
    exit 0
    ;;
esac

context="An agent definition was just written: $file_path. Before considering this work done, invoke the agent-quality-review skill on this file to check it against the repo's AI-agent quality-attribute checklist (correctness, reliability, autonomy/scope discipline, safety, efficiency, usability)."

jq -n --arg ctx "$context" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $ctx}}'
