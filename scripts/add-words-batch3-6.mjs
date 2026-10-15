import { readFileSync, writeFileSync } from 'node:fs';

let words = JSON.parse(readFileSync('src/content/words.json','utf8'));
const ws = new Set(words.map(w=>w.id));
let added = 0;

function add(id, graphemes) {
  if (ws.has(id)) return;
  words.push({ id, graphemes });
  ws.add(id);
  added++;
}

// Each entry: [wordId, [[graphemeChar, soundId, flags], ...]]
// flags: 't'=team, 'm'=macron, 's'=silent
const DATA = [
  // === BATCH 3: k, w, th, ō, j (through lesson 40) ===
  // k words
  ['kit',    [['k','k'],['i','i']]],
  ['keg',    [['k','k'],['e','e_long','m'],['g','g']]],
  ['ken',    [['k','k'],['e','e_long','m'],['n','n']]],
  ['kid',    [['k','k'],['i','i'],['d','d']]],
  ['king',   [['k','k'],['i','i'],['n','n'],['g','g']]],
  ['kob',    [['k','k'],['o','o'],['b','b']]],
  ['kon',    [['k','k'],['o','o'],['n','n']]],
  ['kop',    [['k','k'],['o','o'],['p','p']]],
  // w words
  ['wet',    [['w','w'],['e','e_long','m'],['t','t']]],
  ['wag',    [['w','w'],['a','a'],['g','g']]],
  ['wan',    [['w','w'],['a','a'],['n','n']]],
  ['wig',    [['w','w'],['i','i'],['g','g']]],
  ['win',    [['w','w'],['i','i'],['n','n']]],
  ['wit',    [['w','w'],['i','i'],['t','t']]],
  ['web',    [['w','w'],['e','e_long','m'],['b','b']]],
  // th words (team)
  ['thin',   [['th','th','t'],['i','i'],['n','n']]],
  ['thud',   [['th','th','t'],['u','u'],['d','d']]],
  ['thop',   [['th','th','t'],['o','o'],['p','p']]],
  ['ath',    [['a','a'],['th','th','t']]],
  ['oth',    [['o','o'],['th','th','t']]],
  // ō words (macron on o)
  ['go',     [['g','g'],['o','ō','m']]],
  ['so',     [['s','s'],['o','ō','m']]],
  ['no',     [['n','n'],['o','ō','m']]],
  ['do',     [['d','d'],['o','ō','m']]],
  ['ho',     [['h','h'],['o','ō','m']]],
  ['lo',     [['l','l'],['o','ō','m']]],
  ['bo',     [['b','b'],['o','ō','m']]],
  ['fo',     [['f','f'],['o','ō','m']]],
  ['mo',     [['m','m'],['o','ō','m']]],
  ['wo',     [['w','w'],['o','ō','m']]],
  ['to',     [['t','t'],['o','ō','m']]],
  ['po',     [['p','p'],['o','ō','m']]],
  ['ro',     [['r','r'],['o','ō','m']]],
  ['co',     [['c','c'],['o','ō','m']]],
  ['ko',     [['k','k'],['o','ō','m']]],
  // j words
  ['jam',    [['j','j'],['a','a'],['m','m']]],
  ['jet',    [['j','j'],['e','e_long','m'],['t','t']]],
  ['jug',    [['j','j'],['u','u'],['g','g']]],
  ['jot',    [['j','j'],['o','o'],['t','t']]],
  ['jig',    [['j','j'],['i','i'],['g','g']]],
  ['jab',    [['j','j'],['a','a'],['b','b']]],
  ['jag',    [['j','j'],['a','a'],['g','g']]],
  ['jin',    [['j','j'],['i','i'],['n','n']]],
  ['job',    [['j','j'],['o','o'],['b','b']]],

  // === BATCH 4: v, ā, y, z, qu (through lesson 50) ===
  // v words
  ['van',    [['v','v'],['a','a'],['n','n']]],
  ['vat',    [['v','v'],['a','a'],['t','t']]],
  ['vest',   [['v','v'],['e','e_long','m'],['s','s'],['t','t']]],
  ['vent',   [['v','v'],['e','e_long','m'],['n','n'],['t','t']]],
  ['vet',    [['v','v'],['e','e_long','m'],['t','t']]],
  ['vim',    [['v','v'],['i','i'],['m','m']]],
  ['vip',    [['v','v'],['i','i'],['p','p']]],
  ['vin',    [['v','v'],['i','i'],['n','n']]],
  ['vog',    [['v','v'],['o','o'],['g','g']]],
  // ā words (long a, silent e pattern)
  ['cake',   [['c','c'],['ā','ā','m'],['k','k'],['e','e','s']]],
  ['face',   [['f','f'],['ā','ā','m'],['c','c'],['e','e','s']]],
  ['name',   [['n','n'],['ā','ā','m'],['m','m'],['e','e','s']]],
  ['made',   [['m','m'],['ā','ā','m'],['d','d'],['e','e','s']]],
  ['game',   [['g','g'],['ā','ā','m'],['m','m'],['e','e','s']]],
  ['late',   [['l','l'],['ā','ā','m'],['t','t'],['e','e','s']]],
  ['tape',   [['t','t'],['ā','ā','m'],['p','p'],['e','e','s']]],
  ['gate',   [['g','g'],['ā','ā','m'],['t','t'],['e','e','s']]],
  ['date',   [['d','d'],['ā','ā','m'],['t','t'],['e','e','s']]],
  ['lake',   [['l','l'],['ā','ā','m'],['k','k'],['e','e','s']]],
  ['save',   [['s','s'],['ā','ā','m'],['v','v'],['e','e','s']]],
  ['wave',   [['w','w'],['ā','ā','m'],['v','v'],['e','e','s']]],
  ['bake',   [['b','b'],['ā','ā','m'],['k','k'],['e','e','s']]],
  ['gave',   [['g','g'],['ā','ā','m'],['v','v'],['e','e','s']]],
  ['cane',   [['c','c'],['ā','ā','m'],['n','n'],['e','e','s']]],
  ['fade',   [['f','f'],['ā','ā','m'],['d','d'],['e','e','s']]],
  ['rate',   [['r','r'],['ā','ā','m'],['t','t'],['e','e','s']]],
  ['lace',   [['l','l'],['ā','ā','m'],['c','c'],['e','e','s']]],
  // y words
  ['yes',    [['y','y'],['e','e_long','m'],['s','s']]],
  ['yap',    [['y','y'],['a','a'],['p','p']]],
  ['yan',    [['y','y'],['a','a'],['n','n']]],
  ['yot',    [['y','y'],['o','o'],['t','t']]],
  ['yog',    [['y','y'],['o','o'],['g','g']]],
  // z words
  ['zip',    [['z','z'],['i','i'],['p','p']]],
  ['zag',    [['z','z'],['a','a'],['g','g']]],
  ['zen',    [['z','z'],['e','e_long','m'],['n','n']]],
  ['zig',    [['z','z'],['i','i'],['g','g']]],
  ['zap',    [['z','z'],['a','a'],['p','p']]],
  ['zed',    [['z','z'],['e','e_long','m'],['d','d']]],
  ['zot',    [['z','z'],['o','o'],['t','t']]],
  // qu words (team)
  ['quit',   [['qu','qu','t'],['i','i'],['t','t']]],
  ['qub',    [['qu','qu','t'],['b','b']]],
  ['qua',    [['qu','qu','t'],['a','a']]],
  ['quop',   [['qu','qu','t'],['o','o'],['p','p']]],
  ['quim',   [['qu','qu','t'],['i','i'],['m','m']]],
  ['quab',   [['qu','qu','t'],['a','a'],['b','b']]],

  // === BATCH 5: x, ch, ī, er, oo (through lesson 60) ===
  // x words
  ['box',    [['b','b'],['o','o'],['x','x']]],
  ['fox',    [['f','f'],['o','o'],['x','x']]],
  ['fix',    [['f','f'],['i','i'],['x','x']]],
  ['mix',    [['m','m'],['i','i'],['x','x']]],
  ['flex',   [['f','f'],['l','l'],['e','e_long','m'],['x','x']]],
  ['vex',    [['v','v'],['e','e_long','m'],['x','x']]],
  ['ax',     [['a','a'],['x','x']]],
  ['tax',    [['t','t'],['a','a'],['x','x']]],
  ['wax',    [['w','w'],['a','a'],['x','x']]],
  ['hex',    [['h','h'],['e','e_long','m'],['x','x']]],
  ['ox',     [['o','o'],['x','x']]],
  // ch words (team)
  ['chip',   [['ch','ch','t'],['i','i'],['p','p']]],
  ['chat',   [['ch','ch','t'],['a','a'],['t','t']]],
  ['chop',   [['ch','ch','t'],['o','o'],['p','p']]],
  ['chin',   [['ch','ch','t'],['i','i'],['n','n']]],
  ['chug',   [['ch','ch','t'],['u','u'],['g','g']]],
  ['rich',   [['r','r'],['i','i'],['ch','ch','t']]],
  ['much',   [['m','m'],['u','u'],['ch','ch','t']]],
  ['such',   [['s','s'],['u','u'],['ch','ch','t']]],
  ['bench',  [['b','b'],['e','e_long','m'],['n','n'],['ch','ch','t']]],
  ['ditch',  [['d','d'],['i','i'],['t','t'],['ch','ch','t']]],
  ['march',  [['m','m'],['a','a'],['r','r'],['ch','ch','t']]],
  ['lunch',  [['l','l'],['u','u'],['n','n'],['ch','ch','t']]],
  ['punch',  [['p','p'],['u','u'],['n','n'],['ch','ch','t']]],
  // ī words (long i, silent e)
  ['kite',   [['k','k'],['ī','ī','m'],['t','t'],['e','e','s']]],
  ['bite',   [['b','b'],['ī','ī','m'],['t','t'],['e','e','s']]],
  ['mite',   [['m','m'],['ī','ī','m'],['t','t'],['e','e','s']]],
  ['site',   [['s','s'],['ī','ī','m'],['t','t'],['e','e','s']]],
  ['line',   [['l','l'],['ī','ī','m'],['n','n'],['e','e','s']]],
  ['nine',   [['n','n'],['ī','ī','m'],['n','n'],['e','e','s']]],
  ['lime',   [['l','l'],['ī','ī','m'],['m','m'],['e','e','s']]],
  ['time',   [['t','t'],['ī','ī','m'],['m','m'],['e','e','s']]],
  ['fine',   [['f','f'],['ī','ī','m'],['n','n'],['e','e','s']]],
  ['vine',   [['v','v'],['ī','ī','m'],['n','n'],['e','e','s']]],
  ['wide',   [['w','w'],['ī','ī','m'],['d','d'],['e','e','s']]],
  ['ride',   [['r','r'],['ī','ī','m'],['d','d'],['e','e','s']]],
  ['dice',   [['d','d'],['ī','ī','m'],['c','c'],['e','e','s']]],
  ['nice',   [['n','n'],['ī','ī','m'],['c','c'],['e','e','s']]],
  ['five',   [['f','f'],['ī','ī','m'],['v','v'],['e','e','s']]],
  ['hive',   [['h','h'],['ī','ī','m'],['v','v'],['e','e','s']]],
  ['pike',   [['p','p'],['ī','ī','m'],['k','k'],['e','e','s']]],
  // er words (team)
  ['her',    [['h','h'],['er','er','t']]],
  ['ker',    [['k','k'],['er','er','t']]],
  ['per',    [['p','p'],['er','er','t']]],
  ['mer',    [['m','m'],['er','er','t']]],
  ['ner',    [['n','n'],['er','er','t']]],
  ['ler',    [['l','l'],['er','er','t']]],
  ['ver',    [['v','v'],['er','er','t']]],
  ['ter',    [['t','t'],['er','er','t']]],
  ['ber',    [['b','b'],['er','er','t']]],
  ['fer',    [['f','f'],['er','er','t']]],
  ['jerk',   [['j','j'],['er','er','t'],['k','k']]],
  ['fern',   [['f','f'],['er','er','t'],['n','n']]],
  // oo words (team)
  ['moon',   [['m','m'],['oo','oo','t'],['n','n']]],
  ['noon',   [['n','n'],['oo','oo','t'],['n','n']]],
  ['hook',   [['h','h'],['oo','oo','t'],['k','k']]],
  ['look',   [['l','l'],['oo','oo','t'],['k','k']]],
  ['book',   [['b','b'],['oo','oo','t'],['k','k']]],
  ['cook',   [['c','c'],['oo','oo','t'],['k','k']]],
  ['foot',   [['f','f'],['oo','oo','t'],['t','t']]],
  ['good',   [['g','g'],['oo','oo','t'],['d','d']]],
  ['wood',   [['w','w'],['oo','oo','t'],['d','d']]],
  ['boom',   [['b','b'],['oo','oo','t'],['m','m']]],
  ['loom',   [['l','l'],['oo','oo','t'],['m','m']]],
  ['goop',   [['g','g'],['oo','oo','t'],['p','p']]],
  ['zoop',   [['z','z'],['oo','oo','t'],['p','p']]],

  // === BATCH 6: ng, ū, oy, wh, ar (through lesson 70) ===
  // ng words (team)
  ['bang',   [['b','b'],['a','a'],['ng','ng','t']]],
  ['fang',   [['f','f'],['a','a'],['ng','ng','t']]],
  ['mang',   [['m','m'],['a','a'],['ng','ng','t']]],
  ['tang',   [['t','t'],['a','a'],['ng','ng','t']]],
  ['gong',   [['g','g'],['o','o'],['ng','ng','t']]],
  ['long',   [['l','l'],['o','o'],['ng','ng','t']]],
  ['song',   [['s','s'],['o','o'],['ng','ng','t']]],
  ['wing',   [['w','w'],['i','i'],['ng','ng','t']]],
  ['pong',   [['p','p'],['o','o'],['ng','ng','t']]],
  ['dong',   [['d','d'],['o','o'],['ng','ng','t']]],
  ['jung',   [['j','j'],['u','u'],['ng','ng','t']]],
  ['sing',   [['s','s'],['i','i'],['ng','ng','t']]],
  ['ring',   [['r','r'],['i','i'],['ng','ng','t']]],
  ['bring',  [['b','b'],['r','r'],['i','i'],['ng','ng','t']]],
  ['sting',  [['s','s'],['t','t'],['i','i'],['ng','ng','t']]],
  ['swing',  [['s','s'],['w','w'],['i','i'],['ng','ng','t']]],
  ['spring', [['s','s'],['p','p'],['r','r'],['i','i'],['ng','ng','t']]],
  ['thing',  [['th','th','t'],['i','i'],['ng','ng','t']]],
  // ū words (long u, silent e)
  ['cube',   [['c','c'],['ū','ū','m'],['b','b'],['e','e','s']]],
  ['mule',   [['m','m'],['ū','ū','m'],['l','l'],['e','e','s']]],
  ['rule',   [['r','r'],['ū','ū','m'],['l','l'],['e','e','s']]],
  ['cute',   [['c','c'],['ū','ū','m'],['t','t'],['e','e','s']]],
  ['mute',   [['m','m'],['ū','ū','m'],['t','t'],['e','e','s']]],
  ['fuse',   [['f','f'],['ū','ū','m'],['s','s'],['e','e','s']]],
  ['tube',   [['t','t'],['ū','ū','m'],['b','b'],['e','e','s']]],
  ['lute',   [['l','l'],['ū','ū','m'],['t','t'],['e','e','s']]],
  // oy words (team)
  ['boy',    [['b','b'],['oy','oy','t']]],
  ['toy',    [['t','t'],['oy','oy','t']]],
  ['joy',    [['j','j'],['oy','oy','t']]],
  ['coy',    [['c','c'],['oy','oy','t']]],
  ['soy',    [['s','s'],['oy','oy','t']]],
  ['roy',    [['r','r'],['oy','oy','t']]],
  ['loy',    [['l','l'],['oy','oy','t']]],
  ['ploy',   [['p','p'],['l','l'],['oy','oy','t']]],
  // wh words (team)
  ['when',   [['wh','wh','t'],['e','e_long','m'],['n','n']]],
  ['wham',   [['wh','wh','t'],['a','a'],['m','m']]],
  ['whim',   [['wh','wh','t'],['i','i'],['m','m']]],
  ['whiz',   [['wh','wh','t'],['i','i'],['z','z']]],
  ['whet',   [['wh','wh','t'],['e','e_long','m'],['t','t']]],
  ['whop',   [['wh','wh','t'],['o','o'],['p','p']]],
  ['whit',   [['wh','wh','t'],['i','i'],['t','t']]],
  ['whap',   [['wh','wh','t'],['a','a'],['p','p']]],
  // ar words (team)
  ['car',    [['c','c'],['ar','ar','t']]],
  ['bar',    [['b','b'],['ar','ar','t']]],
  ['jar',    [['j','j'],['ar','ar','t']]],
  ['far',    [['f','f'],['ar','ar','t']]],
  ['tar',    [['t','t'],['ar','ar','t']]],
  ['mar',    [['m','m'],['ar','ar','t']]],
  ['par',    [['p','p'],['ar','ar','t']]],
  ['star',   [['s','s'],['t','t'],['ar','ar','t']]],
  ['scar',   [['s','s'],['c','c'],['ar','ar','t']]],
  ['char',   [['ch','ch','t'],['ar','ar','t']]],
  ['park',   [['p','p'],['ar','ar','t'],['k','k']]],
  ['mark',   [['m','m'],['ar','ar','t'],['k','k']]],
  ['bark',   [['b','b'],['ar','ar','t'],['k','k']]],
  ['dark',   [['d','d'],['ar','ar','t'],['k','k']]],
  ['farm',   [['f','f'],['ar','ar','t'],['m','m']]],
  ['harm',   [['h','h'],['ar','ar','t'],['m','m']]],
  ['yard',   [['y','y'],['ar','ar','t'],['d','d']]],
  ['hard',   [['h','h'],['ar','ar','t'],['d','d']]],
  ['card',   [['c','c'],['ar','ar','t'],['d','d']]],
  ['art',    [['ar','ar','t'],['t','t']]],
];

