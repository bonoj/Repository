export function createSpatialProbeSystem({world,components,THREE,terrain,footprints,apertures,analysis,ownerId,apertureId}){
  const {Transform,Observation}=components;
  const cases=[
    {name:"flat",center:[-4.8,-4.2],impacts:[]},
    {name:"single-center",center:[0,0],impacts:[{x:0,z:0,magnitude:.85}]},
    {name:"single-edge",center:[3.8,0],impacts:[{x:2.0,z:0,magnitude:.85}]},
    {name:"overlap",center:[0,4.2],impacts:[{x:-.55,z:4.2,magnitude:.85},{x:.55,z:4.2,magnitude:.85}]},
    {name:"apparatus-boundary",center:[7.2,0],impacts:[]}
  ];
  function capture(name,now){
    footprints.update();
    const evidence=apertures.sample(ownerId,apertureId,now);
    if(!evidence)return null;
    const entity=world.entity();world.add(entity,Observation,evidence);
    return{name,observation:{entity,...evidence},analysis:analysis.analyze(entity)};
  }
  function run(now=performance.now()){
    const transform=Transform.get(ownerId),saved=transform.position.clone(),results=[];
    terrain.reset();
    for(const test of cases){
      terrain.reset();
      for(const hit of test.impacts){
        const y=terrain.terrainHeight(hit.x,hit.z);
        terrain.impact(new THREE.Vector3(hit.x,Number.isFinite(y)?y:terrain.groundHeight(hit.x,hit.z),hit.z),{magnitude:hit.magnitude});
      }
      transform.position.set(test.center[0],saved.y,test.center[1]);
      results.push(capture(test.name,now));
    }
    terrain.reset();transform.position.copy(saved);footprints.update();
    return results;
  }
  return{run,cases:()=>cases.map(c=>({name:c.name,center:[...c.center],impacts:c.impacts.map(x=>({...x}))}))};
}
