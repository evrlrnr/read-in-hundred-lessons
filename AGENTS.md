# Phonics Lessons Web App — Agent Instructions

## What this project is
A web app that gives parents/teachers a scripted, sequenced phonics lesson experience
(DISTAR-style direct instruction) with **entirely original content**. The full design
is in **TECHNICAL_PLAN.md — read it before writing any code. It is the source of
truth.** Past decisions and lessons learned are in **loop-knowledge.md**.

## Current status (2026-07-07)
- **M1 done**: content schemas, decodability validator, 10 original lessons authored
- **M2 done**: lesson player — all 10 lessons verified end to end on a mobile viewport
- **Next: M3** (orthography component + /dev/ortho visual test page)
- Schema note: lessons use `newSoundIds` (an ARRAY — lesson 1 introduces two sounds),
  matching src/types/content.ts and the validator. Do not "fix" it to singular.
- Word rendering in LessonPlayer.tsx (`WordText`) is a deliberate M2 placeholder
  that M3 replaces.

## Commands
- `npm run dev` — dev server (port 5173) · `npm run build` — production build
- `npm run validate` — decodability validator (must pass before any commit)
- `npm test` — validator tests · `npx tsc --noEmit` — typecheck (build skips types)

## Where things live
- Content: `src/content/` (sounds.json, words.json, lessons/lesson-NNN.json)
- Validator: `scripts/validate.mjs` · Tests: `test/`
- UI: `src/App.tsx`, `src/components/LessonPlayer.tsx`, `src/styles.css`
- Planning artifacts: TECHNICAL_PLAN.md, loop-knowledge.md, drafts/ (historical)

## Hard constraints (never violate)
1. **Original content only.** We implement the teaching *method* of programs like
   "Teach Your Child to Read in 100 Lessons" but NEVER copy that book's sound order,
   word lists, story text, script wording, or art. If generating lesson content,
   invent it fresh; our sound order starts s, a, t, p, i, n, m, d, ē, o (see plan §2).
2. **Stack is locked** (user decision — do not revisit): React + Vite static SPA,
   lesson content as JSON files, progress in localStorage with JSON export/import.
   No server, no database, no accounts, no analytics.
3. **The decodability validator is non-negotiable** (plan §3): every lesson may only
   use sounds introduced in an earlier-or-same lesson. Build it first; keep it in CI.
4. **No new dependencies without need.** Prefer plain React + CSS/SVG. The
   orthography renders via span-per-grapheme (plan §4), not a custom font.

## How to work: one milestone at a time
The roadmap (plan §8) has milestones M1–M6, each with a "done when" check.
- Work on exactly ONE milestone per task/PR. Do not start the next milestone.
- A milestone is finished only when its "done when" check demonstrably passes —
  show the evidence (test output, validator run, screenshots).
- If the plan is ambiguous or you believe a plan decision is wrong, STOP and ask
  the user instead of silently deviating. Deviations must be recorded in
  loop-knowledge.md under "Decisions changed during build".
- After each milestone, append what worked / what didn't to loop-knowledge.md.

## Conventions
- TypeScript, functional React components, no class components
- Lesson/word/sound JSON lives in `src/content/`; validator in `scripts/validate.mjs`
  (runnable via `npm run validate`)
- Tests for the validator and the practice-deck algorithm (plan §6) — these are the
  two pieces of real logic; UI can be verified manually against milestone checks
- Child-facing text: large, high-contrast, rem-sized; all controls tappable
  one-handed at screen bottom (parent has a child on their lap)
