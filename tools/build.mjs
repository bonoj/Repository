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
const factionWar=await readFile("src/betwixt/faction-war.js","utf8");
const functionalTerrainV0=await readFile("src/betwixt/functional-terrain-v0.js","utf8");
const shallowWater=await readFile("src/cargo/crucible/source/src/runtime/shallow-water-system.js","utf8");
const bearingSystem=await readFile("src/cargo/crucible/source/src/runtime/bearing-system.js","utf8");
const meteorSystem=await readFile("src/cargo/crucible/source/src/runtime/meteor-system.js","utf8");
const terrainSystem=await readFile("src/fundamentals/terrain/terrain-system.js","utf8");
const terrainGenesis=await readFile("src/cargo/crucible/source/src/runtime/terrain-genesis.js","utf8");
const terrainRecipeGenerator=await readFile("src/cargo/crucible/source/src/runtime/terrain-recipe-generator.js","utf8");
const transportSystem=await readFile("src/cargo/crucible/source/src/runtime/transport-system.js","utf8");
const ecsInline=ecs.replace("export function createWorld","function createWorld");
const mirrorInline=mirror
  .replace('import {createWorld} from "../core/ecs.js";',"")
  .replace("export function attachBetwixtMirror","function attachBetwixtMirror");
const factionWarInline=factionWar.replace("export function createFactionWarSystem","function createFactionWarSystem");
const functionalTerrainV0Inline=functionalTerrainV0.replace("export function createFunctionalTerrainV0","function createFunctionalTerrainV0");
const shallowWaterInline=shallowWater.replace("export function createShallowWaterSystem","function createShallowWaterSystem");
const terrainInline=terrainSystem
  .replace("export function createTerrainSystem","function createTerrainSystem")
  // Workshop supplies an ownership group; the transported terrain remains otherwise intact.
  .replace("scene.add(mesh);","(globalThis.__workshopTerrainOwner||scene).add(mesh);")
  .replace("scene.add(apparatus);","(globalThis.__workshopTerrainOwner||scene).add(apparatus);");
const terrainRecipeGeneratorInline=terrainRecipeGenerator.replace("export function createTerrainRecipeGenerator","function createTerrainRecipeGenerator");
const terrainGenesisInline=terrainGenesis.replace('import {createTerrainRecipeGenerator} from "./terrain-recipe-generator.js";', "").replace("export function createTerrainGenesis","function createTerrainGenesis");
const meteorInline=meteorSystem.replace("export function createMeteorSystem","function createMeteorSystem");
const bearingInline=bearingSystem
  .replace("export function createBearingSystem","function createBearingSystem")
  .replace("scene.add(mesh);","(globalThis.__workshopBearingOwner||scene).add(mesh);");
// Water transport boundary: preserve the earned organism as source evidence even
// while Betwixt only executes the shallow-water module directly.
for(const [name,source,evidence] of [
  ["bearing-system",bearingSystem,["liquid?.surfaceY?.","liquid.flowInto?."]],
  ["terrain-system",terrainSystem,["materialBoundary","groundHeightExact"]],
  ["transport-system",transportSystem,["supportHeight"]]
])for(const token of evidence)if(!source.includes(token))throw new Error(`Crucible water dependency evidence missing from ${name}: ${token}`);
const crucibleMain=await readFile("src/cargo/crucible/source/src/main.js","utf8");
for(const token of [
  'kind:"lava"',
  'initialViscosity:26',
  'depthAccents:true',
  'deepColor:0x260300',
  'hotColor:0xff9a24',
  'liquids:[transport,lavaTransport]',
  'steamGroup.name="water-lava-steam"',
  'function updateSteam(dt)',
  'function updateLavaPops()',
  'lavaTransport.update(simNow)'
])if(!crucibleMain.includes(token))throw new Error(`Crucible lava organism evidence missing: ${token}`);
const bridge=`<script>${shallowWaterInline}\n${terrainInline}\n${terrainRecipeGeneratorInline}\n${terrainGenesisInline}\n${meteorInline}\n${bearingInline}\n${ecsInline}\n${mirrorInline}\n(function attachMirrorWhenReady(){if(globalThis.vestibuleReady&&globalThis.vestibule?.presences?.length){attachBetwixtMirror();return}addEventListener("vestibule-ready",attachMirrorWhenReady,{once:true})})();<\/script>`;
const injection=`<script>globalThis.__REPOSITORY_SHA__=${JSON.stringify(sha)};globalThis.__REPOSITORY_BUILD__=${JSON.stringify(build)};<\/script><script>${shell}<\/script>`;
const executable=donor.replace("<body>",`<body data-repository-build="${build}" data-repository-sha="${sha}">${injection}`).replace("</body>",`${bridge}</body>`);
if(executable===donor)throw new Error("Repository shell injection point missing");
await writeFile("dist/index.html",executable);
await copyFile("vendor/crucible/dist/index.html","dist/crucible/index.html");
console.log(`Repository executable built from intact World Lab donor with intact Crucible cargo: ${build}`);
