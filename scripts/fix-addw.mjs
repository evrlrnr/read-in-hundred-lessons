import { readFileSync, writeFileSync } from 'node:fs';

let code = readFileSync('scripts/gen-batches-3-6.mjs', 'utf8');
let lines = code.split('\n');
let fixed = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('addW(') && lines[i].endsWith('}]);')) {
    // Change ...{macron:true}]);  to  ...{macron:true})]);
    lines[i] = lines[i].slice(0, -3) + '})' + lines[i].slice(-2);
    fixed++;
  }
}

writeFileSync('scripts/gen-batches-3-6.mjs', lines.join('\n'));
console.log('Fixed ' + fixed + ' lines');

// Verify line 110
const l = lines[109];
console.log('Line 110: ' + l.trim());
