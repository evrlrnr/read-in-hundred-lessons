import { readFileSync, writeFileSync } from 'node:fs';

let code = readFileSync('scripts/gen-batches-3-6.mjs', 'utf8');
let lines = code.split('\n');
let fixed = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line.startsWith('addW(')) continue;
  
  // Find the last occurrence of ']);' or '))' or '}])' at end of line
  // We want the line to end with '})]);'
  // Extract everything up to the last '];' or '))' or similar
  
  // Try to find the addW('id', [ ... ]);  pattern
  const match = line.match(/^addW\('([^']+)', \[(.+)\)\];$/);
  if (match) {
    // Has correct structure already
    continue;
  }
  
  // Match: addW('id', [ ... }]);  -- missing ) for G call
  const match2 = line.match(/^addW\('([^']+)', \[(.+)\}\}\);$/);
  if (match2) {
    // Has ...}});  -- extra }
    lines[i] = `addW('${match2[1]}', [${match2[2]}]);`;
    fixed++;
    continue;
  }
  
  // Match: addW('id', [ ... })]);  -- correct!
  const match3 = line.match(/^addW\('([^']+)', \[(.+)\})\]\);$/);
  if (match3) {
    continue; // Already correct
  }
  
  // Match: addW('id', [ ... }]);  -- need to insert )
  const match4 = line.match(/^addW\('([^']+)', \[(.+)\}\]\);$/);
  if (match4) {
    lines[i] = `addW('${match4[1]}', [${match4[2]})]);`;
    fixed++;
    continue;
  }
  
  console.log('UNMATCHED line ' + (i+1) + ': ' + line.trim().substring(0, 100));
}

writeFileSync('scripts/gen-batches-3-6.mjs', lines.join('\n'));
console.log('Fixed ' + fixed + ' lines');
console.log('Line 110: ' + lines[109].trim());
