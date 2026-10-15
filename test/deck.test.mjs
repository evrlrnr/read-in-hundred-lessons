import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDeck, applyOutcome } from '../src/lib/deck.ts';

// ---- content fixtures (minimal, matching the real content shape) ----------

const sounds = [
  { id: 's', display: 's', hint: '', introducedInLesson: 1, sayItScript: '' },
  { id: 'a', display: 'a', hint: '', introducedInLesson: 1, sayItScript: '' },
  { id: 't', display: 't', hint: '', introducedInLesson: 2, sayItScript: '' },
  { id: 'p', display: 'p', hint: '', introducedInLesson: 3, sayItScript: '' },
  { id: 'i', display: 'i', hint: '', introducedInLesson: 4, sayItScript: '' },
  { id: 'n', display: 'n', hint: '', introducedInLesson: 5, sayItScript: '' },
  { id: 'm', display: 'm', hint: '', introducedInLesson: 6, sayItScript: '' },
  { id: 'd', display: 'd', hint: '', introducedInLesson: 7, sayItScript: '' },
  { id: 'e_long', display: 'ē', hint: '', introducedInLesson: 8, sayItScript: '' },
  { id: 'o', display: 'o', hint: '', introducedInLesson: 9, sayItScript: '' },
];

const lessons = [
  { lesson: 1, newSoundIds: ['s', 'a'], tasks: [] },
  { lesson: 2, newSoundIds: ['t'], tasks: [] },
  { lesson: 3, newSoundIds: ['p'], tasks: [] },
  { lesson: 4, newSoundIds: ['i'], tasks: [] },
  { lesson: 5, newSoundIds: ['n'], tasks: [] },
  { lesson: 6, newSoundIds: ['m'], tasks: [] },
  { lesson: 7, newSoundIds: ['d'], tasks: [] },
  { lesson: 8, newSoundIds: ['e_long'], tasks: [] },
  { lesson: 9, newSoundIds: ['o'], tasks: [] },
  { lesson: 10, newSoundIds: [], tasks: [] },
];

const content = { sounds, words: [{ id: 'a', graphemes: [] }, { id: 'tap', graphemes: [] }, { id: 'pan', graphemes: [] }, { id: 'sit', graphemes: [] }, { id: 'mat', graphemes: [] }], lessons };

function makeProfile(overrides = {}) {
  return {
    id: 'p1',
    name: 'Test',
    createdAt: '2026-01-01T00:00:00.000Z',
    currentLesson: 1,
    lessonHistory: [],
    flags: { sounds: [], words: [] },
    practiceStats: {},
    ...overrides,
  };
}

function cardKey(c) {
  return `${c.type}:${c.id}`;
}

// ---- Scenario A: mixed, under cap -----------------------------------------

test('Scenario A — mixed, under cap (dedup, seen<4 gate, miss-rate gate)', () => {
  const profile = makeProfile({
    flags: { sounds: ['e_long'], words: ['pan'] },
    lessonHistory: [
      { lesson: 8, completedAt: '2026-01-01', repeated: false },
      { lesson: 9, completedAt: '2026-01-02', repeated: false },
      { lesson: 10, completedAt: '2026-01-03', repeated: false },
    ],
    practiceStats: {
      tap: { seen: 4, missed: 2, streak: 0 },   // in: seen>=4, rate=0.5
      sit: { seen: 4, missed: 1, streak: 0 },   // out: rate=0.25
      mat: { seen: 2, missed: 2, streak: 0 },   // out: seen<4
      e_long: { seen: 6, missed: 3, streak: 0 }, // deduped (already flagged)
    },
  });

  const deck = buildDeck(profile, content, 1);
  const keys = deck.map(cardKey);

  assert.equal(keys.length, 4);
  assert.deepEqual(keys, ['sound:e_long', 'word:pan', 'sound:o', 'word:tap']);
});

// ---- Scenario B: over cap -------------------------------------------------

test('Scenario B — over cap (18 flagged → exactly 15, all rule 1)', () => {
  const profile = makeProfile({
    flags: {
      sounds: ['s', 'a', 't', 'p', 'i', 'n', 'm', 'd', 'e_long', 'o'],
      words: ['sat', 'tap', 'pan', 'sit', 'mat', 'man', 'dad', 'sand'],
    },
    lessonHistory: [],
    practiceStats: {},
  });

  const deck = buildDeck(profile, content, 1);
  const keys = deck.map(cardKey);

  assert.equal(keys.length, 15);
  assert.deepEqual(keys, [
    'sound:a', 'sound:o', 'sound:m', 'sound:n', 'sound:t',
    'word:dad', 'word:sat', 'word:pan', 'word:man', 'sound:i',
    'word:sand', 'sound:d', 'sound:p', 'word:sit', 'word:mat',
  ]);
});

