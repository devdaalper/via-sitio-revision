import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourceRoot = join(root, 'src');
const extensions = new Set(['.astro', '.css']);
const minimumTextSizePx = 14;
const findings = [];

function filesIn(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesIn(path) : [path];
  });
}

for (const file of filesIn(sourceRoot)) {
  if (!extensions.has(extname(file))) continue;
  const lines = readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, index) => {
    for (const match of line.matchAll(/font-size\s*:\s*(\d*\.?\d+)\s*(rem|px)\b/gi)) {
      const numeric = Number.parseFloat(match[1]);
      const pixels = match[2].toLowerCase() === 'rem' ? numeric * 16 : numeric;
      if (pixels < minimumTextSizePx) findings.push([file, index + 1, match[0], pixels]);
    }
  });
}

if (findings.length) {
  console.error(`Se encontraron tamaños tipográficos menores de ${minimumTextSizePx}px:`);
  for (const [file, line, literal, pixels] of findings) {
    console.error(`- ${relative(root, file)}:${line} · ${literal} (${pixels.toFixed(2)}px)`);
  }
  process.exit(1);
}

console.log(`Escala tipográfica verificada: 0 declaraciones menores de ${minimumTextSizePx}px.`);
