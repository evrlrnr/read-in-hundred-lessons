import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyState,
  addProfile,
  deleteProfile,
  completeLesson,
  toggleSoundFlag,
  toggleWordFlag,
  exportState,
  importState,
  mergeProfiles,
} from '../src/lib/progress.ts';

test('round-trip: export then import restores state exactly', () => {
  const state = {
    version: 1,
    activeProfileId: 'p1',
    profiles: [
      {
        id: 'p1',
        name: 'Ada',
        createdAt: '2026-07-07T00:00:00.000Z',
        currentLesson: 12,
        lessonHistory: [{ lesson: 11, completedAt: '2026-07-07T00:00:00.000Z', repeated: false }],
        flags: { sounds: ['ee'], words: ['seat'] },
        practiceStats: { seat: { seen: 4, missed: 2, streak: 0 } },
      },
    ],
  };
  const result = importState(exportState(state));
  assert.equal(result.ok, true);
  assert.deepEqual(result.state, state);
});

test('addProfile sets the active profile on first add', () => {
  const s = addProfile(emptyState(), 'Ada');
  assert.equal(s.profiles.length, 1);
  assert.equal(s.activeProfileId, s.profiles[0].id);
  assert.equal(s.profiles[0].name, 'Ada');
  assert.equal(s.profiles[0].currentLesson, 1);
});

test('toggleSoundFlag adds then removes', () => {
  const s1 = addProfile(emptyState(), 'Ada');
  const id = s1.profiles[0].id;
  assert.deepEqual(toggleSoundFlag(s1, id, 'ee').profiles[0].flags.sounds, ['ee']);
  assert.deepEqual(toggleSoundFlag(toggleSoundFlag(s1, id, 'ee'), id, 'ee').profiles[0].flags.sounds, []);
});

test('toggleWordFlag adds then removes', () => {
  const s1 = addProfile(emptyState(), 'Ada');
  const id = s1.profiles[0].id;
  assert.deepEqual(toggleWordFlag(s1, id, 'seat').profiles[0].flags.words, ['seat']);
});

test('completeLesson advances currentLesson and records history', () => {
  const s1 = addProfile(emptyState(), 'Ada');
  const id = s1.profiles[0].id;
  const s2 = completeLesson(s1, id, 1);
  assert.equal(s2.profiles[0].currentLesson, 2);
  assert.equal(s2.profiles[0].lessonHistory.length, 1);
  assert.equal(s2.profiles[0].lessonHistory[0].lesson, 1);
});

test('deleteProfile reassigns activeProfileId when deleting the active one', () => {
  const s1 = addProfile(emptyState(), 'Ada');
  const s2 = addProfile(s1, 'Bob');
  const id = s1.profiles[0].id;
  const s3 = deleteProfile(s2, id);
  assert.equal(s3.profiles.length, 1);
  assert.notEqual(s3.activeProfileId, id);
});

test('import rejects invalid JSON', () => {
  assert.equal(importState('not json').ok, false);
});

test('import rejects unsupported version', () => {
  assert.equal(importState(JSON.stringify({ version: 99, profiles: [] })).ok, false);
});

test('import rejects a profile missing required fields', () => {
  assert.equal(importState(JSON.stringify({ version: 1, profiles: [{ id: 'p1' }] })).ok, false);
});

test('mergeProfiles re-mints ids on collision so both profiles are kept', () => {
  const a = addProfile(emptyState(), 'Ada');
  const b = addProfile(emptyState(), 'Ada');
  const bSameId = { ...b, profiles: b.profiles.map((p) => ({ ...p, id: a.profiles[0].id })) };
  const merged = mergeProfiles(a, bSameId);
  assert.equal(merged.profiles.length, 2);
  assert.notEqual(merged.profiles[0].id, merged.profiles[1].id);
});
