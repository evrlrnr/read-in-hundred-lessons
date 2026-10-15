# Phonics Lessons Web App — Agent Instructions

## What this project is
A web app that gives parents/teachers a scripted, sequenced phonics lesson experience
(DISTAR-style direct instruction) with **entirely original content**. The full design
is in **TECHNICAL_PLAN.md — read it before writing any code. It is the source of
truth.** Past decisions and lessons learned are in **loop-knowledge.md**.

## Current status (2026-10-15)
- **M1 done**: content schemas, decodability validator, 10 original lessons authored
- **M2 done**: lesson player — all 10 lessons verified end to end on a mobile viewport
- **M3 done**: `<DecodableWord>` orthography component (team arcs, drawn macron bar,
  silent letters, per-sound-unit blending guide) + `/dev/ortho` visual test page
- **M4 done**: progress — profiles, flags, export/import
- **M5 done**: practice deck (3-rule algorithm, flashcard UI) + mastery grid
- **M6 in progress** (full content + ship: 100 lessons, deploy, a11y)
  - **H-D1 done**: `SOUND_SCHEDULE.md` — full 40-sound → 100-lesson map, templates,
    complexity progression, orthography fade-out, 9-batch authoring plan
  - **L-D1 done + quality-fixed**: freebuff authored all 100 lessons; strong model
    then fixed nonsense words, JSON script-shape bugs (35 files), word-count
    overflow (L50), and rewrote ALL fluency "sentences" (71–100) as real sentences
    (`scripts/fix-fluency.mjs`) + added 69 decodable high-frequency words to the
    bank (he/she/we/dog/frog/like/came/…). Current state: validator PASS
    (100 lessons, 414 words, 40 sounds), 31/31 tests, tsc clean, build clean.
  - **H-D2 done** (strong model review): found systemic defects in 11–70 —
    word-list "sentences", `sat` used 49×, one sentence duplicated 9–12×,
    blend/wordRead counts up to 46 vs spec 4–10. All rewritten
    (`scripts/rewrite-11-70.mjs`, `scripts/fix-quantities.mjs`); +11 qu/er/ū
    words; deck-wide dup check; validator PASS 100/L425 words. Originality:
    sound order + sentences are ours; no book text copied.
  - **H-D3 done** (judgment call, 2026-10-15): deployed to **GitHub Pages**
    → https://evrlrnr.github.io/read-in-hundred-lessons/ (gh-pages branch,
    built from `dist/`). Repo was flipped PRIVATE→PUBLIC to enable it (free
    plan) — reversible with one `gh repo edit` command. Vite `base:'./'` set
    for subpath serving. Redeploy recipe in handoff.md.
  - **Queued for freebuff** (see `handoff.md`): L-D2 (print stylesheet),
    L-D3 (accessibility pass) — freebuff must NOT re-author lesson content.
    M6 done-check now needs only: freebuff L-D2/L-D3 + Lighthouse a11y ≥ 90
    + redeploy.
- Schema note: lessons use `newSoundIds` (an ARRAY — lesson 1 introduces two sounds),
  matching src/types/content.ts and the validator. Do not "fix" it to singular.
- Validator now also emits **non-fatal warnings** for planned-but-unauthored sounds
  and reserve words (see `validateWarnings` in scripts/validate.mjs).

## Commands
- `npm run dev` — dev server (port 5173) · `npm run build` — production build
- `npm run validate` — decodability validator (must pass before any commit)
- `npm test` — validator tests · `npx tsc --noEmit` — typecheck (build skips types)

## Where things live
- Content: `src/content/` (sounds.json, words.json, lessons/lesson-NNN.json)
- Validator: `scripts/validate.mjs` · Tests: `test/`
- UI: `src/App.tsx`, `src/components/LessonPlayer.tsx`, `src/components/DecodableWord.tsx`,
  `src/components/OrthoTestPage.tsx`, `src/styles.css`
- Planning artifacts: TECHNICAL_PLAN.md, loop-knowledge.md, TASKS.md, drafts/ (historical)

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
- **Never hibernate/sleep/shut down the machine** after finishing work. Only do it
  when the user explicitly asks in the current conversation (user decision, 2026-10-15).

## Conventions
- TypeScript, functional React components, no class components
- Lesson/word/sound JSON lives in `src/content/`; validator in `scripts/validate.mjs`
  (runnable via `npm run validate`)
- Tests for the validator and the practice-deck algorithm (plan §6) — these are the
  two pieces of real logic; UI can be verified manually against milestone checks
- Child-facing text: large, high-contrast, rem-sized; all controls tappable
  one-handed at screen bottom (parent has a child on their lap)
