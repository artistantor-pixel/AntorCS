const fs = require('fs');
const path = require('path');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

const pdfPath = path.join(__dirname, 'Portfolio by Antor Kumar Biswas .pdf');
const outputDir = path.join(__dirname, 'public', 'projects');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function extract() {
  console.log('Loading PDF with pdfjs...');
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = pdfjs.getDocument({ data });
  const pdf = await loadingTask.promise;
  console.log(`PDF Loaded. Total pages: ${pdf.numPages}`);

  let imgCount = 0;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const operatorList = await page.getOperatorList();
    
    // Find image operators
    const fns = operatorList.fnArray;
    const args = operatorList.argsArray;
    
    for (let i = 0; i < fns.length; i++) {
      if (fns[i] === pdfjs.OPS.paintImageXObject || fns[i] === pdfjs.OPS.paintInlineImageXObject) {
        const imgKey = args[i][0];
        try {
          const image = await page.objs.get(imgKey);
          if (image && image.data) {
            imgCount++;
            const width = image.width;
            const height = image.height;
            const rgbData = image.data; // This is RGBA or RGB Uint8ClampedArray
            
            // We can write it as a PNG file using a simple BMP or PNG header,
            // or if pdfjs already has the raw Jpeg bytes, we can use that.
            // Let's check if the image has a raw bytes stream.
            let buffer;
            let filename = `image_${imgCount.toString().padStart(3, '0')}.png`;
            
            // To convert raw pixel data (RGBA) to a valid PNG without native dependencies,
            // we can write a simple BMP file which is extremely easy and compatible with all browsers!
            // BMP header is very simple and does not require any library.
            buffer = convertRGBAToBMP(rgbData, width, height);
            filename = `image_${imgCount.toString().padStart(3, '0')}.bmp`;
            
            fs.writeFileSync(path.join(outputDir, filename), buffer);
            console.log(`Extracted: ${filename} (${width}x${height}, ${(buffer.length / 1024).toFixed(1)} KB)`);
          }
        } catch (err) {
          // Skip if object is not an image
        }
      }
    }
  }
  console.log(`Successfully extracted ${imgCount} images.`);
}

// Convert raw RGBA/RGB pixel array to a standard, widely-supported uncompressed BMP file
function convertRGBAToBMP(rgbaArray, width, height) {
  const fileHeaderSize = 14;
  const infoHeaderSize = 40;
  const pixelDataOffset = fileHeaderSize + infoHeaderSize;
  
  // BMP rows are padded to multiples of 4 bytes
  const rowSize = Math.floor((3 * width + 3) / 4) * 4;
  const pixelDataSize = rowSize * height;
  const fileSize = pixelDataOffset + pixelDataSize;
  
  const buffer = Buffer.alloc(fileSize);
  
  // File Header
  buffer.write('BM', 0); // Signature
  buffer.writeUInt32LE(fileSize, 2); // File size
  buffer.writeUInt32LE(0, 6); // Reserved
  buffer.writeUInt32LE(pixelDataOffset, 10); // Offset to pixel data
  
  // Info Header (BITMAPINFOHEADER)
  buffer.writeUInt32LE(infoHeaderSize, 14); // Header size
  buffer.writeInt32LE(width, 18); // Width
  buffer.writeInt32LE(-height, 22); // Height (negative for top-down)
  buffer.writeUInt16LE(1, 26); // Planes
  buffer.writeUInt16LE(24, 28); // Bits per pixel (24-bit BGR)
  buffer.writeUInt32LE(0, 30); // Compression (0 = BI_RGB)
  buffer.writeUInt32LE(pixelDataSize, 34); // Image size
  buffer.writeInt32LE(2835, 38); // X pixels per meter
  buffer.writeInt32LE(2835, 42); // Y pixels per meter
  buffer.writeUInt32LE(0, 46); // Colors in color table
  buffer.writeUInt32LE(0, 50); // Important colors
  
  // Pixel Data (RGB format, bottom-up or top-down depending on height sign)
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
      
      buffer[pixelOffset] = b; // Blue
      buffer[pixelOffset + 1] = g; // Green
      buffer[pixelOffset + 2] = r; // Red
      
      rgbaOffset += pixelSize;
    }
  }
  
  return buffer;
}

extract().catch(console.error);
