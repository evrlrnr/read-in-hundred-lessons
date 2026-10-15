# Loop Knowledge File
Patterns and lessons from completed loops. Future loops: read this before pass 1.

## Run 1 — Planning loop (2026-07-07) · Final score 8/10 in 3 passes

### What raised the score most
- **Decomposing the metric into a checklist** made weak areas findable: pass 1's
  4/10 came almost entirely from two "TBD" sections, so pass 2 knew exactly where
  to work. Score-per-area, not just overall.
- **Resolving the blocking decision early**: schema and roadmap were both stuck on
  the tech stack. Triggering the boundary check-in at pass 1 (instead of drafting
  around the gap) saved a wasted pass.
- **"Done when" columns on milestones** (pass 3) moved roadmap from 6→8. A roadmap
  without acceptance criteria reads complete but isn't.
- **Concrete data examples beat prose**: showing actual JSON for sounds/words/
  lessons (pass 2) did more for completeness than paragraphs describing them.

### What a "10" section would have needed (why we stopped at 8)
- A full authored sample lesson (real original content, not placeholder words)
- The complete 100-sound/lesson sequence, not the first ~40
- Wireframe sketches for the lesson player
These are authoring work, better done in the build loop — diminishing returns for
a planning pass.

### Recurring weakness to watch
- First drafts hand-wave algorithms ("flagged + recent items") — force any
  selection/scheduling logic into numbered deterministic rules before scoring it
  above 6.

### Decisions locked (carry into build loop)
- Stack: React + Vite static SPA, JSON content, localStorage + export/import
- Orthography: span-per-grapheme component + SVG arcs/arrows, no custom font
- Original sound order starts s, a, t, p, i, n, m, d, ē, o … (distinct from the book)
- Decodability validator is non-negotiable; build it first (M1)
- Import model: profile-level replace-or-add, never field merging

## Run 2 — Build loop, M1 Content pipeline (2026-07-07) · Done-check PASSED
- Validator: `PASS: 10 lessons, 41 words, 10 sounds — all decodable.` Tests: 3/3
  (valid content passes; untaught-sound word and missing-review lesson both rejected).
- Schema deviation from plan: `newSoundId` → `newSoundIds` (array) because lesson 1
  introduces two sounds (s, a). Types + validator use the array form.
- `npm install` deferred — validator/tests run on plain Node with zero deps. Install
  vite/react deps at M2 when the app UI starts.
- Next: M2 (lesson player).

## Run 3 — Build loop, M2 Lesson player (2026-07-07) · Done-check PASSED
- Automated drive-through on a 375×812 viewport: all 10 lessons ran start → finish,
  parent script strip non-empty on every task, zero console errors, no dead ends
  (every screen has Exit / Back / Next / Finish).
- Word rendering in M2 is a placeholder (CSS overline for macrons, small faded
  silent letters) — good enough to read, replaced by the real orthography
  component (SVG arcs, blending arrows) in M3.
- `npx tsc --noEmit` used as the typecheck since `vite build` doesn't check types.
- Next: M3 (orthography component + /dev/ortho visual test page).

### Suggested build-loop metric (proposal for next run)
Score 1–10 on: lessons playable end-to-end · orthography renders all grapheme
types · validator catches seeded errors · progress survives reload + export/import
round-trip. Boundary: pause for user before M6 deploy.

## Run 4 — Build loop, M3 Orthography (2026-10-14) · Done-check PASSED

### What shipped
- `src/components/DecodableWord.tsx`: span-per-grapheme with (a) SVG arc beneath
  letter teams, (b) drawn macron bar via `::after`, (c) small/faded silent letters,
  (d) sounding-out guide = horizontal arrow + one dot per **sound unit** (non-silent
  grapheme group), dot x-positions measured from rendered span layout via
  `useLayoutEffect` + refs.
- `src/components/OrthoTestPage.tsx` at `/dev/ortho` (also `#/dev/ortho`): renders
  every word in the bank, isolates each feature type, and shows the blend guide.
- `LessonPlayer.tsx`: `WordText` placeholder replaced by a `Word` wrapper over
  `DecodableWord`; blend tasks pass `showGuide`.
- Content: added `sh` (team, lesson 17 per plan §2) to `sounds.json` and `ship` to
  `words.json` as the arc test case.
- Validator: new non-fatal `validateWarnings` — flags planned-but-unauthored sounds
  and reserve words. `validateContent` (errors) unchanged, so `assert.deepEqual(errors, [])`
  still holds. 6/6 tests pass.

### Decisions changed during build (recorded per AGENTS.md)
1. **Macron = drawn `::after` bar, not `text-decoration: overline`.** TECHNICAL_PLAN §4
   ("CSS `::after` bar") and codex-kickoff-prompt ("a drawn macron bar, not CSS overline")
   were in mild conflict. Both are satisfied by a positioned `::after` bar; the thing we
   reject is `text-decoration: overline` (what the M2 placeholder used).
2. **Validator coverage gap → warnings, not errors.** A hard "every sound needs an
   introducing lesson" check would break incremental authoring (we have 10 of 100
   lessons). Instead: non-fatal warnings surface planned sounds (sh → lesson 17) and
   reserve words (ship). Errors are reserved for actual decodability violations.
