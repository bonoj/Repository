// Independent liquid candidate: depth-averaged shallow water over mutable Crucible terrain.
// This module intentionally imports no scalar-carrier/transport machinery.
export function createShallowWaterSystem({THREE,scene,terrain,kind="water",look=null,initialViscosity=1}){
  const N=64,SIZE=18,DX=SIZE/N,MIN=-SIZE/2,G=9.81,CFL=.32,MAX_DT=.012,DRY=1e-4;
  const K=N*N,idx=(x,z)=>x+N*z,wx=x=>MIN+(x+.5)*DX,wz=z=>MIN+(z+.5)*DX;
  const h=new Float32Array(K),hu=new Float32Array(K),hv=new Float32Array(K),bed=new Float32Array(K);
  const nh=new Float32Array(K),nhu=new Float32Array(K),nhv=new Float32Array(K);
  const wallNx=new Float32Array(K),wallNz=new Float32Array(K),wallNear=new Uint8Array(K);
  function cacheBoundary(){for(let z=0;z<N;z++)for(let x=0;x<N;x++){const k=idx(x,z),b=terrain.materialBoundary(wx(x),wz(z));wallNx[k]=b.nx;wallNz[k]=b.nz;wallNear[k]=b.inside&&b.distance<=DX*1.5?1:0;}}
  let enabled=false,lastNow=null,acc=0,steps=0,probeFrame={substeps:0,minDt:0,maxDt:0,remainingAcc:0,solveMs:0},presentationProbe={refreshMs:0,vertices:0,triangles:0,sideTriangles:0},totalInjected=0,totalEscaped=0,totalDryLoss=0,displayDensity=25,lastRefresh=0; const presentationEta=new Float32Array(K),presentationSupport=new Uint8Array(K);
  let sources=[],viscosityLevel=THREE.MathUtils.clamp(initialViscosity|0,1,26);

  const geometry=new THREE.BufferGeometry();
  const material=new THREE.MeshBasicMaterial({color:look?.color??0x318fb2,vertexColors:!!look?.depthAccents,transparent:true,opacity:look?.opacity??.72,depthWrite:false,side:THREE.DoubleSide});
  const surface=new THREE.Mesh(geometry,material);surface.name=`shallow-${kind}-free-surface`;surface.renderOrder=4;scene.add(surface);
  const waterLooks=[
    ["A",0x07191d,.10],["B",0x173b45,.18],["C",0x315f69,.25],["D",0x174d59,.35],["E",0x245565,.45],["F",0x173d4a,.60],["G",0x102a30,.78],["H",0x071b20,.92],
    ["I",0x78949a,.12],["J",0x3b8290,.22],["K",0x386b5d,.32],["L",0x17636a,.42],["M",0x526f78,.52],["N",0x287c91,.62],["O",0x68745e,.72],["P",0x29383a,.85],
    ["Q",0xb7c9c8,.08],["R",0x2a91a8,.15],["S",0x0b2228,.25],["T",0x53624b,.40],["U",0x9bb8b7,.60],["V",0x24454d,.70],["W",0x0d3438,.88],["X",0x56b8c4,.30],["Y",0x59656a,.50],["Z",0x11191b,.95]
  ];let waterLookIndex=11;
  function applyWaterLook(){const [letter,color,opacity]=waterLooks[waterLookIndex];material.color.setHex(color);material.opacity=opacity;material.needsUpdate=true;return{letter,color:"#"+color.toString(16).padStart(6,"0"),opacity}}
  function cycleWaterLook(){waterLookIndex=(waterLookIndex+1)%waterLooks.length;return applyWaterLook()}
  if(look){material.color.setHex(look.color??0x318fb2);material.opacity=look.opacity??.72}else applyWaterLook();
  // Cheap cutaway companion: the solver already knows the water column. Render that
  // knowledge only where the finite material octagon exposes its side.
  const sideGeometry=new THREE.BufferGeometry();
  const sideMaterial=new THREE.MeshBasicMaterial({color:look?.sideColor??0x245f73,transparent:true,opacity:look?.sideOpacity??.5,depthWrite:false,side:THREE.DoubleSide});
  const waterSide=new THREE.Mesh(sideGeometry,sideMaterial);waterSide.name=`shallow-${kind}-boundary-curtain`;waterSide.renderOrder=3;scene.add(waterSide);

  function sampleBed(){for(let z=0;z<N;z++)for(let x=0;x<N;x++){const k=idx(x,z),px=wx(x),pz=wz(z);bed[k]=terrain.materialBoundary(px,pz).inside?terrain.groundHeightExact(px,pz):-Infinity}}
  const valid=k=>Number.isFinite(bed[k]);
  function cell(x,z){return{x:THREE.MathUtils.clamp(Math.floor((x-MIN)/DX),0,N-1),z:THREE.MathUtils.clamp(Math.floor((z-MIN)/DX),0,N-1)}}
  function addWater(q,x,z){if(!(q>0))return 0;const c=cell(x,z),k=idx(c.x,c.z);if(!valid(k))return 0;h[k]+=q/(DX*DX);totalInjected+=q;return q}

  // Hydrostatic reconstruction: reconstruct depths against the higher bed at an interface.
  // This preserves lake-at-rest much better than treating bed slope as a separate scalar force.
  function fluxX(kL,kR){
    const bL=bed[kL],bR=bed[kR],etaL=bL+h[kL],etaR=bR+h[kR],bs=Math.max(bL,bR);
    const HL=Math.max(0,etaL-bs),HR=Math.max(0,etaR-bs);
    const uL=h[kL]>DRY?hu[kL]/h[kL]:0,vL=h[kL]>DRY?hv[kL]/h[kL]:0;
    const uR=h[kR]>DRY?hu[kR]/h[kR]:0,vR=h[kR]>DRY?hv[kR]/h[kR]:0;
    const a=Math.max(Math.abs(uL)+Math.sqrt(G*HL),Math.abs(uR)+Math.sqrt(G*HR));
    return{flux:[
      .5*(HL*uL+HR*uR)-.5*a*(HR-HL),
      .5*(HL*uL*uL+.5*G*HL*HL+HR*uR*uR+.5*G*HR*HR)-.5*a*(HR*uR-HL*uL),
      .5*(HL*uL*vL+HR*uR*vR)-.5*a*(HR*vR-HL*vL)
    ],pressureL:.5*G*(h[kL]*h[kL]-HL*HL),pressureR:.5*G*(h[kR]*h[kR]-HR*HR)};
  }
  function fluxZ(kD,kU){
    const bD=bed[kD],bU=bed[kU],etaD=bD+h[kD],etaU=bU+h[kU],bs=Math.max(bD,bU);
    const HD=Math.max(0,etaD-bs),HU=Math.max(0,etaU-bs);
    const uD=h[kD]>DRY?hu[kD]/h[kD]:0,vD=h[kD]>DRY?hv[kD]/h[kD]:0;
    const uU=h[kU]>DRY?hu[kU]/h[kU]:0,vU=h[kU]>DRY?hv[kU]/h[kU]:0;
    const a=Math.max(Math.abs(vD)+Math.sqrt(G*HD),Math.abs(vU)+Math.sqrt(G*HU));
    return{flux:[
      .5*(HD*vD+HU*vU)-.5*a*(HU-HD),
      .5*(HD*uD*vD+HU*uU*vU)-.5*a*(HU*uU-HD*uD),
      .5*(HD*vD*vD+.5*G*HD*HD+HU*vU*vU+.5*G*HU*HU)-.5*a*(HU*vU-HD*vD)
    ],pressureD:.5*G*(h[kD]*h[kD]-HD*HD),pressureU:.5*G*(h[kU]*h[kU]-HU*HU)};
  }
  function stableDt(){
    let s=0;for(let k=0;k<K;k++)if(h[k]>DRY&&valid(k)){const u=hu[k]/h[k],v=hv[k]/h[k];s=Math.max(s,Math.abs(u)+Math.sqrt(G*h[k]),Math.abs(v)+Math.sqrt(G*h[k]))}
    return s>1e-6?Math.min(MAX_DT,CFL*DX/s):MAX_DT;
  }
  function solve(dt){
    nh.set(h);nhu.set(hu);nhv.set(hv);
    const scale=dt/DX;
    for(let z=0;z<N;z++)for(let x=0;x<N-1;x++){
      const L=idx(x,z),R=idx(x+1,z);if(!valid(L)||!valid(R))continue;const q=fluxX(L,R),f=q.flux;
      nh[L]-=scale*f[0];nhu[L]-=scale*(f[1]+q.pressureL);nhv[L]-=scale*f[2];
      nh[R]+=scale*f[0];nhu[R]+=scale*(f[1]+q.pressureR);nhv[R]+=scale*f[2];
    }
    for(let z=0;z<N-1;z++)for(let x=0;x<N;x++){
      const D=idx(x,z),U=idx(x,z+1);if(!valid(D)||!valid(U))continue;const q=fluxZ(D,U),f=q.flux;
      nh[D]-=scale*f[0];nhu[D]-=scale*f[1];nhv[D]-=scale*(f[2]+q.pressureD);
      nh[U]+=scale*f[0];nhu[U]+=scale*f[1];nhv[U]+=scale*(f[2]+q.pressureU);
    }
    // Bed pressure is balanced at each reconstructed interface above. Keeping a
    // second centered -g*h*grad(bed) source here double-counts the slope and
    // destroys the lake-at-rest balance on steep terrain.
    for(let k=0;k<K;k++){
      if(!valid(k)){h[k]=hu[k]=hv[k]=0;continue}
      h[k]=Math.max(0,nh[k]);
      if(h[k]<=DRY){h[k]=hu[k]=hv[k]=0}else{const drag=.22*Math.pow(2,(viscosityLevel-1)/3),damp=Math.exp(-drag*dt);hu[k]=nhu[k]*damp;hv[k]=nhv[k]*damp;const sp=Math.hypot(hu[k]/h[k],hv[k]/h[k]),max=12;if(sp>max){hu[k]*=max/sp;hv[k]*=max/sp}}
    }
    // The material octagon is a geometric slip wall. State remains Cartesian, but
    // boundary-cell momentum obeys the actual nearest octagonal plane normal.
    for(let z=0;z<N;z++)for(let x=0;x<N;x++){const k=idx(x,z);if(!valid(k)||h[k]<=DRY)continue;
      if(!wallNear[k])continue;const nx=wallNx[k],nz=wallNz[k];
      const un=(hu[k]*nx+hv[k]*nz)/h[k];if(un>0){hu[k]-=h[k]*un*nx;hv[k]-=h[k]*un*nz;}
    }
    steps++;
  }
  // Presentation reconstruction is deliberately finer than the solver grid.
  // Solver cells are measurements/state; they are not render polygons.
  const SURFACE_SUBDIV=1,SURFACE_STEP=DX/SURFACE_SUBDIV,SURFACE_MIN=MIN+DX*.5,SURFACE_MAX=MIN+SIZE-DX*.5;
  function buildPresentation(){
    for(let z=0;z<N;z++)for(let x=0;x<N;x++){
      let sum=0,w=0,count=0;
      for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){
        const ix=x+dx,iz=z+dz;if(ix<0||iz<0||ix>=N||iz>=N)continue;
        const k=idx(ix,iz);if(!valid(k)||h[k]<=DRY)continue;
        const q=(dx===0&&dz===0)?4:(dx===0||dz===0)?2:1;
        sum+=(bed[k]+h[k])*q;w+=q;count++;
      }
      const k=idx(x,z);presentationEta[k]=w?sum/w:(valid(k)?bed[k]+h[k]:0);presentationSupport[k]=count;
    }
  }
  function renderSample(x,z){
    const gx=(x-MIN)/DX-.5,gz=(z-MIN)/DX-.5,x0=Math.floor(gx),z0=Math.floor(gz),fx=gx-x0,fz=gz-z0;
    if(x0<0||z0<0||x0>=N-1||z0>=N-1)return{depth:0,surface:NaN};
    const cells=[[x0,z0,(1-fx)*(1-fz)],[x0+1,z0,fx*(1-fz)],[x0,z0+1,(1-fx)*fz],[x0+1,z0+1,fx*fz]];
    let depth=0,eta=0,smooth=0,w=0,support=0;
    for(const[ix,iz,q]of cells){const k=idx(ix,iz);if(!valid(k)||h[k]<=DRY)continue;depth+=h[k]*q;eta+=(bed[k]+h[k])*q;smooth+=presentationEta[k]*q;support+=presentationSupport[k]*q;w+=q}
    if(w<=1e-8)return{depth,surface:NaN};
    const raw=eta/w,sm=smooth/w;
    // Interior gets the calm presentation skin; smoothing fades aggressively at
    // sparse wet boundaries so isolated shoreline vertices cannot form tents.
    const blend=.72*THREE.MathUtils.smoothstep(support/w,3,7);
    return{depth,surface:THREE.MathUtils.lerp(raw,sm,blend)};
  }
  function supported(x,z){return terrain.materialBoundary(x,z).inside}
  function supportBoundary(a,b){
    let lo={...a},hi={...b},loIn=supported(lo.x,lo.z);
    if(loIn===supported(hi.x,hi.z))return loIn?hi:lo;
    if(!loIn){const q=lo;lo=hi;hi=q;loIn=true}
    for(let i=0;i<8;i++){const m={x:(lo.x+hi.x)*.5,z:(lo.z+hi.z)*.5};if(supported(m.x,m.z))lo=m;else hi=m}
    const rs=renderSample(lo.x,lo.z);return{x:lo.x,z:lo.z,y:rs.surface};
  }
  function wetBoundary(a,b){
    const da=a.depth-DRY,db=b.depth-DRY,t=THREE.MathUtils.clamp(da/(da-db),0,1),x=THREE.MathUtils.lerp(a.x,b.x,t),z=THREE.MathUtils.lerp(a.z,b.z,t),rs=renderSample(x,z);
    return{x,z,y:rs.surface,depth:DRY};
  }
  function clipWet(poly){
    const out=[];if(!poly.length)return out;let a=poly.at(-1),ain=a.depth>DRY;
    for(const b of poly){const bin=b.depth>DRY;if(ain!==bin)out.push(wetBoundary(a,b));if(bin)out.push(b);a=b;ain=bin}return out;
  }
  function clipSupport(poly){
    const out=[];if(!poly.length)return out;let a=poly.at(-1),ain=supported(a.x,a.z);
    for(const b of poly){const bin=supported(b.x,b.z);if(ain!==bin)out.push(supportBoundary(a,b));if(bin)out.push(b);a=b;ain=bin}return out;
  }
  // Visibility is finer than hydrodynamic state: a ridge can exist between two
  // valid wet solver samples. Clip reconstructed surface polygons against the exact
  // terrain surface instead of forcing the shallow-water grid to represent that ridge.
  const terrainClearance=p=>p.y-terrain.groundHeightExact(p.x,p.z);
  function terrainBoundary(a,b){
    let lo={...a},hi={...b},loClear=terrainClearance(lo);
    if((loClear>=0)===(terrainClearance(hi)>=0))return loClear>=0?hi:lo;
    if(loClear<0){const q=lo;lo=hi;hi=q;loClear=terrainClearance(lo)}
    for(let i=0;i<8;i++){
      const m={x:(lo.x+hi.x)*.5,z:(lo.z+hi.z)*.5,y:(lo.y+hi.y)*.5,depth:(lo.depth+hi.depth)*.5};
      if(terrainClearance(m)>=0)lo=m;else hi=m;
    }
    return lo;
  }
  function clipTerrain(poly){
    const out=[];if(!poly.length)return out;let a=poly.at(-1),ain=terrainClearance(a)>=0;
    for(const b of poly){const bin=terrainClearance(b)>=0;if(ain!==bin)out.push(terrainBoundary(a,b));if(bin)out.push(b);a=b;ain=bin}return out;
  }
  function refresh(){
    const refreshStart=performance.now();
    buildPresentation();
    const pos=[],colors=[],ind=[],sidePos=[],sideInd=[];let vi=0,sideVi=0;
    const samples=new Map(),sample=(x,z)=>{const key=x.toFixed(6)+","+z.toFixed(6);if(samples.has(key))return samples.get(key);const r=renderSample(x,z),p={x,z,y:r.surface,depth:r.depth};samples.set(key,p);return p};
    const sideEdges=new Map();
    const edgeKey=(a,b)=>{const ak=a.x.toFixed(6)+","+a.z.toFixed(6),bk=b.x.toFixed(6)+","+b.z.toFixed(6);return ak<bk?ak+"|"+bk:bk+"|"+ak};
    const onMaterialEdge=p=>Math.abs(terrain.materialBoundary(p.x,p.z).distance)<SURFACE_STEP*.08;
    const rememberSideEdges=poly=>{for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];if(!onMaterialEdge(a)||!onMaterialEdge(b))continue;const key=edgeKey(a,b);if(sideEdges.has(key))sideEdges.delete(key);else sideEdges.set(key,[a,b])}};
    const emit=poly=>{
      if(poly.length<3)return;
      // Validate the whole clipped polygon before mutating shared geometry. A failed
      // sample must never leave partial vertices behind for later patches.
      const verts=[];
      for(const p of poly){
        let y=p.y;if(!Number.isFinite(y))y=renderSample(p.x,p.z).surface;
        if(!Number.isFinite(y))return;
        verts.push({x:p.x,y,z:p.z});
      }
      // Every polygon originates inside one SURFACE_STEP triangle. Reject impossible
      // spans rather than allowing disconnected wet components to acquire a bridge.
      const maxSpan=SURFACE_STEP*1.5,maxSpan2=maxSpan*maxSpan;
      for(let i=0;i<verts.length;i++)for(let j=i+1;j<verts.length;j++){
        const dx=verts[i].x-verts[j].x,dz=verts[i].z-verts[j].z;
        if(dx*dx+dz*dz>maxSpan2)return;
      }
      const base=vi;for(const p of verts){
        pos.push(p.x,p.y,p.z);
        if(look?.depthAccents){
          const rs=renderSample(p.x,p.z),flow={depth:0,u:0,v:0};flowInto(p.x,p.z,flow);
          const depth=Math.max(0,rs.depth),speed=Math.hypot(flow.u,flow.v);
          const edge=1-THREE.MathUtils.smoothstep(depth,.025,.28),moving=THREE.MathUtils.smoothstep(speed,.08,.8);
          const heat=THREE.MathUtils.clamp(edge*.82+moving*.28,0,1);
          const cold=new THREE.Color(look.deepColor??0x260300),hot=new THREE.Color(look.hotColor??0xff8a18);
          cold.lerp(hot,heat);colors.push(cold.r,cold.g,cold.b);
        }
        vi++
      }
      for(let j=1;j+1<verts.length;j++)ind.push(base,base+j+1,base+j);
      rememberSideEdges(verts);
    };
    for(let z=SURFACE_MIN;z<SURFACE_MAX-1e-6;z+=SURFACE_STEP)for(let x=SURFACE_MIN;x<SURFACE_MAX-1e-6;x+=SURFACE_STEP){
      const x1=Math.min(SURFACE_MAX,x+SURFACE_STEP),z1=Math.min(SURFACE_MAX,z+SURFACE_STEP),a=sample(x,z),b=sample(x1,z),cc=sample(x1,z1),d=sample(x,z1);
      emit(clipTerrain(clipSupport(clipWet([a,b,cc]))));emit(clipTerrain(clipSupport(clipWet([a,cc,d]))));
    }
    for(const [a,b] of sideEdges.values()){
      const ba=terrain.groundHeight(a.x,a.z),bb=terrain.groundHeight(b.x,b.z);if(!Number.isFinite(ba)||!Number.isFinite(bb))continue;
      const base=sideVi;sidePos.push(a.x,ba,a.z,a.x,a.y,a.z,b.x,b.y,b.z,b.x,bb,b.z);sideInd.push(base,base+1,base+2,base,base+2,base+3);sideVi+=4;
    }
    geometry.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));if(look?.depthAccents)geometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));geometry.setIndex(ind);geometry.computeBoundingSphere();surface.visible=enabled;
    sideGeometry.setAttribute("position",new THREE.Float32BufferAttribute(sidePos,3));sideGeometry.setIndex(sideInd);sideGeometry.computeBoundingSphere();waterSide.visible=enabled&&sidePos.length>0;
    presentationProbe={refreshMs:performance.now()-refreshStart,vertices:pos.length/3,triangles:ind.length/3,sideTriangles:sideInd.length/3};
  }
  function update(now){
    if(!enabled){lastNow=now;return}if(lastNow==null)lastNow=now;
    acc+=Math.min(.05,Math.max(0,(now-lastNow)/1000));lastNow=now;
    sampleBed();
    let guard=0,minDt=Infinity,maxDt=0;
    const probeStart=performance.now();
    while(acc>1e-5&&guard++<16){const dt=Math.min(acc,stableDt());minDt=Math.min(minDt,dt);maxDt=Math.max(maxDt,dt);for(const s of sources)if(s.remaining==null||s.remaining>0)addWater(s.rate*dt,s.x,s.z);for(const s of sources)if(s.remaining!=null)s.remaining=Math.max(0,s.remaining-dt);sources=sources.filter(s=>s.remaining==null||s.remaining>0);solve(dt);acc-=dt;}
    probeFrame={substeps:guard,minDt:Number.isFinite(minDt)?minDt:0,maxDt,remainingAcc:acc,solveMs:performance.now()-probeStart};
    // The frozen-surface probe showed reconstruction is not the dominant frame cost.
    // Restore live presentation while solver cadence instrumentation remains isolated above.
    if(now-lastRefresh>=33){refresh();lastRefresh=now;}
  }
  function reset(){h.fill(0);hu.fill(0);hv.fill(0);totalInjected=totalEscaped=totalDryLoss=steps=0;acc=0;sampleBed();refresh()}
  function setEnabled(v){enabled=!!v;lastNow=null;refresh();return enabled}
  function setSource({x=0,z=0,rate=.9}={}){sources=[{x,z,rate:Math.max(0,rate)}];return{...sources[0]}}
  function setSources(a=[]){sources=a.map(s=>({x:s.x??0,z:s.z??0,rate:Math.max(0,s.rate??0)}));return sources.map(s=>({...s}))}
  function addTimedSource({x=0,z=0,rate=.9,duration=3}={}){const source={x,z,rate:Math.max(0,rate),remaining:Math.max(0,duration)};sources.push(source);return{...source}}
  function inject(q=1,x=0,z=0){return addWater(q,x,z)}
  function fillRegion({x=0,z=0,radius=1,amount=1}={}){const cells=[];for(let iz=0;iz<N;iz++)for(let ix=0;ix<N;ix++)if(Math.hypot(wx(ix)-x,wz(iz)-z)<=radius&&valid(idx(ix,iz)))cells.push(idx(ix,iz));if(!cells.length)return 0;const dh=amount/(cells.length*DX*DX);for(const k of cells)h[k]+=dh;totalInjected+=amount;return amount}
  function cycleViscosity(){viscosityLevel=viscosityLevel>=26?1:viscosityLevel+1;return{level:viscosityLevel,drag:.22*Math.pow(2,(viscosityLevel-1)/3)}}
  function cycleDisplayDensity(){displayDensity=displayDensity>=25?1:displayDensity+1;refresh();return inspect().display}
  function setDisplayDensity(v){displayDensity=THREE.MathUtils.clamp(v|0,1,25);refresh();return inspect().display}
  // Scalar field: cheap liquid free-surface truth at a world column.
  // NaN means this column has no liquid support. This deliberately does not
  // derive flow; consumers earn richer fluid state only after surface contact.
  function surfaceY(x,z){
    const gx=(x-MIN)/DX-.5,gz=(z-MIN)/DX-.5,x0=Math.floor(gx),z0=Math.floor(gz);
    if(x0<0||z0<0||x0>=N-1||z0>=N-1)return NaN;
    const fx=gx-x0,fz=gz-z0;
    let eta=0,w=0,k,q,hh;
    k=idx(x0,z0);q=(1-fx)*(1-fz);hh=h[k];if(valid(k)&&hh>DRY){eta+=(bed[k]+hh)*q;w+=q}
    k=idx(x0+1,z0);q=fx*(1-fz);hh=h[k];if(valid(k)&&hh>DRY){eta+=(bed[k]+hh)*q;w+=q}
    k=idx(x0,z0+1);q=(1-fx)*fz;hh=h[k];if(valid(k)&&hh>DRY){eta+=(bed[k]+hh)*q;w+=q}
    k=idx(x0+1,z0+1);q=fx*fz;hh=h[k];if(valid(k)&&hh>DRY){eta+=(bed[k]+hh)*q;w+=q}
    return w>1e-6?eta/w:NaN;
  }
  // Rich field: local fluid state for consumers already known to intersect water.
  function flowInto(x,z,out){
    const gx=(x-MIN)/DX-.5,gz=(z-MIN)/DX-.5,x0=Math.floor(gx),z0=Math.floor(gz);
    if(x0<0||z0<0||x0>=N-1||z0>=N-1)return false;
    const fx=gx-x0,fz=gz-z0;
    let depth=0,u=0,v=0,w=0,k,q,hh;
    k=idx(x0,z0);q=(1-fx)*(1-fz);hh=h[k];if(valid(k)&&hh>DRY){depth+=hh*q;u+=(hu[k]/hh)*q;v+=(hv[k]/hh)*q;w+=q}
    k=idx(x0+1,z0);q=fx*(1-fz);hh=h[k];if(valid(k)&&hh>DRY){depth+=hh*q;u+=(hu[k]/hh)*q;v+=(hv[k]/hh)*q;w+=q}
    k=idx(x0,z0+1);q=(1-fx)*fz;hh=h[k];if(valid(k)&&hh>DRY){depth+=hh*q;u+=(hu[k]/hh)*q;v+=(hv[k]/hh)*q;w+=q}
    k=idx(x0+1,z0+1);q=fx*fz;hh=h[k];if(valid(k)&&hh>DRY){depth+=hh*q;u+=(hu[k]/hh)*q;v+=(hv[k]/hh)*q;w+=q}
    if(w<=1e-6)return false;out.depth=depth/w;out.u=u/w;out.v=v/w;return true;
  }
  // Compatibility surface for diagnostics and existing non-hot consumers.
  function sampleStateInto(x,z,out){const surface=surfaceY(x,z);if(!Number.isFinite(surface)||!flowInto(x,z,out))return false;out.surface=surface;return true}
  function sampleState(x,z){const out={depth:0,surface:0,u:0,v:0};return sampleStateInto(x,z,out)?out:null}
  function surfaceHeight(x,z){return surfaceY(x,z)}
  function forEachWetCell(fn){for(let z=0;z<N;z++)for(let x=0;x<N;x++){const k=idx(x,z);if(valid(k)&&h[k]>DRY)fn({ix:x,iz:z,x:wx(x),z:wz(z),depth:h[k],surface:bed[k]+h[k]})}}
  function captureDiagnostic(){
    const wetCells=[];
    for(let z=0;z<N;z++)for(let x=0;x<N;x++){const k=idx(x,z);if(h[k]<=DRY||!valid(k))continue;const px=wx(x),pz=wz(z),exactBed=terrain.groundHeightExact(px,pz);wetCells.push({ix:x,iz:z,x:px,z:pz,bed:bed[k],exactBed,bedError:Number.isFinite(exactBed)?bed[k]-exactBed:null,h:h[k],eta:bed[k]+h[k],hu:hu[k],hv:hv[k]});}
    const p=geometry.getAttribute("position"),index=geometry.getIndex(),vertices=p?Array.from(p.array):[],indices=index?Array.from(index.array):[];
    const triangles=[];for(let i=0;i<indices.length;i+=3){const ia=indices[i],ib=indices[i+1],ic=indices[i+2],a=ia*3,b=ib*3,c=ic*3;
      const ax=vertices[a],ay=vertices[a+1],az=vertices[a+2],bx=vertices[b],by=vertices[b+1],bz=vertices[b+2],cx=vertices[c],cy=vertices[c+1],cz=vertices[c+2];
      const abx=bx-ax,aby=by-ay,abz=bz-az,acx=cx-ax,acy=cy-ay,acz=cz-az,nx=aby*acz-abz*acy,ny=abz*acx-abx*acz,nz=abx*acy-aby*acx;
      const ea=terrain.groundHeightExact(ax,az),eb=terrain.groundHeightExact(bx,bz),ec=terrain.groundHeightExact(cx,cz);triangles.push({i:i/3,indices:[ia,ib,ic],a:[ax,ay,az],b:[bx,by,bz],c:[cx,cy,cz],exactTerrain:[ea,eb,ec],clearance:[ay-ea,by-eb,cy-ec],normal:[nx,ny,nz],spanXZ:Math.max(Math.hypot(ax-bx,az-bz),Math.hypot(bx-cx,bz-cz),Math.hypot(cx-ax,cz-az)),y:[Math.min(ay,by,cy),Math.max(ay,by,cy)]});
    }
    return{kind:"crucible-water-diagnostic",version:1,grid:{n:N,size:SIZE,dx:DX,min:MIN,dry:DRY},solver:{enabled,steps,sources:sources.map(s=>({...s})),wetCells},surface:{vertices,indices,triangles},inspect:inspect()};
  }
  function inspect(){let volume=0,wet=0,maxDepth=0,maxSpeed=0;for(let k=0;k<K;k++)if(h[k]>DRY){wet++;volume+=h[k]*DX*DX;maxDepth=Math.max(maxDepth,h[k]);maxSpeed=Math.max(maxSpeed,Math.hypot(hu[k],hv[k])/h[k])}return{kind:`shallow-${kind}`,independent:true,enabled,grid:[N,N],cellSize:DX,sources:sources.map(s=>({...s})),display:{density:displayDensity,level:displayDensity,max:25},viscosity:{level:viscosityLevel,max:26,drag:.22*Math.pow(2,(viscosityLevel-1)/3)},water:{injected:totalInjected,volume,maxDepth,maxSpeed,escaped:totalEscaped,dryLoss:totalDryLoss,accounted:volume+totalEscaped+totalDryLoss,balanceError:totalInjected-(volume+totalEscaped+totalDryLoss)},wetCells:wet,steps,probe:probeFrame,presentation:{...presentationProbe}}}
  cacheBoundary();sampleBed();refresh();
  return{update,setEnabled,reset,inject,fillRegion,setSource,setSources,addTimedSource,cycleDisplayDensity,setDisplayDensity,cycleWaterLook,cycleViscosity,waterLook:()=>applyWaterLook(),surfaceY,flowInto,sampleState,sampleStateInto,surfaceHeight,forEachWetCell,captureDiagnostic,inspect,object:surface,sideObject:waterSide};
}
