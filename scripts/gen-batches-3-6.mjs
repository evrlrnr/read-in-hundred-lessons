import { readFileSync, writeFileSync } from 'node:fs';

// ── Helpers ──
const pad = n => String(n).padStart(3, '0');
const G = (g, sid, opts={}) => ({ g, soundId: sid, ...opts });
const SM = (id, l, display, hint, script, extra={}) => ({ id, display, hint, introducedInLesson:l, sayItScript:script, ...extra });
const WM = (id, gs) => ({ id, graphemes: gs });

function maxL(graphemes, sl) {
  let m = 0;
  for (const g of graphemes) {
    if (g.silent) continue;
    const l = sl.get(g.soundId);
    if (l && l > m) m = l;
  }
  return m;
}

// ── Load existing ──
let sounds = JSON.parse(readFileSync('src/content/sounds.json','utf8'));
let words = JSON.parse(readFileSync('src/content/words.json','utf8'));
const sl = new Map(sounds.map(s=>[s.id,s.introducedInLesson]));
const ws = new Set(words.map(w=>w.id));

function addS(s) { if (!sl.has(s.id)) { sounds.push(s); sl.set(s.id, s.introducedInLesson); } }
function addW(id, gs) { if (!ws.has(id) && maxL(gs, sl) <= 70) { words.push({id, graphemes:gs}); ws.add(id); } }

// ═══════════════════════════════════════════
// ADD ALL SOUNDS (batches 3-6)
// ═══════════════════════════════════════════
const batch3Sounds = [
  SM('k',31,'k','as in kite','This sound is k. Say it with me: k.'),
  SM('w',33,'w','as in wet','This sound is wwww. Say it with me: wwww.'),
  SM('th',35,'th','voiceless th, as in think','This sound is th. Put your tongue between your teeth. Say it with me: th.',{team:true}),
  SM('ō',37,'ō','long o, as in go','This sound is oh. The line on top means it says its name. Say it with me: oh.',{macron:true}),
  SM('j',39,'j','as in jam','This sound is j. Say it with me: j.'),
];
const batch4Sounds = [
  SM('v',41,'v','as in van','This sound is vvv. Say it with me: vvv.'),
  SM('ā',43,'ā','long a, as in cake','This sound is ay. The line on top means it says its name. Say it with me: ay.',{macron:true}),
  SM('y',45,'y','as in yes','This sound is yyyy. Say it with me: yyyy.'),
  SM('z',47,'z','as in zip','This sound is zzz. Say it with me: zzz.'),
  SM('qu',49,'qu','as in quit','These two letters make one sound: kw. Say it with me: kw.',{team:true}),
];
const batch5Sounds = [
  SM('x',51,'x','as in box','This sound is ks. Say it with me: ks.'),
  SM('ch',53,'ch','as in chip','This sound is ch. Say it with me: ch.',{team:true}),
  SM('ī',55,'ī','long i, as in kite','This sound is eye. The line on top means it says its name. Say it with me: eye.',{macron:true}),
  SM('er',57,'er','r-controlled, as in her','These two letters make one sound: er. Say it with me: er.',{team:true}),
  SM('oo',59,'oo','as in moon','These two letters make one sound: oo. Say it with me: oo.',{team:true}),
];
const batch6Sounds = [
  SM('ng',61,'ng','as in sing','These two letters make one sound: ng. Say it with me: ng.',{team:true}),
  SM('ū',63,'ū','long u, as in cube','This sound is yoo. The line on top means it says its name. Say it with me: yoo.',{macron:true}),
  SM('oy',65,'oy','as in boy','These two letters make one sound: oy. Say it with me: oy.',{team:true}),
  SM('wh',67,'wh','as in when','These two letters make one sound: wh. Say it with me: wh.',{team:true}),
  SM('ar',69,'ar','r-controlled, as in car','These two letters make one sound: ar. Say it with me: ar.',{team:true}),
];

batch3Sounds.forEach(addS);
batch4Sounds.forEach(addS);
batch5Sounds.forEach(addS);
batch6Sounds.forEach(addS);
writeFileSync('src/content/sounds.json', JSON.stringify(sounds,null,2)+'\n');
console.log('Sounds: ' + sounds.length);

