const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const indexHtml = path.join(__dirname, 'index.html');

const replacements = [
  // Backgrounds
  { from: /bg-slate-950/g, to: 'bg-slate-50' },
  { from: /bg-slate-900/g, to: 'bg-white' },
  { from: /bg-slate-800/g, to: 'bg-slate-50' },
  { from: /bg-slate-700/g, to: 'bg-slate-100' },
  // Text colors
  // Need to be careful with text-white, mostly change to text-slate-900 EXCEPT when inside a primary button or specific gradients. 
  // Let's rely on standard text-slate replacements and selectively fix text-white later or using regex context.
  { from: /text-slate-100/g, to: 'text-slate-900' },
  { from: /text-slate-200/g, to: 'text-slate-800' },
  { from: /text-slate-300/g, to: 'text-slate-600' },
  { from: /text-slate-400/g, to: 'text-slate-500' },
  { from: /text-slate-500/g, to: 'text-slate-400' },
  // Borders
  { from: /border-slate-800/g, to: 'border-slate-200' },
  { from: /border-slate-700/g, to: 'border-slate-300' },
  // Specific cases
  { from: /text-white(?!.*(bg-brand|bg-gradient|text-white))/g, to: 'text-slate-900' }, // basic heuristic, might need manual check
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // text-white heuristic: replace text-white with text-slate-900 UNLESS it's on a line with bg-brand, from-brand, bg-indigo, etc.
  const lines = content.split('\n');
  const newLines = lines.map(line => {
    if (line.includes('text-white')) {
      if (line.includes('bg-brand') || line.includes('bg-emerald') || line.includes('bg-gradient') || line.includes('from-brand') || line.includes('from-purple') || line.includes('from-indigo')) {
        return line; // keep text-white
      }
      return line.replace(/text-white/g, 'text-slate-900');
    }
    return line;
  });
  content = newLines.join('\n');

  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.html')) {
      processFile(fullPath);
    }
  }
}

traverseDir(srcDir);
processFile(indexHtml);
console.log('Done refactoring to light mode.');
