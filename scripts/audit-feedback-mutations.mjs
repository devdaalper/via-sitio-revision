import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { inspectFeedback } from './feedback-contract.mjs';

// Mutations exist only in an isolated browser DOM. No source or served file is
// changed. Reload the clean page before every test to avoid compounded failures.
const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4322/';
const cases = [
  ['home', '', 'palabra omitida', '.human-copy', 'text', 'operativo', ''],
  ['home', '', 'coma omitida', '.human-copy', 'text', 'CVs,', 'CVs'],
  ['home', '', 'tilde perdida', '.human-copy', 'text', 'revisión', 'revision'],
  ['home', '', 'capitalización alterada', '#human-title .accent-text', 'text', 'V.IA', 'v.ia'],
  ['home', '', 'verde perdido en titular', '#human-title .accent-text', 'color', '', '#27414f'],
  ['home', '', 'negrita perdida', '.human-copy strong', 'fontWeight', '', '400'],
  ['home', '', 'marcador perdido', '#human-title mark', 'backgroundColor', '', 'transparent'],
  ['process', 'plataforma/', 'icono sustituido', '[data-client-icon="17728513"]', 'attribute', 'data-client-icon', '0'],
  ['process', 'plataforma/', 'archivo de icono sustituido', '[data-client-icon="17728513"]', 'maskImage', '', 'none'],
  ['process', 'plataforma/', 'crédito ausente', '.icon-credits a', 'remove'],
  ['solutions', 'soluciones/', 'integración omitida', '.integration-list article', 'remove'],
  ['contact', 'contacto/', 'selector omitido', '#company-size', 'remove'],
  ['contact', 'contacto/', 'opción omitida', '#company-size option[value="1000-plus"]', 'remove'],
];
const browser = await chromium.launch({headless:true,channel:'chrome'});
const results=[];
try {
  const page=await browser.newPage({reducedMotion:'reduce'});
  for(const [key,route,name,selector,operation,from,to] of cases) {
    await page.goto(new URL(route,base).href,{waitUntil:'domcontentloaded'});
    await page.evaluate(()=>document.fonts.ready);
    assert.deepEqual(await inspectFeedback(page,key),[],`Baseline ${name}`);
    await page.locator(selector).first().evaluate((element,{operation,from,to})=>{
      if(operation==='remove') return element.remove();
      if(operation==='attribute') return element.setAttribute(from,to);
      if(operation==='text') {
        const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
        let node;
        while((node=walker.nextNode())) if(node.textContent.includes(from)) {node.textContent=node.textContent.replace(from,to);return;}
        throw new Error(`Mutation target absent: ${from}`);
      }
      element.style[operation]=to;
    },{operation,from,to});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const errors=await inspectFeedback(page,key);
    assert(errors.length,`Undetected mutation: ${name}`);
    results.push({name,detected:true,errors});
  }
  console.log(JSON.stringify({mutations:results.length,results},null,2));
} finally {await browser.close();}
