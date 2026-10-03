import {access,readFile} from "node:fs/promises";

await access("dist/index.html");
await access("dist/crucible/index.html");
const html=await readFile("dist/index.html","utf8");
const crucible=await readFile("dist/crucible/index.html","utf8");
const shellSource=await readFile("src/shell/repository-shell.js","utf8");
for(const evidence of [
  '__CRUCIBLE_BUILD__="d1c5e437197e72b16624c0b7104c6e9d9cbb0d0f"',
  "<title>Crucible</title>",
  "createImpactSystem()",
  "createShallowWaterSystem",
  "createBearingSystem"
]){
  if(!crucible.includes(evidence))throw new Error(`Intact Crucible cargo evidence missing: ${evidence}`);
}
if(crucible.length<1900000)throw new Error("Crucible cargo unexpectedly truncated");
for(const evidence of [
  "WORLD LAB",
  "ENTER LAB",
  "github.com",
  "pageshow",
  "pagehide",
  "JupurnSystem",
  "createJupurnRingField",
  "count:1600",
  "JupurnIdentity",
  "jupurnHitShell",
  "RingSlot,{position:new THREE.Vector3(0,5.6,0)}",
  "if(slot==='jupurn')return jupurnEntity"
]){
  if(!html.includes(evidence))throw new Error(`World Lab donor evidence missing: ${evidence}`);
}
if(html.length<80000)throw new Error("World Lab donor unexpectedly truncated");
const body=html.indexOf("<body");
const donorMark=html.indexOf('<div id="mark">');
const shellMark=html.indexOf("__REPOSITORY_BUILD__");
if(!(body>=0&&shellMark>body&&shellMark<donorMark))throw new Error("Repository shell does not precede donor runtime");
for(const shellEvidence of [
  "__REPOSITORY_SHA__",
  "__REPOSITORY_BUILD__",
  "data-repository-build",
  "data-repository-sha",
  "RepositoryShell",
  "repository-status",
  "repository-devtools",
  "🌀",
  "BETWIXT",
  "🛠",
  "RepositoryBetwixt",
  "betwixt-presence",
  "attachBetwixtMirror"
]){
  if(!html.includes(shellEvidence))throw new Error(`Repository shell evidence missing: ${shellEvidence}`);
}
if(!shellSource.includes("temporary:[]")||!shellSource.includes('{id:"workshop",text:"🛠"')||!shellSource.includes('{id:"refresh",text:"🔄"'))throw new Error("Shell must manifest Workshop and Refresh");
for(const retiredId of ['id:"spin"','id:"marble"','id:"crucible"','id:"arcball"','id:"fluid-globes"','id:"crayon"','id:"lift"']){
  if(shellSource.includes(retiredId))throw new Error(`Retired spell still manifests in shell: ${retiredId}`);
}
if(!shellSource.includes("enterWorkshopOnReady"))throw new Error("Betwixt must begin in Workshop");
const bridgeMark=html.indexOf("attachBetwixtMirror");
const donorRuntime=html.indexOf("window.vestibule={");
if(!(bridgeMark>donorRuntime))throw new Error("Repository ECS mirror must attach after donor runtime");
if(!html.includes('addEventListener("vestibule-ready",attachMirrorWhenReady'))throw new Error("Repository ECS mirror lacks donor-readiness attachment");
if(html.includes("{radius:4.45,size:0.20,rate:0.08,phase:3.45}"))throw new Error("Ganymede must remain absent from Betwixt");
if(html.includes('id="labName"')||html.includes("getElementById(\'labName\')"))throw new Error("Per-lab Betwixt signage must remain retired");
for(const boundaryEvidence of [
  "const betwixtContent=new THREE.Group()",
  "betwixtContent.add(g)",
  "betwixtContent.add(jupurn)",
  "betwixtContent.add(orbitRoot)",
  "betwixtContent.add(mesh)",
  "contentWorkshopHidden",
  "toggleContentWorkshopHidden",
  "🛠"
]){
  if(!html.includes(boundaryEvidence))throw new Error(`Betwixt content-boundary evidence missing: ${boundaryEvidence}`);
}
if(/scene\.add\((orbitRoot|g|mesh)\)/.test(html))throw new Error("Organism-owned dynamic content escaped betwixtContent");
console.log("Intact Betwixt donor and intact Crucible cargo verified.");


