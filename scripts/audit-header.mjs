import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const source = readFileSync(join(root, 'src', 'components', 'Header.astro'), 'utf8');
const failures = [];

const requirements = [
  ['umbral de compactación', 'const collapseAt = 96;'],
  ['umbral independiente de expansión', 'const expandAt = 8;'],
  ['actualización agrupada por frame', 'window.requestAnimationFrame(() => {'],
  ['condición de compactación', 'scrollPosition >= collapseAt'],
  ['condición de expansión', 'scrollPosition <= expandAt'],
];

for (const [label, fragment] of requirements) {
  if (!source.includes(fragment)) failures.push(`Falta ${label}`);
}

if (source.includes("window.scrollY > 24")) {
  failures.push('Regresó el umbral único que provocaba oscilación');
}

if (failures.length) {
  console.error('El encabezado sticky perdió su protección contra intermitencia:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Encabezado verificado: histéresis 96/8 y actualización por frame activas.');
