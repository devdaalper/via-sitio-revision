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

const fullCopyCoverage = {
  home: [
    'Plataforma integral de reclutamiento impulsada con IA, desde la requisición hasta la nómina.',
    'v.ia filtra candidatos, realiza evaluaciones, agenda entrevistas, mantiene comunicación y valida documentos para la contratación.',
    'Solicita un demo', 'Atrae al talento correcto desde el inicio.',
    'Construye tu propio banco de candidatos sin depender de terceros.',
    'Todo en un solo lugar, sin herramientas dispersas.',
    'Se conecta a los portales y plataformas que ya usas.',
    'Tu equipo evalúa con evidencia, no con intuición.',
    'Lo importante del proceso es', 'v.ia se encarga de lo operativo para que tu equipo de RH deje de ejecutar y empiece a estrategizar:',
    'Reduce el tiempo de contratación', 'Costos por proceso', 'Tiempo en revisión manual de CVs',
    'Eficiencia del equipo de RH', 'Más de 8 etapas del proceso de reclutamiento automatizadas en v.ia',
    'Conoce el proceso completo', 'Tres capacidades que hacen de',
    'Candidatos y reclutadores tienen visibilidad en tiempo real de cada etapa del proceso, sin fricciones ni silencios.',
    'v.ia se integra con portales de gobierno para verificar documentos automáticamente y eliminar riesgos legales desde el inicio.',
    'Multipaís, multi-idioma y multiplataforma. v.ia se adapta a donde está tu operación sin importar el volumen.',
    'En 30 minutos te mostramos cómo v.ia reduce tiempos, elimina tareas manuales y devuelve el control a tu equipo de RH.',
    'Solicitar demo',
  ],
  process: [
    'Plataforma de reclutamiento impulsada con IA',
    'v.ia gestiona todo el ciclo de reclutamiento en un solo lugar: publica vacantes, filtra perfiles con IA, coordina entrevistas, valida documentos y acompaña el proceso hasta la nómina.',
    'RH establece el perfil y las necesidades de la vacante.', 'v.ia crea el perfil del candidato ideal.',
    'v.ia automatiza la publicación de la vacante en múltiples portales y redes.',
    'v.ia entiende y extrae la información de los CVs.',
    'Clasifica por compatibilidad y aplica los criterios de la vacante.',
    'v.ia ayuda a generar evaluaciones y filtros automatizados.',
    'v.ia realiza y programa entrevistas por chat o videollamada.',
    'v.ia valida la identidad y los registros del candidato directamente desde RENAPO e IMSS, sin procesos manuales.',
    'Das la bienvenida al nuevo integrante de tu equipo.', 'Agenda una demostración',
    'A lo largo de todo el proceso', 'v.ia cuida la experiencia de cada persona que pasa por el proceso.',
    'Cada candidato sabe exactamente en qué etapa está y qué sigue. Sin silencio, sin incertidumbre.',
    'La forma en que tratas a un candidato dice mucho de tu empresa. v.ia cuida esa experiencia en cada paso del proceso.',
    'Un rechazo no es un adiós. Los perfiles quedan activos para reconectarse cuando surja la oportunidad correcta.',
    'Dale a tu equipo de RH lo que necesita', 'Ahorra tiempo, costos de operación y mejora la eficiencia de RH.',
    'Quiero una demostración',
  ],
  solutions: [
    'Lo que v.ia hace por tu equipo',
    'v.ia combina inteligencia artificial, automatización e integraciones para que tu proceso de reclutamiento opere solo, mientras tu equipo se enfoca en decidir.',
    'Agentes con IA', 'v.ia conduce la primera entrevista por chat o videollamada, evalúa respuestas y concentra los resultados en el expediente del candidato, sin que el reclutador tenga que intervenir.',
    'Conversación automatizada que evalúa al candidato en tiempo real.',
    'v.ia conduce y registra la entrevista sin necesidad de un reclutador presente.',
    'Todo queda en el expediente del candidato listo para que tu equipo evalúe.',
    'Conectado a tu operación', 'v.ia se conecta con portales de gobierno, plataformas de nómina y bolsas de empleo para centralizar todo sin duplicar información ni procesos.',
    'Validación oficial de identidad y registros del candidato en tiempo real.',
    'Descarga automática de CVs desde los portales que ya usas.',
    'Alta del colaborador directo desde v.ia sin salir de la plataforma.',
    'Diseñado para cada rol', 'Cada área tiene necesidades distintas. v.ia se adapta a lo que cada rol necesita.',
    'Visibilidad total, datos para reportar y tiempo para lo estratégico.',
    'Menos operación, más candidatos relevantes y decisiones con criterio.',
    'Vacantes cubiertas más rápido, costos controlados y RH estratégico.',
    'Cuéntanos cómo recluta tu empresa hoy y te mostramos qué solución encaja mejor con tu proceso.',
    'Habla con un especialista',
  ],
};

