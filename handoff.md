# Handoff — Freebuff Work Queue (M6)

## STATUS (2026-10-15, set by the strong model)

- **Task 1 (L-D1) is DONE.** All 100 lessons authored and validated
  (`PASS: 100 lessons, 414 words, 40 sounds`). A quality pass was done afterward:
  nonsense words were removed from the bank, JSON script-shape bugs fixed, and the
  fluency lessons 71–100 were rewritten with real sentences (see
  `scripts/fix-fluency.mjs` for the exact sentences + high-frequency word additions).
- **H-D2 + H-D3 are DONE** (2026-10-15): lessons 11–70 sentences and
  blend/wordRead quantities were fully rewritten/fixed by the strong model;
  app is deployed at https://evrlrnr.github.io/read-in-hundred-lessons/.
- **Start with Task 2 (print stylesheet). Then Task 3 (accessibility).**
  Do NOT re-author lesson content; if you touch `words.json` or lesson JSON,
  re-run all four verification commands. After UI tasks, redeploy:
  `npm run build` then push `dist/` to the `gh-pages` branch (recipe in
  AGENTS.md / loop-knowledge Run 8).
- Do NOT reuse the old fluency pattern of "sentences" that are just word lists —
  every `sentenceRead.text` entry must be a real sentence.

## Context

This is a phonics lesson web app (React + Vite static SPA). It teaches parents a
scripted, sequenced phonics curriculum. 100 lessons are authored; the app runs
end-to-end with progress tracking, practice deck, and mastery grid.

**Stack:** React 18, TypeScript, Vite, plain CSS (no Tailwind, no UI lib).
**Content:** JSON files in `src/content/`.
**Validator:** `npm run validate` must always pass.
**Tests:** `npm test` (31 tests).
**Typecheck:** `npx tsc --noEmit`.
**Build:** `npm run build`.

### Critical reference: SOUND_SCHEDULE.md

**Read `SOUND_SCHEDULE.md` before authoring any content.** It defines:
- The exact sound → lesson mapping (which sound goes in which lesson)
- Lesson templates (new sound vs review vs fluency)
- Review volume progression
- Word/sentence complexity by lesson range
- Orthography fade-out schedule
- Batching instructions (10 lessons per batch)
- Quality checklist

---

## Task 1 — Bulk-author lessons 11–100 (L-D1) — ✅ DONE, DO NOT REDO

**The big one. 90 lessons across 9 batches. This is 80% of the remaining work.**
*(Completed 2026-10-15. Kept below for reference only.)*

### What to do

Follow `SOUND_SCHEDULE.md` §8 (Batching Instructions). For each batch of 10:

1. Add new sounds to `src/content/sounds.json`
2. Add new words to `src/content/words.json`
3. Author 10 lesson files in `src/content/lessons/`
4. Run: `npm run validate` → `npm test` → `npx tsc --noEmit`
5. Fix any validator errors (content issues, not code issues)

### Batch order

| # | Lessons | New sounds | Key notes |
|---|---------|-----------|-----------|
| 1 | 11–20 | c, g, r, sh, u | sh is already in sounds.json (lesson 17). Don't duplicate. |
| 2 | 21–30 | l, h, b, f, ee | Lesson 30 = 20-lesson milestone review |
| 3 | 31–40 | k, w, th, ō, j | Lesson 40 = 40-lesson milestone review |
| 4 | 41–50 | v, ā, y, z, qu | Lesson 50 = 50-lesson milestone review |
| 5 | 51–60 | x, ch, ī, er, oo | Lesson 60 = 60-lesson milestone review |
| 6 | 61–70 | ng, ū, oy, wh, ar | Lesson 70 = 70-lesson milestone review |
| 7 | 71–80 | (none — fluency) | Longer passages, team blends, mini-stories |
| 8 | 81–90 | (none — fluency) | Speed reading, 2–3 syllable words |
| 9 | 91–100 | (none — fluency) | Short original stories, 3-sentence passages |

### Done when (per batch)
- `npm run validate` → PASS (zero errors; warnings about future sounds are OK)
- `npm test` → all pass
- `npx tsc --noEmit` → clean
- Every lesson has: soundReview task, non-empty scripts, decodable words

