# Technical Plan — Phonics Lessons Web App (Pass 2)

**Stack (decided):** React + Vite static SPA. Lessons shipped as JSON. Progress in
localStorage with JSON export/import. No server, no accounts. Free static hosting.

## 1. Vision
"Open the book and go" — a parent/teacher runs a scripted, sequenced phonics lesson
from a screen instead of a book. All content (sound order, words, stories, scripts,
art) is **original**; only the teaching *method* (direct instruction, blending,
cumulative review, modified orthography) is shared with DISTAR-style programs.

## 2. Original lesson sequence design
We author our own ~100-lesson sequence. Sound introduction order (ours, distinct
from the book's): **s, a, t, p, i, n, m, d, ē, o, c, g, r, u, l, h, sh, b, f, ee, k,
w, th, ō, j, v, ā, y, z, qu, x, ch, ī, er, oo, ng, ū, oy, wh, ar…** (full order
finalized during content authoring; rule: high-utility sounds first, easily-confused
letters separated, one new sound every 1–2 lessons).

Every lesson follows the same skeleton:
1. New sound (if any) — introduce + say-with-me
2. Sound review — 4–8 previously taught sounds
3. Blending drill — "slow way / fast way" on 2–4 words
4. Word reading — 4–8 words (mix of new + review)
5. Sentence/story reading — decodable text using only taught sounds
6. Optional writing prompt

## 3. Content model & file format
### sounds.json
```json
{ "id": "ee", "display": "ee", "team": true, "hint": "as in seed",
  "introducedInLesson": 20, "sayItScript": "This sound is eee. Say it with me." }
```
### words.json (word bank, shared across lessons)
```json
{ "id": "seat", "graphemes": [
    { "g": "s", "soundId": "s" },
    { "g": "ea", "soundId": "ee", "team": true },
    { "g": "t", "soundId": "t" } ] }
```
Silent letters: `{ "g": "e", "silent": true }`. Long-vowel macron: `{ "g": "a", "macron": true, "soundId": "a_long" }`.

### lessons/lesson-012.json
```json
{ "lesson": 12, "newSoundId": "d",
  "tasks": [
    { "type": "newSound", "soundId": "d",
      "script": ["Point to the sound.", "This sound is d. Say it with me: d.", "Again. Good."] },
    { "type": "soundReview", "soundIds": ["s","a","t","p","i","n","m"],
      "script": ["Point to each sound. Ask: What sound?"] },
    { "type": "blend", "wordIds": ["mat","sit"],
      "script": ["Say it slowly with me… now say it fast!"] },
    { "type": "wordRead", "wordIds": ["sad","dim","pan","tap"] },
    { "type": "sentenceRead", "wordIds": ["sam","sat"], "text": [["sam"],["sat"]],
      "script": ["Have the child sound out each word, then read the sentence fast."] }
  ] }
```
A build-time validator script checks every lesson: all referenced sounds must be
introduced in an earlier lesson (decodability guarantee), all word ids exist.

## 4. Orthography rendering
No custom font. A `<DecodableWord>` React component renders each grapheme as a span:
- **Letter team** (sh, ee, th…): spans kept snug (letter-spacing 0) with a connecting
  arc drawn underneath via an absolutely-positioned SVG path per team group
- **Macron** (long vowel): CSS `::after` bar above the grapheme (not the Unicode
  combining char — inconsistent across fonts)
- **Silent letter**: `font-size: 0.6em; opacity: 0.55; align-self: baseline-ish` via
  `vertical-align` tuning
- **Sounding-out guide**: optional arrow under the whole word with a dot centered
  under each non-silent grapheme group (SVG, computed from span layout via refs)
Child text uses a large round sans font (e.g., Andika or Comic Neue — open licensed).

## 5. UI flows
- **Home**: profile picker (add/rename/delete child), each card shows "Lesson N"
- **Dashboard** (per child): big "Continue Lesson N" button; "Practice flagged
  sounds/words" deck; progress bar; settings (export/import data)
- **Lesson player**: one task per screen. Top strip (adult-facing, smaller text):
  the script lines. Center (child-facing): huge sounds/words via DecodableWord.
  Controls: Back / Next, "Flag for review" (⚑) on any sound/word, task progress dots.
- **Lesson complete**: praise screen, auto-advances profile's currentLesson
- **Practice mode**: flashcard deck built from flagged items + last 3 lessons' sounds;
  tap to flip; "got it / needs work" updates flags
- **Progress view**: lessons done, flagged items list, per-sound status grid

## 6. Progress data schema (localStorage key `phonics.v1`)
```json
{ "version": 1, "activeProfileId": "p1",
  "profiles": [{
    "id": "p1", "name": "Ada", "createdAt": "2026-07-07",
    "currentLesson": 12,
    "lessonHistory": [{ "lesson": 11, "completedAt": "…", "repeated": false }],
    "flags": { "sounds": ["ee"], "words": ["seat"] },
    "practiceStats": { "seat": { "seen": 4, "missed": 2 } } }] }
```
Export = download this object as a `.json` file; import = file picker + validation +
merge-or-replace prompt. Version field enables future migrations.

## 7. Build roadmap
1. **M1 — Content pipeline**: JSON schemas, validator script, first 10 original lessons
2. **M2 — Lesson player**: task screens, scripts, navigation
3. **M3 — Orthography**: DecodableWord with teams/macrons/silent/arrows
4. **M4 — Progress**: profiles, localStorage, flags, export/import
5. **M5 — Practice mode + progress view**
6. **M6 — Content to lesson 100, polish, deploy to static host**

## Known gaps (for next pass)
- Review-scheduling logic for practice mode is vague ("flagged + last 3 lessons")
- No acceptance criteria on milestones; no estimates
- Accessibility & print/offline story pages not addressed
- Import merge conflicts unspecified