const errors = [];
for (const [file, fragments] of Object.entries(requirements)) {
  for (const fragment of fragments) {
    if (!sources[file].includes(fragment)) errors.push(`${file}: falta “${fragment}”`);
  }
}
const searchableSources = Object.fromEntries(Object.entries(sources).map(([file, source]) => [
  file,
  source.replace(/<[^>]+>/g, '').replace(/\s+/g, ' '),
]));
for (const [file, fragments] of Object.entries(fullCopyCoverage)) {
  for (const fragment of fragments) {
    if (!searchableSources[file].includes(fragment.replace(/\s+/g, ' '))) errors.push(`${file}: falta copy instruido: “${fragment}”`);
  }
}

const requiredMarkerMarkup = {
  home: ['una sola plataforma', '70%', 'Pilares', 'no promesas.', 'sin límites.'],
  process: ['de la vacante a la contratación', 'v.ia cambia tu reclutamiento'],
  solutions: ['Un equipo que trabaja por ti.', 'v.ia trabaja para todos', 'v.ia se adapta a tu empresa.'],
};
for (const [file, fragments] of Object.entries(requiredMarkerMarkup)) {
  for (const fragment of fragments) {
    const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`<mark[^>]*>${escaped}</mark>`).test(sources[file])) {
      errors.push(`${file}: el fragmento no conserva marcador de fondo: “${fragment}”`);
    }
  }
}

const stepCount = (sources.process.match(/title:/g) ?? []).length;
if (stepCount !== 12) errors.push(`process: se esperaban 9 pasos y 3 beneficios; se detectaron ${stepCount} títulos de datos.`);
if (sources.solutions.includes('Visual de producto pendiente')) errors.push('solutions: una nota interna quedó visible en la página.');
if (sources.header.includes('/reclutamiento-masivo')) errors.push('header: la ruta heredada sigue en navegación principal.');

const unrequestedCopy = [
  'Menos tiempo operativo',
  'Una operación conectada',
  'Preparada para crecer contigo',
  'Un solo flujo',
  'De la requisición al primer día.',
];
for (const fragment of unrequestedCopy) {
  if (sources.home.includes(fragment) || sources.process.includes(fragment) || sources.solutions.includes(fragment)) {
    errors.push(`copy: permanece un texto no solicitado por el documento: “${fragment}”`);
  }
}

const forbiddenAccentChips = [
  '.pillar-list h3 { display: inline-block',
  '.metrics-grid strong { display: inline-block',
  '.capability-band h3 { display: inline-block',
  '.process-map h3 { display: inline-block',
  '.candidate-band h3 { display: inline-block',
  '.feature-band h3, .roles-band h3 { display: inline-block',
];
for (const fragment of forbiddenAccentChips) {
  if (Object.values(sources).some((source) => source.includes(fragment))) {
    errors.push(`énfasis: reapareció una etiqueta oscura no indicada: ${fragment}`);
  }
}

if (Object.values(sources).some((source) => source.includes('.marker::after'))) {
  errors.push('énfasis: reapareció un pseudoelemento de marcador que puede desprenderse al cambiar el salto de línea.');
}

for (const [file, source] of Object.entries({ home: sources.home, process: sources.process, solutions: sources.solutions })) {
  if (!source.includes('.accent-text { color: #8dbd2f;')) {
    errors.push(`${file}: falta la regla de texto verde indicada por el documento.`);
  }
}

if (errors.length) {
  console.error('Discrepancias contra la instrucción del cliente:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Instrucción del cliente verificada: 3 páginas, 9 etapas, énfasis, video, navegación y redes configurables.');
