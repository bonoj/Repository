export function createBearingSystem({world,components,THREE,scene,terrain,locus,impacts,water=null,liquids=null,maxBearings=1000000}){
  const BALL_R=.055,BEARING_RELATIVE_DENSITY=.55,PG=96,MAX_RENDERED=180000,PROJECTION_GRID=64,PROJECTION_MIN=-10,PROJECTION_SPAN=20;
  const projection=new Uint32Array(PROJECTION_GRID*PROJECTION_GRID);
  const bx=new Float32Array(maxBearings),by=new Float32Array(maxBearings),bz=new Float32Array(maxBearings);
  const bvx=new Float32Array(maxBearings),bvy=new Float32Array(maxBearings),bvz=new Float32Array(maxBearings);
  let count=0;
  const pile=new Uint16Array(PG*PG),slopeStamp=new Uint32Array(PG*PG),slopeX=new Float32Array(PG*PG),slopeZ=new Float32Array(PG*PG),dummy=new THREE.Object3D();
  let slopeFrame=1;
  const geometry=new THREE.IcosahedronGeometry(BALL_R,0),material=new THREE.MeshStandardMaterial({color:0xc7d0d0,metalness:.82,roughness:.24});
  const mesh=new THREE.InstancedMesh(geometry,material,Math.min(maxBearings,MAX_RENDERED));mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.frustumCulled=false;mesh.count=0;scene.add(mesh);
  const entity=world.entity();
  if(components.Locus)world.add(entity,components.Locus,{id:locus});
  // Batch bounds are intentionally absent: one batch must not masquerade as one occupant.
  function pileIndex(x,z){const span=20,ix=THREE.MathUtils.clamp(Math.floor((x+10)/span*PG),0,PG-1),iz=THREE.MathUtils.clamp(Math.floor((z+10)/span*PG),0,PG-1);return ix+PG*iz}
  function spawnBatch(n=25000,center=new THREE.Vector3(0,3.5,0)){
    const available=Math.min(n,maxBearings-count),cols=Math.max(3,Math.ceil(Math.cbrt(available)*1.45)),spacing=BALL_R*2.08,baseY=center.y+BALL_R+1;
    for(let n=0;n<available;n++){const i=count++,ix=n%cols,iz=Math.floor(n/cols)%cols,iy=Math.floor(n/(cols*cols));bx[i]=center.x+(ix-(cols-1)/2)*spacing+(Math.random()-.5)*.05;bz[i]=center.z+(iz-(cols-1)/2)*spacing+(Math.random()-.5)*.05;by[i]=baseY+iy*spacing+(Math.random()-.5)*.05;bvx[i]=(Math.random()-.5)*.15;bvy[i]=0;bvz[i]=(Math.random()-.5)*.15}
    return available;
  }
  function spawnOne(position,velocity){
    if(count>=maxBearings)return 0;
    const i=count++;bx[i]=position.x;by[i]=position.y;bz[i]=position.z;
    bvx[i]=velocity?.x??0;bvy[i]=velocity?.y??0;bvz[i]=velocity?.z??0;
    return 1;
  }
  const contact={x:0,y:0,z:0,vx:0,vy:0,vz:0},liquidSample={depth:0,surface:0,u:0,v:0},liquidFields=liquids??(water?[water]:[]);
  const probe={updateMs:0,count:0,rendered:0,renderStride:1};
  function update(dt){
    const updateStart=performance.now();
    dt=Math.min(.15,Math.max(.001,dt));pile.fill(0);slopeFrame++;if(slopeFrame===0){slopeStamp.fill(0);slopeFrame=1}const g=-8.5,renderStride=count>500000?8:count>250000?5:count>100000?3:count>50000?2:1;let rendered=0;
    for(let i=0;i<count;i++){
      let submerged=0,ws=null;
      for(const liquid of liquidFields){
        const surfaceY=liquid?.surfaceY?.(bx[i],bz[i])??NaN;if(!Number.isFinite(surfaceY)||by[i]-BALL_R>=surfaceY)continue;
        const t=THREE.MathUtils.clamp((surfaceY-(by[i]-BALL_R))/(BALL_R*2),0,1),q=t*t*(3-2*t);
        if(q<=submerged)continue;
        if(liquid.flowInto?.(bx[i],bz[i],liquidSample)){submerged=q;ws={u:liquidSample.u,v:liquidSample.v}}
      }
      bvy[i]+=g*dt;
      if(submerged>0){
        bvy[i]+=(-g)*(submerged/BEARING_RELATIVE_DENSITY)*dt;
        const verticalDamp=Math.exp(-3.2*submerged*dt),horizontalDamp=Math.exp(-1.15*submerged*dt);
        bvy[i]*=verticalDamp;bvx[i]*=horizontalDamp;bvz[i]*=horizontalDamp;
        const follow=1-Math.exp(-2.4*submerged*dt);
        bvx[i]+=((ws.u??0)-bvx[i])*follow;bvz[i]+=((ws.v??0)-bvz[i])*follow;
      }
      bvx[i]*=.998;bvz[i]*=.998;bx[i]+=bvx[i]*dt;by[i]+=bvy[i]*dt;bz[i]+=bvz[i]*dt;
      contact.x=bx[i];contact.y=by[i];contact.z=bz[i];contact.vx=bvx[i];contact.vy=bvy[i];contact.vz=bvz[i];terrain.collideBearingState(contact,BALL_R,.28,.86);bx[i]=contact.x;by[i]=contact.y;bz[i]=contact.z;bvx[i]=contact.vx;bvy[i]=contact.vy;bvz[i]=contact.vz;
      const gh=(terrain.supportY??terrain.groundHeight)(bx[i],bz[i]);if(Number.isFinite(gh)){const pi=pileIndex(bx[i],bz[i]),stack=Math.min(28,pile[pi]++)*BALL_R*.34,floor=gh+BALL_R+stack;if(by[i]<floor){by[i]=floor;bvy[i]=Math.abs(bvy[i])*.13;bvx[i]*=.82;bvz[i]*=.82;if(slopeStamp[pi]!==slopeFrame){const eps=.7;slopeX[pi]=(terrain.supportY??terrain.groundHeight)(bx[i]+eps,bz[i])-(terrain.supportY??terrain.groundHeight)(bx[i]-eps,bz[i]);slopeZ[pi]=(terrain.supportY??terrain.groundHeight)(bx[i],bz[i]+eps)-(terrain.supportY??terrain.groundHeight)(bx[i],bz[i]-eps);slopeStamp[pi]=slopeFrame}const hx=slopeX[pi],hz=slopeZ[pi];if(Number.isFinite(hx))bvx[i]-=hx*.08;if(Number.isFinite(hz))bvz[i]-=hz*.08}}
      if((i%renderStride)===0&&rendered<MAX_RENDERED){dummy.position.set(bx[i],by[i],bz[i]);dummy.rotation.set(0,0,0);dummy.scale.setScalar(renderStride>1?.78:1);dummy.updateMatrix();mesh.setMatrixAt(rendered++,dummy.matrix);}
    }
    mesh.count=rendered;mesh.instanceMatrix.needsUpdate=true;
    probe.updateMs=performance.now()-updateStart;probe.count=count;probe.rendered=rendered;probe.renderStride=renderStride;
  }
  function applyField(center,{radius=4.2,strength=2.1,lift=.10}={}){
    if(!center||!Number.isFinite(center.x)||!Number.isFinite(center.z))return;
    const r=Math.max(.01,radius),r2=r*r;
    for(let i=0;i<count;i++){
      const dx=bx[i]-center.x,dz=bz[i]-center.z,d2=dx*dx+dz*dz;
      if(d2<=.0001||d2>=r2)continue;
      const d=Math.sqrt(d2),fall=1-d/r;
      // Tangential bias makes nearby grains circulate lazily; a weak radial
      // component keeps the field from collapsing into a perfect ring.
      const q=strength*fall;
      bvx[i]+=(-dz/d*q-dx/d*q*.10);
      bvz[i]+=( dx/d*q-dz/d*q*.10);
      bvy[i]+=lift*fall;
    }
  }
  function applyImpact(event){
    const c=event?.position,power=Math.max(.01,event?.radius??event?.power??0);if(!c||!power)return;
    const strength=event?.impulse??18;
    for(let i=0;i<count;i++){const dx=bx[i]-c.x,dy=by[i]-c.y,dz=bz[i]-c.z,d2=dx*dx+dy*dy+dz*dz;if(d2>=power*power||d2<=.0001)continue;const d=Math.sqrt(d2),fall=1-d/power,q=fall*strength/d;bvx[i]+=dx*q;bvy[i]+=Math.abs(dy*q)+strength*.55*fall;bvz[i]+=dz*q;}
  }
  function sampleDensity(x,z,radius=0){
    projection.fill(0);
    for(let i=0;i<count;i++){const qx=Math.floor((bx[i]-PROJECTION_MIN)/PROJECTION_SPAN*PROJECTION_GRID),qz=Math.floor((bz[i]-PROJECTION_MIN)/PROJECTION_SPAN*PROJECTION_GRID);if(qx>=0&&qx<PROJECTION_GRID&&qz>=0&&qz<PROJECTION_GRID)projection[qx+PROJECTION_GRID*qz]++}
    const cell=PROJECTION_SPAN/PROJECTION_GRID,r=Math.max(0,radius),minX=Math.max(0,Math.floor((x-r-PROJECTION_MIN)/cell)),maxX=Math.min(PROJECTION_GRID-1,Math.floor((x+r-PROJECTION_MIN)/cell)),minZ=Math.max(0,Math.floor((z-r-PROJECTION_MIN)/cell)),maxZ=Math.min(PROJECTION_GRID-1,Math.floor((z+r-PROJECTION_MIN)/cell));
    let grains=0,cells=0;
    for(let iz=minZ;iz<=maxZ;iz++)for(let ix=minX;ix<=maxX;ix++){const cx=PROJECTION_MIN+(ix+.5)*cell,cz=PROJECTION_MIN+(iz+.5)*cell;if(r&&((cx-x)*(cx-x)+(cz-z)*(cz-z)>r*r))continue;grains+=projection[ix+PROJECTION_GRID*iz];cells++;}
    return{grains,cells,cellSize:cell};
  }
  function snapshot(){return{count,bx:bx.slice(0,count),by:by.slice(0,count),bz:bz.slice(0,count),bvx:bvx.slice(0,count),bvy:bvy.slice(0,count),bvz:bvz.slice(0,count)}}
  function clear(){count=0;pile.fill(0);projection.fill(0);mesh.count=0;mesh.instanceMatrix.needsUpdate=true}
  function restore(state){clear();if(!state)return 0;count=Math.min(state.count??0,maxBearings);bx.set(state.bx.subarray(0,count));by.set(state.by.subarray(0,count));bz.set(state.bz.subarray(0,count));bvx.set(state.bvx.subarray(0,count));bvy.set(state.bvy.subarray(0,count));bvz.set(state.bvz.subarray(0,count));return count}
  const unsubscribe=impacts?.subscribe(applyImpact);
  return{entity,mesh,spawnBatch,spawnOne,update,applyField,applyImpact,sampleDensity,snapshot,clear,restore,dispose:()=>unsubscribe?.(),inspect:()=>({kind:"foundry-bearing-batch",count,maxBearings,radius:BALL_R,rendered:mesh.count,liquidCoupling:liquidFields.length,relativeDensity:BEARING_RELATIVE_DENSITY,probe:{...probe}})};
}
