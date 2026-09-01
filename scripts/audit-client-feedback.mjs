import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sources = {
  home: readFileSync(resolve(root, 'src/pages/index.astro'), 'utf8'),
  process: readFileSync(resolve(root, 'src/pages/plataforma.astro'), 'utf8'),
  solutions: readFileSync(resolve(root, 'src/pages/soluciones.astro'), 'utf8'),
  header: readFileSync(resolve(root, 'src/components/Header.astro'), 'utf8'),
  footer: readFileSync(resolve(root, 'src/components/Footer.astro'), 'utf8'),
};

const requirements = {
  home: [
    'Todo tu reclutamiento en', 'una sola plataforma', 'Reduce hasta un', 'Pilares',
    'v.ia ejecuta. Tú mantienes el control.', 'Resultados reales,', 'no promesas.',
    '−70%', '−45%', '+50%', 'tu equipo decida.', 'sin límites.',
    '¿Listo para llevar tu reclutamiento al siguiente nivel con v.ia?',
    '1ZrSFL7qfZDn-FJLkqIr_8mEJzWNv_S3x',
  ],
  process: [
    'de la vacante a la contratación', 'Requisición de vacante', 'Creación de perfil ideal',
    'Publicación automatizada', 'Lectura inteligente', 'Matching con IA', 'Preselección',
    'Programación de entrevistas', 'Recopilación de documentación', 'Incorporación del colaborador',
    'Cada candidato importa, en cada etapa.', 'v.ia cambia tu reclutamiento',
  ],
  solutions: [
    'Un equipo que trabaja por ti.', 'Entrevista por chat', 'Entrevista por videollamada',
    'Resultados integrados', 'IMSS y RENAPO', 'Bolsas de empleo', 'Sistemas de nómina',
    'Director de RH', 'Reclutador', 'Director General', 'v.ia se adapta a tu empresa.',
  ],
  header: ["'/plataforma'", "'/soluciones'"],
  footer: ['PUBLIC_INSTAGRAM_URL', 'PUBLIC_FACEBOOK_URL', 'PUBLIC_LINKEDIN_URL'],
};

const errors = [];
for (const [file, fragments] of Object.entries(requirements)) {
  for (const fragment of fragments) {
    if (!sources[file].includes(fragment)) errors.push(`${file}: falta “${fragment}”`);
  }
}

const stepCount = (sources.process.match(/title:/g) ?? []).length;
if (stepCount !== 12) errors.push(`process: se esperaban 9 pasos y 3 beneficios; se detectaron ${stepCount} títulos de datos.`);
if (sources.solutions.includes('Visual de producto pendiente')) errors.push('solutions: una nota interna quedó visible en la página.');
if (sources.header.includes('/reclutamiento-masivo')) errors.push('header: la ruta heredada sigue en navegación principal.');

if (errors.length) {
  console.error('Discrepancias contra la instrucción del cliente:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Instrucción del cliente verificada: 3 páginas, 9 etapas, énfasis, video, navegación y redes configurables.');
