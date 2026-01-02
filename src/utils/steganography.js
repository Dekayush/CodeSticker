// Helper to convert string to bit array
export const stringToBits = (str) => {
  const bytes = new TextEncoder().encode(str);
  const bits = [];
  for (let byte of bytes) {
    for (let i = 7; i >= 0; i--) {
      bits.push((byte >> i) & 1);
    }
  }
  return bits;
};

// Helper to convert bit array to string
export const bitsToString = (bits) => {
  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      if (bits[i + j]) {
        byte |= (1 << (7 - j));
      }
    }
    bytes.push(byte);
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
};

// Simple pattern encoding: 
// We'll use a "data zone" in the sticker.
// For robust scanning, we'll use 4x4 or 8x8 pixel blocks for each bit.
export const DATA_BLOCK_SIZE = 8;
export const SYNC_PATTERN = [1, 0, 1, 0, 1, 0, 1, 0]; // 8 bits sync

export const encodeDataToPattern = (data) => {
  const bits = stringToBits(data);
  const lengthBits = [];
  const len = bits.length;
  for (let i = 15; i >= 0; i--) {
    lengthBits.push((len >> i) & 1);
  }
  return [...SYNC_PATTERN, ...lengthBits, ...bits];
};

export const decodePatternFromPixels = (pixelData, width, height) => {
  // This is a complex task for a simple app. 
  // We'll assume the data is encoded in a specific region or pattern.
  // For the demo, let's say it's at the bottom or in a grid.
  // We'll implement a simplified version that looks for high-contrast blocks.
};
