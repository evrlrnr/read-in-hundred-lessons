# Deck Algorithm Spec (H-B1) — M5 practice deck

Pins plan §6 as **numbered deterministic rules** + 3 scripted scenarios with exact
expected outputs. This is the contract for `L-C1` (implement the deck as a pure
function) and its tests. No SRS library — deterministic and simple.

## Inputs
- `profile.flags.sounds: string[]`, `profile.flags.words: string[]`
- `profile.lessonHistory: { lesson, completedAt, repeated }[]` (completion order)
- `profile.practiceStats: Record<itemId, { seen, missed, streak }>`
- Content: `sounds` (with `introducedInLesson`), `lessons` (with `newSoundIds`)

A **card** is `{ type: 'sound' | 'word', id }`. `seen` = total exposures
("Got it" + "Needs work"); `missed` = count of "Needs work"; so `missed/seen` = miss rate.

## Rules (build order = priority)
1. **Flagged** — every id in `flags.sounds` (as sound cards) and `flags.words`
   (as word cards). Always included.
2. **Recent** — sounds introduced in the **last 3 completed lessons**
   (`lessonHistory.slice(-3)` → union of their `newSoundIds`), as sound cards.
   Deduped against rule 1.
3. **Struggling** — any `practiceStats` item **not** already in rules 1–2 with
   `seen >= 4` **and** `missed / seen >= 0.5`. Type resolved by lookup
   (sound list first, then word list).

### The `seen < 4` ambiguity (resolved)
Plan §6 says "over its last 4 practice exposures", but the v1 schema stores only
aggregate `{ seen, missed, streak }` — no per-exposure history — so a true 4-item
window is not computable without a schema migration. **Decision:** treat "last 4"
as a **data-sufficiency gate**: an item is judged only once `seen >= 4`, then by its
overall `missed/seen` ratio. Rationale: small samples (1–3 exposures) are noisy, so
we don't over-react; after 4+ exposures the aggregate rate is the signal. This keeps
the v1 schema (no migration) and stays deterministic.
*Alternative (deferred):* a v2 schema storing the last-4 outcomes per item for a true
sliding window. Not needed for M5.

## Cap, priority, shuffle
- Fill the deck **rule 1 → rule 2 → rule 3**, stopping at **15 cards**.
- Within each rule, order is a **deterministic seeded shuffle**: mulberry32 PRNG +
  Fisher–Yates, seeded by `seed` (production: a date/counter; tests: a fixed seed).
- If a rule alone exceeds the remaining slots, only its first (shuffled) items fill in.

## Card outcome (practice interaction)
- **Got it:** `seen++`, `streak++`. If `streak >= 2` → clear the item's flag, `streak = 0`.
- **Needs work:** `seen++`, `missed++`, `streak = 0`, and ensure the item is flagged
  (so it stays in the deck).

## Scenarios (seed = 1) — exact expected output
Computed by `__deck_scratch.mjs` (same algorithm). `L-C1` tests must reproduce these.

**A — mixed, under cap** (tests dedup, `seen<4` gate, miss-rate gate)
- flags: sounds `[e_long]`, words `[pan]`
- lessonHistory: lessons 8, 9, 10 → recent sounds `[e_long, o]`
- practiceStats: `tap {4,2}` (in), `sit {4,1}` (out, 0.25), `mat {2,2}` (out, seen<4),
  `e_long {6,3}` (deduped — already flagged)
- **Expected (4):** `sound:e_long, word:pan, sound:o, word:tap`

**B — over cap** (18 flagged → exactly 15, all rule 1)
- flags: 10 sounds `[s,a,t,p,i,n,m,d,e_long,o]` + 8 words `[sat,tap,pan,sit,mat,man,dad,sand]`
- lessonHistory: `[]`, practiceStats: `{}`
- **Expected (15):** `sound:a, sound:o, sound:m, sound:n, sound:t, word:dad, word:sat,
  word:pan, word:man, sound:i, word:sand, sound:d, sound:p, word:sit, word:mat`

**C — empty**
- flags: `[]`, lessonHistory: `[]`, practiceStats: `{}`
- **Expected (0):** `(empty)`

## Notes
- **Type collision:** sound `a` and word `a` share an id. Rule 3 resolves type by
  sound-first lookup; rules 1–2 carry their type from the source list. Scenarios avoid
  the collision; `L-C1` should add a test for it.
- The deck is a **pure function** `buildDeck(state, content, seed) -> Card[]` — no
  React, no DOM, testable under `node --test`.
