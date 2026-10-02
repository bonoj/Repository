import assert from "node:assert/strict";
import {buildInferenceParcel} from "../src/runtime/inference-parcel.js";

const ledger={
 format:"crucible-locus-ledger",version:1,build:"abc",exportedAt:"now",
 instrument:{station:{kind:"orbital"},footprint:{kind:"cone"},apertures:[{kind:"scene-summary"}]},
 internalFixture:{events:["excluded"]},
 entries:Array.from({length:30},(_,i)=>({
   observation:{observationId:i,measurement:{groundHeight:i}},
   analysis:{relief:{range:i}},
   internal:"excluded"
 }))
};
const parcel=buildInferenceParcel(ledger,{maxObservations:24});
assert.equal(parcel.format,"crucible-inference-parcel");
assert.equal(parcel.available.observations.length,24);
assert.equal(parcel.available.observations[0].observation.observationId,6);
assert.equal(parcel.available.observations.at(-1).observation.observationId,29);
assert.equal("internalFixture" in parcel,false);
assert.equal(JSON.stringify(parcel).includes('"internal":"excluded"'),false);
assert.equal("objective" in parcel,false);
console.log("inference parcel boundary: ok");
