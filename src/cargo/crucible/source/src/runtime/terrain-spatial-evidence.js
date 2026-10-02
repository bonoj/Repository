export function deriveTerrainSpatialEvidence(observation){
  const samples=observation?.measurement?.terrainProfile?.samples;
  if(!samples?.length)return null;
  const center=observation.footprint.center,radius=Math.max(.001,observation.footprint.radius);
  const heights=samples.map(s=>s.height),mean=heights.reduce((a,b)=>a+b,0)/heights.length;
  const min=Math.min(...heights),max=Math.max(...heights),range=max-min;
  let variance=0;for(const h of heights)variance+=(h-mean)*(h-mean);variance/=heights.length;
  const centerSample=samples.reduce((best,s)=>{const d=(s.x-center[0])**2+(s.z-center[2])**2;return !best||d<best.d?{s,d}:best},null)?.s;
  const outer=samples.filter(s=>Math.hypot(s.x-center[0],s.z-center[2])>=radius*.8);
  const outerMean=outer.length?outer.reduce((n,s)=>n+s.height,0)/outer.length:mean;
  let strongest=null;
  for(const s of samples){const delta=s.height-mean,mag=Math.abs(delta);if(!strongest||mag>strongest.magnitude)strongest={x:s.x,z:s.z,height:s.height,delta:Number(delta.toFixed(3)),magnitude:mag}}
  return{
    relief:{min:Number(min.toFixed(3)),max:Number(max.toFixed(3)),range:Number(range.toFixed(3)),mean:Number(mean.toFixed(3)),roughness:Number(Math.sqrt(variance).toFixed(3))},
    centerRelativeToEdge:Number(((centerSample?.height??mean)-outerMean).toFixed(3)),
    strongestDeviation:strongest?{x:strongest.x,z:strongest.z,height:strongest.height,delta:strongest.delta}:null
  };
}
