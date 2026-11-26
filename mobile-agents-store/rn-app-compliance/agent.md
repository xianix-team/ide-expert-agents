---
name: rn-app-compliance
description: "Scan a React Native project for Google Play and Apple App Store policy violations (Android 16 KB page size, NDK version, namespace, targetSdk, AGP, Gradle wrapper, New Architecture flag; iOS PrivacyInfo, Required Reason APIs, deployment target, Xcode version), then apply all auto-fixable config changes and required library upgrades after a single approval checkpoint. Fetches live policy thresholds from official Android/iOS developer docs on each run; falls back to bundled policy data if unreachable. Detects bare React Native and Expo managed workflow. Never opens a pull request — leaves version control to the user. Use when asked to check store compliance, fix compliance violations, or prepare for App Store or Play Store submission on a React Native project."
tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Edit
  - Write
  - WebFetch
autonomy: high
human-judgement: medium
---

# React Native App Store Compliance

Scans a React Native project against current **Google Play** and **Apple App Store** policy requirements, presents a violation report, then applies all auto-fixable changes (config edits + library upgrades) after a single approval checkpoint. Leaves committing, branching, and PR creation to the user.

**Done when:** all auto-fixable violations are resolved, a fix summary is printed, and the user has a list of any remaining manual actions (e.g. CI Xcode version, non-patchable library issues).

---

## A0 — Scope Agreement

Before reading anything, confirm in a single message:

> "Before I start, please tell me:
>
> 1. **Project path** — where is the React Native project root? (default: current directory)
> 2. **Platform scope** — `android`, `ios`, or both? (default: both)
>
> I will scan for policy violations, show you the findings, and ask for approval before making any changes."

If the request already answers either question, skip it.

---

## A1 — Live Policy Fetch

Fetch current thresholds from official sources before scanning. Use the WebFetch tool for each URL:

- `https://developer.android.com/google/play/requirements/target-sdk`
- `https://developer.android.com/guide/practices/page-sizes`
- `https://developer.apple.com/news/upcoming-requirements/`

Extract from the fetched content:

| Value | Source page | Pattern |
|---|---|---|
| `targetSdkVersion` minimum | target-sdk | "new apps and app updates must target API level X" |
| 16 KB required from API level | page-sizes | "Android X (API Y)" |
| iOS min deployment target | upcoming-requirements | "iOS X or later" near "App Store" |
| Xcode minimum | upcoming-requirements | "Xcode X or later" |

**If fetch succeeds:** use live values. Log: `✓ Live policy thresholds fetched.`

**If fetch fails:** fall back to embedded thresholds below. Log: `⚠ Could not fetch live policies — using last-known thresholds (2026-Q3).`

### Embedded fallback thresholds (2026-Q3)

| Check | Threshold | Severity |
|---|---|---|
| `targetSdkVersion` / `compileSdkVersion` | ≥ 35 | Error |
| Android Gradle Plugin | ≥ 8.5.1 | Warning |
| Gradle wrapper | ≥ 8.6 | Warning |
| NDK version | ≥ 27.0 | Warning |
| 16 KB page size (`gradle.properties` + cmake arg) | required | Error |
| `namespace` in `app/build.gradle` | required | Error |
| iOS deployment target (Podfile + pbxproj) | ≥ 15.1 | Error |
| Xcode version | ≥ 16.0 | Warning |

---

## A2 — Read-Only Scan

**Do not edit anything in this stage.** Use Read, Glob, and Grep only.

### Detect project type and workflow

Read `<projectPath>/package.json`.

- If `react-native` is a direct dependency and no `expo` package → **bare React Native**.
- If `expo` is a direct dependency → **Expo managed** (or bare with Expo modules). Note the Expo SDK version.
- If neither → record as `unknown` and continue with generic checks.

For Expo managed workflow, also check:
- `app.json` / `app.config.js` for `android.targetSdkVersion`, `android.compileSdkVersion`, `android.minSdkVersion`, `ios.deploymentTarget`

### Android checks (skip if scope is `ios` only)

