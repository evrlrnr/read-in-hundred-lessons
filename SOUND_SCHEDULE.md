# Sound Schedule & Lesson Skeletons (H-D1)

This is the authoritative spec for authoring lessons 11–100. Every lesson must
follow the patterns defined here. The validator (`npm run validate`) enforces
decodability mechanically — these rules are the *pedagogical* layer on top.

## 1. Complete Sound → Lesson Map

| Lesson | New Sound(s) | Type | Notes |
|--------|-------------|------|-------|
| 1 | s, a | new | (done) |
| 2 | t | new | (done) |
| 3 | p | new | (done) |
| 4 | i | new | (done) |
| 5 | n | new | (done) |
| 6 | m | new | (done) |
| 7 | d | new | (done) |
| 8 | ē | new | (done) — long e, macron |
| 9 | o | new | (done) |
| 10 | — | review | (done) — big review, 10 lessons milestone |
| **11** | **c** | new | hard c /k/, as in cat |
| **12** | — | review | consolidate c |
| **13** | **g** | new | hard g /g/, as in go |
| **14** | — | review | c + g pair (both velar stops) |
| **15** | **r** | new | as in run |
| **16** | — | review | |
| **17** | **sh** | new | team /ʃ/, as in ship (pinned in sounds.json) |
| **18** | — | review | sh consolidation |
| **19** | **u** | new | short u /ʌ/, as in up |
| **20** | — | review | 5-sound review |
| **21** | **l** | new | as in lap |
| **22** | — | review | |
| **23** | **h** | new | as in hat |
| **24** | — | review | |
| **25** | **b** | new | as in bed — separated from d (lesson 7) by 18 lessons |
| **26** | — | review | |
| **27** | **f** | new | as in fun |
| **28** | — | review | |
| **29** | **ee** | new | team /iː/, as in see — long e (macron on single e already taught) |
| **30** | — | review | 20-sound review |
| **31** | **k** | new | as in kite — c already taught at 11, now the other /k/ letter |
| **32** | — | review | |
| **33** | **w** | new | as in wet |
| **34** | — | review | |
| **35** | **th** | new | team /θ/, as in think (voiceless) |
| **36** | — | review | |
| **37** | **ō** | new | long o /oʊ/, as in go — macron |
| **38** | — | review | |
| **39** | **j** | new | as in jam |
| **40** | — | review | **milestone: 40 lessons** |
| **41** | **v** | new | as in van |
| **42** | — | review | |
| **43** | **ā** | new | long a /eɪ/, as in cake — macron |
| **44** | — | review | |
| **45** | **y** | new | as in yes (consonant y) |
| **46** | — | review | |
| **47** | **z** | new | as in zip |
| **48** | — | review | |
| **49** | **qu** | new | team /kw/, as in quit |
| **50** | — | review | **milestone: 50 lessons** |
| **51** | **x** | new | /ks/, as in box |
| **52** | — | review | |
| **53** | **ch** | new | team /tʃ/, as in chip |
| **54** | — | review | |
| **55** | **ī** | new | long i /aɪ/, as in kite — macron |
| **56** | — | review | |
| **57** | **er** | new | r-controlled /ɝː/, as in her |
| **58** | — | review | |
| **59** | **oo** | new | team /uː/, as in moon |
| **60** | — | review | **milestone: 60 lessons** |
| **61** | **ng** | new | team /ŋ/, as in sing |
| **62** | — | review | |
| **63** | **ū** | new | long u /juː/, as in cube — macron |
| **64** | — | review | |
| **65** | **oy** | new | team /ɔɪ/, as in boy |
| **66** | — | review | |
| **67** | **wh** | new | team /w/ (simplified: treat as /w/ for v1) |
| **68** | — | review | |
| **69** | **ar** | new | r-controlled /ɑːr/, as in car |
| **70** | — | review | **milestone: 70 lessons** |
| **71–100** | — | fluency & consolidation | no new sounds; longer passages, more complex words |

### Total: 40 sounds across 100 lessons (10 done + 30 to author)

