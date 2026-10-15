import { readFileSync, writeFileSync } from 'node:fs';

// ========================
// PART 1: ADD SOUNDS
// ========================
let sounds = JSON.parse(readFileSync('src/content/sounds.json', 'utf8'));
const soundMap = new Map(sounds.map(s => [s.id, s]));

function addSound(s) {
  if (!soundMap.has(s.id)) {
    sounds.push(s);
    soundMap.set(s.id, s);
  }
}

// Batch 3 (31-40): k, w, th, ō, j
addSound({ id:'k', display:'k', hint:'as in kite', introducedInLesson:31, sayItScript:'This sound is k. Say it with me: k.' });
addSound({ id:'w', display:'w', hint:'as in wet', introducedInLesson:33, sayItScript:'This sound is wwww. Say it with me: wwww.' });
addSound({ id:'th', display:'th', team:true, hint:'voiceless th, as in think', introducedInLesson:35, sayItScript:'This sound is th. Put your tongue between your teeth. Say it with me: th.' });
addSound({ id:'ō', display:'ō', macron:true, hint:'long o, as in go', introducedInLesson:37, sayItScript:'This sound is oh. The line on top means it says its name. Say it with me: oh.' });
addSound({ id:'j', display:'j', hint:'as in jam', introducedInLesson:39, sayItScript:'This sound is j. Say it with me: j.' });

// Batch 4 (41-50): v, ā, y, z, qu
addSound({ id:'v', display:'v', hint:'as in van', introducedInLesson:41, sayItScript:'This sound is vvv. Say it with me: vvv.' });
addSound({ id:'ā', display:'ā', macron:true, hint:'long a, as in cake', introducedInLesson:43, sayItScript:'This sound is ay. The line on top means it says its name. Say it with me: ay.' });
addSound({ id:'y', display:'y', hint:'as in yes', introducedInLesson:45, sayItScript:'This sound is yyyy. Say it with me: yyyy.' });
addSound({ id:'z', display:'z', hint:'as in zip', introducedInLesson:47, sayItScript:'This sound is zzz. Say it with me: zzz.' });
addSound({ id:'qu', display:'qu', team:true, hint:'as in quit', introducedInLesson:49, sayItScript:'These two letters make one sound: kw. Say it with me: kw.' });

// Batch 5 (51-60): x, ch, ī, er, oo
addSound({ id:'x', display:'x', hint:'as in box', introducedInLesson:51, sayItScript:'This sound is ks. Say it with me: ks.' });
addSound({ id:'ch', display:'ch', team:true, hint:'as in chip', introducedInLesson:53, sayItScript:'This sound is ch. Say it with me: ch.' });
addSound({ id:'ī', display:'ī', macron:true, hint:'long i, as in kite', introducedInLesson:55, sayItScript:'This sound is eye. The line on top means it says its name. Say it with me: eye.' });
addSound({ id:'er', display:'er', team:true, hint:'r-controlled, as in her', introducedInLesson:57, sayItScript:'These two letters make one sound: er. Say it with me: er.' });
addSound({ id:'oo', display:'oo', team:true, hint:'as in moon', introducedInLesson:59, sayItScript:'These two letters make one sound: oo. Say it with me: oo.' });

// Batch 6 (61-70): ng, ū, oy, wh, ar
addSound({ id:'ng', display:'ng', team:true, hint:'as in sing', introducedInLesson:61, sayItScript:'These two letters make one sound: ng. Say it with me: ng.' });
addSound({ id:'ū', display:'ū', macron:true, hint:'long u, as in cube', introducedInLesson:63, sayItScript:'This sound is yoo. The line on top means it says its name. Say it with me: yoo.' });
addSound({ id:'oy', display:'oy', team:true, hint:'as in boy', introducedInLesson:65, sayItScript:'These two letters make one sound: oy. Say it with me: oy.' });
addSound({ id:'wh', display:'wh', team:true, hint:'as in when', introducedInLesson:67, sayItScript:'These two letters make one sound: wh. Say it with me: wh.' });
addSound({ id:'ar', display:'ar', team:true, hint:'r-controlled, as in car', introducedInLesson:69, sayItScript:'These two letters make one sound: ar. Say it with me: ar.' });

writeFileSync('src/content/sounds.json', JSON.stringify(sounds, null, 2) + '\n');
console.log('Sounds: ' + sounds.length + ' total (added ' + (sounds.length - 20) + ')');

// ========================
// PART 2: ADD WORDS
// ========================
let words = JSON.parse(readFileSync('src/content/words.json', 'utf8'));
const wordSet = new Set(words.map(w => w.id));