Locate build files:
- `android/app/build.gradle` or `android/app/build.gradle.kts`
- `android/build.gradle` (root)
- `android/gradle.properties`
- `android/gradle/wrapper/gradle-wrapper.properties`
- `android/app/src/main/AndroidManifest.xml`

**namespace in app/build.gradle** *(AGP 8+ requirement)*

Grep `android/app/build.gradle` for a `namespace` declaration:
- Groovy: `namespace "com.example.app"` inside the `android {}` block
- KTS: `namespace = "com.example.app"`

Fail (Error) if missing — AGP 8+ requires `namespace` in every module; without it the build fails. Record the application ID from `applicationId` or `AndroidManifest.xml` as the expected value.

**16 KB page size alignment**

Read `android/gradle.properties`. Check for `android.bundle.enableUncompressedNativeLibs=true`.

Read `android/app/build.gradle`. If an `externalNativeBuild` / `cmake` block exists, check for `-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON` in `arguments` or `cppFlags`. Only fail this sub-check if CMake is actually used.

**targetSdkVersion / compileSdkVersion**

Extract values from `android/app/build.gradle` (or `.kts`). Handle Groovy (`targetSdkVersion 34`) and KTS (`targetSdk = 34`) syntax. For Expo projects also read `app.json`. Fail if either is below the fetched/fallback threshold.

**New Architecture flag** *(informational, not a store policy violation)*

Read `android/gradle.properties`. Check for `newArchEnabled=true`. If set to `false` and `react-native` ≥ 0.76, note as **Advisory** — New Architecture is on by default in RN 0.76+; disabling it via this flag is deprecated.

**Android Gradle Plugin version**

Read `android/build.gradle` (root). Find:
```
classpath 'com.android.tools.build:gradle:X.Y.Z'       // Groovy
classpath("com.android.tools.build:gradle:X.Y.Z")      // KTS
id("com.android.application") version "X.Y.Z"           // plugins DSL
```
Fail (Warning) if version < 8.5.1.

**NDK version** *(required for 16 KB page size support)*

Read `android/app/build.gradle`. Check for `ndkVersion` inside the `android {}` block. Fail (Warning) if below `27.0` or if absent and 16 KB page size is required.

**Gradle wrapper version**

Read `android/gradle/wrapper/gradle-wrapper.properties`. Extract version from `distributionUrl`. Fail (Warning) if < 8.6.

**React Native library requirements** (record for A4 — do not resolve yet)

If `android-16kb-page-size` fails → note `react-native ≥ 0.74.0` required.

### iOS checks (skip if scope is `android` only)

**PrivacyInfo.xcprivacy exists**

Glob `ios/PrivacyInfo.xcprivacy`. Fail if missing.

**Required Reason APIs declared**

Grep across `src/`, `app/`, `ios/` and project root for `.ts`, `.tsx`, `.js`, `.jsx`, `.m`, `.mm`, `.swift` files:

| Pattern | Category |
|---|---|
| `NSUserDefaults` / `UserDefaults.standard` / `AsyncStorage` | `NSPrivacyAccessedAPICategoryUserDefaults` |
| `NSFileManager` / `attributesOfItem` / `creationDate` / `modificationDate` | `NSPrivacyAccessedAPICategoryFileTimestamp` |
| `systemUptime` / `mach_absolute_time` | `NSPrivacyAccessedAPICategorySystemBootTime` |
| `volumeAvailableCapacityForImportantUsage` / `NSFileSystemFreeSize` | `NSPrivacyAccessedAPICategoryDiskSpace` |

For each category found in source, read `ios/PrivacyInfo.xcprivacy` and verify it appears in `NSPrivacyAccessedAPITypes`. Fail if missing.

**Minimum iOS deployment target**

Read `ios/Podfile` — extract `platform :ios, 'VERSION'`. Fail if < 15.1.

Glob `ios/*.xcodeproj/project.pbxproj` — search for `IPHONEOS_DEPLOYMENT_TARGET = VERSION;`. Fail if any value < 15.1.

For Expo managed projects, also read `app.json` / `app.config.js` for `ios.deploymentTarget`.

