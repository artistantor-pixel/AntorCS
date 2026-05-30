const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, 'Portfolio by Antor Kumar Biswas .pdf');
const outputDir = path.join(__dirname, 'public', 'projects');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Reading PDF file...');
const pdfBuffer = fs.readFileSync(pdfPath);

console.log('Scanning for JPEGs...');
let count = 0;
let pos = 0;

while (pos < pdfBuffer.length) {
  // Look for JPEG SOI marker: FF D8
  const start = pdfBuffer.indexOf(Buffer.from([0xFF, 0xD8]), pos);
  if (start === -1) break;

  // Find next EOI marker: FF D9
  const end = pdfBuffer.indexOf(Buffer.from([0xFF, 0xD9]), start);
  if (end === -1) {
    pos = start + 2;
    continue;
  }

  // Extract the potential JPEG data
  const jpegLength = end + 2 - start;
  // Make sure it's a reasonable size for an image (e.g. > 5KB and < 10MB)
  if (jpegLength > 5000 && jpegLength < 10000000) {
    count++;
    const jpegBuffer = pdfBuffer.subarray(start, end + 2);
    const filename = `image_${count.toString().padStart(3, '0')}.jpg`;
    fs.writeFileSync(path.join(outputDir, filename), jpegBuffer);
    console.log(`Extracted: ${filename} (${(jpegLength / 1024).toFixed(1)} KB)`);
    pos = end + 2;
  } else {
    pos = start + 2;
  }
}

console.log(`Finished. Extracted ${count} images to public/projects/`);
