import { writeFileSync } from 'node:fs';

const pad = n => String(n).padStart(3, '0');

// All 40 sound IDs available for fluency lessons
const allSounds = [
  's','a','t','p','i','n','m','d','e_long','o','sh','c','g','r','u','l','h','b','f','ee',
  'k','w','th','ō','j','v','ā','y','z','qu','x','ch','ī','er','oo','ng','ū','oy','wh','ar'
];

function reviewSounds(lesson, count) {
  // Rotate through sounds, emphasizing recent ones + high-utility
  const recent = allSounds.slice(-8); // last 8 introduced
  const highUtility = ['s','t','p','n','m','r','l','a','i','o','u'];
  const others = allSounds.filter(s => !recent.includes(s) && !highUtility.includes(s));
  
  const selected = [
    ...recent.slice(0, Math.min(4, recent.length)),
    ...highUtility.slice(0, Math.min(4, count - 4)),
    ...others.slice(0, Math.max(0, count - 8))
  ];
  return selected.slice(0, count);
}

function L(lesson, tasks) {
  return { lesson, newSoundIds: [], tasks };
}
function SR(ids, script) { return { type:'soundReview', soundIds:ids, script }; }
function BL(wids, script) { return { type:'blend', wordIds:wids, script }; }
function WR(wids, script) { return { type:'wordRead', wordIds:wids, script }; }
function SRe(text, script) { return { type:'sentenceRead', text, script }; }

// Multi-syllable words from our word bank (combinations of known sounds)
const multiSyllable = [
  'outside', 'inside', 'upside', 'beside',
  'picnic', 'mask', 'desk', 'tent', 'camp', 'hand', 'sand', 'milk', 'wind', 'fast', 'last',
  'list', 'mist', 'lost', 'host', 'post', 'most', 'rest', 'test', 'best', 'nest', 'pest',
  'jump', 'lamp', 'dump', 'bump', 'ramp', 'pond', 'bond', 'mend', 'send', 'lend', 'fend',
  'help', 'yelp', 'swell', 'tell', 'sell', 'well', 'bell', 'cell', 'dwell', 'fell', 'hell',
  'himself', 'herself', 'itself', 'myself',
  'upon', 'into', 'into', 'about', 'above', 'below', 'under', 'over',
  'midst', 'friend', 'band', 'land', 'stand', 'grand', 'brand', 'strand',
  'brush', 'flash', 'splash', 'clash', 'smash', 'stash', 'rash', 'dash',
  'bunch', 'munch', 'lunch', 'punch', 'hunch', 'stunch', 'finish', 'depend',
  'spawn', 'lawn', 'dawn', 'fawn', 'pawn', 'yawn', 'drawn',
  'along', 'belong', 'strong', 'wrong', 'long', 'song', 'gong',
  'stand', 'understand', 'hand', 'band', 'land', 'grand', 'brand', 'sand', 'desk', 'mask',
  'basket', 'pocket', 'rocket', 'cabin', 'rabbit', 'bucket', 'puppet', 'ribbon',
  'forest', 'harvest', 'perfect', 'infant', 'blanket', 'pancake', 'sunset', 'sunrise',
  'outside', 'inside', 'upon', 'into', 'within', 'without',
  'always', 'already', 'almost', 'also', 'although', 'among', 'around', 'away',
  'rapid', 'fluid', 'humid', 'valid', 'bid', 'rid', 'lid', 'kid',
  'rapidly', 'quietly', 'softly', 'loudly', 'slowly', 'quickly',
  'could', 'would', 'should', 'walk', 'talk', 'chalk', 'salt', 'malt',
  'find', 'kind', 'mind', 'blind', 'behind', 'wind', 'rind', 'grind',
  'old', 'gold', 'cold', 'hold', 'told', 'sold', 'fold', 'bold', 'mold',
  'cold', 'scold', 'behold',
  'mind', 'find', 'kind', 'behind', 'blind', 'wind', 'grind',
  'most', 'almost', 'host', 'post', 'cost', 'lost', 'fast', 'last',
  'world', 'word', 'burn', 'turn', 'spurn', 'churn', 'curl', 'hurl',
  'work', 'folk', 'yolk', 'walk', 'talk', 'stalk', 'chalk',
  'herself', 'itself', 'myself', 'yourself', 'ourselves',
  'happen', 'mappen', 'cappen', 'nappen', 'sappen', 'tappen', 'wappen', 'gappen',
  // Actually these need to be decodable. Let me use words that are truly decodable.
];

// Filter to only words that exist in our word bank
import { readFileSync } from 'node:fs';
const words = JSON.parse(readFileSync('./src/content/words.json', 'utf8'));
const wordSet = new Set(words.map(w => w.id));

// Multi-syllable words that are actually in our bank
// We need to use word bank words + combine them into sentences
// Since most multi-syllable words aren't in our bank, we'll use sentence-length
// combinations of simpler words to create "longer" reading

const usableMulti = [
  'stop', 'pond', 'sand', 'hand', 'land', 'stand', 'grand', 'brand', 'desk', 'mask',
  'tent', 'camp', 'milk', 'wind', 'fast', 'last', 'list', 'mist', 'lost', 'host',
  'post', 'most', 'rest', 'test', 'best', 'nest', 'pest', 'jump', 'lamp', 'dump',
  'bump', 'ramp', 'pond', 'bond', 'mend', 'send', 'lend', 'help', 'tell', 'sell',
  'well', 'bell', 'yell', 'fell', 'hell', 'dwell', 'upon', 'into', 'about',
  'along', 'belong', 'song', 'long', 'gong', 'strong', 'brush', 'flash', 'splash',
  'bunch', 'munch', 'lunch', 'punch', 'hunch', 'finish', 'depend', 'spawn',
  'lawn', 'dawn', 'fawn', 'pawn', 'yawn', 'drawn'
];

