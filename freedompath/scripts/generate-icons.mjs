import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'icons');

// Create simple icon as buffer
const createIconSvg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.1875}" fill="#0a0a0a"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.35}" stroke="#22c55e" stroke-width="${size * 0.05}" fill="none"/>
  <path d="M${size/2} ${size * 0.25} L${size/2} ${size/2} L${size * 0.68} ${size * 0.62}" stroke="#22c55e" stroke-width="${size * 0.04}" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M${size * 0.35} ${size * 0.4} L${size/2} ${size * 0.28} L${size * 0.65} ${size * 0.4}" stroke="#22c55e" stroke-width="${size * 0.03}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

async function generateIcons() {
  const sizes = [
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
  ];

  for (const { name, size } of sizes) {
    const svg = Buffer.from(createIconSvg(size));
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(join(iconsDir, name));
    console.log(`Generated ${name}`);
  }

  // Generate favicon
  const faviconSvg = Buffer.from(createIconSvg(32));
  await sharp(faviconSvg)
    .resize(32, 32)
    .png()
    .toFile(join(__dirname, '..', 'public', 'favicon.png'));
  console.log('Generated favicon.png');
}

generateIcons().catch(console.error);
