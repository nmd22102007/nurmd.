const fs = require('fs');
const glob = require('glob');

const replacements = [
  { search: /bg-\[\#0B0B0F\]/g, replace: 'bg-navy-dark' },
  { search: /bg-\[\#0B0B0F\]\/([0-9]+)/g, replace: 'bg-navy-dark/$1' },
  { search: /bg-\[\#1F2937\]/g, replace: 'bg-slate-800' },
  { search: /bg-\[\#1F2937\]\/([0-9]+)/g, replace: 'bg-slate-800/$1' },
  { search: /border-\[\#1F2937\]/g, replace: 'border-slate-800' },
  { search: /border-\[\#1F2937\]\/([0-9]+)/g, replace: 'border-slate-800/$1' },
  { search: /bg-\[\#111\]/g, replace: 'bg-navy' },
  { search: /border-\[\#222\]/g, replace: 'border-slate-800' },
  { search: /bg-\[\#0B0B0F\]/g, replace: 'bg-navy-dark' },
  { search: /bg-\[\#020205\]/g, replace: 'bg-navy-dark' },
  { search: /bg-\[\#0B0F19\]/g, replace: 'bg-navy-dark' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

glob.sync('src/pages/AdminDashboard.tsx').forEach(processFile);
glob.sync('src/components/admin/**/*.tsx').forEach(processFile);