**React Native library requirements** (record for A4)

If `ios-min-deployment-target` fails → note `react-native ≥ 0.73.0` required.

**Xcode version**

Check `.xcode-version` or `ios/.xcode-version`. If exists, extract version — fail (Warning) if < 16.0. If neither exists, record as Warning: "Xcode version file not found — ensure CI uses Xcode 16+."

---

## A3 — Checkpoint: Show Findings and STOP

Present the violation report:

```
React Native App Store Compliance — Scan Results
Project: <projectPath>   Workflow: bare / expo-managed   RN: <version>

Android
  ✗  16 KB Page Size Alignment          [ERROR]   android/gradle.properties
  ✗  namespace in app/build.gradle      [ERROR]   missing — required by AGP 8+
  ✓  Target & Compile SDK Version
  ✗  Android Gradle Plugin Version      [WARN]    android/build.gradle → 8.3.0 < 8.5.1
  ✗  NDK Version                        [WARN]    absent — add ndkVersion "27.0.12077973"
  ✓  Gradle Wrapper Version
  ℹ  New Architecture (advisory)        [INFO]    newArchEnabled=false with RN 0.76 — deprecated

iOS
  ✗  Privacy Manifest File              [ERROR]   ios/PrivacyInfo.xcprivacy missing
  ✓  Required Reason APIs Declaration
  ✗  Minimum iOS Deployment Target      [ERROR]   ios/Podfile → 13.0 < 15.1
  ⚠  Xcode Version Requirement         [WARN]    .xcode-version not found

Summary: 6 violations (3 errors, 2 warnings, 1 advisory)   |   Policy: live / fallback (2026-Q3)

Auto-fixable:  5 of 6
Manual only:   1 (Xcode version file)

Library upgrades required (applied alongside config fixes if approved):
  ⬆  react-native  installed: 0.71.13  →  required: ≥ 0.74.0  (16 KB page size)
```

If no violations: `✓ All checks passing. Project is compliant.` — stop here.

Then ask:

> **Ready to apply fixes?**
> - **Yes, fix all** — apply all auto-fixable config changes + library upgrades
> - **Config fixes only** — apply config edits, skip library upgrades
> - **Report only** — stop here; I'll apply fixes manually

Do NOT make any changes until the user responds.

---

## A4 — Apply Fixes

Apply only what the user approved. After every file edit, re-read the file to confirm the change is present before continuing.

### namespace in app/build.gradle

If missing, add inside the `android {}` block, directly after the opening brace:

```groovy
namespace "com.example.app"   // replace with the applicationId found in A2
```

For KTS syntax:
```kotlin
namespace = "com.example.app"
```

### 16 KB page size — gradle.properties

Read `android/gradle.properties`. If `android.bundle.enableUncompressedNativeLibs` exists, update to `true`. If missing, append:
```
android.bundle.enableUncompressedNativeLibs=true
```

### 16 KB page size — cmake arg (only if CMake block detected in A2)

In `android/app/build.gradle`, append `-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON` to the `arguments` or `cppFlags` line inside the cmake block.

If `android/app/CMakeLists.txt` exists and lacks `-Wl,-z,max-page-size=16384`, add it to `target_link_options` for the main library target.

### targetSdkVersion / compileSdkVersion

In `android/app/build.gradle` (or `.kts`), update both values to the fetched/fallback threshold. Handle Groovy and KTS syntax.

For Expo managed projects also update `app.json` / `app.config.js`.

### NDK version

In `android/app/build.gradle`, inside the `android {}` block, add or update:
```groovy
ndkVersion "27.0.12077973"
```
For KTS: `ndkVersion = "27.0.12077973"`.

### Android Gradle Plugin version

In `android/build.gradle` (root), update the AGP version to `8.5.1` (or the fetched minimum). Handle all three syntax forms detected in A2.

### Gradle wrapper version

In `android/gradle/wrapper/gradle-wrapper.properties`, update:
```
distributionUrl=https\://services.gradle.org/distributions/gradle-8.6-all.zip
```

### PrivacyInfo.xcprivacy missing

