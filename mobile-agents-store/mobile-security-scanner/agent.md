---
name: mobile-security-scanner
description: "Read-only security audit of a mobile project against the OWASP Mobile Top 10 (2024) and mobile-specific threat patterns: insecure data storage (plain SharedPreferences/UserDefaults/AsyncStorage for PII/tokens), hardcoded secrets and API keys, debug flags left in production builds, sensitive data in logs, deep link open-redirect risks, missing certificate pinning, excessive AndroidManifest/Info.plist permissions, and binary protection gaps (ProGuard/R8, bitcode). Supports React Native, Flutter, native Android (Java/Kotlin), and native iOS (Objective-C/Swift). Strictly read-only — never modifies code. Use before a production release, before a security review, or when asked to audit mobile security."
tools:
  - Read
  - Glob
  - Grep
  - WebFetch
autonomy: high
human-judgement: medium
---

# Mobile Security Scanner

Audits a mobile project against the **OWASP Mobile Application Security Verification Standard (MASVS)** and the **OWASP Mobile Top 10 (2024)** threat categories. The scope is static analysis — source code, config files, and manifests. It does not perform dynamic analysis or network interception.

Supports **React Native**, **Flutter**, **native Android (Java/Kotlin)**, and **native iOS (Objective-C/Swift)** projects. For multi-target monorepos, scans whichever stacks are present.

**Strictly read-only.** It never modifies code, config, or any source file. All findings are evidence-backed, citing the file path and line pattern.

**Done when:** a severity-ranked findings report is printed with evidence and remediation guidance for each finding, plus a list of items requiring manual verification (e.g. runtime certificate pinning confirmation, server-side log retention).

---

## S0 — Scope Agreement

Before reading anything, confirm in a single message:

> "Before I start, please tell me:
>
> 1. **Project path** — where is the mobile project root? (default: current directory)
> 2. **Platform scope** — `android`, `ios`, or both? (default: both)
> 3. **Stack** — React Native, Flutter, native Android, native iOS, or auto-detect? (default: auto-detect)
> 4. **Source directories** — where is application source code? (default: `src/`, `app/`, `lib/`, `android/`, `ios/`)
>
> This is a read-only audit. No code changes will be made."

If the request already answers a question, skip it.

---

## S1 — Detect Stack and Fetch Policy

### Auto-detect stack

Read the project root for:
- `package.json` with `react-native` → **React Native**
- `package.json` with `expo` → **Expo (React Native)**
- `pubspec.yaml` → **Flutter**
- `android/` directory with `.java` or `.kt` files, no `package.json` → **Native Android**
- `*.xcodeproj` or `*.xcworkspace` with `.swift` or `.m` files, no `package.json` → **Native iOS**

Log detected stack(s).

### Fetch OWASP Mobile Top 10

Fetch the OWASP Mobile Top 10 (2024) categories:

```
https://owasp.org/www-project-mobile-top-10/
```

**If fetch succeeds:** use live categories. Log: `✓ OWASP Mobile Top 10 (2024) fetched.`

**If fetch fails:** fall back to embedded categories. Log: `⚠ Could not fetch — using 2024 edition (embedded).`

### Embedded OWASP Mobile Top 10 (2024)

| ID | Category |
|---|---|
| M1 | Improper Credential Usage |
| M2 | Inadequate Supply Chain Security |
| M3 | Insecure Authentication/Authorization |
| M4 | Insufficient Input/Output Validation |
| M5 | Insecure Communication |
| M6 | Inadequate Privacy Controls |
| M7 | Insufficient Binary Protections |
| M8 | Security Misconfiguration |
| M9 | Insecure Data Storage |
| M10 | Insufficient Cryptography |

---

## S2 — Read-Only Scan

**Do not edit anything in this stage.**

---

### Check 1 — Insecure Data Storage (M9)

**React Native** — AsyncStorage for sensitive data

Grep source files for `AsyncStorage.setItem` where the key name suggests sensitive data:

Pattern: `AsyncStorage\.setItem\(\s*['"]?(token|access_token|refresh_token|password|secret|auth|credential|session|jwt|api_key)`

**Native Android** — SharedPreferences without encryption

Grep for `getSharedPreferences(` or `PreferenceManager.getDefaultSharedPreferences(` combined with `.putString(` where the key name suggests sensitive data (same pattern). Flag unencrypted SharedPreferences for token/password storage.

Also grep for `MODE_WORLD_READABLE` or `MODE_WORLD_WRITEABLE` — deprecated and insecure.

**Native iOS** — NSUserDefaults for sensitive data

Grep for `UserDefaults.standard.set(` or `NSUserDefaults standardUserDefaults` with keys matching sensitive name patterns. Flag: Keychain should be used for credentials and tokens.

**Flutter** — shared_preferences for sensitive data

Grep `pubspec.yaml` for `shared_preferences`. If present, grep Dart source for `prefs.setString(` with sensitive key names. Flag: use `flutter_secure_storage` for credentials.

