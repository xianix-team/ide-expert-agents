# Mobile Agents Store

Agents for mobile app development — React Native compliance scanning, app store submission readiness, and binary artifact verification.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

<!-- generated:agents:start — edit catalog.json or runbooks/*.md, then run `npm run docs` in mcp-server/ -->
| Agent | Prompt name | Autonomy | Human judgement | When to use |
|---|---|---|---|---|
| **RN App Store Compliance** | `rn-app-compliance` | High | Medium | When you want to scan a React Native project for Google Play and Apple App Store policy violations (Android 16 KB page size, NDK version, namespace, targetSdk, AGP, Gradle wrapper, New Architecture advisory; iOS PrivacyInfo, Required Reason APIs, deployment target, Xcode version), then apply all auto-fixable config changes and library upgrades after a single approval checkpoint. Detects bare React Native and Expo managed workflow. Never opens a pull request — leaves version control to the user. Use before a Play Store or App Store submission, after upgrading React Native, or when a policy deadline is approaching |
| **RN APK Inspector** | `rn-apk-inspector` | High | Low | When you want to verify that a built React Native APK's native .so libraries are 16 KB page-size compliant at the binary level (PT_LOAD p_align=0x4000) — not just at the build-config level. Maps failing libraries to their npm packages and minimum compliant versions. Use after applying compliance config fixes and rebuilding, to confirm the compiled artifact is ready for Android 15+ devices before Play Store submission |
| **RN Upgrade Guide** | `rn-upgrade-guide` | Medium | High | When upgrading a React Native project to a new major or minor version — fetches the official RN Upgrade Helper diff for the target version, identifies breaking changes and codemod availability, checks native module compatibility, then applies approved codemods and direct config changes (Gradle, Podfile, metro config). Detects bare React Native and Expo managed workflow. Use when 'react-native upgrade' is unclear, when planning a version bump before a release, or after a React Native security advisory |
| **Mobile Security Scanner** | `mobile-security-scanner` | High | Medium | When you want a read-only security audit of a mobile project against the OWASP Mobile Top 10 (2024) — insecure data storage (plain SharedPreferences/UserDefaults/AsyncStorage for PII/tokens), hardcoded secrets and API keys, debug flags left in production builds, sensitive data in logs, deep link open-redirect risks, missing certificate pinning, excessive AndroidManifest/Info.plist permissions, and binary protection gaps (ProGuard/R8, symbol stripping). Supports React Native, Flutter, native Android, and native iOS. Strictly read-only. Use before a production release, before a security review, or alongside mobile-app-compliance for a full pre-submission audit |
| **RN New Architecture Migrator** | `rn-new-arch-migrator` | Medium | High | When migrating a React Native project to the New Architecture (TurboModules, Fabric renderer, Codegen) — inventories native modules and libraries for New Architecture compatibility, sets up Codegen configuration, enables the New Architecture flag, and applies approved config changes. Fetches the community compatibility table on each run. Use when enabling New Architecture on RN 0.73+, when preparing for the RN 0.76+ default enablement, or when native modules crash on New Architecture |
| **RN Performance Auditor** | `rn-performance-auditor` | High | Medium | When you want a read-only performance audit of a React Native project — bundle size signals (barrel imports, metro config, unused dependencies), JavaScript re-render patterns (missing memo/useCallback, unstable prop references), image and asset optimization opportunities, list virtualization (FlatList vs FlashList), Hermes engine configuration, and JS thread bottleneck patterns. Strictly read-only. Use when the app feels slow, before a performance sprint, or when bundle size is a concern |
| **Deep Link Auditor** | `deep-link-auditor` | High | Low | When you want a read-only audit of a mobile project's deep linking setup — Universal Links (iOS apple-app-site-association), App Links (Android assetlinks.json), custom URI schemes, in-app navigation handler coverage, and security risks (open redirect, JavaScript injection via WebView, intent redirection). Supports React Native, Flutter, native Android, and native iOS. Fetches and validates assetlinks.json and AASA files live. Strictly read-only. Use before releasing a feature that handles deep links, before an App Store review, or when deep links fail to open the correct screen |
<!-- generated:agents:end -->

## Adding an agent

1. Create a folder here with an `agent.md` file, starting from [templates/AGENT_TEMPLATE.md](../templates/AGENT_TEMPLATE.md). It needs `name` (equal to the folder name) and `description` in YAML frontmatter.
2. Add the agent to [catalog.json](../catalog.json) under `mobile-agents-store`, with a display `title` and `whenToUse` text, then run `npm run docs` in `mcp-server/` to regenerate the table above. Don't edit the table by hand.
3. The agent appears automatically on the next server restart.
