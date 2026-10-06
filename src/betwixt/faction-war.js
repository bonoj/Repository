// Three-faction Crucible war: deterministic strategy simulation over ordinary terrain.
// Each faction owns a genuinely different expansion policy; visuals expose state rather than script a scene.
export function createFactionWarSystem({THREE,terrain,owner,seed=741}){
  const root=new THREE.Group();root.name="war:three-factions";owner.add(root);
  let state=seed>>>0,last=0,acc=0,startedAt=performance.now(),winner=null;
  const rand=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const ground=(x,z)=>terrain.groundHeight?.(x,z)??0;
  const factions=[
    {id:"bastion",name:"Bastion",color:0xd65a32,start:new THREE.Vector2(-8.2,-6.3),policy:"fortify",speed:.62,max:11},
    {id:"murmuration",name:"Murmuration",color:0x4b79d8,start:new THREE.Vector2(8.3,-5.8),policy:"scatter",speed:.88,max:17},
    {id:"delvers",name:"Delvers",color:0x8b62b7,start:new THREE.Vector2(.3,8.8),policy:"burrow",speed:.52,max:8}
  ];
  const unitGeo=new THREE.ConeGeometry(.13,.34,5),postGeo=new THREE.CylinderGeometry(.07,.09,.42,6),shotGeo=new THREE.SphereGeometry(.045,5,4);
  const units=[],posts=[],shots=[];
  const mats=new Map(factions.map(f=>[f.id,new THREE.MeshStandardMaterial({color:f.color,roughness:.62,metalness:.12})]));
  const darkMats=new Map(factions.map(f=>[f.id,new THREE.MeshStandardMaterial({color:f.color,roughness:.9,metalness:.02})]));
  const addPost=(f,x,z)=>{
    if(posts.filter(p=>p.f===f).length>=28)return;
    const mesh=new THREE.Mesh(postGeo,darkMats.get(f.id));mesh.position.set(x,ground(x,z)+.21,z);mesh.castShadow=true;root.add(mesh);
    posts.push({f,x,z,mesh});
  };
  const spawn=(f,i)=>{
    const a=(i/f.max-.5)*.9,p=f.start.clone().add(new THREE.Vector2(Math.cos(a),Math.sin(a)).multiplyScalar(.3+.18*(i%3)));
    const mesh=new THREE.Mesh(unitGeo,mats.get(f.id));mesh.position.set(p.x,ground(p.x,p.y)+.18,p.y);mesh.castShadow=true;root.add(mesh);
    units.push({f,mesh,p,hp:3,phase:rand()*6.28,target:new THREE.Vector2(),cool:rand()*.8,alive:true,trail:0});
  };
  for(const f of factions){addPost(f,f.start.x,f.start.y);for(let i=0;i<f.max;i++)spawn(f,i)}
  const centerRing=new THREE.Mesh(new THREE.TorusGeometry(.62,.035,8,48),new THREE.MeshStandardMaterial({color:0xc79b3b,roughness:.4,metalness:.55}));
  centerRing.rotation.x=Math.PI/2;centerRing.position.y=ground(0,0)+.08;root.add(centerRing);
  function nearestEnemy(u){
    let best=null,bd=1e9;for(const v of units)if(v.alive&&v.f!==u.f){const d=u.p.distanceToSquared(v.p);if(d<bd){bd=d;best=v}}
    return bd<2.25?best:null;
  }
  function policyTarget(u){
    const f=u.f,toCenter=u.p.clone().multiplyScalar(-1),d=u.p.length();
    if(f.policy==="fortify"){
      // Slow military road: advance in a coherent wedge and periodically harden the supply line.
      const lane=(units.filter(v=>v.alive&&v.f===f).indexOf(u)%5-2)*.16;
      const dir=toCenter.normalize(),side=new THREE.Vector2(-dir.y,dir.x);
      return u.p.clone().add(dir.multiplyScalar(.9)).add(side.multiplyScalar(lane));
    }
    if(f.policy==="scatter"){
      // Fast distributed exploration: scouts fan broadly, then converge as the Crucible becomes near.
      const radial=toCenter.normalize(),side=new THREE.Vector2(-radial.y,radial.x);
      const wander=Math.sin(u.phase+performance.now()*.0007)*Math.min(1.7,d*.18);
      return u.p.clone().add(radial.multiplyScalar(d<3?1.2:.62)).add(side.multiplyScalar(wander));
    }
    // Delvers choose terrain-efficient stepping: sample three headings and prefer the flattest inward route.
    const base=Math.atan2(toCenter.y,toCenter.x);let best=null,bscore=1e9;
    for(const off of [-.52,0,.52]){const q=u.p.clone().add(new THREE.Vector2(Math.cos(base+off),Math.sin(base+off)).multiplyScalar(.75));const slope=Math.abs(ground(q.x,q.y)-ground(u.p.x,u.p.y));const score=slope*2.8+q.length();if(score<bscore){bscore=score;best=q}}
    return best;
  }
  function fire(u,v){
    const mesh=new THREE.Mesh(shotGeo,mats.get(u.f.id));mesh.position.copy(u.mesh.position);root.add(mesh);
    shots.push({mesh,from:u,to:v,t:0,life:.34});
  }
  function kill(u){u.alive=false;u.mesh.visible=false}
  function tick(dt,now){
    if(now-startedAt<5200)return; // let Functional Biomes finish becoming ordinary matter first.
    for(const u of units){
      if(!u.alive)continue;u.cool-=dt;
      const enemy=nearestEnemy(u);
      if(enemy&&u.cool<=0){fire(u,enemy);u.cool=.55+rand()*.65}
      let target=enemy?enemy.p:policyTarget(u),dir=target.clone().sub(u.p),len=dir.length();
      if(len>.02){dir.multiplyScalar(1/len);let speed=u.f.speed;
        if(enemy)speed*=.72;
        // Bastion holds formation; Murmuration slips around contact; Delvers are slow but terrain-insensitive.
        if(u.f.policy!=="burrow"){const h0=ground(u.p.x,u.p.y),h1=ground(u.p.x+dir.x*.25,u.p.y+dir.y*.25);speed*=clamp(1-Math.abs(h1-h0)*1.7,.28,1)}
        u.p.addScaledVector(dir,speed*dt);u.p.x=clamp(u.p.x,-9.4,9.4);u.p.y=clamp(u.p.y,-9.4,9.4);
      }
      u.mesh.position.set(u.p.x,ground(u.p.x,u.p.y)+.18,u.p.y);u.mesh.rotation.y=Math.atan2(dir.x,dir.y);
      u.trail+=dt;
      const spacing=u.f.policy==="fortify"?1.35:u.f.policy==="burrow"?1.8:2.35;
      if(u.trail>spacing){u.trail=0;const own=posts.filter(p=>p.f===u.f);if(!own.some(p=>u.p.distanceToSquared(new THREE.Vector2(p.x,p.z))<spacing*spacing*.65))addPost(u.f,u.p.x,u.p.y)}
      if(u.p.length()<.72&&!winner){winner=u.f;centerRing.material=mats.get(u.f.id);centerRing.scale.setScalar(1.18)}
    }
    for(let i=shots.length-1;i>=0;i--){const s=shots[i];s.t+=dt;const q=clamp(s.t/s.life,0,1);if(s.to.alive)s.mesh.position.lerpVectors(s.from.mesh.position,s.to.mesh.position,q);if(q>=1){if(s.to.alive){s.to.hp--;if(s.to.hp<=0)kill(s.to)}root.remove(s.mesh);s.mesh.geometry=shotGeo;shots.splice(i,1)}}
    for(const p of posts)p.mesh.position.y=ground(p.x,p.z)+.21;
    centerRing.position.y=ground(0,0)+.08;
  }
  return{
    root,
    update(now){if(!last)last=now;const dt=Math.min(.1,(now-last)/1000);last=now;acc+=dt;if(acc<.05)return;const step=acc;acc=0;tick(step,now)},
    inspect(){return{kind:"three-faction-war",winner:winner?.name??null,factions:factions.map(f=>({id:f.id,name:f.name,policy:f.policy,alive:units.filter(u=>u.alive&&u.f===f).length,posts:posts.filter(p=>p.f===f).length}))}}
  };
}
