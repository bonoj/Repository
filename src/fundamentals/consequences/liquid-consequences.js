// Consequences are compositional runtime relationships: because A encountered B, C happened.
// They own neither participant and know nothing about projects, places, loci, or UI.

export function createLiquidSteamConsequence({THREE,owner,water,lava,random=Math.random,cooldown=.18}){
  if(!THREE||!owner?.add||!water?.forEachWetCell||!lava?.forEachWetCell)throw new Error("Steam consequence requires THREE, owner, water, and lava");
  const group=new THREE.Group();group.name="consequence:liquid-steam";owner.add(group);
  const puffs=[],contacts=new Map();
  function spawn(x,y,z){
    const geometry=new THREE.SphereGeometry(.18,7,5);
    const material=new THREE.MeshBasicMaterial({color:0xd9ddd8,transparent:true,opacity:.14,depthWrite:false});
    const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y+.08,z);
    const s=.9+random()*.8;mesh.scale.set(s*.85,s,s*.85);group.add(mesh);
    puffs.push({mesh,age:0,life:.9+random()*.65,vy:.65+random()*.4});
  }
  function update(now,dt){
    const seconds=now/1000,cells=new Map();
    water.forEachWetCell(c=>cells.set(c.ix+","+c.iz,c));
    lava.forEachWetCell(c=>{const key=c.ix+","+c.iz,w=cells.get(key);if(!w)return;const last=contacts.get(key)??-Infinity;if(seconds-last<cooldown)return;contacts.set(key,seconds);spawn(c.x,Math.max(c.surface,w.surface),c.z)});
    for(let i=puffs.length-1;i>=0;i--){const p=puffs[i];p.age+=dt;p.mesh.position.y+=p.vy*dt;p.mesh.scale.multiplyScalar(1+dt*1.15);p.mesh.material.opacity=.14*Math.pow(Math.max(0,1-p.age/p.life),1.35);if(p.age>=p.life){group.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose();puffs.splice(i,1)}}
    for(const [key,t] of contacts)if(seconds-t>2)contacts.delete(key);
  }
  function dispose(){for(const p of puffs){p.mesh.geometry.dispose();p.mesh.material.dispose()}group.removeFromParent();puffs.length=0;contacts.clear()}
  return{object:group,update,dispose,inspect:()=>({kind:"liquid-steam-consequence",activePuffs:puffs.length,contacts:contacts.size})};
}

export function createLavaBearingPopConsequence({THREE,lava,bearings,random=Math.random}){
  if(!THREE||!lava?.forEachWetCell||!bearings?.spawnOne)throw new Error("Lava-bearing pop consequence requires THREE, lava, and bearings");
  let nextAt=0;
  function update(now){
    if(now<nextAt)return;const wet=[];lava.forEachWetCell(c=>wet.push(c));
    if(!wet.length){nextAt=now+220;return}
    nextAt=now+260+random()*620;const cell=wet[(random()*wet.length)|0],n=1+((random()*3)|0);
    for(let i=0;i<n;i++){const angle=random()*Math.PI*2,speed=.28+random()*.52,lift=.65+random()*.8;bearings.spawnOne(new THREE.Vector3(cell.x,cell.surface+.09,cell.z),new THREE.Vector3(Math.cos(angle)*speed,lift,Math.sin(angle)*speed))}
  }
  return{update,inspect:()=>({kind:"lava-bearing-pop-consequence",nextAt})};
}
