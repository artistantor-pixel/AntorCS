import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.join(__dirname, 'Portfolio by Antor Kumar Biswas .pdf');
const outputDir = path.join(__dirname, 'public', 'projects');

if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

async function extract() {
  console.log('Loading PDF with pdfjs legacy...');
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  
  const loadingTask = pdfjs.getDocument({ 
    data,
    useSystemFonts: true,
    disableFontFace: true
  });
  
  const pdf = await loadingTask.promise;
  console.log(`PDF Loaded. Total pages: ${pdf.numPages}`);

  let imgCount = 0;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const operatorList = await page.getOperatorList();
    
    const fns = operatorList.fnArray;
    const args = operatorList.argsArray;
    
    for (let i = 0; i < fns.length; i++) {
      if (fns[i] === pdfjs.OPS.paintImageXObject || fns[i] === pdfjs.OPS.paintInlineImageXObject) {
        const imgKey = args[i][0];
        try {
          // Wait for the object to be resolved using the callback pattern
          const image = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Timeout')), 2000);
            page.objs.get(imgKey, (data) => {
              clearTimeout(timeout);
              resolve(data);
            });
          });

          if (image && image.data) {
            imgCount++;
            const width = image.width;
            const height = image.height;
            const rgbData = image.data;
            
            const buffer = convertRGBAToBMP(rgbData, width, height);
            const filename = `image_${imgCount.toString().padStart(3, '0')}.bmp`;
            
            fs.writeFileSync(path.join(outputDir, filename), buffer);
            console.log(`Extracted: ${filename} (${width}x${height}, ${(buffer.length / 1024).toFixed(1)} KB)`);
          }
        } catch (err) {
          // Skip if object could not be resolved or timeout occurred
        }
      }
    }
  }
  console.log(`Successfully extracted ${imgCount} images.`);
}

function convertRGBAToBMP(rgbaArray, width, height) {
  const fileHeaderSize = 14;
  const infoHeaderSize = 40;
  const pixelDataOffset = fileHeaderSize + infoHeaderSize;
  
  const rowSize = Math.floor((3 * width + 3) / 4) * 4;
  const pixelDataSize = rowSize * height;
  const fileSize = pixelDataOffset + pixelDataSize;
  
  const buffer = Buffer.alloc(fileSize);
  
  // File Header
  buffer.write('BM', 0);
  buffer.writeUInt32LE(fileSize, 2);
  buffer.writeUInt32LE(0, 6);
  buffer.writeUInt32LE(pixelDataOffset, 10);
  
  // Info Header
  buffer.writeUInt32LE(infoHeaderSize, 14);
  buffer.writeInt32LE(width, 18);
  buffer.writeInt32LE(-height, 22); // Top-down
  buffer.writeUInt16LE(1, 26);
  buffer.writeUInt16LE(24, 28); // 24-bit
  buffer.writeUInt32LE(0, 30);
  buffer.writeUInt32LE(pixelDataSize, 34);
  buffer.writeInt32LE(2835, 38);
  buffer.writeInt32LE(2835, 42);
  buffer.writeUInt32LE(0, 46);
  buffer.writeUInt32LE(0, 50);
  
  let rgbaOffset = 0;
  const isRGBA = rgbaArray.length === width * height * 4;
  const pixelSize = isRGBA ? 4 : 3;
  
  for (let y = 0; y < height; y++) {
    const rowOffset = pixelDataOffset + y * rowSize;
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + x * 3;
      const r = rgbaArray[rgbaOffset];
      const g = rgbaArray[rgbaOffset + 1];
      const b = rgbaArray[rgbaOffset + 2];
      
      buffer[pixelOffset] = b;
      buffer[pixelOffset + 1] = g;
      buffer[pixelOffset + 2] = r;
      
      rgbaOffset += pixelSize;
    }
  }
  
  return buffer;
}

extract().catch(console.error);