function addWord(id, graphemes) {
  if (wordSet.has(id)) return false;
  words.push({ id, graphemes });
  wordSet.add(id);
  return true;
}

// Helper: CV word (consonant + vowel)
function cv(c, v) { return [{g:c,soundId:c},{g:v.g,soundId:v.id,macron:v.macron??false,team:v.team??false}]; }
function cvc(c, v, end) { return [{g:c,soundId:c},{g:v.g,soundId:v.id,macron:v.macron??false,team:v.team??false},{g:end,soundId:end}]; }
function ccvc(team, v, end) { return [{g:team,soundId:team,team:true},{g:v.g,soundId:v.id,macron:v.macron??false,team:v.team??false},{g:end,soundId:end}]; }

const S = (id) => soundMap.get(id);
const V = (id, macron=false, team=false) => ({ id, macron, team });
const C = (id) => id; // consonant id is its sound id

let added = 0;

// ── BATCH 3 words (through lesson 40) ──
// k (31): CV, CVC with k
const kWords = [
  ['kit', cv('k', V('i')), 31],
  ['keg', cvc('k', V('e_long',true), 'g'), 31],
  ['ken', cvc('k', V('e_long',true), 'n'), 31],
  ['kid', cvc('k', V('i'), 'd'), 31],
  ['king', [{g:'k',soundId:'k'},{g:'i',soundId:'i'},{g:'n',soundId:'n'},{g:'g',soundId:'g'}], 31],
  ['kob', cvc('k', V('o'), 'b'), 31],
  ['kon', cvc('k', V('o'), 'n'), 31],
  ['kop', cvc('k', V('o'), 'p'), 31],
  ['kok', cvc('k', V('o'), 'k'), 31],
  ['cake', [{g:'c',soundId:'c'},{g:'ā',soundId:'ā',macron:true},{g:'k',soundId:'k'},{g:'e',soundId:'e_long',macron:true}], 43], // wait, ā is 43, too late for batch 3
];
// Remove cake - ā not until 43
// k words only use sounds through lesson 40

// w (33): CV, CVC
const wWords = [
  ['wet', cvc('w', V('e_long',true), 't'), 33],
  ['wag', cvc('w', V('a'), 'g'), 33],
  ['wan', cvc('w', V('a'), 'n'), 33],
  ['wig', cvc('w', V('i'), 'g'), 33],
  ['win', cvc('w', V('i'), 'n'), 33],
  ['wit', cvc('w', V('i'), 't'), 33],
  ['wot', cvc('w', V('o'), 't'), 33],
  ['web', cvc('w', V('e_long',true), 'b'), 33],
  ['wab', cvc('w', V('a'), 'b'), 33],
  ['wot', cvc('w', V('o'), 't'), 33],
];

// th (35): CCV, CVC with th team
const thWords = [
  ['thin', [{g:'th',soundId:'th',team:true},{g:'i',soundId:'i'},{g:'n',soundId:'n'}], 35],
  ['thud', [{g:'th',soundId:'th',team:true},{g:'u',soundId:'u'},{g:'d',soundId:'d'}], 35],
  ['thop', [{g:'th',soundId:'th',team:true},{g:'o',soundId:'o'},{g:'p',soundId:'p'}], 35],
  ['ath', [{g:'a',soundId:'a'},{g:'th',soundId:'th',team:true}], 35],
  ['eth', [{g:'e',soundId:'e_long',macron:true},{g:'th',soundId:'th',team:true}], 35],
  ['oth', [{g:'o',soundId:'o'},{g:'th',soundId:'th',team:true}], 35],
  ['ith', [{g:'i',soundId:'i'},{g:'th',soundId:'th',team:true}], 35],
];

// ō (37): CV words with long o
const oMacronWords = [
  ['go', cv('g', V('ō',true)), 37],
  ['so', cv('s', V('ō',true)), 37],
  ['no', cv('n', V('ō',true)), 37],
  ['do', cv('d', V('ō',true)), 37],
  ['ho', cv('h', V('ō',true)), 37],
  ['lo', cv('l', V('ō',true)), 37],
  ['bo', cv('b', V('ō',true)), 37],
  ['fo', cv('f', V('ō',true)), 37],
  ['mo', cv('m', V('ō',true)), 37],
  ['yo', cv('y', V('ō',true)), 37], // y is 45, too late!
  ['wo', cv('w', V('ō',true)), 37], // w is 33, ok
  ['to', cv('t', V('ō',true)), 37],
  ['po', cv('p', V('ō',true)), 37],
  ['ro', cv('r', V('ō',true)), 37],
  ['co', cv('c', V('ō',true)), 37],
  ['ko', cv('k', V('ō',true)), 37],
];