// ---- Scenario C: empty ----------------------------------------------------

test('Scenario C — empty (no flags, no history, no stats)', () => {
  const profile = makeProfile();
  const deck = buildDeck(profile, content, 1);
  assert.equal(deck.length, 0);
});

// ---- Type collision: sound "a" and word "a" share an id -------------------

test('Type collision — practiceStats "a" resolves to sound (sound-first lookup)', () => {
  // "a" is in the sounds list, so practiceStats["a"] resolves to type "sound".
  // If sound:a is already flagged (rule 1), the rule-3 entry is deduped.
  const profile = makeProfile({
    flags: { sounds: ['a'], words: [] },
    lessonHistory: [],
    practiceStats: {
      a: { seen: 5, missed: 3, streak: 0 }, // resolves to sound:a → deduped
    },
  });

  const deck = buildDeck(profile, content, 1);
  const keys = deck.map(cardKey);

  assert.ok(keys.includes('sound:a'), 'sound:a should be in deck (flagged)');
  assert.ok(!keys.includes('word:a'), 'word:a should NOT appear (id resolves to sound)');
  assert.equal(keys.length, 1, 'only one card for the colliding id');
});

test('Type collision — word "a" flagged + practiceStats "a" resolves to sound', () => {
  // word:a is flagged (rule 1, type from source list).
  // practiceStats["a"] resolves to sound:a (sound-first) → different key → included in rule 3.
  const profile = makeProfile({
    flags: { sounds: [], words: ['a'] },
    lessonHistory: [],
    practiceStats: {
      a: { seen: 5, missed: 3, streak: 0 }, // resolves to sound:a
    },
  });

  const deck = buildDeck(profile, content, 1);
  const keys = deck.map(cardKey);

  assert.ok(keys.includes('word:a'), 'word:a should be in deck (flagged as word)');
  assert.ok(keys.includes('sound:a'), 'sound:a should be in deck (rule 3, sound-first resolution)');
  assert.equal(keys.length, 2);
});

// ---- applyOutcome: "got" twice clears flag --------------------------------

test('applyOutcome — "got" twice clears the flag', () => {
  const profile = makeProfile({
    flags: { sounds: ['s'], words: [] },
    practiceStats: { s: { seen: 0, missed: 0, streak: 0 } },
  });

  const card = { type: 'sound', id: 's' };
  const p1 = applyOutcome(profile, card, 'got');
  assert.equal(p1.practiceStats.s.streak, 1);
  assert.ok(p1.flags.sounds.includes('s'), 'flag still present after 1 "got"');

  const p2 = applyOutcome(p1, card, 'got');
  assert.equal(p2.practiceStats.s.streak, 0, 'streak resets after clearing');
  assert.equal(p2.practiceStats.s.seen, 2);
  assert.ok(!p2.flags.sounds.includes('s'), 'flag cleared after 2 consecutive "got"');
});

// ---- applyOutcome: "missed" re-flags and resets streak --------------------

test('applyOutcome — "missed" re-flags and resets streak', () => {
  const profile = makeProfile({
    flags: { sounds: [], words: [] },
    practiceStats: { s: { seen: 3, missed: 1, streak: 1 } },
  });

  const card = { type: 'sound', id: 's' };
  const p1 = applyOutcome(profile, card, 'missed');
  assert.equal(p1.practiceStats.s.seen, 4);
  assert.equal(p1.practiceStats.s.missed, 2);
  assert.equal(p1.practiceStats.s.streak, 0);
  assert.ok(p1.flags.sounds.includes('s'), 'item is now flagged');
});

// ---- applyOutcome: "got" on unflagged item just increments ----------------

test('applyOutcome — "got" on unflagged item increments without flag change', () => {
  const profile = makeProfile({
    flags: { sounds: [], words: [] },
    practiceStats: { t: { seen: 0, missed: 0, streak: 0 } },
  });

  const card = { type: 'sound', id: 't' };
  const p1 = applyOutcome(profile, card, 'got');
  assert.equal(p1.practiceStats.t.seen, 1);
  assert.equal(p1.practiceStats.t.streak, 1);
  assert.deepEqual(p1.flags.sounds, []);
});