const chemlab=await import("../src/betwixt/chemlab-geometry.mjs");
if(!chemlab.geometryRegressionHealthy){
  throw new Error("CHEMLAB geometry regression failed in CI: "+JSON.stringify(chemlab.geometryRegressionReport.filter(r=>!r.matchedExpectation)));
}
for(const result of chemlab.geometryRegressionReport){
  if(!result.actualPass)throw new Error("CHEMLAB accepted fixture failed in CI: "+JSON.stringify(result));
}
console.log("CHEMLAB projected geometry verified:",chemlab.geometryRegressionReport.map(r=>r.name).join(", "));


const chemlabSource=await readFile("src/betwixt/chemlab-geometry.mjs","utf8");
const chemlabStart=chemlabSource.indexOf("const RelationalBuild=Object.freeze");
const chemlabEnd=chemlabSource.indexOf("\nexport {RelationalBuild");
const browserStart=html.indexOf("const RelationalBuild=Object.freeze");
const browserEnd=html.indexOf("const workshopTabletopBetwixtable",browserStart);
if(chemlabStart<0||chemlabEnd<0||browserStart<0||browserEnd<0)throw new Error("CHEMLAB verifier source boundary missing");
const normalizeChemlab=s=>s
  .replace(/console\.info\('CHEMLAB geometry regression'[\s\S]*?if\(!geometryRegressionHealthy\)throw new Error\('CHEMLAB geometry regression expectation mismatch'\);/, `if(!geometryRegressionHealthy){
  const failures=geometryRegressionReport.filter(r=>!r.matchedExpectation);
  throw new Error('CHEMLAB geometry regression expectation mismatch '+JSON.stringify(failures));
}`)
  .trim();
if(normalizeChemlab(html.slice(browserStart,browserEnd))!==chemlabSource.slice(chemlabStart,chemlabEnd).trim()){
  throw new Error("Browser CHEMLAB geometry source drifted from CI verifier");
}
console.log("Browser and CI CHEMLAB geometry source agree.");

// Parse every executable inline script from the source shell before the browser ever sees it.
// Classic scripts are checked as functions; module scripts are checked by esbuild so imports
// and top-level module syntax remain legal. text/plain semantics and importmaps are data, not JS.
const sourceHtml=await readFile("src/betwixt/world-lab.html","utf8");
const scriptPattern=/<script([^>]*)>([\s\S]*?)<\/script>/gi;
let scriptMatch,scriptIndex=0,checkedScripts=0;
while((scriptMatch=scriptPattern.exec(sourceHtml))){
  const attrs=scriptMatch[1]||"",source=scriptMatch[2];
  const type=(attrs.match(/\btype\s*=\s*["']([^"']+)["']/i)||[])[1]?.toLowerCase()||"text/javascript";
  if(type==="text/plain"||type==="importmap"||type==="application/json"){scriptIndex++;continue;}
  if(type==="module"){
    const {transform}=await import("esbuild");
    try{await transform(source,{loader:"js",format:"esm",sourcefile:`world-lab.inline-${scriptIndex}.mjs`});}
    catch(error){throw new Error(`World Lab module script ${scriptIndex} does not parse:\n${error.message}`);}
  }else{
    try{new Function(source);}
    catch(error){throw new Error(`World Lab classic script ${scriptIndex} does not parse: ${error.message}`);}
  }
  checkedScripts++;scriptIndex++;
}
if(!checkedScripts)throw new Error("World Lab syntax gate found no executable inline scripts");
console.log(`World Lab inline syntax verified: ${checkedScripts} executable scripts.`);

