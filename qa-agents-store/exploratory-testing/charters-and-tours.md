# Charters, Tours, Heuristics & Oracles

The scaffolding that makes exploration systematic instead of random. Use a charter to
bound a session, tours and heuristics to traverse and probe, and oracles to recognize when
something is a bug.

## Contents
1. Charters
2. Session structure & time-boxing
3. Tours
4. Coverage & input heuristics
5. Oracles (recognizing a bug)
6. Session notes format

---

## 1. Charters

A charter is a one-line mission for one session. Keep it focused — broad enough to explore,
narrow enough to bound. ALWAYS use this template:

> Explore **(target)** using **(resources / tours / data)** to discover **(what info)**.

**Examples:**
- Explore the **signup form** using **boundary and junk data** to discover **how
  validation and error messaging behave**.
- Explore **checkout** using the **money tour** to discover **where totals, taxes, and
  discounts can be made wrong**.
- Explore the **dashboard** using **keyboard only** to discover **accessibility barriers**.

One charter per session. When you spot an unrelated thread worth pursuing, write it down as
a *new charter* (step 6 of the report) rather than chasing it now — that keeps the current
session coherent.

---

## 2. Session structure & time-boxing

Borrowed from Session-Based Test Management (SBTM):

1. **Time-box** the session — 30–60 minutes of focused activity is typical. A box forces
   prioritization and makes coverage reportable.
2. Split effort, roughly: setup → exploration → bug investigation. Heavy bug investigation
   in one session is fine, but note it — it means less area got covered.
3. **One session = one charter = one report.** Keep them 1:1 so findings trace back to a
   mission.
4. Debrief at the end (the report). The debrief is where observations become bugs,
   questions, and new charters.

---

## 3. Tours

A tour is a themed way to traverse the app, so coverage is structured rather than
wandering. Whittaker's touring heuristics, adapted for web apps:

| Tour | Mission |
|------|---------|
| **Money tour** | Walk the features that make money / are core to the product. The most business-critical paths. |
| **Landmark tour** | Hit the major features ("landmarks") in varying order — exercises navigation and state between them. |
| **Back-alley tour** | Deliberately visit the least-used, most-obscure features — where bugs hide because few go there. |
| **Garbage-collector tour** | Go corner to corner methodically (every menu item, every settings toggle) for completeness. |
| **Obsessive-compulsive tour** | Repeat actions, submit twice, undo/redo, re-enter the same data — stress state handling. |
| **Configuration tour** | Vary settings, locales, roles, viewports — surface config-dependent behavior. |
| **Interruption tour** | Start a flow then interrupt it — back button, refresh, logout, network drop, close tab — and resume. |

Pick the tour that fits the charter. The back-alley and interruption tours tend to find the
most because scripted suites rarely go there.

### Tours for common cross-cutting concerns

Reach for these when the app has roles, tenants/contexts, or multiple languages — they aim
at where those defects cluster.

| Tour | Mission |
|------|---------|
| **Role tour** | Walk the same pages as each role / permission level. Hunt visible-but-forbidden, forbidden-but-working, and inconsistent hide-vs-disable. |
| **Context-switch tour** | If the app has multiple contexts (accounts, workspaces, portals), hop between them repeatedly and in varying order. Hunt context loss (wrong context after a switch), broken back-navigation, and auth-state surprises. |
| **Tenant-isolation tour** | For multi-tenant apps, run the same action across two tenants side by side — unexplained behavioral differences are findings. Probe isolation: edit tenant/entity IDs in URLs and API calls; can one tenant see another's data? |
| **i18n tour** | Hunt raw i18n keys rendered as text (e.g. `common.actions.add`), dates/numbers/currency in the wrong locale format, mixed languages on one screen, and untranslated strings. |

---

## 4. Coverage & input heuristics

Mnemonics that prompt you to look where you'd otherwise forget.

**SFDPOT** (San Francisco Depot) — dimensions to cover:
- **Structure** — what the app is made of (pages, components, files).
- **Function** — what it does (each feature and its behavior).
- **Data** — what it processes (inputs, outputs, stored state, edge values).
- **Platform** — what it depends on (browser, OS, device, screen size, network).
- **Operations** — how it's used in practice (real workflows, user roles).
- **Time** — anything time-related (sequence, concurrency, timeouts, time zones, stale data).

**Goldilocks** — for any input, try too big, too small, and just right (then just-outside
each boundary).

**CRUD** — for any data entity, exercise Create, Read, Update, Delete and the interactions
between them (delete then read, update then read in another tab).

---

## 5. Oracles (recognizing a bug)

An oracle is how you decide "that's wrong." Without one, you're just clicking. **HICCUPPS**
— a result is suspect if it's inconsistent with any of:

- **History** — past behavior of the product.
- **Image** — the brand/professional image the product should project.
- **Comparable products** — how similar apps behave.
- **Claims** — what docs, specs, marketing, or a design spec say it does.
- **User expectations** — what a reasonable user would expect.
- **Product** — itself: one part behaving unlike an equivalent part.
- **Purpose** — its intended use; does it actually serve the goal.
- **Standards** — relevant standards (e.g. WCAG for accessibility, platform conventions).

When something trips one of these, you've likely found a bug or a question worth raising.

---

## 6. Session notes format

Capture during the session, not from memory afterward. A simple running log:

```
CHARTER: <the mission>
LENS: functional | accessibility | usability
TIME: <start> – <end>

OBSERVATIONS
- <what I did> → <what I saw>           (the trail, including non-bugs)
- ...

BUGS
- [severity] <title>
  Repro: <steps>
  Expected: <...>   Actual: <...>   Evidence: <path>

QUESTIONS
- <thing I couldn't judge / needs spec or human>

NEW CHARTERS
- <thread worth a future session>
```

This log feeds straight into the Exploratory Session Report structure in the agent body above.
