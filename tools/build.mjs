import {execFileSync} from "node:child_process";
import {copyFile,mkdir,readFile,rm,writeFile} from "node:fs/promises";

const sha=execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim();
const build=sha.slice(0,8);

await rm("dist",{recursive:true,force:true});
await mkdir("dist",{recursive:true});
await mkdir("dist/crucible",{recursive:true});
const donor=await readFile("src/betwixt/world-lab.html","utf8");
const shell=await readFile("src/shell/repository-shell.js","utf8");
const ecs=await readFile("src/core/ecs.js","utf8");
const mirror=await readFile("src/betwixt/mirror.js","utf8");
const ecsInline=ecs.replace("export function createWorld","function createWorld");
const mirrorInline=mirror
  .replace('import {createWorld} from "../core/ecs.js";',"")
  .replace("export function attachBetwixtMirror","function attachBetwixtMirror");
const bridge=`<script>${ecsInline}\n${mirrorInline}\naddEventListener("load",()=>attachBetwixtMirror(),{once:true});<\/script>`;
const injection=`<script>globalThis.__REPOSITORY_SHA__=${JSON.stringify(sha)};globalThis.__REPOSITORY_BUILD__=${JSON.stringify(build)};<\/script><script>${shell}<\/script>`;
const executable=donor.replace("<body>",`<body data-repository-build="${build}" data-repository-sha="${sha}">${injection}`).replace("</body>",`${bridge}</body>`);
if(executable===donor)throw new Error("Repository shell injection point missing");
await writeFile("dist/index.html",executable);
await copyFile("vendor/crucible/dist/index.html","dist/crucible/index.html");
console.log(`Repository executable built from intact World Lab donor with intact Crucible cargo: ${build}`);
