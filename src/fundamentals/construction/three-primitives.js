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
    {thing:thing.id,port:"bottom",position:[0,-d.height/2,0],outward:[0,-1,0],up:[0,0,1]}
  ];
  if(thing.kind==="rail")return [
    {thing:thing.id,port:"a",position:[-d.length/2,0,0],outward:[-1,0,0],up:[0,1,0]},
    {thing:thing.id,port:"b",position:[d.length/2,0,0],outward:[1,0,0],up:[0,1,0]}
  ];
  if(thing.kind==="block"||thing.kind==="slab")return [
    {thing:thing.id,port:"top",position:[0,d.size[1]/2,0],outward:[0,1,0],up:[0,0,1]},
    {thing:thing.id,port:"bottom",position:[0,-d.size[1]/2,0],outward:[0,-1,0],up:[0,0,1]}
  ];
  return [{thing:thing.id,port:"center",position:[0,0,0],outward:[0,1,0],up:[0,0,1]}];
}
