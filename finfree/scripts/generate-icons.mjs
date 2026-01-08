import sharp from 'sharp';
import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'icons');

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

const svgTemplate = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#0f0f1a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6"/>
      <stop offset="100%" style="stop-color:#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="url(#bg)"/>
  <circle cx="${size * 0.5}" cy="${size * 0.4}" r="${size * 0.18}" fill="url(#accent)" opacity="0.25"/>
  <g transform="translate(${size * 0.5}, ${size * 0.4})">
    <line x1="0" y1="${-size * 0.14}" x2="0" y2="${size * 0.14}" stroke="#8b5cf6" stroke-width="${size * 0.04}" stroke-linecap="round"/>
    <line x1="${-size * 0.1}" y1="0" x2="${size * 0.1}" y2="0" stroke="#8b5cf6" stroke-width="${size * 0.04}" stroke-linecap="round"/>
  </g>
  <text x="${size * 0.5}" y="${size * 0.75}" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="${size * 0.14}" font-weight="700" fill="#8b5cf6">FF</text>
</svg>
`;

async function generateIcons() {
  try {
    await mkdir(iconsDir, { recursive: true });

    for (const size of sizes) {
      const svg = svgTemplate(size);
      const buffer = await sharp(Buffer.from(svg))
        .png()
        .toBuffer();
      
      const filename = size === 180 ? 'apple-icon-180.png' : `icon-${size}.png`;
      await writeFile(join(iconsDir, filename), buffer);
      console.log(`Generated ${filename}`);
    }

    // Also save the SVG version
    await writeFile(join(iconsDir, 'icon.svg'), svgTemplate(512));
    console.log('Generated icon.svg');

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
