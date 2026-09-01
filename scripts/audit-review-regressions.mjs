import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const layout = readFileSync(resolve(root, 'src/layouts/BaseLayout.astro'), 'utf8');
const globalStyles = readFileSync(resolve(root, 'src/styles/global.css'), 'utf8');
const badge = readFileSync(resolve(root, 'src/components/ReviewBadge.astro'), 'utf8');
const failures = [];

if (!layout.includes('<main id="contenido" tabindex="-1">')) {
  failures.push('El destino del skip link no es enfocable.');
}

const badgeBlock = globalStyles.match(/\.review-badge \{([\s\S]*?)\n\}/)?.[1] ?? '';
if (/position:\s*fixed/.test(badgeBlock)) {
  failures.push('La placa de revisión volvió a ser fija y puede tapar contenido.');
}
if (!/position:\s*relative/.test(badgeBlock)) {
  failures.push('La placa de revisión no conserva su posición dentro del flujo.');
}

if (!layout.includes("'VIA-WEB-R003'")) failures.push('El layout no identifica R003.');
if (!badge.includes("'VIA-WEB-R003'")) failures.push('La placa no identifica R003.');

if (failures.length) {
  console.error('Regresiones de la auditoría adversarial:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Regresiones R003 verificadas: foco, placa en flujo e identificación correctos.');
