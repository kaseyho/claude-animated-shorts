import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts')});
const chromiumOptions={gl:'angle'};
const browser=await openBrowser('chrome',{chromiumOptions});
const frames=process.argv.slice(2).map(Number);
const outputDir=process.env.STILLS_DIR || 'out/data-centres';
const scale=Number(process.env.STILLS_SCALE || .5);
if (!Number.isFinite(scale) || scale <= 0 || frames.some(frame => !Number.isInteger(frame) || frame < 0)) {
  await browser.close({silent:true}); fs.rmSync(serveUrl,{recursive:true,force:true});
  throw new Error('Frames must be non-negative integers; STILLS_SCALE must be positive.');
}
fs.mkdirSync(outputDir,{recursive:true});
const comp=await selectComposition({serveUrl,id:process.env.COMPOSITION_ID || 'DataCentresNatural',puppeteerInstance:browser,chromiumOptions});
try {
 for(const frame of frames.length?frames:[90,290,450,650,850,1040,1200,1400,1650,1850]){
 await renderStill({serveUrl,composition:comp,frame,output:path.join(outputDir,`frame-${frame}.png`),scale,puppeteerInstance:browser,chromiumOptions,onBrowserLog:log=>{if(log.type==='error') console.error(log.text)}});
 console.log('Rendered',frame);
 }
} finally {await browser.close({silent:true});fs.rmSync(serveUrl,{recursive:true,force:true});}
