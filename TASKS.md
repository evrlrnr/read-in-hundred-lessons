# Task Breakdown — H (high-level) vs L (delegate)

Split rule: **L = mechanical, contract-specified, machine-verifiable. H = requires
pedagogical judgment, design taste, or resolving ambiguity in the spec.**

Sequencing rule (from AGENTS.md): **one milestone per task/PR.** Phases run in
order. An L task may only start once its H spec artifact exists.

Legend: 🔴 H (needs me/a strong model) · 🟢 L (safe to hand off)

---

## Phase A — M3 Orthography ✅ DONE (2026-10-14)

### H-A1 · Pin the orthography rendering contract 🔴 ✅
Resolved: macron = drawn `::after` bar (not `text-decoration: overline`); arc = SVG
path under the team; guide dot = one per sound unit; guide shown on blend tasks only.
Recorded in loop-knowledge.md (Run 4).

### H-A2 · Close the validator content-coverage gap 🔴 ✅
Implemented as non-fatal `validateWarnings` (planned sounds + reserve words) rather
than hard errors, so incremental authoring isn't broken. 3 new tests.

### H-A3 · Review delegated content for originality 🔴 ✅ (n/a this milestone)
Only new content was the `sh` sound + `ship` word — both trivially original. The
review gate applies from M6 bulk authoring onward.

### L-A1 · Implement `<DecodableWord>` 🟢 ✅
`src/components/DecodableWord.tsx`. SSR smoke test confirmed structure for every
grapheme type. Blend tasks pass `showGuide`.

### L-A2 · Build `/dev/ortho` visual test page 🟢 ✅
`src/components/OrthoTestPage.tsx`, reachable at `/dev/ortho` and `#/dev/ortho`.
Renders every word + isolated feature types + blend guide.

### L-A3 · Add a team sound + test word to content 🟢 ✅
Added `sh` (lesson 17) + `ship`. Validator warns (expected) but passes.
⚠ Pixel-level visual check (arc/macron/dots) still needs a human glance at
`/dev/ortho` — see loop-knowledge.md Run 4.

---

## Phase B — M4 Progress ✅ DONE (2026-10-14)

### H-B1 · Specify the deck algorithm as numbered rules 🔴 ✅
§6 rule 3 — "missed/seen ≥ 0.5 over its last 4 practice exposures" — is ambiguous
when `seen < 4`. loop-knowledge.md flags hand-waved scheduling logic as a
recurring weakness. Force it into numbered deterministic rules + 3 scripted
scenarios with expected card lists.
Done-check: 3 scenarios with exact expected output, written down.
Spec: `DECK_ALGORITHM.md` — numbered rules, `seen<4` resolved as a data-sufficiency
gate (keeps v1 schema), seeded mulberry32 shuffle, 3 scenarios with exact outputs.

### H-B2 · Pin progress schema + migration policy 🔴 ✅
v1 exists as a stub. Decide: validation rules on import, id generation,
what `version` bumping triggers, behavior on corrupt localStorage.
Done-check: schema + migration contract documented (plan §7).
Resolved in `src/lib/progress.ts`: `validateProgress` (import rules), `newId`
(prefix + time + random), `migrate` (version-gated, v1 current), corrupt/invalid
stored data falls back to a fresh empty state.

### L-B1 · Implement progress store module 🟢 ✅
Input: H-B2. Pure TS, no UI.
Done-check: round-trip test — export → wipe → import restores state exactly.
`src/lib/progress.ts` + `src/hooks/useProgress.ts`. Round-trip test passes.

### L-B2 · Home screen: profile picker + add/rename/delete 🟢 ✅
Done-check: profiles persist across reload.
`src/components/ProfileHome.tsx`. Persists via `useProgress` (localStorage).

### L-B3 · Export / import UI 🟢 ✅
Input: H-B2. Replace-all vs add-as-new-profiles, no field merging.
Done-check: manual round-trip on a real device viewport.
`src/components/Settings.tsx` — dated JSON download; file picker with dry
validation, then Replace-all / Add-as-new-profiles.

