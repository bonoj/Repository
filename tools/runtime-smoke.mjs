import {spawn} from "node:child_process";
import {createServer} from "node:http";
import {readFile,stat} from "node:fs/promises";
import {extname,join,normalize} from "node:path";

const root=normalize(join(process.cwd(),"dist"));
const types={".html":"text/html",".js":"text/javascript",".mjs":"text/javascript",".json":"application/json"};
const server=createServer(async(req,res)=>{
  try{
    const path=normalize(join(root,decodeURIComponent((req.url||"/").split("?")[0]==="/"?"/index.html":(req.url||"").split("?")[0])));
    if(!path.startsWith(root)){res.writeHead(403).end();return}
    const info=await stat(path);if(!info.isFile())throw new Error("not file");
    res.writeHead(200,{"content-type":types[extname(path)]||"application/octet-stream","cache-control":"no-store"});res.end(await readFile(path));
  }catch{res.writeHead(404).end("not found")}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const port=server.address().port,url=`http://127.0.0.1:${port}/`;
let browser;
try{
  const {chromium}=await import("playwright");
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const failures=[];
  page.on("pageerror",e=>failures.push("pageerror: "+e.message));
  page.on("console",m=>{if(m.type()==="error")failures.push("console.error: "+m.text())});
  await page.goto(url,{waitUntil:"load",timeout:15000});
  await page.waitForFunction(()=>globalThis.vestibuleReady===true&&globalThis.vestibule?.presences?.length>0,{timeout:12000});
  const first=await page.evaluate(()=>({ready:globalThis.vestibuleReady===true,presences:globalThis.vestibule?.presences?.length||0,build:document.body.dataset.repositoryBuild||null}));
  await page.waitForTimeout(1200);
  const second=await page.evaluate(()=>({ready:globalThis.vestibuleReady===true,presences:globalThis.vestibule?.presences?.length||0,build:document.body.dataset.repositoryBuild||null}));
  if(!first.ready||!second.ready)failures.push("runtime did not remain ready");
  if(first.presences<1||second.presences<1)failures.push("runtime exposed no presences");
  if(!first.build||first.build!==second.build)failures.push("repository build identity missing or unstable");

  // Beyond is an experimental failure boundary. T7 is born complete from geological history:
  // continuous strata, no terrain jurisdictions, and no behavior window or Four Brothers.
  await page.evaluate(()=>globalThis.RepositoryShell?.button?.("beyond-place")?.click());
  await page.waitForFunction(()=>globalThis.BeyondTerrain?.inspect?.()?.kind==="beyond-geological-history-t7",{timeout:8000});
  await page.waitForTimeout(1200);
  const beyond=await page.evaluate(()=>globalThis.BeyondTerrain?.inspect?.());
  if(!beyond||beyond.size<80||beyond.resolution<100||beyond.strata<5||beyond.jurisdictions!==0)failures.push("Beyond geological topology T7 did not survive startup: "+JSON.stringify(beyond));

  if(failures.length)throw new Error(failures.join("\n"));
  console.log("Betwixt runtime smoke passed:",second);
}finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
