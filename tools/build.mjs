import {execFileSync} from "node:child_process";
import {mkdir,readFile,rm,writeFile} from "node:fs/promises";

const sha=execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim();
const build=sha.slice(0,8);

await rm("dist",{recursive:true,force:true});
await mkdir("dist",{recursive:true});
const donor=await readFile("src/betwixt/world-lab.html","utf8");
const shell=await readFile("src/shell/repository-shell.js","utf8");
const injection=`<script>globalThis.__REPOSITORY_SHA__=${JSON.stringify(sha)};globalThis.__REPOSITORY_BUILD__=${JSON.stringify(build)};<\/script><script>${shell}<\/script>`;
const executable=donor.replace("<body>",`<body data-repository-build="${build}" data-repository-sha="${sha}">${injection}`);
if(executable===donor)throw new Error("Repository shell injection point missing");
await writeFile("dist/index.html",executable);
console.log(`Repository executable built from intact World Lab donor: ${build}`);
