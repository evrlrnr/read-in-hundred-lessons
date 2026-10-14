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