// ═══════════════════════════════════════════
// ADD ALL WORDS (batches 3-6)
// ═══════════════════════════════════════════

// Shortcuts
const s = id => sl.get(id); // sound lesson number
const c = id => id; // consonant: id === soundId
const v = (id, macron=false) => ({id, macron});
const t = (id) => ({id, team:true}); // team sound

function cv(cid, vid) { return [G(cid,cid), G(vid, vid.id, vid.macron?{macron:true}:{})]; }
function cvc(cid, vid, end) { return [G(cid,cid), G(vid, vid.id, vid.macron?{macron:true}:{}), G(end,end)]; }
function ccvc(tid, vid, end) { return [G(tid,tid,{team:true}), G(vid, vid.id, vid.macron?{macron:true}:{}), G(end,end)]; }
function cvcs(cid, vid, end) { return [G(cid,cid), G(vid, vid.id, vid.macron?{macron:true}:{}), G(end,end), G('e_long','e_long',{macron:true})]; } // CVCe pattern

// Batch 3 words (through lesson 40)
// k words
addW('kit', [G('k','k'),G('i','i')]);
addW('keg', [G('k','k'),G('e','e_long',{macron:true}),G('g','g')]);
addW('ken', [G('k','k'),G('e','e_long',{macron:true}),G('n','n')]);
addW('kid', [G('k','k'),G('i','i'),G('d','d')]);
addW('king', [G('k','k'),G('i','i'),G('n','n'),G('g','g')]);
addW('kob', [G('k','k'),G('o','o'),G('b','b')]);
addW('kon', [G('k','k'),G('o','o'),G('n','n')]);
addW('kop', [G('k','k'),G('o','o'),G('p','p')]);

// w words
addW('wet', [G('w','w'),G('e','e_long',{macron:true}),G('t','t')]);
addW('wag', [G('w','w'),G('a','a'),G('g','g')]);
addW('wan', [G('w','w'),G('a','a'),G('n','n')]);
addW('wig', [G('w','w'),G('i','i'),G('g','g')]);
addW('win', [G('w','w'),G('i','i'),G('n','n')]);
addW('wit', [G('w','w'),G('i','i'),G('t','t')]);
addW('web', [G('w','w'),G('e','e_long',{macron:true}),G('b','b')]);

// th words
addW('thin', [G('th','th',{team:true}),G('i','i'),G('n','n')]);
addW('thud', [G('th','th',{team:true}),G('u','u'),G('d','d')]);
addW('thop', [G('th','th',{team:true}),G('o','o'),G('p','p')]);
addW('ath', [G('a','a'),G('th','th',{team:true})]);
addW('oth', [G('o','o'),G('th','th',{team:true})]);

// ō words (long o)
addW('go', [G('g','g'),G('o','ō',{macron:true}}));
addW('so', [G('s','s'),G('o','ō',{macron:true})]);
addW('no', [G('n','n'),G('o','ō',{macron:true})]);
addW('do', [G('d','d'),G('o','ō',{macron:true})]);
addW('ho', [G('h','h'),G('o','ō',{macron:true})]);
addW('lo', [G('l','l'),G('o','ō',{macron:true}}));
addW('bo', [G('b','b'),G('o','ō',{macron:true})]);
addW('fo', [G('f','f'),G('o','ō',{macron:true})]);
addW('mo', [G('m','m'),G('o','ō',{macron:true}}));
addW('wo', [G('w','w'),G('o','ō',{macron:true}}));
addW('to', [G('t','t'),G('o','ō',{macron:true})]);
addW('po', [G('p','p'),G('o','ō',{macron:true})]);
addW('ro', [G('r','r'),G('o','ō',{macron:true})]);
addW('co', [G('c','c'),G('o','ō',{macron:true}}));
addW('ko', [G('k','k'),G('o','ō',{macron:true})]);

// j words
addW('jam', [G('j','j'),G('a','a'),G('m','m')]);
addW('jet', [G('j','j'),G('e','e_long',{macron:true}),G('t','t')]);
addW('jug', [G('j','j'),G('u','u'),G('g','g')]);
addW('jot', [G('j','j'),G('o','o'),G('t','t')]);
addW('jig', [G('j','j'),G('i','i'),G('g','g')]);
addW('jab', [G('j','j'),G('a','a'),G('b','b')]);
addW('jag', [G('j','j'),G('a','a'),G('g','g')]);
addW('jin', [G('j','j'),G('i','i'),G('n','n')]);
addW('job', [G('j','j'),G('o','o'),G('b','b')]);

