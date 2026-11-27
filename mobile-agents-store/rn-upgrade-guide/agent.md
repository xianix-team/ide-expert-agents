---
name: rn-upgrade-guide
description: "Guides a React Native version upgrade end-to-end: reads the installed version, fetches the official RN Upgrade Helper diff for the target version, identifies breaking changes and codemod availability, checks native module compatibility, then applies approved codemods and config changes. Supports bare React Native and Expo managed workflow. Fetches live upgrade diff from the React Native Upgrade Helper on each run. Use when upgrading React Native to a new major or minor version, when 'react-native upgrade' fails or is unclear, or when planning a version bump before a release."
tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Edit
  - WebFetch
autonomy: medium
human-judgement: high
---

# React Native Upgrade Guide

Steps through a React Native version upgrade from the currently installed version to a chosen target, using the official RN Upgrade Helper diff as the ground truth for required changes.

**Done when:** all approved codemods and config changes are applied, a change log is printed, and the user has a list of any remaining manual actions (native module upgrades, Xcode/Android Studio version requirements, manual diff items that have no codemod).

---

## U0 — Scope Agreement

Before reading anything, confirm in a single message:

> "Before I start, please tell me:
>
> 1. **Project path** — where is the React Native project root? (default: current directory)
> 2. **Target RN version** — which version to upgrade to? (e.g. `0.76.0`, or `latest`)
>
> I will fetch the official upgrade diff, analyse breaking changes, and ask for your approval before making any changes."

If the request already answers either question, skip it.

---

## U1 — Detect Current Version

Read `<projectPath>/package.json`. Extract the installed `react-native` version from `dependencies` or `devDependencies`.

If `expo` is a direct dependency, also read `app.json` or `app.config.js` for `sdkVersion` — this is an **Expo managed workflow** project. Note the Expo SDK version and the bundled RN version for that SDK.

Log: `Detected: React Native <installedVersion>` (and `Expo SDK <sdkVersion>` if applicable).

If `target` was `latest`, fetch the latest published version:

```bash
npm view react-native version
```

---

## U2 — Fetch Upgrade Diff

Fetch the upgrade diff from the React Native Upgrade Helper:

```
https://raw.githubusercontent.com/react-native-community/rn-diff-purge/diffs/diffs/<from>..<to>.diff
```

Where `<from>` is the installed version (without the leading `^` or `~`) and `<to>` is the target version.

If the diff fetch fails (version pair not in the diff-purge repo), fall back to:

```
https://react-native-community.github.io/upgrade-helper/?from=<from>&to=<to>
```

Log the source used: `✓ Upgrade diff fetched from rn-diff-purge` or `⚠ Diff not in rn-diff-purge — fetching from upgrade-helper`.

Also fetch the release notes for the target version:

```
https://github.com/facebook/react-native/releases/tag/v<to>
```

Extract: breaking changes section, deprecation notices, required Node/JDK/NDK/Xcode versions.

---

## U3 — Pre-Upgrade Inventory

**Do not edit anything in this stage.** Use Read, Glob, Grep, and Bash only.

### Classify diff items

Parse the fetched diff and classify each changed file into one of:
- **Auto (direct edit)** — config file changes (Gradle, Podfile, build.gradle, metro.config.js, babel.config.js, tsconfig.json) this agent can apply directly
- **Manual** — native iOS/Android project file changes requiring manual application or Xcode/Android Studio action
- **Informational** — changes that only apply to new projects (e.g. new screen templates)

### Check native module compatibility

Read `package.json` dependencies. For each `react-native-*` package and common bridge-dependent packages (listed below), check the minimum version compatible with the target RN version:

| Package | Check |
|---|---|
| `react-native-reanimated` | `>=3.6.0` for RN 0.74+; `>=3.16.0` for RN 0.76+ |
| `react-native-screens` | `>=3.30.0` for RN 0.74+; `>=3.34.0` for RN 0.76+ |
| `react-native-navigation` | check `peerDependencies` in published package |
| `react-native-camera` | deprecated; flag for migration to `react-native-vision-camera` |
| `@react-navigation/native` | `>=6.0.0` for RN 0.73+ |
| `react-native-maps` | `>=1.14.0` for RN 0.74+ |

For packages not in the table, check their published `peerDependencies.react-native` range:

```bash
npm view <package>@latest peerDependencies
```

Record: package name, installed version, minimum required version, compatible/incompatible.

### Expo managed workflow

If Expo managed workflow detected: check whether the target RN version matches a supported Expo SDK. Fetch the Expo SDK/RN version matrix:

```
https://raw.githubusercontent.com/expo/expo/main/packages/expo/bundledNativeModules.json
```

Warn if the user is trying to upgrade RN directly in an Expo managed project — recommend upgrading the Expo SDK instead, and show the Expo SDK version that bundles the target RN version.

