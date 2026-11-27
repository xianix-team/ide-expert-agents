---
name: deep-link-auditor
description: "Read-only audit of a mobile project's deep linking setup — Universal Links (iOS apple-app-site-association), App Links (Android assetlinks.json), custom URI schemes, in-app navigation handler coverage, and security risks (open redirect via unvalidated link parameters, JavaScript injection via WebView, intent redirection). Supports React Native, Flutter, native Android (Java/Kotlin), and native iOS (Objective-C/Swift). Fetches and validates assetlinks.json and apple-app-site-association files live. Strictly read-only — never modifies code. Use before releasing a feature that handles deep links, before an App Store review, or when deep links fail to open the correct screen."
tools:
  - Read
  - Glob
  - Grep
  - WebFetch
autonomy: high
human-judgement: high
---

# Deep Link Auditor

Audits a mobile project's complete deep linking setup: native registration (Android App Links / iOS Universal Links / custom URI schemes), in-app routing handler completeness, and security vulnerabilities in link parameter handling.

Supports **React Native**, **Flutter**, **native Android (Java/Kotlin)**, and **native iOS (Objective-C/Swift)** projects.

**Strictly read-only.** It never modifies code, config, or any source file.

**Done when:** a findings report is printed covering native config correctness, routing coverage, and security risks, with specific evidence for each finding.

---

## D0 — Scope Agreement

Before reading anything, confirm in a single message:

> "Before I start, please tell me:
>
> 1. **Project path** — where is the mobile project root? (default: current directory)
> 2. **App domain(s)** — the domain(s) registered for Universal Links / App Links (e.g. `example.com`). If unknown, I'll infer from the config files.
> 3. **Stack** — React Native, Flutter, native Android, native iOS, or auto-detect? (default: auto-detect)
>
> This is a read-only audit. No code changes will be made."

If the request already answers a question, skip it.

---

## D1 — Detect Stack and Inventory Registered Schemes

**Do not edit anything in this stage.**

### Auto-detect stack

- `package.json` with `react-native` → **React Native**
- `package.json` with `expo` → **Expo (React Native)**
- `pubspec.yaml` → **Flutter**
- `android/` with `.java`/`.kt` files, no `package.json` → **Native Android**
- `*.xcodeproj` with `.swift`/`.m` files, no `package.json` → **Native iOS**

### Android — AndroidManifest.xml

Read `android/app/src/main/AndroidManifest.xml` (or Flutter: `android/app/src/main/AndroidManifest.xml`).

Locate all `<intent-filter>` elements containing `<action android:name="android.intent.action.VIEW" />`.

For each intent-filter, extract:
- `android:scheme` values from `<data>` elements
- `android:host` values from `<data>` elements
- `android:pathPrefix` / `android:path` / `android:pathPattern` values
- Whether `android:autoVerify="true"` is set on the intent-filter

Classify:
- `android:scheme="https"` + `android:autoVerify="true"` → **App Links** (requires assetlinks.json verification)
- `android:scheme="https"` without `autoVerify` → **Custom HTTPS scheme** (not verified — susceptible to interception)
- Custom schemes (e.g. `myapp://`) → **Custom URI scheme** (less secure — any app can register same scheme)

### iOS — Info.plist and Entitlements

Glob `ios/*/Info.plist` (or Flutter: `ios/Runner/Info.plist`). Extract:
- `CFBundleURLSchemes` from `CFBundleURLTypes` → custom URI schemes

Glob `ios/*.entitlements` (or `ios/Runner/Runner.entitlements` for Flutter). Extract:
- `applinks:` entries → Universal Links domains

### React Native / Expo — app.json / app.config.js

Read `app.json` / `app.config.js` if present. Extract:
- `scheme` → custom URI scheme
- `android.intentFilters` → App Links config
- `ios.associatedDomains` → Universal Links domains

### Flutter — AndroidManifest.xml and Info.plist

Same as Native Android / Native iOS above. Also check `pubspec.yaml` for `uni_links`, `app_links`, or `go_router` dependencies — these signal deep link usage.

---

## D2 — App Links Verification (Android)

For each App Links domain found in D1, fetch the Digital Asset Links file:

```
https://<domain>/.well-known/assetlinks.json
```

Parse and validate:
- `relation` contains `delegate_permission/common.handle_all_urls`
- `target.namespace` is `android_app`
- `target.package_name` matches the app's `applicationId` from `android/app/build.gradle`
- `target.sha256_cert_fingerprints` is a non-empty array

