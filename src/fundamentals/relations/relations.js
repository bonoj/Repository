// Relational semantics: topology first, projection second.
// A relation graph describes what is connected and through which semantic ports.
// Geometry is one possible consequence of that graph.

export function relationalGraph({name="relation",root=null,nodes=[],edges=[]}={}){
  const nodeById=new Map(nodes.map(n=>[n.id,n]));
  if(nodeById.size!==nodes.length)throw new Error("Relational graph node ids must be unique");
  for(const e of edges)if(!nodeById.has(e.from)||!nodeById.has(e.to))throw new Error(`Unknown relational endpoint ${e.from} -> ${e.to}`);
  return{name,root:root??nodes[0]?.id??null,nodes:[...nodes],edges:[...edges]};
}

export function connectionsFrom(graph,id){return graph.edges.filter(e=>e.from===id||e.to===id)}
export function outgoingFrom(graph,id){return graph.edges.filter(e=>e.from===id)}

export function availablePorts(graph,id){
  const node=graph.nodes.find(n=>n.id===id);if(!node)return[];
  const declared=Array.isArray(node.ports)?node.ports.map(p=>typeof p==="string"?{id:p}:{...p}):Array.from({length:node.ports??0},(_,i)=>({id:i}));
  const used=new Set();
  for(const e of graph.edges){if(e.from===id&&e.port!=null)used.add(e.port);if(e.to===id&&e.toPort!=null)used.add(e.toPort)}
  return declared.filter(p=>!used.has(p.id));
}

export function connect(graph,{from,to,kind="connection",port=null,toPort=null,...semantics}){
  const nodes=graph.nodes.map(n=>({...n})),edges=graph.edges.map(e=>({...e}));
  if(!nodes.some(n=>n.id===from)||!nodes.some(n=>n.id===to))throw new Error("Both relational endpoints must exist");
  if(port!=null&&!availablePorts({...graph,nodes,edges},from).some(p=>p.id===port))throw new Error(`Port ${String(port)} on ${from} is unavailable`);
  if(toPort!=null&&!availablePorts({...graph,nodes,edges},to).some(p=>p.id===toPort))throw new Error(`Port ${String(toPort)} on ${to} is unavailable`);
  edges.push({from,to,kind,port,toPort,...semantics});return relationalGraph({...graph,nodes,edges});
}

export function composeGraphs(a,b,{name=`${a.name}+${b.name}`,connection=null}={}){
  const ids=new Set(a.nodes.map(n=>n.id));for(const n of b.nodes)if(ids.has(n.id))throw new Error(`Composition collides at node ${n.id}`);
  let graph=relationalGraph({name,root:a.root,nodes:[...a.nodes,...b.nodes],edges:[...a.edges,...b.edges]});
  if(connection)graph=connect(graph,connection);return graph;
}