3. **Font: keeping the system stack for M3** (deviation from §4's "Andika or Comic
   Neue"). The orthography is drawn with SVG/CSS so it is font-agnostic; a bundled
   open-licensed font is deferred to M6 to avoid a network/asset dependency and keep
   the offline story clean. Revisit at M6.

### What worked / what didn't
- **SSR smoke test via esbuild + `renderToString`** confirmed the component emits the
  right structure for every grapheme type (team arc present, macron/silent classes
  correct) without needing a browser. Guide dots are client-only (layout), so they're
  the one part still verified by eye. Build as CJS, not ESM — ESM bundling of
  `react-dom/server` trips a `Dynamic require of "stream"` error.
- **The one thing I could NOT verify headlessly is the pixels**: arc curvature, the
  macron bar's vertical position (font-dependent — I set `top: 0.06em`, likely needs a
  1-line nudge), and dot-to-letter alignment. `npm run dev` → open `/dev/ortho` and
  check: arc sits under the team, macron bar is level with the top of the vowel,
  guide dots center under each sound unit.

### Evidence
- `npm run validate`: PASS 10 lessons, 42 words, 11 sounds + 2 expected warnings
- `npm test`: 6/6 · `npx tsc --noEmit`: clean · `npm run build`: clean (50 kB gzip)
- `/dev/ortho` serves the SPA shell (200)

Next: M4 (Progress) per plan §7.

## Run 5 — Build loop, M4 Progress UI (2026-10-14) · Done-check PASSED

### What shipped
The progress **logic** (`src/lib/progress.ts`) and **hook** (`src/hooks/useProgress.ts`)
were already built + tested in an earlier pass. This run added the **UI** that
exercises it (plan §5):
- `src/components/ProfileHome.tsx` — home = child profile picker. Each card shows
  name + "Lesson N"; tap → dashboard. Inline rename (input + Save/Cancel), delete
  (confirm), and an add-child form.
- `src/components/Dashboard.tsx` — per child: "Continue Lesson N" primary button,
  progress bar (`currentLesson-1 / total`), Practice entry (deck ships in M5),
  Settings, and a "N items flagged" note. Caps at "All N lessons done" when
  `currentLesson` exceeds the authored count.
- `src/components/Settings.tsx` — export = dated `phonics-backup-<date>.json`
  download; import = file picker → **dry validation** (`importState`) → then
  Replace-all or Add-as-new-profiles. Errors surfaced inline.
- `src/components/CompleteScreen.tsx` — praise; offers "Repeat lesson N" only when
  ≥2 items were flagged this run (the method's mastery rule); "Next lesson" hidden
  when none is authored.
- `src/components/LessonPlayer.tsx` — ⚑ flag button on **every** sound and word
  (newSound, soundReview, blend, wordRead, sentenceRead). Tracks `flaggedThisLesson`
  (a Set of ids toggled ON this run) and passes the count to `onComplete`.
- `src/App.tsx` — restructured into a profile-aware screen state machine
  (home / dashboard / lesson / complete / settings / practice). `useProgress`
  lives here; screens resolve the active profile and fall back to a "Missing"
  screen if a referenced profile/lesson is gone.
- `src/styles.css` — styles for all of the above + a `--flag` color.

### Decisions / notes
- **Repeat-lesson trigger = items flagged *during this run*, not total flags.**
  Pre-existing flags from earlier lessons don't count, so a child who is already
  carrying flags isn't forced to repeat. Tracked locally in the player (a Set),
  not in the persisted profile.
- **Import does a dry validation before the user commits** (parse + migrate +
  validate via `importState`), so "Replace all" / "Add as new profiles" only appear
  for a valid file; invalid files show their errors immediately.
- **Practice button is present but leads to a "coming in M5" note** — the button is
  part of the M4 dashboard layout (plan §5), the deck itself is M5. Not a dead end
  (has a Back button).
- **No new dependencies.** Plain React + CSS, per AGENTS.md #4.

### What worked / what didn't
- **SSR smoke test caught a false alarm, not a bug.** First run of the
  `renderToString` smoke test "failed" 6 checks — all of them contained a number
  rendered via `{expr}`. Cause: React's `renderToString` inserts `<!-- -->` comment
  separators between adjacent text and expressions (`Lesson {5}` → `Lesson <!-- -->5`).
  Stripping `<!-- -->` before asserting fixed it. Lesson: when asserting on SSR
  output, normalize away the comment nodes first.
- **Shell quirk (Windows/cmd):** `npx tsc --noEmit` stdout was not captured by the
  tool (empty), and `timeout /t N >nul` aborts the whole chain ("Input redirection
  is not supported"). Workaround: redirect tsc to a file and read it (empty file =
  pass), and avoid `timeout >nul` in chained commands.

### Evidence
- `npx tsc --noEmit`: clean (empty output)
- `npm test`: 16/16 (10 progress + 6 validator)
- `npm run build`: clean (53 kB gzip)
- `npm run validate`: PASS 10 lessons, 42 words, 11 sounds + 2 expected warnings
- SSR smoke test of ProfileHome/Dashboard/Settings/CompleteScreen: 16/16 checks
- Dev server boots (Vite ready ~940 ms) and serves the SPA shell + transformed modules

Next: M5 (Practice + progress view) per plan §6/§8. H-B1 (deck algorithm spec) is
the unblocking H task.

## Run 6 — Build loop, M5 Practice + progress view (2026-10-14) · Done-check PASSED

### What shipped
- `src/lib/deck.ts` — `buildDeck(profile, content, seed) -> Card[]` implementing
  the 3-rule priority algorithm (flagged → recent → struggling) with mulberry32
  seeded Fisher-Yates shuffle, 15-card cap. Plus `applyOutcome(profile, card,
  outcome) -> Profile` for the Got it / Needs work interaction (streak logic,
  flag clearing/re-flagging).
- `src/lib/mastery.ts` — `getMasteryState` + `getMasteryGrid`. Three states:
  new / learning / mastered. Mastered = seen>=4 AND missed/seen<0.5 AND not
  flagged. Only shows sounds with introducedInLesson <= currentLesson.
- `src/components/Practice.tsx` — flashcard deck UI. Builds deck on mount,
  one card per screen, tap to flip (shows hint), "Got it" / "Needs work"
  buttons at bottom. Empty state + completion summary.
- `src/components/MasteryGrid.tsx` — color-coded grid (green/yellow/gray) of
  introduced sounds with legend. Integrated into Dashboard.
- `src/hooks/useProgress.ts` — added `applyOutcome` method.
- `src/App.tsx` — practice placeholder replaced with real Practice component;
  Dashboard now receives `sounds` prop for the mastery grid.
- `src/styles.css` — styles for practice card, controls, mastery grid.

### Decisions / notes
- **Mastery threshold mirrors the deck's struggling threshold** (seen>=4,
  rate<0.5) so the grid and deck are consistent: a "mastered" sound won't
  appear in the deck via rule 3, and a "learning" sound with high miss rate
  will.