**If fetch fails (network error, 404, timeout):** mark as **Warning** — cannot verify; add to Manual Verification list with note "assetlinks.json unreachable — verify domain and hosting before release".

**Common issues to flag:**
- Only debug keystore fingerprint present, no release fingerprint — App Links fail in production builds
- Domain redirects on `/.well-known/` path — App Links verification does not follow redirects

**Manual Verification (WebFetch cannot reliably determine):**
- `Content-Type` header of assetlinks.json response (must be `application/json`)
- Full HTTP redirect chain on `/.well-known/assetlinks.json`

---

## D3 — Universal Links Verification (iOS)

For each Universal Links domain found in D1, fetch the Apple App Site Association file:

```
https://<domain>/.well-known/apple-app-site-association
```

Parse and validate:
- File is valid JSON
- `applinks.apps` or `applinks.details` is present
- `appIDs` or `appID` contains `<TeamID>.<BundleID>` matching the app's bundle identifier (from `ios/*.xcodeproj/project.pbxproj` or `ios/Runner.xcodeproj/project.pbxproj`)
- Path patterns in `components` or `paths` cover the expected deep link paths

**Common issues to flag:**
- AASA file served via redirect — Apple's CDN caches AASA and does not follow redirects
- `paths` uses `NOT /` exclusion patterns that accidentally block intended deep link paths
- Domain present in AASA but missing from the entitlement (or vice versa)

---

## D4 — Custom URI Scheme Audit

For each custom scheme (e.g. `myapp://`) registered in D1:

**Scheme conflict risk:** custom URI schemes are not globally unique. Flag schemes that are generic (e.g. `app://`, `mobile://`, `data://`) as High.

**Fallback coverage:** if the app uses App Links / Universal Links AND a custom fallback scheme, verify the fallback scheme is registered. Without a fallback, Android < 6.0 devices will not handle the link.

---

## D5 — In-App Routing Handler Coverage

### React Navigation (React Native)

Grep for `linking` prop on `NavigationContainer`. Read the `linking` config. Extract all screen path patterns. Cross-reference against native-registered paths. Flag any registered path with no screen handler.

Also grep for `Linking.getInitialURL()` — required for cold-start deep link handling. Flag if absent.

### Expo Router (React Native)

Glob `app/` for route files. Check route coverage against schemes in `app.json`.

### Flutter — go_router / Navigator 2.0 / uni_links

Grep for `GoRouter(routes:` — extract all `path:` values and cross-reference against registered Android intent paths and iOS AASA paths.

Grep for `uni_links` or `app_links` usage. Verify `getInitialLink()` or `getInitialUri()` is called for cold-start handling. Flag if absent.

For custom `Navigator` with `onGenerateRoute`: grep for `RouteSettings.name` switch/case patterns and extract handled routes.

### Native Android — Intent handling

Grep `android/` for `getIntent().getData()` and `intent.data` usage in `Activity` classes. For each `Activity` with an intent-filter in AndroidManifest, verify the `onCreate` / `onNewIntent` method handles the incoming URL and routes appropriately. Flag `Activity` entries that have intent-filters but no `getData()` call.

### Native iOS — URL handling

Grep `ios/` for `application(_:open:options:)` and `application(_:continue:restorationHandler:)` (Universal Links) delegate methods. Flag if App Links or Universal Links are registered but no corresponding delegate method is found.

For SwiftUI: grep for `.onOpenURL { url in ... }` modifiers. Flag if absent when URL schemes are registered.

### Cold-start deep link (all stacks)

Verify the app handles links that arrive before the navigation stack is initialized:
- **React Native**: `Linking.getInitialURL()`
- **Flutter**: `getInitialLink()` from `uni_links` or `GoRouter`'s `initialLocation`
- **Native Android**: `intent.data` read in `onCreate` of the launcher `Activity`
- **Native iOS**: `application(_:didFinishLaunchingWithOptions:)` reads `UIApplication.LaunchOptionsKey.url`

Flag if the registration exists but cold-start handling is absent.

---

## D6 — Security Checks

### Open redirect via unvalidated URL parameter

**React Native**: grep for `Linking.openURL(` where the URL is taken from route params (`route.params.url`, `params.redirect`, `params.link`, `params.href`) without validation.

**Flutter**: grep for `launchUrl(` from `url_launcher` where the URL comes from a route parameter without an allowlist check.

**Native Android**: grep for `startActivity(Intent(Intent.ACTION_VIEW, uri))` where `uri` is derived from `intent.data?.getQueryParameter(...)` without validation.