**All stacks** — SQLite / local database without encryption

Grep for SQLite usage (`openDatabase(`, `SQLiteDatabase`, `Room.databaseBuilder(`) without encryption. For Flutter, grep for `sqflite` without `sqlcipher_flutter_libs`.

---

### Check 2 — Hardcoded Secrets and API Keys (M1)

Grep source files, config files, and any `.env.*` files committed to the repo for:

| Pattern | Severity |
|---|---|
| `API_KEY\s*[=:]\s*['"][A-Za-z0-9+/]{20,}['"]` | High |
| `SECRET\s*[=:]\s*['"][A-Za-z0-9+/]{16,}['"]` | High |
| `PRIVATE_KEY\s*[=:]\s*['"]-----BEGIN` | Critical |
| `aws_access_key_id\s*=\s*AKIA[A-Z0-9]{16}` | Critical |
| `sk-[A-Za-z0-9]{32,}` (OpenAI-style) | Critical |
| `github_token\|GITHUB_TOKEN\s*[=:]\s*['"]ghp_[A-Za-z0-9]{36}['"]` | Critical |
| `password\s*[=:]\s*['"][^'"]{8,}['"]` (outside test files) | Medium |

Exclude: `*.test.*`, `*.spec.*`, `__tests__/`, `__mocks__/`, `fixtures/`, `example*`.

Also check `.env`, `.env.local`, `.env.production` committed to the repo (not in `.gitignore`).

**Android** — `google-services.json` and `GoogleService-Info.plist` committed with non-restricted API keys.

**Flutter** — `lib/config.dart` or `lib/constants.dart` with hardcoded production keys.

---

### Check 3 — Debug Flags in Production (M8)

**React Native**

Grep for `__DEV__` guards around security-relevant behaviour (certificate pinning bypass, mock auth, verbose logging). Flag `__DEV__` guards on security controls.

Grep for Flipper included outside a debug-only block:
- Android: `implementation("com.facebook.flipper:flipper:...")` without `debug` prefix → flag
- iOS: `use_flipper!()` or `FlipperKit` without `#if DEBUG` guard → flag

**Native Android**

Grep for `BuildConfig.DEBUG` guards around security controls. Flag if security behaviour differs only in debug builds without a guard.

Grep `AndroidManifest.xml` for `android:debuggable="true"` in `<application>` — releases must not have this. AGP removes it on release builds, but explicit `true` overrides it.

**Native iOS**

Grep for `#if DEBUG` guards around security controls. Flag if certificate pinning or auth checks are disabled with a `DEBUG` guard.

**Flutter**

Grep for `kDebugMode` or `kReleaseMode` guards around security controls. Flag if certificate pinning is conditional on `kDebugMode`.

Grep `AndroidManifest.xml` and `Info.plist` for debug tooling (`flipper`, `reactflipper`, `instruments`) outside conditional compilation.

---

### Check 4 — Sensitive Data in Logs (M6)

**React Native / JavaScript**

Grep source files for `console.log`, `console.warn`, `console.error` calls that include variables named: `token`, `password`, `secret`, `key`, `auth`, `credential`, `email`, `phone`, `ssn`, `dob`, `card`.

**Native Android (Java/Kotlin)**

Grep for `Log.d(`, `Log.v(`, `Log.i(`, `Log.w(`, `Log.e(` with sensitive variable names in the same line. Also grep for `printStackTrace()` — stack traces can leak class names and logic.

**Native iOS (Objective-C/Swift)**

Grep for `NSLog(`, `print(`, `debugPrint(`, `os_log(` with sensitive variable names. Flag `os_log` with `.debug` or `.info` level for sensitive data — these levels are readable from the device without entitlements on development builds.

**Flutter**

Grep for `print(`, `debugPrint(`, `developer.log(` with sensitive variable names.

Severity: Medium (data appears in device logs and crash reporting tools in release builds unless explicitly stripped).

---

### Check 5 — Certificate Pinning (M5)

Check if any HTTP client is configured and whether pinning is present.

**React Native**: grep for `react-native-ssl-pinning`, `NativeModules.RNSslPinning`, or Okhttp `CertificatePinner` in Android native source.

**Flutter**: grep for `HttpClient`, `Dio`, or `http` package usage. Check for `badCertificateCallback` set to `(_, __, ___) => true` — disables all certificate validation; flag as Critical. Check for pinning via `SecurityContext` or a custom `HttpClient`.

**Native Android**: grep `android/` for `CertificatePinner.Builder(` (OkHttp) or `TrustManager` with custom `checkServerTrusted`. Flag `TrustManager` that returns without throwing — disables validation; Critical.

**Native iOS**: grep `ios/` for `URLSession(_:didReceive:completionHandler:)` challenge handler or `NSURLConnectionDelegate` `connection:canAuthenticateAgainstProtectionSpace:`. Flag if the handler always calls `completionHandler(.useCredential, ...)` unconditionally — bypasses pinning; Critical.