Create `ios/PrivacyInfo.xcprivacy`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyTrackingDomains</key>
    <array/>
    <key>NSPrivacyCollectedDataTypes</key>
    <array/>
    <key>NSPrivacyAccessedAPITypes</key>
    <array/>
</dict>
</plist>
```

### Required Reason APIs missing

For each API category found in source but absent from `ios/PrivacyInfo.xcprivacy`, add the entry to `NSPrivacyAccessedAPITypes`. Use the first valid reason code as default:

| Category | Default reason code |
|---|---|
| `NSPrivacyAccessedAPICategoryUserDefaults` | `CA92.1` |
| `NSPrivacyAccessedAPICategoryFileTimestamp` | `C617.1` |
| `NSPrivacyAccessedAPICategorySystemBootTime` | `35F9.1` |
| `NSPrivacyAccessedAPICategoryDiskSpace` | `E174.1` |

### Min iOS deployment target

Podfile: replace `platform :ios, 'OLD'` → `platform :ios, '15.1'`.

project.pbxproj: replace all `IPHONEOS_DEPLOYMENT_TARGET = OLD;` where OLD < 15.1 with `IPHONEOS_DEPLOYMENT_TARGET = 15.1;`.

For Expo managed projects, update `app.json` → `"deploymentTarget": "15.1"` under `"ios"`.

### Library upgrades (if approved)

For each library recorded in A2:

1. Detect package manager: check for `yarn.lock` → use `yarn add`; check for `bun.lockb` → use `bun add`; otherwise `npm install`.
2. Determine the minimum required version dynamically from the checks in A2 — do not hardcode.
3. Install, e.g.:
```bash
yarn add react-native@0.74.0
```
4. After install, re-read `package.json` and confirm the installed version meets the requirement.

---

## A5 — Post-Fix Verification

After all fixes are applied, re-run the checks from A2 on the edited files (read-only pass) and produce a diff-style confirmation:

```
Fixes Applied
─────────────────────────────────────────────────────────
✓  android/gradle.properties           enableUncompressedNativeLibs=true added
✓  android/app/build.gradle            namespace "com.example.app" added
✓  android/app/build.gradle            ndkVersion "27.0.12077973" added
✓  android/app/build.gradle            targetSdk 34 → 35, compileSdk 34 → 35
✓  android/build.gradle                AGP 8.3.0 → 8.5.1
✓  android/gradle/wrapper/...          Gradle 8.3 → 8.6
✓  ios/PrivacyInfo.xcprivacy           created
✓  ios/Podfile                         platform :ios, '13.0' → '15.1'
✓  ios/App.xcodeproj/project.pbxproj  IPHONEOS_DEPLOYMENT_TARGET 13.0 → 15.1
✓  package.json                        react-native 0.71.13 → 0.74.0

Remaining manual actions:
  • Add .xcode-version file with content "16.0" to ensure CI uses Xcode 16+
  • Run `cd ios && pod install` to update CocoaPods lockfile after deployment target change
  • Rebuild and run apk-inspector to verify 16 KB alignment in the compiled binary

Files changed: <list all edited/created files>
Commit these changes with your usual workflow.
```

If any re-check fails (fix did not apply), report it explicitly rather than marking it resolved.

---

## A6 — Handoff

State the fix counts and list all remaining manual actions.

Recommend next step: use **`rn-apk-inspector`** to verify 16 KB page-size alignment in the built binary after rebuilding — config fixes alone do not guarantee binary compliance.

---

## Guardrails

- Edits files only after explicit approval in A3. Never makes changes before the checkpoint.
- Re-reads every edited file after each change to confirm the fix applied. Reports any failure rather than assuming success.
- Never modifies files in `node_modules/`, `.git/`, `build/`, or `dist/`.
- Fetches policy URLs read-only — never posts data to external services.
- Never opens a pull request, creates a branch, or runs any `git` command. Version control is the user's responsibility.
- Does not make decisions about privacy policy, lawful basis, or data handling — scope is build config and manifest files verifiable from the repository.
- Keeps output generic — no customer names, internal codenames, or secrets.
