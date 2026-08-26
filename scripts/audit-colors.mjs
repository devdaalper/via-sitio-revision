import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const scanRoots = ['src', 'public'];
const extensions = new Set(['.astro', '.css', '.js', '.mjs', '.svg', '.ts']);
const allowedRgb = new Set([
  '249,249,249', // SOFT WHITE
  '237,235,223', // BEIGE
  '22,26,35',    // DARK BLUE
  '39,65,79',    // BLUE GRAY
  '225,254,102', // BRIGHT GREEN
  '141,189,47',  // MEDIUM GREEN
]);

const findings = [];

function filesIn(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesIn(path) : [path];
  });
}

function normalizeHex(literal) {
  let value = literal.slice(1);
  if (value.length === 3 || value.length === 4) value = [...value].map((char) => char + char).join('');
  return value.slice(0, 6).match(/.{2}/g).map((pair) => Number.parseInt(pair, 16)).join(',');
}

function normalizeRgb(channels) {
  return channels.map((channel) => {
    const value = Number.parseFloat(channel);
    return channel.endsWith('%') ? Math.round(value * 2.55) : Math.round(value);
  }).join(',');
}

for (const scanRoot of scanRoots) {
  for (const file of filesIn(join(root, scanRoot))) {
    if (!extensions.has(extname(file))) continue;
    const source = readFileSync(file, 'utf8');
    const lines = source.split('\n');

    lines.forEach((line, index) => {
      for (const match of line.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
        if (!allowedRgb.has(normalizeHex(match[0]))) findings.push([file, index + 1, match[0]]);
      }

      for (const match of line.matchAll(/rgba?\(\s*([\d.]+%?)\s*,\s*([\d.]+%?)\s*,\s*([\d.]+%?)/gi)) {
        if (!allowedRgb.has(normalizeRgb(match.slice(1, 4)))) findings.push([file, index + 1, match[0]]);
      }
    });
  }
}

if (findings.length) {
  console.error('Se encontraron colores fuera de la paleta oficial de v.ia:');
  for (const [file, line, literal] of findings) console.error(`- ${relative(root, file)}:${line} · ${literal}`);
  process.exit(1);
}

console.log('Paleta oficial verificada: 6 colores autorizados, 0 colores adicionales.');
