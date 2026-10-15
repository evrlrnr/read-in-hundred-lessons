import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '..', 'src', 'content', 'lessons');

const repl = {
  kob: 'kid', kon: 'kit', kop: 'kit',
  thop: 'thin', ath: 'hat', oth: 'hot',
  ho: 'hop', lo: 'log', bo: 'bot', fo: 'fog', wo: 'wet',
  po: 'pot', ro: 'rot', co: 'cop', ko: 'kit',
  vog: 'vet',
  yot: 'yap', yog: 'yes', yan: 'yap',
  zot: 'zap',
  qub: 'quit', quab: 'quit', quop: 'quit', quim: 'quit', qua: 'quit',
  ker: 'her', mer: 'her', ner: 'her', ler: 'her',
  ver: 'her', ter: 'her', ber: 'her', fer: 'her',
  jerk: 'jet',
  zoop: 'moon',
  jung: 'long', dong: 'song',
  loy: 'toy', roy: 'joy',
  lib: 'lip', lin: 'lip',
  wot: 'sat'
};

let totalRepl = 0;
let filesChanged = 0;

for (const f of fs.readdirSync(dir).sort()) {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  let changed = false;

  for (const [bad, good] of Object.entries(repl)) {
    const re = new RegExp(`"${bad}"`, 'g');
    if (re.test(content)) {
      content = content.replace(re, `"${good}"`);
      changed = true;
      totalRepl++;
    }
  }

  if (changed) {
    const data = JSON.parse(content);
    for (const task of data.tasks) {
      if (task.wordIds) {
        task.wordIds = [...new Set(task.wordIds)];
      }
      if (task.text) {
        task.text = task.text.map(s => [...new Set(s)]);
      }
    }
    fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
    filesChanged++;
  }
}

console.log(`Fixed ${totalRepl} word references in ${filesChanged} files`);
