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
console.log("Intact World Lab executable verified.");
