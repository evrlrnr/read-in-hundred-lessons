# Technical Plan — Phonics Lessons Web App (Final — Pass 3, scored 8/10)

**Stack (decided at boundary check-in):** React + Vite static SPA. Lessons shipped as
JSON. Progress in localStorage with JSON export/import. No server, no accounts.
Deployable to any free static host (Netlify / GitHub Pages / Cloudflare Pages).

## 1. Vision
"Open the book and go" — a parent/teacher runs a scripted, sequenced phonics lesson
from a screen instead of a book. All content (sound order, words, stories, scripts,
art) is **original**; only the teaching *method* (direct instruction, blending,
cumulative review, modified orthography) is shared with DISTAR-style programs. The
method itself is a teaching technique and not copyrightable; the book's specific
wording, word lists, stories, and illustrations are — so none of those are reused.

## 2. Original lesson sequence design
We author our own ~100-lesson sequence. Sound introduction order (ours, distinct from
the book's): **s, a, t, p, i, n, m, d, ē, o, c, g, r, u, l, h, sh, b, f, ee, k, w,
th, ō, j, v, ā, y, z, qu, x, ch, ī, er, oo, ng, ū, oy, wh, ar…** — finalized during
content authoring under three rules: high-utility sounds first, visually/aurally
confusable letters separated by several lessons, one new sound per 1–2 lessons.

Every lesson follows the same skeleton:
1. **New sound** (if any) — introduce + say-with-me
2. **Sound review** — 4–8 previously taught sounds
3. **Blending drill** — "slow way / fast way" on 2–4 words
4. **Word reading** — 4–8 words (new + review mix)
5. **Sentence/story reading** — decodable text using only taught sounds
6. **Optional writing prompt**

## 3. Content model & file format
### sounds.json
```json
{ "id": "ee", "display": "ee", "team": true, "hint": "as in seed",
  "introducedInLesson": 20, "sayItScript": "This sound is eee. Say it with me." }
```
### words.json (shared word bank)
```json
{ "id": "seat", "graphemes": [
    { "g": "s", "soundId": "s" },
    { "g": "ea", "soundId": "ee", "team": true },
    { "g": "t", "soundId": "t" } ] }
```
Silent letter: `{ "g": "e", "silent": true }` · Long-vowel macron:
`{ "g": "a", "macron": true, "soundId": "a_long" }`

### lessons/lesson-012.json
```json
{ "lesson": 12, "newSoundIds": ["d"],
  "tasks": [
    { "type": "newSound", "soundId": "d",
      "script": ["Point to the sound.", "This sound is d. Say it with me: d.", "Again. Good."] },
    { "type": "soundReview", "soundIds": ["s","a","t","p","i","n","m"],
      "script": ["Point to each sound. Ask: What sound?"] },
    { "type": "blend", "wordIds": ["mat","sit"],
      "script": ["Say it slowly with me… now say it fast!"] },
    { "type": "wordRead", "wordIds": ["sad","dim","pan","tap"] },
    { "type": "sentenceRead", "text": [["sam"],["sat"]],
      "script": ["Child sounds out each word, then reads the sentence the fast way."] }
  ] }
```
**Decodability validator** (node script, runs in CI/pre-commit): every sound
referenced by a lesson's words must be introduced in an earlier-or-same lesson;
every wordId must exist; every lesson must contain a review task. This guarantee is
the pedagogical backbone — it can never regress silently.

## 4. Orthography rendering
No custom font — a `<DecodableWord>` React component renders each grapheme as a span:
- **Letter team** (sh, ee, th…): grapheme spans kept snug, with a connecting arc
  drawn beneath the team via a small absolutely-positioned SVG path
- **Macron** (long vowel): CSS `::after` bar above the grapheme (more reliable
  cross-font than Unicode combining characters)
- **Silent letter**: rendered at `0.6em`, reduced opacity, baseline-aligned
- **Sounding-out guide** (blending tasks only): arrow under the word with a dot
  centered under each non-silent grapheme group; positions computed from span
  layout via refs after render
- Child-facing text uses a large, round, open-licensed sans (Andika or Comic Neue)

As lessons advance, markup simply stops using macron/silent/team annotations —
orthography fade-out is a *content* decision, requiring zero rendering changes.

## 5. UI flows
- **Home**: child profile picker (add/rename/delete); each card shows "Lesson N"
- **Dashboard** (per child): "Continue Lesson N" primary button; "Practice" deck;
  progress bar; settings (export/import data)
- **Lesson player**: one task per screen. Top strip (adult-facing, smaller text):
  script lines, checkable as read. Center (child-facing): huge text via
  DecodableWord. Controls: Back / Next, ⚑ flag-for-review on any sound/word, task
  progress dots. Designed one-handed: all controls reachable at screen bottom,
  taps only (child on lap ergonomics).
- **Lesson complete**: praise screen; advances `currentLesson`; offers "repeat
  lesson" if ≥2 items were flagged (mirrors the method's mastery rule)
- **Practice mode**: flashcard deck; tap to flip; "Got it / Needs work" buttons
- **Progress view**: lessons done, flagged items, per-sound mastery grid

## 6. Review scheduling (practice deck algorithm)
Deterministic and simple — no SRS library needed:
1. All currently-flagged sounds and words (always included)
2. All sounds introduced in the last 3 completed lessons
3. Any item with `missed / seen ≥ 0.5` over its last 4 practice exposures
4. Deck capped at 15 cards, priority order 1 → 3, shuffled within groups
"Got it" twice consecutively clears an item's flag; "Needs work" re-flags it and
resets its streak. All counters live in `practiceStats` (schema below).

## 7. Progress data schema (localStorage key `phonics.v1`)
```json
{ "version": 1, "activeProfileId": "p1",
  "profiles": [{
    "id": "p1", "name": "Ada", "createdAt": "2026-07-07",
    "currentLesson": 12,
    "lessonHistory": [{ "lesson": 11, "completedAt": "…", "repeated": false }],
    "flags": { "sounds": ["ee"], "words": ["seat"] },
    "practiceStats": { "seat": { "seen": 4, "missed": 2, "streak": 0 } } }] }
```
- **Export**: download the whole object as `phonics-backup-<date>.json`
- **Import**: file picker → schema validation → user chooses **Replace all** or
  **Add as new profiles** (no field-level merging — profiles are the merge unit,
  which sidesteps conflict resolution entirely)
- `version` field gates future migrations (`migrate(v1→v2)` functions run on load)

## 8. Build roadmap (each milestone has a done-check)
| # | Milestone | Done when |
|---|---|---|
| M1 | Content pipeline | Schemas + validator pass on 10 authored original lessons; validator fails on a deliberately broken lesson |
| M2 | Lesson player | A parent can run lessons 1–10 end to end on a phone, scripts visible, no dead ends |
| M3 | Orthography | Teams, macrons, silent letters, and blending arrows render correctly for every grapheme type in the word bank (visual test page) |
| M4 | Progress | Profiles persist across reload; flags work; export→wipe→import restores state exactly |
| M5 | Practice + progress view | Deck algorithm produces expected cards for 3 scripted scenarios; mastery grid matches data |
| M6 | Full content + ship | 100 lessons authored + validated; deployed to public static URL; Lighthouse a11y ≥ 90 |

Sequencing note: M1 is the risk burn-down — if authoring 10 original lessons is slow,
the content workload (the real long pole) is exposed in week 1, not month 3.

## 9. Non-functional notes
- **Offline**: static SPA + localStorage already works offline after first load; add
  a service worker (vite-plugin-pwa) in M6 for true offline install
- **Accessibility**: script strip and child text meet WCAG AA contrast; all controls
  keyboard-reachable; child text sized in rem (respects browser zoom)
- **Print**: each lesson's story page gets a print stylesheet so parents can print
  reading passages — cheap feature, high classroom value
- **No analytics, no tracking, no accounts**: it's a children's app; localStorage
  keeps all data on-device by default

## 10. Future roadmap (post-M6, in rough priority order)
1. **Audio pronunciation** — tap any sound card to hear it said correctly; records
   once per sound, huge help for parents unsure how to say "short a" purely
2. **Mastery checkpoints** — every 10 lessons, a short check-out reading; failing it
   routes the child back N lessons (the method's mastery rule, automated)
3. **Handwriting practice** — traceable letter-formation animations tied to each
   lesson's writing prompt (canvas/SVG, finger-tracing on tablets)
4. **Reward system** — stickers/stars per lesson, printable certificate at 25/50/100
5. **Classroom mode** — teacher dashboard over many profiles, small-group deck view
6. **Story illustrations** — one original picture per story, revealed *after* the
   child reads (comprehension incentive, mirrors the method)
7. **Child voice recording** — record the child reading a story; parents keep an
   audio journal of progress (stays on-device)
8. **Accessibility pack** — dyslexia-friendly font toggle, letter-confusion drills
   (b/d), adjustable pacing
9. **i18n of parent scripts** — child content stays English; the parent-facing
   scripts translate cheaply since they're already isolated strings in JSON
