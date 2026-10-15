// H-D2 fix #2: correct blend/wordRead counts in lessons 11-70 per SOUND_SCHEDULE
// templates, and add missing qu/er/ū words so those lessons can meet the mix rules.
import fs from 'fs';
import path from 'path';
const norm = (s) => s.normalize('NFC');
const dir = 'src/content/lessons';

// ---- add words ----
const L = (g, id) => ({ g, soundId: id });
const TM = (g) => ({ g, soundId: g, team: true });
const SE = { g: 'e', soundId: 'e', silent: true };
const ELONG = { g: 'e', soundId: 'e_long', macron: true };
const addWords = [
  { id: 'quack', graphemes: [TM('qu'), L('a', 'a'), L('c', 'c'), L('k', 'k')] },
  { id: 'quip', graphemes: [TM('qu'), L('i', 'i'), L('p', 'p')] },
  { id: 'quiz', graphemes: [TM('qu'), L('i', 'i'), L('z', 'z')] },
  { id: 'quick', graphemes: [TM('qu'), L('i', 'i'), L('c', 'c'), L('k', 'k')] },
  { id: 'quilt', graphemes: [TM('qu'), L('i', 'i'), L('l', 'l'), L('t', 't')] },
  { id: 'queen', graphemes: [TM('qu'), TM('ee'), L('n', 'n')] },
  { id: 'herd', graphemes: [L('h', 'h'), TM('er'), L('d', 'd')] },
  { id: 'germ', graphemes: [L('g', 'g'), TM('er'), L('m', 'm')] },
  { id: 'verb', graphemes: [L('v', 'v'), TM('er'), L('b', 'b')] },
  { id: 'flute', graphemes: [L('f', 'f'), L('l', 'l'), { g: 'ū', soundId: 'ū', macron: true }, L('t', 't'), SE] },
  { id: 'prune', graphemes: [L('p', 'p'), L('r', 'r'), { g: 'ū', soundId: 'ū', macron: true }, L('n', 'n'), SE] },
];
const wordsPath = 'src/content/words.json';
const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));
const wmap = {}; for (const w of words) wmap[norm(w.id)] = w;
let added = 0;
for (const w of addWords) if (!wmap[norm(w.id)]) { words.push(w); wmap[norm(w.id)] = w; added++; }
words.sort((a, b) => a.id.localeCompare(b.id));
fs.writeFileSync(wordsPath, JSON.stringify(words, null, 2) + '\n');

const sounds = JSON.parse(fs.readFileSync('src/content/sounds.json', 'utf8'));
const sm = {}; for (const s of sounds) sm[norm(s.id)] = s.introducedInLesson;
const unlock = (id) => {
  const w = wmap[norm(id)];
  if (!w) return Infinity;
  return Math.max(...w.graphemes.filter((g) => !g.silent).map((g) => sm[norm(g.soundId)] ?? Infinity));
};
const hasSound = (id, sid) => wmap[norm(id)].graphemes.some((g) => norm(g.soundId) === norm(sid));

// usage counts so we pick fresher words: sentences everywhere; word lists only
// in the stable ranges (1-10, 71-100) since 11-70 lists are what we're rewriting.
const usage = {};
const bumpUsage = (id) => { usage[norm(id)] = (usage[norm(id)] || 0) + 1; };
const allLessons = [];
for (let n = 1; n <= 100; n++) {
  const d = JSON.parse(fs.readFileSync(path.join(dir, `lesson-${String(n).padStart(3, '0')}.json`), 'utf8'));
  allLessons[n] = d;
  const countLists = n <= 10 || n >= 71;
  for (const t of d.tasks) { if (countLists) (t.wordIds || []).forEach(bumpUsage); if (t.text) for (const s of t.text) s.forEach(bumpUsage); }
}

// deterministic tie-break hash
const h = (n, id) => { let x = n * 31; for (const c of norm(id)) x = (x * 33 + c.charCodeAt(0)) >>> 0; return x; };

const milestones = new Set([30, 40, 50, 60, 70]);
let changed = 0;
const short = [];
for (let n = 11; n <= 70; n++) {
  const d = allLessons[n];
  const newIds = (d.newSoundIds || []).map(norm);
  const isNew = newIds.length > 0;
  const blendTarget = isNew ? 3 : 4;
  const wrTarget = isNew ? 6 : milestones.has(n) ? 10 : 8;
  // decoding-drill pools exclude 1-2 letter function words (except concrete ox/ax)
  const pool = Object.keys(wmap).filter((id) => unlock(id) <= n && (id.length >= 3 || id === 'ox' || id === 'ax'));

  const usedInLesson = new Set();
  for (const t of d.tasks) if (t.type === 'sentenceRead' && t.text) for (const s of t.text) s.forEach((w) => usedInLesson.add(norm(w)));

  const pick = (count, soundCap) => {
    const fresh = [];
    const take = (list, maxAdd) => {
      const sorted = [...list].sort((a, b) => (usage[norm(a)] || 0) - (usage[norm(b)] || 0) || h(n, a) - h(n, b));
      let added = 0;
      for (const id of sorted) {
        if (fresh.length >= count || added >= maxAdd) break;
        const k = norm(id);
        if (usedInLesson.has(k) || fresh.includes(id)) continue;
        fresh.push(id); usedInLesson.add(k); added++;
      }
    };
    if (soundCap > 0) {
      // words containing the lesson's new sound first (capped so the task stays a mix)
      const soundWords = pool.filter((id) => newIds.some((s) => hasSound(id, s)));
      take(soundWords, soundCap);
    }
    take(pool, count);
    if (fresh.length < count) short.push(`L${n}: only ${fresh.length}/${count} words available`);
    fresh.forEach(bumpUsage); // deck-wide variety: later lessons avoid what we just picked
    return fresh;
  };

  for (const t of d.tasks) {
    if (t.type === 'blend') t.wordIds = pick(blendTarget, isNew ? 2 : 1);
    else if (t.type === 'wordRead') t.wordIds = pick(wrTarget, isNew ? 3 : milestones.has(n) ? 2 : 1);
  }
  fs.writeFileSync(path.join(dir, `lesson-${String(n).padStart(3, '0')}.json`), JSON.stringify(d, null, 2) + '\n');
  changed++;
}
console.log(`words: +${added} (total ${words.length}); rewrote blend/wordRead in ${changed} lessons`);
if (short.length) console.log('SHORTFALLS:', short.join('; '));
