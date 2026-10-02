import {createWorld} from "../core/ecs.js";

export function attachBetwixtMirror(){
  const donor=globalThis.vestibule;
  if(!donor?.presences?.length)throw new Error("Betwixt presences unavailable for Repository mirror");

  const world=createWorld();
  const Identity=world.component("Identity");
  const Transform=world.component("Transform");
  const DonorPresence=world.component("DonorPresence");
  const entities=[];

  donor.presences.forEach((object,slot)=>{
    const id=world.entity();
    world.add(id,Identity,{kind:"betwixt-presence",slot,key:`betwixt-presence-${slot}`});
    world.add(id,Transform,{
      position:[object.position.x,object.position.y,object.position.z],
      rotation:[object.rotation.x,object.rotation.y,object.rotation.z],
      scale:[object.scale.x,object.scale.y,object.scale.z]
    });
    world.add(id,DonorPresence,{slot});
    entities.push(id);
  });

  function sample(){
    entities.forEach((id,slot)=>{
      const object=donor.presences[slot];
      const transform=Transform.get(id);
      transform.position[0]=object.position.x;
      transform.position[1]=object.position.y;
      transform.position[2]=object.position.z;
      transform.rotation[0]=object.rotation.x;
      transform.rotation[1]=object.rotation.y;
      transform.rotation[2]=object.rotation.z;
      transform.scale[0]=object.scale.x;
      transform.scale[1]=object.scale.y;
      transform.scale[2]=object.scale.z;
    });
  }

  function inspect(){
    sample();
    return entities.map(id=>({
      entity:id,
      identity:{...Identity.get(id)},
      transform:{
        position:[...Transform.get(id).position],
        rotation:[...Transform.get(id).rotation],
        scale:[...Transform.get(id).scale]
      }
    }));
  }

  const mirror={world,components:{Identity,Transform,DonorPresence},entities,sample,inspect};
  globalThis.RepositoryBetwixt={mirror};
  return mirror;
}