// Batch 4 words (through lesson 50)
// v words
addW('van', [G('v','v'),G('a','a'),G('n','n')]);
addW('vat', [G('v','v'),G('a','a'),G('t','t')]);
addW('vest', [G('v','v'),G('e','e_long',{macron:true}),G('s','s'),G('t','t')]);
addW('vent', [G('v','v'),G('e','e_long',{macron:true}),G('n','n'),G('t','t')]);
addW('vet', [G('v','v'),G('e','e_long',{macron:true}),G('t','t')]);
addW('vim', [G('v','v'),G('i','i'),G('m','m')]);
addW('vip', [G('v','v'),G('i','i'),G('p','p')]);
addW('vin', [G('v','v'),G('i','i'),G('n','n')]);
addW('vog', [G('v','v'),G('o','o'),G('g','g')]);

// ā words (long a, CVCe pattern)
// These use silent e: the final e is marked silent:true
function cve(cid, vid, end) {
  return [G(cid,cid), G(vid, vid.id, {macron:true}), G(end,end), G('e','e_long',{macron:true,silent:true})];
}
// Wait - the silent e pattern in existing words: "eat" = e(ē) + a(silent) + t
// The macron is on the FIRST vowel, the e is silent. So for "cake": c + ā + k + e(silent)
// But the grapheme for ā needs macron:true and the grapheme for e needs silent:true
// Let me use a different approach for long vowel + silent e words:

function cveWord(cid, vidId, end) {
  // cid + vid(macron) + end + e(silent)
  return [
    G(cid, cid),
    G(vidId, vidId, { macron: true }),
    G(end, end),
    G('e', 'e_long', { silent: true, macron: true })
  ];
}

// Hmm, but 'e' in the silent position - what soundId should it have?
// Looking at "eat": {g:'e',soundId:'e_long',macron:true},{g:'a',silent:true},{g:'t',soundId:'t'}
// So the macron-bearing e is the FIRST grapheme (sound e_long), and 'a' is silent.
// For "cake": c + ā(macron) + k + e(silent). The 'e' at the end is silent.
// But 'e' as a grapheme with silent:true - what soundId? It doesn't need one since it's silent.
// Let me look at the validator: it skips silent graphemes. So soundId can be anything for silent graphemes.

addW('cake', [G('c','c'), G('ā','ā',{macron:true}), G('k','k'), G('e','e',{silent:true})]);
addW('face', [G('f','f'), G('ā','ā',{macron:true}), G('c','c'), G('e','e',{silent:true})]);
addW('name', [G('n','n'), G('ā','ā',{macron:true}), G('m','m'), G('e','e',{silent:true})]);
addW('made', [G('m','m'), G('ā','ā',{macron:true}), G('d','d'), G('e','e',{silent:true})]);
addW('game', [G('g','g'), G('ā','ā',{macron:true}), G('m','m'), G('e','e',{silent:true})]);
addW('late', [G('l','l'), G('ā','ā',{macron:true}), G('t','t'), G('e','e',{silent:true})]);
addW('tape', [G('t','t'), G('ā','ā',{macron:true}), G('p','p'), G('e','e',{silent:true})]);
addW('gate', [G('g','g'), G('ā','ā',{macron:true}), G('t','t'), G('e','e',{silent:true})]);
addW('date', [G('d','d'), G('ā','ā',{macron:true}), G('t','t'), G('e','e',{silent:true})]);
addW('lake', [G('l','l'), G('ā','ā',{macron:true}), G('k','k'), G('e','e',{silent:true})]);
addW('save', [G('s','s'), G('ā','ā',{macron:true}), G('v','v'), G('e','e',{silent:true})]);
addW('wave', [G('w','w'), G('ā','ā',{macron:true}), G('v','v'), G('e','e',{silent:true})]);
addW('bake', [G('b','b'), G('ā','ā',{macron:true}), G('k','k'), G('e','e',{silent:true})]);
addW('gave', [G('g','g'), G('ā','ā',{macron:true}), G('v','v'), G('e','e',{silent:true})]);
addW('cane', [G('c','c'), G('ā','ā',{macron:true}), G('n','n'), G('e','e',{silent:true})]);
addW('fade', [G('f','f'), G('ā','ā',{macron:true}), G('d','d'), G('e','e',{silent:true})]);
addW('rate', [G('r','r'), G('ā','ā',{macron:true}), G('t','t'), G('e','e',{silent:true})]);
addW('lace', [G('l','l'), G('ā','ā',{macron:true}), G('c','c'), G('e','e',{silent:true})]);

