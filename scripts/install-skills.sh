#!/usr/bin/env bash
#
# install-skills.sh — install IDE Expert Agents into a project as native
# skills for Claude Code, GitHub Copilot, or Cursor, so they can be run as
# /<skill-name> slash commands without the MCP server.
#
# This script is standalone. Download it and run it; you don't need a clone:
#
#   curl -fsSL https://raw.githubusercontent.com/xianix-team/ide-expert-agents/main/scripts/install-skills.sh -o install-skills.sh
#   bash install-skills.sh
#
#   # or in one step:
#   curl -fsSL https://raw.githubusercontent.com/xianix-team/ide-expert-agents/main/scripts/install-skills.sh | bash
#
# What it does:
#   1. Clones the latest `main` of the agents repo into a temp folder
#      (deleted when the script exits).
#   2. Asks for the target project folder.
#   3. Asks which tool(s) the project uses.
#   4. Lists every agent and asks which ones to install.
#   5. Writes each one to <project>/<tool-skills-dir>/<name>/SKILL.md.
#
# Each SKILL.md matches what the MCP server serves: the entry file
# (agent.md / SKILL.md) with the agent's other top-level *.md files appended.
# Subfolders (e.g. templates/) are copied as they are.
#
# Requires bash 3.2+ (the macOS default) and git. On Windows, run it from
# Git Bash or WSL.
#
# Environment overrides (optional):
#   IDE_AGENTS_REPO    git URL to clone   (default: the xianix-team repo)
#   IDE_AGENTS_BRANCH  branch to install  (default: main)

REPO_URL="${IDE_AGENTS_REPO:-https://github.com/xianix-team/ide-expert-agents.git}"
REPO_BRANCH="${IDE_AGENTS_BRANCH:-main}"
WORK_DIR=""

# When run as `curl … | bash`, stdin is the script itself, so read the
# answers from the terminal instead.
if [ -z "${BASH_SOURCE[0]:-}" ] && [ ! -t 0 ]; then
  if (exec < /dev/tty) 2>/dev/null; then
    exec < /dev/tty
  else
    echo "No terminal available. Download the script and run it with: bash install-skills.sh" >&2
    exit 1
  fi
fi

