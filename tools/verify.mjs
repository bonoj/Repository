import {access,readFile} from "node:fs/promises";

await access("dist/index.html");
await access("dist/main.js");
const html=await readFile("dist/index.html","utf8");
const js=await readFile("dist/main.js","utf8");
if(!html.includes("./main.js"))throw new Error("shell does not load executable");
if(!js.includes("__repository"))throw new Error("bundle missing Repository evidence handle");
console.log("Repository bones verified.");