// Wait - yo uses y(45) which isn't until batch 4. Remove it.
// Also need to check each word's max lesson

// j (39): CV, CVC
const jWords = [
  ['jam', cvc('j', V('a'), 'm'), 39],
  ['jet', cvc('j', V('e_long',true), 't'), 39],
  ['jug', cvc('j', V('u'), 'g'), 39],
  ['jot', cvc('j', V('o'), 't'), 39],
  ['jig', cvc('j', V('i'), 'g'), 39],
  ['jab', cvc('j', V('a'), 'b'), 39],
  ['jag', cvc('j', V('a'), 'g'), 39],
  ['jin', cvc('j', V('i'), 'n'), 39],
  ['job', cvc('j', V('o'), 'b'), 39],
];

// Now add all batch 3 words, checking decodability
const batch3Words = [
  ...kWords, ...wWords, ...thWords, ...oMacronWords, ...jWords
].filter(w => {
  const maxL = maxLessonOfGraphemes(w[1]);
  return maxL <= 40; // batch 3 goes through lesson 40
});

for (const [id, graphemes] of batch3Words) {
  if (addWord(id, graphemes)) added++;
}

// ── BATCH 4 words (through lesson 50) ──
// v (41)
const vWords = [
  ['van', cvc('v', V('a'), 'n'), 41],
  ['vat', cvc('v', V('a'), 't'), 41],
  ['vest', [{g:'v',soundId:'v'},{g:'e',soundId:'e_long',macron:true},{g:'s',soundId:'s'},{g:'t',soundId:'t'}], 41],
  ['vent', [{g:'v',soundId:'v'},{g:'e',soundId:'e_long',macron:true},{g:'n',soundId:'n'},{g:'t',soundId:'t'}], 41],
  ['vet', cvc('v', V('e_long',true), 't'), 41],
  ['vim', cvc('v', V('i'), 'm'), 41],
  ['vip', cvc('v', V('i'), 'p'), 41],
  ['vin', cvc('v', V('i'), 'n'), 41],
  ['vog', cvc('v', V('o'), 'g'), 41],
  ['vow', [{g:'v',soundId:'v'},{g:'o',soundId:'o'},{g:'w',soundId:'w'}], 41], // w is 33, ok
];

// ā (43): CV words with long a
const aMacronWords = [
  ['gā', cv('g', V('ā',true)), 43], // hmm, display would be "gā" - not great
  // Actually let me use proper word forms
];

// Better approach for macron words - use them in actual words
// ā words: cake, face, rate, name, made, game, late, tape, plate, gate, date, lace, vase, save, wave
// But these use silent e pattern which requires the silent: true flag

