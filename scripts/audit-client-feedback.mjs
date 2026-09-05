import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sources = Object.fromEntries(Object.entries({
  home: 'src/pages/index.astro', process: 'src/pages/plataforma.astro',
  solutions: 'src/pages/soluciones.astro', contact: 'src/pages/contacto.astro',
  footer: 'src/components/Footer.astro',
}).map(([key, file]) => [key, readFileSync(resolve(root, file), 'utf8')]));

const required = {
  home: [
    'Solicita una demo', '<mark class="marker">Reduce</mark>', '<mark class="marker">hasta un 70%</mark>',
    '<mark class="marker">Pilares que</mark>', '<mark class="marker">transforman</mark>', 'tu selección', 'de talento',
    'Lo importante del proceso es lo humano.', '<span class="accent-text">V.IA</span> ejecuta.',
    '<mark class="marker marker-on-dark">Tú mantienes el control.</mark>',
    'tu equipo de RH deje de ejecutar y empiece a estrategizar:',
    'más tiempo para el clima laboral, los líderes y las decisiones que realmente importan.',
    '/assets/video/video-corporativo-via.mp4', '/assets/video/crowd-walk-via.mp4', '<mark class="marker marker-on-dark">tu equipo decida.</mark>',
    'Más de 8 etapas del <strong>proceso de reclutamiento</strong> automatizadas en',
    'Tres capacidades que hacen de <span class="accent-text">V.IA</span>',
    'visibilidad en tiempo real de cada etapa', 'integra con portales de gobierno',
    'Multipaís, multi-idioma y multiplataforma.',
    'Te mostramos cómo <span class="accent-text">V.IA</span> reduce tiempos',
  ],
  process: [
    '<span class="accent-text">V.IA</span> gestiona todo el ciclo de reclutamiento',
    "{ icon: 'publish', title: 'Publicación automatizada'", "{ icon: 'decide', title: 'Preselección'",
    "{ icon: 'folder', title: 'Recopilación de documentación'", "{ icon: 'decide', title: 'Incorporación del colaborador'",
    'class="btn-primary map-button"', '<span class="accent-text">V.IA</span> cuida la experiencia',
    'Cada candidato sabe exactamente en qué etapa está', 'Marca empleadora', 'Los perfiles quedan activos para reconectarse',
    'Conoce cómo <span class="accent-text">V.IA</span> <mark class="marker marker-on-dark">cambia tu reclutamiento</mark>',
  ],
  solutions: [
    '<span class="accent-text">V.IA</span> combina inteligencia artificial',
    'Entrevistas reales, que le <mark class="marker">ahorran tiempo a tu equipo.</mark>',
    'realiza filtros por chat, llamada de audio o videollamada', 'Entrevista por chat',
    'Entrevista por videollamada', 'Resultados integrados', 'evalúa al candidato en tiempo real.',
    'registra la entrevista', 'Todo queda en el expediente',
    'centralizar todo sin duplicar información ni procesos.', 'IMSS y RENAPO', 'Bolsas de empleo',
    'Sistemas de nómina', 'Comunicación y sistemas de talento', 'Evaluación y firma digital',
    '<mark class="marker">V.IA trabaja para todos</mark>',
    'Visibilidad total, datos para reportar y <strong>tiempo para lo estratégico.</strong>',
    'Menos operación, <strong>más candidatos relevantes</strong>',
    '<strong>Vacantes cubiertas más rápido</strong>, costos controlados',
    'Control y visibilidad por rol', 'permisos configurados según su nivel de responsabilidad:',
    '<mark class="marker marker-on-dark">V.IA se adapta a tu empresa.</mark>',
  ],
  contact: [
    'Descubre cómo <span class="accent-text">V.IA</span> puede integrarse a tu proceso de reclutamiento.',
    'recibe una demostración adaptada a las necesidades', '¿Cuál es el tamaño de tu empresa?',
    '1–50 colaboradores', '51–100 colaboradores', '101–250 colaboradores', '251–500 colaboradores',
    '501–1,000 colaboradores', 'Más de 1,000 colaboradores',
  ],
  footer: ['Plataforma de reclutamiento impulsada por IA'],
};

const forbidden = {
  home: ['Solicita un demo', 'En 30 minutos', 'v.ia ejecuta.', 'tu reclutamiento</h2>'],
  solutions: ['Entrevistas que no dependen de tu equipo.', 'conduce la primera entrevista'],
  contact: ['Todo tu reclutamiento.<br />Una sola v.ia.'],
};

const errors = [];
for (const [file, fragments] of Object.entries(required)) {
  for (const fragment of fragments) if (!sources[file].includes(fragment)) errors.push(`${file}: falta “${fragment}”`);
}
for (const [file, fragments] of Object.entries(forbidden)) {
  for (const fragment of fragments) if (sources[file].includes(fragment)) errors.push(`${file}: permanece texto anterior “${fragment}”`);
}
for (const file of ['home', 'process', 'solutions']) {
  if (!sources[file].includes(':global(.accent-text) { color: #8dbd2f;')) errors.push(`${file}: falta la regla verde funcional.`);
}
if ((sources.solutions.match(/title: '/g) ?? []).length < 11) errors.push('solutions: faltan entrevistas, cinco integraciones o tres roles.');
if (sources.contact.includes('contact-brand')) errors.push('contact: permanece el módulo tachado de icono y texto.');
if (!sources.contact.includes('data-lead-status="inactive"') || !sources.contact.includes('disabled aria-disabled="true"')) errors.push('contact: el formulario no conserva el estado inactivo requerido.');
if (Object.values(sources).some((source) => source.includes('VER CON OLIVIA'))) errors.push('Una nota interna quedó en el código público.');

if (errors.length) {
  console.error('Discrepancias contra la pestaña AJUSTES:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Pestaña AJUSTES verificada: copy, énfasis, video, iconos, cinco integraciones, roles, formulario y footer.');
