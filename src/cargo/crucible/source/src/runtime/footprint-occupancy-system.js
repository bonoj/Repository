export function createFootprintOccupancySystem({world,components,footprints}){
  const {Transform,SpatialBounds,Footprint}=components;
  function occupants(footprintId){
    if(!Footprint.has(footprintId))return[];
    const out=[];
    for(const id of world.query(Transform,SpatialBounds)){
      if(id===footprintId)continue;
      const t=Transform.get(id),b=SpatialBounds.get(id);
      const padding=b.kind==="sphere"?(b.radius||0):0;
      if(footprints.contains(footprintId,t.position,padding))out.push(id);
    }
    return out;
  }
  function inspect(footprintId){return occupants(footprintId).map(id=>({id,bounds:SpatialBounds.get(id),position:Transform.get(id).position.toArray()}))}
  return{occupants,inspect};
}
