import {access,readFile} from "node:fs/promises";

await access("dist/index.html");
const html=await readFile("dist/index.html","utf8");
for(const evidence of [
  "WORLD LAB",
  "ENTER LAB",
  "github.com",
  "pageshow",
  "pagehide"
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
  "🔄"
]){
  if(!html.includes(shellEvidence))throw new Error(`Repository shell evidence missing: ${shellEvidence}`);
}
console.log("Intact World Lab executable with Betwixt shell verified.");
