export function createTransportBucketSystem({THREE,scene,terrain}){
  const N=48,SIZE=18,CELL=SIZE/N,MIN=-SIZE/2,COUNT=N*N,DT=.035;
  const mass=new Float32Array(COUNT),next=new Float32Array(COUNT),ground=new Float32Array(COUNT);
  const vx=new Float32Array(COUNT),vz=new Float32Array(COUNT),nextVx=new Float32Array(COUNT),nextVz=new Float32Array(COUNT);
  const pressure=new Float32Array(COUNT),div=new Float32Array(COUNT);
  const index=(x,z)=>x+N*z,wx=x=>MIN+(x+.5)*CELL,wz=z=>MIN+(z+.5)*CELL;
  const candidates=[
    {id:"A",name:"scalar carrier",law:"terrain-advected conserved scalar"},
    {id:"B",name:"shallow water",law:"depth plus horizontal momentum"},
    {id:"C",name:"incompressible grid",law:"projected velocity plus advected material"},
    {id:"D",name:"material parcels",law:"Lagrangian terrain-following parcels"},
    {id:"E",name:"field plus tracers",law:"authoritative shallow field plus passive tracers"},
    {id:"F",name:"cellular flux",law:"local surface-head volume exchange"}
  ];
  let candidate=0,enabled=false,lastNow=null,acc=0,steps=0,totalInjected=0,totalEscaped=0,displayDensity=25,sources=[{x:0,z:0,rate:.9}];
  const geometry=new THREE.BufferGeometry(),material=new THREE.MeshStandardMaterial({color:0x2d9fc2,transparent:true,opacity:.7,roughness:.25,metalness:0,depthWrite:false,side:THREE.DoubleSide});
  const surface=new THREE.Mesh(geometry,material);surface.name="transport-bucket-surface";surface.renderOrder=4;scene.add(surface);
  const P=1800,pp=new Float32Array(P*4),pv=new Float32Array(P*2);let pn=0,emitCarry=0;
  const pgeo=new THREE.SphereGeometry(.045,5,4),pmat=new THREE.MeshStandardMaterial({color:0x59bdd8,transparent:true,opacity:.75,roughness:.2}),parcels=new THREE.InstancedMesh(pgeo,pmat,P);parcels.count=0;parcels.frustumCulled=false;scene.add(parcels);
  const T=320,tr=new Float32Array(T*3);let tn=0,traceClock=0;
  const tgeo=new THREE.SphereGeometry(.035,5,4),tmat=new THREE.MeshBasicMaterial({color:0xc8f4ff,transparent:true,opacity:.8}),tracers=new THREE.InstancedMesh(tgeo,tmat,T);tracers.count=0;tracers.frustumCulled=false;scene.add(tracers);
  const dummy=new THREE.Object3D();
  function sampleGround(){for(let z=0;z<N;z++)for(let x=0;x<N;x++)ground[index(x,z)]=terrain.groundHeight(wx(x),wz(z));}
  function cell(x,z){return{x:THREE.MathUtils.clamp(Math.floor((x-MIN)/CELL),0,N-1),z:THREE.MathUtils.clamp(Math.floor((z-MIN)/CELL),0,N-1)}}
  function add(k,q,ux=0,uz=0){if(q<=0)return;next[k]+=q;nextVx[k]+=ux*q;nextVz[k]+=uz*q}
  function slope(x,z){const xm=Math.max(0,x-1),xp=Math.min(N-1,x+1),zm=Math.max(0,z-1),zp=Math.min(N-1,z+1),a=ground[index(xm,z)],b=ground[index(xp,z)],c=ground[index(x,zm)],d=ground[index(x,zp)];return{x:Number.isFinite(a)&&Number.isFinite(b)?(b-a)/Math.max(CELL,(xp-xm)*CELL):0,z:Number.isFinite(c)&&Number.isFinite(d)?(d-c)/Math.max(CELL,(zp-zm)*CELL):0}}
  function advect(momentum=.24,damp=.94,depthForce=0){
    next.fill(0);nextVx.fill(0);nextVz.fill(0);
    for(let z=0;z<N;z++)for(let x=0;x<N;x++){const k=index(x,z),m=mass[k];if(m<=1e-7||!Number.isFinite(ground[k]))continue;const s=slope(x,z);
      const xm=Math.max(0,x-1),xp=Math.min(N-1,x+1),zm=Math.max(0,z-1),zp=Math.min(N-1,z+1);
      const hx=(mass[index(xp,z)]-mass[index(xm,z)])/Math.max(1,xp-xm),hz=(mass[index(x,zp)]-mass[index(x,zm)])/Math.max(1,zp-zm);
      let ux=(vx[k]-s.x*momentum-hx*depthForce)*damp,uz=(vz[k]-s.z*momentum-hz*depthForce)*damp,sp=Math.hypot(ux,uz),lim=.88;if(sp>lim){ux*=lim/sp;uz*=lim/sp}
      const tx=x+ux,tz=z+uz;if(tx<0||tx>N-1||tz<0||tz>N-1){totalEscaped+=m;continue}
      const x0=Math.floor(tx),z0=Math.floor(tz),x1=Math.min(N-1,x0+1),z1=Math.min(N-1,z0+1),fx=tx-x0,fz=tz-z0;
      for(const [ix,iz,w] of [[x0,z0,(1-fx)*(1-fz)],[x1,z0,fx*(1-fz)],[x0,z1,(1-fx)*fz],[x1,z1,fx*fz]]){if(w<=0)continue;const j=index(ix,iz);if(Number.isFinite(ground[j]))add(j,m*w,ux,uz);else totalEscaped+=m*w}
    }
    for(let k=0;k<COUNT;k++){mass[k]=next[k];if(next[k]>1e-8){vx[k]=nextVx[k]/next[k];vz[k]=nextVz[k]/next[k]}else vx[k]=vz[k]=0}
  }
  function incompressible(){
    for(let z=1;z<N-1;z++)for(let x=1;x<N-1;x++){const k=index(x,z);if(!Number.isFinite(ground[k]))continue;const s=slope(x,z);vx[k]=(vx[k]-s.x*.09)*.985;vz[k]=(vz[k]-s.z*.09)*.985}
    pressure.fill(0);
    for(let q=0;q<8;q++){for(let z=1;z<N-1;z++)for(let x=1;x<N-1;x++){const k=index(x,z);div[k]=.5*(vx[index(x+1,z)]-vx[index(x-1,z)]+vz[index(x,z+1)]-vz[index(x,z-1)]);next[k]=(pressure[index(x-1,z)]+pressure[index(x+1,z)]+pressure[index(x,z-1)]+pressure[index(x,z+1)]-div[k])*.25}pressure.set(next)}
    for(let z=1;z<N-1;z++)for(let x=1;x<N-1;x++){const k=index(x,z);vx[k]-=.5*(pressure[index(x+1,z)]-pressure[index(x-1,z)]);vz[k]-=.5*(pressure[index(x,z+1)]-pressure[index(x,z-1)])}
    advect(0,.995,0);
  }
  function cellular(){
    next.set(mass);
    for(let z=0;z<N;z++)for(let x=0;x<N;x++){const k=index(x,z),m=mass[k];if(m<=1e-7||!Number.isFinite(ground[k]))continue;const head=ground[k]+m*.18;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,zz=z+dz;if(xx<0||xx>=N||zz<0||zz>=N){const q=Math.min(next[k],m*.035);next[k]-=q;totalEscaped+=q;continue}const j=index(xx,zz);if(!Number.isFinite(ground[j]))continue;const dh=head-(ground[j]+mass[j]*.18);if(dh>0){const q=Math.min(next[k],dh*.055,m*.18);next[k]-=q;next[j]+=q}}}mass.set(next)
  }
  function emitParcels(dt){for(const s of sources){emitCarry+=s.rate*dt*38;while(emitCarry>=1&&pn<P){emitCarry--;const i=pn++;pp[i*4]=s.x+(Math.random()-.5)*.12;pp[i*4+1]=s.z+(Math.random()-.5)*.12;pp[i*4+2]=0;pp[i*4+3]=0;totalInjected+=1/38}}}
  function stepParcels(dt){emitParcels(dt);for(let i=0;i<pn;i++){let x=pp[i*4],z=pp[i*4+1];const c=cell(x,z),s=slope(c.x,c.z);let ux=(pp[i*4+2]-s.x*.7)*.975,uz=(pp[i*4+3]-s.z*.7)*.975;const sp=Math.hypot(ux,uz);if(sp>2.1){ux*=2.1/sp;uz*=2.1/sp}x+=ux*dt*4;z+=uz*dt*4;pp[i*4]=x;pp[i*4+1]=z;pp[i*4+2]=ux;pp[i*4+3]=uz;if(x<MIN||x>-MIN||z<MIN||z>-MIN){pp[i*4]=999;totalEscaped+=1/38}}}
  function seedTracer(){if(tn>=T||!sources[0])return;const s=sources[0];tr[tn*3]=s.x;tr[tn*3+1]=s.z;tr[tn*3+2]=1;tn++}
  function stepTracers(dt){traceClock+=dt;if(traceClock>.12){traceClock=0;seedTracer()}for(let i=0;i<tn;i++){let x=tr[i*3],z=tr[i*3+1];const c=cell(x,z),k=index(c.x,c.z);x+=vx[k]*dt*10;z+=vz[k]*dt*10;tr[i*3]=x;tr[i*3+1]=z;tr[i*3+2]=Math.max(0,tr[i*3+2]-dt*.035)}}
  function inject(q=1,x=sources[0]?.x??0,z=sources[0]?.z??0){if(candidate===3){const old=sources[0];sources=[{x,z,rate:0}];emitCarry+=q*38;emitParcels(1);sources=old?[old]:[];return q}const c=cell(x,z),k=index(c.x,c.z);if(!Number.isFinite(ground[k]))return 0;mass[k]+=q;totalInjected+=q;return q}
  function step(){sampleGround();if(candidate===0)advect(.24,.94,0);else if(candidate===1)advect(.34,.985,.075);else if(candidate===2)incompressible();else if(candidate===3)stepParcels(DT);else if(candidate===4){advect(.32,.98,.055);stepTracers(DT)}else cellular();steps++}
  function refresh(){
    const pos=[],ind=[];let vi=0,stride=Math.max(1,Math.ceil((26-displayDensity)/5));
    if(candidate!==3)for(let z=0;z<N-1;z+=stride)for(let x=0;x<N-1;x+=stride){const x1=Math.min(N-1,x+stride),z1=Math.min(N-1,z+stride),ks=[index(x,z),index(x1,z),index(x1,z1),index(x,z1)];if(ks.some(k=>mass[k]<=1e-4||!Number.isFinite(ground[k])))continue;for(const k of ks){const ix=k%N,iz=Math.floor(k/N),h=ground[k]+.012+Math.min(.55,mass[k]*.16);pos.push(wx(ix),h,wz(iz))}ind.push(vi,vi+1,vi+2,vi,vi+2,vi+3);vi+=4}
    geometry.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));geometry.setIndex(ind);if(pos.length)geometry.computeVertexNormals();geometry.computeBoundingSphere();surface.visible=enabled&&candidate!==3;
    parcels.visible=enabled&&candidate===3;parcels.count=parcels.visible?pn:0;if(parcels.visible){for(let i=0;i<pn;i++){const x=pp[i*4],z=pp[i*4+1];if(x===999){dummy.scale.setScalar(0)}else{const y=terrain.groundHeight(x,z)+.06;dummy.position.set(x,y,z);dummy.scale.setScalar(1)}dummy.updateMatrix();parcels.setMatrixAt(i,dummy.matrix)}parcels.instanceMatrix.needsUpdate=true}
    tracers.visible=enabled&&candidate===4;tracers.count=tracers.visible?tn:0;if(tracers.visible){for(let i=0;i<tn;i++){const x=tr[i*3],z=tr[i*3+1],y=terrain.groundHeight(x,z)+.075;dummy.position.set(x,y,z);dummy.scale.setScalar(tr[i*3+2]);dummy.updateMatrix();tracers.setMatrixAt(i,dummy.matrix)}tracers.instanceMatrix.needsUpdate=true}
  }
  function update(now){if(!enabled){lastNow=now;return}if(lastNow==null)lastNow=now;acc+=Math.min(.15,Math.max(0,(now-lastNow)/1000));lastNow=now;while(acc>=DT){if(candidate!==3)for(const s of sources)inject(s.rate*DT,s.x,s.z);step();acc-=DT}refresh()}
  function reset(){mass.fill(0);vx.fill(0);vz.fill(0);pressure.fill(0);pn=tn=0;emitCarry=traceClock=0;totalInjected=totalEscaped=steps=0;acc=0;sampleGround();refresh()}
  function setCandidate(v){const i=typeof v==="string"?candidates.findIndex(c=>c.id===v.toUpperCase()):v|0;if(i<0||i>=candidates.length)throw new Error("Unknown transport candidate");candidate=i;reset();return inspect().candidate}
  function cycleCandidate(){return setCandidate((candidate+1)%candidates.length)}
  function setEnabled(v){enabled=!!v;lastNow=null;refresh();return enabled}
  function setSource({x=sources[0]?.x??0,z=sources[0]?.z??0,rate=sources[0]?.rate??0}={}){sources=[{x,z,rate:Math.max(0,rate)}];return{...sources[0]}}
  function setSources(a=[]){sources=a.map(s=>({x:s.x??0,z:s.z??0,rate:Math.max(0,s.rate??0)}));return sources.map(s=>({...s}))}
  function fillRegion({x=0,z=0,radius=1,amount=1}={}){let n=0;for(let iz=0;iz<N;iz++)for(let ix=0;ix<N;ix++){if(Math.hypot(wx(ix)-x,wz(iz)-z)<=radius&&Number.isFinite(ground[index(ix,iz)]))n++}if(!n)return 0;for(let iz=0;iz<N;iz++)for(let ix=0;ix<N;ix++)if(Math.hypot(wx(ix)-x,wz(iz)-z)<=radius)inject(amount/n,wx(ix),wz(iz));return amount}
  function cycleDisplayDensity(){displayDensity=displayDensity>=25?1:displayDensity+1;refresh();return inspect().display}
  function setDisplayDensity(v){displayDensity=THREE.MathUtils.clamp(v|0,1,25);refresh();return inspect().display}
  function inspect(){let stored=0,wet=0,max=0;for(const m of mass){stored+=m;if(m>1e-5)wet++;max=Math.max(max,m)}if(candidate===3)stored=(pn*1/38)-totalEscaped;return{kind:"transport-candidate-bucket",candidate:{...candidates[candidate],index:candidate},candidates:candidates.map(c=>({...c})),enabled,grid:[N,N],cellSize:CELL,sources:sources.map(s=>({...s})),display:{density:displayDensity,level:displayDensity,max:25},mass:{injected:totalInjected,stored,escaped:totalEscaped,error:totalInjected-stored-totalEscaped},wetCells:wet,maxCellMass:max,parcels:candidate===3?pn:0,tracers:candidate===4?tn:0,steps}}
  sampleGround();refresh();
  return{update,setEnabled,reset,inject,fillRegion,setSource,setSources,setCandidate,cycleCandidate,cycleDisplayDensity,setDisplayDensity,inspect,object:surface};
}
