import { readFileSync } from 'node:fs';

// Frozen from AJUSTES and the master checklist, not generated from page code.
// See docs/cotejo-directo-ajustes-2026-09-07.md and the fixture README.
export const copyContract = JSON.parse(readFileSync(new URL('./fixtures/feedback-copy.json', import.meta.url)));
export const formatContract = JSON.parse(readFileSync(new URL('./fixtures/feedback-format.json', import.meta.url)));
const prefixes = { home: 'HOME', process: 'FUNC', solutions: 'SOL', contact: 'FORM' };
const normalizeSpace = value => value.replace(/\s+/g, ' ').trim();

export function missingCopy(sources) {
  return copyContract.filter(item => {
    const source = item.id.endsWith('-49') && item.page === 'home' ? sources.footer : sources[item.page];
    const plain = normalizeSpace(source.replace(/<br\s*\/?\s*>/gi, ' ').replace(/<[^>]+>/g, ''));
    // These labels use CSS text-transform. Their rendered capitalization is
    // still checked literally by inspectFeedback; this is only the source pass.
    return !(item.sourceCase === 'css-uppercase' ? plain.toUpperCase() : plain).includes(normalizeSpace(item.text));
  }).map(item => `${item.id}: falta texto exacto “${item.text}”`);
}

export async function inspectFeedback(page, key) {
  if (!prefixes[key]) return [];
  return page.evaluate(({ copy, format, key }) => {
    const errors = [];
    const space = value => value.replace(/\s+/g, ' ').trim();
    const letters = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    let node;
    const visibleCopy = space(document.body.innerText + ' ' + [...document.querySelectorAll('option')].map(n => n.textContent).join(' '));
    for (const item of copy) if (!visibleCopy.includes(space(item.text))) errors.push(`${item.id}: texto exacto ausente`);
    if (key === 'process') {
      const icons = [...document.querySelectorAll('[data-client-icon]')];
      const expected = ['17728513', '1924454', '12808775', '942833'];
      if (icons.length !== expected.length || icons.some((n, i) => n.dataset.clientIcon !== expected[i] || !getComputedStyle(n).maskImage.includes(`/${expected[i]}.png`))) errors.push('FUNC-04–09: iconos exactos ausentes o sustituidos');
      if (document.querySelectorAll('.icon-credits a[href^="https://www.flaticon.es/iconos-gratis/"]').length !== 4) errors.push('FUNC-08: créditos de iconos incompletos');
    }
    if (key === 'solutions' && document.querySelectorAll('.integration-list article').length !== 5) errors.push('SOL-17–25: se requieren cinco integraciones');
    if (key === 'contact') {
      const select = document.querySelector('#company-size');
      const values = [...select?.querySelectorAll('option') || []].slice(1).map(n => n.value);
      if (JSON.stringify(values) !== JSON.stringify(['1-50','51-100','101-250','251-500','501-1000','1000-plus'])) errors.push('CONT-08–14: selector o seis opciones ausentes');
    }
    for (const item of format) {
      const scope = document.querySelector(item.scope);
      if (!scope) { errors.push(`${item.sourceBlock}: sección ausente ${item.scope}`); continue; }
      const candidates = [scope, ...scope.querySelectorAll('h1,h2,h3,p,span,strong,mark,label,option,a')]
        .filter(n => letters(n.textContent).includes(item.key))
        .sort((a, b) => a.textContent.length - b.textContent.length);
      const element = candidates[0];
      if (!element) { errors.push(`${item.sourceBlock}: falta ${item.text}`); continue; }
      const chars = [];
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while ((node = walker.nextNode())) {
        const parent = node.parentElement, style = getComputedStyle(parent), mark = parent.closest('mark');
        for (const c of letters(node.textContent)) chars.push({
          c, bold: Number(style.fontWeight) >= 600,
          green: ['rgb(141, 189, 47)', 'rgb(225, 254, 102)'].includes(style.color),
          marker: !!mark && getComputedStyle(mark).backgroundColor === 'rgb(225, 254, 102)' && style.color === 'rgb(22, 26, 35)',
        });
      }
      const start = chars.map(c => c.c).join('').indexOf(item.key);
      for (let i = 0; i < item.key.length; i++) {
        const have = chars[start + i];
        for (const flag of ['bold', 'green', 'marker']) {
          if (item[flag][i] === '1' && !have?.[flag]) {
            errors.push(`${item.sourceBlock}: falta ${flag} en “${item.text}”`);
            i = item.key.length; break;
          }
        }
      }
    }
    return errors;
  }, { copy: copyContract.filter(item => item.page === key), format: formatContract.filter(item => item.sourceBlock.startsWith(prefixes[key])), key });
}
