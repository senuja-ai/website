const fs = require('fs');
const path = require('path');

const PHOTOS_DIR = './photos';
const OUTPUT_FILE = './js/gallery-data.json';
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG'];

function isImage(filename) {
  return IMAGE_EXTENSIONS.includes(path.extname(filename).toLowerCase());
}

function formatTitle(filename) {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function scanFolder(folderPath, folderName) {
  if (!fs.existsSync(folderPath)) return [];
  
  return fs.readdirSync(folderPath)
    .filter(file => {
      const filePath = path.join(folderPath, file);
      return fs.statSync(filePath).isFile() && isImage(file);
    })
    .map(file => ({
      url: `photos/${folderName}/${file}`,
      filename: file,
      title: formatTitle(file),
      date: fs.statSync(path.join(folderPath, file)).mtime.toISOString().split('T')[0]
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Main
const result = {
  all: scanFolder(path.join(PHOTOS_DIR, 'all'), 'all'),
  'halloween-party': scanFolder(path.join(PHOTOS_DIR, 'halloween-party'), 'halloween-party')
};

// Ensure js folder exists
if (!fs.existsSync('js')) fs.mkdirSync('js');

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
console.log(`✅ Generated JSON with ${result.all.length + result['halloween-party'].length} photos`);
