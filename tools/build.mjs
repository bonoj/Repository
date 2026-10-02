import {execFileSync} from "node:child_process";
import {mkdir,readFile,rm,writeFile} from "node:fs/promises";

const sha=process.env.GITHUB_SHA||execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim();
const run=process.env.GITHUB_RUN_NUMBER||"local";
const build=`${run} · ${sha}`;

await rm("dist",{recursive:true,force:true});
await mkdir("dist",{recursive:true});
const donor=await readFile("src/betwixt/world-lab.html","utf8");
const shell=await readFile("src/shell/repository-shell.js","utf8");
const executable=donor.replace("</body>",`<script>globalThis.__REPOSITORY_BUILD__=${JSON.stringify(build)};<\/script><script>${shell}<\/script></body>`);
await writeFile("dist/index.html",executable);
console.log(`Repository executable built from intact World Lab donor: ${build}`);
