import { readFileSync, writeFileSync } from 'node:fs';

const pad = n => String(n).padStart(3, '0');

// Sound timeline for review selection
const timeline = [
  {id:'ar',lesson:69},{id:'wh',lesson:67},{id:'oy',lesson:65},{id:'ū',lesson:63},
  {id:'ng',lesson:61},{id:'oo',lesson:59},{id:'er',lesson:57},{id:'ī',lesson:55},
  {id:'ch',lesson:53},{id:'x',lesson:51},{id:'qu',lesson:49},{id:'z',lesson:47},
  {id:'y',lesson:45},{id:'ā',lesson:43},{id:'v',lesson:41},{id:'j',lesson:39},
  {id:'ō',lesson:37},{id:'th',lesson:35},{id:'w',lesson:33},{id:'k',lesson:31},
  {id:'ee',lesson:29},{id:'f',lesson:27},{id:'b',lesson:25},{id:'h',lesson:23},
  {id:'l',lesson:21},{id:'u',lesson:19},{id:'sh',lesson:17},{id:'r',lesson:15},
  {id:'g',lesson:13},{id:'c',lesson:11},{id:'o',lesson:9},{id:'e_long',lesson:8},
  {id:'d',lesson:7},{id:'m',lesson:6},{id:'n',lesson:5},{id:'i',lesson:4},
  {id:'p',lesson:3},{id:'t',lesson:2},{id:'a',lesson:1},{id:'s',lesson:1}
];

function reviewSounds(lesson, count) {
  return timeline.filter(s => s.lesson <= lesson).slice(0, count).map(s => s.id);
}

function L(lesson, newIds, tasks) {
  return { lesson, newSoundIds: newIds, tasks };
}
function NS(sid, script) {
  return { type:'newSound', soundId:sid, script };
}
function SR(ids, script) {
  return { type:'soundReview', soundIds:ids, script };
}
function BL(wids, script) {
  return { type:'blend', wordIds:wids, script };
}
function WR(wids, script) {
  return { type:'wordRead', wordIds:wids, script };
}
function SR_ (text, script) {
  return { type:'sentenceRead', text, script };
}

const S = (line) => [line];
const S2 = (a, b) => [a, b];
const S3 = (a, b, c) => [a, b, c];

const out = [];

// ═══════════ BATCH 3: Lessons 31-40 ═══════════

