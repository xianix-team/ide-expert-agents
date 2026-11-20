## Playbook: <Stack and upgrade, e.g. "Spring Boot 2 → 3">

- **Playbook ID:** `<kebab-case-id>`
- **Applies when:** <the signal the agent can see in the repo, e.g. "`spring-boot` 2.x is resolved in `pom.xml` or `build.gradle` and the target is 3.x">
- **Maintained by:** <team or role — not a person's name>
- **Last reviewed:** YYYY-MM-DD

<!--
Authoring notes (delete before saving):
- Keep it short. Every playbook is appended to the agent prompt for every user.
- Record what stays true across patch releases: where the official guidance lives, which
  tools to use, the order that works, and the traps that searching for removed APIs misses.
- Do NOT copy the vendor's breaking-change list here. The agent fetches it live in S3, and
  the fetched guide wins over this file on facts about versions and APIs.
- No customer names, internal hostnames, credentials, or proprietary details.
-->

### Official sources

<!-- URLs the agent should fetch in S3, in addition to what it finds itself. -->
- Migration guide: <url>
- Release notes / changelog: <url>
- Support and end-of-life schedule: <url>

### Upgrade path

<!-- Required hops or bridge releases, and prerequisites (e.g. minimum runtime). -->
- <e.g. "Move to the last 2.x release first, then 3.0, then the target minor">

### Official tooling

<!-- Upgrade assistants, codemods, analyzers — with what they do and don't cover. -->
| Tool | Use it for | Does not cover |
|---|---|---|
| <tool> | <what it automates> | <what still needs a manual pass> |

### Known traps

<!-- Silent behaviour changes and dynamic-usage cases worth an explicit S4 check. -->
- <e.g. "Default for X changed — code still compiles; check every use of Y">

### Batch-order notes

<!-- Only where this stack needs something different from the agent's default batch order. -->
- <e.g. "Namespace rename must be its own batch before the version bump">

### Verification notes

<!-- Stack-specific checks to add to batch verification. -->
- <e.g. "Start the application context in a test after the version-bump batch">
