export function createApertureSystem({world,components,footprints,occupancy,terrain,granularProjection=null}){
  const {Aperture,Footprint}=components;
  let sequence=0;
  function sample(ownerId,apertureId,now){
    const aperture=Aperture.get(apertureId);if(!aperture||aperture.owner!==ownerId||!Footprint.has(ownerId))return null;
    const footprint=footprints.inspect(ownerId),occupants=occupancy.inspect(ownerId);
    if(aperture.kind!=="scene-summary")return null;
    const center=footprint.center;
    const ground=terrain.groundHeight(center[0],center[2]);
    const terrainSamples=[],rings=3,spokes=12;
    for(let ring=0;ring<=rings;ring++){
      const radius=footprint.radius*(ring/rings);
      const count=ring===0?1:spokes;
      for(let i=0;i<count;i++){
        const angle=ring===0?0:(i/count)*Math.PI*2;
        const x=center[0]+Math.cos(angle)*radius,z=center[2]+Math.sin(angle)*radius,y=terrain.groundHeight(x,z);
        if(Number.isFinite(y))terrainSamples.push({x:Number(x.toFixed(3)),z:Number(z.toFixed(3)),height:Number(y.toFixed(3))});
      }
    }
    const heights=terrainSamples.map(s=>s.height),minHeight=heights.length?Math.min(...heights):null,maxHeight=heights.length?Math.max(...heights):null;
    const granular=granularProjection?.sampleDensity(center[0],center[2],footprint.radius)??null;
    return{
      observationId:++sequence,
      sampledAtMs:Number(now.toFixed(1)),
      observer:ownerId,
      aperture:{id:apertureId,kind:aperture.kind},
      footprint:{center:[...center],radius:footprint.radius},
      measurement:{
        groundHeight:Number.isFinite(ground)?Number(ground.toFixed(3)):null,
        terrainProfile:{samples:terrainSamples,minHeight,maxHeight,heightRange:minHeight==null?null:Number((maxHeight-minHeight).toFixed(3))},
        granularOccupancy:granular?{occupied:granular.grains>0,density:Number((granular.grains/Math.max(1,granular.cells)).toFixed(3)),sampleCells:granular.cells,cellSize:Number(granular.cellSize.toFixed(4))}:null,
        boundedOccupants:occupants.map(o=>({id:o.id,kind:o.bounds.kind}))
      }
    };
  }
  return{sample,inspect:()=>world.query(Aperture).map(id=>({id,...Aperture.get(id)}))};
}