for (const [id, graphemes] of DATA) {
  const gs = graphemes.map(([g, sid, ...flags]) => {
    const obj = { g, soundId: sid };
    if (flags.includes('t')) obj.team = true;
    if (flags.includes('m')) obj.macron = true;
    if (flags.includes('s')) obj.silent = true;
    return obj;
  });
  add(id, gs);
}

writeFileSync('src/content/words.json', JSON.stringify(words, null, 2) + '\n');
console.log('Words: ' + words.length + ' (added ' + added + ' for batches 3-6)');

// Verify all words
const sounds = JSON.parse(readFileSync('src/content/sounds.json','utf8'));
const sl = new Map(sounds.map(s=>[s.id,s.introducedInLesson]));
let bad = [];
for (const w of words) {
  for (const g of w.graphemes) {
    if (g.silent) continue;
    if (!sl.has(g.soundId)) bad.push(w.id + ': unknown sound "' + g.soundId + '"');
  }
}
if (bad.length) { console.log('BAD:'); bad.forEach(b=>console.log(' '+b)); process.exit(1); }
console.log('All words have valid sound references.');

// Check dups
const seen = new Set();
const dups = [];
for (const w of words) { if (seen.has(w.id)) dups.push(w.id); seen.add(w.id); }
if (dups.length) console.log('DUPLICATES: ' + dups.join(', '));
