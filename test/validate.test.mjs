import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { validateContent, validateWarnings, loadContent } from '../scripts/validate.mjs';

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

test('warning: sound planned beyond the highest authored lesson is flagged', () => {
  // "sh" is planned for lesson 17, but only 10 lessons are authored.
  const warnings = validateWarnings(sounds, words, lessons);
  assert.ok(
    warnings.some((w) => w.includes('sh') && w.includes('lesson 17')),
    'expected a warning for the planned-but-unauthored sound "sh"'
  );
});

test('warning: reserve word not used by any lesson is flagged', () => {
  // "ship" is in the bank but no lesson references it.
  const warnings = validateWarnings(sounds, words, lessons);
  assert.ok(
    warnings.some((w) => w.includes('ship') && w.includes('reserve word')),
    'expected a warning for the reserve word "ship"'
  );
});

test('warnings do not fail validation: real content still has zero errors', () => {
  assert.deepEqual(validateContent(sounds, words, lessons), []);
});
