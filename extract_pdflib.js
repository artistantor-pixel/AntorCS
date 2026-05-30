const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, 'Portfolio by Antor Kumar Biswas .pdf');
const outputDir = path.join(__dirname, 'public', 'projects');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function extract() {
  console.log('Loading PDF with pdf-lib...');
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  console.log('PDF parsed successfully.');

  let imgCount = 0;
  
  // Enumerate all indirect objects in the PDF
  const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
  console.log(`Scanning ${indirectObjects.length} PDF objects for images...`);

  for (const [ref, obj] of indirectObjects) {
    if (obj instanceof PDFRawStream) {
      const dict = obj.dict;
      const subtype = dict.get(PDFName.of('Subtype'));
      
      if (subtype === PDFName.of('Image')) {
        imgCount++;
        const width = dict.get(PDFName.of('Width')).value;
        const height = dict.get(PDFName.of('Height')).value;
        const filter = dict.get(PDFName.of('Filter'));
        
        const streamBytes = obj.contents;
        let filename = `image_${imgCount.toString().padStart(3, '0')}`;
        let finalBuffer = Buffer.from(streamBytes);
        
        // Check if the image is JPEG (DCTDecode)
        if (filter === PDFName.of('DCTDecode') || (Array.isArray(filter) && filter.includes(PDFName.of('DCTDecode')))) {
          filename += '.jpg';
          fs.writeFileSync(path.join(outputDir, filename), finalBuffer);
          console.log(`Extracted JPEG: ${filename} (${width}x${height}, ${(finalBuffer.length / 1024).toFixed(1)} KB)`);
        } else {
          // It's likely FlateDecode or other compression, let's write it as a raw stream dump first
          // or convert to PNG if we can decode the Flate stream.
          // pdf-lib's PDFRawStream.contents automatically handles FlateDecode decompression!
          // So obj.contents is the DECOMPRESSED raw pixel data!
          // We can convert this decompressed raw pixel data directly to a BMP!
          try {
            const colorSpace = dict.get(PDFName.of('ColorSpace'));
            const bitsPerComponent = dict.get(PDFName.of('BitsPerComponent')).value;
            
            // Convert raw pixel stream to BMP
            const bmpBuffer = convertRawToBMP(streamBytes, width, height, colorSpace, bitsPerComponent);
            filename += '.bmp';
            fs.writeFileSync(path.join(outputDir, filename), bmpBuffer);
            console.log(`Extracted BMP: ${filename} (${width}x${height}, ${(bmpBuffer.length / 1024).toFixed(1)} KB)`);
          } catch (e) {
            // Fallback: save as raw data
            filename += '.raw';
            fs.writeFileSync(path.join(outputDir, filename), finalBuffer);
            console.log(`Extracted RAW: ${filename} (${width}x${height}, ${(finalBuffer.length / 1024).toFixed(1)} KB) - ${e.message}`);
          }
        }
      }
    }
  }

  console.log(`Finished. Successfully extracted ${imgCount} real images.`);
}

function convertRawToBMP(rawBytes, width, height, colorSpace, bitsPerComponent) {
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
  
  const isDeviceRGB = colorSpace === PDFName.of('DeviceRGB');
  const isDeviceGray = colorSpace === PDFName.of('DeviceGray');
  
  let rawOffset = 0;
  
  for (let y = 0; y < height; y++) {
    const rowOffset = pixelDataOffset + y * rowSize;
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + x * 3;
      
      let r = 0, g = 0, b = 0;
      
      if (isDeviceRGB) {
        r = rawBytes[rawOffset];
        g = rawBytes[rawOffset + 1];
        b = rawBytes[rawOffset + 2];
        rawOffset += 3;
      } else if (isDeviceGray) {
        const gray = rawBytes[rawOffset];
        r = g = b = gray;
        rawOffset += 1;
      } else {
        // Fallback or CMYK conversion
        r = rawBytes[rawOffset] || 0;
        g = rawBytes[rawOffset + 1] || 0;
        b = rawBytes[rawOffset + 2] || 0;
        rawOffset += 3;
      }
      
      buffer[pixelOffset] = b;
      buffer[pixelOffset + 1] = g;
      buffer[pixelOffset + 2] = r;
    }
  }
  
  return buffer;
}

extract().catch(console.error);