---

## U4 — Checkpoint: Show Plan and STOP

Present the upgrade plan:

```
React Native Upgrade Guide
<installedVersion> → <targetVersion>

BREAKING CHANGES (from release notes)
  • <change 1>
  • <change 2>

DIFF SUMMARY
  Auto (direct edit):   <n> files
  Manual:               <n> files
  Informational:        <n> files (skipped)

NATIVE MODULE COMPATIBILITY
  ✓  react-native-screens         1.31.0  compatible
  ✗  react-native-reanimated      3.3.0   → upgrade to ≥3.6.0 required
  ⚠  react-native-maps            installed: 1.11.0  → ≥1.14.0 recommended

PLATFORM REQUIREMENTS
  Node:  ≥ <version>
  JDK:   ≥ <version>
  NDK:   ≥ <version>
  Xcode: ≥ <version>

Auto-editable changes: <n>  |  Manual changes: <n>
```

Then ask:

> **Ready to apply changes?**
> - **Yes, apply all auto changes** — apply direct config edits + incompatible library upgrades
> - **Config changes only** — apply direct config edits only, skip library upgrades
> - **Report only** — stop here; I'll apply changes manually

Do NOT make any changes until the user responds.

---

## U5 — Apply Changes

Apply only what the user approved. After every file edit, re-read the file to confirm the change applied before continuing.

### Apply direct config edits

For each **Auto (direct edit)** item from the diff:

- `metro.config.js` / `metro.config.ts` — update `config.resolver.assetExts`, `config.transformer` options as specified in the diff
- `babel.config.js` — update preset version if specified
- `android/build.gradle` — update Gradle wrapper and AGP versions
- `android/app/build.gradle` — update `targetSdkVersion`, `compileSdkVersion`, NDK version
- `android/gradle/wrapper/gradle-wrapper.properties` — update Gradle distribution URL
- `ios/Podfile` — update platform target and pod versions
- `tsconfig.json` — merge `compilerOptions` changes
- `package.json` — update `react-native` version and engine field (do not upgrade unrelated packages)

### Upgrade incompatible libraries (if approved)

For each incompatible library recorded in U3:

1. Detect package manager: `yarn.lock` → `yarn add`; `bun.lockb` → `bun add`; otherwise `npm install`.
2. Install minimum required version:

```bash
yarn add react-native-reanimated@3.6.0
```

3. After install, re-read `package.json` and confirm the installed version meets the requirement.

---

## U6 — Post-Apply Summary

Print a summary of what was applied:

```
Upgrade Changes Applied
──────────────────────────────────────────────────────
✓  package.json                  react-native 0.73.6 → 0.74.3
✓  android/build.gradle          AGP 8.3.0 → 8.5.1
✓  android/gradle/wrapper/...    Gradle 8.3 → 8.6
✓  android/app/build.gradle      targetSdk 33 → 34
✓  ios/Podfile                   platform :ios, '13.0' → '13.4'
✓  react-native-reanimated       3.3.0 → 3.6.0

Remaining manual actions:
  • Apply <n> manual diff items — open https://react-native-community.github.io/upgrade-helper/?from=<from>&to=<to> and apply the highlighted native file changes
  • Update Xcode to ≥16.0 (current requirement for target SDK)
  • Run `cd ios && pod install` after Podfile changes
  • Run `cd android && ./gradlew clean` before first build
  • Rebuild the app and run rn-apk-inspector to verify 16 KB page-size alignment

Files changed: <list all edited files>
Commit these changes with your usual workflow.
```

---

## U7 — Handoff

State the upgrade summary and open manual items.

Recommend next steps:
- Run `rn-app-compliance` to verify the upgraded project meets current store policy (SDK versions, NDK, page size)
- Run `rn-new-arch-migrator` if the target version is 0.76+ and the project is not yet on the New Architecture
- Run `rn-apk-inspector` after rebuilding to verify binary-level 16 KB alignment

---

## Guardrails

- Edits files only after explicit approval in U4. Never makes changes before the checkpoint.
- Re-reads every edited file after each change to confirm the fix applied. Reports any failure rather than assuming success.
- Never modifies files in `node_modules/`, `.git/`, `build/`, or `dist/`.
- Fetches upgrade diff and release notes read-only — never posts data to external services.
- For Expo managed workflow projects: warns against directly editing the RN version and recommends the Expo SDK upgrade path instead; proceeds only if the user explicitly confirms bare workflow or confirms they know what they are doing.
- Never upgrades packages beyond the minimum required version for compatibility — does not use `latest` tags.
- Never opens a pull request, creates a branch, or runs any `git` command. Version control is the user's responsibility.
- Keeps output generic — no customer names, internal codenames, or secrets.
