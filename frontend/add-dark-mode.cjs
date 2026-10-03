const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = {
  'bg-white': 'bg-white dark:bg-slate-900',
  'bg-slate-50': 'bg-slate-50 dark:bg-slate-950',
  'bg-slate-100': 'bg-slate-100 dark:bg-slate-800',
  'bg-slate-200': 'bg-slate-200 dark:bg-slate-700',
  'text-slate-900': 'text-slate-900 dark:text-white',
  'text-slate-800': 'text-slate-800 dark:text-slate-200',
  'text-slate-700': 'text-slate-700 dark:text-slate-300',
  'text-slate-600': 'text-slate-600 dark:text-slate-400',
  'text-slate-500': 'text-slate-500 dark:text-slate-400',
  'border-slate-100': 'border-slate-100 dark:border-slate-800',
  'border-slate-200': 'border-slate-200 dark:border-slate-700',
  'border-slate-300': 'border-slate-300 dark:border-slate-600',
};

// Prevent double replacement if script is run twice
const cleanExistingDark = (content) => {
  return content.replace(/dark:[a-z0-9-]+\s/g, '').replace(/dark:[a-z0-9-]+"/g, '"');
};

const processFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Quick clean to avoid dark:dark:
  content = cleanExistingDark(content);

  for (const [light, dark] of Object.entries(replacements)) {
    // Regex to match the light class bounded by spaces, quotes, or backticks
    const regex = new RegExp(`(?<=['"\\\`\\s])${light}(?=['"\\\`\\s])`, 'g');
    content = content.replace(regex, dark);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed: ${filePath}`);
};

const walkSync = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkSync(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      processFile(filePath);
    }
  }
};

walkSync(directoryPath);
// Also process App.tsx if it's in src
console.log('Dark mode classes injected!');
