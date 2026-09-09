import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { emphasis, missingEmphasis } from './feedback-emphasis.mjs';
import { auditWaveSystem } from './audit-opening.mjs';
import { inspectFeedback } from './feedback-contract.mjs';
import { auditWaveReadability } from './audit-wave-readability.mjs';
const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4322/';
const routes = {home:'',process:'plataforma/',solutions:'soluciones/',contact:'contacto/',volume:'reclutamiento-masivo/',privacy:'privacidad/',terms:'terminos/'};
const files = {home:'index',process:'plataforma',solutions:'soluciones',contact:'contacto'};
const sources = Object.fromEntries(Object.entries(files).map(([key,file])=>[key,readFileSync(new URL(`../src/pages/${file}.astro`,import.meta.url),'utf8')]));
assert.equal(missingEmphasis(sources).length,0);
// Both SVG derivatives are checked against these unmodified original PNGs.
for (const [variant, original] of [['a','Ejemplo curvas.png'],['b','Ejemplo urvas 2.png']]) {
 assert.deepEqual(
  readFileSync(new URL(`../public/assets/brand/wave-${variant}.png`,import.meta.url)),
  readFileSync(new URL(`../../Documentación de referencia v-ia/Identidad visual V.IA - equipo de diseño - 2026-08-20/${original}`,import.meta.url)),
  `Wave ${variant} differs from the official artwork`
 );
}
let mutations=0;
for(const [key,phrases] of Object.entries(emphasis)) for(const phrase of phrases){
 const changed={...sources,[key]:sources[key].replace(`<strong>${phrase}</strong>`,phrase)};
 assert(missingEmphasis(changed).some(x=>x.includes(phrase))); mutations++;
}
const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL || 'chrome'});
const profiles = [
 {name:'phone-320',width:320,height:568,dpr:2,touch:true,mobile:true},
 {name:'android-360',width:360,height:800,dpr:3,touch:true,mobile:true},
 {name:'iphone-390',width:390,height:844,dpr:3,touch:true,mobile:true},
 {name:'android-412',width:412,height:915,dpr:3,touch:true,mobile:true},
 {name:'small-landscape',width:680,height:390,dpr:2,touch:true,mobile:true},
 {name:'tablet-portrait',width:768,height:1024,dpr:2,touch:true},
 {name:'tablet-air',width:820,height:1180,dpr:2,touch:true},
 {name:'phone-landscape',width:844,height:390,dpr:3,touch:true,mobile:true},
 {name:'tablet-landscape',width:1024,height:768,dpr:2,touch:true},
 {name:'window-1240',width:1240,height:900,dpr:1},
 {name:'laptop-1280',width:1280,height:800,dpr:1},
 {name:'desktop-1440',width:1440,height:900,dpr:1},
 {name:'desktop-1920',width:1920,height:1080,dpr:1},
 {name:'wide-2560',width:2560,height:1440,dpr:1},
];
const shots=process.env.AUDIT_SCREENSHOTS ? resolve(process.env.AUDIT_SCREENSHOTS) : null;
if(shots)mkdirSync(shots,{recursive:true});
let page;
const snapshots=[];
const runtimeErrors=[];
let pages=0;
let waveFrames=0;
try {
 for(const profile of profiles) {
  const {width,height,dpr,touch,mobile}=profile;
  page=await browser.newPage({viewport:{width,height},deviceScaleFactor:dpr,hasTouch:!!touch,isMobile:!!mobile,reducedMotion:'reduce'});
  page.on('pageerror',error=>runtimeErrors.push(`${profile.name}: ${error.message}`));
  page.setDefaultTimeout(15000);page.setDefaultNavigationTimeout(20000);
  for(const [key,route] of Object.entries(routes)) {
   await page.goto(new URL(route,base).href,{waitUntil:'domcontentloaded'});
   await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   assert.deepEqual(await inspectFeedback(page,key),[],`AJUSTES copy and native format: ${key} ${profile.name}`);
   // Request lazy images before full-page captures; decode alone can wait forever below the fold.
   await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>{
    image.loading='eager';return image.decode();
   })));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${route} ${width}`);
   for(const phrase of emphasis[key] ?? []) {
    const bold=await page.locator('strong').evaluateAll((nodes,text)=>nodes.some(n=>n.textContent.trim()===text && Number(getComputedStyle(n).fontWeight)>=600),phrase);
    assert(bold,`Missing rendered bold: ${phrase}`);
   }
   const invalidColors=await page.locator('main .accent-text,main mark,.closing-section .accent-text,.closing-section mark').evaluateAll(nodes=>nodes.filter(n=>{
    const style=getComputedStyle(n);return n.matches('mark') ? style.color!=='rgb(22, 26, 35)' || style.backgroundColor!=='rgb(225, 254, 102)' : style.color!=='rgb(141, 189, 47)';
   }).map(n=>n.textContent));
   assert.deepEqual(invalidColors,[],`Invalid emphasis colors ${route} ${width}`);
   if(key==='solutions') assert.equal(await page.locator('.integration-list article').count(),5);
   waveFrames += await auditWaveSystem(page,key,`${key} ${profile.name}`);
   await auditWaveReadability(page,`${key} ${profile.name}`);
   if(key==='contact') {
    assert.deepEqual(await page.locator('#company-size option').evaluateAll(nodes=>nodes.slice(1).map(n=>n.value)),['1-50','51-100','101-250','251-500','501-1000','1000-plus']);
    assert(await page.locator('#company-size').isDisabled());
   }
   const clippedText=await page.locator('main h1, main h2, main h3, main p, .closing-section h2, .close-band h2').evaluateAll(nodes=>nodes.filter(n=>{
    if(n.closest('.sr-only,[hidden]')) return false;
    const r=n.getBoundingClientRect();return n.scrollWidth>n.clientWidth+2 || r.left < -1 || r.right > innerWidth+1;
   }).map(n=>n.textContent.trim().slice(0,90)));
   assert.deepEqual(clippedText,[],`Text overflow ${key} ${profile.name}`);
   if(shots){
    const image=`${key}--${profile.name}--top.png`;
    await page.screenshot({path:resolve(shots,image)});
    snapshots.push({key,profile:profile.name,width,height,dpr,zone:'top',image});
    if(['iphone-390','desktop-1440'].includes(profile.name)){
      const full=`${key}--${profile.name}--full.png`;
      await page.screenshot({path:resolve(shots,full),fullPage:true,scale:'css'});
      snapshots.push({key,profile:profile.name,width,height,dpr:1,zone:'full',image:full});
    }
   }
   await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
   await page.waitForFunction(()=>document.querySelector('.site-header').hasAttribute('data-condensed'));
   assert(Math.abs((await page.locator('.site-header').boundingBox()).y)<1,`Sticky header ${key} ${profile.name}`);
   if(shots){const image=`${key}--${profile.name}--footer.png`;await page.screenshot({path:resolve(shots,image)});snapshots.push({key,profile:profile.name,width,height,dpr,zone:'footer',image});}
   const toggle=page.locator('.menu-toggle');
   if(await toggle.isVisible()) {await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');}
   pages++;
  }
  console.log(`${profile.name}: 7 routes passed`);
  await page.close();
 }
 assert.deepEqual(runtimeErrors,[],'Runtime browser errors');
 if(shots)writeFileSync(resolve(shots,'manifest.json'),JSON.stringify(snapshots,null,2));
 page=await browser.newPage();
 await page.setViewportSize({width:390,height:844});
 await page.goto(base,{waitUntil:'domcontentloaded'});
 const motion=page.locator('[data-ambient-video]');
 await motion.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>!document.querySelector('[data-ambient-video] video').paused);
 await motion.getByRole('button',{name:'Pausar video'}).click();
 await page.waitForTimeout(300);
 assert(await motion.locator('video').evaluate(v=>v.paused));
 await page.evaluate(()=>scrollTo(0,0));await motion.scrollIntoViewIfNeeded();await page.waitForTimeout(300);
 assert(await motion.locator('video').evaluate(v=>v.paused),'User pause persists');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.waitForTimeout(200);
 assert(await motion.locator('video').evaluate(v=>v.paused&&v.hidden));
 assert(await motion.locator('.motion-poster').isVisible());
 await motion.getByRole('button',{name:'Reproducir video'}).click();
 await page.waitForFunction(()=>!document.querySelector('[data-ambient-video] video').paused);
 await page.reload({waitUntil:'domcontentloaded'});await motion.scrollIntoViewIfNeeded();await page.waitForTimeout(300);
 assert(await motion.locator('video').evaluate(v=>v.paused&&v.hidden),'Reduced motion initial load');
 const toggle=page.locator('.menu-toggle');await toggle.click();await page.keyboard.press('Escape');
 assert.equal(await toggle.getAttribute('aria-expanded'),'false');
 console.log(JSON.stringify({pages,deviceProfiles:profiles.length,boldMutationsDetected:mutations,waveFrames,
  runtimeErrors,screenshots:snapshots.length,
  waves:'Two original SVG derivatives, fixed fine strokes, shared page canvas, no internal clipping/endpoints, visible panel margins and preserved sticky navigation; legibility requires visual review',
  video:'pause, persistence, reduced motion, manual override passed',menuEscape:'passed'},null,2));
} finally {await browser.close();}