### Done when (all 9 batches)
- `npm run validate` → **PASS: 100 lessons**
- ~280–300 words in `words.json`
- 40 sounds in `sounds.json`
- `npm run build` → clean

### Hard rules
- **Original content only.** Never copy from published phonics books.
- **Decodable only.** Validator enforces this — if it fails, fix the content.
- **Every lesson must have a `soundReview` task.** No exceptions.
- **`newSoundIds` is an array** (even for one sound: `["c"]`, not `"c"`).
- **File naming:** `lesson-011.json` (3-digit, zero-padded).
- **Sentences must make sense.** Not just decodable word lists — actual mini-narratives.

---

## Task 2 — Print stylesheet (L-D2)

### Goal
Ctrl+P on a sentenceRead task → only the reading text prints, clean.

### Spec
Add `@media print` rules to `src/styles.css`:
- **Hide:** `.player-header`, `.adult-strip`, `.controls`, `.flag-btn`, `.dot`,
  all button elements, `body` background.
- **Show:** `.sentence` text at ~20pt equivalent, black on white.
- **Keep:** macron `::after` bars and team arc SVGs (they're part of the orthography).
- **Add:** a print-only header: "Lesson N — Reading Passage" (add a
  `<span className="print-header">` in LessonPlayer, hidden on screen).
- Page margins: browser defaults are fine.

### Done when
- Open app → lesson → sentenceRead task → Ctrl+P → preview shows only words + header.
- `npm run build` passes.

### Files
- `src/styles.css` (add `@media print` block)
- `src/components/LessonPlayer.tsx` (add print-header element)

---

## Task 3 — Accessibility pass (L-D3)

### Goal
WCAG AA contrast, keyboard reachability, semantic HTML. Lighthouse a11y ≥ 90.

### Spec

**Contrast fixes** (audit `src/styles.css`, fix any text below 4.5:1):
- Suspects: `#555`, `#666`, `#777`, `#999` on light backgrounds
- Add `--text-muted` custom property (darker than #555, e.g. #5a6270)
- Apply to all muted text. Don't change visual hierarchy — just darken enough to pass.

**Keyboard:**
- Add `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }`
- `.practice-card` is a `div` with `cursor: pointer` → add `role="button"` +
  `tabIndex={0}` + `onKeyDown` handler for Enter/Space in `Practice.tsx`

**Semantic:**
- `.dots` (task progress) → add `aria-hidden="true"` in LessonPlayer
- Ensure heading hierarchy is correct (no skipped levels)
- `#root` or the main container should be `<main>` or have `role="main"`

**Sizing:**
- All font sizes should be `rem` (they are). Verify no `px` font-size.

### Done when
- All text meets 4.5:1 contrast
- Tab through entire app: visible focus ring on every interactive element
- `npm test` + `npx tsc --noEmit` + `npm run build` pass
- No visual regressions

### Files
- `src/styles.css`
- `src/components/Practice.tsx`
- `src/components/LessonPlayer.tsx`
- `src/components/ProfileHome.tsx`
- `src/components/Dashboard.tsx`
- `src/App.tsx`

---

## Verification commands (run after EVERY batch/task)

```bash
npm run validate   # decodability — must say PASS
npm test           # all tests must pass
npx tsc --noEmit   # typecheck — no output = clean
npm run build      # production build — must succeed
```

## Conventions

- TypeScript, functional components, no class components
- No new npm dependencies without explicit approval
- Child-facing text: large, high-contrast, rem-sized
- All controls: min 44×44px tap target
- CSS: single `src/styles.css`, no CSS modules, no Tailwind
- JSON: no trailing commas, no comments, 2-space indent

## Key reference files

| File | What it is |
|------|-----------|
| `SOUND_SCHEDULE.md` | **Read this first.** Sound→lesson map, templates, rules |
| `TECHNICAL_PLAN.md` | Full design doc (source of truth) |
| `src/content/sounds.json` | Current 11 sounds (add 29 more) |
| `src/content/words.json` | Current 42 words (add ~240 more) |
| `src/content/lessons/lesson-010.json` | Example lesson structure |
| `src/components/LessonPlayer.tsx` | Main lesson UI |
| `src/components/DecodableWord.tsx` | Orthography renderer |
| `src/styles.css` | All styles |
| `scripts/validate.mjs` | Decodability validator |
