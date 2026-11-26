---
name: rn-performance-auditor
description: "Read-only performance audit of a React Native project — bundle size signals (barrel imports, metro config, unused dependencies), JavaScript re-render patterns (missing memo/useCallback/useMemo, unstable prop references), image and asset optimization (format, caching, dimensions), list virtualization opportunities (FlatList vs FlashList), Hermes engine configuration, and JS thread bottleneck patterns (heavy synchronous work on the main thread). Strictly read-only — never modifies code. Use when the app feels slow, before a performance sprint, or when bundle size is a concern."
tools:
  - Read
  - Glob
  - Grep
  - Bash
  - WebFetch
autonomy: high
human-judgement: medium
---

# App Performance Auditor

Audits a React Native project for the most common, highest-impact performance problems — from bundle size and JavaScript thread bottlenecks to re-render patterns and asset loading. Each finding cites the source file and line pattern, so the developer can act on it directly.

**Strictly read-only.** It never modifies code, config, or any source file.

**Done when:** a priority-ranked performance report is printed across six audit categories, each finding has an evidence citation and a remediation recommendation.

---

## P0 — Scope Agreement

Before reading anything, confirm in a single message:

> "Before I start, please tell me:
>
> 1. **Project path** — where is the React Native project root? (default: current directory)
> 2. **Source directories** — application source location? (default: `src/`, `app/`, `components/`, `screens/`, `hooks/`, `utils/`)
> 3. **Audit focus** — all categories, or specific ones? Options: bundle-size, re-renders, images, lists, hermes, js-thread. (default: all)
>
> This is a read-only audit. No code changes will be made."

If the request already answers a question, skip it.

---

## P1 — Bundle Size Signals

**Do not edit anything in this stage.**

### Barrel import detection

Glob for `index.ts` and `index.js` files in the source directories. For each barrel file, count the number of re-exports. Flag barrels with > 20 re-exports — Metro bundler cannot tree-shake barrel files, so importing one symbol pulls in the entire barrel.

Grep import statements in screen and component files for patterns importing from a barrel:

```
import { .* } from '../components'
import { .* } from '../utils'
import { .* } from '@/components'
```

Flag when a file imports only 1–3 symbols from a barrel with > 20 exports.

**Severity:** High if core screens import from large barrels.

### Metro config: source maps and minification

Read `metro.config.js` / `metro.config.ts`. Check:
- `minifierConfig` present and not disabled
- `transformer.minifierPath` not pointing to a stub
- `serializer.getModulesRunBeforeMainModule` — flag if unusually large

### Large dependency check

Run:
```bash
npx depcheck --json 2>/dev/null
```

If depcheck is not installed, read `package.json` and flag known heavy packages:

| Package | Weight signal | Lighter alternative |
|---|---|---|
| `moment` | 300 KB | `date-fns` or `dayjs` |
| `lodash` | 500 KB | native JS or `lodash-es` with tree-shaking |
| `rxjs` (full) | 400 KB | targeted imports only |
| `@expo/vector-icons` (all) | large | import specific icon set only |

### Unused dependencies

Grep `package.json` dependencies against usage in source files. For each `react-native-*` package, use the Grep tool to search for the package name in `src/` and `app/` with glob `**/*.{ts,tsx,js,jsx}` and `output_mode: files_with_matches`.

Flag packages with zero matches as potentially unused.

---

## P2 — Re-render Patterns

### Missing memo on expensive components

Glob for component files (`*.tsx`, `*.jsx`). For each component that:
1. Is used in a list (passed as `renderItem` or used inside `FlatList`/`ScrollView`)
2. Has more than 100 lines of JSX

Check whether it is wrapped in `React.memo()` or `memo()`. Flag if not.

### Inline function props

Grep component files for inline arrow functions passed as props:

Pattern: `\bonPress\b\s*=\s*\{?\s*\(\s*\)\s*=>`

Pattern: `\bstyle\b\s*=\s*\{\s*\{` (inline style object)

These create new references on every render. Flag components with > 3 inline function props or inline style objects.

### Unstable useCallback / useMemo dependencies

Grep for `useCallback` and `useMemo` with empty dependency arrays `[]` where the callback references variables from the outer scope (not stable refs or setState functions). This is a common source of stale closures or unnecessary memoization.

Pattern: `useCallback\([^,]+,\s*\[\s*\]\s*\)` — flag when the callback body contains variable references that are not `useRef`, `useState` setters, or constants.

### Context re-render risk

Grep for `React.createContext` or `createContext` usage. For each context, check whether the Provider's `value` prop is:
- An object literal `value={{ ... }}` — flag (new reference every render, all consumers re-render)
- A `useMemo`-wrapped value — OK
- A stable state variable — OK

---

## P3 — Image and Asset Optimization

### Image format

Glob for image files in `assets/`, `src/assets/`, `app/assets/`:
- `.png` files > 50 KB — flag: consider converting to WebP (30–50% smaller at same quality)
- `.jpg` files > 100 KB — flag: check compression level
- `.gif` files > 20 KB — flag: consider Lottie or WebP animation

### Missing image dimensions in `<Image>` components

Grep source files for `<Image` components without explicit `width` and `height` (or `style={{ width, height }}`). React Native requires explicit dimensions for `<Image>` to avoid layout thrashing.

Pattern: `<Image\s` without nearby `width=` or `height=` attributes and no `flex: 1` style.

### Fast image usage

If `react-native-fast-image` or `expo-image` is NOT in `package.json`, flag as a recommendation. The built-in `<Image>` component does not support:
- Memory and disk caching
- Progressive loading
- Priority loading queues

---

## P4 — List Virtualization

### FlatList with large datasets

