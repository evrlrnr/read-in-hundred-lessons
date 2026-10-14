import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, join, dirname } from 'node:path';

// Returns a list of error strings; empty list = content is valid.
export function validateContent(sounds, words, lessons) {
  const errors = [];
  const soundLesson = new Map(sounds.map((s) => [s.id, s.introducedInLesson]));
  const wordMap = new Map(words.map((w) => [w.id, w]));

  for (const lesson of [...lessons].sort((a, b) => a.lesson - b.lesson)) {
    const n = lesson.lesson;

    if (!lesson.tasks.some((t) => t.type === 'soundReview')) {
      errors.push(`lesson ${n}: has no soundReview task (cumulative review is required)`);
    }

    for (const id of lesson.newSoundIds ?? []) {
      if (soundLesson.get(id) !== n) {
        errors.push(`lesson ${n}: newSoundId "${id}" is not marked introducedInLesson ${n} in sounds.json`);
      }
    }

    const wordIds = [];
    for (const task of lesson.tasks) {
      if (task.wordIds) wordIds.push(...task.wordIds);
      if (task.text) for (const sentence of task.text) wordIds.push(...sentence);
      const soundIds = task.soundIds ?? (task.soundId ? [task.soundId] : []);
      for (const id of soundIds) {
        const intro = soundLesson.get(id);
        if (intro === undefined) errors.push(`lesson ${n}: unknown sound "${id}"`);
        else if (intro > n) errors.push(`lesson ${n}: sound "${id}" used before it is introduced (lesson ${intro})`);
      }
    }

    for (const id of wordIds) {
      const word = wordMap.get(id);
      if (!word) {
        errors.push(`lesson ${n}: unknown word "${id}"`);
        continue;
      }
      for (const g of word.graphemes) {
        if (g.silent) continue;
        const intro = soundLesson.get(g.soundId);
        if (intro === undefined) errors.push(`word "${id}": grapheme "${g.g}" has unknown sound "${g.soundId}"`);
        else if (intro > n) errors.push(`lesson ${n}: word "${id}" uses sound "${g.soundId}" not taught until lesson ${intro}`);
      }
    }
  }
  return errors;
}

export function loadContent(contentDir) {
  const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
  const sounds = read(join(contentDir, 'sounds.json'));
  const words = read(join(contentDir, 'words.json'));
  const lessonDir = join(contentDir, 'lessons');
  const lessons = readdirSync(lessonDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => read(join(lessonDir, f)));
  return { sounds, words, lessons };
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const contentDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content');
  const { sounds, words, lessons } = loadContent(contentDir);
  const errors = validateContent(sounds, words, lessons);
  if (errors.length === 0) {
    console.log(`PASS: ${lessons.length} lessons, ${words.length} words, ${sounds.length} sounds — all decodable.`);
  } else {
    console.error(`FAIL: ${errors.length} error(s)`);
    for (const e of errors) console.error('  - ' + e);
    process.exit(1);
  }
}
