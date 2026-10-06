// Functional Terrain v0 — independent 2D maps compiled into one height surface.
// T1 adds a fourth paint map: feature jurisdiction selects surface-greeble functions.
// T2 adds deterministic populations that consume semantic material + terrain conditions rather than authored placement.
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
  function sample(x,z){
    const en=fbm(x,z,seed+101),tier=Math.min(tiers.length-1,Math.floor(en*tiers.length)),E=tiers[tier];
    const mn=fbm(x,z,seed+911),M=clamp((mn-.28)/.56,0,1);
    const cell=octCell(x,z),A=cell.d>=1?0:smooth(clamp((1-cell.d)/.24,0,1));
    const F=biome(cell.kind,x,z,cell.cx,cell.cz);
    const fp=featurePaint(x,z),G=feature(fp.kind,x,z,fp.strength);
    return{E,M,A,F,G,H:E+M*A*F+G,tier,kind:cell.kind,featureKind:fp.kind,featureStrength:fp.strength,featureValue:fp.value};
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
  function paint(){
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
      }
      pos.setY(i,y);colors[i*3]=color.r;colors[i*3+1]=color.g;colors[i*3+2]=color.b;
    }
    geo.setAttribute("color",new THREE.BufferAttribute(colors,3));pos.needsUpdate=true;geo.attributes.color.needsUpdate=true;geo.computeVertexNormals();
    populationRoot.visible=mode===4;
  }
  const mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.88,metalness:.02,side:THREE.DoubleSide,flatShading:false});
  const mesh=new THREE.Mesh(geo,mat);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);
  const base=new THREE.Mesh(new THREE.BoxGeometry(size+.18,.12,size+.18),new THREE.MeshStandardMaterial({color:0x34383a,roughness:.62,metalness:.35}));
  base.position.y=-.92;root.add(base);
  paint();rebuildPopulations();
  return{root,mesh,populationRoot,setMode(n){mode=((n%5)+5)%5;paint();return mode},next(){return this.setMode(mode+1)},mode:()=>mode,sample};
}
