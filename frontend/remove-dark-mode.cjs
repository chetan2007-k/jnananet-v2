const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const removeDarkClasses = (content) => {
  // Regex to match dark: followed by any valid tailwind class characters
  return content.replace(/dark:[a-z0-9-]+\s/g, '').replace(/dark:[a-z0-9-]+"/g, '"');
};

const processFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = removeDarkClasses(content);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned: ${filePath}`);
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
console.log('Dark mode classes removed globally!');
