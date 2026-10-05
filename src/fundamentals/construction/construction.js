// Semantic construction: domain-neutral construction topology.
// No Three.js, transforms, meshes, chemistry, or project/locus ownership.

const copyPort=p=>typeof p==="string"?{id:p}:{...p};

export function constructionThing({id,kind="thing",ports=[],semantics={}}={}){
  if(!id)throw new Error("Construction Thing requires an id");
  const normalized=ports.map(copyPort);
  const ids=new Set(normalized.map(p=>p.id));
  if(ids.size!==normalized.length||normalized.some(p=>p.id==null))throw new Error(`Construction Thing ${id} ports require unique ids`);
  return Object.freeze({id,kind,ports:Object.freeze(normalized.map(Object.freeze)),semantics:Object.freeze({...semantics})});
}

export function construction({name="construction",things=[],relations=[]}={}){
  const byId=new Map(things.map(t=>[t.id,t]));
  if(byId.size!==things.length)throw new Error("Construction Thing ids must be unique");
  const graph={name,things:[...things],relations:[...relations]};
  for(const r of relations)validateRelation(graph,r);
  return graph;
}

export function portOf(graph,thingId,portId){
  return graph.things.find(t=>t.id===thingId)?.ports.find(p=>p.id===portId)??null;
}

export function relationsAt(graph,thingId,portId=null){
  return graph.relations.filter(r=>
    (r.a.thing===thingId&&(portId==null||r.a.port===portId))||
    (r.b.thing===thingId&&(portId==null||r.b.port===portId))
  );
}

export function portAvailable(graph,thingId,portId){
  return !!portOf(graph,thingId,portId)&&relationsAt(graph,thingId,portId).length===0;
}

function validateEnd(graph,end){
  if(!graph.things.some(t=>t.id===end?.thing))throw new Error(`Unknown construction Thing ${end?.thing}`);
  if(!portOf(graph,end.thing,end.port))throw new Error(`Unknown construction port ${end.thing}.${String(end.port)}`);
}
function validateRelation(graph,relation){
  validateEnd(graph,relation.a);validateEnd(graph,relation.b);
  const others=graph.relations.filter(r=>r!==relation);
  const occupied=(end)=>others.some(r=>(r.a.thing===end.thing&&r.a.port===end.port)||(r.b.thing===end.thing&&r.b.port===end.port));
  if(occupied(relation.a)||occupied(relation.b))throw new Error("Construction relation claims an occupied port");
}

export function relate(graph,{a,b,kind="attachment",semantics={}}={}){
  const relation={a:{...a},b:{...b},kind,semantics:{...semantics}};
  validateEnd(graph,relation.a);validateEnd(graph,relation.b);
  if(!portAvailable(graph,a.thing,a.port))throw new Error(`Construction port ${a.thing}.${String(a.port)} is occupied`);
  if(!portAvailable(graph,b.thing,b.port))throw new Error(`Construction port ${b.thing}.${String(b.port)} is occupied`);
  return construction({...graph,relations:[...graph.relations,relation]});
}

export function detach(graph,predicate){
  const keep=typeof predicate==="function"?r=>!predicate(r):r=>r!==predicate;
  return construction({...graph,relations:graph.relations.filter(keep)});
}