If network calls are present but no pinning config found: flag as Medium (informational — confirm at runtime; absence in source does not definitively confirm no pinning at the native level).

---

### Check 6 — Excessive Permissions (M8)

**Android: AndroidManifest.xml**

Read `android/app/src/main/AndroidManifest.xml` (or Flutter's equivalent at `android/app/src/main/AndroidManifest.xml`).

Flag the following permissions without a documented feature justification:

| Permission | Risk |
|---|---|
| `READ_CONTACTS` / `WRITE_CONTACTS` | High if no contacts feature |
| `ACCESS_FINE_LOCATION` | Medium — verify usage |
| `RECORD_AUDIO` | Medium — verify usage |
| `GET_ACCOUNTS` | High — rarely needed |
| `READ_PHONE_STATE` | High — rarely needed |
| `PROCESS_OUTGOING_CALLS` | High — rarely needed |
| `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE` | Medium — flag if `targetSdk ≥ 33` (should use scoped storage) |

Also flag `android:exported="true"` on `<activity>`, `<service>`, or `<receiver>` without an explicit `android:permission` attribute.

**iOS: Info.plist**

Glob `ios/*/Info.plist` (or Flutter's `ios/Runner/Info.plist`). For each `NS*UsageDescription` key, verify the value is a non-empty, non-placeholder string — an empty or `"TODO"` usage description causes App Store rejection.

---

### Check 7 — Binary Protections (M7)

**Android: ProGuard / R8**

Read `android/app/build.gradle`. Check:
- `minifyEnabled true` for release builds
- `shrinkResources true` for release builds
- A `proguardFiles` rule is specified

If `minifyEnabled false` for release: flag High.

**iOS: Bitcode / Symbol stripping**

Glob `ios/*.xcodeproj/project.pbxproj`. Check:
- `ENABLE_BITCODE = YES` for archive builds (iOS < 16 — improves binary protection; deprecated in Xcode 14+ for iOS 16+ targets)
- `STRIP_INSTALLED_PRODUCT = YES` for release builds
- `DEPLOYMENT_POSTPROCESSING = YES` for release builds

**Flutter**

Same Android ProGuard check applies. For iOS, same symbol-stripping check applies. Additionally: Flutter ships a split debug info file — confirm `--split-debug-info` is used in production builds (check CI scripts or `flutter build` commands in `Makefile`, `scripts/`, `fastlane/`, `.github/workflows/`).

---

## S3 — Report

Print the findings report:

```
Mobile Security Scan Results
Project: <projectPath>   Stack: <detected>   Platform: android + ios

CRITICAL (immediate action required)
  ✗  TrustManager disables certificate validation        M5   android/src/.../NetworkClient.kt:88
     checkServerTrusted() returns without throwing — all TLS validation bypassed

HIGH
  ✗  SharedPreferences stores auth token                 M9   app/src/AuthManager.kt:34
     putString("access_token", ...) — use EncryptedSharedPreferences or Keychain
  ✗  ProGuard disabled for release build                 M7   android/app/build.gradle:28
     minifyEnabled false in release block

MEDIUM
  ✗  NSLog exposes user email in logs                    M6   ios/App/AuthViewController.swift:67
     NSLog(@"Login: %@", email)
  ✗  Certificate pinning not found in source             M5   informational — confirm at runtime
  ✗  Hardcoded API key in config                         M1   lib/config.dart:12

LOW
  ✗  Flipper included in non-debug build                 M8   ios/Podfile:14
  ℹ  CAMERA permission present                           M8   AndroidManifest.xml — verify justified

MANUAL VERIFICATION REQUIRED
  • Certificate pinning: confirm at runtime with a proxy (e.g. mitmproxy, Charles)
  • Server-side log retention: verify crash reporting tools scrub PII before retention

Policy: OWASP Mobile Top 10 2024 (live / embedded fallback)
Findings: <n> (Critical: X, High: Y, Medium: Z, Low: W)
```

---

## S4 — Handoff

State total findings and top 3 priorities.

Recommend next steps:
- **`deep-link-auditor`** — if deep link security hasn't been audited (open-redirect findings overlap)
- **`rn-app-compliance`** — if store compliance hasn't been checked for a React Native project (ProGuard / permission findings overlap)
- Manual: test with a proxy (mitmproxy, Charles Proxy) to confirm certificate pinning is active at runtime

---

## Guardrails

- Strictly read-only on all project files. No writes.
- Never modifies code, manifests, or any source file.
- Does not make compliance determinations — reports evidence-backed findings for a practitioner to triage.
- Does not scan `node_modules/`, `build/`, `dist/`, `.git/`, `.dart_tool/`, or `Pods/`.
- Certificate pinning absence in source is flagged as informational, not a confirmed vulnerability — runtime verification required.
- Redacts any secret values found in findings output, showing only the first 4 characters + `...`.
- Keeps output generic — no customer names, internal codenames, or secrets.
