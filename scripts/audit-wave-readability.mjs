import assert from 'node:assert/strict';

// This geometry check complements screenshots. It detects strokes entering
// small text; it does not rate the composition or replace visual review.
export async function inspectWaveReadability(page) {
  return page.evaluate(() => {
    const background = 'rgb(249, 249, 249)';
    const transparent = color => color === 'transparent' || color === 'rgba(0, 0, 0, 0)';
    const solids = [...document.querySelectorAll('.header-frame, main *, .site-ending')]
      .filter(n => !transparent(getComputedStyle(n).backgroundColor))
      .map(n => n.getBoundingClientRect());
    const rects = [];
    const halos = [];
    for (const element of document.querySelectorAll('main p,main h3,main a,main button')) {
      if (element.closest('.sr-only,[hidden]')) continue;
      const style = getComputedStyle(element);
      const label = element.textContent.trim().slice(0,85);
      if (parseFloat(style.webkitTextStrokeWidth) >= 3 && style.webkitTextStrokeColor === background && style.paintOrder.startsWith('stroke')) {
        halos.push(label); continue;
      }
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let text;
      while ((text = walker.nextNode())) {
        if (!text.textContent.trim()) continue;
        const range = document.createRange(); range.selectNodeContents(text);
        for (const rect of range.getClientRects()) {
          if (!rect.width || !rect.height) continue;
          if (solids.some(s => rect.left >= s.left && rect.right <= s.right && rect.top >= s.top && rect.bottom <= s.bottom)) continue;
          rects.push({ left: rect.left - 3, right: rect.right + 3, top: rect.top - 3, bottom: rect.bottom + 3, label });
        }
      }
    }
    const rows = new Map();
    for (const rect of rects) for (let row = Math.floor(rect.top / 64); row <= Math.floor(rect.bottom / 64); row++) {
      if (!rows.has(row)) rows.set(row, []);
      rows.get(row).push(rect);
    }
    const collisions = [];
    const intersects = (a, b, rect) => {
      let low = 0, high = 1;
      for (const [axis, min, max] of [['x', rect.left, rect.right], ['y', rect.top, rect.bottom]]) {
        const delta = b[axis] - a[axis];
        if (Math.abs(delta) < 1e-8) { if (a[axis] < min || a[axis] > max) return false; continue; }
        const first = (min - a[axis]) / delta, last = (max - a[axis]) / delta;
        low = Math.max(low, Math.min(first, last)); high = Math.min(high, Math.max(first, last));
        if (low > high) return false;
      }
      return true;
    };
    const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
    const distanceToSegment = (point, a, b) => {
      const dx = b.x - a.x, dy = b.y - a.y, squared = dx * dx + dy * dy;
      const t = squared ? Math.max(0, Math.min(1, ((point.x-a.x)*dx + (point.y-a.y)*dy) / squared)) : 0;
      return Math.hypot(point.x-a.x-t*dx, point.y-a.y-t*dy);
    };
    const flatten = (a, b, c, d, output, depth = 0) => {
      // The control points bound the cubic's deviation from its chord. Keep
      // both within .25 CSS px, including collinear overshoots of the segment.
      if (depth >= 14 || Math.max(distanceToSegment(b,a,d), distanceToSegment(c,a,d)) <= .25) {
        output.push(d); return;
      }
      const ab = midpoint(a,b), bc = midpoint(b,c), cd = midpoint(c,d);
      const abc = midpoint(ab,bc), bcd = midpoint(bc,cd), center = midpoint(abc,bcd);
      flatten(a,ab,abc,center,output,depth+1); flatten(center,bcd,cd,d,output,depth+1);
    };
    for (const svg of document.querySelectorAll('.opening-backdrop svg,.wave-backdrop svg')) {
      const hits = new Set();
      for (const path of svg.querySelectorAll('path')) {
        const rgb = path.getAttribute('stroke').match(/\d+/g).map(Number);
        if (rgb.every(channel => channel > 230)) continue;
        const matrix = path.getScreenCTM(), data = path.getAttribute('d');
        if (/[^MC\d\s.,+-]/.test(data)) throw new Error('Review readability parser for the new SVG commands');
        const values = data.match(/[-+]?(?:\d*\.)?\d+/g).map(Number);
        const point = index => ({ x: matrix.a * values[index] + matrix.c * values[index+1] + matrix.e, y: matrix.b * values[index] + matrix.d * values[index+1] + matrix.f });
        const points = [point(0)];
        for (let index = 2; index < values.length; index += 6) flatten(points.at(-1), point(index), point(index+2), point(index+4), points);
        for (let index = 1; index < points.length; index++) {
          const a = points[index-1], b = points[index];
          if (Math.max(a.x,b.x) < 0 || Math.min(a.x,b.x) > innerWidth) continue;
          for (let row = Math.floor(Math.min(a.y,b.y)/64); row <= Math.floor(Math.max(a.y,b.y)/64); row++) {
            for (const rect of rows.get(row) || []) if (intersects(a,b,rect)) hits.add(rect.label);
          }
        }
      }
      if (hits.size) collisions.push({ frame: svg.parentElement.className, anchor: svg.closest('section')?.id || svg.parentElement.parentElement.querySelector('section')?.getAttribute('aria-labelledby') || '', variant: svg.dataset.waveArt, text: [...hits] });
    }
    return { collisions, textLines: rects.length, halos };
  });
}

export async function auditWaveReadability(page, label) {
  const result = await inspectWaveReadability(page);
  assert.deepEqual(result.collisions, [], `Wave/small-text interference: ${label}`);
  return result;
}
