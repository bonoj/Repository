export function createLighthuggerExterior({THREE,scene}){
  const root=new THREE.Group();root.name="lighthugger-exterior";root.position.set(-1.2,13.0,-1.2);root.rotation.z=Math.PI/2;scene.add(root);
  const hull=new THREE.MeshStandardMaterial({color:0x3b3934,roughness:.58,metalness:.72}),brass=new THREE.MeshStandardMaterial({color:0x8f6333,roughness:.43,metalness:.78}),recess=new THREE.MeshStandardMaterial({color:0x111517,roughness:.78,metalness:.46}),warm=new THREE.MeshBasicMaterial({color:0xffb15a}),cool=new THREE.MeshStandardMaterial({color:0x334a50,roughness:.48,metalness:.7});
  const length=10.8,outer=1.75,inner=1.03;
  const fixed=new THREE.Group(),greebles=new THREE.Group();root.add(fixed,greebles);
  const tag=o=>o.traverse(x=>{if(x.isMesh)x.userData.lighthuggerExterior=true});
  for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4,m=new THREE.Mesh(new THREE.BoxGeometry(.56,length,1.18),hull);m.position.set(Math.sin(a)*1.38,0,Math.cos(a)*1.38);m.rotation.y=a;m.castShadow=true;fixed.add(m)}
  const core=new THREE.Mesh(new THREE.CylinderGeometry(inner,inner,length+.04,8,1,true,Math.PI/8),recess);core.material.side=THREE.BackSide;fixed.add(core);
  for(const y of [-length*.48,-length*.29,0,length*.29,length*.48]){const r=new THREE.Mesh(new THREE.TorusGeometry(1.78,.075,4,8),brass);r.rotation.x=Math.PI/2;r.rotation.z=Math.PI/8;r.position.y=y;fixed.add(r)}
  for(const end of [-1,1])for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4,radial=new THREE.Vector3(Math.sin(a),0,Math.cos(a)),p0=radial.clone().multiplyScalar(1.38);p0.y=end*length*.515;const p1=radial.clone().multiplyScalar(1.13);p1.y=end*(length*.515+.23);const d=p1.clone().sub(p0),mid=p0.clone().add(p1).multiplyScalar(.5);mid.y-=end*.34;const b=new THREE.Mesh(new THREE.BoxGeometry(.08,d.length(),.08),brass);b.position.copy(mid);b.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());fixed.add(b)}
  // Accepted treatment H. The temporary A-Z search deck has been discarded.
  function rng(seed){return()=>{seed|=0;seed=(seed+0x6D2B79F5)|0;let t=seed;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
  const R=rng(0x51a7+7*7919);
  const addBox=(a,y,r,w,h,d,mat=brass)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(Math.sin(a)*r,y,Math.cos(a)*r);m.rotation.y=a;m.castShadow=true;greebles.add(m)};
  const addRail=(a,r=2.02,span=8.4,mat=brass)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,span,5),mat);m.position.set(Math.sin(a)*r,0,Math.cos(a)*r);greebles.add(m)};
  const addMast=(a,y,r=2.02,h=.42)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.018,.027,h,5),brass);m.position.set(Math.sin(a)*r,y,Math.cos(a)*r);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(Math.sin(a),0,Math.cos(a)));greebles.add(m)};
  const addLight=(a,y,r=2.0)=>addBox(a,y,r,.11,.14,.055,warm);
  // H: two offset longitudinal rails.
  for(let i=0;i<2;i++){const a=i*Math.PI+Math.PI/24;addRail(a,1.94+(i%2)*.09,7.0+R()*2.2,i%5===0?cool:brass)}
  // H: four rows of installed service boxes across all eight faces.
  for(let f=0;f<8;f++){const a=Math.PI/8+f*Math.PI/4;for(let j=0;j<7;j++){const y=-4.35+j*(8.7/6)+(R()-.5)*.18;for(let row=0;row<4;row++){if(R()<.2)continue;addBox(a+(row-1.5)*.055,y,1.80+row*.07,.16+R()*.22,.18+R()*.42,.10+R()*.12,R()<.22?brass:cool)}}}
  // H: alternating-face running lights.
  for(let f=0;f<8;f++){if(f%2)continue;const a=Math.PI/8+f*Math.PI/4,n=3+(7+f)%7;for(let j=0;j<n;j++)addLight(a,-3.8+j*(7.6/Math.max(1,n-1))+(R()-.5)*.12,1.985)}
  // H: four mast bands with varying counts.
  for(let b=0;b<4;b++){const y=-3.7+b*(7.4/3),count=4+(7+b)%5;for(let k=0;k<count;k++)addMast((k/count)*Math.PI*2,y,1.98+R()*.12,.22+R()*.58)}
  // H: paired structural ribs.
  for(const y of [-2.6,2.6]){const r=new THREE.Mesh(new THREE.TorusGeometry(1.91,.035,4,8),cool);r.rotation.x=Math.PI/2;r.rotation.z=Math.PI/8;r.position.y=y;greebles.add(r)}
  tag(greebles);tag(fixed);
  return{object:root,inspect:()=>({kind:"lighthugger-exterior",shape:"horizontal cored octagonal vessel",length,outerRadius:outer,innerRadius:inner,entryTarget:true,greebleTreatment:"H"})};
}
