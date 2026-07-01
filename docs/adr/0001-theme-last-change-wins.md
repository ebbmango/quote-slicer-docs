# 1. Theme resolution: last change wins, persisted across close

Date: 2026-07-01

## Status

Accepted. Supersedes the revert-on-close model described in
`quote-slicer/plans/theme-system.md`.

## Context

Both `quote-slicer-docs` (the reference implementation) and the `quote-slicer`
app shipped an identical theme controller: ~530 lines across `themeState.ts` and
`systemTheme.ts`, plus an inline prepaint registry in `app.html`.

Its behaviour treated a manual light/dark pick as session-scoped. A tab registry
(30s heartbeats, staleness pruning) tracked open tabs; once all tabs closed past
a 5-minute reload-grace window, the next visit discarded the pick and reverted
to the OS preference. Cross-tab sync used `BroadcastChannel` with a
request/reply handshake.

No rationale for the revert-on-close behaviour was ever recorded. The app plan
asserted it as intent ("no persistent manual override that survives closing all
tabs") but gave no reason — no shared-computer, kiosk, or privacy motivation.
The docs site's diary entry documenting the system left the tab-sync section
unwritten. The stated UX everywhere else was simply "the theme is determined by
the most recent change," which revert-on-close contradicts.

## Decision

Adopt "last change wins", persisted across full close, for both codebases:

- On load, follow the OS preference on a first visit.
- A manual pick (or an adopted OS mode) is stored in `localStorage` and
  **persists across reloads and full closes**.
- The only thing that overrides a stored pick while the app is away is the OS
  preference itself changing — a genuinely later change — detected by comparing
  the OS mode now against `osAtPick`, the OS mode recorded when the pick was
  written (`resolveTheme`).
- A live OS change while a tab is open wins (most recent change).
- Cross-tab sync uses the native `storage` event; a new tab reads `localStorage`
  on load. No `BroadcastChannel`, tab registry, heartbeat, or grace window.

Storage schema is bumped to `:v2` (`{ version, mode, source, osAtPick }`). The
v1 keys are abandoned; a stale v1 value fails validation and is treated as a
first visit.

## Consequences

- ~530 lines of registry/heartbeat/grace/`BroadcastChannel` machinery deleted
  per repo (net −626 lines in `quote-slicer-docs`).
- **Removed behaviour:** closing all tabs no longer resets the theme to the OS
  default. A user who picks dark keeps dark until they change it or the OS does.
- Shared/public-computer users no longer get a fresh-session reset. If that ever
  becomes a real requirement, reintroduce it deliberately with a recorded
  rationale — not as a side effect of a tab registry.
- The prepaint script in `app.html` duplicates the `resolveTheme` rule (it runs
  before hydration and cannot import); the two are marked to stay in sync.
- The app keeps its `flashThemeTransition` (`html.theme-anim`) flip animation,
  which is independent of theme resolution.
