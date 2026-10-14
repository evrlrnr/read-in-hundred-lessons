import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { validateContent, loadContent } from '../scripts/validate.mjs';

const contentDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content');
const { sounds, words, lessons } = loadContent(contentDir);

test('real content: all 10 lessons pass validation', () => {
  const errors = validateContent(sounds, words, lessons);
  assert.deepEqual(errors, []);
  assert.equal(lessons.length, 10);
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
