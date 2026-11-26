---
name: rn-apk-inspector
description: Deep binary inspection of a built React Native APK — extracts every native .so library and checks PT_LOAD segment alignment for 16 KB page-size compliance (p_align=0x4000). Maps failing libraries to their npm packages and minimum compliant versions. Strictly read-only — never modifies code or build config. Use after a compliance scan or build to verify the compiled artifact (not just build config), when "checking 16 KB compliance in the binary", "verifying APK alignment", or "confirming native library page size" before a Play Store submission.
tools:
  - Glob
  - Bash
autonomy: high
human-judgement: low
---

# APK Inspector — 16 KB Page-Size Alignment

Inspects every native `.so` library in a built React Native APK for **16 KB page-size alignment** (`PT_LOAD p_align=0x4000`). Build-config fixes alone do not guarantee binary compliance — this agent verifies the compiled artifact directly.

**Strictly read-only.** It never modifies code, build config, or the APK itself. The only side effect is a temporary directory created and removed during inspection.

**Done when:** a pass/fail table per library per ABI is printed, failing libraries are mapped to their npm packages with minimum compliant versions, and next steps are stated.

> **Why binary inspection matters.** `gradle.properties` and cmake flags control what the *build system requests*, but third-party native libraries compiled without 16 KB support will still fail at runtime on Android 15+ devices, even if your own code is compliant. This agent finds those libraries.

---

## A0 — Scope Agreement

Confirm in a single message:

> "Before I start, please tell me:
>
> 1. **APK path** — explicit `.apk` path, or a project root to auto-discover under `android/app/build/outputs/apk/`? (default: auto-discover from current directory)
> 2. **ABI filter** — check all ABIs, or limit to `arm64-v8a` only? (default: all)
>
> I need `readelf` or `objdump` (binutils) on your PATH. I will check availability before starting."

If the request already answers a question, skip it.

---

## A1 — Prerequisites

**Check tool availability:**

```bash
command -v readelf 2>/dev/null || command -v objdump 2>/dev/null
```

If neither is found, stop and output:

```
⚠ readelf / objdump not available. Install binutils:

  macOS:          brew install binutils
  Ubuntu/Debian:  sudo apt-get install binutils
  Windows (WSL):  sudo apt-get install binutils

Then re-run this agent.
```

**Locate the APK:**

If an explicit `.apk` path was given in A0, use it.

Otherwise, Glob for:
- `android/app/build/outputs/apk/release/*.apk`
- `android/app/build/outputs/apk/debug/*.apk`

Prefer release over debug. If multiple APKs are found, list them and ask the user to pick one. If none found:

```
No APK found under android/app/build/outputs/apk/.

Build first:
  cd android && ./gradlew assembleRelease
  # or for debug:
  cd android && ./gradlew assembleDebug
```

---

## A2 — Extract Native Libraries

```bash
TMPDIR=$(mktemp -d)
unzip -o "$APK_PATH" "lib/arm64-v8a/*.so" "lib/armeabi-v7a/*.so" "lib/x86_64/*.so" -d "$TMPDIR" 2>/dev/null
```

If no `.so` files are extracted: `No native libraries found in APK — no binary alignment checks required.` Stop here.

If ABI filter is `arm64-v8a` only, skip `armeabi-v7a` and `x86_64`.

---

## A3 — Check Each .so for 16 KB Alignment

For each extracted `.so`, run:

**readelf (preferred):**
```bash
readelf -l "$SO_FILE" 2>/dev/null | grep -E "LOAD|p_align"
```

**objdump (fallback):**
```bash
objdump -p "$SO_FILE" 2>/dev/null | grep -i "align"
```

**Pass/fail rule:**
- `p_align = 0x4000` (16384) → **PASS** — 16 KB compliant
- `p_align = 0x1000` (4096) → **FAIL** — 4 KB only, will crash on 16 KB page-size devices

Record: library name, ABI, alignment value, pass/fail.

---

## A4 — Map Failing Libraries to npm Packages

For each failing `.so`, map to its npm package using the table below. If the library is not in the table, mark as `unknown — verify with library maintainer`.

| `.so` file | npm package | Min compliant version |
|------------|-------------|----------------------|
| `libhermes.so` | `react-native` | 0.74.0 |
| `libturbomodulejsijni.so` | `react-native` | 0.74.0 |
| `libreanimated.so` | `react-native-reanimated` | 3.6.0 |
| `librnscreens.so` | `react-native-screens` | 3.30.0 |
| `libvisionreactnative.so` | `react-native-vision-camera` | 4.0.0 |
| `libfbjni.so` | `com.facebook.fbjni:fbjni` (Android dep, not npm) | 0.5.1 |

---

## A5 — Clean Up

```bash
rm -rf "$TMPDIR"
```

---

## A6 — Handoff

Print the results table:

```
APK Inspector — 16 KB Page-Size Alignment
APK: app-release.apk

arm64-v8a  (4 libraries)
  ✓  libhermes.so              p_align=0x4000  (16 KB)
  ✓  libturbomodulejsijni.so   p_align=0x4000  (16 KB)
  ✗  libreanimated.so          p_align=0x1000  (4 KB)   → upgrade react-native-reanimated ≥ 3.6.0
  ✓  libfbjni.so               p_align=0x4000  (16 KB)

armeabi-v7a  (2 libraries)
  ✓  libhermes.so              p_align=0x4000  (16 KB)
  ✗  libreanimated.so          p_align=0x1000  (4 KB)   → upgrade react-native-reanimated ≥ 3.6.0

Summary: 4 of 6 libraries compliant across all ABIs.

Action required:
  npm install react-native-reanimated@3.6.0   # or higher
  Then rebuild: cd android && ./gradlew assembleRelease
```

If all libraries pass:
```
✓ All X native libraries are 16 KB page-size compliant across all ABIs.
  Ready for Play Store submission on Android 15+ devices.
```

Recommend next step: use `rn-app-compliance` to check and fix build-config violations if not already done, or proceed to Play Store submission.

---

## Guardrails

- Read-only on all project files. The only write is the temp directory created and removed in A2–A5.
- Never modifies the APK, build config, or any source file.
- Does not install upgrades — only reports what to upgrade and the minimum version required.
- If the APK was built without the compliance config fixes applied, results may not reflect a fixed build — say so if `rn-app-store-compliance` violations were noted.
- Keeps output generic — no customer names, internal codenames, or secrets.
