// H-D2: rewrite sentenceRead for lessons 11-70.
// Guarantees enforced by aborting:
//  1. every word is in words.json
//  2. every word's latest non-silent sound is introduced at/before the lesson (NFC-normalized)
//  3. no sentence duplicates anywhere in the deck (1-100)
import fs from 'fs';
import path from 'path';
const norm = (s) => s.normalize('NFC');
const dir = 'src/content/lessons';

const sounds = JSON.parse(fs.readFileSync('src/content/sounds.json', 'utf8'));
const words = JSON.parse(fs.readFileSync('src/content/words.json', 'utf8'));
const sm = {}; for (const s of sounds) sm[norm(s.id)] = s.introducedInLesson;
const bank = {}; for (const w of words) bank[norm(w.id)] = w;

const unlock = (id) => {
  const w = bank[norm(id)];
  if (!w) return Infinity;
  return Math.max(...w.graphemes.filter((g) => !g.silent).map((g) => sm[norm(g.soundId)] ?? Infinity));
};

const plan = {
  11: { s: [["a","cat","sat","on","a","cap"], ["sam","can","tap","a","tin","top"]],
        q: "Ask: What did the cat sit on? What can Sam tap?" },
  12: { s: [["dad","sat","on","a","cot"], ["a","cat","can","nap","on","a","mat"]],
        q: "Ask: What did Dad sit on? Where can the cat nap?" },
  13: { s: [["a","pig","can","dig"], ["a","pig","got","a","gag"]],
        q: "Ask: What can the pig do? What did the pig get?" },
  14: { s: [["dad","got","a","map","and","a","mat"], ["a","cat","can","get","a","gag"]],
        q: "Ask: What two things did Dad get? What can the cat get?" },
  15: { s: [["a","rat","ran","to","dad"], ["a","red","rag","is","on","a","mat"]],
        q: "Ask: Who did the rat run to? What is on the mat?" },
  16: { s: [["a","rat","ran","in","a","gap"], ["dad","ran","to","a","pond"]],
        q: "Ask: Where did the rat run? Where did Dad run to?" },
  17: { s: [["a","ship","ran","to","a","shop"], ["a","cat","can","sit","on","a","ship"]],
        q: "Ask: Where did the ship run? What can the cat do on a ship?" },
  18: { s: [["a","ship","can","spin","in","a","pot"], ["a","cat","ran","to","a","ship"]],
        q: "Ask: What can the ship do in the pot? Who ran to the ship?" },
  19: { s: [["a","pup","got","a","cup"], ["sam","cut","a","rug"]],
        q: "Ask: What did the pup get? What did Sam cut?" },
  20: { s: [["mom","put","a","cup","on","a","rug"], ["a","pup","ran","up","a","ramp"]],
        q: "Ask: Where did Mom put the cup? What did the pup run up?" },
  21: { s: [["a","cat","sat","on","a","log"], ["sam","got","a","lamp","and","a","cap"]],
        q: "Ask: What did the cat sit on? What two things did Sam get?" },
  22: { s: [["a","lad","got","a","lamp"], ["dad","put","a","lid","on","a","pot"]],
        q: "Ask: What did the lad get? What did Dad put the lid on?" },
  23: { s: [["a","hen","hid","in","a","hat"], ["sam","hit","a","tin","can"]],
        q: "Ask: Where did the hen hide? What did Sam hit?" },
  24: { s: [["dad","hid","a","map","in","a","hat"], ["a","hen","got","mud","on","a","mat"]],
        q: "Ask: Where did Dad hide the map? Where did the hen get mud?" },
  25: { s: [["a","bug","bit","sam","on","a","bed"], ["a","big","hen","sat","on","a","bun"]],
        q: "Ask: Who did the bug bite? What did the big hen sit on?" },
  26: { s: [["a","bat","had","a","bed","in","a","bag"], ["a","bib","is","on","a","bin"]],
        q: "Ask: Where did the bat keep its bed? What is on the bin?" },
  27: { s: [["a","fish","hid","in","a","fog"], ["a","frog","can","hop","on","a","log"]],
        q: "Ask: Where did the fish hide? What can the frog do?" },
  28: { s: [["a","bug","can","spin","on","a","fan"], ["a","big","bug","bit","a","bat"]],
        q: "Ask: What can the bug do on the fan? Who did the big bug bite?" },
  29: { s: [["a","bee","can","see","me"], ["a","green","frog","got","in","a","bin"]],
        q: "Ask: Who can see me? What color was the frog?" },
  30: { s: [["a","bee","got","a","nap"], ["dad","hid","a","bat","in","a","bag"], ["a","green","pup","got","a","fan"]],
        q: "Ask: What did the bee get? Where did Dad hide the bat? What did the pup get?" },
  31: { s: [["a","kid","hid","in","a","tent"], ["a","kid","got","a","keg"]],
        q: "Ask: Where did the kid hide? What did the kid get?" },
  32: { s: [["a","kid","can","run","up","a","ramp"], ["mom","got","a","cup","for","a","kid"]],
        q: "Ask: What can the kid run up? Who did Mom get a cup for?" },
  33: { s: [["a","wig","is","on","a","web"], ["we","got","wet","in","a","wind"]],
        q: "Ask: Where is the wig? Who got wet?" },
  34: { s: [["a","pup","put","a","lid","on","it"], ["we","ran","up","to","mom"]],
        q: "Ask: What did the pup put on it? Who did we run to?" },
  35: { s: [["a","thin","kid","can","tip","a","hat"], ["this","is","a","thin","rag"]],
        q: "Ask: What can the thin kid do? What kind of rag is this?" },
  36: { s: [["a","ship","ran","up","to","a","dock"], ["a","thin","kid","had","fun"]],
        q: "Ask: Where did the ship run? Who had fun?" },
  37: { s: [["a","frog","can","go","on","a","log"], ["a","dog","went","up","to","mom"]],
        q: "Ask: What can the frog do? Where did the dog go?" },
  38: { s: [["a","kid","hid","a","big","mug"], ["a","big","ship","is","on","a","pond"]],
        q: "Ask: What did the kid hide? Where is the big ship?" },
  39: { s: [["a","jug","had","jam","in","it"], ["a","kid","can","jump","up"]],
        q: "Ask: What was in the jug? What can the kid do?" },
  40: { s: [["a","jet","got","a","big","jug"], ["a","kid","hid","a","jet","in","a","tent"]],
        q: "Ask: What did the jet get? Where did the kid hide the jet?" },
  41: { s: [["a","vet","put","a","vest","on","a","van"], ["a","van","ran","up","a","ramp"]],
        q: "Ask: Where did the Vet put the vest? What ran up the ramp?" },
  42: { s: [["a","vet","hid","in","a","van"], ["a","van","can","go","up","a","ramp"]],
        q: "Ask: Where did the Vet hide? What can the van do?" },
  43: { s: [["a","cat","can","bake","a","cake"], ["dad","made","a","name","plate"]],
        q: "Ask: What can the cat bake? What did Dad make?" },
  44: { s: [["a","dog","ate","a","bone","at","a","camp"], ["a","kid","came","up","to","a","gate"]],
        q: "Ask: What did the dog eat? Where did the kid come up to?" },
  45: { s: [["a","big","dog","had","a","yap"], ["a","pup","may","nap","on","a","map"]],
        q: "Ask: What did the big dog have? Where may the pup nap?" },
  46: { s: [["a","pup","may","run","up","a","ramp"], ["a","vet","may","play","at","a","shop"]],
        q: "Ask: What may the pup do? Where may the Vet play?" },
  47: { s: [["a","pup","can","zip","up","a","vest"], ["a","bug","can","zip","up","a","tent"]],
        q: "Ask: What can the pup zip up? What can the bug zip up?" },
  48: { s: [["a","vet","can","zap","a","jet"], ["a","kid","hid","a","jug","in","a","mug"]],
        q: "Ask: What can the Vet zap? Where did the kid hide the jug?" },
  49: { s: [["a","pup","can","quit","a","jump"], ["a","vet","can","quit","a","hunt"]],
        q: "Ask: What can the pup quit? What can the Vet quit?" },
  50: { s: [["a","van","can","zip","up","a","ramp"], ["a","kid","can","quit","a","dig"]],
        q: "Ask: What can the van zip up? What can the kid quit?" },
  51: { s: [["a","fox","got","a","box","on","a","dock"], ["a","kid","can","fix","a","box"]],
        q: "Ask: Where did the fox get a box? What can the kid fix?" },
  52: { s: [["a","fox","can","mix","mud","in","a","tub"], ["a","vet","got","a","big","box","for","sam"]],
        q: "Ask: Where can the fox mix mud? Who got a big box?" },
  53: { s: [["a","kid","had","lunch","in","a","hut"], ["a","chip","can","march","up","a","path"]],
        q: "Ask: Where did the kid have lunch? Where can the chip march?" },
  54: { s: [["a","cat","can","chat","on","a","mat"], ["a","vet","had","a","chat","with","a","kid"]],
        q: "Ask: Where can the cat chat? Who did the Vet chat with?" },
  55: { s: [["i","like","this","nice","kite"], ["a","kid","can","ride","up","a","fine","line"]],
        q: "Ask: What does Sam like? Where can the kid ride?" },
  56: { s: [["a","wide","kite","is","up","a","line"], ["a","kid","may","ride","a","kite"]],
        q: "Ask: Where is the wide kite? What may the kid ride?" },
  57: { s: [["a","vet","met","her","at","a","bench"], ["her","pen","is","on","a","fern"]],
        q: "Ask: Where did the Vet meet her? Where is her pen?" },
  58: { s: [["a","hen","hid","her","mug","in","a","pen"], ["her","vest","fit","in","a","tent"]],
        q: "Ask: Where did the hen hide her mug? Where did her vest fit?" },
  59: { s: [["a","kid","got","a","good","book"], ["a","pup","ate","lunch","at","noon"]],
        q: "Ask: What did the kid get? When did the pup eat lunch?" },
  60: { s: [["a","kid","can","cook","a","plum"], ["a","pup","sat","up","at","noon"]],
        q: "Ask: What can the kid cook? When did the pup sit up?" },
  61: { s: [["a","kid","sang","a","sad","song"], ["a","king","got","a","ring","on","a","string"]],
        q: "Ask: What kind of song did the kid sing? Where did the king get a ring?" },
  62: { s: [["a","pup","can","swing","on","a","string"], ["a","king","sang","a","spring","song"]],
        q: "Ask: What can the pup swing on? What song did the king sing?" },
  63: { s: [["a","cute","cube","fit","in","a","tube"], ["a","mule","got","a","cute","name"]],
        q: "Ask: Where did the cube fit? What did the mule get?" },
  64: { s: [["a","vet","got","a","cute","cup","for","sam"], ["a","mule","sat","on","a","cube"]],
        q: "Ask: Who got a cute cup? Where did the mule sit?" },
  65: { s: [["a","boy","got","a","big","red","toy"], ["a","girl","had","joy","on","a","swing"]],
        q: "Ask: What did the boy get? Who had joy on the swing?" },
  66: { s: [["a","boy","and","a","pup","can","play"], ["a","boy","can","spin","a","toy","top"]],
        q: "Ask: Who can play together? What can the boy spin?" },
  67: { s: [["a","whale","can","whip","a","wet","wig"], ["a","wind","hit","a","big","tent"]],
        q: "Ask: What can the whale whip? What hit the big tent?" },
  68: { s: [["a","boy","got","a","kite","when","dad","came"], ["a","kid","got","jam","when","mom","came","back"]],
        q: "Ask: When did the boy get a kite? What did the kid get when Mom came back?" },
  69: { s: [["a","car","can","march","up","a","park","path"], ["a","star","shone","on","a","dark","farm"]],
        q: "Ask: Where can the car march? What shone on the farm?" },
  70: { s: [["a","boy","ran","up","to","a","cart"], ["a","kid","can","get","a","good","book"], ["a","car","came","back","up","a","park","path"]],
        q: "Ask: What did the boy run up to? Where can the kid get a book? Where did the car come back up?" },
};