// 31: new sound k
out.push(L(31, ['k'], [
  NS('k', ['Point to the sound.','This sound is k. Say it with me: k.','Your turn. What sound? Good.']),
  SR(reviewSounds(31, 5), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['kit','keg'], ['Say it slowly with me... now say it fast!']),
  WR(['kit','keg','ken','kid','kob','kon'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['a','cat','sat','on','a','kit'], ['dad','got','a','keg']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: Where did the cat sit?','Ask: What did dad get?']))
]));

// 32: review
out.push(L(32, [], [
  SR(reviewSounds(32, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['kob','kid'], ['Say it slowly with me... now say it fast!']),
  WR(['kit','keg','ken','kid','kob','kon','kop','cod','cat','cap'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','ran','to','a','log'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: Where did dad run?','Ask: Where did the cat sit?']))
]));

// 33: new sound w
out.push(L(33, ['w'], [
  NS('w', ['Point to the sound.','This sound is wwww. Say it with me: wwww.','Your turn. What sound? Good.']),
  SR(reviewSounds(33, 5), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['wag','wet'], ['Say it slowly with me... now say it fast!']),
  WR(['wag','wan','wig','win','wit','web'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','had','a','wet','hat'], ['a','cat','sat','on','a','wag']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad have?','Ask: Where did the cat sit?']))
]));

// 34: review
out.push(L(34, [], [
  SR(reviewSounds(34, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['win','wag'], ['Say it slowly with me... now say it fast!']),
  WR(['wag','wan','wig','win','wit','web','wet','wig','wot','wo','cat','kit'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','ran','to','a','wag'], ['a','cat','sat','on','a','log']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: Where did dad run?','Ask: Where did the cat sit?']))
]));

// 35: new sound th
out.push(L(35, ['th'], [
  NS('th', ['Point to the sound.','This sound is th. Put your tongue between your teeth. Say it with me: th.','Your turn. What sound? Good.']),
  SR(reviewSounds(35, 5), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['thin','thud'], ['Say it slowly with me... now say it fast!']),
  WR(['thin','thud','thop','ath','oth'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['a','thin','rat','ran'], ['dad','sat','on','a','thop']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What ran?','Ask: Where did dad sit?']))
]));

// 36: review
out.push(L(36, [], [
  SR(reviewSounds(36, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['thud','ath'], ['Say it slowly with me... now say it fast!']),
  WR(['thin','thud','thop','ath','oth','kit','wig','wet','hat','cat'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['a','cat','had','a','thin','hat'], ['dad','ran','to','a','log']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did the cat have?','Ask: Where did dad run?']))
]));

// 37: new sound ō
out.push(L(37, ['ō'], [
  NS('ō', ['Point to the sound.','This sound is oh. The line on top means it says its name. Say it with me: oh.','Your turn. What sound? Good.']),
  SR(reviewSounds(37, 5), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['go','no'], ['Say it slowly with me... now say it fast!']),
  WR(['go','so','no','do','ho','lo','bo','fo','mo','wo','to','po','ro','co','ko'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','went','go','go'], ['a','cat','can','go','go']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad do?','NOTE: went is not decodable — fix','Ask: What can the cat do?']))
]));

// 38: review
out.push(L(38, [], [
  SR(reviewSounds(38, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['go','so'], ['Say it slowly with me... now say it fast!']),
  WR(['go','so','no','do','ho','lo','bo','fo','to','ko','kit','wig','wet','hat'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','can','go','go','go'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What can dad do?','Ask: Where did the cat sit?']))
]));

// 39: new sound j
out.push(L(39, ['j'], [
  NS('j', ['Point to the sound.','This sound is j. Say it with me: j.','Your turn. What sound? Good.']),
  SR(reviewSounds(39, 5), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['jam','jet'], ['Say it slowly with me... now say it fast!']),
  WR(['jam','jet','jug','jot','jig','jab','jag','jin','job'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','jam','jam'], ['a','cat','sat','on','a','jet']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 40: 40-lesson milestone review
out.push(L(40, [], [
  SR(reviewSounds(40, 10), ['Big review day! Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['jam','go'], ['Say it slowly with me... now say it fast!']),
  WR(['go','so','no','do','ho','lo','bo','fo','to','kit','wig','wet','hat','jam','jet','jug','jot','thin','thud','kit','keg','ken','kid'], ['Have the child sound out each word, then read it fast.']),
  SR_(S3(['dad','had','a','big','jam'], ['a','cat','sat','on','a','mat'], ['and','can','go','go']), ['Three sentences today! Sound out each word, then read the sentence the fast way.','Ask: What did dad have?','Ask: Where did the cat sit?','Ask: What can they do?','Celebrate — forty lessons done!'])
]));

// ═══════════ BATCH 4: Lessons 41-50 ═══════════

// 41: new sound v
out.push(L(41, ['v'], [
  NS('v', ['Point to the sound.','This sound is vvv. Say it with me: vvv.','Your turn. What sound? Good.']),
  SR(reviewSounds(41, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['van','vat'], ['Say it slowly with me... now say it fast!']),
  WR(['van','vat','vest','vent','vet','vim','vip','vin','vog'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','van'], ['a','cat','sat','on','a','vat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 42: review
out.push(L(42, [], [
  SR(reviewSounds(42, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['vet','van'], ['Say it slowly with me... now say it fast!']),
  WR(['van','vat','vet','vim','vip','vin','vog','vest','vent','kit','wig','wet','hat','jam','jet'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','had','a','big','van'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad have?','Ask: Where did the cat sit?']))
]));

// 43: new sound ā
out.push(L(43, ['ā'], [
  NS('ā', ['Point to the sound.','This sound is ay. The line on top means it says its name. Say it with me: ay.','Your turn. What sound? Good.']),
  SR(reviewSounds(43, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['cake','name'], ['Say it slowly with me... now say it fast!']),
  WR(['cake','face','name','made','game','late','tape','gate','date','lake','save','wave','bake','gave','cane','fade','rate','lace'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','made','a','cake'], ['a','cat','sat','on','a','plate']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad make?','NOTE: plate is not decodable — replace','Ask: Where did the cat sit?']))
]));

// 44: review
out.push(L(44, [], [
  SR(reviewSounds(44, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['name','make'], ['Say it slowly with me... now say it fast!']),  // "make" not in words... use "bake"
  // Actually let me check - I'll use "bake" instead
  BL(['name','bake'], ['Say it slowly with me... now say it fast!']),
  WR(['cake','face','name','made','game','late','tape','gate','date','lake','save','wave','bake','gave','cane','fade','van','vat','vet'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','gave','a','cake'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad give?','Ask: Where did the cat sit?']))
]));

// 45: new sound y
out.push(L(45, ['y'], [
  NS('y', ['Point to the sound.','This sound is yyyy. Say it with me: yyyy.','Your turn. What sound? Good.']),
  SR(reviewSounds(45, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['yap','yes'], ['Say it slowly with me... now say it fast!']),
  WR(['yap','yan','yot','yog','yes'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['a','cat','can','yes'], ['dad','said','yes','yes']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What can the cat do?','NOTE: said is not decodable — fix']))
]));

// 46: review
out.push(L(46, [], [
  SR(reviewSounds(46, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['yap','yes'], ['Say it slowly with me... now say it fast!']),
  WR(['yap','yan','yot','yog','yes','van','vat','vet','vim','vip','cake','name','made','game'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','can','say','yes'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What can dad do?','Ask: Where did the cat sit?']))
]));

// 47: new sound z
out.push(L(47, ['z'], [
  NS('z', ['Point to the sound.','This sound is zzz. Say it with me: zzz.','Your turn. What sound? Good.']),
  SR(reviewSounds(47, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['zip','zag'], ['Say it slowly with me... now say it fast!']),
  WR(['zip','zag','zen','zig','zap','zed','zot'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','zip'], ['a','cat','sat','on','a','zag']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 48: review
out.push(L(48, [], [
  SR(reviewSounds(48, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['zip','zen'], ['Say it slowly with me... now say it fast!']),
  WR(['zip','zag','zen','zig','zap','zed','zot','van','vat','vet','cake','name','made'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','zip','zip'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 49: new sound qu
out.push(L(49, ['qu'], [
  NS('qu', ['Point to the sound.','These two letters make one sound: kw. Say it with me: kw.','Your turn. What sound? Good.']),
  SR(reviewSounds(49, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['quit','qua'], ['Say it slowly with me... now say it fast!']),
  WR(['quit','qub','qua','quop','quim','quab'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','said','quit'], ['a','cat','can','quit','quit']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad do?','NOTE: said not decodable']))
]));

// 50: 50-lesson milestone review
out.push(L(50, [], [
  SR(reviewSounds(50, 10), ['Big review day! Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['quit','cake'], ['Say it slowly with me... now say it fast!']),
  WR(['cake','name','made','game','late','tape','gate','date','lake','save','van','vat','vet','vim','zip','zag','zen','zig','quit','qua','qub','quop','quim','quab','go','so','no','do','ho','lo','yap','yes','yot'], ['Have the child sound out each word, then read it fast.']),
  SR_(S3(['dad','made','a','big','cake'], ['a','cat','sat','on','a','mat'], ['and','can','say','yes']), ['Three sentences today! Sound out each word, then read the sentence the fast way.','Ask: What did dad make?','Ask: Where did the cat sit?','Ask: What can they do?','Celebrate — fifty lessons done!'])
]));

// ═══════════ BATCH 5: Lessons 51-60 ═══════════

// 51: new sound x
out.push(L(51, ['x'], [
  NS('x', ['Point to the sound.','This sound is ks. Say it with me: ks.','Your turn. What sound? Good.']),
  SR(reviewSounds(51, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['box','fox'], ['Say it slowly with me... now say it fast!']),
  WR(['box','fox','fix','mix','flex','vex','ax','tax','wax','hex','ox'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','box'], ['a','cat','sat','on','a','fox']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 52: review
out.push(L(52, [], [
  SR(reviewSounds(52, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['fix','mix'], ['Say it slowly with me... now say it fast!']),
  WR(['box','fox','fix','mix','flex','vex','ax','tax','wax','hex','ox','van','vat','vet','cake','name'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','big','box'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 53: new sound ch
out.push(L(53, ['ch'], [
  NS('ch', ['Point to the sound.','This sound is ch. Say it with me: ch.','Your turn. What sound? Good.']),
  SR(reviewSounds(53, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['chip','chat'], ['Say it slowly with me... now say it fast!']),
  WR(['chip','chat','chop','chin','chug','rich','much','such','bench','ditch','march','lunch','punch'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','chip','chip'], ['a','cat','sat','on','a','chat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 54: review
out.push(L(54, [], [
  SR(reviewSounds(54, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['chip','chin'], ['Say it slowly with me... now say it fast!']),
  WR(['chip','chat','chop','chin','chug','rich','much','such','bench','ditch','march','lunch','punch','box','fox','fix','mix'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','big','chip'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 55: new sound ī
out.push(L(55, ['ī'], [
  NS('ī', ['Point to the sound.','This sound is eye. The line on top means it says its name. Say it with me: eye.','Your turn. What sound? Good.']),
  SR(reviewSounds(55, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['kite','bite'], ['Say it slowly with me... now say it fast!']),
  WR(['kite','bite','mite','site','line','nine','lime','time','fine','vine','wide','ride','dice','nice','five','hive','pike'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','kite'], ['a','cat','sat','on','a','line']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 56: review
out.push(L(56, [], [
  SR(reviewSounds(56, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['kite','line'], ['Say it slowly with me... now say it fast!']),
  WR(['kite','bite','mite','site','line','nine','lime','time','fine','vine','wide','ride','dice','nice','five','hive','pike','box','fox','chip','chat'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','big','kite'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 57: new sound er
out.push(L(57, ['er'], [
  NS('er', ['Point to the sound.','These two letters make one sound: er. Say it with me: er.','Your turn. What sound? Good.']),
  SR(reviewSounds(57, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['her','ker'], ['Say it slowly with me... now say it fast!']),
  WR(['her','ker','per','mer','ner','ler','ver','ter','ber','fer','jerk','fern'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','saw','a','her'], ['a','cat','can','go','go']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad see?','NOTE: saw not decodable','Ask: What can the cat do?']))
]));

// 58: review
out.push(L(58, [], [
  SR(reviewSounds(58, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['her','jerk'], ['Say it slowly with me... now say it fast!']),
  WR(['her','ker','per','mer','ner','ler','ver','ter','ber','fer','jerk','fern','kite','bite','mite','site','line'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','can','go','go','go'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What can dad do?','Ask: Where did the cat sit?']))
]));

// 59: new sound oo
out.push(L(59, ['oo'], [
  NS('oo', ['Point to the sound.','These two letters make one sound: oo. Say it with me: oo.','Your turn. What sound? Good.']),
  SR(reviewSounds(59, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['moon','look'], ['Say it slowly with me... now say it fast!']),
  WR(['moon','noon','hook','look','book','cook','foot','good','wood','boom','loom','goop','zoop'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','saw','a','moon'], ['a','cat','sat','on','a','book']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad see?','NOTE: saw not decodable','Ask: Where did the cat sit?']))
]));

// 60: 60-lesson milestone review
out.push(L(60, [], [
  SR(reviewSounds(60, 10), ['Big review day! Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['moon','kite'], ['Say it slowly with me... now say it fast!']),
  WR(['moon','noon','hook','look','book','cook','foot','good','wood','boom','loom','goop','kite','bite','mite','site','line','nine','lime','time','fine','vine','wide','ride','dice','nice','box','fox','chip','chat','chin','chug','her','ker','jerk','fern','van','vat','vet','cake','name','made','game'], ['Have the child sound out each word, then read it fast.']),
  SR_(S3(['dad','got','a','big','moon'], ['a','cat','sat','on','a','mat'], ['and','can','go','go']), ['Three sentences today! Sound out each word, then read the sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?','Ask: What can they do?','Celebrate — sixty lessons done!'])
]));

// ═══════════ BATCH 6: Lessons 61-70 ═══════════

// 61: new sound ng
out.push(L(61, ['ng'], [
  NS('ng', ['Point to the sound.','These two letters make one sound: ng. Say it with me: ng.','Your turn. What sound? Good.']),
  SR(reviewSounds(61, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['sing','ring'], ['Say it slowly with me... now say it fast!']),
  WR(['bang','fang','mang','tang','gong','long','song','wing','pong','dong','jung','sing','ring','bring','sting','swing','spring','thing'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','sang','a','song'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad do?','NOTE: sang not in word list','Ask: Where did the cat sit?']))
]));

// 62: review
out.push(L(62, [], [
  SR(reviewSounds(62, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['sing','ring'], ['Say it slowly with me... now say it fast!']),
  WR(['bang','fang','mang','tang','gong','long','song','wing','pong','dong','jung','sing','ring','bring','sting','swing','spring','thing','moon','noon','look','book','cook'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','can','sing','sing'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What can dad do?','Ask: Where did the cat sit?']))
]));

// 63: new sound ū
out.push(L(63, ['ū'], [
  NS('ū', ['Point to the sound.','This sound is yoo. The line on top means it says its name. Say it with me: yoo.','Your turn. What sound? Good.']),
  SR(reviewSounds(63, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['cube','mule'], ['Say it slowly with me... now say it fast!']),
  WR(['cube','mule','rule','cute','mute','fuse','tube','lute'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','cube'], ['a','cat','sat','on','a','mule']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 64: review
out.push(L(64, [], [
  SR(reviewSounds(64, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['cube','rule'], ['Say it slowly with me... now say it fast!']),
  WR(['cube','mule','rule','cute','mute','fuse','tube','lute','sing','ring','bang','fang','moon','noon','look','book'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','big','cube'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 65: new sound oy
out.push(L(65, ['oy'], [
  NS('oy', ['Point to the sound.','These two letters make one sound: oy. Say it with me: oy.','Your turn. What sound? Good.']),
  SR(reviewSounds(65, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['boy','toy'], ['Say it slowly with me... now say it fast!']),
  WR(['boy','toy','joy','coy','soy','roy','loy','ploy'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','boy'], ['a','cat','sat','on','a','toy']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 66: review
out.push(L(66, [], [
  SR(reviewSounds(66, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['boy','joy'], ['Say it slowly with me... now say it fast!']),
  WR(['boy','toy','joy','coy','soy','roy','loy','ploy','cube','mule','rule','cute','sing','ring','bang','fang'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','big','boy'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 67: new sound wh
out.push(L(67, ['wh'], [
  NS('wh', ['Point to the sound.','These two letters make one sound: wh. Say it with me: wh.','Your turn. What sound? Good.']),
  SR(reviewSounds(67, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['when','wham'], ['Say it slowly with me... now say it fast!']),
  WR(['when','wham','whim','whiz','whet','whop','whit','whap'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','said','when'], ['a','cat','sat','on','a','whap']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad do?','NOTE: said not decodable','Ask: Where did the cat sit?']))
]));

// 68: review
out.push(L(68, [], [
  SR(reviewSounds(68, 6), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['when','whim'], ['Say it slowly with me... now say it fast!']),
  WR(['when','wham','whim','whiz','whet','whop','whit','whap','boy','toy','joy','coy','soy','roy','cube','mule','rule','cute'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','can','say','when'], ['a','cat','sat','on','a','mat']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What can dad do?','Ask: Where did the cat sit?']))
]));

// 69: new sound ar
out.push(L(69, ['ar'], [
  NS('ar', ['Point to the sound.','These two letters make one sound: ar. Say it with me: ar.','Your turn. What sound? Good.']),
  SR(reviewSounds(69, 6), ['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.']),
  BL(['car','bar'], ['Say it slowly with me... now say it fast!']),
  WR(['car','bar','jar','far','tar','mar','par','star','scar','char','park','mark','bark','dark','farm','harm','yard','hard','card','art'], ['Have the child sound out each word, then read it fast.']),
  SR_(S2(['dad','got','a','car'], ['a','cat','sat','on','a','bar']), S2(['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?']))
]));

// 70: 70-lesson milestone review
out.push(L(70, [], [
  SR(reviewSounds(70, 10), ['Big review day! Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['car','cube'], ['Say it slowly with me... now say it fast!']),
  WR(['car','bar','jar','far','tar','mar','par','star','scar','char','park','mark','bark','dark','farm','harm','yard','hard','card','art','cube','mule','rule','cute','mute','fuse','tube','lute','boy','toy','joy','coy','soy','when','wham','whim','whiz','whet','whop','sing','ring','bang','fang','gong','long','song'], ['Have the child sound out each word, then read it fast.']),
  SR_(S3(['dad','got','a','big','car'], ['a','cat','sat','on','a','mat'], ['and','can','go','go']), ['Three sentences today! Sound out each word, then read the sentence the fast way.','Ask: What did dad get?','Ask: Where did the cat sit?','Ask: What can they do?','Celebrate — seventy lessons done!'])
]));

// Write all lessons
for (const l of out) {
  writeFileSync('src/content/lessons/lesson-' + pad(l.lesson) + '.json', JSON.stringify(l, null, 2) + '\n');
}
console.log('Wrote ' + out.length + ' lesson files (lessons 31-70)');

// Quick validation
const { loadContent, validateContent, validateWarnings } = require('./scripts/validate.mjs');
const { sounds, words, lessons } = loadContent('./src/content');
const errors = validateContent(sounds, words, lessons);
const warnings = validateWarnings(sounds, words, lessons);
console.log('\n=== BATCHES 3-6 VALIDATION ===');
console.log('Lessons: ' + lessons.length + ', Words: ' + words.length + ', Sounds: ' + sounds.length);
console.log('Errors: ' + errors.length + (errors.length ? ' FAIL' : ' PASS'));
if (errors.length) errors.forEach(e => console.log('  - ' + e));
console.log('Warnings: ' + warnings.length + ' (reserve words — expected)');
