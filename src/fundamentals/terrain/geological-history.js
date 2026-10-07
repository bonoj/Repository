// Earned terrain goodies from Beyond geological-history T4.
// Known-good baseline: Repository 55036d8f, seed 741, 289²; observed 60 fps.
// Ingredients, not a finished terrain. Sharp cliffs are valid; accidental construction
// signatures and unbounded cross-process coupling are not.

export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const smooth=t=>t*t*(3-2*t);
export const mix=(a,b,t)=>a+(b-a)*t;

export function segmentDistance(x,z,ax,az,bx,bz){
  const dx=bx-ax,dz=bz-az,l=dx*dx+dz*dz||1,t=clamp(((x-ax)*dx+(z-az)*dz)/l);
  return Math.hypot(x-ax-dx*t,z-az-dz*t);
}

export function makeStratigraphy(strata,{phaseScale=.92,contactBlend=.22}={}){
  const cycle=strata.reduce((n,s)=>n+s.thick,0);
  function state(structuralHeight,erosion){
    let phase=((structuralHeight-erosion)*phaseScale+cycle*64)%cycle;if(phase<0)phase+=cycle;
    let acc=0;
    for(let i=0;i<strata.length;i++){
      const start=acc,end=acc+strata[i].thick;
      if(phase<=end){
        const local=(phase-start)/strata[i].thick;let resistance=strata[i].resist;
        if(local<contactBlend){const p=(i+strata.length-1)%strata.length;resistance=mix(strata[p].resist,strata[i].resist,smooth(local/contactBlend))}
        else if(local>1-contactBlend){const q=(i+1)%strata.length;resistance=mix(strata[i].resist,strata[q].resist,smooth((local-(1-contactBlend))/contactBlend))}
        return{layer:i,resistance};
      } acc=end;
    }
    return{layer:strata.length-1,resistance:strata[strata.length-1].resist};
  }
  return{strata,cycle,state};
}

// Drainage owns large-scale incision. Material resistance gets bounded local influence.
export function boundedStratigraphicErosion(base,cut,resistance,{cutScale=5.5,strength=.72,neutral=.50}={}){
  return base+smooth(clamp(cut/cutScale))*(neutral-resistance)*strength;
}

export function beddingRelief(structural,erosion,resistance,noiseValue=0,{phaseScale=2.2,noiseScale=.65,amplitude=.48,gain=1.25,neutral=.48}={}){
  const phase=(structural-erosion)*phaseScale+noiseValue*noiseScale;
  return(resistance-neutral)*amplitude*Math.tanh(Math.sin(phase)*gain);
}

// Representation operator, not geology. Returned field should remain authoritative.
export function bandLimit121(heights,n){
  const tmp=new Float32Array(n*n),out=new Float32Array(n*n),k=[1,2,1];
  for(let z=0;z<n;z++)for(let x=0;x<n;x++){let v=0,w=0;for(let o=-1;o<=1;o++){const xx=Math.max(0,Math.min(n-1,x+o)),q=k[o+1];v+=heights[xx+n*z]*q;w+=q}tmp[x+n*z]=v/w}
  for(let z=0;z<n;z++)for(let x=0;x<n;x++){let v=0,w=0;for(let o=-1;o<=1;o++){const zz=Math.max(0,Math.min(n-1,z+o)),q=k[o+1];v+=tmp[x+n*zz]*q;w+=q}out[x+n*z]=v/w}
  return out;
}

// Settled dunes are terrain topology; mantle identity remains available for realization.
export function gypsumDuneMantle(x,z,bedrock,noise){
  const basin=Math.exp(-(Math.pow((x-27)/17,2)+Math.pow((z-18)/12.5,2)));
  const shelter=clamp((2.7-bedrock)/5.4),source=clamp(basin*1.34*shelter);
  const warp=noise(x*.032,z*.032,907)*3.6,axis=x*.54+z*.17+warp,envelope=smooth(clamp((source-.14)/.66));
  const dunes=envelope*(.58+.26*noise(x*.12,z*.09,911))*Math.max(0,.5+.5*Math.sin(axis*1.12));
  return{depth:Math.max(0,envelope*.48+dunes),sand:envelope,kind:envelope>.18?'gypsum-sand':'bedrock'};
}