// ---- checks ----
const problems = [];

// existing deck sentences (1-10 and 71-100 stay as they are)
const existing = new Map();
for (let n = 1; n <= 100; n++) {
  if (n >= 11 && n <= 70) continue;
  const d = JSON.parse(fs.readFileSync(path.join(dir, `lesson-${String(n).padStart(3, '0')}.json`), 'utf8'));
  for (const t of d.tasks) if (t.type === 'sentenceRead') for (const s of (t.text || [])) {
    const key = s.join(' ');
    if (!existing.has(key)) existing.set(key, n);
  }
}
// also intra-plan dupes
const planned = new Map();
for (const [n, { s }] of Object.entries(plan)) {
  for (const sent of s) {
    const key = sent.join(' ');
    if (existing.has(key)) problems.push(`L${n}: duplicate of existing "${key}" (also in L${existing.get(key)})`);
    if (planned.has(key)) problems.push(`L${n}: duplicate of plan "${key}" (also in L${planned.get(key)})`);
    planned.set(key, n);
    for (const w of sent) {
      if (!bank[norm(w)]) { problems.push(`L${n}: unknown word "${w}"`); continue; }
      const u = unlock(w);
      if (u > +n) problems.push(`L${n}: "${w}" unlocked at lesson ${u}`);
    }
    if (sent.length < 3 || sent.length > 8) problems.push(`L${n}: sentence len ${sent.length}: ${key}`);
  }
  // coverage: 11-70 must all exist
}
const missingLessons = [];
for (let n = 11; n <= 70; n++) if (!plan[n]) missingLessons.push(n);
if (missingLessons.length) problems.push(`plan missing lessons: ${missingLessons.join(',')}`);

if (problems.length) { console.error(`ABORT — ${problems.length} problem(s):`); for (const p of problems) console.error(' -', p); process.exit(1); }

// ---- apply ----
let changed = 0;
for (const [n, { s, q }] of Object.entries(plan)) {
  const f = path.join(dir, `lesson-${String(n).padStart(3, '0')}.json`);
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  let sr = data.tasks.find((t) => t.type === 'sentenceRead');
  if (!sr) {
    sr = { type: 'sentenceRead', text: [], script: [] };
    data.tasks.push(sr);
  }
  sr.text = s;
  sr.script = [
    "Child reads each sentence out loud. If they stumble, sound it out together, then read it once more.",
    q,
  ];
  fs.writeFileSync(f, JSON.stringify(data, null, 2) + '\n');
  changed++;
}
console.log(`Rewrote sentenceRead in ${changed} lessons (11-70)`);