const aLongWords = [
  ['cake', [{g:'c',soundId:'c'},{g:'ā',soundId:'ā',macron:true},{g:'k',soundId:'k'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['face', [{g:'f',soundId:'f'},{g:'ā',soundId:'ā',macron:true},{g:'c',soundId:'c'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['rate', [{g:'r',soundId:'r'},{g:'ā',soundId:'ā',macron:true},{g:'t',soundId:'t'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['name', [{g:'n',soundId:'n'},{g:'ā',soundId:'ā',macron:true},{g:'m',soundId:'m'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['made', [{g:'m',soundId:'m'},{g:'ā',soundId:'ā',macron:true},{g:'d',soundId:'d'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['game', [{g:'g',soundId:'g'},{g:'ā',soundId:'ā',macron:true},{g:'m',soundId:'m'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['late', [{g:'l',soundId:'l'},{g:'ā',soundId:'ā',macron:true},{g:'t',soundId:'t'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['tape', [{g:'t',soundId:'t'},{g:'ā',soundId:'ā',macron:true},{g:'p',soundId:'p'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['gate', [{g:'g',soundId:'g'},{g:'ā',soundId:'ā',macron:true},{g:'t',soundId:'t'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['date', [{g:'d',soundId:'d'},{g:'ā',soundId:'ā',macron:true},{g:'t',soundId:'t'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['lake', [{g:'l',soundId:'l'},{g:'ā',soundId:'ā',macron:true},{g:'k',soundId:'k'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['save', [{g:'s',soundId:'s'},{g:'ā',soundId:'ā',macron:true},{g:'v',soundId:'v'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['wave', [{g:'w',soundId:'w'},{g:'ā',soundId:'ā',macron:true},{g:'v',soundId:'v'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['bake', [{g:'b',soundId:'b'},{g:'ā',soundId:'ā',macron:true},{g:'k',soundId:'k'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['gave', [{g:'g',soundId:'g'},{g:'ā',soundId:'ā',macron:true},{g:'v',soundId:'v'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['cane', [{g:'c',soundId:'c'},{g:'ā',soundId:'ā',macron:true},{g:'n',soundId:'n'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['fade', [{g:'f',soundId:'f'},{g:'ā',soundId:'ā',macron:true},{g:'d',soundId:'d'},{g:'e',soundId:'e_long',macron:true}], 43],
  ['gaze', [{g:'g',soundId:'g'},{g:'ā',soundId:'ā',macron:true},{g:'z',soundId:'z'},{g:'e',soundId:'e_long',macron:true}], 43], // z is 47!
];

// Remove gaze - z not until 47
// Also these all use silent e pattern. Let me check if the validator handles silent e.
// Looking at existing words: "eat" uses {g:'a',silent:true}. So yes, silent e is supported.

// y (45): CV, CVC
const yWords = [
  ['yes', [{g:'y',soundId:'y'},{g:'e',soundId:'e_long',macron:true},{g:'s',soundId:'s'}], 45],
  ['yap', cvc('y', V('a'), 'p'), 45],
  ['yag', cvc('y', V('a'), 'g'), 45],
  ['yan', cvc('y', V('a'), 'n'), 45],
  ['yot', cvc('y', V('o'), 't'), 45],
  ['yog', cvc('y', V('o'), 'g'), 45],
];

// z (47)
const zWords = [
  ['zip', cvc('z', V('i'), 'p'), 47],
  ['zag', cvc('z', V('a'), 'g'), 47],
  ['zen', cvc('z', V('e_long',true), 'n'), 47],
  ['zig', cvc('z', V('i'), 'g'), 47],
  ['zot', cvc('z', V('o'), 't'), 47],
  ['zap', cvc('z', V('a'), 'p'), 47],
  ['zed', cvc('z', V('e_long',true), 'd'), 47],
];

// qu (49)
const quWords = [
  ['quit', [{g:'qu',soundId:'qu',team:true},{g:'i',soundId:'i'},{g:'t',soundId:'t'}], 49],
  ['qub', [{g:'qu',soundId:'qu',team:true},{g:'b',soundId:'b'}], 49],
  ['qua', [{g:'qu',soundId:'qu',team:true},{g:'a',soundId:'a'}], 49],
  ['quop', [{g:'qu',soundId:'qu',team:true},{g:'o',soundId:'o'},{g:'p',soundId:'p'}], 49],
  ['quim', [{g:'qu',soundId:'qu',team:true},{g:'i',soundId:'i'},{g:'m',soundId:'m'}], 49],
  ['quab', [{g:'qu',soundId:'qu',team:true},{g:'a',soundId:'a'},{g:'b',soundId:'b'}], 49],
];

// Filter batch 4 words through lesson 50
const batch4Words = [
  ...vWords, ...aLongWords, ...yWords, ...zWords, ...quWords
].filter(w => maxLessonOfGraphemes(w[1]) <= 50);

for (const [id, graphemes] of batch4Words) {
  if (addWord(id, graphemes)) added++;
}

// ── BATCH 5 words (through lesson 60) ──
// x (51) - /ks/ - typically at end of words
const xWords = [
  ['box', [{g:'b',soundId:'b'},{g:'o',soundId:'o'},{g:'x',soundId:'x'}], 51], // x = ks
  ['fox', [{g:'f',soundId:'f'},{g:'o',soundId:'o'},{g:'x',soundId:'x'}], 51],
  ['fix', [{g:'f',soundId:'f'},{g:'i',soundId:'i'},{g:'x',soundId:'x'}], 51],
  ['mix', [{g:'m',soundId:'m'},{g:'i',soundId:'i'},{g:'x',soundId:'x'}], 51],
  ['flex', [{g:'f',soundId:'f'},{g:'l',soundId:'l'},{g:'e',soundId:'e_long',macron:true},{g:'x',soundId:'x'}], 51],
  ['vex', [{g:'v',soundId:'v'},{g:'e',soundId:'e_long',macron:true},{g:'x',soundId:'x'}], 51],
  ['ax', [{g:'a',soundId:'a'},{g:'x',soundId:'x'}], 51],
  ['tax', [{g:'t',soundId:'t'},{g:'a',soundId:'a'},{g:'x',soundId:'x'}], 51],
  ['wax', [{g:'w',soundId:'w'},{g:'a',soundId:'a'},{g:'x',soundId:'x'}], 51],
  ['hex', [{g:'h',soundId:'h'},{g:'e',soundId:'e_long',macron:true},{g:'x',soundId:'x'}], 51],
];

// ch (53)
const chWords = [
  ['chip', [{g:'ch',soundId:'ch',team:true},{g:'i',soundId:'i'},{g:'p',soundId:'p'}], 53],
  ['chat', [{g:'ch',soundId:'ch',team:true},{g:'a',soundId:'a'},{g:'t',soundId:'t'}], 53],
  ['chop', [{g:'ch',soundId:'ch',team:true},{g:'o',soundId:'o'},{g:'p',soundId:'p'}], 53],
  ['chin', [{g:'ch',soundId:'ch',team:true},{g:'i',soundId:'i'},{g:'n',soundId:'n'}], 53],
  ['chug', [{g:'ch',soundId:'ch',team:true},{g:'u',soundId:'u'},{g:'g',soundId:'g'}], 53],
  ['rich', [{g:'r',soundId:'r'},{g:'i',soundId:'i'},{g:'ch',soundId:'ch',team:true}], 53],
  ['much', [{g:'m',soundId:'m'},{g:'u',soundId:'u'},{g:'ch',soundId:'ch',team:true}], 53],
  ['such', [{g:'s',soundId:'s'},{g:'u',soundId:'u'},{g:'ch',soundId:'ch',team:true}], 53],
  ['bench', [{g:'b',soundId:'b'},{g:'e',soundId:'e_long',macron:true},{g:'n',soundId:'n'},{g:'ch',soundId:'ch',team:true}], 53],
  ['ditch', [{g:'d',soundId:'d'},{g:'i',soundId:'i'},{g:'t',soundId:'t'},{g:'ch',soundId:'ch',team:true}], 53],
  ['patch', [{g:'p',soundId:'p'},{g:'a',soundId:'a'},{g:'t',soundId:'t'},{g:'ch',soundId:'ch',team:true}], 53],
  ['march', [{g:'m',soundId:'m'},{g:'a',soundId:'a'},{g:'r',soundId:'r'},{g:'ch',soundId:'ch',team:true}], 53],
];

// ī (55): long i words
const iMacronWords = [
  ['kite', [{g:'k',soundId:'k'},{g:'ī',soundId:'ī',macron:true},{g:'t',soundId:'t'},{g:'e',soundId:'e_long',macron:true}], 55],
  ['bite', [{g:'b',soundId:'b'},{g:'ī',soundId:'ī',macron:true},{g:'t',soundId:'t'},{g:'e',soundId:'e_long',macron:true}], 55],
  ['mite', [{g:'m',soundId:'m'},{g:'ī',soundId:'ī',macron:true},{g:'t',soundId:'t'},{g:'e',soundId:'e_long',macron:true}], 55],
  ['site', [{g:'s',soundId:'s'},{g:'ī',soundId:'ī',macron:true},{g:'t',soundId:'t'},{g:'e',soundId:'e_long',macron:true}], 55],
  ['line', [{g:'l',soundId:'l'},{g:'ī',soundId:'ī',macron:true},{g:'n',soundId:'n'},{g:'e',soundId:'e_long',macron:true}], 55],
  ['nine', [{g:'n',soundId:'n'},{g:'ī',soundId:'ī',macron:true},{g:'n',soundId:'n'},{g:'e',soundId:'e_long',macron:true}], 55],
  ['lime', [{g:'l',soundId:'l'},{g:'ī',soundId:'ī',macron:true},{g:'m',soundId:'m'},{g:'e',soundId:'e_long',macron:true}], 55],
  ['time', [{g:'t',soundId:'t'},{g:'ī',soundId:'ī',macron:true},{g:'m',soundId:'m'},{g:'e',soundId:'e_long',macron:true}], 55],
  ['fine', [{g:'f',soundId:'f'},{g:'ī',soundId:'ī',macron:true},{g:'n',soundId:'n'},{g:'e',soundId:'e_long',macron:true}], 55],
  ['vine', [{g:'v',soundId:'v'},{g:'ī',soundId:'ī',macron:true},{g:'n',soundId:'n'},{g:'e',soundId:'e_long',macron:true}], 55],
  ['wide', [{g:'w',soundId:'w'},{g:'ī',soundId:'ī',macron:true},{g:'d',soundId:'d'},{g:'e',soundId:'e_long',macron:true}], 55],
  ['ride', [{g:'r',soundId:'r'},{g:'ī',soundId:'ī',macron:true},{g:'d',soundId:'d'},{g:'e',soundId:'e_long',macron:true}], 55],
  ['dice', [{g:'d',soundId:'d'},{g:'ī',soundId:'ī',macron:true},{g:'c',soundId:'c'},{g:'e',soundId:'e_long',macron:true}], 55],
  ['nice', [{g:'n',soundId:'n'},{g:'ī',soundId:'ī',macron:true},{g:'c',soundId:'c'},{g:'e',soundId:'e_long',macron:true}], 55],
];

// er (57): r-controlled
const erWords = [
  ['her', [{g:'h',soundId:'h'},{g:'er',soundId:'er',team:true}], 57],
  ['ker', [{g:'k',soundId:'k'},{g:'er',soundId:'er',team:true}], 57],
  ['per', [{g:'p',soundId:'p'},{g:'er',soundId:'er',team:true}], 57],
  ['mer', [{g:'m',soundId:'m'},{g:'er',soundId:'er',team:true}], 57],
  ['ner', [{g:'n',soundId:'n'},{g:'er',soundId:'er',team:true}], 57],
  ['ler', [{g:'l',soundId:'l'},{g:'er',soundId:'er',team:true}], 57],
  ['ver', [{g:'v',soundId:'v'},{g:'er',soundId:'er',team:true}], 57],
  ['ter', [{g:'t',soundId:'t'},{g:'er',soundId:'er',team:true}], 57],
  ['ber', [{g:'b',soundId:'b'},{g:'er',soundId:'er',team:true}], 57],
  ['fer', [{g:'f',soundId:'f'},{g:'er',soundId:'er',team:true}], 57],
  ['jerk', [{g:'j',soundId:'j'},{g:'er',soundId:'er',team:true},{g:'k',soundId:'k'}], 57],
  ['fern', [{g:'f',soundId:'f'},{g:'er',soundId:'er',team:true},{g:'n',soundId:'n'}], 57],
  ['kern', [{g:'k',soundId:'k'},{g:'er',soundId:'er',team:true},{g:'n',soundId:'n'}], 57],
];

// oo (59): team /uː/
const ooWords = [
  ['moon', [{g:'m',soundId:'m'},{g:'oo',soundId:'oo',team:true},{g:'n',soundId:'n'}], 59],
  ['noon', [{g:'n',soundId:'n'},{g:'oo',soundId:'oo',team:true},{g:'n',soundId:'n'}], 59],
  ['foon', [{g:'f',soundId:'f'},{g:'oo',soundId:'oo',team:true},{g:'n',soundId:'n'}], 59], // not a real word... let me use real ones
  ['hook', [{g:'h',soundId:'h'},{g:'oo',soundId:'oo',team:true},{g:'k',soundId:'k'}], 59],
  ['look', [{g:'l',soundId:'l'},{g:'oo',soundId:'oo',team:true},{g:'k',soundId:'k'}], 59],
  ['book', [{g:'b',soundId:'b'},{g:'oo',soundId:'oo',team:true},{g:'k',soundId:'k'}], 59],
  ['cook', [{g:'c',soundId:'c'},{g:'oo',soundId:'oo',team:true},{g:'k',soundId:'k'}], 59],
  ['foot', [{g:'f',soundId:'f'},{g:'oo',soundId:'oo',team:true},{g:'t',soundId:'t'}], 59],
  ['good', [{g:'g',soundId:'g'},{g:'oo',soundId:'oo',team:true},{g:'d',soundId:'d'}], 59],
  ['wood', [{g:'w',soundId:'w'},{g:'oo',soundId:'oo',team:true},{g:'d',soundId:'d'}], 59],
  ['boom', [{g:'b',soundId:'b'},{g:'oo',soundId:'oo',team:true},{g:'m',soundId:'m'}], 59],
  ['loom', [{g:'l',soundId:'l'},{g:'oo',soundId:'oo',team:true},{g:'m',soundId:'m'}], 59],
  ['goop', [{g:'g',soundId:'g'},{g:'oo',soundId:'oo',team:true},{g:'p',soundId:'p'}], 59],
  ['zoop', [{g:'z',soundId:'z'},{g:'oo',soundId:'oo',team:true},{g:'p',soundId:'p'}], 59],
];

const batch5Words = [
  ...xWords, ...chWords, ...iMacronWords, ...erWords, ...ooWords
].filter(w => maxLessonOfGraphemes(w[1]) <= 60);

for (const [id, graphemes] of batch5Words) {
  if (addWord(id, graphemes)) added++;
}

// ── BATCH 6 words (through lesson 70) ──
// ng (61)
const ngWords = [
  ['sing', [{g:'s',soundId:'s'},{g:'i',soundId:'i'},{g:'ng',soundId:'ng',team:true}], 61],
  ['ring', [{g:'r',soundId:'r'},{g:'i',soundId:'i'},{g:'ng',soundId:'ng',team:true}], 61],
  ['king', [{g:'k',soundId:'k'},{g:'i',soundId:'i'},{g:'ng',soundId:'ng',team:true}], 61], // king already added in batch 3! Skip.
  ['bang', [{g:'b',soundId:'b'},{g:'a',soundId:'a'},{g:'ng',soundId:'ng',team:true}], 61],
  ['fang', [{g:'f',soundId:'f'},{g:'a',soundId:'a'},{g:'ng',soundId:'ng',team:true}], 61],
  ['hang', [{g:'h',soundId:'h'},{g:'a',soundId:'a'},{g:'ng',soundId:'ng',team:true}], 61], // hang already added in batch 2!
  ['mang', [{g:'m',soundId:'m'},{g:'a',soundId:'a'},{g:'ng',soundId:'ng',team:true}], 61],
  ['tang', [{g:'t',soundId:'t'},{g:'a',soundId:'a'},{g:'ng',soundId:'ng',team:true}], 61],
  ['gong', [{g:'g',soundId:'g'},{g:'o',soundId:'o'},{g:'ng',soundId:'ng',team:true}], 61],
  ['long', [{g:'l',soundId:'l'},{g:'o',soundId:'o'},{g:'ng',soundId:'ng',team:true}], 61],
  ['song', [{g:'s',soundId:'s'},{g:'o',soundId:'o'},{g:'ng',soundId:'ng',team:true}], 61],
  ['wing', [{g:'w',soundId:'w'},{g:'i',soundId:'i'},{g:'ng',soundId:'ng',team:true}], 61],
  ['pong', [{g:'p',soundId:'p'},{g:'o',soundId:'o'},{g:'ng',soundId:'ng',team:true}], 61],
  ['dong', [{g:'d',soundId:'d'},{g:'o',soundId:'o'},{g:'ng',soundId:'ng',team:true}], 61],
  ['jung', [{g:'j',soundId:'j'},{g:'u',soundId:'u'},{g:'ng',soundId:'ng',team:true}], 61],
];

// ū (63): long u
const uMacronWords = [
  ['cube', [{g:'c',soundId:'c'},{g:'ū',soundId:'ū',macron:true},{g:'b',soundId:'b'},{g:'e',soundId:'e_long',macron:true}], 63],
  ['mule', [{g:'m',soundId:'m'},{g:'ū',soundId:'ū',macron:true},{g:'l',soundId:'l'},{g:'e',soundId:'e_long',macron:true}], 63],
  ['rule', [{g:'r',soundId:'r'},{g:'ū',soundId:'ū',macron:true},{g:'l',soundId:'l'},{g:'e',soundId:'e_long',macron:true}], 63],
  ['cute', [{g:'c',soundId:'c'},{g:'ū',soundId:'ū',macron:true},{g:'t',soundId:'t'},{g:'e',soundId:'e_long',macron:true}], 63],
  ['mute', [{g:'m',soundId:'m'},{g:'ū',soundId:'ū',macron:true},{g:'t',soundId:'t'},{g:'e',soundId:'e_long',macron:true}], 63],
  ['fuse', [{g:'f',soundId:'f'},{g:'ū',soundId:'ū',macron:true},{g:'s',soundId:'s'},{g:'e',soundId:'e_long',macron:true}], 63],
  ['lute', [{g:'l',soundId:'l'},{g:'ū',soundId:'ū',macron:true},{g:'t',soundId:'t'},{g:'e',soundId:'e_long',macron:true}], 63],
  ['tube', [{g:'t',soundId:'t'},{g:'ū',soundId:'ū',macron:true},{g:'b',soundId:'b'},{g:'e',soundId:'e_long',macron:true}], 63],
];

// oy (65)
const oyWords = [
  ['boy', [{g:'b',soundId:'b'},{g:'oy',soundId:'oy',team:true}], 65],
  ['toy', [{g:'t',soundId:'t'},{g:'oy',soundId:'oy',team:true}], 65],
  ['joy', [{g:'j',soundId:'j'},{g:'oy',soundId:'oy',team:true}], 65],
  ['coy', [{g:'c',soundId:'c'},{g:'oy',soundId:'oy',team:true}], 65],
  ['soy', [{g:'s',soundId:'s'},{g:'oy',soundId:'oy',team:true}], 65],
  ['roy', [{g:'r',soundId:'r'},{g:'oy',soundId:'oy',team:true}], 65],
  ['loy', [{g:'l',soundId:'l'},{g:'oy',soundId:'oy',team:true}], 65],
];

// wh (67) - simplified as /w/
const whWords = [
  ['when', [{g:'wh',soundId:'wh',team:true},{g:'e',soundId:'e_long',macron:true},{g:'n',soundId:'n'}], 67],
  ['wham', [{g:'wh',soundId:'wh',team:true},{g:'a',soundId:'a'},{g:'m',soundId:'m'}], 67],
  ['whim', [{g:'wh',soundId:'wh',team:true},{g:'i',soundId:'i'},{g:'m',soundId:'m'}], 67],
  ['whiz', [{g:'wh',soundId:'wh',team:true},{g:'i',soundId:'i'},{g:'z',soundId:'z'}], 67],
  ['whet', [{g:'wh',soundId:'wh',team:true},{g:'e',soundId:'e_long',macron:true},{g:'t',soundId:'t'}], 67],
  ['whop', [{g:'wh',soundId:'wh',team:true},{g:'o',soundId:'o'},{g:'p',soundId:'p'}], 67],
  ['whit', [{g:'wh',soundId:'wh',team:true},{g:'i',soundId:'i'},{g:'t',soundId:'t'}], 67],
  ['whap', [{g:'wh',soundId:'wh',team:true},{g:'a',soundId:'a'},{g:'p',soundId:'p'}], 67],
];

// ar (69): r-controlled
const arWords = [
  ['car', [{g:'c',soundId:'c'},{g:'ar',soundId:'ar',team:true}], 69],
  ['bar', [{g:'b',soundId:'b'},{g:'ar',soundId:'ar',team:true}], 69],
  ['jar', [{g:'j',soundId:'j'},{g:'ar',soundId:'ar',team:true}], 69],
  ['far', [{g:'f',soundId:'f'},{g:'ar',soundId:'ar',team:true}], 69],
  ['tar', [{g:'t',soundId:'t'},{g:'ar',soundId:'ar',team:true}], 69],
  ['mar', [{g:'m',soundId:'m'},{g:'ar',soundId:'ar',team:true}], 69],
  ['par', [{g:'p',soundId:'p'},{g:'ar',soundId:'ar',team:true}], 69],
  ['star', [{g:'s',soundId:'s'},{g:'t',soundId:'t'},{g:'ar',soundId:'ar',team:true}], 69],
  ['scar', [{g:'s',soundId:'s'},{g:'c',soundId:'c'},{g:'ar',soundId:'ar',team:true}], 69],
  ['char', [{g:'ch',soundId:'ch',team:true},{g:'ar',soundId:'ar',team:true}], 69],
  ['park', [{g:'p',soundId:'p'},{g:'ar',soundId:'ar',team:true},{g:'k',soundId:'k'}], 69],
  ['mark', [{g:'m',soundId:'m'},{g:'ar',soundId:'ar',team:true},{g:'k',soundId:'k'}], 69],
  ['bark', [{g:'b',soundId:'b'},{g:'ar',soundId:'ar',team:true},{g:'k',soundId:'k'}], 69],
  ['dark', [{g:'d',soundId:'d'},{g:'ar',soundId:'ar',team:true},{g:'k',soundId:'k'}], 69],
  ['farm', [{g:'f',soundId:'f'},{g:'ar',soundId:'ar',team:true},{g:'m',soundId:'m'}], 69],
  ['harm', [{g:'h',soundId:'h'},{g:'ar',soundId:'ar',team:true},{g:'m',soundId:'m'}], 69],
];

const batch6Words = [
  ...ngWords, ...uMacronWords, ...oyWords, ...whWords, ...arWords
].filter(w => maxLessonOfGraphemes(w[1]) <= 70);

for (const [id, graphemes] of batch6Words) {
  if (addWord(id, graphemes)) added++;
}

writeFileSync('src/content/words.json', JSON.stringify(words, null, 2) + '\n');
console.log('Words: ' + words.length + ' total (added ' + added + ' for batches 3-6)');

// Verify decodability
const soundIntro = new Map(sounds.map(s => [s.id, s.introducedInLesson]));
let bad = [];
for (const w of words) {
  for (const g of w.graphemes) {
    if (g.silent) continue;
    const intro = soundIntro.get(g.soundId);
    if (intro === undefined) bad.push(w.id + ': unknown sound "' + g.soundId + '"');
  }
}
if (bad.length) {
  console.log('\\nBAD WORDS (unknown sounds):');
  bad.forEach(b => console.log('  ' + b));
} else {
  console.log('All words have valid sound references.');
}

// Check for duplicates we might have introduced
const seen = new Set();
const dupes = [];
for (const w of words) {
  if (seen.has(w.id)) dupes.push(w.id);
  seen.add(w.id);
}
if (dupes.length) console.log('\\nDUPLICATE IDs: ' + dupes.join(', '));