### Confusable separation (minimum gap)
| Pair | Gap | Why |
|------|-----|-----|
| d (7) → b (25) | 18 lessons | visual confusion |
| p (3) → b (25) | 22 lessons | visual + voicing |
| s (1) → sh (17) | 16 lessons | sound similarity |
| f (27) → v (41) | 14 lessons | articulation similarity |
| c (11) → k (31) | 20 lessons | same sound, different letter |
| th (35) → ch (53) | 18 lessons | both postalveolar/palatal fricatives |
| w (33) → v (41) | 8 lessons | lip shape (acceptable — sounds are distinct) |

---

## 2. Lesson Templates

### Template A: New Sound Lesson (odd lessons 11–69)

```json
{
  "lesson": N,
  "newSoundIds": ["SOUND"],
  "tasks": [
    { "type": "newSound", "soundId": "SOUND", "script": [ ... ] },
    { "type": "soundReview", "soundIds": [ ... ], "script": [ ... ] },
    { "type": "blend", "wordIds": [ ... ], "script": [ ... ] },
    { "type": "wordRead", "wordIds": [ ... ], "script": [ ... ] },
    { "type": "sentenceRead", "text": [ ... ], "script": [ ... ] }
  ]
}
```

**Task rules for Template A:**

| Task | Quantity | Rules |
|------|----------|-------|
| newSound | 1 | Always first. 3–4 script lines: point, model, child repeats, praise. |
| soundReview | 1 | 4–8 previously-taught sounds. MUST include the new sound. Select from most-recently-introduced first, then high-utility. |
| blend | 1 | 2–3 words. At least ONE word contains the new sound. All words must be decodable (only sounds taught ≤ this lesson). |
| wordRead | 1 | 4–6 words. Mix: ≥2 contain the new sound, rest are review words. |
| sentenceRead | 1 | 1–2 sentences. 5–8 words per sentence. ALL words decodable. Topic: concrete, child-friendly (animals, food, body, home, weather, toys). |

**Script tone:** Imperative to the parent ("Point to…", "Ask:…", "If they pause…").
Short lines. One instruction per line. Celebrate progress ("Great job!", "You're doing amazing!").

### Template B: Review Lesson (even lessons 12–70)

```json
{
  "lesson": N,
  "newSoundIds": [],
  "tasks": [
    { "type": "soundReview", "soundIds": [ ... ], "script": [ ... ] },
    { "type": "blend", "wordIds": [ ... ], "script": [ ... ] },
    { "type": "wordRead", "wordIds": [ ... ], "script": [ ... ] },
    { "type": "sentenceRead", "text": [ ... ], "script": [ ... ] }
  ]
}
```

**Task rules for Template B:**

| Task | Quantity | Rules |
|------|----------|-------|
| soundReview | 1 | 6–10 sounds. Rotate through recently-taught sounds. No new sounds. |
| blend | 1 | 3–4 words. Mix of simple (CVC) and slightly more complex (CVCC, team blends). |
| wordRead | 1 | 6–8 words. Broader mix — pull from the full word bank of decodable words. |
| sentenceRead | 1 | 2 sentences. 6–10 words each. Slightly longer than Template A. |

**Milestone reviews (lessons 20, 40, 50, 60, 70):**
- soundReview: 8–10 sounds (wider sweep)
- Add a "celebration" script line: "You've finished N lessons!"
- Sentences can be slightly longer (8–10 words)

### Template C: Fluency Lesson (lessons 71–100)

No new sounds. Focus on speed, fluency, and longer passages.

```json
{
  "lesson": N,
  "newSoundIds": [],
  "tasks": [
    { "type": "soundReview", "soundIds": [ ... ], "script": [ ... ] },
    { "type": "blend", "wordIds": [ ... ], "script": [ ... ] },
    { "type": "wordRead", "wordIds": [ ... ], "script": [ ... ] },
    { "type": "sentenceRead", "text": [ ... ], "script": [ ... ] }
  ]
}
```

**Differences from Template B:**
- `blend`: 4 words, include team blends (sh, th, ch, ee, oo, oy, ar, er)
- `wordRead`: 8–10 words, mix of 2–4 syllable words
- `sentenceRead`: 2–3 sentences, 8–12 words each. Short narrative arc
  (beginning → middle → end). Tell a mini-story.
