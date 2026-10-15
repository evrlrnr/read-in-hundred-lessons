import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wordsPath = path.join(__dirname, '..', 'src', 'content', 'words.json');

const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));
const bad = new Set([
  'lib','lin','kob','kon','kop','thop','ath','oth',
  'ho','lo','bo','fo','wo','po','ro','co','ko',
  'vog','yan','yot','yog','zot',
  'qub','qua','quop','quim','quab',
  'ker','mer','ner','ler','ver','ter','ber','fer',
  'jerk','zoop','dong','jung','roy','loy','wot'
]);

const before = words.length;
const cleaned = words.filter(w => !bad.has(w.id));
const removed = before - cleaned.length;

fs.writeFileSync(wordsPath, JSON.stringify(cleaned, null, 2) + '\n');
console.log(`Removed ${removed} nonsense words (${before} → ${cleaned.length})`);
