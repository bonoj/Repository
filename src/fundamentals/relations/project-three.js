// Three-dimensional projection of relational graphs.
// Port geometry is presentation grammar; the graph remains the authority.

export function createRelationalProjector(THREE){
  const tetrahedral=()=>[
    new THREE.Vector3(0,1,0),new THREE.Vector3(Math.sqrt(8/9),-1/3,0),
    new THREE.Vector3(-Math.sqrt(2/9),-1/3,Math.sqrt(2/3)),new THREE.Vector3(-Math.sqrt(2/9),-1/3,-Math.sqrt(2/3))
  ];
  const linear=()=>[new THREE.Vector3(-1,0,0),new THREE.Vector3(1,0,0)];
  function bent(degrees=104.5){const h=THREE.MathUtils.degToRad(degrees*.5);return[new THREE.Vector3(-Math.sin(h),Math.cos(h),0),new THREE.Vector3(Math.sin(h),Math.cos(h),0)]}
  function pyramidal(degrees=106.7){const dot=Math.cos(THREE.MathUtils.degToRad(degrees)),y=Math.sqrt((1+2*dot)/3),r=Math.sqrt(1-y*y);return[0,1,2].map(i=>new THREE.Vector3(r*Math.cos(i*Math.PI*2/3),-y,r*Math.sin(i*Math.PI*2/3)))}
  function localChildren(parent,torsion=0){const back=parent.clone().negate().normalize(),helper=Math.abs(back.y)<.9?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0),u=new THREE.Vector3().crossVectors(helper,back).normalize(),v=new THREE.Vector3().crossVectors(back,u).normalize(),phase=THREE.MathUtils.degToRad(torsion);return[0,1,2].map(i=>{const a=phase+i*Math.PI*2/3;return back.clone().multiplyScalar(-1/3).addScaledVector(u,Math.sqrt(8/9)*Math.cos(a)).addScaledVector(v,Math.sqrt(8/9)*Math.sin(a)).normalize()})}
  function project(graph,{bondLength=.48}={}){
    const positions=new Map(),root=graph.root??graph.nodes[0]?.id;if(root==null)return{graph,positions};positions.set(root,new THREE.Vector3());
    const outgoing=new Map();for(const e of graph.edges){if(!outgoing.has(e.from))outgoing.set(e.from,[]);outgoing.get(e.from).push(e)}
    const visit=(id,heading=new THREE.Vector3(0,1,0))=>{const base=positions.get(id),edges=outgoing.get(id)||[],node=graph.nodes.find(n=>n.id===id);let dirs;
      if(node?.projection==="tetrahedral")dirs=tetrahedral();
      else if(node?.projection==="tetrahedral-local")dirs=localChildren(heading,node.torsionDegrees??0);
      else if(node?.projection==="bent")dirs=bent(node.angleDegrees??104.5);
      else if(node?.projection==="pyramidal")dirs=pyramidal(node.angleDegrees??106.7);
      else if(node?.projection==="linear")dirs=linear();
      else if(node?.projection==="linear-local")dirs=[heading.clone()];
      else dirs=edges.map((_,i)=>new THREE.Vector3(Math.cos(i*Math.PI*2/Math.max(1,edges.length)),0,Math.sin(i*Math.PI*2/Math.max(1,edges.length))));
      edges.forEach((e,i)=>{if(positions.has(e.to))return;const d=(dirs[i]??heading).clone().normalize();positions.set(e.to,base.clone().addScaledVector(d,e.length??bondLength));visit(e.to,d)})};
    visit(root);return{graph,positions};
  }
  return{project,tetrahedral,linear,bent,pyramidal,tetrahedralChildren:localChildren};
}
