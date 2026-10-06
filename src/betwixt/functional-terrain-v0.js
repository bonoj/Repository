// Functional Terrain v0 — independent 2D maps compiled into one height surface.
// T1 adds a fourth paint map: feature jurisdiction selects surface-greeble functions.
// T2 adds deterministic populations that consume semantic material + terrain conditions rather than authored placement.
// T3 makes material migrate: terrain volume -> provenance-bearing BB mass -> terrain volume.
export function createFunctionalTerrainV0({THREE,size=8.4,resolution=45,seed=741}={}){
  const root=new THREE.Group();root.name="functional-terrain:v0";
  let mode=4;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const hash=(x,z,s)=>{
    const xi=Math.trunc(x),zi=Math.trunc(z);
    let h=Math.imul(xi+s,374761393)+Math.imul(zi+s*17,668265263);
    h=Math.imul(h-Math.floor(h/8192)*8192,1274126177);
    return Math.abs(h%1000003)/1000003;
  };
  const smooth=t=>t*t*(3-2*t);
  function valueNoise(x,z,s,scale){
    x/=scale;z/=scale;const ix=Math.floor(x),iz=Math.floor(z),tx=smooth(x-ix),tz=smooth(z-iz);
    const a=hash(ix,iz,s),b=hash(ix+1,iz,s),c=hash(ix,iz+1,s),d=hash(ix+1,iz+1,s);
    return THREE.MathUtils.lerp(THREE.MathUtils.lerp(a,b,tx),THREE.MathUtils.lerp(c,d,tx),tz);
  }
  const fbm=(x,z,s)=>.62*valueNoise(x,z,s,3.8)+.27*valueNoise(x,z,s+17,1.9)+.11*valueNoise(x,z,s+43,.9);
  const tiers=[-.65,-.12,.48,1.12];
  const biomeKinds=["dunes","ridges","crater","canyon","knolls","waves","spire","terraces"];
  const octR=1.72,dx=octR*1.72,dz=octR*1.42;
  const featureKinds=["quiet","boulder","spirelet","ribs","mounds","alien"];
  // Composite material palette mirrors the feature-paint categories so semantic jurisdiction survives manifestation.
  const materialColors={
    quiet:new THREE.Color(0x70715f),
    boulder:new THREE.Color(0x77736d),
    spirelet:new THREE.Color(0x9a7652),
    ribs:new THREE.Color(0x765f78),
    mounds:new THREE.Color(0x5f795d),
    alien:new THREE.Color(0x547b7d)
  };
  const materialColor=new THREE.Color();
  const populationRoot=new THREE.Group();populationRoot.name="functional-terrain:populations";root.add(populationRoot);
  const gasRoot=new THREE.Group();gasRoot.name="functional-terrain:gas";root.add(gasRoot);
  const gas={source:{x:.14,z:2.38},kind:"spirelet",radius:.64,depth:.68,amount:0,condensed:0,accreted:0,t0:0,running:false,sourceBase:0,rainCenter:{x:2.35,z:-1.55},rainBase:0};
  const gasN=28,gasCount=gasN*gasN;
  const gasGeo=new THREE.IcosahedronGeometry(.16,1);
  const gasMat=new THREE.MeshBasicMaterial({color:materialColors.spirelet,transparent:true,opacity:.16,depthWrite:false,blending:THREE.NormalBlending});
  const gasMesh=new THREE.InstancedMesh(gasGeo,gasMat,gasCount);gasMesh.name="atmospheric-density:spirelet";gasMesh.frustumCulled=false;gasRoot.add(gasMesh);
  const gasDummy=new THREE.Object3D();
  const rainMat=new THREE.MeshStandardMaterial({color:materialColors.spirelet,roughness:.72,metalness:.18});
  const rainMesh=new THREE.InstancedMesh(new THREE.SphereGeometry(.055,5,4),rainMat,360);rainMesh.name="gas-condensate:spirelet";rainMesh.castShadow=true;rainMesh.receiveShadow=true;rainMesh.visible=false;gasRoot.add(rainMesh);
  const rainDummy=new THREE.Object3D();
  const rainSeeds=Array.from({length:360},(_,i)=>({x:(hash(i,91,seed+8301)-.5)*1.45,z:(hash(i,97,seed+8311)-.5)*1.25,delay:hash(i,101,seed+8321)*.36,bounce:.24+hash(i,103,seed+8339)*.22}));
  const gasCells=Array.from({length:gasCount},(_,i)=>({i:i%gasN,j:Math.floor(i/gasN),jitter:hash(i,83,seed+8201)*Math.PI*2}));
  const migrationRoot=new THREE.Group();migrationRoot.name="functional-terrain:migration";root.add(migrationRoot);
  // T3/T4 transfers are data. Both use the exact same transport engine.
  const bbCount=360,bbGeo=new THREE.SphereGeometry(.055,5,4);
  function makeTransfer({name,source,dest,kind,radius,depth,seedOffset}){
    const mat=new THREE.MeshStandardMaterial({color:materialColors[kind],roughness:.72,metalness:.18});
    const mesh=new THREE.InstancedMesh(bbGeo,mat,bbCount);mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;mesh.visible=false;migrationRoot.add(mesh);
    return{name,source,dest,kind,radius,depth,seedOffset,sourceAmount:0,destAmount:0,phase:"waiting",t0:0,running:false,sourceBase:0,destBase:0,mesh};
  }
  const migration=makeTransfer({name:"ribs-transfer",source:{x:-.95,z:.15},dest:{x:2.35,z:-1.55},kind:"ribs",radius:.88,depth:1.05,seedOffset:0});
  // Fixed, visually interior semantic addresses for seed 741: spirelet/orange -> mounds/green.
  const alienMigration=makeTransfer({name:"spirelet-to-mounds",source:{x:.14,z:2.38},dest:{x:-1.82,z:.14},kind:"spirelet",radius:.72,depth:.78,seedOffset:1009});
  const transfers=[migration,alienMigration];
  const bbDummy=new THREE.Object3D();
  const bbSeeds=Array.from({length:bbCount},(_,i)=>({
    a:hash(i,17,seed+6101)*Math.PI*2,
    r:Math.sqrt(hash(i,29,seed+6107))*.48,
    y:(hash(i,41,seed+6113)-.5)*.38,
    wobble:hash(i,53,seed+6121)*Math.PI*2
  }));
  const populationGeometries={
    trunk:new THREE.CylinderGeometry(.045,.065,.38,5),
    crown:new THREE.ConeGeometry(.18,.46,6),
    rock:new THREE.DodecahedronGeometry(.15,0),
    scrub:new THREE.ConeGeometry(.13,.22,5)
  };
  const populationMaterials={
    trunk:new THREE.MeshStandardMaterial({color:0x574735,roughness:.95}),
    crown:new THREE.MeshStandardMaterial({color:0x3f6540,roughness:.92}),
    rock:new THREE.MeshStandardMaterial({color:0x67645f,roughness:.98}),
    scrub:new THREE.MeshStandardMaterial({color:0x80643d,roughness:.98})
  };
  function octCell(x,z){
    let best=null,bd=1e9;
    const rz=Math.round(z/dz);
    for(let j=rz-2;j<=rz+2;j++){
      const offset=(j&1)*dx*.5,rx=Math.round((x-offset)/dx);
      for(let i=rx-2;i<=rx+2;i++){
        const cx=i*dx+offset,cz=j*dz,ax=Math.abs(x-cx),az=Math.abs(z-cz);
        // regular-ish octagonal metric; distance 1 is the hard jurisdiction boundary
        const od=Math.max(ax,az,(ax+az)/1.414)/(octR*.78);
        if(od<bd){bd=od;best={i,j,cx,cz,d:od}}
      }
    }
    const key=Math.abs((best.i*73856093)+(best.j*19349663)+seed*83492791);
    best.kind=biomeKinds[key%biomeKinds.length];return best;
  }
  function biome(kind,x,z,cx,cz){
    const X=x-cx,Z=z-cz,r=Math.hypot(X,Z);
    if(kind==="dunes")return .52*Math.sin(X*3.0+Math.sin(Z*1.2));
    if(kind==="ridges")return .78*(Math.abs(Math.sin((X*.72+Z*.34)*2.5))-.42);
    if(kind==="crater")return -1.05*Math.exp(-r*r/1.0)+.52*Math.exp(-Math.pow(r-1.0,2)/.12);
    if(kind==="canyon")return -.92*Math.exp(-Math.pow(X*.9+Math.sin(Z*1.8)*.35,2)/.18);
    if(kind==="knolls")return .88*Math.exp(-r*r/.72)+.36*Math.exp(-((X-.62)**2+(Z+.38)**2)/.22);
    if(kind==="waves")return .58*Math.sin(r*4.4);
    if(kind==="spire")return 1.22*Math.exp(-r*r/.26);
    if(kind==="terraces")return .22*Math.floor(4*Math.max(0,1-r/1.6));
    return 0;
  }
  function featurePaint(x,z){
    // Independent paint map. It allocates feature vocabulary; the selected function authors geometry.
    const n=fbm(x,z,seed+2711);
    const band=Math.min(featureKinds.length-1,Math.floor(n*featureKinds.length));
    const strength=smooth(clamp((Math.abs(n-.5)-.055)/.28,0,1));
    return{kind:featureKinds[band],strength,value:n};
  }
  function feature(kind,x,z,strength){
    if(kind==="quiet"||strength<=0)return 0;
    // Deterministic local coordinates derived from a coarse address: map chooses family, function chooses expression.
    const gx=Math.floor((x+32)/1.35),gz=Math.floor((z+32)/1.35);
    const cx=gx*1.35-32+.675,cz=gz*1.35-32+.675,X=x-cx,Z=z-cz,r=Math.hypot(X,Z);
    const jitter=.72+.55*hash(gx,gz,seed+3301);
    if(kind==="boulder")return strength*jitter*.72*Math.exp(-r*r/.18);
    if(kind==="spirelet")return strength*jitter*1.05*Math.exp(-r*r/.075);
    if(kind==="ribs")return strength*.42*Math.max(0,1-r/.62)*Math.abs(Math.sin((X+Z)*8));
    if(kind==="mounds")return strength*.46*(Math.exp(-((X-.18)**2+(Z+.12)**2)/.11)+.7*Math.exp(-((X+.28)**2+(Z-.2)**2)/.08));
    if(kind==="alien")return strength*.62*Math.max(0,1-r/.58)*(.35+.65*Math.abs(Math.sin(Math.atan2(Z,X)*3+r*9)));
    return 0;
  }
  function migrationDelta(x,z){
    let total=0;
    for(const tr of transfers){
      const bell=(p,sign,amount)=>{
        const d=Math.hypot(x-p.x,z-p.z),u=clamp(1-d/tr.radius,0,1);
        return sign*tr.depth*smooth(u)*amount;
      };
      total+=bell(tr.source,-1,tr.sourceAmount)+bell(tr.dest,1,tr.destAmount);
    }
    // G1 direct field -> atmospheric field conversion. No parcel intermediate.
    if(gas.amount>0||gas.condensed>0){
      const d=Math.hypot(x-gas.source.x,z-gas.source.z),u=clamp(1-d/gas.radius,0,1);
      total-=gas.depth*smooth(u)*Math.max(gas.amount,gas.condensed);
    }
    if(gas.accreted>0){
      const d=Math.hypot(x-gas.rainCenter.x,z-gas.rainCenter.z),u=clamp(1-d/.82,0,1);
      total+=.72*smooth(u)*gas.accreted;
    }
    return total;
  }
  function sample(x,z){
    const en=fbm(x,z,seed+101),tier=Math.min(tiers.length-1,Math.floor(en*tiers.length)),E=tiers[tier];
    const mn=fbm(x,z,seed+911),M=clamp((mn-.28)/.56,0,1);
    const cell=octCell(x,z),A=cell.d>=1?0:smooth(clamp((1-cell.d)/.24,0,1));
    const F=biome(cell.kind,x,z,cell.cx,cell.cz);
    const fp=featurePaint(x,z),G=feature(fp.kind,x,z,fp.strength);
    return{E,M,A,F,G,H:E+M*A*F+G+migrationDelta(x,z),tier,kind:cell.kind,featureKind:fp.kind,featureStrength:fp.strength,featureValue:fp.value};
  }
  function slopeAt(x,z){
    const e=.07,h=sample(x,z).H;
    return Math.hypot(sample(x+e,z).H-h,sample(x,z+e).H-h)/e;
  }
  function rebuildPopulations(){
    populationRoot.clear();
    // A deterministic candidate lattice is only an address generator. Material and local geometry decide habitation.
    const step=.42,half=size*.5-.16;
    for(let z=-half;z<=half;z+=step)for(let x=-half;x<=half;x+=step){
      const gx=Math.round((x+half)/step),gz=Math.round((z+half)/step);
      const jx=(hash(gx,gz,seed+5101)-.5)*step*.62,jz=(hash(gx,gz,seed+5107)-.5)*step*.62;
      const px=x+jx,pz=z+jz,q=sample(px,pz),s=slopeAt(px,pz),chance=hash(gx,gz,seed+5113);
      let object=null;
      if(q.featureKind==="mounds"&&s<.72&&chance<.46){
        object=new THREE.Group();
        const trunk=new THREE.Mesh(populationGeometries.trunk,populationMaterials.trunk);trunk.position.y=.19;
        const crown=new THREE.Mesh(populationGeometries.crown,populationMaterials.crown);crown.position.y=.54;
        object.add(trunk,crown);
      }else if(q.featureKind==="boulder"&&s>.18&&chance<.58){
        object=new THREE.Mesh(populationGeometries.rock,populationMaterials.rock);
        const sc=.7+hash(gx,gz,seed+5129)*1.25;object.scale.set(sc*.92,sc*.65,sc);
        object.rotation.set(hash(gx,gz,seed+5131)*.7,hash(gx,gz,seed+5137)*Math.PI,hash(gx,gz,seed+5147)*.5);
        object.position.y=.08*sc;
      }else if(q.featureKind==="spirelet"&&s<1.05&&chance<.34){
        object=new THREE.Mesh(populationGeometries.scrub,populationMaterials.scrub);
        const sc=.7+hash(gx,gz,seed+5153)*.8;object.scale.set(sc,sc,sc);object.position.y=.11*sc;
        object.rotation.y=hash(gx,gz,seed+5167)*Math.PI*2;
      }
      if(object){object.position.x=px;object.position.z=pz;object.position.y+=q.H;populationRoot.add(object);}
    }
    populationRoot.visible=mode===4;
  }
  const geo=new THREE.PlaneGeometry(size,size,resolution-1,resolution-1);geo.rotateX(-Math.PI/2);
  const pos=geo.attributes.position,colors=new Float32Array(pos.count*3);
  const color=new THREE.Color();
  function startMigration(now=performance.now()){
    // One focus event, one t0, identical lifecycle for every transfer.
    gas.amount=0;gas.condensed=0;gas.accreted=0;gas.sourceBase=sample(gas.source.x,gas.source.z).H;gas.rainBase=sample(gas.rainCenter.x,gas.rainCenter.z).H;gas.running=true;gas.t0=now;gasMesh.visible=false;rainMesh.visible=false;
    for(const tr of transfers){
      tr.sourceAmount=0;tr.destAmount=0;
      tr.sourceBase=sample(tr.source.x,tr.source.z).H;
      tr.destBase=sample(tr.dest.x,tr.dest.z).H;
      tr.running=true;tr.t0=now;tr.phase="excavate";tr.mesh.visible=false;
    }
  }
  function updateTransfer(tr,now){
    if(!tr.running){tr.mesh.visible=false;return false;}
    const duration=13500,t=clamp((now-tr.t0)/duration,0,1);
    let sourceGone=0,destArrived=0,visibleCount=0;
    const sx=tr.source.x,sz=tr.source.z,dx=tr.dest.x,dz=tr.dest.z;
    const len=Math.hypot(dx-sx,dz-sz),nx=-(dz-sz)/len,nz=(dx-sx)/len;
    for(let i=0;i<bbCount;i++){
      const b=bbSeeds[i],order=i/(bbCount-1);
      const launch=.08+order*.38+.025*Math.sin(i*.71+b.wobble);
      const speed=.43+hash(i,67,seed+6173+tr.seedOffset)*.16;
      const p=clamp((t-launch)/speed,0,1);
      if(t>=launch)sourceGone++;if(p>=1)destArrived++;
      if(t>=launch&&p<1){
        visibleCount++;
        const rubber=.045*Math.sin(p*Math.PI)*Math.sin(i*.43+t*34+b.wobble);
        const u=clamp(p+rubber,0,1);
        const cx=THREE.MathUtils.lerp(sx,dx,u),cz=THREE.MathUtils.lerp(sz,dz,u);
        const ground=THREE.MathUtils.lerp(tr.sourceBase,tr.destBase,u);
        const envelope=Math.pow(Math.sin(Math.PI*u),.62),arch=1.55*envelope;
        const twistAngle=u*Math.PI*3.25+b.wobble*.32;
        const twistRadius=(.10+.16*envelope)*(Math.sin(Math.PI*u)**.45);
        const lateral=Math.cos(twistAngle)*twistRadius+.055*Math.sin(i*.37+t*18+b.wobble)*envelope+Math.cos(b.a)*b.r*.10;
        const verticalTwist=Math.sin(twistAngle)*twistRadius;
        const endCurl=.34*Math.sin(Math.PI*u)*Math.cos(Math.PI*u);
        const buryOut=p<.075?THREE.MathUtils.lerp(-.28,.05,p/.075):0;
        const buryIn=p>.91?THREE.MathUtils.lerp(0,-.30,(p-.91)/.09):0;
        bbDummy.position.set(cx+nx*(lateral+endCurl),ground+.10+arch+verticalTwist+b.y*.12+buryOut+buryIn,cz+nz*(lateral+endCurl));
        const edge=Math.min(1,Math.max(0,p/.035),Math.max(0,(1-p)/.035));
        bbDummy.scale.setScalar(Math.max(.001,edge));bbDummy.updateMatrix();tr.mesh.setMatrixAt(i,bbDummy.matrix);
      }else{
        bbDummy.scale.setScalar(.001);bbDummy.position.set(sx,tr.sourceBase-.3,sz);bbDummy.updateMatrix();tr.mesh.setMatrixAt(i,bbDummy.matrix);
      }
    }
    tr.sourceAmount=sourceGone/bbCount;tr.destAmount=destArrived/bbCount;
    tr.phase=t<.08?"excavate":destArrived===bbCount?"settled":sourceGone<bbCount?"streaming-out":"streaming-in";
    tr.mesh.visible=visibleCount>0&&mode===4;tr.mesh.instanceMatrix.needsUpdate=true;
    if(t>=1){tr.running=false;tr.phase="settled";tr.mesh.visible=false;}
    return true;
  }
  function updateGas(now){
    if(!gas.running){return false;}
    // G2 is intentionally quick: liberation/drift, then atmospheric density condenses into provenance BB rain.
    const t=clamp((now-gas.t0)/10500,0,1);
    const liberated=smooth(clamp(t/.34,0,1));
    const condense=smooth(clamp((t-.43)/.24,0,1));
    gas.condensed=condense;
    gas.amount=liberated*(1-condense);
    let visible=0;
    for(let n=0;n<gasCount;n++){
      const cell=gasCells[n],u=cell.i/(gasN-1),v=cell.j/(gasN-1);
      const age=clamp(t*2.0-u*.58-v*.12,0,1);
      // Steer the atmospheric field directly toward the chosen rain zone; no waiting for emergent weather.
      const travel=smooth(clamp(t/.50,0,1));
      const cx=THREE.MathUtils.lerp(gas.source.x,gas.rainCenter.x,travel);
      const cz=THREE.MathUtils.lerp(gas.source.z,gas.rainCenter.z,travel);
      const curl=Math.sin(age*10.5+cell.j*.43+cell.jitter)*(.16+.34*age);
      const cross=Math.cos(age*7.3+cell.i*.31)*(.10+.24*age);
      const px=cx+curl+(u-.5)*(.32+age*.72),pz=cz+cross+(v-.5)*(.30+age*.64);
      const base=THREE.MathUtils.lerp(gas.sourceBase,gas.rainBase,travel);
      const rise=.16+age*2.2+Math.sin(age*Math.PI)*.62+(v-.5)*.38;
      const head=Math.exp(-Math.pow((u-.48-age*.10)*2.2,2)-Math.pow((v-.5)*1.8,2));
      const filament=.42+.58*Math.abs(Math.sin((u*2.1-v*1.7+age)*Math.PI*2));
      const density=gas.amount*age*head*filament;
      if(density>.018){visible++;gasDummy.position.set(px,base+rise,pz);const s=.34+density*.72+age*.16;gasDummy.scale.set(s*1.35,s*(.72+age*.35),s);}
      else{gasDummy.position.set(gas.source.x,base-.5,gas.source.z);gasDummy.scale.setScalar(.001);}
      gasDummy.updateMatrix();gasMesh.setMatrixAt(n,gasDummy.matrix);
    }
    gasMesh.visible=visible>0&&mode===4;gasMesh.instanceMatrix.needsUpdate=true;

    let raining=0,settled=0;
    for(let i=0;i<360;i++){
      const s=rainSeeds[i],birth=.46+s.delay*.48,p=clamp((t-birth)/(.25+s.delay*.18),0,1);
      if(p>0&&p<1){
        raining++;
        const x=gas.rainCenter.x+s.x,z=gas.rainCenter.z+s.z;
        const ground=sample(x,z).H+.07;
        const startY=gas.rainBase+2.55+hash(i,107,seed+8353)*.75;
        // Two rapidly damping bounces. Geometry is still individual and addressable after condensation.
        const fall=1-Math.pow(1-p,2.15);
        let y=THREE.MathUtils.lerp(startY,ground,fall);
        if(p>.62){const bp=(p-.62)/.38;y=ground+Math.abs(Math.sin(bp*Math.PI*4))*s.bounce*(1-bp);}
        rainDummy.position.set(x,y,z);rainDummy.scale.setScalar(1);rainDummy.updateMatrix();rainMesh.setMatrixAt(i,rainDummy.matrix);
      }else{
        if(p>=1)settled++;
        rainDummy.position.set(gas.rainCenter.x,gas.rainBase-.5,gas.rainCenter.z);rainDummy.scale.setScalar(.001);rainDummy.updateMatrix();rainMesh.setMatrixAt(i,rainDummy.matrix);
      }
    }
    gas.accreted=settled/360;
    rainMesh.visible=raining>0&&mode===4;rainMesh.instanceMatrix.needsUpdate=true;
    if(t>=1){gas.running=false;gasMesh.visible=false;rainMesh.visible=false;gas.amount=0;gas.condensed=1;gas.accreted=1;}
    return true;
  }
  function updateMigration(now=performance.now()){
    let changed=false;
    for(const tr of transfers)changed=updateTransfer(tr,now)||changed;
    changed=updateGas(now)||changed;
    if(changed)paint(false);
  }
  function paint(updatePopVisibility=true){
    for(let i=0;i<pos.count;i++){
      const x=pos.getX(i),z=pos.getZ(i),q=sample(x,z);
      let y=0;
      if(mode===0){y=q.E;color.setHSL(.12+.12*q.tier,.38,.32+.09*q.tier)}
      else if(mode===1){y=-.8+q.M*1.6;color.setHSL(.58,.18,.18+.55*q.M)}
      else if(mode===2){y=.04;color.setHSL(((biomeKinds.indexOf(q.kind)*.117)%1),.52,.42+q.A*.12)}
      else if(mode===3){y=-.72+q.featureValue*1.44;color.setHSL(((featureKinds.indexOf(q.featureKind)*.137+.03)%1),.5,.28+q.featureStrength*.3)}
      else{
        y=q.H;
        // Material identity comes from the same semantic paint map that selected the feature function.
        // Keep relief readable with a small tier/permission luminance modulation; never collapse back to one green terrain wash.
        const baseColor=materialColors[q.featureKind]||materialColors.quiet;
        materialColor.copy(baseColor);
        const relief=.78+.07*q.tier+.10*q.M;
        color.copy(materialColor).multiplyScalar(relief);
        // Foreign deposited matter keeps its provenance instead of being recolored by the host biome.
        if(gas.accreted>0){
          const gd=Math.hypot(x-gas.rainCenter.x,z-gas.rainCenter.z),gu=clamp(1-gd/.82,0,1);
          const gclaim=smooth(gu)*gas.accreted;
          if(gclaim>0)color.lerp(materialColors[gas.kind],gclaim*.94);
        }
        if(alienMigration.dest&&alienMigration.destAmount>0){
          const dd=Math.hypot(x-alienMigration.dest.x,z-alienMigration.dest.z),u=clamp(1-dd/alienMigration.radius,0,1);
          const claim=smooth(u)*alienMigration.destAmount;
          if(claim>0)color.lerp(materialColors[alienMigration.kind],claim*.92);
        }
      }
      pos.setY(i,y);colors[i*3]=color.r;colors[i*3+1]=color.g;colors[i*3+2]=color.b;
    }
    geo.setAttribute("color",new THREE.BufferAttribute(colors,3));pos.needsUpdate=true;geo.attributes.color.needsUpdate=true;geo.computeVertexNormals();
    if(updatePopVisibility)populationRoot.visible=mode===4;
  }
  const mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.88,metalness:.02,side:THREE.DoubleSide,flatShading:false});
  const mesh=new THREE.Mesh(geo,mat);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);
  const base=new THREE.Mesh(new THREE.BoxGeometry(size+.18,.12,size+.18),new THREE.MeshStandardMaterial({color:0x34383a,roughness:.62,metalness:.35}));
  base.position.y=-.92;root.add(base);
  paint();rebuildPopulations();for(const tr of transfers)tr.mesh.visible=false;gasMesh.visible=false;rainMesh.visible=false;
  return{root,mesh,populationRoot,migrationRoot,update:updateMigration,startMigration,migration,alienMigration,setMode(n){mode=((n%5)+5)%5;paint();return mode},next(){return this.setMode(mode+1)},mode:()=>mode,sample};
}
