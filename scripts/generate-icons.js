import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, r, g, b) {
  // 每一行開頭需要一個 filter byte (0: None)，接著寬度*4 個字節 (RGBA)
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(rowLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter None

    // 圓角半徑
    const radius = width * 0.25;

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      // 檢查是否在圓角矩形內
      let inside = true;
      const dx = Math.max(radius - x, 0, x - (width - radius));
      const dy = Math.max(radius - y, 0, y - (height - radius));
      if (dx * dx + dy * dy > radius * radius) {
        inside = false;
      }

      if (!inside) {
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0;
      } else {
        // 簡單的幾何中心漸層與白色 A 字符號
        const centerX = width / 2;
        const centerY = height / 2;
        const distFromCenter = Math.hypot(x - centerX, y - centerY);

        // 判斷是否為中心白色英文字母 A 的粗線條
        const isLetterA = (
          // 橫槓
          (y > centerY && y < centerY + width * 0.08 && Math.abs(x - centerX) < width * 0.2) ||
          // 斜邊
          (y > centerY - width * 0.25 && y < centerY + width * 0.25 &&
           Math.abs(Math.abs(x - centerX) - (y - (centerY - width * 0.25)) * 0.45) < width * 0.05)
        );

        if (isLetterA) {
          rawData[pixelOffset] = 255;
          rawData[pixelOffset + 1] = 255;
          rawData[pixelOffset + 2] = 255;
          rawData[pixelOffset + 3] = 255;
        } else {
          //  indigo 漸層底色
          const factor = Math.min(1, distFromCenter / width);
          rawData[pixelOffset] = Math.floor(r * (1 - factor * 0.2));
          rawData[pixelOffset + 1] = Math.floor(g * (1 - factor * 0.2));
          rawData[pixelOffset + 2] = Math.floor(b * (1 - factor * 0.1));
          rawData[pixelOffset + 3] = 255;
        }
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // 計算 CRC32
  function crc32(buf) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeAndData = Buffer.concat([Buffer.from(type), data]);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(typeAndData), 0);
    return Buffer.concat([len, typeAndData, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const pubDir = path.resolve('public');
fs.writeFileSync(path.join(pubDir, 'pwa-192x192.png'), createPng(192, 192, 79, 70, 229));
fs.writeFileSync(path.join(pubDir, 'pwa-512x512.png'), createPng(512, 512, 79, 70, 229));
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), createPng(180, 180, 79, 70, 229));
console.log('PWA icons created successfully in public/ !');