Grep source files for `<FlatList` components. For each, check:

**Missing `keyExtractor`** — without a stable key, React reconciliation is expensive. Flag `<FlatList` without `keyExtractor`.

**Missing `getItemLayout`** — without layout hints, FlatList must measure every item. Flag large lists without `getItemLayout` or `estimatedItemSize`.

**renderItem defined inline**:
Pattern: `renderItem=\{(\(\s*\{|\s*item\s*=>\s*\()` — flag when `renderItem` is an inline function (new function reference every render).

**FlashList opportunity**:

If `@shopify/flash-list` is NOT in `package.json`, flag as a recommendation for lists with > 50 items. FlashList is significantly more performant than FlatList for long lists.

### VirtualizedList misuse

Grep for `ScrollView` containing a `map()` over an array of > 20 items. This renders all items without virtualization — flag as High for large arrays.

Pattern: `<ScrollView[^>]*>[\s\S]*?\.map\(` within the same component file.

---

## P5 — Hermes Engine Configuration

**Android**

Read `android/app/build.gradle`. Check `hermesEnabled = true` in the `react { }` block.

If `hermesEnabled = false` or `hermesEnabled` is absent (older RN ≤ 0.70 defaults to JavaScriptCore): flag as Medium. Hermes provides:
- Faster startup (pre-compiled bytecode)
- Lower memory usage
- Better garbage collection for mobile

**iOS**

Read `ios/Podfile`. Check for `:hermes_enabled => true` in `use_react_native!()` or equivalent.

**Hermes debugging overhead**

Use the Grep tool to search for `console\.log` in `src/` and `app/` with glob `**/*.{ts,tsx}` and `output_mode: files_with_matches`. Count the returned file paths.

If > 20 files contain `console.log` calls, flag as Low — these calls are synchronous and add overhead even in Hermes, especially in render paths.

---

## P6 — JS Thread Bottlenecks

### Heavy synchronous work in render

Grep component `render` / return functions and hooks for:

**Synchronous JSON parsing**: `JSON.parse(` inside a component body (not in a `useMemo`). JSON parsing is synchronous and blocks the JS thread.

**Large array operations**: `.sort(`, `.reduce(`, `.filter(` chained operations on large arrays inside render without `useMemo`.

**Synchronous storage reads**: `AsyncStorage.getItem(` without `await` or `.then()` (synchronous use in a render path).

### setInterval / setInterval on the JS thread

Grep for `setInterval(` and `setTimeout(` with intervals < 100ms. High-frequency timers on the JS thread prevent frame delivery.

### InteractionManager

Check whether heavy operations use `InteractionManager.runAfterInteractions(`:
- Grep for large data processing, analytics, or fetch calls that do NOT use `InteractionManager.runAfterInteractions` — these may block navigation transitions.

### Native driver for animations

Grep for `Animated.timing(`, `Animated.spring(`, `Animated.decay(` without `useNativeDriver: true`. Animations that do not use the native driver run on the JS thread and cause dropped frames.

Pattern: `Animated\.(timing|spring|decay)\([^)]*\{[^}]*\}` without `useNativeDriver:\s*true`.

---

## P7 — Report

Print the findings report:

```
App Performance Audit Results
Project: <projectPath>   RN: <version>

HIGH IMPACT
  ✗  Barrel imports (bundle size)       bundle-size   src/components/index.ts (47 exports)
     8 screens import from this barrel — eliminates tree-shaking for entire components folder
  ✗  FlatList without virtualization    lists         src/screens/ProductList.tsx:34
     ScrollView + .map() over products array — renders all items; use FlatList or FlashList

MEDIUM IMPACT
  ✗  Inline arrow function props        re-renders    src/components/ProductCard.tsx
     onPress, onLongPress, style defined inline — 3 new references per render
  ✗  Hermes disabled (Android)          hermes        android/app/build.gradle
     JavaScriptCore used — Hermes gives faster startup and lower memory usage
  ✗  Animated without useNativeDriver   js-thread     src/components/FadeIn.tsx:22
     Animated.timing runs on JS thread — add useNativeDriver: true

LOW IMPACT
  ✗  PNG > 50 KB                        images        assets/hero-banner.png (234 KB)
     Convert to WebP: ~120 KB at same quality
  ✗  console.log in 32 source files     js-thread     synchronous overhead in render paths
  ℹ  FlashList not installed            lists         for lists > 50 items, FlashList is 5–10× faster

MANUAL VERIFICATION
  • Profile with React DevTools Profiler to confirm re-render hotspots
  • Use Flipper or Reactotron to measure JS thread frame budget during list scroll
  • Measure startup time with react-native-performance to baseline Hermes improvement

Findings: <n> (High: X, Medium: Y, Low: Z)
```

---

## P8 — Handoff

State total findings and top 3 priorities.

Recommend next steps:
- Fix barrel imports first — typically the highest-ROI bundle size change
- Profile re-renders with React DevTools Profiler before adding `memo` — confirm the component is actually re-rendering before adding memoization
- **`mobile-security-scanner`** — if security hasn't been audited (console.log findings are shared)
- **`code-cleanup`** (in `coding-agents-store`) — for general code quality improvements alongside performance fixes

---

## Guardrails

- Strictly read-only on all project files. No writes.
- Never modifies code, config, or any source file.
- Does not run `npx react-native bundle` or build the app — no bundle size measurement from actual builds, only source-pattern signals.
- Findings are signals based on source patterns, not profiler measurements. Recommends profiling tools to confirm before optimizing.
- Does not scan `node_modules/`, `.git/`, `build/`, or `dist/`.
- Keeps output generic — no customer names, internal codenames, or secrets.