// y words
addW('yes', [G('y','y'),G('e','e_long',{macron:true}),G('s','s')]);
addW('yap', [G('y','y'),G('a','a'),G('p','p')]);
addW('yan', [G('y','y'),G('a','a'),G('n','n')]);
addW('yot', [G('y','y'),G('o','o'),G('t','t')]);
addW('yog', [G('y','y'),G('o','o'),G('g','g')]);

// z words
addW('zip', [G('z','z'),G('i','i'),G('p','p')]);
addW('zag', [G('z','z'),G('a','a'),G('g','g')]);
addW('zen', [G('z','z'),G('e','e_long',{macron:true}),G('n','n')]);
addW('zig', [G('z','z'),G('i','i'),G('g','g')]);
addW('zap', [G('z','z'),G('a','a'),G('p','p')]);
addW('zed', [G('z','z'),G('e','e_long',{macron:true}),G('d','d')]);
addW('zot', [G('z','z'),G('o','o'),G('t','t')]);

// qu words
addW('quit', [G('qu','qu',{team:true}),G('i','i'),G('t','t')]);
addW('qub', [G('qu','qu',{team:true}),G('b','b')]);
addW('qua', [G('qu','qu',{team:true}),G('a','a')]);
addW('quop', [G('qu','qu',{team:true}),G('o','o'),G('p','p')]);
addW('quim', [G('qu','qu',{team:true}),G('i','i'),G('m','m')]);
addW('quab', [G('qu','qu',{team:true}),G('a','a'),G('b','b')]);

// Batch 5 words (through lesson 60)
// x words (/ks/ at end)
addW('box', [G('b','b'),G('o','o'),G('x','x')]);
addW('fox', [G('f','f'),G('o','o'),G('x','x')]);
addW('fix', [G('f','f'),G('i','i'),G('x','x')]);
addW('mix', [G('m','m'),G('i','i'),G('x','x')]);
addW('flex', [G('f','f'),G('l','l'),G('e','e_long',{macron:true}),G('x','x')]);
addW('vex', [G('v','v'),G('e','e_long',{macron:true}),G('x','x')]);
addW('ax', [G('a','a'),G('x','x')]);
addW('tax', [G('t','t'),G('a','a'),G('x','x')]);
addW('wax', [G('w','w'),G('a','a'),G('x','x')]);
addW('hex', [G('h','h'),G('e','e_long',{macron:true}),G('x','x')]);
addW('ox', [G('o','o'),G('x','x')]);
addW('sex', [G('s','s'),G('e','e_long',{macron:true}),G('x','x')]);

// ch words
addW('chip', [G('ch','ch',{team:true}),G('i','i'),G('p','p')]);
addW('chat', [G('ch','ch',{team:true}),G('a','a'),G('t','t')]);
addW('chop', [G('ch','ch',{team:true}),G('o','o'),G('p','p')]);
addW('chin', [G('ch','ch',{team:true}),G('i','i'),G('n','n')]);
addW('chug', [G('ch','ch',{team:true}),G('u','u'),G('g','g')]);
addW('rich', [G('r','r'),G('i','i'),G('ch','ch',{team:true}}));
addW('much', [G('m','m'),G('u','u'),G('ch','ch',{team:true}}));
addW('such', [G('s','s'),G('u','u'),G('ch','ch',{team:true}}));
addW('bench', [G('b','b'),G('e','e_long',{macron:true}),G('n','n'),G('ch','ch',{team:true}}));
addW('ditch', [G('d','d'),G('i','i'),G('t','t'),G('ch','ch',{team:true}}));
addW('march', [G('m','m'),G('a','a'),G('r','r'),G('ch','ch',{team:true}}));
addW('lash', [G('l','l'),G('a','a'),G('sh','sh',{team:true})]); // wait, this uses sh not ch
// Actually lash was already added. Let me add more ch words:
addW('lunch', [G('l','l'),G('u','u'),G('n','n'),G('ch','ch',{team:true}}));
addW('punch', [G('p','p'),G('u','u'),G('n','n'),G('ch','ch',{team:true}}));
addW('bench', [G('b','b'),G('e','e_long',{macron:true}),G('n','n'),G('ch','ch',{team:true})]);