### L-B4 · Wire ⚑ flag-for-review into the lesson player 🟢 ✅
Done-check: flags survive reload and appear in practice deck input.
`src/components/LessonPlayer.tsx` — flag button on every sound + word; toggles
persist to the profile. Complete screen offers "repeat lesson" when ≥2 flagged.

---

## Phase C — M5 Practice + progress view ✅ DONE (2026-10-14)

### H-C1 · Mastery grid definition 🔴 ✅
States: "new" (unpracticed or not yet introduced), "learning" (practiced but
not mastered, or currently flagged), "mastered" (seen>=4 AND missed/seen<0.5
AND not flagged). Only sounds with introducedInLesson <= currentLesson appear.
Spec: `src/lib/mastery.ts` + `test/mastery.test.mjs` (7 tests).

### L-C1 · Implement deck algorithm 🟢 ✅
Input: H-B1 (DECK_ALGORITHM.md). Pure function, no React.
Done-check: 3 scripted scenarios pass as unit tests.
`src/lib/deck.ts` — `buildDeck(profile, content, seed) -> Card[]` +
`applyOutcome(profile, card, outcome) -> Profile`. 8 tests in
`test/deck.test.mjs` (3 scenarios + type collision + 3 outcome tests).

### L-C2 · Flashcard deck UI (tap to flip, Got it / Needs work) 🟢 ✅
Done-check: streak clears flag after 2 consecutive "Got it"; "Needs work"
re-flags and resets streak.
`src/components/Practice.tsx` — builds deck on mount, one card per screen,
tap to flip (shows hint), "Got it" / "Needs work" at bottom. Empty state and
completion summary included.

### L-C3 · Mastery grid + progress view UI 🟢 ✅
Input: H-C1.
Done-check: grid matches data.
`src/components/MasteryGrid.tsx` — color-coded grid (green/yellow/gray) of
introduced sounds. Integrated into Dashboard.

---

## Phase D — M6 Full content + ship

### H-D1 · Author the full sound schedule + lesson skeletons 🔴
The ~40-sound sequence and how it maps to ~100 lessons. Pedagogical calls:
which sounds pair, review volume, where orthography markup fades.
Done-check: complete schedule table.

### H-D2 · Review all authored content for originality 🔴
Same reason as H-A3. Non-negotiable gate before merge.
Done-check: sign-off per batch.

### H-D3 · Choose deploy target + get user sign-off 🔴
Plan §10 and `codex-kickoff-prompt.md` both require **pausing before deploy**.
Netlify / GitHub Pages / Cloudflare Pages.

### L-D1 · Bulk-author lessons 11–100 🟢 🟢
Input: H-D1. **The best delegation candidate in the project** — the skeleton is
fixed and the validator gates every file mechanically. Batch by ~10 lessons.
⚠ Every batch still passes through H-D2.
Done-check: `npm run validate` green on 100 lessons.

### L-D2 · Print stylesheet for story pages 🟢
Done-check: story page prints cleanly, no chrome.

### L-D3 · Accessibility pass 🟢
rem sizing, WCAG AA contrast, keyboard reachability, Lighthouse a11y ≥ 90.
Done-check: Lighthouse score with evidence.

### L-D4 · PWA / offline service worker 🟢
Done-check: installs and works offline.
⚠ New dependency (vite-plugin-pwa) — AGENTS.md #4 says no new deps without need.
Needs explicit approval.

---

## Recommended order

```
H-A1 ──► L-A1 ──► L-A2        M3 unblocks as soon as the contract exists
H-A2 ──► (merge w/ M3)
             H-A3 / L-A3      content gate
             H-B1 ──► L-C1    algorithm spec unblocks M5's core early
             H-B2 ──► L-B1 ──► L-B2 ──► L-B3
                                  H-D1 ──► L-D1 (bulk, batched) ──► H-D2 per batch
```

Biggest leverage: **H-A1 and H-B1.** Both are ~30 minutes of writing that unblock
the two largest delegate-able workstreams. Everything else in phase A and C is
implementation against a contract.

## What must never be delegated

1. **Originality review** (H-A3, H-D2) — the validator checks decodability, not
   copyright. This is the project's one hard legal constraint.
2. **Spec resolution** where TECHNICAL_PLAN.md is ambiguous or self-contradictory.
3. **Deploy** — H-D3 requires explicit user sign-off.