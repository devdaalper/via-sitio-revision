// Required bold emphasis from the client Version 5 checklist, independent of page source.
export const emphasis = {
 home: ['tu equipo de RH deje de ejecutar y empiece a estrategizar:', 'más tiempo para el clima laboral, los líderes y las decisiones que realmente importan.', 'proceso de reclutamiento', 'visibilidad en tiempo real de cada etapa', 'integra con portales de gobierno', 'Multipaís, multi-idioma y multiplataforma.'],
 process: ['Cada candidato sabe exactamente en qué etapa está', 'La forma en que tratas a un candidato dice mucho de tu empresa.', 'Los perfiles quedan activos para reconectarse'],
 solutions: ['realiza filtros por chat, llamada de audio o videollamada', 'evalúa al candidato en tiempo real.', 'registra la entrevista', 'Todo queda en el expediente', 'centralizar todo sin duplicar información ni procesos.', 'tiempo para lo estratégico.', 'más candidatos relevantes', 'Vacantes cubiertas más rápido', 'permisos configurados según su nivel de responsabilidad:'],
 contact: ['recibe una demostración adaptada a las necesidades'],
};
export function missingEmphasis(sources) {
 return Object.entries(emphasis).flatMap(([page, phrases]) => phrases.filter(text => !sources[page].includes(`<strong>${text}</strong>`)).map(text => `${page}: falta negrita requerida “${text}”`));
}