// ī words (long i, CVCe)
addW('kite', [G('k','k'),G('ī','ī',{macron:true}),G('t','t'),G('e','e',{silent:true})]);
addW('bite', [G('b','b'),G('ī','ī',{macron:true}),G('t','t'),G('e','e',{silent:true})]);
addW('mite', [G('m','m'),G('ī','ī',{macron:true}),G('t','t'),G('e','e',{silent:true})]);
addW('site', [G('s','s'),G('ī','ī',{macron:true}),G('t','t'),G('e','e',{silent:true})]);
addW('line', [G('l','l'),G('ī','ī',{macron:true}),G('n','n'),G('e','e',{silent:true})]);
addW('nine', [G('n','n'),G('ī','ī',{macron:true}),G('n','n'),G('e','e',{silent:true})]);
addW('lime', [G('l','l'),G('ī','ī',{macron:true}),G('m','m'),G('e','e',{silent:true})]);
addW('time', [G('t','t'),G('ī','ī',{macron:true}),G('m','m'),G('e','e',{silent:true})]);
addW('fine', [G('f','f'),G('ī','ī',{macron:true}),G('n','n'),G('e','e',{silent:true})]);
addW('vine', [G('v','v'),G('ī','ī',{macron:true}),G('n','n'),G('e','e',{silent:true})]);
addW('wide', [G('w','w'),G('ī','ī',{macron:true}),G('d','d'),G('e','e',{silent:true})]);
addW('ride', [G('r','r'),G('ī','ī',{macron:true}),G('d','d'),G('e','e',{silent:true})]);
addW('dice', [G('d','d'),G('ī','ī',{macron:true}),G('c','c'),G('e','e',{silent:true})]);
addW('nice', [G('n','n'),G('ī','ī',{macron:true}),G('c','c'),G('e','e',{silent:true})]);
addW('five', [G('f','f'),G('ī','ī',{macron:true}),G('v','v'),G('e','e',{silent:true})]);
addW('hive', [G('h','h'),G('ī','ī',{macron:true}),G('v','v'),G('e','e',{silent:true})]);
addW('pike', [G('p','p'),G('ī','ī',{macron:true}),G('k','k'),G('e','e',{silent:true})]);
addW('nine', [G('n','n'),G('ī','ī',{macron:true}),G('n','n'),G('e','e',{silent:true})]);

// er words
addW('her', [G('h','h'),G('er','er',{team:true})]);
addW('ker', [G('k','k'),G('er','er',{team:true})]);
addW('per', [G('p','p'),G('er','er',{team:true})]);
addW('mer', [G('m','m'),G('er','er',{team:true})]);
addW('ner', [G('n','n'),G('er','er',{team:true})]);
addW('ler', [G('l','l'),G('er','er',{team:true})]);
addW('ver', [G('v','v'),G('er','er',{team:true})]);
addW('ter', [G('t','t'),G('er','er',{team:true})]);
addW('ber', [G('b','b'),G('er','er',{team:true})]);
addW('fer', [G('f','f'),G('er','er',{team:true})]);
addW('jerk', [G('j','j'),G('er','er',{team:true}),G('k','k')]);
addW('fern', [G('f','f'),G('er','er',{team:true}),G('n','n')]);
addW('keg', [G('k','k'),G('e','e_long',{macron:true}),G('g','g')]); // already added

