export function createCinnabarDomeSystem({THREE,scene,terrain,field}){
  // First async-field move: keep the behavior authored and local until play earns broader machinery.
  const root=new THREE.Group();root.name="cinnabar-skeletal-dome";
  const brass=new THREE.MeshStandardMaterial({color:0x9b6a2f,roughness:.48,metalness:.72}),
    darkBrass=new THREE.MeshStandardMaterial({color:0x624522,roughness:.58,metalness:.62}),
    warm=new THREE.MeshStandardMaterial({color:0xd39a4b,emissive:0x8a4d18,emissiveIntensity:.38,roughness:.44,metalness:.54});
  const R=2.15,H=2.45,segments=12,tube=.035;
  function beam(a,b,r=tube,mat=brass){const d=b.clone().sub(a),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),7),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());m.castShadow=true;root.add(m);return m;}
  // Twelve meridian ribs approximate the reference's skeletal conservatory dome.
  for(let s=0;s<segments;s++){const a=s/segments*Math.PI*2;let prev=new THREE.Vector3(Math.cos(a)*R,0,Math.sin(a)*R);
    for(let j=1;j<=7;j++){const t=j/7*Math.PI/2,p=new THREE.Vector3(Math.cos(a)*R*Math.cos(t),H*Math.sin(t),Math.sin(a)*R*Math.cos(t));beam(prev,p,j===7?.045:tube);prev=p;}}
  // Three horizontal rings tie the ribs together.
  for(const f of [.24,.52,.76]){const y=H*f,r=R*Math.sqrt(Math.max(0,1-f*f));for(let s=0;s<segments;s++){const a=s/segments*Math.PI*2,b=(s+1)/segments*Math.PI*2;beam(new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r),new THREE.Vector3(Math.cos(b)*r,y,Math.sin(b)*r),.03,darkBrass);}}
  // Ancient crown and a restrained warm heart: visual vocabulary, not semantic identity.
  beam(new THREE.Vector3(0,H-.02,0),new THREE.Vector3(0,H+.72,0),.055,darkBrass);
  const crown=new THREE.Mesh(new THREE.SphereGeometry(.16,10,7),warm);crown.position.y=H+.27;crown.castShadow=true;root.add(crown);
  const finial=new THREE.Mesh(new THREE.ConeGeometry(.065,.46,7),brass);finial.position.y=H+.91;root.add(finial);
  const baseRing=new THREE.Mesh(new THREE.TorusGeometry(R,.065,7,48),darkBrass);baseRing.rotation.x=Math.PI/2;baseRing.position.y=.03;baseRing.castShadow=true;root.add(baseRing);
  const center=new THREE.Vector3(2.7,0,1.8),ground=terrain.groundHeight(center.x,center.z),surface=Number.isFinite(ground)?ground:.15;
  const buried=surface-(H+1.2),settled=surface+.02;root.position.set(center.x,buried,center.z);scene.add(root);
  const scored=field.turn(1);let progress=0,settledOnce=false;
  function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
  function update(fieldNow){progress=THREE.MathUtils.clamp((fieldNow-scored.at)/scored.duration,0,1);root.position.y=THREE.MathUtils.lerp(buried,settled,ease(progress));settledOnce=progress>=1;}
  return{object:root,update,inspect:()=>({kind:"cinnabar-skeletal-dome",position:[root.position.x,root.position.y,root.position.z],riseProgress:Number(progress.toFixed(3)),settled:settledOnce,behavior:"authored-rise"})};
}
