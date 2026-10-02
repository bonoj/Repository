import {execFileSync} from "node:child_process";
import {mkdir,readFile,rm,writeFile} from "node:fs/promises";

const buildId=process.env.GITHUB_RUN_NUMBER||execFileSync("git",["rev-parse","--short=8","HEAD"],{encoding:"utf8"}).trim();

await rm("dist",{recursive:true,force:true});
await mkdir("dist",{recursive:true});
const donor=await readFile("src/betwixt/world-lab.html","utf8");
await writeFile("dist/index.html",donor);
console.log(`Repository executable built from intact World Lab donor: ${buildId}`);