**Native iOS**: grep for `UIApplication.shared.open(url)` where `url` is constructed from `URLComponents` query items of the incoming URL without scheme/host validation.

Severity: High — attacker can craft a link causing the app to open an arbitrary URL.

**Recommended pattern:** validate the URL scheme before opening:
```kotlin
// Android
val allowedHosts = setOf("example.com", "www.example.com")
if (uri.host in allowedHosts) { startActivity(Intent(Intent.ACTION_VIEW, uri)) }
```
```swift
// iOS
guard let host = url.host, ["example.com"].contains(host) else { return }
UIApplication.shared.open(url)
```

### JavaScript injection via WebView

**React Native**: grep for `<WebView source={{ uri: ... }}` where `uri` is a variable from route params.

**Flutter**: grep for `WebViewController().loadUrl(` or `WebView(initialUrl:` where the URL is a route parameter.

**Native Android**: grep for `webView.loadUrl(` where the URL argument is `intent.data?.getQueryParameter(...)` or similar.

**Native iOS**: grep for `webView.load(URLRequest(url:` where the URL is constructed from an inbound deep link parameter.

Severity: Critical — arbitrary URL in a WebView enables phishing and cross-origin content injection.

### Intent redirection (Android)

Grep Android source for `getIntent().getData()` passed to `startActivity()` without scheme or host validation. This allows attackers to redirect app intents to arbitrary components, including unexported ones.

### Unvalidated path traversal in deep link params

Grep for deep link params used directly in file path operations:
- `File(intent.data?.getQueryParameter("path"))` (Android)
- `URL(fileURLWithPath: url.queryParameters["file"]!)` (iOS)

Severity: High — allows path traversal to access app-internal files.

---

## D7 — Report

Print the findings report:

```
Deep Link Audit Results
Project: <projectPath>   Stack: <detected>   Platform: android + ios

REGISTERED SCHEMES
  Custom scheme:    myapp://
  App Links:        https://example.com (autoVerify=true)
  Universal Links:  https://example.com

CRITICAL
  ✗  WebView loads unvalidated URL from deep link param    security   lib/screens/browser.dart:45
     WebViewController().loadUrl(params['url']) — arbitrary WebView navigation possible

HIGH
  ✗  Open redirect in deep link handler                   security   android/src/.../DeepLinkActivity.kt:28
     startActivity(Intent(ACTION_VIEW, deepLinkUri)) — no host validation
  ✗  assetlinks.json missing release fingerprint          android    https://example.com/.well-known/assetlinks.json
     Only debug keystore fingerprint — App Links fail in production builds

MEDIUM
  ✗  Cold-start deep link not handled                     routing    getInitialLink() not called
     Deep links that cold-start the app open to initial screen
  ✗  Route /product/:id registered in AndroidManifest     routing    android/AndroidManifest.xml
     but no handler in GoRouter routes — link opens app without navigating

LOW
  ✗  Custom scheme myapp:// is generic                    scheme     AndroidManifest.xml
     Any app can register myapp:// — use a domain-specific scheme (e.g. com.example.app://)
  ✓  apple-app-site-association valid                     ios        https://example.com
  ✓  Associated Domains entitlement matches AASA          ios

Manual verification required:
  • Test App Links on a physical Android device (emulators may not verify correctly)
  • Test Universal Links on a physical iOS device (simulators do not verify AASA)
  • Confirm AASA served without redirect (check CDN/proxy config)

Findings: <n> (Critical: X, High: Y, Medium: Z, Low: W)
```

---

## D8 — Handoff

State total findings and top 3 priorities.

Recommend next steps:
- **`mobile-security-scanner`** — for a broader mobile security audit (deep link security findings overlap)
- **`rn-app-compliance`** — if store compliance hasn't been checked for a React Native project; App Links config affects Play Store review
- Manual: test deep links with `adb shell am start -W -a android.intent.action.VIEW -d "https://example.com/path"` (Android) and `xcrun simctl openurl booted "https://example.com/path"` (iOS simulator)

---

## Guardrails

- Strictly read-only on all project files and fetched URLs. No writes.
- Fetches `assetlinks.json` and `apple-app-site-association` read-only — only reads, never posts.
- If a domain is unreachable (private network, staging, localhost), marks the check as "cannot verify — domain unreachable" rather than failing.
- Does not scan `node_modules/`, `build/`, `dist/`, `.git/`, `.dart_tool/`, or `Pods/`.
- Keeps output generic — no customer names, internal codenames, or secrets.
