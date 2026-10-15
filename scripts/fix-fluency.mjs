// Fix lessons 71-100: replace word-list "sentences" with real sentences,
// and add decodable high-frequency words to the bank.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const lessonsDir = path.join(root, 'src', 'content', 'lessons');

// ---------- 1. New words (all decodable with sounds taught by lesson 69) ----------
const L = (g, id) => ({ g, soundId: id });
const TM = (g) => ({ g, soundId: g, team: true });
const E_LONG = { g: 'e', soundId: 'e_long', macron: true };
const MACR = (id) => ({ g: id, soundId: id, macron: true }); // ā, ī
const O_MAC = { g: 'o', soundId: 'ō', macron: true };
const SILENT_E = { g: 'e', soundId: 'e', silent: true };

const newWords = [
  { id: 'he', graphemes: [L('h', 'h'), E_LONG] },
  { id: 'she', graphemes: [TM('sh'), E_LONG] },
  { id: 'we', graphemes: [L('w', 'w'), E_LONG] },
  { id: 'his', graphemes: [L('h', 'h'), L('i', 'i'), L('s', 's')] },
  { id: 'girl', graphemes: [L('g', 'g'), L('i', 'i'), L('r', 'r'), L('l', 'l')] },
  { id: 'bit', graphemes: [L('b', 'b'), L('i', 'i'), L('t', 't')] },
  { id: 'clap', graphemes: [L('c', 'c'), L('l', 'l'), L('a', 'a'), L('p', 'p')] },
  { id: 'camp', graphemes: [L('c', 'c'), L('a', 'a'), L('m', 'm'), L('p', 'p')] },
  { id: 'whip', graphemes: [L('w', 'w'), L('h', 'h'), L('i', 'i'), L('p', 'p')] },
  { id: 'wash', graphemes: [L('w', 'w'), L('a', 'a'), TM('sh')] },
  { id: 'match', graphemes: [L('m', 'm'), L('a', 'a'), L('t', 't'), TM('ch')] },
  { id: 'path', graphemes: [L('p', 'p'), L('a', 'a'), TM('th')] },
  { id: 'flag', graphemes: [L('f', 'f'), L('l', 'l'), L('a', 'a'), L('g', 'g')] },
  { id: 'string', graphemes: [L('s', 's'), L('t', 't'), L('r', 'r'), L('i', 'i'), TM('ng')] },
  { id: 'wind', graphemes: [L('w', 'w'), L('i', 'i'), L('n', 'n'), L('d', 'd')] },
  { id: 'cart', graphemes: [L('c', 'c'), TM('ar'), L('t', 't')] },
  { id: 'barn', graphemes: [L('b', 'b'), TM('ar'), L('n', 'n')] },
  { id: 'tub', graphemes: [L('t', 't'), L('u', 'u'), L('b', 'b')] },
  { id: 'bin', graphemes: [L('b', 'b'), L('i', 'i'), L('n', 'n')] },
  { id: 'pup', graphemes: [L('p', 'p'), L('u', 'u'), L('p', 'p')] },
  { id: 'sink', graphemes: [L('s', 's'), L('i', 'i'), L('n', 'n'), L('k', 'k')] },
  { id: 'tent', graphemes: [L('t', 't'), E_LONG, L('n', 'n'), L('t', 't')] },
  { id: 'dock', graphemes: [L('d', 'd'), L('o', 'o'), L('c', 'c'), L('k', 'k')] },
  { id: 'mist', graphemes: [L('m', 'm'), L('i', 'i'), L('s', 's'), L('t', 't')] },
  { id: 'limb', graphemes: [L('l', 'l'), L('i', 'i'), L('m', 'm'), L('b', 'b')] },
  { id: 'snug', graphemes: [L('s', 's'), L('n', 'n'), L('u', 'u'), L('g', 'g')] },
  { id: 'spot', graphemes: [L('s', 's'), L('p', 'p'), L('o', 'o'), L('t', 't')] },
  { id: 'patch', graphemes: [L('p', 'p'), L('a', 'a'), L('t', 't'), TM('ch')] },
  { id: 'crumb', graphemes: [L('c', 'c'), L('r', 'r'), L('u', 'u'), L('m', 'm'), L('b', 'b')] },
  { id: 'plant', graphemes: [L('p', 'p'), L('l', 'l'), L('a', 'a'), L('n', 'n'), L('t', 't')] },
  { id: 'dig', graphemes: [L('d', 'd'), L('i', 'i'), L('g', 'g')] },
  { id: 'jump', graphemes: [L('j', 'j'), L('u', 'u'), L('m', 'm'), L('p', 'p')] },
  { id: 'dog', graphemes: [L('d', 'd'), L('o', 'o'), L('g', 'g')] },
  { id: 'pig', graphemes: [L('p', 'p'), L('i', 'i'), L('g', 'g')] },
  { id: 'frog', graphemes: [L('f', 'f'), L('r', 'r'), L('o', 'o'), L('g', 'g')] },
  { id: 'fish', graphemes: [L('f', 'f'), L('i', 'i'), TM('sh')] },
  { id: 'bone', graphemes: [L('b', 'b'), O_MAC, L('n', 'n'), SILENT_E] },
  { id: 'shone', graphemes: [TM('sh'), O_MAC, L('n', 'n'), SILENT_E] },
  { id: 'like', graphemes: [L('l', 'l'), MACR('ī'), L('k', 'k'), SILENT_E] },
  { id: 'came', graphemes: [L('c', 'c'), MACR('ā'), L('m', 'm'), SILENT_E] },
  { id: 'ate', graphemes: [MACR('ā'), L('t', 't'), SILENT_E] },
  { id: 'swam', graphemes: [L('s', 's'), L('w', 'w'), L('a', 'a'), L('m', 'm')] },
  { id: 'swung', graphemes: [L('s', 's'), L('w', 'w'), L('u', 'u'), TM('ng')] },
  { id: 'green', graphemes: [L('g', 'g'), L('r', 'r'), TM('ee'), L('n', 'n')] },
  { id: 'play', graphemes: [L('p', 'p'), L('l', 'l'), MACR('ā'), L('y', 'y')] },
  { id: 'day', graphemes: [L('d', 'd'), MACR('ā'), L('y', 'y')] },
  { id: 'may', graphemes: [L('m', 'm'), MACR('ā'), L('y', 'y')] },
  { id: 'way', graphemes: [L('w', 'w'), MACR('ā'), L('y', 'y')] },
  { id: 'here', graphemes: [L('h', 'h'), E_LONG, L('r', 'r'), SILENT_E] },
  { id: 'then', graphemes: [TM('th'), E_LONG, L('n', 'n')] },
  { id: 'them', graphemes: [TM('th'), E_LONG, L('m', 'm')] },
  { id: 'this', graphemes: [TM('th'), L('i', 'i'), L('s', 's')] },
  { id: 'with', graphemes: [L('w', 'w'), L('i', 'i'), TM('th')] },
  { id: 'fun', graphemes: [L('f', 'f'), L('u', 'u'), L('n', 'n')] },
  { id: 'back', graphemes: [L('b', 'b'), L('a', 'a'), L('c', 'c'), L('k', 'k')] },
  { id: 'red', graphemes: [L('r', 'r'), E_LONG, L('d', 'd')] },
  { id: 'same', graphemes: [L('s', 's'), MACR('ā'), L('m', 'm'), SILENT_E] },
  { id: 'met', graphemes: [L('m', 'm'), E_LONG, L('t', 't')] },
  { id: 'set', graphemes: [L('s', 's'), E_LONG, L('t', 't')] },
  { id: 'let', graphemes: [L('l', 'l'), E_LONG, L('t', 't')] },
  { id: 'get', graphemes: [L('g', 'g'), E_LONG, L('t', 't')] },
  { id: 'net', graphemes: [L('n', 'n'), E_LONG, L('t', 't')] },
  { id: 'put', graphemes: [L('p', 'p'), L('u', 'u'), L('t', 't')] },
  { id: 'for', graphemes: [L('f', 'f'), L('o', 'o'), L('r', 'r')] },
  { id: 'pen', graphemes: [L('p', 'p'), E_LONG, L('n', 'n')] },
  { id: 'whale', graphemes: [TM('wh'), MACR('ā'), L('l', 'l'), SILENT_E] },
  { id: 'ramp', graphemes: [L('r', 'r'), L('a', 'a'), L('m', 'm'), L('p', 'p')] },
  { id: 'plum', graphemes: [L('p', 'p'), L('l', 'l'), L('u', 'u'), L('m', 'm')] },
  { id: 'spin', graphemes: [L('s', 's'), L('p', 'p'), L('i', 'i'), L('n', 'n')] },
];

