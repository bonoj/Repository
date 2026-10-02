import {build} from "esbuild";
import {mkdir,readFile,rm,writeFile} from "node:fs/promises";

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
await writeFile("dist/index.html",await readFile("src/betwixt/shell.html","utf8"));
console.log("Repository executable built.");
