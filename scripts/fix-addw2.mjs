import { readFileSync, writeFileSync } from 'node:fs';

let code = readFileSync('scripts/gen-batches-3-6.mjs', 'utf8');
let lines = code.split('\n');
let fixed = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('addW(') && lines[i].endsWith('}]);')) {
    // Current: ...{macron:true}]);
    // Target:  ...{macron:true})]);
    // Insert ')' between '}' and ']'
    let line = lines[i];
    let pos = line.lastIndexOf('}]');
    line = line.slice(0, pos + 1) + ')' + line.slice(pos + 1);
    lines[i] = line;
    fixed++;
  }
}

writeFileSync('scripts/gen-batches-3-6.mjs', lines.join('\n'));
console.log('Fixed ' + fixed + ' lines');
console.log('Line 110: ' + lines[109].trim());
