// Hidden dice box specimen.
// Exact inhabited-biome d20 removed from the active Betwixt surface after build 7145e438.
// This file is inert archaeology: it is not imported by the Workshop.

/* INHABITED D20 — twenty materially distinct triangular worlds on one playable die.
   First tap uses ordinary Betwixt focus. A tap while focused rolls the die. */
const d20BiomeDefs=[
  ['glacier',0xbfe9f2],['volcano',0x32120d],['dunes',0xd9ad5f],['forest',0x1f5b32],['reef',0x2aa6a8],
  ['swamp',0x56663b],['tundra',0xd7ded7],['mesa',0xa95432],['jungle',0x164a27],['crystal',0x654fa3],
  ['city',0x777d82],['farmland',0x789447],['badlands',0x8c5434],['mushroom',0x72507c],['obsidian',0x17181b],
  ['savanna',0xb79b49],['crater',0x5c5b59],['salt',0xe4e0cf],['archipelago',0x3179a3],['blossom',0xc66f8d]
];
const d20FaceMats=d20BiomeDefs.map(([name,color])=>new THREE.MeshStandardMaterial({name:'d20-biome:'+name,color,roughness:.78,metalness:name==='crystal'||name==='obsidian'?.18:.02,flatShading:true}));
let d20Roll=null,d20RollCount=0;
// Semantic placement: the d20 is ABOVE the thoughtform table. Resolve that relation
// from live bounds so either object may change shape without reintroducing overlap.
const thoughtformTableBounds=new THREE.Box3().setFromObject(workshopTabletopBetwixtable);
const inhabitedD20Radius=1.18;
const inhabitedD20Clearance=.65;
const inhabitedD20=buildBetwixtable({
  name:'inhabited-d20',
  parent:scene,
  at:new THREE.Vector3(
    workshopTabletopBetwixtable.position.x,
    thoughtformTableBounds.max.y+inhabitedD20Radius+inhabitedD20Clearance,
    workshopTabletopBetwixtable.position.z
  ),
  padding:.32,
  interact:()=>rollInhabitedD20(),
  build(root,spatial){
    const geo=new THREE.IcosahedronGeometry(1.18,0).toNonIndexed();
    const pos=geo.getAttribute('position');
    geo.clearGroups();
    for(let face=0;face<20;face++)geo.addGroup(face*3,3,face);
    const die=new THREE.Mesh(geo,d20FaceMats);die.name='inhabited-d20:twenty-biomes';die.castShadow=true;die.receiveShadow=true;root.add(die);
    const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:0xd8c59b,transparent:true,opacity:.78}));
    edge.name='inhabited-d20:face-borders';root.add(edge);

    const up=new THREE.Vector3(0,1,0),a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3();
    const dark=new THREE.MeshStandardMaterial({color:0x20231f,roughness:.9});
    const snow=new THREE.MeshStandardMaterial({color:0xf1f4ee,roughness:.92});
    const water=new THREE.MeshStandardMaterial({color:0x58b7c7,roughness:.32,metalness:.04});
    const lava=new THREE.MeshStandardMaterial({color:0xff6b18,roughness:.45,emissive:0x8a1900,emissiveIntensity:.65});
    const blossom=new THREE.MeshStandardMaterial({color:0xf2a7bf,roughness:.8});
    const crystal=new THREE.MeshStandardMaterial({color:0xa58cff,roughness:.22,metalness:.18});
    function cone(r,h,mat){const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,5),mat);m.position.y=h*.5;return m}
    function box(x,y,z,mat){const m=new THREE.Mesh(new THREE.BoxGeometry(x,y,z),mat);m.position.y=y*.5;return m}
    function orb(r,mat){const m=new THREE.Mesh(new THREE.SphereGeometry(r,7,5),mat);m.position.y=r;return m}
    function addCue(face,center,normal,name){
      const cue=new THREE.Group();cue.name='d20-biome-cue:'+name;
      cue.position.copy(center.clone().multiplyScalar(1.035));
      cue.quaternion.setFromUnitVectors(up,normal);root.add(cue);
      const terrain=d20FaceMats[face];
      if(name==='glacier'){for(const [x,z,h] of [[-.16,.02,.30],[.03,-.10,.42],[.17,.09,.25]]){const m=cone(.07,h,snow);m.position.x=x;m.position.z=z;cue.add(m)}}
      else if(name==='volcano'){const m=cone(.22,.28,dark);cue.add(m);const l=orb(.055,lava);l.position.y=.27;cue.add(l)}
      else if(name==='dunes'){for(const x of [-.14,.08]){const m=orb(.17,terrain);m.scale.set(1,.32,.65);m.position.set(x,.035,.02+x*.3);cue.add(m)}}
      else if(name==='forest'||name==='jungle'){for(const [x,z,h] of [[-.15,-.05,.22],[.02,.08,.30],[.16,-.02,.25]]){const trunk=box(.025,h*.55,.025,dark);trunk.position.x=x;trunk.position.z=z;cue.add(trunk);const crown=cone(.10,h*.62,terrain);crown.position.x=x;crown.position.y=h*.55;crown.position.z=z;cue.add(crown)}}
      else if(name==='reef'||name==='archipelago'){const pool=orb(.23,water);pool.scale.set(1,.10,.75);pool.position.y=.018;cue.add(pool);for(const [x,z] of [[-.12,0],[.08,.07],[.14,-.08]]){const m=name==='reef'?cone(.045,.17,blossom):orb(.065,terrain);m.position.x=x;m.position.z=z;cue.add(m)}}
      else if(name==='swamp'){for(const x of [-.14,.02,.16]){const m=box(.035,.13,.035,dark);m.position.x=x;m.rotation.z=x*1.8;cue.add(m)}const p=orb(.22,water);p.scale.set(1,.07,.7);p.position.y=.012;cue.add(p)}
      else if(name==='tundra'){for(const [x,z] of [[-.12,.05],[.08,-.07]]){const m=orb(.11,snow);m.scale.y=.45;m.position.set(x,.04,z);cue.add(m)}}
      else if(name==='mesa'||name==='badlands'){for(const [x,z,h,w] of [[-.12,0,.18,.14],[.10,.04,.28,.11]]){const m=box(w,h,w,terrain);m.position.x=x;m.position.z=z;cue.add(m)}}
      else if(name==='crystal'){for(const [x,z,h] of [[-.13,0,.25],[.03,-.05,.36],[.14,.07,.22]]){const m=cone(.065,h,crystal);m.position.x=x;m.position.z=z;cue.add(m)}}
      else if(name==='city'){for(const [x,z,h] of [[-.14,-.05,.18],[0,.07,.29],[.14,-.02,.22]]){const m=box(.09,h,.09,dark);m.position.x=x;m.position.z=z;cue.add(m)}}
      else if(name==='farmland'){for(let x=-.18;x<=.18;x+=.09){const m=box(.018,.025,.34,dark);m.position.x=x;cue.add(m)}}
      else if(name==='mushroom'){for(const [x,z,h] of [[-.13,0,.18],[.05,-.06,.25],[.15,.08,.15]]){const stem=box(.025,h*.65,.025,snow);stem.position.x=x;stem.position.z=z;cue.add(stem);const cap=orb(.075,blossom);cap.scale.y=.45;cap.position.set(x,h*.66,z);cue.add(cap)}}
      else if(name==='obsidian'){for(const [x,z,h] of [[-.12,.03,.27],[.05,-.08,.34],[.15,.08,.20]]){const m=cone(.055,h,dark);m.position.x=x;m.position.z=z;cue.add(m)}}
      else if(name==='savanna'){const trunk=box(.035,.18,.035,dark);cue.add(trunk);const crown=orb(.15,terrain);crown.scale.set(1,.35,1);crown.position.y=.19;cue.add(crown)}
      else if(name==='crater'){const ring=new THREE.Mesh(new THREE.TorusGeometry(.18,.045,5,12),dark);ring.rotation.x=Math.PI/2;ring.position.y=.035;cue.add(ring)}
      else if(name==='salt'){for(const [x,z] of [[-.12,0],[.04,-.07],[.14,.08]]){const m=box(.09,.035,.09,snow);m.position.x=x;m.position.z=z;m.rotation.y=x*8;cue.add(m)}}
      else if(name==='blossom'){const trunk=box(.035,.19,.035,dark);cue.add(trunk);for(let j=0;j<5;j++){const q=orb(.065,blossom);const ang=j*Math.PI*2/5;q.position.set(Math.cos(ang)*.10,.22,Math.sin(ang)*.10);cue.add(q)}}
    }
    for(let face=0;face<20;face++){
      a.fromBufferAttribute(pos,face*3);b.fromBufferAttribute(pos,face*3+1);c.fromBufferAttribute(pos,face*3+2);
      const center=a.clone().add(b).add(c).multiplyScalar(1/3),normal=center.clone().normalize();
      addCue(face,center,normal,d20BiomeDefs[face][0]);
    }
    root.userData.die=die;root.userData.edge=edge;root.userData.biomes=d20BiomeDefs.map(x=>x[0]);
    spatial.fit();
  }
});
inhabitedD20.userData.world=Object.freeze({kind:'inhabited-die',faces:d20BiomeDefs.map(x=>x[0]),rule:'tap while focused to roll'});
function rollInhabitedD20(){
  if(workshopFocusMotion||d20Roll)return true;
  const p=inhabitedD20.userData.betwixtable.presentation;
  const from=p.quaternion.clone();
  const axis=new THREE.Vector3(Math.random()-.5,Math.random()*.8+.2,Math.random()-.5).normalize();
  const spins=2+Math.floor(Math.random()*3),angle=spins*Math.PI*2+(Math.random()*Math.PI*2);
  const targetQ=new THREE.Quaternion().setFromAxisAngle(axis,angle);
  targetQ.multiply(from);
  d20Roll={from,to:targetQ,started:performance.now(),duration:850+Math.random()*450,count:++d20RollCount};
  window.vestibuleDirty=true;return true;
}
function updateInhabitedD20(now){
  if(!d20Roll)return;
  const p=inhabitedD20.userData.betwixtable.presentation;
  const raw=Math.min(1,(now-d20Roll.started)/d20Roll.duration);
  const t=1-Math.pow(1-raw,3);
  p.quaternion.copy(d20Roll.from).slerp(d20Roll.to,t);
  if(raw>=1){p.quaternion.copy(d20Roll.to).normalize();d20Roll=null}
  window.vestibuleDirty=true;
}