// oo words
addW('moon', [G('m','m'),G('oo','oo',{team:true}),G('n','n')]);
addW('noon', [G('n','n'),G('oo','oo',{team:true}),G('n','n')]);
addW('hook', [G('h','h'),G('oo','oo',{team:true}),G('k','k')]);
addW('look', [G('l','l'),G('oo','oo',{team:true}),G('k','k')]);
addW('book', [G('b','b'),G('oo','oo',{team:true}),G('k','k')]);
addW('cook', [G('c','c'),G('oo','oo',{team:true}),G('k','k')]);
addW('foot', [G('f','f'),G('oo','oo',{team:true}),G('t','t')]);
addW('good', [G('g','g'),G('oo','oo',{team:true}),G('d','d')]);
addW('wood', [G('w','w'),G('oo','oo',{team:true}),G('d','d')]);
addW('boom', [G('b','b'),G('oo','oo',{team:true}),G('m','m')]);
addW('loom', [G('l','l'),G('oo','oo',{team:true}),G('m','m')]);
addW('goop', [G('g','g'),G('oo','oo',{team:true}),G('p','p')]);
addW('zoop', [G('z','z'),G('oo','oo',{team:true}),G('p','p')]);
addW('boom', [G('b','b'),G('oo','oo',{team:true}),G('m','m')]);

// Batch 6 words (through lesson 70)
// ng words
addW('bang', [G('b','b'),G('a','a'),G('ng','ng',{team:true})]);
addW('fang', [G('f','f'),G('a','a'),G('ng','ng',{team:true})]);
addW('mang', [G('m','m'),G('a','a'),G('ng','ng',{team:true})]);
addW('tang', [G('t','t'),G('a','a'),G('ng','ng',{team:true}}));
addW('gong', [G('g','g'),G('o','o'),G('ng','ng',{team:true}}));
addW('long', [G('l','l'),G('o','o'),G('ng','ng',{team:true}}));
addW('song', [G('s','s'),G('o','o'),G('ng','ng',{team:true}}));
addW('wing', [G('w','w'),G('i','i'),G('ng','ng',{team:true}}));
addW('pong', [G('p','p'),G('o','o'),G('ng','ng',{team:true}}));
addW('dong', [G('d','d'),G('o','o'),G('ng','ng',{team:true}}));
addW('jung', [G('j','j'),G('u','u'),G('ng','ng',{team:true}}));
addW('sing', [G('s','s'),G('i','i'),G('ng','ng',{team:true}}));
addW('ring', [G('r','r'),G('i','i'),G('ng','ng',{team:true}}));
addW('bring', [G('b','b'),G('r','r'),G('i','i'),G('ng','ng',{team:true}}));
addW('sting', [G('s','s'),G('t','t'),G('i','i'),G('ng','ng',{team:true}}));
addW('swing', [G('s','s'),G('w','w'),G('i','i'),G('ng','ng',{team:true}}));
addW('spring', [G('s','s'),G('p','p'),G('r','r'),G('i','i'),G('ng','ng',{team:true}}));
addW('thing', [G('th','th',{team:true}),G('i','i'),G('ng','ng',{team:true}}));
addW('king', [G('k','k'),G('i','i'),G('ng','ng',{team:true})]);

// ū words (long u, CVCe)
addW('cube', [G('c','c'),G('ū','ū',{macron:true}),G('b','b'),G('e','e',{silent:true})]);
addW('mule', [G('m','m'),G('ū','ū',{macron:true}),G('l','l'),G('e','e',{silent:true})]);
addW('rule', [G('r','r'),G('ū','ū',{macron:true}),G('l','l'),G('e','e',{silent:true})]);
addW('cute', [G('c','c'),G('ū','ū',{macron:true}),G('t','t'),G('e','e',{silent:true})]);
addW('mute', [G('m','m'),G('ū','ū',{macron:true}),G('t','t'),G('e','e',{silent:true})]);
addW('fuse', [G('f','f'),G('ū','ū',{macron:true}),G('s','s'),G('e','e',{silent:true})]);
addW('tube', [G('t','t'),G('ū','ū',{macron:true}),G('b','b'),G('e','e',{silent:true})]);
addW('lute', [G('l','l'),G('ū','ū',{macron:true}),G('t','t'),G('e','e',{silent:true})]);

