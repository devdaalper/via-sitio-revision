import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const logoNames = ['logo-on-light.svg', 'logo-on-dark.svg'];
const failures = [];

const requiredLogoFragments = [
  ['mesa completa', 'viewBox="180 320 720 440"'],
  ['proporción web', 'width="720" height="440"'],
  ['punto verde circular', '<circle cx="492.328125" cy="637.320312" r="45.042969"'],
  ['punto superior oficial de la i', '347.378906 L 638.566406 347.386719'],
  ['tagline oficial', 'M 285.648438 720.433594'],
];

for (const logoName of logoNames) {
  const source = readFileSync(join(root, 'public', 'assets', 'brand', logoName), 'utf8');
  for (const [label, fragment] of requiredLogoFragments) {
    if (!source.includes(fragment)) failures.push(`${logoName}: falta ${label}`);
  }
}

const componentRequirements = {
  'Header.astro': ['width: 206px', 'width: 124px', 'width: 154px', 'width: 116px', 'width: 140px', 'width: 108px'],
  'Footer.astro': ['width: min(340px, 58vw)', 'width: min(240px, 76vw)'],
};

for (const componentName of ['Header.astro', 'Footer.astro']) {
  const source = readFileSync(join(root, 'src', 'components', componentName), 'utf8');
  if (!source.includes('/assets/brand/logo-on-light.svg')) {
    failures.push(`${componentName}: no usa el vector oficial para fondo oscuro`);
  }
  for (const fragment of componentRequirements[componentName]) {
    if (!source.includes(fragment)) failures.push(`${componentName}: falta la escala validada ${fragment}`);
  }
}

if (failures.length) {
  console.error('La implementación del logotipo se apartó del vector oficial:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Logotipo verificado: mesa completa, proporción 18:11 y geometría oficial preservadas.');
