const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'projects');
const files = fs.readdirSync(dir);

let count = 0;

for (const file of files) {
  if (file.endsWith('.raw')) {
    const filePath = path.join(dir, file);
    const buffer = fs.readFileSync(filePath);
    
    // Check if the file starts with JPEG header: FF D8 FF
    if (buffer.length > 4 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      count++;
      const newFilename = `real_image_${count.toString().padStart(3, '0')}.jpg`;
      fs.writeFileSync(path.join(dir, newFilename), buffer);
      console.log(`JPEG DETECTED! Saved ${file} as ${newFilename} (${(buffer.length / 1024).toFixed(1)} KB)`);
    } else if (buffer.length > 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      // PNG header: 89 50 4E 47
      count++;
      const newFilename = `real_image_${count.toString().padStart(3, '0')}.png`;
      fs.writeFileSync(path.join(dir, newFilename), buffer);
      console.log(`PNG DETECTED! Saved ${file} as ${newFilename} (${(buffer.length / 1024).toFixed(1)} KB)`);
    }
  }
}

console.log(`Total real images found and converted: ${count}`);
