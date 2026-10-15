import { readFileSync, writeFileSync } from 'node:fs';
import { loadContent, validateContent } from './validate.mjs';

const pad = n => String(n).padStart(3, '0');
const dir = './src/content';
const { sounds, words, lessons } = loadContent(dir);

// Words that don't exist and can't be added (use wrong sound patterns):
// 'said' = s+ai+d (no 'ai' sound) -> replace with 'can'
// 'saw' = s+aw (no 'aw' sound) -> replace with 'can'  
// 'plate' exists now, 'make' exists now, 'wot' exists now, 'went' exists now
// 'wo' uses ō (not till 37) -> remove from lesson 34

// Fix lesson 34: remove 'wot' and 'wo' from wordIds
const l34 = lessons.find(l => l.lesson === 34);
l34.tasks.forEach(t => {
  if (t.wordIds) {
    t.wordIds = t.wordIds.filter(id => id !== 'wot' && id !== 'wo');
  }
});

// Fix lessons with 'said' -> 'can'
[45, 46, 49, 50, 57, 59, 67, 68].forEach(n => {
  const l = lessons.find(l => l.lesson === n);
  l.tasks.forEach(t => {
    if (t.text) {
      t.text = t.text.map(s => s.map(w => w === 'said' ? 'can' : w));
    }
  });
});

// Fix lessons with 'saw' -> 'can'
[57, 59].forEach(n => {
  const l = lessons.find(l => l.lesson === n);
  l.tasks.forEach(t => {
    if (t.text) {
      t.text = t.text.map(s => s.map(w => w === 'saw' ? 'can' : w));
    }
  });
});

// Fix lesson 61: replace 'sang' -> 'can'
const l61 = lessons.find(l => l.lesson === 61);
l61.tasks.forEach(t => {
  if (t.text) {
    t.text = t.text.map(s => s.map(w => w === 'sang' ? 'can' : w));
  }
});

// Write back
for (const l of lessons) {
  writeFileSync(`src/content/lessons/lesson-${pad(l.lesson)}.json`, JSON.stringify(l, null, 2) + '\n');
}

const errors = validateContent(sounds, words, lessons);
console.log('Errors after fix: ' + errors.length + (errors.length ? ' FAIL' : ' PASS'));
if (errors.length) {
  errors.forEach(e => console.log('  - ' + e));
}
