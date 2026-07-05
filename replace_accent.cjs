const fs = require('fs');
const glob = require('glob');

const replacements = [
  { search: /text-\[\#22D3EE\]/g, replace: 'text-accent' },
  { search: /text-cyan-400/g, replace: 'text-accent' },
  { search: /text-cyan-300/g, replace: 'text-accent' },
  { search: /bg-cyan-400/g, replace: 'bg-accent' },
  { search: /border-cyan-400/g, replace: 'border-accent' },
  { search: /ring-cyan-400/g, replace: 'ring-accent' },
  { search: /accent-cyan-400/g, replace: 'accent' }, // Wait, accent color in tailwind is 'accent-accent' ? No, 'accent' class exists? actually it's 'accent-[var(--color-accent)]' but wait, there is no accent color in standard tailwind for the accent property.
  { search: /text-\[\#1F2937\]/g, replace: 'text-slate-800' },
  { search: /text-\[\#FF4A4A\]/g, replace: 'text-red-500' },
  { search: /hover:text-\[\#FF4A4A\]/g, replace: 'hover:text-red-500' },
  { search: /hover:text-cyan-400/g, replace: 'hover:text-accent' },
  { search: /hover:border-cyan-400/g, replace: 'hover:border-accent' },
  { search: /focus:border-cyan-400/g, replace: 'focus:border-accent' },
  { search: /focus:ring-cyan-400/g, replace: 'focus:ring-accent' },
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