// ---------- 2. Real sentences per lesson (varied verbs + structures) ----------
const plan = {
  71: { s: [ ["a","cat","sat","on","a","mat"], ["dad","ran","to","a","shop"], ["sam","fed","a","hen"] ],
        q: ["Ask: Where did the cat sit? What did Dad run to? Who did Sam feed?"] },
  72: { s: [ ["a","pig","ate","jam","in","a","pen"], ["a","dog","got","a","big","bone"], ["mom","put","a","lid","on","a","pan"] ],
        q: ["Ask: Who ate the jam? What did the dog get? What did Mom put on the pan?"] },
  73: { s: [ ["a","hen","ran","up","to","a","gate"], ["a","frog","hid","in","a","pot"], ["dad","let","us","go"] ],
        q: ["Ask: Where did the hen run? Where did the frog hide? Who did Dad let go?"] },
  74: { s: [ ["a","cat","can","jump","up"], ["sam","can","dig","in","a","patch"], ["dad","can","hit","a","gong"] ],
        q: ["Ask: What can the cat do? Where can Sam dig? What can Dad hit?"] },
  75: { s: [ ["sun","came","up","in","a","mist"], ["we","went","to","a","farm"], ["a","boy","swung","on","a","swing"] ],
        q: ["Ask: What came up in the mist? Where did we go? What did the boy do?"] },
  76: { s: [ ["mom","made","a","big","cake"], ["dad","and","sam","ate","it","up"], ["a","bug","got","a","crumb"] ],
        q: ["Ask: What did Mom make? Who ate it up? What did the bug get?"] },
  77: { s: [ ["a","fish","swam","in","a","pond"], ["a","ship","ran","to","a","dock"], ["dad","got","a","net","for","them"] ],
        q: ["Ask: Where did the fish swim? Where did the ship run? What did Dad get?"] },
  78: { s: [ ["a","bug","hid","in","a","snug","spot"], ["it","bit","sam","on","a","hand"], ["he","did","not","like","it"] ],
        q: ["Ask: Where did the bug hide? Where did it bite Sam? Did he like it?"] },
  79: { s: [ ["sam","and","dad","can","play"], ["a","kid","made","a","kite"], ["she","went","to","a","shop","to","get","a","jug"] ],
        q: ["Ask: Who can play? What did the kid make? Where did she go?"] },
  80: { s: [ ["sun","set","in","a","mist"], ["a","frog","sat","on","a","limb"], ["a","bug","bit","me","on","a","leg"] ],
        q: ["Ask: Where did the sun set? Where did the frog sit? Where did the bug bite?"] },
  81: { s: [ ["pup","ran","up","to","a","tent"], ["sam","had","a","hat","and","a","bag"], ["dad","put","a","map","in","it"] ],
        q: ["Ask: What ran to the tent? What did Sam have? Where did Dad put the map?"] },
  82: { s: [ ["this","is","a","fun","spot"], ["we","can","dig","and","plant"], ["a","hen","sat","in","a","bin"] ],
        q: ["Ask: What can we do here? Where did the hen sit?"] },
  83: { s: [ ["mom","hid","a","jug","in","a","sink"], ["a","cat","sat","in","a","tub"], ["it","had","a","snug","fit"] ],
        q: ["Ask: Where did Mom hide the jug? Where did the cat sit? Did it fit?"] },
  84: { s: [ ["a","green","frog","sat","on","a","limb"], ["a","kid","got","a","red","cap"], ["we","had","fun","at","a","camp"] ],
        q: ["Ask: What color was the frog? What did the kid get? Where did we have fun?"] },
  85: { s: [ ["dad","may","go","to","a","farm"], ["sam","came","back","with","a","map"], ["a","dog","can","bark"] ],
        q: ["Ask: Where may Dad go? What did Sam bring back? What can the dog do?"] },
  86: { s: [ ["pat","a","cat","on","a","back"], ["tap","a","jug","then","clap"], ["dad","and","mom","sat","at","a","camp"] ],
        q: ["Read the first two like instructions — gentle pats and taps!","Ask: Who sat at the camp?"] },
  87: { s: [ ["a","pup","got","a","wash"], ["a","fox","ran","up","to","a","hen"], ["she","put","it","up","here"] ],
        q: ["Ask: What did the pup get? What ran to the hen? Where did she put it?"] },
  88: { s: [ ["dad","did","fix","a","fan"], ["a","van","went","up","a","ramp"], ["a","big","wind","can","whip","a","flag"] ],
        q: ["Ask: What did Dad fix? Where did the van go? What can the wind whip?"] },
  89: { s: [ ["this","is","a","good","spot"], ["a","kid","got","a","flag","and","a","wig"], ["we","met","at","a","tent"] ],
        q: ["Ask: What did the kid get? Where did we meet?"] },
  90: { s: [ ["sam","swam","up","to","a","log"], ["a","frog","swam","in","a","pond","and","got","a","fish"], ["a","kid","made","a","jam","pan","for","mom"] ],
        q: ["Ask: What did Sam swim up to? What did the frog get? What did the kid make for Mom?"] },
  91: { s: [ ["a","boy","got","a","kite","on","a","string"], ["a","girl","can","ring","a","gong"], ["we","can","swing","and","sing","a","song"] ],
        q: ["Ask: What did the boy get? What can the girl ring? What can we do together?"] },
  92: { s: [ ["a","bug","in","a","jug","got","snug"], ["dad","cut","a","rug","with","an","ax"] ],
        q: ["Ask: Where did the bug get snug? What did Dad cut? What did he use?"] },
  93: { s: [ ["sam","can","march","up","a","path"], ["a","pup","had","a","chip","in","a","cup"], ["dad","got","a","match","on","a","patch"] ],
        q: ["Ask: Where can Sam march? What did the pup have? What did Dad get?"] },
  94: { s: [ ["sam","can","sing","a","sad","song"], ["a","hen","sang","a","song","on","a","wing"], ["we","did","a","big","thing"] ],
        q: ["Ask: What kind of song can Sam sing? Where did the hen sing?"] },
  95: { s: [ ["a","mule","ate","a","plum"], ["a","cube","fit","in","a","tube"], ["a","cute","pup","had","a","mug"] ],
        q: ["Ask: What did the mule eat? Where did the cube fit? What did the pup have?"] },
  96: { s: [ ["a","boy","had","a","toy","top","on","a","box"], ["a","kid","got","joy","at","a","shop"], ["a","toy","top","can","spin","in","a","box"] ],
        q: ["Ask: What did the boy have on the box? Where did the kid get joy?"] },
  97: { s: [ ["dad","went","when","we","got","up"], ["a","whale","swam","up","a","pond"], ["a","wind","hit","a","tent"] ],
        q: ["Ask: When did Dad go? What swam up the pond? What hit the tent?"] },
  98: { s: [ ["a","cart","ran","far","on","a","farm"], ["a","farm","had","a","barn"], ["a","car","had","a","star","on","a","map"] ],
        q: ["Ask: Where did the cart run? What did the farm have? What was on the car?"] },
  99: { s: [ ["a","king","can","do","a","fun","thing"], ["a","pup","can","bring","a","big","jug"], ["a","hen","sang","a","spring","song"] ],
        q: ["Ask: What can the king do? What can the pup bring? What did the hen sing?"] },
  100: { s: [ ["mom","got","a","big","book","for","us"], ["a","cat","and","a","pup","ran","to","a","fun","spot"], ["we","made","jam","and","ate","it","with","mom","and","dad"], ["a","kid","on","a","swing","can","swing","and","sing","a","song"] ],
        q: ["Four sentences — the longest read yet! Take it slow; this one is a victory lap.","Ask: What did Mom get for us? Who ran to the fun spot? What did we make and eat?","One hundred lessons done. Celebrate — they can really read!"] },
};

