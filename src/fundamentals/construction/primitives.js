// First construction witnesses. Geometry-free, project-free semantic Things.
// Dimensions and material names describe realizable form without importing a renderer.

import {constructionThing} from "./construction.js";

function primitive(kind,{id,ports,dimensions,material="warmWhite",semantics={}}={}){
  return constructionThing({id,kind,ports,semantics:{dimensions:{...dimensions},material,...semantics}});
}

export const block=({id,size=[1,1,1],material="warmWhite"}={})=>primitive("block",{
  id,material,dimensions:{size},ports:[{id:"top",kind:"surface",surface:"face"},{id:"bottom",kind:"surface",surface:"face"}]
});
export const post=({id,height=1,radius=.08,material="brass"}={})=>primitive("post",{
  id,material,dimensions:{height,radius},ports:[{id:"top",kind:"surface",surface:"cap"},{id:"bottom",kind:"surface",surface:"cap"},{id:"side",kind:"surface",surface:"cylinder"}]
});
export const slab=({id,size=[1,.12,.7],material="warmWhite"}={})=>primitive("slab",{
  id,material,dimensions:{size},ports:[{id:"top",kind:"surface",surface:"face"},{id:"bottom",kind:"surface",surface:"face"}]
});
export const rail=({id,length=1,radius=.045,material="brass"}={})=>primitive("rail",{
  id,material,dimensions:{length,radius},ports:[{id:"a",kind:"surface",surface:"cap"},{id:"b",kind:"surface",surface:"cap"},{id:"side",kind:"surface",surface:"cylinder"}]
});
export const ring=({id,radius=.3,tube=.035,material="brass"}={})=>primitive("ring",{
  id,material,dimensions:{radius,tube},ports:[{id:"rim",kind:"surface",surface:"torus"},{id:"axis",kind:"axis"}]
});
export const bead=({id,radius=.07,material="brassBearing"}={})=>primitive("bead",{
  id,material,dimensions:{radius},ports:[{id:"surface",kind:"surface",surface:"sphere"}]
});