- Script: encourage speed ("Read it again — can you go faster?")

---

## 3. Review Volume Progression

| Lesson range | soundReview count | Rationale |
|-------------|-------------------|-----------|
| 11–20 | 4–5 sounds | Small set, solidify basics |
| 21–30 | 5–6 sounds | Growing |
| 31–40 | 6–7 sounds | |
| 41–50 | 7–8 sounds | |
| 51–60 | 8 sounds | |
| 61–70 | 8–10 sounds | Full sweep before fluency phase |
| 71–100 | 8–10 sounds | Maintain, rotate focus |

**Selection strategy for review sounds:**
1. Always include the 2–3 most recently introduced sounds
2. Fill remaining slots with high-utility sounds (s, t, p, n, m, r, l, a, i, o, u)
3. Occasionally (every ~5 lessons) sweep a "wide net" including older sounds
4. Never review a sound that hasn't been introduced yet

---

## 4. Word & Sentence Complexity Progression

| Lesson range | Word complexity | Sentence length | Notes |
|-------------|----------------|-----------------|-------|
| 11–20 | CVC, CVNC (3–4 letters) | 5–6 words | Simple, concrete |
| 21–30 | CVC, CVNC, CVCe intro | 6–7 words | |
| 31–40 | Add team blends (sh, ee) | 7–8 words | |
| 41–50 | Add th, long vowels (macron) | 7–8 words | |
| 51–60 | Add ch, oo, qu, x | 8–9 words | |
| 61–70 | Add r-controlled (er, ar), ng, oy | 8–10 words | |
| 71–100 | All sounds, 2–3 syllable words | 8–12 words | Short stories |