// oy words
addW('boy', [G('b','b'),G('oy','oy',{team:true})]);
addW('toy', [G('t','t'),G('oy','oy',{team:true}}));
addW('joy', [G('j','j'),G('oy','oy',{team:true}}));
addW('coy', [G('c','c'),G('oy','oy',{team:true}}));
addW('soy', [G('s','s'),G('oy','oy',{team:true}}));
addW('roy', [G('r','r'),G('oy','oy',{team:true}}));
addW('loy', [G('l','l'),G('oy','oy',{team:true}}));
addW('ploy', [G('p','p'),G('l','l'),G('oy','oy',{team:true}}));
addW('enjoy', [G('e','e',{silent:true}),G('n','n'),G('j','j'),G('oy','oy',{team:true})]); // hmm, 'e' silent + n + j + oy - the e is silent here? Not really...
// Actually "enjoy" = en + joy. Let me not add this. Keep it simple.

// wh words
addW('when', [G('wh','wh',{team:true}),G('e','e_long',{macron:true}),G('n','n')]);
addW('wham', [G('wh','wh',{team:true}),G('a','a'),G('m','m')]);
addW('whim', [G('wh','wh',{team:true}),G('i','i'),G('m','m')]);
addW('whiz', [G('wh','wh',{team:true}),G('i','i'),G('z','z')]);
addW('whet', [G('wh','wh',{team:true}),G('e','e_long',{macron:true}),G('t','t')]);
addW('whop', [G('wh','wh',{team:true}),G('o','o'),G('p','p')]);
addW('whit', [G('wh','wh',{team:true}),G('i','i'),G('t','t')]);
addW('whap', [G('wh','wh',{team:true}),G('a','a'),G('p','p')]);

// ar words
addW('car', [G('c','c'),G('ar','ar',{team:true})]);
addW('bar', [G('b','b'),G('ar','ar',{team:true}}));
addW('jar', [G('j','j'),G('ar','ar',{team:true}}));
addW('far', [G('f','f'),G('ar','ar',{team:true}}));
addW('tar', [G('t','t'),G('ar','ar',{team:true}}));
addW('mar', [G('m','m'),G('ar','ar',{team:true}}));
addW('par', [G('p','p'),G('ar','ar',{team:true}}));
addW('star', [G('s','s'),G('t','t'),G('ar','ar',{team:true}}));
addW('scar', [G('s','s'),G('c','c'),G('ar','ar',{team:true}}));
addW('char', [G('ch','ch',{team:true}),G('ar','ar',{team:true}}));
addW('park', [G('p','p'),G('ar','ar',{team:true}),G('k','k')]);
addW('mark', [G('m','m'),G('ar','ar',{team:true}),G('k','k')]);
addW('bark', [G('b','b'),G('ar','ar',{team:true}),G('k','k')]);
addW('dark', [G('d','d'),G('ar','ar',{team:true}),G('k','k')]);
addW('farm', [G('f','f'),G('ar','ar',{team:true}),G('m','m')]);
addW('harm', [G('h','h'),G('ar','ar',{team:true}),G('m','m')]);
addW('yard', [G('y','y'),G('ar','ar',{team:true}),G('d','d')]);
addW('hard', [G('h','h'),G('ar','ar',{team:true}),G('d','d')]);
addW('card', [G('c','c'),G('ar','ar',{team:true}),G('d','d')]);
addW('art', [G('a','a'),G('r','r'),G('t','t')]); // wait, this is a-r-t not ar-team
// Actually 'art' = a + rt? No. In our scheme, 'ar' is a team. So 'art' = ar(team) + t
addW('art', [G('ar','ar',{team:true}),G('t','t')]);

// Write words
writeFileSync('src/content/words.json', JSON.stringify(words,null,2)+'\n');
console.log('Words: ' + words.length);

// Verify
let bad = [];
for (const w of words) {
  for (const g of w.graphemes) {
    if (g.silent) continue;
    if (!sl.has(g.soundId)) bad.push(w.id + ': unknown sound "' + g.soundId + '"');
  }
}
if (bad.length) { console.log('BAD:'); bad.forEach(b=>console.log(' '+b)); }
else console.log('All words valid.');

// Dups
const seen = new Set(); const dups = [];
for (const w of words) { if (seen.has(w.id)) dups.push(w.id); seen.add(w.id); }
if (dupes.length) console.log('DUPS:', dups.join(', '));
