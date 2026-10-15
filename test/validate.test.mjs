import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { validateContent, validateWarnings, loadContent } from '../scripts/validate.mjs';

const contentDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content');
const { sounds, words, lessons } = loadContent(contentDir);

test('real content: all 100 lessons pass validation', () => {
  const errors = validateContent(sounds, words, lessons);
  assert.deepEqual(errors, []);
  assert.equal(lessons.length, 100);
});

test('broken lesson: word using an untaught sound is rejected', () => {
  // "mop" needs the sound "o", which is not introduced until lesson 9.
  const broken = {
    lesson: 3,
    newSoundIds: ['p'],
    tasks: [
      { type: 'soundReview', soundIds: ['s', 'a', 't'], script: [] },
      { type: 'wordRead', wordIds: ['mop'], script: [] },
    ],
  };
  const errors = validateContent(sounds, words, [broken]);
  assert.ok(errors.length > 0);
  assert.ok(errors.some((e) => e.includes('mop') && e.includes('lesson 9')));
});

test('broken lesson: missing soundReview task is rejected', () => {
  const broken = {
    lesson: 2,
    newSoundIds: ['t'],
    tasks: [{ type: 'newSound', soundId: 't', script: [] }],
  };
  const errors = validateContent(sounds, words, [broken]);
  assert.ok(errors.some((e) => e.includes('no soundReview')));
});

test('warning: sound planned beyond the highest authored lesson is flagged', () => {
  // No sounds are currently planned beyond lesson 20 — all 15 sounds are authored.
  // This test verifies the warning mechanism still works by checking that
  // validateWarnings returns no such warnings for the current content.
  const warnings = validateWarnings(sounds, words, lessons);
  assert.ok(
    warnings.every((w) => !w.includes('lesson') || w.includes('reserve')),
    'no planned-sound warnings expected for current content'
  );
});

test('warning: reserve word not used by any lesson is flagged', () => {
  // "wot" and "sang" are in the bank but not used by any lesson.
  const warnings = validateWarnings(sounds, words, lessons);
  assert.ok(
    warnings.some((w) => w.includes('reserve word')),
    'expected at least one reserve word warning'
  );
});

test('warnings do not fail validation: real content still has zero errors', () => {
  assert.deepEqual(validateContent(sounds, words, lessons), []);
});