**Word selection rules:**
- Every word must be in `words.json` (or be added to it during authoring)
- Every grapheme in a word must reference a sound with `introducedInLesson` ≤ current lesson
- Prefer high-frequency words (the child will encounter them in real reading)
- Avoid proper nouns (except very common ones like "Mom", "Dad" — already in bank)
- Avoid words where the spelling is irregular for the sounds taught (e.g., don't use "come" until u can be taught as /ʌ/ in that context)

**Sentence rules:**
- Decodable: every word uses only taught sounds
- Concrete and visual (a child can picture it)
- Topics rotate: animals, food, family, body parts, weather, school, toys, nature, home, feelings
- No abstract concepts in sentences before lesson 50
- Sentences should make sense (not just word lists)

---

## 5. Orthography Fade-Out Schedule

As lessons progress, the *content* stops using orthographic annotations. The
renderer doesn't change — the JSON simply stops marking things.

| Annotation | Fully used through | Phases out during | Gone by |
|-----------|--------------------|--------------------|---------|
| Macron (long vowels) | Lesson 40 | 41–55 | Lesson 60 |
| Silent letters | Lesson 30 | 31–50 | Lesson 55 |
| Team arcs (sh, th, ch, ee, oo, oy, etc.) | Lesson 50 | 51–70 | Lesson 75 |

**Practical rule for the author:**
- Lessons 11–40: Use macrons on long vowels, mark silent letters, arc all teams.
- Lessons 41–60: Stop adding new macrons. Existing long-vowel words in review
  can still show macrons. No new silent-letter words introduced.
- Lessons 61–75: Phase out team arcs. Words with teams still render correctly
  but without the visual arc annotation.
- Lessons 76–100: Clean text. No orthographic markup at all. The child is
  reading fluently.

In practice, this means: when adding new words to `words.json` for lessons 60+,
you can omit `macron: true`, `silent: true`, `team: true` flags. The word still
works — the annotations are visual aids, not structural.

---

## 6. New Sounds to Add to sounds.json

The following sounds need entries added (beyond the existing 11):

```
c, g, r, u, l, h, b, f, ee, k, w, th, ō, j, v, ā, y, z, qu, x, ch, ī, er, oo, ng, ū, oy, wh, ar
```

Format (follow existing entries in sounds.json):
```json
{ "id": "c", "display": "c", "hint": "as in cat", "introducedInLesson": 11,
  "sayItScript": "This sound is k. Say it with me: k." }
```

Teams: add `"team": true`. Long vowels: add `"macron": true` and use the
diacritic in `display` (ō, ā, ī, ū).

**Say-it script patterns:**
- Consonants: "This sound is [sound]. Say it with me: [sound]."
- Short vowels: "This sound is [vowel]. Say it with me: [vowel]."
- Long vowels (macron): "This sound is [vowel name]. The line on top means it says its name. Say it with me: [vowel name]."
- Teams: "This sound is [team]. Say it with me: [team]."
- Special (th): "This sound is th. Put your tongue between your teeth. Say it with me: th."
- Special (qu): "These two letters make one sound: kw. Say it with me: kw."

---

## 7. Words to Add to words.json

You will need to add new words as you author lessons. Rules:
- Word `id` = the lowercase word itself (e.g., `"id": "cat"`)
- `graphemes` array decomposes the word into its sound units
- Each grapheme: `{ "g": "c", "soundId": "c" }`
- Teams: `{ "g": "sh", "soundId": "sh", "team": true }`
- Macron: `{ "g": "o", "soundId": "ō", "macron": true }`
- Silent: `{ "g": "e", "silent": true }`
- A word can only be USED in a lesson if ALL its `soundId` values have
  `introducedInLesson` ≤ that lesson's number

**Target word count by lesson:**
| Lesson | Total words in bank |
|--------|---------------------|
| 20 | ~70 |
| 40 | ~120 |
| 60 | ~180 |
| 80 | ~230 |
| 100 | ~280–300 |

---

## 8. Batching Instructions for the Author

Work in batches of **10 lessons** (one batch = one "session"). For each batch:

1. **Add new sounds** to `sounds.json` (if the batch includes new-sound lessons)
2. **Add new words** to `words.json` (the words you'll use in those 10 lessons)
3. **Author the 10 lesson files** in `src/content/lessons/`
   - Naming: `lesson-011.json` through `lesson-020.json` (3-digit zero-padded)
4. **Run the validator:** `npm run validate` — must pass with zero errors
5. **Run tests:** `npm test` — must pass
6. **Run typecheck:** `npx tsc --noEmit` — must be clean

If the validator fails, fix the content (not the validator). Common errors:
- Word references a sound not yet introduced → pick a different word or move it to a later lesson
- Word not in `words.json` → add it
- Missing review task → every lesson must have a `soundReview` task

### Batch list

| Batch | Lessons | New sounds in batch |
|-------|---------|-------------------|
| 1 | 11–20 | c, g, r, sh, u |
| 2 | 21–30 | l, h, b, f, ee |
| 3 | 31–40 | k, w, th, ō, j |
| 4 | 41–50 | v, ā, y, z, qu |
| 5 | 51–60 | x, ch, ī, er, oo |
| 6 | 61–70 | ng, ū, oy, wh, ar |
| 7 | 71–80 | (fluency) |
| 8 | 81–90 | (fluency) |
| 9 | 91–100 | (fluency) |

---

## 9. Content Originality Rules

- **NEVER** copy word lists, sentence text, or script wording from "Teach Your
  Child to Read in 100 Lessons" or any other published phonics program.
- Our sound ORDER is different (starts s, a, t, p, i, n, m, d, ē, o).
- Sentences must be invented fresh. Use the topic rotation in §4.
- Scripts must be in our voice: warm, direct, short imperatives.
- If you find yourself writing a sentence that feels like it could be from a
  published book, rewrite it.

**Self-check:** After each batch, read the sentences aloud. Do they sound
natural and original? Would a parent recognize them from a specific book?

---

## 10. Quality Checklist (per lesson)

Before marking a batch done, verify each lesson:

- [ ] `newSoundIds` is correct (empty array for review/fluency lessons)
- [ ] Every task has non-empty `script` array
- [ ] `soundReview` exists in every lesson
- [ ] All `wordIds` exist in `words.json`
- [ ] All words are decodable (validator confirms)
- [ ] Sentences make semantic sense (not just decodable word lists)
- [ ] Script is imperative to the parent, warm tone
- [ ] No word uses a sound introduced AFTER this lesson
- [ ] File naming is `lesson-NNN.json` (3-digit, zero-padded)
- [ ] JSON is valid (no trailing commas, no comments)
