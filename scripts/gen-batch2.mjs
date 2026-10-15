import { writeFileSync } from 'node:fs';

const pad = n => String(n).padStart(3, '0');

function reviewSounds(lesson, count) {
  const timeline = [
    {id:'ee',lesson:29},{id:'f',lesson:27},{id:'b',lesson:25},{id:'h',lesson:23},
    {id:'l',lesson:21},{id:'u',lesson:19},{id:'sh',lesson:17},{id:'r',lesson:15},
    {id:'g',lesson:13},{id:'c',lesson:11},{id:'o',lesson:9},{id:'e_long',lesson:8},
    {id:'d',lesson:7},{id:'m',lesson:6},{id:'n',lesson:5},{id:'i',lesson:4},
    {id:'p',lesson:3},{id:'t',lesson:2},{id:'a',lesson:1},{id:'s',lesson:1}
  ];
  return timeline.filter(s => s.lesson <= lesson).slice(0, count).map(s => s.id);
}

const L = [
  // 21: new sound l
  { lesson:21, newSoundIds:['l'], tasks:[
    { type:'newSound', soundId:'l', script:['Point to the sound.','This sound is llll. Say it with me: llll.','Your turn. What sound? Good.'] },
    { type:'soundReview', soundIds: reviewSounds(21,5), script:['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.'] },
    { type:'blend', wordIds:['lap','log'], script:['Say it slowly with me... now say it fast!'] },
    { type:'wordRead', wordIds:['lap','lad','lag','lip','lit','lid'], script:['Have the child sound out each word, then read it fast.'] },
    { type:'sentenceRead', text:[['a','cat','sat','on','a','lap']], script:['Child sounds out each word, then reads the whole sentence the fast way.','Ask: Where did the cat sit?'] }
  ]},

  // 22: review
  { lesson:22, newSoundIds:[], tasks:[
    { type:'soundReview', soundIds: reviewSounds(22,6), script:['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.'] },
    { type:'blend', wordIds:['lit','lad'], script:['Say it slowly with me... now say it fast!'] },
    { type:'wordRead', wordIds:['lap','lad','lag','lip','lit','lid','log','lot','leg','rat','cat'], script:['Have the child sound out each word, then read it fast.'] },
    { type:'sentenceRead', text:[['dad','ran','to','a','log'],['a','cat','sat','on','a','mat']], script:['Child sounds out each word, then reads the whole sentence the fast way.','Ask: Where did dad run? Where did the cat sit?'] }
  ]},

  // 23: new sound h
  { lesson:23, newSoundIds:['h'], tasks:[
    { type:'newSound', soundId:'h', script:['Point to the sound.','This sound is hhh. Say it with me: hhh.','Your turn. What sound? Good.'] },
    { type:'soundReview', soundIds: reviewSounds(23,5), script:['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.'] },
    { type:'blend', wordIds:['hat','hot'], script:['Say it slowly with me... now say it fast!'] },
    { type:'wordRead', wordIds:['hat','hit','hot','hut','hop','hum'], script:['Have the child sound out each word, then read it fast.'] },
    { type:'sentenceRead', text:[['dad','had','a','hat'],['a','cat','sat','on','a','hat']], script:['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad have? Where did the cat sit?'] }
  ]},

  // 24: review
  { lesson:24, newSoundIds:[], tasks:[
    { type:'soundReview', soundIds: reviewSounds(24,6), script:['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.'] },
    { type:'blend', wordIds:['had','hop'], script:['Say it slowly with me... now say it fast!'] },
    { type:'wordRead', wordIds:['hat','hit','hot','hut','hop','hum','had','him','ham','hid','cat','lap'], script:['Have the child sound out each word, then read it fast.'] },
    { type:'sentenceRead', text:[['a','cat','had','a','hat'],['dad','ran','to','a','hot','pot']], script:['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did the cat have? What did dad run to?'] }
  ]},

  // 25: new sound b
  { lesson:25, newSoundIds:['b'], tasks:[
    { type:'newSound', soundId:'b', script:['Point to the sound.','This sound is b. Say it with me: b.','Your turn. What sound? Good.'] },
    { type:'soundReview', soundIds: reviewSounds(25,5), script:['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.'] },
    { type:'blend', wordIds:['bat','bed'], script:['Say it slowly with me... now say it fast!'] },
    { type:'wordRead', wordIds:['bat','bad','bag','ban','bib','bid'], script:['Have the child sound out each word, then read it fast.'] },
    { type:'sentenceRead', text:[['dad','got','a','bat'],['a','cat','sat','on','a','bed']], script:['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad get? Where did the cat sit?'] }
  ]},

  // 26: review
  { lesson:26, newSoundIds:[], tasks:[
    { type:'soundReview', soundIds: reviewSounds(26,6), script:['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.'] },
    { type:'blend', wordIds:['bag','bed'], script:['Say it slowly with me... now say it fast!'] },
    { type:'wordRead', wordIds:['bat','bad','bag','ban','bib','bid','bot','bun','bug','big','bed','bet','cat','hat'], script:['Have the child sound out each word, then read it fast.'] },
    { type:'sentenceRead', text:[['dad','had','a','big','bat'],['a','cat','sat','on','a','bed']], script:['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad have? Where did the cat sit?'] }
  ]},

  // 27: new sound f
  { lesson:27, newSoundIds:['f'], tasks:[
    { type:'newSound', soundId:'f', script:['Point to the sound.','This sound is fff. Say it with me: fff.','Your turn. What sound? Good.'] },
    { type:'soundReview', soundIds: reviewSounds(27,6), script:['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.'] },
    { type:'blend', wordIds:['fat','fan'], script:['Say it slowly with me... now say it fast!'] },
    { type:'wordRead', wordIds:['fat','fan','fit','fin','fog','fob'], script:['Have the child sound out each word, then read it fast.'] },
    { type:'sentenceRead', text:[['dad','had','a','fat','cat'],['a','fan','is','on']], script:['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What did dad have? What is on?'] }
  ]},

  // 28: review
  { lesson:28, newSoundIds:[], tasks:[
    { type:'soundReview', soundIds: reviewSounds(28,6), script:['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.'] },
    { type:'blend', wordIds:['fit','fan'], script:['Say it slowly with me... now say it fast!'] },
    { type:'wordRead', wordIds:['fat','fan','fit','fin','fog','fob','fib','fed','fen','bat','bed','hat'], script:['Have the child sound out each word, then read it fast.'] },
    { type:'sentenceRead', text:[['a','fat','cat','ran'],['dad','got','a','big','fan']], script:['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What ran? What did dad get?'] }
  ]},

  // 29: new sound ee
  { lesson:29, newSoundIds:['ee'], tasks:[
    { type:'newSound', soundId:'ee', script:['Point to the sound.','These two letters make one sound: ee. Say it with me: ee.','Your turn. What sound? Good.'] },
    { type:'soundReview', soundIds: reviewSounds(29,6), script:['Point to each sound and ask: What sound?','If the child pauses, say it together, then ask again.'] },
    { type:'blend', wordIds:['see','bee'], script:['Say it slowly with me... now say it fast!'] },
    { type:'wordRead', wordIds:['see','bee','tee','pee','lee','heel','feel','feet','beet','seed','peep','seep','been','seen'], script:['Have the child sound out each word, then read it fast.'] },
    { type:'sentenceRead', text:[['i','can','see','a','bee'],['dad','can','see','a','hen']], script:['Child sounds out each word, then reads the whole sentence the fast way.','Ask: What can you see? What can dad see?'] }
  ]},

  // 30: 20-lesson milestone review
  { lesson:30, newSoundIds:[], tasks:[
    { type:'soundReview', soundIds: reviewSounds(30,10), script:['Big review day! Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.'] },
    { type:'blend', wordIds:['see','feet'], script:['Say it slowly with me... now say it fast!'] },
    { type:'wordRead', wordIds:['see','bee','tee','pee','lee','heel','feel','feet','beet','seed','need','feed','meet','been','seen','bat','bed','bet','beg','bend','cat','hat','hot','hut','hop','hum','lap','lad','lip','lit','log','lot','leg'], script:['Have the child sound out each word, then read it fast.'] },
    { type:'sentenceRead', text:[['dad','had','a','bat','and','a','hat'],['a','cat','sat','on','a','mat','and','got','a','bee']], script:['Two sentences today! Sound out each word, then read the sentence the fast way.','Ask: What did dad have? What did the cat get?','Celebrate — thirty lessons done!'] }
  ]}
];

for (const l of L) {
  writeFileSync('src/content/lessons/lesson-' + pad(l.lesson) + '.json', JSON.stringify(l, null, 2) + '\n');
}
console.log('Wrote ' + L.length + ' lesson files for batch 2');
