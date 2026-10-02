import assert from "node:assert/strict";
import {deriveTerrainSpatialEvidence} from "../src/runtime/terrain-spatial-evidence.js";

const ring=(centerHeight,outerHeights)=>{
  const radius=4,center=[0,8,0],samples=[{x:0,z:0,height:centerHeight}];
  outerHeights.forEach((height,i)=>{const a=i/outerHeights.length*Math.PI*2;samples.push({x:Math.cos(a)*radius,z:Math.sin(a)*radius,height})});
  return{footprint:{center,radius},measurement:{terrainProfile:{samples}}};
};
const flat=deriveTerrainSpatialEvidence(ring(.15,Array(12).fill(.15)));
assert.equal(flat.relief.range,0);assert.equal(flat.relief.roughness,0);assert.equal(flat.centerRelativeToEdge,0);

const depression=deriveTerrainSpatialEvidence(ring(-.85,Array(12).fill(.15)));
assert.ok(depression.relief.range>.9);assert.ok(depression.centerRelativeToEdge<-.9);
assert.equal(depression.strongestDeviation.x,0);assert.equal(depression.strongestDeviation.z,0);

const rise=deriveTerrainSpatialEvidence(ring(1.15,Array(12).fill(.15)));
assert.ok(rise.centerRelativeToEdge>.9);

const asymmetric=ring(.15,Array(12).fill(.15));asymmetric.measurement.terrainProfile.samples[4].height=-1.1;
const edge=deriveTerrainSpatialEvidence(asymmetric);
assert.ok(edge.relief.range>1);assert.notEqual(edge.strongestDeviation.x,0);

console.log(JSON.stringify({flat,depression,rise,asymmetric:edge},null,2));
