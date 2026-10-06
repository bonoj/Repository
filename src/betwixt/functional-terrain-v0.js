// Functional Terrain v0 — independent 2D maps compiled into one height surface.\n// T1 adds a fourth paint map: feature jurisdiction selects surface-greeble functions. No placed prop meshes.
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
  const octR=1.72,dx=octR*1.72,dz=octR*1.42;\n  const featureKinds=["quiet","boulder","spirelet","ribs","mounds","alien"];
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
  function featurePaint(x,z){\n    // Independent paint map. It allocates feature vocabulary; the selected function authors geometry.\n    const n=fbm(x,z,seed+2711);\n    const band=Math.min(featureKinds.length-1,Math.floor(n*featureKinds.length));\n    const strength=smooth(clamp((Math.abs(n-.5)-.055)/.28,0,1));\n    return{kind:featureKinds[band],strength,value:n};\n  }\n  function feature(kind,x,z,strength){\n    if(kind==="quiet"||strength<=0)return 0;\n    // Deterministic local coordinates derived from a coarse address: map chooses family, function chooses expression.\n    const gx=Math.floor((x+32)/1.35),gz=Math.floor((z+32)/1.35);\n    const cx=gx*1.35-32+.675,cz=gz*1.35-32+.675,X=x-cx,Z=z-cz,r=Math.hypot(X,Z);\n    const jitter=.72+.55*hash(gx,gz,seed+3301);\n    if(kind==="boulder")return strength*jitter*.72*Math.exp(-r*r/.18);\n    if(kind==="spirelet")return strength*jitter*1.05*Math.exp(-r*r/.075);\n    if(kind==="ribs")return strength*.42*Math.max(0,1-r/.62)*Math.abs(Math.sin((X+Z)*8));\n    if(kind==="mounds")return strength*.46*(Math.exp(-((X-.18)**2+(Z+.12)**2)/.11)+.7*Math.exp(-((X+.28)**2+(Z-.2)**2)/.08));\n    if(kind==="alien")return strength*.62*Math.max(0,1-r/.58)*(.35+.65*Math.abs(Math.sin(Math.atan2(Z,X)*3+r*9)));\n    return 0;\n  }\n  function sample(x,z){
    const en=fbm(x,z,seed+101),tier=Math.min(tiers.length-1,Math.floor(en*tiers.length)),E=tiers[tier];
    const mn=fbm(x,z,seed+911),M=clamp((mn-.28)/.56,0,1);
    const cell=octCell(x,z),A=cell.d>=1?0:smooth(clamp((1-cell.d)/.24,0,1));
    const F=biome(cell.kind,x,z,cell.cx,cell.cz);\n    const fp=featurePaint(x,z),G=feature(fp.kind,x,z,fp.strength);\n    return{E,M,A,F,G,H:E+M*A*F+G,tier,kind:cell.kind,featureKind:fp.kind,featureStrength:fp.strength,featureValue:fp.value};
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
      else if(mode===2){y=.04;color.setHSL(((biomeKinds.indexOf(q.kind)*.117)%1),.52,.42+q.A*.12)}\n      else if(mode===3){y=-.72+q.featureValue*1.44;color.setHSL(((featureKinds.indexOf(q.featureKind)*.137+.03)%1),.5,.28+q.featureStrength*.3)}\n      else{y=q.H;color.setHSL(.26-q.E*.025+.035*q.featureStrength,.34+.12*q.featureStrength,.28+q.M*.18+q.featureStrength*.12)}
      pos.setY(i,y);colors[i*3]=color.r;colors[i*3+1]=color.g;colors[i*3+2]=color.b;
    }
    geo.setAttribute("color",new THREE.BufferAttribute(colors,3));pos.needsUpdate=true;geo.attributes.color.needsUpdate=true;geo.computeVertexNormals();
  }
  const mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.88,metalness:.02,side:THREE.DoubleSide,flatShading:false});
  const mesh=new THREE.Mesh(geo,mat);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);
  const base=new THREE.Mesh(new THREE.BoxGeometry(size+.18,.12,size+.18),new THREE.MeshStandardMaterial({color:0x34383a,roughness:.62,metalness:.35}));
  base.position.y=-.92;root.add(base);
  paint();
  return{root,mesh,setMode(n){mode=((n%5)+5)%5;paint();return mode},next(){return this.setMode(mode+1)},mode:()=>mode,sample};
}
