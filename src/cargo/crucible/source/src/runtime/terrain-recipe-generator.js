// Seed-addressed recipe synthesis for Terrain Genesis.
// This lives beside the preserved authored recipes: one integer determines both
// large-scale structure and every parameter of the generated recipe.
export function createTerrainRecipeGenerator(){
  const TAU=Math.PI*2;
  function rng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
  const between=(r,a,b)=>a+(b-a)*r(),integer=(r,a,b)=>Math.floor(between(r,a,b+1)),pick=(r,a)=>a[Math.floor(r()*a.length)];
  function path(r,{points=4,axis=null}={}){
    const out=[],angle=axis??between(r,0,TAU),ca=Math.cos(angle),sa=Math.sin(angle),bend=between(r,-2.8,2.8);
    for(let i=0;i<points;i++){const t=i/(points-1),along=-10+20*t,cross=bend*Math.sin(t*Math.PI)+between(r,-1.6,1.6);out.push(ca*along-sa*cross,sa*along+ca*cross)}
    return out;
  }
  const op={
    broad:(r,id,amp=[.5,2.4])=>({id,kind:"broad",amp:between(r,...amp),scale:between(r,.055,.17)}),
    ridge:(r,id,amp=[1.1,3.8],width=[.65,2.8],axis=null)=>({id,kind:"ridge",amp:between(r,...amp),width:between(r,...width),path:path(r,{points:integer(r,3,5),axis})}),
    trench:(r,id,amp=[-.7,-2.8],width=[.45,1.4],axis=null)=>({id,kind:"trench",amp:between(r,...amp),width:between(r,...width),path:path(r,{points:integer(r,3,5),axis})}),
    basin:(r,id,amp=[-1.2,-3.8])=>({id,kind:"basin",amp:between(r,...amp),cx:between(r,-6,6),cz:between(r,-6,6),rx:between(r,1.1,4.4),rz:between(r,1.1,4.4)}),
    shelf:(r,id,amp=[.55,1.8])=>({id,kind:"shelf",amp:between(r,...amp),angle:between(r,0,TAU),offset:between(r,-4,4),width:between(r,.65,3.2)}),
    fault:(r,id)=>({id,kind:"fault",amp:between(r,.65,1.8),angle:between(r,0,TAU),offset:between(r,-3,3),width:between(r,.35,1.25)}),
    tilt:(r,id)=>({id,kind:"tilt",amp:between(r,.45,2),angle:between(r,0,TAU)})
  };
  const families=[
    ["ranges",(r,ops)=>{const a=between(r,0,TAU);ops.push(op.broad(r,"ground",[.35,1.2]),op.ridge(r,"spine",[2.4,4.4],[1.1,2.5],a));if(r()<.8)ops.push(op.ridge(r,"parallel",[1,2.7],[.7,1.8],a+between(r,-.35,.35)));for(let i=0,n=integer(r,1,3);i<n;i++)ops.push(op.trench(r,"drain-"+i,[-.7,-1.8],[.4,.9],a+Math.PI/2+between(r,-.6,.6)));}],
    ["basin-field",(r,ops)=>{ops.push(op.broad(r,"rolling",[.7,1.8]));for(let i=0,n=integer(r,3,7);i<n;i++)ops.push(op.basin(r,"basin-"+i,[-1.2,-4.5]));if(r()<.65)ops.push(op.shelf(r,"shelf"));}],
    ["rift",(r,ops)=>{const a=between(r,0,TAU);ops.push(op.broad(r,"mass",[.7,2]),op.fault(r,"fault-a"),op.trench(r,"rift",[-2.2,-4.2],[.8,1.8],a));if(r()<.7)ops.push(op.ridge(r,"shoulder-a",[1,2.5],[.7,1.7],a),op.ridge(r,"shoulder-b",[.8,2.2],[.7,1.7],a+between(r,-.2,.2)));}],
    ["plateau",(r,ops)=>{ops.push(op.tilt(r,"tilt"),op.broad(r,"ground",[.4,1.2]),op.shelf(r,"escarpment",[1.1,2.4]));for(let i=0,n=integer(r,1,3);i<n;i++)ops.push(op.trench(r,"cut-"+i,[-1.1,-2.8],[.5,1.2]));}],
    ["knotted",(r,ops)=>{ops.push(op.broad(r,"ground",[.5,1.5]));for(let i=0,n=integer(r,2,4);i<n;i++)ops.push(op.ridge(r,"ridge-"+i,[1.2,3.1],[.7,2.2]));for(let i=0,n=integer(r,1,3);i<n;i++)ops.push(r()<.55?op.basin(r,"void-"+i,[-1,-3.2]):op.trench(r,"cut-"+i,[-.8,-2.2],[.5,1.1]));}],
    ["lowlands",(r,ops)=>{ops.push(op.broad(r,"low-relief",[.25,.85]),op.tilt(r,"drift"));for(let i=0,n=integer(r,2,5);i<n;i++)ops.push(op.trench(r,"channel-"+i,[-.45,-1.35],[.55,1.45]));if(r()<.6)ops.push(op.basin(r,"wet-basin",[-.7,-2]));}]
  ];
  function generate(seed){
    const r=rng(seed),[family,build]=pick(r,families),ops=[];build(r,ops);
    // Cross-family intrusions prevent the family label from becoming the terrain.
    if(r()<.45)ops.push(op.fault(r,"intrusion-fault"));
    if(r()<.38)ops.push(op.basin(r,"intrusion-basin",[-.7,-2.4]));
    if(r()<.32)ops.push(op.ridge(r,"intrusion-ridge",[.7,2],[.55,1.4]));
    return{id:`seed-${seed}`,label:`seed ${seed} / ${family}`,family,seed,ops};
  }
  return{generate,families:()=>families.map(([name])=>name)};
}
