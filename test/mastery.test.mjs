import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getMasteryState, getMasteryGrid } from '../src/lib/mastery.ts';

const sounds = [
  { id: 's', display: 's', hint: '', introducedInLesson: 1, sayItScript: '' },
  { id: 'a', display: 'a', hint: '', introducedInLesson: 1, sayItScript: '' },
  { id: 't', display: 't', hint: '', introducedInLesson: 2, sayItScript: '' },
  { id: 'p', display: 'p', hint: '', introducedInLesson: 3, sayItScript: '' },
  { id: 'e_long', display: 'ē', hint: '', introducedInLesson: 8, sayItScript: '' },
];

function makeProfile(overrides = {}) {
  return {
    id: 'p1',
    name: 'Test',
    createdAt: '2026-01-01T00:00:00.000Z',
    currentLesson: 5,
    lessonHistory: [],
    flags: { sounds: [], words: [] },
    practiceStats: {},
    ...overrides,
  };
}

test('mastery: unpracticed sound is "new"', () => {
  const profile = makeProfile();
  assert.equal(getMasteryState(sounds[0], profile), 'new');
});

test('mastery: flagged sound is "learning" even with good stats', () => {
  const profile = makeProfile({
    flags: { sounds: ['s'], words: [] },
    practiceStats: { s: { seen: 6, missed: 1, streak: 0 } },
  });
  assert.equal(getMasteryState(sounds[0], profile), 'learning');
});

test('mastery: seen>=4 with low miss rate is "mastered"', () => {
  const profile = makeProfile({
    practiceStats: { s: { seen: 5, missed: 1, streak: 0 } }, // rate = 0.2
  });
  assert.equal(getMasteryState(sounds[0], profile), 'mastered');
});

test('mastery: seen>=4 with high miss rate is "learning"', () => {
  const profile = makeProfile({
    practiceStats: { s: { seen: 4, missed: 2, streak: 0 } }, // rate = 0.5
  });
  assert.equal(getMasteryState(sounds[0], profile), 'learning');
});

test('mastery: seen<4 is "learning" regardless of miss rate', () => {
  const profile = makeProfile({
    practiceStats: { s: { seen: 3, missed: 0, streak: 0 } },
  });
  assert.equal(getMasteryState(sounds[0], profile), 'learning');
});

test('mastery: sound not yet introduced is "new"', () => {
  // e_long is introduced in lesson 8, child is on lesson 5
  const profile = makeProfile({
    practiceStats: { e_long: { seen: 10, missed: 0, streak: 0 } },
  });
  assert.equal(getMasteryState(sounds[4], profile), 'new');
});

test('mastery grid: only includes introduced sounds', () => {
  const profile = makeProfile({ currentLesson: 3 });
  const grid = getMasteryGrid(sounds, profile);
  // s(1), a(1), t(2), p(3) are introduced; e_long(8) is not
  assert.equal(grid.length, 4);
  assert.ok(grid.every((g) => g.sound.introducedInLesson <= 3));
});
