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
