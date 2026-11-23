// Browser-level Winston Command checks against the actual Firebase Hosting entrypoint.
// Run in CI: node tests/browser-smoke.cjs
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../public');
const output = path.resolve(__dirname, '../artifacts/browser');
fs.mkdirSync(output, { recursive: true });
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
const server = http.createServer((req,res)=>{
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file = path.resolve(root, '.'+pathname);
  if(!file.startsWith(root+path.sep) && file!==root){res.writeHead(403).end();return;}
  const target = fs.existsSync(file) && fs.statSync(file).isFile()?file:path.join(root,'index.html');
  res.writeHead(200,{'content-type':mime[path.extname(target)]||'application/octet-stream'});
  fs.createReadStream(target).pipe(res);
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
  const issues=[];
  page.on('pageerror',err=>issues.push(err.message));
  try{
    await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'domcontentloaded'});
    await page.screenshot({path:path.join(output,'01-login.png'),animations:'disabled',timeout:20000});
    assert.match(await page.title(),/Winston Command/);
    assert.equal(await page.locator('#authOverlay').count(),1);
    assert.equal(await page.locator('#networkStage').count(),1);
    // Reveal existing app markup for a visual inspection without inventing
    // or simulating authenticated market/account data.
    await page.evaluate(()=>{
      document.getElementById('loadingOverlay')?.classList.add('hide');
      document.getElementById('authOverlay')?.classList.remove('show');
      const root=document.getElementById('appRoot');
      if(root)root.style.display='block';
    });
    await page.screenshot({path:path.join(output,'02-command-room-unauthenticated-layout.png'),animations:'disabled',timeout:20000});
    const layers=await page.evaluate(()=>{
      const stage=document.querySelector('#networkStage');
      const holo=stage?.querySelector('.winston-hologram');
      const globe=stage?.querySelector('.winston-hologram-globe');
      return {stage:!!stage,hologram:!!holo,globe:!!globe,
        pointerEvents:holo?getComputedStyle(holo).pointerEvents:null,
        globeSize:globe?Math.round(globe.getBoundingClientRect().width):0};
    });
    assert.equal(layers.stage,true);
    assert.equal(layers.hologram,true);
    assert.equal(layers.globe,true);
    assert.equal(layers.pointerEvents,'none');
    assert.ok(layers.globeSize>100,'hologram has a visible size');
    fs.writeFileSync(path.join(output,'report.json'),JSON.stringify({
      title:await page.title(),layers,pageErrors:issues,
      note:'Unauthenticated layout screenshot is not a live trading/account test.'
    },null,2));
    console.log('Browser layout validation passed:',layers);
    if(issues.length)console.warn('Browser page errors (possibly Firebase/network configuration):',issues);
  }finally{
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(err=>{console.error(err);process.exitCode=1;});
