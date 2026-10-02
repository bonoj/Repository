import {createTerrainRecipeGenerator} from "./terrain-recipe-generator.js";
// Deterministic 2D terrain genesis. Heightmaps author the initial surface;
// Crucible's signed-density field becomes authoritative immediately afterward.
export function createTerrainGenesis({terrain}){
  const procedural=createTerrainRecipeGenerator();
  const TAU=Math.PI*2,clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),smooth=t=>t*t*(3-2*t),fract=v=>v-Math.floor(v);
  const hash=(x,z,s)=>fract(Math.sin(x*127.1+z*311.7+s*74.7)*43758.5453123);
  function noise(x,z,s){
    const ix=Math.floor(x),iz=Math.floor(z),fx=smooth(fract(x)),fz=smooth(fract(z)),mix=(a,b,t)=>a+(b-a)*t;
    return mix(mix(hash(ix,iz,s),hash(ix+1,iz,s),fx),mix(hash(ix,iz+1,s),hash(ix+1,iz+1,s),fx),fz)*2-1;
  }
  const seedFor=(seed,id)=>{let h=(seed|0)^0x9e3779b9;for(const c of id)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
  function domain(seed,id){
    const s=seedFor(seed,id),r=n=>(hash(n,17,s)+1)*.5;
    return{seed:s,angle:r(1)*TAU,sx:.55+r(2)*1.55,sz:.55+r(3)*1.55,ox:(r(4)-.5)*37,oz:(r(5)-.5)*37,warp:.4+r(6)*1.5};
  }
  function n2(d,x,z,scale=.12){
    const ca=Math.cos(d.angle),sa=Math.sin(d.angle),rx=(ca*x-sa*z)*d.sx,rz=(sa*x+ca*z)*d.sz;
    const w=noise(rx*.09+d.ox,rz*.09+d.oz,d.seed);
    const X=(rx+d.ox+w*d.warp)*scale,Z=(rz+d.oz-w*d.warp)*scale;
    return .6*noise(X,Z,d.seed)+.27*noise(X*2.07+7,Z*1.93-11,d.seed+101)+.13*noise(X*4.13-3,Z*3.89+5,d.seed+307);
  }
  const segDist=(x,z,ax,az,bx,bz)=>{const dx=bx-ax,dz=bz-az,l=dx*dx+dz*dz||1,t=clamp(((x-ax)*dx+(z-az)*dz)/l);return Math.hypot(x-ax-dx*t,z-az-dz*t)};
  const recipes=[
    {id:"folded-range",label:"folded mountain system",ops:[
      {id:"ground",kind:"broad",amp:.65,scale:.075},{id:"spine",kind:"ridge",amp:3.2,width:1.7,path:[-9,-3,-3,1,3,-.3,9,3]},
      {id:"parallel",kind:"ridge",amp:1.7,width:1.15,path:[-8,-5,-2,-2,4,-3,8,-1]},{id:"pass",kind:"basin",amp:-1.35,cx:.2,cz:.2,rx:2.1,rz:1.5},
      {id:"drain-a",kind:"trench",amp:-1.1,width:.7,path:[-6,7,-3,2,-.5,.4]},{id:"drain-b",kind:"trench",amp:-.9,width:.6,path:[7,-7,4,-2,1,0]}
    ]},
    {id:"sinkhole-country",label:"basins and sinkholes",ops:[
      {id:"rolling",kind:"broad",amp:1.25,scale:.11},{id:"shelf",kind:"shelf",amp:.8,angle:.35,offset:-1.5,width:2.8},
      {id:"hole-a",kind:"basin",amp:-3.4,cx:-4.3,cz:2.8,rx:2.1,rz:1.7},{id:"hole-b",kind:"basin",amp:-2.7,cx:2.8,cz:3.4,rx:1.45,rz:2.25},
      {id:"hole-c",kind:"basin",amp:-2.25,cx:4.5,cz:-3.1,rx:2.2,rz:1.3},{id:"scar",kind:"trench",amp:-.8,width:.8,path:[-8,-5,-2,-2,3,-2,8,-5]}
    ]},
    {id:"broken-highlands",label:"broken highlands and deep valleys",ops:[
      {id:"mass",kind:"broad",amp:2.15,scale:.07},{id:"upland-a",kind:"ridge",amp:2.2,width:2.7,path:[-8,4,-2,2,4,5,9,3]},
      {id:"upland-b",kind:"ridge",amp:1.7,width:2.3,path:[-7,-5,-1,-3,5,-5,9,-2]},{id:"fault",kind:"fault",amp:1.15,angle:1.08,offset:.2,width:.8},
      {id:"valley",kind:"trench",amp:-2.65,width:1.15,path:[-8,0,-3,-.5,2,1,8,-.5]},{id:"tributary",kind:"trench",amp:-1.2,width:.72,path:[1,8,1,4,2,1]}
    ]},
    {id:"asymmetric-field",label:"unnamed asymmetric terrain",ops:[
      {id:"tilt",kind:"tilt",amp:1.5,angle:2.2},{id:"broad",kind:"broad",amp:1.45,scale:.095},
      {id:"arc-a",kind:"ridge",amp:2.25,width:1.3,path:[-9,5,-5,1,-1,-1,4,-.2,8,-4]},{id:"cut-a",kind:"trench",amp:-1.55,width:.9,path:[-7,-7,-3,-1,1,3,7,6]},
      {id:"sink",kind:"basin",amp:-2.0,cx:4.4,cz:3.4,rx:3.1,rz:1.7},{id:"ledge",kind:"shelf",amp:1.1,angle:-.72,offset:2.1,width:1.4}
    ]}
  ];
  function pathDistance(x,z,path){
    let best=Infinity;for(let i=0;i+3<path.length;i+=2)best=Math.min(best,segDist(x,z,path[i],path[i+1],path[i+2],path[i+3]));return best;
  }
  function contribution(op,d,x,z){
    const texture=.78+.22*n2(d,x,z,op.scale||.15);
    if(op.kind==="broad")return op.amp*n2(d,x,z,op.scale)*(.82+.18*n2(d,x+11,z-7,(op.scale||.1)*1.9));
    if(op.kind==="ridge"||op.kind==="trench"){const q=pathDistance(x,z,op.path),w=op.width*(.72+.32*((n2(d,x,z,.16)+1)*.5)),g=Math.exp(-.5*(q/w)*(q/w));return op.amp*g*texture;}
    if(op.kind==="basin"){const ca=Math.cos(d.angle),sa=Math.sin(d.angle),dx=x-op.cx,dz=z-op.cz,u=(ca*dx-sa*dz)/(op.rx*(.82+.22*texture)),v=(sa*dx+ca*dz)/(op.rz*(.82+.22*texture)),q=Math.hypot(u,v);return q<1?op.amp*smooth(1-q)*texture:0;}
    if(op.kind==="shelf"||op.kind==="fault"){const q=x*Math.cos(op.angle)+z*Math.sin(op.angle)-op.offset,w=op.width||1;return op.amp*Math.tanh(q/w)*texture;}
    if(op.kind==="tilt")return op.amp*(x*Math.cos(op.angle)+z*Math.sin(op.angle))/12;
    return 0;
  }
  function execute(recipe,worldSeed,source){
    const meta=terrain.inspect(),[nx,ny,nz]=meta.grid,[sx,sy,sz]=meta.volume.spacing,[minx,miny,minz]=meta.volume.min;
    const height=new Float32Array(nx*nz),passes=[];
    for(const op of recipe.ops){
      const d=domain(worldSeed,recipe.id+":"+op.id);let sum=0,max=0;
      for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){const wx=minx+x*sx,wz=minz+z*sz,delta=contribution(op,d,wx,wz),k=x+nx*z;height[k]+=delta;sum+=delta*delta;max=Math.max(max,Math.abs(delta));}
      passes.push({id:op.id,kind:op.kind,seed:d.seed,rms:Math.sqrt(sum/(nx*nz)),max});
    }
    let lo=Infinity,hi=-Infinity;for(const h of height){lo=Math.min(lo,h);hi=Math.max(hi,h)}
    const targetLo=-2.25,targetHi=4.65,span=Math.max(.001,hi-lo),f=terrain.field;
    for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){const h=targetLo+(height[x+nx*z]-lo)/span*(targetHi-targetLo);height[x+nx*z]=h;for(let y=0;y<ny;y++){const wy=miny+y*sy;f[x+nx*(y+ny*z)]=h-wy;}}
    terrain.rebuildAll();
    return{kind:"heightmap-genesis",source,seed:worldSeed,index:recipes.indexOf(recipe),recipe:{id:recipe.id,label:recipe.label,family:recipe.family??null,ops:recipe.ops.map(o=>({...o}))},heightmap:{grid:[nx,nz],min:Math.min(...height),max:Math.max(...height),values:[...height]},passes};
  }
  function run(index=0,worldSeed=741){const recipe=recipes[((index%recipes.length)+recipes.length)%recipes.length];return execute(recipe,worldSeed,"authored");}
  function runSeed(seed=741){const recipe=procedural.generate(seed|0);return execute(recipe,seed|0,"seed");}
  return{run,runSeed,generateRecipe:seed=>procedural.generate(seed|0),families:procedural.families,recipes:()=>recipes.map(r=>({id:r.id,label:r.label,ops:r.ops.map(o=>({...o}))}))};
}
