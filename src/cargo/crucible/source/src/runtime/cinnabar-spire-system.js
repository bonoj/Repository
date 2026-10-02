export function createCinnabarSpireSystem({THREE,scene,terrain,field}){
  const root=new THREE.Group();root.name="cinnabar-distant-spire";
  const brass=new THREE.MeshStandardMaterial({color:0x8f622b,roughness:.5,metalness:.74});
  const dark=new THREE.MeshStandardMaterial({color:0x50391f,roughness:.58,metalness:.66});
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.10,.19,7.8,8),brass);shaft.position.y=3.9;shaft.castShadow=true;root.add(shaft);
  const collar=new THREE.Mesh(new THREE.CylinderGeometry(.27,.32,.22,10),dark);collar.position.y=.18;root.add(collar);
  const needle=new THREE.Mesh(new THREE.ConeGeometry(.13,1.45,8),brass);needle.position.y=8.52;needle.castShadow=true;root.add(needle);
  const scored=field.turn(8),x=-6.1,z=-4.4,plinthTop=terrain.inspect().apparatus.top;
  // The spire belongs to the apparatus, not deformable terrain: terrain may move around it.
  const buried=plinthTop-9.4,settled=plinthTop;root.position.set(x,buried,z);scene.add(root);
  let progress=0;
  function update(fieldNow){
    progress=THREE.MathUtils.clamp((fieldNow-scored.at)/scored.duration,0,1);
    const e=progress*progress*(3-2*progress);
    root.position.y=THREE.MathUtils.lerp(buried,settled,e);
    // The apparatus is an opaque plinth. Do not render the buried portion through its sides.
    const visibleHeight=Math.max(0,root.position.y+9.25-plinthTop);
    root.visible=visibleHeight>0;
    root.traverse(o=>{if(o.isMesh)o.material.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,1,0),-plinthTop)];});
  }
  return{object:root,update,inspect:()=>({kind:"distant-brass-spire",turn:8,riseProgress:Number(progress.toFixed(3)),position:[root.position.x,root.position.y,root.position.z]})};
}
