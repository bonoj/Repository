import {access,readFile} from "node:fs/promises";

await access("dist/index.html");
const html=await readFile("dist/index.html","utf8");
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
  "🔄",
  "RepositoryBetwixt",
  "betwixt-presence",
  "attachBetwixtMirror"
]){
  if(!html.includes(shellEvidence))throw new Error(`Repository shell evidence missing: ${shellEvidence}`);
}
const bridgeMark=html.indexOf("attachBetwixtMirror");
const donorRuntime=html.indexOf("window.vestibule={");
if(!(bridgeMark>donorRuntime))throw new Error("Repository ECS mirror must attach after donor runtime");
if(!html.includes('addEventListener("load",()=>attachBetwixtMirror()'))throw new Error("Repository ECS mirror lacks post-donor attachment");
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
  "⚪️",
  "🛠",
  "⬆️",
  "⬇️"
]){
  if(!html.includes(boundaryEvidence))throw new Error(`Betwixt content-boundary evidence missing: ${boundaryEvidence}`);
}
if(/scene\.add\((orbitRoot|g|mesh)\)/.test(html))throw new Error("Organism-owned dynamic content escaped betwixtContent");
console.log("Intact Betwixt donor with shell, content boundary, and read-only Repository ECS mirror verified.");