- **Deck seed = date-based** (YYYYMMDD) in production so the shuffle varies
  day-to-day but is stable within a session. Tests use seed=1.
- **Practice deck is built once on mount** (useMemo with empty deps). If the
  user completes a lesson and comes back, the component remounts and rebuilds.
  This is fine for the current UX (navigate away → back).

### Evidence
- `npm test`: 31/31 (8 deck + 7 mastery + 10 progress + 6 validator)
- `npx tsc --noEmit`: clean
- `npm run build`: clean (55 kB gzip)
- `npm run validate`: PASS 10 lessons, 42 words, 11 sounds + 2 expected warnings

Next: M6 (Full content + ship) per plan §8. H-D1 (sound schedule + lesson
skeletons) is the unblocking H task.

---

## Run 7 — M6 content (L-D1 by freebuff + quality repair by strong model) — 2026-10-15

### What happened
- freebuff completed all 9 batches: 100 lesson files, 40 sounds, validator green.
  Mechanical volume work: fine. It is NOT trustworthy for content quality.
- Quality audit found four defect classes:
  1. Nonsense words invented to fit spellings (qub, quab, thop, ker, jerk…).
  2. Fluency lessons 71–100 had word lists posing as sentences, sometimes identical
     across tasks.
  3. JSON shape bug repeated in 35 files: sentenceRead.script was [["a","b"], null].
  4. Review lesson wordRead had 24 words (spec: 6–8).

### What worked
- Repairing with small checked-in scripts (fix-words.mjs, clean-words.mjs,
  fix-fluency.mjs) instead of hand-editing 60+ files. Scripts assert every sentence
  word exists in the bank and ABORT on a miss — caught 4 invented words (ramp, plum,
  spin were missing; "read" is not decodable and was rephrased away).
- Adding decodable high-frequency words (69: he/she/we/dog/frog/like/came/…) finally
  made real sentences possible. Lesson: author the word bank to enable the prose you
  want, not just per-lesson vocabulary.
- Verb-variety audit: user caught "all the actions are ran" in a draft; every
  sentence plan now spreads verbs (sat/ran/went/got/had/made/ate/fed/hid/put/let/
  dig/jump/swing/swam/sing…) and mixes structures (declarative, modal can/may,
  imperative, compound subject).

### What didn't
- The delegate for lessons 71–80 stalled (0 turns) and 81–100 delegates wrote
  word-list "sentences" that passed the validator but failed the handoff's
  "sentences must make sense" rule. Validator ≠ quality gate.

### Evidence
- `npm run validate`: PASS 100 lessons, 414 words, 40 sounds; 25 reserve-word warnings.
- `npm test`: 31/31. `npx tsc --noEmit`: clean. `npm run build`: 69.8 kB gzip.

### Open
- H-D2 originality review of lessons 11–70 (strong model). L-D2/L-D3 queued freebuff.
- Add "sentences are real prose" as an explicit batch-gate item in SOUND_SCHEDULE.md
  §8, and spot-check each batch manually — mechanical validators can't catch it.
