const { extractImagesFromPdf } = require('pdf-extract-image');
const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, 'Portfolio by Antor Kumar Biswas .pdf');
const outputDir = path.join(__dirname, 'public', 'projects');

// Clean and recreate projects directory
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

async function run() {
  try {
    console.log('Extracting images using pdf-extract-image...');
    const images = await extractImagesFromPdf(pdfPath);
    console.log(`Successfully extracted ${images.length} images! Saving files...`);

    images.forEach((image, index) => {
      // Determine file extension (most are PNG or JPEG)
      // Check first bytes for PNG: 89 50 4E 47
      let ext = '.png';
      if (image.length > 4 && image[0] === 0x89 && image[1] === 0x50 && image[2] === 0x4E && image[3] === 0x47) {
        ext = '.png';
      } else if (image.length > 4 && image[0] === 0xFF && image[1] === 0xD8 && image[2] === 0xFF) {
        ext = '.jpg';
      }
      
      const filename = `image_${(index + 1).toString().padStart(3, '0')}${ext}`;
      fs.writeFileSync(path.join(outputDir, filename), image);
      console.log(`Saved: ${filename} (${(image.length / 1024).toFixed(1)} KB)`);
    });

    console.log('All images saved successfully to public/projects!');
  } catch (error) {
    console.error('Extraction error:', error);
  }
}

run();
