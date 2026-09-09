import assert from 'node:assert/strict';

const sourceChecked = new Set();
const expectedCounts = { home: 4, process: 2, solutions: 3, contact: 2, volume: 3, privacy: 2, terms: 2 };

export async function auditWaveSystem(page, key, label) {
  const results = await page.locator('.opening-backdrop, .wave-backdrop').evaluateAll(async (frames, checked) => {
    const pageCanvas = document.querySelector('.site-canvas');
    const pageRect = pageCanvas.getBoundingClientRect();
    const solidRects = [...document.querySelectorAll('.header-frame, .inset-panel, .human-panel, .site-ending, .legal-card, .form-wrap')]
      .filter(n => !['transparent', 'rgba(0, 0, 0, 0)'].includes(getComputedStyle(n).backgroundColor))
      .map(n => n.getBoundingClientRect());
    const pending = [];
    for (const frame of frames) {
      const svg = frame.querySelector('svg');
      const variant = svg.dataset.waveArt;
      const paths = [...svg.querySelectorAll('path')];
      const art = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
      const style = getComputedStyle(svg), frameStyle = getComputedStyle(frame);
      const bounds = frame.getBoundingClientRect();
      let clippedBy = null;
      for (let n = frame; n && n !== pageCanvas; n = n.parentElement) {
        const s = getComputedStyle(n);
        if (s.overflowX !== 'visible' || s.overflowY !== 'visible') {
          // The opening frame spans the entire page, so its clip is the page edge.
          if (n === frame && frame.classList.contains('opening-backdrop') && Math.abs(bounds.height - pageRect.height) < 1) continue;
          clippedBy = n.className; break;
        }
      }
      const points = paths.map(path => {
        const length = path.getTotalLength(), matrix = path.getScreenCTM(), count = Math.ceil(length / 6);
        return Array.from({ length: count + 1 }, (_, i) => path.getPointAtLength(length * i / count).matrixTransform(matrix));
      });
      const visible = p => p.x > 0 && p.x < innerWidth && p.y > pageRect.top && p.y < pageRect.bottom;
      const endings = points.flatMap(p => [p[0], p.at(-1)]).filter(visible);
      const exposed = points.flat().filter(p => visible(p) && !solidRects.some(r => p.x > r.left && p.x < r.right && p.y > r.top && p.y < r.bottom));
      let source;
      if (!checked.includes(variant) && !pending.some(p => p.variant === variant && p.source)) {
        const original = new Image();
        original.src = new URL(`assets/brand/wave-${variant}.png`, document.querySelector('link[rel="icon"]').href.replace(/assets\/brand\/favicon.svg$/, '')).href;
        await original.decode();
        const canvas = document.createElement('canvas');
        canvas.width = original.naturalWidth; canvas.height = original.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.drawImage(original, 0, 0);
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const inks = new Map();
        for (let i = 0; i < pixels.length; i += 4) if (pixels[i + 3] > 160) {
          const ink = `${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`; inks.set(ink, (inks.get(ink) || 0) + 1);
        }
        const vectorInks = paths.map(p => p.getAttribute('stroke').slice(4, -1));
        // Canvas alpha premultiplication rounds some recovered RGB channels by one level.
        const sourceCounts = vectorInks.map(ink => {
          const rgb = ink.split(',').map(Number);
          return [...inks].reduce((count, [k, n]) => k.split(',').every((c, j) => Math.abs(Number(c) - rgb[j]) <= 1) ? count + n : count, 0);
        });
        let samples = 0, nearInk = 0;
        for (const path of paths) {
          const rgb = path.getAttribute('stroke').slice(4, -1).split(',').map(Number), length = path.getTotalLength();
          for (let d = 0; d < length; d += 8) {
            const p = path.getPointAtLength(d); let found = false;
            for (let y = Math.round(p.y) - 4; y <= Math.round(p.y) + 4 && !found; y++) for (let x = Math.round(p.x) - 4; x <= Math.round(p.x) + 4; x++) {
              if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) continue;
              const i = (y * canvas.width + x) * 4;
              if (pixels[i + 3] > 32 && rgb.every((c, j) => Math.abs(pixels[i + j] - c) <= 1)) { found = true; break; }
            }
            samples++; if (found) nearInk++;
          }
        }
        source = { sourceCounts, uniqueInks: new Set(vectorInks).size, samples, nearInk, ratio: nearInk / samples };
      }
      pending.push({ variant, count: paths.length, clippedBy, endings: endings.map(p => ({x:p.x,y:p.y})), exposed: exposed.length,
        fixedStroke: paths.every(p => getComputedStyle(p).vectorEffect === 'non-scaling-stroke' && parseFloat(getComputedStyle(p).strokeWidth) === .9),
        ratioError: Math.abs(art.width / vb.width - art.height / vb.height), mask: style.maskImage,
        opacity: Number(style.opacity), pointerEvents: frameStyle.pointerEvents, backgroundPlane: frameStyle.zIndex, source });
    }
    return pending;
  }, [...sourceChecked]);
  assert.equal(results.length, expectedCounts[key], `Missing/duplicate wave compositions: ${label}`);
  for (const wave of results) {
    assert.equal(wave.count, wave.variant === 'a' ? 22 : 43, `Lost trajectories: ${label}`);
    assert.equal(wave.clippedBy, null, `Artwork clipped by an internal section: ${label}, ${wave.clippedBy}`);
    assert.equal(wave.endings.length, 0, `Visible endings: ${label} ${wave.variant} ${JSON.stringify(wave.endings)}`);
    assert(wave.exposed > 30, `No exposed background strokes: ${label} ${wave.variant}, ${wave.exposed}`);
    assert(wave.fixedStroke && wave.ratioError < .001, `Distorted shape or varying stroke width: ${label}`);
    assert.equal(wave.mask, 'none'); assert(wave.opacity >= .7);
    assert.equal(wave.pointerEvents, 'none'); assert.equal(wave.backgroundPlane, '-1');
    if (wave.source) {
      assert.equal(wave.source.uniqueInks, wave.count);
      assert(wave.source.sourceCounts.every(n => n > 500), `Ink absent from original: ${wave.variant}`);
      assert(wave.source.ratio > .97, `Geometry diverges from source: ${wave.variant} ${wave.source.ratio}`);
      sourceChecked.add(wave.variant);
      console.log(`Source ${wave.variant}: ${wave.count} inks, ${wave.source.nearInk}/${wave.source.samples} samples within 4px per axis of the original ink.`);
    }
  }
  assert.equal(await page.locator('.opening-backdrop').count(), 1);
  assert.equal(await page.locator('.site-ending-stage .wave-backdrop').count(), 1);
  assert.equal(await page.locator('.site-header .wave-art, .site-ending .wave-art, img[src*="wave-"]').count(), 0, 'No separate raster/internal wave layers');
  assert.equal(await page.locator('.site-header').evaluate(n => getComputedStyle(n).backgroundColor), 'rgba(0, 0, 0, 0)');
  const layout = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    extraBottom: document.documentElement.scrollHeight - Math.max(innerHeight, document.querySelector('.site-canvas').getBoundingClientRect().height),
    inset: [...document.querySelectorAll('.inset-panel, .site-ending')].every(n => { const r = n.getBoundingClientRect(); return r.left >= 15 && innerWidth - r.right >= 15; }),
  }));
  assert(!layout.overflow && layout.extraBottom < 2 && layout.inset, `Page canvas or panel bounds: ${label} ${JSON.stringify(layout)}`);
  return results.length;
}
