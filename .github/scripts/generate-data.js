const fs = require('fs');
const path = require('path');

const photosDir = './photos';
const outputFile = './js/gallery-data.json';

function scanDirectory(dir) {
  const result = {};
  
  const folders = fs.readdirSync(dir).filter(f => 
    fs.statSync(path.join(dir, f)).isDirectory()
  );
  
  folders.forEach(folder => {
    const folderPath = path.join(dir, folder);
    const files = fs.readdirSync(folderPath)
      .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .map(f => ({
        url: `photos/${folder}/${f}`,
        filename: f,
        title: f.replace(/\.[^/.]+$/, "").replace(/-/g, " "),
        date: fs.statSync(path.join(folderPath, f)).mtime.toISOString().split('T')[0]
      }));
    
    result[folder] = files;
  });
  
  return result;
}

const data = scanDirectory(photosDir);
fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
console.log('Gallery data generated!');
