// H-D2 review scan for lessons 11-70 (plus sanity re-scan of all)
import fs from 'fs';
import path from 'path';
const dir = 'src/content/lessons';

const verbs = new Set(['is','am','did','do','can','may','has','had','sat','sit','ran','run','went','get','got','make','made','eat','ate','see','say','let','put','fed','hid','hit','hop','dig','jump','swing','swung','swam','sang','sing','ring','rang','tap','pat','clap','cut','fix','spin','whip','march','play','bring','like','hunt','meet','met','plant','shone','set','came','bit','bark','wash','fit','stop','drop','zip','zap','jog','roll','help','read','want','will','flew']);

const verbCount = {};
const dupMap = {};
const flags = [];
const lens = { wr: [], sr: [], sent: [], sentsPerLesson: [] };

for (let n = 11; n <= 70; n++) {
  const d = JSON.parse(fs.readFileSync(path.join(dir, `lesson-${String(n).padStart(3,'0')}.json`), 'utf8'));
  for (const t of d.tasks) {
    if (t.type === 'wordRead' || t.type === 'blend') lens.wr.push([n, t.type, (t.wordIds||[]).length]);
    if (t.type === 'soundReview') lens.sr.push([n, (t.soundIds||[]).length]);
    if (t.type === 'sentenceRead') {
      const sents = t.text || [];
      lens.sentsPerLesson.push([n, sents.length]);
      sents.forEach((s, si) => {
        lens.sent.push([n, si, s.length]);
        const key = s.join(' ');
        (dupMap[key] = dupMap[key] || []).push(`${n}.${si}`);
        let hasVerb = false;
        for (const w of s) {
          if (verbs.has(w)) { hasVerb = true; verbCount[w] = (verbCount[w]||0)+1; }
        }
        if (s.length >= 9) flags.push(`L${n} s${si}: ${s.length} words (word-list?) -> ${key}`);
        else if (!hasVerb) flags.push(`L${n} s${si}: no verb -> ${key}`);
      });
    }
    // script shape bug re-check
    if (t.script && Array.isArray(t.script) && t.script.some(x => !Array.isArray(x) && typeof x !== 'string')) {
      flags.push(`L${n} ${t.type}: bad script element ${JSON.stringify(t.script)}`);
    }
  }
}

const dups = Object.entries(dupMap).filter(([, v]) => v.length > 1);
const topVerbs = Object.entries(verbCount).sort((a,b)=>b[1]-a[1]).slice(0, 14);

console.log('FLAGS (word-list >=9 words, no verb, bad script):', flags.length);
for (const f of flags.slice(0, 40)) console.log(' -', f);
console.log('\nDUPLICATE sentences across lessons:', dups.length);
for (const [k, v] of dups.slice(0, 20)) console.log(` - "${k}" in ${v.join(', ')}`);
console.log('\nTop verbs (11-70):', topVerbs.map(([w,c])=>`${w}:${c}`).join('  '));
const wrBad = lens.wr.filter(([, , c]) => c > 8 || c < 3);
const srBad = lens.sr.filter(([, c]) => c < 3 || c > 10);
const sentBad = lens.sent.filter(([, , c]) => c > 8);
console.log('\nwordRead/blend size outliers (>8 or <3):', wrBad.length ? JSON.stringify(wrBad.slice(0,15)) : 'none');
console.log('soundReview size outliers:', srBad.length ? JSON.stringify(srBad.slice(0,15)) : 'none');
console.log('sentences >8 words:', sentBad.length);
const sp = lens.sentsPerLesson.map(([,c])=>c);
console.log('sentences per lesson: min', Math.min(...sp), 'max', Math.max(...sp));