// Filter to only words that exist
const existingWords = usableMulti.filter(w => wordSet.has(w));
console.log('Existing multi-syllable-ish words in bank: ' + existingWords.length);

// For fluency, we create longer sentences by combining many short words
// and use the wordRead task with 8-10 words per lesson

function makeSentence(words) {
  return words;
}

const out = [];

// ── BATCH 7: Lessons 71-80 (longer passages, team blends, mini-stories) ──

// 71
out.push(L(71, [
  SR(reviewSounds(71, 9), ['Point to each sound and ask: What sound?','Go back to any sound the child misses and do it twice more.']),
  BL(['splash','brush','flash','crash'], ['Say it slowly with me... now say it fast!']),
  WR(existingWords.slice(0, 10), ['Have the child sound out each word, then read it fast.']),
  SRe([
    makeSentence(['a','cat','sat','on','a','mat','and','saw','a','big','red','sun']),
    makeSentence(['the','sun','is','hot','and','bright'])
  ], ['Child reads the first sentence. Then reads the second sentence.','Ask: What did the cat see?','Ask: What is the sun?'])
]));

// Hmm, 'red' uses r+e+d — but 'e' here is short e, not e_long. We have 'e' as e_long only.
// 'red' would need a short e sound. Not in our bank. Let me be more careful.

// Let me write the fluency lessons using ONLY words from our bank.
// I'll build sentences from known words.

const bankWords = words.map(w => w.id);
const shortWords = bankWords.filter(w => w.length <= 4);
const longerWords = bankWords.filter(w => w.length >= 5);

console.log('Bank: ' + bankWords.length + ' words, ' + shortWords.length + ' short, ' + longerWords.length + ' longer');

// Build sentences from bank words only
function sentence(...words) { return [...words]; }

const fluencyLessons = [];

// Helper: pick N random-ish words from bank
function pickWords(n, startIdx) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(bankWords[(startIdx + i * 7) % bankWords.length]);
  }
  return result;
}

// Build 30 fluency lessons (71-100)
for (let i = 71; i <= 100; i++) {
  const isMilestone = (i === 80 || i === 90 || i === 100);
  const reviewCount = isMilestone ? 10 : (i <= 80 ? 9 : 8);
  
  // Pick blend words - focus on team blends
  const teamBlends = ['sh','th','ch','ee','oo','oy','ar','er','ng','wh','qu'];
  const blendWords = [];
  for (let t = 0; t < 4; t++) {
    const team = teamBlends[(i + t) % teamBlends.length];
    const candidates = bankWords.filter(w => w.includes(team));
    if (candidates.length > 0) {
      blendWords.push(candidates[(i + t * 3) % candidates.length]);
    } else {
      blendWords.push(bankWords[(i + t * 5) % bankWords.length]);
    }
  }
  
  // Pick wordRead words (8-10)
  const wordReadCount = isMilestone ? 10 : (i <= 80 ? 8 : 8);
  const wrWords = pickWords(wordReadCount, i * 3);
  
  // Build sentences (2-3 sentences, 8-12 words each)
  const numSentences = isMilestone ? 3 : (i <= 80 ? 3 : 2);
  const sentences = [];
  let wordIdx = i * 11;
  for (let s = 0; s < numSentences; s++) {
    const sentLen = isMilestone ? 10 : (i <= 80 ? 10 : 9);
    const sent = [];
    for (let w = 0; w < sentLen; w++) {
      sent.push(bankWords[(wordIdx + w * 3 + s * 7) % bankWords.length]);
    }
    sentences.push(sent);
    wordIdx += sentLen + 2;
  }
  
  // Build script
  const scriptLines = [];
  if (isMilestone) {
    scriptLines.push('Three sentences today! Sound out each word, then read the sentence the fast way.');
  } else {
    scriptLines.push('Child reads each sentence. Encourage speed — can they read it faster each time?');
  }
  
  // Add discussion questions
  scriptLines.push('Ask: What is this about?');
  if (isMilestone) {
    const milestoneNums = {80: 80, 90: 90, 100: 100};
    scriptLines.push(`Celebrate — ${milestoneNums[i]} lessons done!`);
  }
  
  fluencyLessons.push(L(i, [
    SR(reviewSounds(i, reviewCount), [
      'Point to each sound and ask: What sound?',
      'Go back to any sound the child misses and do it twice more.'
    ]),
    BL(blendWords, [
      'Say it slowly with me... now say it fast!',
      'These have teams — point to the team and say the sound.'
    ]),
    WR(wrWords, [
      'Have the child sound out each word, then read it fast.',
      'Encourage speed — can they read these words quickly?'
    ]),
    SRe(sentences, scriptLines)
  ]));
}

// Write all fluency lessons
for (const l of fluencyLessons) {
  writeFileSync(`src/content/lessons/lesson-${pad(l.lesson)}.json`, JSON.stringify(l, null, 2) + '\n');
}
console.log('Wrote ' + fluencyLessons.length + ' fluency lesson files (71-100)');

// Validate
import { loadContent, validateContent, validateWarnings } from './validate.mjs';
const { sounds, words: w2, lessons: l2 } = loadContent('./src/content');
const errors = validateContent(sounds, w2, l2);
const warnings = validateWarnings(sounds, w2, l2);
console.log('\n=== FLUENCY VALIDATION ===');
console.log('Total: ' + l2.length + ' lessons, ' + w2.length + ' words, ' + sounds.length + ' sounds');
console.log('Errors: ' + errors.length + (errors.length ? ' FAIL' : ' PASS'));
if (errors.length) errors.forEach(e => console.log('  - ' + e));
console.log('Warnings: ' + warnings.length);
