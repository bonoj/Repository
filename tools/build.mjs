import {build} from "esbuild";
import {execFileSync} from "node:child_process";
import {mkdir,readFile,rm,writeFile} from "node:fs/promises";

const buildId=process.env.GITHUB_RUN_NUMBER||execFileSync("git",["rev-parse","--short=8","HEAD"],{encoding:"utf8"}).trim();

await rm("dist",{recursive:true,force:true});
await mkdir("dist",{recursive:true});
await build({
  entryPoints:["src/betwixt/main.js"],
  bundle:true,
  minify:true,
  format:"esm",
  outfile:"dist/main.js",
  sourcemap:false,
  target:"es2022"
});
const shell=(await readFile("src/betwixt/shell.html","utf8")).replace("__BUILD__",String(buildId));
await writeFile("dist/index.html",shell);
console.log(`Repository executable built: ${buildId}`);
