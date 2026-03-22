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

// ═══════════════════════════════════════════════════════
// AUTO-DETECT ALL FOLDERS (Fixed!)
// ═══════════════════════════════════════════════════════

const result = {};

// Get ALL folders in photos/ automatically
const folders = fs.readdirSync(PHOTOS_DIR)
  .filter(name => {
    const fullPath = path.join(PHOTOS_DIR, name);
    return fs.statSync(fullPath).isDirectory();
  })
  .sort();

console.log(`📁 Found folders: ${folders.join(', ')}`);

// Scan each folder
for (const folder of folders) {
  const folderPath = path.join(PHOTOS_DIR, folder);
  const images = scanFolder(folderPath, folder);
  result[folder] = images;
  console.log(`  ✓ ${folder}: ${images.length} photos`);
}

// Ensure js folder exists
if (!fs.existsSync('js')) fs.mkdirSync('js', { recursive: true });

// Write JSON
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

const totalPhotos = Object.values(result).flat().length;
console.log(`\n✅ Generated ${OUTPUT_FILE}`);
console.log(`📊 Total: ${totalPhotos} photos in ${folders.length} folders`);
