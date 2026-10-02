export function createTransportSystem({THREE,scene,terrain,supportHeight=null,name="transport-free-surface",verticalOffset=.055}){
  const N=48,SIZE=18,CELL=SIZE/N,MIN=-SIZE/2,COUNT=N*N,DT=.035,FLOW=.42;
  const mass=new Float32Array(COUNT),next=new Float32Array(COUNT),ground=new Float32Array(COUNT),vx=new Float32Array(COUNT),vz=new Float32Array(COUNT),nextVx=new Float32Array(COUNT),nextVz=new Float32Array(COUNT);
  const index=(x,z)=>x+N*z,worldX=x=>MIN+(x+.5)*CELL,worldZ=z=>MIN+(z+.5)*CELL;
  let totalInjected=0,totalEscaped=0,steps=0,enabled=false,lastNow=null,accumulator=0,sources=[{x:-5.4,z:0,rate:.9}],displayDensity=25;
  const support=(x,z)=>supportHeight?supportHeight(x,z):terrain.groundHeight(x,z);
  function sampleGround(){for(let z=0;z<N;z++)for(let x=0;x<N;x++)ground[index(x,z)]=support(worldX(x),worldZ(z));}
  sampleGround();
  const geometry=new THREE.BufferGeometry();
  const material=new THREE.MeshStandardMaterial({color:0x2d9fc2,transparent:true,opacity:.72,roughness:.22,metalness:0,depthWrite:false,side:THREE.DoubleSide,vertexColors:true});
  const surface=new THREE.Mesh(geometry,material);surface.name=name;surface.frustumCulled=false;surface.renderOrder=4;scene.add(surface);
  function refreshPresentation(){
    const stride=Math.max(1,Math.ceil((26-displayDensity)/5)),pos=[],col=[],ind=[];let vi=0;
    for(let z=0;z<N-1;z+=stride)for(let x=0;x<N-1;x+=stride){
      const x1=Math.min(N-1,x+stride),z1=Math.min(N-1,z+stride),ks=[index(x,z),index(x1,z),index(x1,z1),index(x,z1)];
      if(ks.some(k=>mass[k]<=1e-4||!Number.isFinite(ground[k])))continue;
      for(const k of ks){const ix=k%N,iz=Math.floor(k/N),m=mass[k],speed=Math.hypot(vx[k],vz[k]),wave=.018*Math.sin(steps*.23+ix*.9+iz*.57+speed*2.5);pos.push(worldX(ix),ground[k]+verticalOffset+Math.min(.48,m*.12)+wave,worldZ(iz));const q=Math.min(1,Math.sqrt(m*.45)+speed*.12);col.push(.08+.12*q,.42+.38*q,.62+.32*q)}
      ind.push(vi,vi+1,vi+2,vi,vi+2,vi+3);vi+=4;
    }
    geometry.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));geometry.setAttribute("color",new THREE.Float32BufferAttribute(col,3));geometry.setIndex(ind);if(pos.length)geometry.computeVertexNormals();geometry.computeBoundingSphere();surface.visible=enabled;
  }
  function nearestCell(x,z){return{x:THREE.MathUtils.clamp(Math.floor((x-MIN)/CELL),0,N-1),z:THREE.MathUtils.clamp(Math.floor((z-MIN)/CELL),0,N-1)}}
  function inject(amount=1,x=sources[0]?.x??0,z=sources[0]?.z??0){const c=nearestCell(x,z),k=index(c.x,c.z);if(!Number.isFinite(ground[k]))return 0;mass[k]+=amount;totalInjected+=amount;return amount}
  function step(){
    sampleGround();next.fill(0);nextVx.fill(0);nextVz.fill(0);
    for(let z=0;z<N;z++)for(let x=0;x<N;x++){const k=index(x,z),m=mass[k],g=ground[k];if(m<=1e-7||!Number.isFinite(g))continue;
      const xm=Math.max(0,x-1),xp=Math.min(N-1,x+1),zm=Math.max(0,z-1),zp=Math.min(N-1,z+1),gx=(ground[index(xp,z)]-ground[index(xm,z)])/Math.max(CELL,(xp-xm)*CELL),gz=(ground[index(x,zp)]-ground[index(x,zm)])/Math.max(CELL,(zp-zm)*CELL);
      let ux=(vx[k]-gx*.24)*.94,uz=(vz[k]-gz*.24)*.94;const speed=Math.hypot(ux,uz),maxSpeed=.82;if(speed>maxSpeed){ux*=maxSpeed/speed;uz*=maxSpeed/speed}
      const tx=THREE.MathUtils.clamp(x+ux,0,N-1),tz=THREE.MathUtils.clamp(z+uz,0,N-1),x0=Math.floor(tx),z0=Math.floor(tz),x1=Math.min(N-1,x0+1),z1=Math.min(N-1,z0+1),fx=tx-x0,fz=tz-z0;
      for(const [ix,iz,w] of [[x0,z0,(1-fx)*(1-fz)],[x1,z0,fx*(1-fz)],[x0,z1,(1-fx)*fz],[x1,z1,fx*fz]]){if(w<=0)continue;const j=index(ix,iz);if(!Number.isFinite(ground[j])){totalEscaped+=m*w;continue}const q=m*w;next[j]+=q;nextVx[j]+=ux*q;nextVz[j]+=uz*q}
    }
    for(let k=0;k<COUNT;k++){mass[k]=next[k];if(next[k]>1e-8){vx[k]=nextVx[k]/next[k];vz[k]=nextVz[k]/next[k]}else{vx[k]=0;vz[k]=0}}
    steps++;
  }
  function update(now){if(!enabled){lastNow=now;return}if(lastNow==null)lastNow=now;accumulator+=Math.min(.15,Math.max(0,(now-lastNow)/1000));lastNow=now;while(accumulator>=DT){for(const source of sources)inject(source.rate*DT,source.x,source.z);step();accumulator-=DT}refreshPresentation()}
  function setEnabled(v){enabled=!!v;surface.visible=enabled;lastNow=null;return enabled}
  function reset(){mass.fill(0);vx.fill(0);vz.fill(0);totalInjected=0;totalEscaped=0;steps=0;accumulator=0;sampleGround();refreshPresentation()}
  function setSource({x=sources[0]?.x??0,z=sources[0]?.z??0,rate=sources[0]?.rate??0}={}){sources=[{x,z,rate:Math.max(0,rate)}];return{...sources[0]}}
  function fillRegion({x=0,z=0,radius=1,amount=1}={}){let cells=[];for(let iz=0;iz<N;iz++)for(let ix=0;ix<N;ix++){const wx=worldX(ix),wz=worldZ(iz),k=index(ix,iz);if(Number.isFinite(ground[k])&&Math.hypot(wx-x,wz-z)<=radius)cells.push(k)}if(!cells.length)return 0;const each=amount/cells.length;for(const k of cells)mass[k]+=each;totalInjected+=amount;refreshPresentation();return amount}
  function setSources(next=[]){sources=next.map(({x=0,z=0,rate=0})=>({x,z,rate:Math.max(0,rate)}));return sources.map(s=>({...s}))}
  function cycleDisplayDensity(){displayDensity=displayDensity>=25?1:displayDensity+1;refreshPresentation();return inspect().display}
  function setDisplayDensity(level){displayDensity=THREE.MathUtils.clamp(level|0,1,25);refreshPresentation();return inspect().display}
  function inspect(){let stored=0,wet=0,max=0;for(const m of mass){stored+=m;if(m>1e-5)wet++;max=Math.max(max,m)}return{kind:"surface-mass-flux-field",enabled,grid:[N,N],cellSize:CELL,sources:sources.map(s=>({...s})),display:{density:displayDensity,level:displayDensity,max:25},mass:{injected:totalInjected,stored,escaped:totalEscaped,error:totalInjected-stored-totalEscaped},wetCells:wet,maxCellMass:max,steps}}
  refreshPresentation();
  return{update,setEnabled,reset,inject,fillRegion,setSource,setSources,cycleDisplayDensity,setDisplayDensity,inspect,object:surface};
}