# Everything is inside main(), which is called on the last line. bash reads
# the whole function before running it, so a partly downloaded script
# (`curl | bash` cut off mid-way) can never run half of its steps.
main() {
  set -euo pipefail
  export LC_COLLATE=C   # sort files the same way the MCP server does

  # ── Output helpers ────────────────────────────────────────────────────────
  if [ -t 1 ]; then
    B=$'\033[1m'; DIM=$'\033[2m'; RED=$'\033[31m'; GRN=$'\033[32m'
    YEL=$'\033[33m'; CYN=$'\033[36m'; RST=$'\033[0m'
  else
    B=""; DIM=""; RED=""; GRN=""; YEL=""; CYN=""; RST=""
  fi
  info() { printf '%s\n' "${CYN}▸${RST} $*"; }
  ok()   { printf '%s\n' "${GRN}✔${RST} $*"; }
  warn() { printf '%s\n' "${YEL}!${RST} $*" >&2; }
  die()  { printf '%s\n' "${RED}✖${RST} $*" >&2; exit 1; }
  confirm() { # confirm "question" [default y|n]
    local def="${2:-n}" ans hint="[y/N]"
    [ "$def" = "y" ] && hint="[Y/n]"
    read -r -p "$1 $hint " ans || ans=""
    ans="${ans:-$def}"
    case "$ans" in [Yy]*) return 0 ;; *) return 1 ;; esac
  }

  printf '\n%s\n\n' "${B}IDE Expert Agents — skill installer${RST}"

  # ── 1. Check out the latest main into a temp folder ──────────────────────
  command -v git >/dev/null 2>&1 || die "git is not installed. Install git and run again."

  WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ide-expert-agents.XXXXXX")" \
    || die "Could not create a temp folder."
  trap '[ -n "$WORK_DIR" ] && rm -rf "$WORK_DIR"' EXIT
  trap 'exit 130' INT TERM

  local REPO_ROOT="$WORK_DIR/repo"
  # Braces matter: bash 3.2 (macOS) reads the first byte of "…" as part of
  # an unbraced variable name, which fails under `set -u`.
  info "Downloading the latest '${REPO_BRANCH}' from ${REPO_URL}…"
  git clone --quiet --depth 1 --branch "$REPO_BRANCH" "$REPO_URL" "$REPO_ROOT" \
    || die "Could not clone $REPO_URL ($REPO_BRANCH). Check your network and GitHub access."
  ok "Got $REPO_BRANCH @ $(git -C "$REPO_ROOT" rev-parse --short HEAD)."
  echo

  # ── 2. Target project ─────────────────────────────────────────────────────
  local project=""
  while :; do
    read -e -r -p "${B}Where is your project?${RST} (path, default: current directory) " project || exit 1
    project="${project:-$PWD}"
    project="${project/#\~/$HOME}"
    if [ -d "$project" ]; then
      project="$(cd "$project" && pwd)"
      break
    fi
    warn "Not a folder: $project"
  done
  ok "Project: $project"
  echo

  # ── 3. Tool(s) ────────────────────────────────────────────────────────────
  local TOOL_KEYS=(claude copilot cursor)
  local TOOL_LABELS=("Claude Code" "GitHub Copilot" "Cursor")
  local TOOL_DIRS=(".claude/skills" ".github/skills" ".cursor/skills")
  local tools=() sel tok i
  echo "${B}Which tool do you use?${RST}"
  for i in 0 1 2; do
    printf '  %d) %-15s %s→ %s/<skill>/SKILL.md%s\n' \
      $((i + 1)) "${TOOL_LABELS[$i]}" "$DIM" "${TOOL_DIRS[$i]}" "$RST"
  done
  while :; do
    read -r -p "Pick one or more (e.g. 1 or 1,3): " sel || exit 1
    tools=()
    for tok in ${sel//,/ }; do
      case "$tok" in
        1|claude|Claude)   tools+=(0) ;;
        2|copilot|Copilot) tools+=(1) ;;
        3|cursor|Cursor)   tools+=(2) ;;
        *) warn "Unknown choice: $tok"; tools=(); break ;;
      esac
    done
    [ "${#tools[@]}" -gt 0 ] && break
  done
  # Remove duplicates, keep order
  local uniq_tools=() t u seen
  for t in "${tools[@]}"; do
    seen=0
    for u in ${uniq_tools[@]+"${uniq_tools[@]}"}; do [ "$u" = "$t" ] && seen=1; done
    [ "$seen" = 0 ] && uniq_tools+=("$t")
  done
  tools=("${uniq_tools[@]}")
  echo

  # ── 4. Find agents ────────────────────────────────────────────────────────
  local NAMES=() DIRS=() ENTRIES=() STORES=() DESCS=()
  local dir entry f name store desc
  for dir in "$REPO_ROOT"/*-agents-store/*/; do
    entry=""
    for f in agent.md SKILL.md; do
      if [ -f "$dir$f" ]; then entry="$dir$f"; break; fi
    done
    [ -n "$entry" ] || continue

    # Read `name` and `description` from the YAML frontmatter (handles
    # one-line, quoted, and folded >- / | values).
    name="$(awk '
      NR==1 && /^---/ {fm=1; next}
      fm && /^---/ {exit}
      fm && /^name:/ {sub(/^name:[ \t]*/, ""); gsub(/^["\047]|["\047][ \t]*$/, ""); print; exit}
    ' "$entry")"
    desc="$(awk '
      NR==1 && /^---/ {fm=1; next}
      fm && /^---/ {exit}
      fm && /^description:/ {d=1; sub(/^description:[ \t]*/, ""); if ($0 !~ /^[>|]/) s=$0; next}
      fm && d && /^[ \t]/ {s=s " " $0; next}
      fm && d {d=0}
      END {gsub(/[ \t]+/, " ", s); gsub(/^ |^["\047]|["\047]$/, "", s); print s}
    ' "$entry")"
    [ -n "$name" ] || continue
    if ! printf '%s' "$name" | grep -Eq '^[a-z0-9][a-z0-9-]*$'; then
      warn "Skipping $(basename "$dir"): name '$name' is not lowercase-with-hyphens."
      continue
    fi

    store="$(basename "$(dirname "$dir")")"
    NAMES+=("$name"); DIRS+=("${dir%/}"); ENTRIES+=("$entry")
    STORES+=("${store%-agents-store}"); DESCS+=("$desc")
  done
  local count="${#NAMES[@]}"
  [ "$count" -gt 0 ] || die "No agents found in $REPO_URL ($REPO_BRANCH)."

  # ── 5. Choose skills ──────────────────────────────────────────────────────
  local cols width last_store=""
  cols="$(tput cols 2>/dev/null || echo 100)"
  width=$((cols - 40)); [ "$width" -lt 20 ] && width=20
  echo "${B}Available skills${RST} ($count)"
  for ((i = 0; i < count; i++)); do
    if [ "${STORES[$i]}" != "$last_store" ]; then
      last_store="${STORES[$i]}"
      printf '\n  %s%s%s\n' "$B" "$last_store" "$RST"
    fi
    desc="${DESCS[$i]}"
    [ "${#desc}" -gt "$width" ] && desc="${desc:0:$((width - 1))}…"
    printf '  %3d) %-32s %s%s%s\n' $((i + 1)) "${NAMES[$i]}" "$DIM" "$desc" "$RST"
  done
  echo
  echo "Enter numbers, ranges, or store names, separated by spaces or commas."
  echo "${DIM}Examples: 3 7 12   |   1-5,9   |   qa idf   |   all${RST}"

  local chosen=() picked a b s n
  while :; do
    read -r -p "${B}Skills to install:${RST} " sel || exit 1
    picked=""   # a space-separated list of indexes, e.g. " 3 7 "
    local bad=0
    for tok in ${sel//,/ }; do
      if [ "$tok" = "all" ]; then
        for ((i = 0; i < count; i++)); do picked="$picked $i "; done
      elif printf '%s' "$tok" | grep -Eq '^[0-9]+$'; then
        if [ "$tok" -ge 1 ] && [ "$tok" -le "$count" ]; then
          picked="$picked $((tok - 1)) "
        else warn "Out of range: $tok"; bad=1; fi
      elif printf '%s' "$tok" | grep -Eq '^[0-9]+-[0-9]+$'; then
        a="${tok%-*}"; b="${tok#*-}"
        if [ "$a" -ge 1 ] && [ "$b" -le "$count" ] && [ "$a" -le "$b" ]; then
          for ((n = a; n <= b; n++)); do picked="$picked $((n - 1)) "; done
        else warn "Bad range: $tok"; bad=1; fi
      else
        s=0
        for ((i = 0; i < count; i++)); do
          if [ "${STORES[$i]}" = "$tok" ] || [ "${NAMES[$i]}" = "$tok" ]; then
            picked="$picked $i "; s=1
          fi
        done
        [ "$s" = 1 ] || { warn "No store or skill named: $tok"; bad=1; }
      fi
    done
    [ "$bad" = 1 ] && continue
    chosen=()
    for ((i = 0; i < count; i++)); do
      case "$picked" in *" $i "*) chosen+=("$i") ;; esac
    done
    if [ "${#chosen[@]}" -eq 0 ]; then warn "Nothing selected."; continue; fi
    break
  done

  echo
  echo "${B}Plan${RST}"
  echo "  Project: $project"
  for t in "${tools[@]}"; do echo "  Tool:    ${TOOL_LABELS[$t]} → ${TOOL_DIRS[$t]}/"; done
  printf '  Skills:  '
  for i in "${chosen[@]}"; do printf '%s ' "${NAMES[$i]}"; done
  printf '\n\n'
  confirm "Go ahead?" y || die "Cancelled. Nothing was copied."
  echo

  # ── 6. Copy ───────────────────────────────────────────────────────────────
  local overwrite_all=0 installed=0 skipped=0 dest target sf item ans
  for t in "${tools[@]}"; do
    target="$project/${TOOL_DIRS[$t]}"
    mkdir -p "$target"
    info "${TOOL_LABELS[$t]} → $target"
    for i in "${chosen[@]}"; do
      name="${NAMES[$i]}"; dir="${DIRS[$i]}"; entry="${ENTRIES[$i]}"
      dest="$target/$name"

      if [ -e "$dest" ] && [ "$overwrite_all" = 0 ]; then
        read -r -p "    '$name' is already installed. Replace it? [y/N/a=yes to all] " ans || ans=""
        case "$ans" in
          [Aa]*) overwrite_all=1 ;;
          [Yy]*) ;;
          *) printf '    %s- skipped %s%s\n' "$DIM" "$name" "$RST"; skipped=$((skipped + 1)); continue ;;
        esac
      fi
      [ -e "$dest" ] && rm -rf "$dest"
      mkdir -p "$dest"

      # SKILL.md = entry file + other top-level *.md files (same as the MCP server)
      {
        cat "$entry"
        for sf in "$dir"/*.md; do
          [ -f "$sf" ] || continue
          [ "$sf" = "$entry" ] && continue
          [ "$(basename "$sf")" = "README.md" ] && continue
          printf '\n\n---\n\n'
          cat "$sf"
        done
      } > "$dest/SKILL.md"

      # Copy subfolders and any non-markdown files the agent refers to
      for item in "$dir"/*; do
        [ -e "$item" ] || continue
        if [ -d "$item" ]; then
          cp -R "$item" "$dest/"
        elif [ "${item%.md}" = "$item" ]; then
          cp "$item" "$dest/"
        fi
      done

      if [ "${#DESCS[$i]}" -gt 1024 ]; then
        printf '    %s✔%s /%s %s(note: description is over 1024 characters; some tools may cut it short)%s\n' \
          "$GRN" "$RST" "$name" "$YEL" "$RST"
      else
        printf '    %s✔%s /%s\n' "$GRN" "$RST" "$name"
      fi
      installed=$((installed + 1))
    done
  done

  echo
  if [ "$skipped" -gt 0 ]; then
    ok "Installed $installed skill(s), skipped $skipped."
  else
    ok "Installed $installed skill(s)."
  fi
  echo
  echo "${B}Next steps${RST}"
  for t in "${tools[@]}"; do
    case "${TOOL_KEYS[$t]}" in
      claude)  echo "  • Claude Code: restart the session, then type /<skill-name> (e.g. /${NAMES[${chosen[0]}]})." ;;
      copilot) echo "  • GitHub Copilot: in VS Code Copilot Chat (Agent mode), type /<skill-name>. Skills must be turned on (chat.useAgentSkills)." ;;
      cursor)  echo "  • Cursor: in the Agent chat, type / and pick the skill." ;;
    esac
  done
  echo "  • Commit the skills folder so your team gets them too."
  echo "  • To update them later, run this script again. It always installs the latest '$REPO_BRANCH'."
}

main "$@"; exit
