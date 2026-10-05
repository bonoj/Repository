// Three.js realization of the first semantic construction primitives.
// Semantic Things remain renderer-independent; this layer interprets their form.

import {materialDescriptor} from "../materials.js";

function threeMaterial(THREE,name){
  const d=materialDescriptor(name),p={...d};delete p.kind;
  if(p.side==="double")p.side=THREE.DoubleSide;
  return d.kind==="physical"?new THREE.MeshPhysicalMaterial(p):new THREE.MeshStandardMaterial(p);
}
function mesh(THREE,geometry,thing){
  const m=new THREE.Mesh(geometry,threeMaterial(THREE,thing.semantics.material));
  m.name=`construction:${thing.id}`;m.userData.constructionThing=thing.id;return m;
}
export function realizePrimitive(THREE,thing){
  const d=thing.semantics.dimensions;
  if(thing.kind==="block"||thing.kind==="slab")return mesh(THREE,new THREE.BoxGeometry(...d.size),thing);
  if(thing.kind==="post")return mesh(THREE,new THREE.CylinderGeometry(d.radius,d.radius,d.height,12),thing);
  if(thing.kind==="rail"){
    const m=mesh(THREE,new THREE.CylinderGeometry(d.radius,d.radius,d.length,10),thing);
    m.rotation.z=Math.PI/2;return m;
  }
  if(thing.kind==="ring")return mesh(THREE,new THREE.TorusGeometry(d.radius,d.tube,8,24),thing);
  if(thing.kind==="bead")return mesh(THREE,new THREE.SphereGeometry(d.radius,12,8),thing);
  throw new Error(`No Three construction realization for ${thing.kind}`);
}

export function primitiveFrames(thing){
  const d=thing.semantics.dimensions;
  if(thing.kind==="post")return [
    {thing:thing.id,port:"top",position:[0,d.height/2,0],outward:[0,1,0],up:[0,0,1]},
    {thing:thing.id,port:"bottom",position:[0,-d.height/2,0],outward:[0,-1,0],up:[0,0,1]},
    {thing:thing.id,port:"side",surface:"cylinder",radius:d.radius,span:d.height,axis:[0,1,0]}
  ];
  if(thing.kind==="rail")return [
    {thing:thing.id,port:"a",position:[-d.length/2,0,0],outward:[-1,0,0],up:[0,1,0]},
    {thing:thing.id,port:"b",position:[d.length/2,0,0],outward:[1,0,0],up:[0,1,0]},
    {thing:thing.id,port:"side",surface:"cylinder",radius:d.radius,span:d.length,axis:[1,0,0]}
  ];
  if(thing.kind==="block"||thing.kind==="slab")return [
    {thing:thing.id,port:"top",position:[0,d.size[1]/2,0],outward:[0,1,0],up:[0,0,1]},
    {thing:thing.id,port:"bottom",position:[0,-d.size[1]/2,0],outward:[0,-1,0],up:[0,0,1]}
  ];
  if(thing.kind==="ring")return [
    {thing:thing.id,port:"rim",surface:"torus",radius:d.radius,tube:d.tube,axis:[0,0,1]},
    {thing:thing.id,port:"axis",axis:[0,0,1]}
  ];
  if(thing.kind==="bead")return [
    {thing:thing.id,port:"surface",surface:"sphere",radius:d.radius}
  ];
  return [];
}

// A relation may select a concrete frame from a continuous attachment surface.
// Selection belongs to realization: semantic ports remain surfaces/axes, not coordinates.
export function selectPrimitiveFrame(thing,port,selector={}){
  const d=thing.semantics.dimensions;
  const angle=selector.angle??0,along=selector.along??0;
  if((thing.kind==="post"||thing.kind==="rail")&&port==="side"){
    if(thing.kind==="post")return {position:[Math.cos(angle)*d.radius,along*d.height/2,Math.sin(angle)*d.radius],outward:[Math.cos(angle),0,Math.sin(angle)],up:[0,1,0]};
    return {position:[along*d.length/2,Math.cos(angle)*d.radius,Math.sin(angle)*d.radius],outward:[0,Math.cos(angle),Math.sin(angle)],up:[1,0,0]};
  }
  if(thing.kind==="ring"&&port==="rim")
    return {position:[Math.cos(angle)*d.radius,Math.sin(angle)*d.radius,0],outward:[Math.cos(angle),Math.sin(angle),0],up:[0,0,1]};
  if(thing.kind==="bead"&&port==="surface"){
    const polar=selector.polar??Math.PI/2;
    return {position:[Math.sin(polar)*Math.cos(angle)*d.radius,Math.cos(polar)*d.radius,Math.sin(polar)*Math.sin(angle)*d.radius],outward:[Math.sin(polar)*Math.cos(angle),Math.cos(polar),Math.sin(polar)*Math.sin(angle)],up:[0,1,0]};
  }
  return primitiveFrames(thing).find(f=>f.port===port)??null;
}