// ---------- 3. Apply ----------
const wordsPath = path.join(root, 'src', 'content', 'words.json');
const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));
const ids = new Set(words.map((w) => w.id));
let added = 0;
for (const w of newWords) {
  if (!ids.has(w.id)) { words.push(w); ids.add(w.id); added++; }
}
words.sort((a, b) => a.id.localeCompare(b.id));
fs.writeFileSync(wordsPath, JSON.stringify(words, null, 2) + '\n');
console.log(`words.json: +${added} new (${words.length} total)`);

// assert every sentence word exists
const problems = [];
for (const [n, { s }] of Object.entries(plan)) {
  for (const sent of s) for (const id of sent) {
    if (!ids.has(id)) problems.push(`lesson ${n}: "${id}" not in bank`);
  }
}
if (problems.length) { console.error('ABORT — missing words:\n' + problems.join('\n')); process.exit(1); }

let changed = 0;
for (const [n, { s, q }] of Object.entries(plan)) {
  const f = path.join(lessonsDir, `lesson-${String(n).padStart(3, '0')}.json`);
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  const sr = data.tasks.find((t) => t.type === 'sentenceRead');
  if (!sr) { console.error(`lesson ${n}: no sentenceRead task — skipped`); continue; }
  sr.text = s;
  sr.script = [
    "Child reads each sentence out loud. If they stumble, sound it out together, then read it once more.",
    ...q,
  ];
  fs.writeFileSync(f, JSON.stringify(data, null, 2) + '\n');
  changed++;
}
console.log(`Rewrote sentenceRead in ${changed} lessons (71-100)`);
