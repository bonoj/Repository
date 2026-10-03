import * as THREE from "three";

const RelationalBuild=Object.freeze({
  // Canonical presentation frame: one tetrahedral port is +Y ("point up"),
  // the other three form the equivalent lower tripod. Orientation is deterministic
  // presentation grammar, not chemistry semantics.
  tetrahedral:Object.freeze([
    new THREE.Vector3(0,1,0),
    new THREE.Vector3(Math.sqrt(8/9),-1/3,0),
    new THREE.Vector3(-Math.sqrt(2/9),-1/3, Math.sqrt(2/3)),
    new THREE.Vector3(-Math.sqrt(2/9),-1/3,-Math.sqrt(2/3))
  ]),
  bent(angleDegrees=104.5){
    const half=THREE.MathUtils.degToRad(angleDegrees*.5);
    return [
      new THREE.Vector3(-Math.sin(half),Math.cos(half),0),
      new THREE.Vector3( Math.sin(half),Math.cos(half),0)
    ];
  },
  linear:Object.freeze([
    new THREE.Vector3(-1,0,0),
    new THREE.Vector3( 1,0,0)
  ]),
  trigonalChildren(parentDirection,planeAxis=null){
    const back=parentDirection.clone().negate().normalize();
    const u=planeAxis
      ? planeAxis.clone().addScaledVector(back,-planeAxis.dot(back)).normalize()
      : new THREE.Vector3().crossVectors(Math.abs(back.y)<.9?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0),back).normalize();
    // Experimental ethylene is slightly opened at C-C-H (~121.5 deg), so the
    // two C-H directions are symmetric in the same plane around the C-C axis.
    const a=THREE.MathUtils.degToRad(121.55);
    return [
      back.clone().multiplyScalar(Math.cos(a)).addScaledVector(u, Math.sin(a)).normalize(),
      back.clone().multiplyScalar(Math.cos(a)).addScaledVector(u,-Math.sin(a)).normalize()
    ];
  },
  tetrahedralChildren(parentDirection,torsionDegrees=0){
    const back=parentDirection.clone().negate().normalize();
    const helper=Math.abs(back.y)<.9?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0);
    const u=new THREE.Vector3().crossVectors(helper,back).normalize();
    const v=new THREE.Vector3().crossVectors(back,u).normalize();
    const phase=THREE.MathUtils.degToRad(torsionDegrees);
    return [0,1,2].map(i=>{
      const a=phase+i*Math.PI*2/3;
      return back.clone().multiplyScalar(-1/3)
        .addScaledVector(u,Math.sqrt(8/9)*Math.cos(a))
        .addScaledVector(v,Math.sqrt(8/9)*Math.sin(a)).normalize();
    });
  },
  project(graph,{bondLength=.48}={}){
    const positions=new Map(),rootId=graph.root||graph.nodes[0]?.id;
    positions.set(rootId,new THREE.Vector3());
    const outgoing=new Map();
    for(const edge of graph.edges){
      if(!outgoing.has(edge.from))outgoing.set(edge.from,[]);
      outgoing.get(edge.from).push(edge);
    }
    const visit=(id,heading=new THREE.Vector3(0,1,0))=>{
      const base=positions.get(id),edges=outgoing.get(id)||[];
      const node=graph.nodes.find(n=>n.id===id);
      const dirs=node?.projection==='trigonal-root'
        ? [new THREE.Vector3(0,1,0),
           new THREE.Vector3( Math.sin(THREE.MathUtils.degToRad(121.55)),Math.cos(THREE.MathUtils.degToRad(121.55)),0),
           new THREE.Vector3(-Math.sin(THREE.MathUtils.degToRad(121.55)),Math.cos(THREE.MathUtils.degToRad(121.55)),0)]
        : node?.projection==='tetrahedral'
        ? this.tetrahedral
        : node?.projection==='trigonal-local'
          ? this.trigonalChildren(heading,node.planeAxis?new THREE.Vector3(...node.planeAxis):null)
          : node?.projection==='tetrahedral-local'
          ? this.tetrahedralChildren(heading,node.torsionDegrees??0)
          : node?.projection==='bent'
          ? this.bent(node.angleDegrees??104.5)
          : node?.projection==='linear-local'
            ? [heading.clone()]
          : node?.projection==='linear'
            ? this.linear
            : edges.map((_,i)=>new THREE.Vector3(Math.cos(i*Math.PI*2/Math.max(1,edges.length)),0,Math.sin(i*Math.PI*2/Math.max(1,edges.length))));
      edges.forEach((edge,i)=>{
        if(positions.has(edge.to))return;
        const dir=(dirs[i]||heading).clone().normalize();
        positions.set(edge.to,base.clone().addScaledVector(dir,edge.length||bondLength));
        visit(edge.to,dir);
      });
    };
    visit(rootId);
    return {graph,positions};
  },
  materialize(projected,parent,{atomRadius=.115,bondRadius=.025}={}){
    const group=new THREE.Group();group.name='relational-build:'+projected.graph.name;parent.add(group);
    const nodeById=new Map(projected.graph.nodes.map(n=>[n.id,n]));
    const mats={
      carbon:new THREE.MeshStandardMaterial({color:0x303437,roughness:.42,metalness:.08}),
      oxygen:new THREE.MeshStandardMaterial({color:0xc83d32,roughness:.42,metalness:.04}),
      hydrogen:new THREE.MeshStandardMaterial({color:0xf1eee6,roughness:.52,metalness:.02}),
      neutral:new THREE.MeshStandardMaterial({color:0xb7b8b4,roughness:.48,metalness:.04}),
      bond:new THREE.MeshStandardMaterial({color:0x747b7d,roughness:.40,metalness:.18})
    };
    for(const [id,p] of projected.positions){
      const node=nodeById.get(id),r=(node?.radius||1)*atomRadius;
      const m=new THREE.Mesh(new THREE.SphereGeometry(r,16,10),mats[node?.kind]||mats.neutral);
      m.position.copy(p);m.castShadow=true;m.userData.relationalNode=id;group.add(m);
    }
    for(const edge of projected.graph.edges){
      const a=projected.positions.get(edge.from),b=projected.positions.get(edge.to);if(!a||!b)continue;
      const d=b.clone().sub(a),len=d.length(),m=new THREE.Mesh(new THREE.CylinderGeometry(bondRadius,bondRadius,len,8),mats.bond);
      m.position.copy(a).add(b).multiplyScalar(.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());
      m.userData.relationalConnection=edge.kind||'connection';group.add(m);
    }
    group.userData.relational=projected.graph;return group;
  }
});

const methaneGraph=Object.freeze({
  name:'methane-t0',root:'C1',
  nodes:Object.freeze([
    Object.freeze({id:'C1',kind:'carbon',projection:'tetrahedral',ports:4,radius:1.18}),
    ...['H1','H2','H3','H4'].map(id=>Object.freeze({id,kind:'hydrogen',ports:1,radius:.72}))
  ]),
  edges:Object.freeze(['H1','H2','H3','H4'].map((to,i)=>Object.freeze({from:'C1',to,kind:'bond',order:1,port:i})))
});

const waterGraph=Object.freeze({
  name:'water-t0',root:'O1',
  // Molecular geometry is an observed chemistry constraint, not inferred merely
  // from visible neighbor count: two O-H bonds plus two lone-pair regions yield
  // a bent molecule with an H-O-H angle near 104.5 degrees.
  nodes:Object.freeze([
    Object.freeze({id:'O1',kind:'oxygen',projection:'bent',angleDegrees:104.5,ports:2,radius:1.12,electronDomains:4,lonePairs:2}),
    Object.freeze({id:'H1',kind:'hydrogen',ports:1,radius:.72}),
    Object.freeze({id:'H2',kind:'hydrogen',ports:1,radius:.72})
  ]),
  edges:Object.freeze([
    Object.freeze({from:'O1',to:'H1',kind:'bond',order:1,port:0}),
    Object.freeze({from:'O1',to:'H2',kind:'bond',order:1,port:1})
  ]),
  assertions:Object.freeze({molecularGeometry:'bent',angleDegrees:104.5})
});

const carbonDioxideGraph=Object.freeze({
  name:'carbon-dioxide-t0',root:'C1',
  // CO2 is linear despite having the same visible neighbor count as H2O.
  // Two C=O double bonds form two electron domains around carbon: 180 degrees.
  nodes:Object.freeze([
    Object.freeze({id:'C1',kind:'carbon',projection:'linear',ports:2,radius:1.18,electronDomains:2}),
    Object.freeze({id:'O1',kind:'oxygen',ports:1,radius:1.12}),
    Object.freeze({id:'O2',kind:'oxygen',ports:1,radius:1.12})
  ]),
  edges:Object.freeze([
    Object.freeze({from:'C1',to:'O1',kind:'bond',order:2,port:0}),
    Object.freeze({from:'C1',to:'O2',kind:'bond',order:2,port:1})
  ]),
  assertions:Object.freeze({molecularGeometry:'linear',angleDegrees:180,bondOrders:Object.freeze([2,2])})
});

const ethaneGraph=Object.freeze({
  name:'ethane-t0',root:'C1',
  nodes:Object.freeze([
    Object.freeze({id:'C1',kind:'carbon',projection:'tetrahedral',ports:4,radius:1.18}),
    Object.freeze({id:'C2',kind:'carbon',projection:'tetrahedral-local',torsionDegrees:60,ports:4,radius:1.18}),
    ...['H1','H2','H3','H4','H5','H6'].map(id=>Object.freeze({id,kind:'hydrogen',ports:1,radius:.72}))
  ]),
  edges:Object.freeze([
    Object.freeze({from:'C1',to:'C2',kind:'bond',order:1,port:0}),
    Object.freeze({from:'C1',to:'H1',kind:'bond',order:1,port:1}),
    Object.freeze({from:'C1',to:'H2',kind:'bond',order:1,port:2}),
    Object.freeze({from:'C1',to:'H3',kind:'bond',order:1,port:3}),
    Object.freeze({from:'C2',to:'H4',kind:'bond',order:1,port:1}),
    Object.freeze({from:'C2',to:'H5',kind:'bond',order:1,port:2}),
    Object.freeze({from:'C2',to:'H6',kind:'bond',order:1,port:3})
  ]),
  assertions:Object.freeze({formula:'C2H6',localGeometry:'tetrahedral',carbonCarbonBondOrder:1,conformer:'staggered'})
});

const ethyleneGraph=Object.freeze({
  name:'ethylene-t0',root:'C1',
  nodes:Object.freeze([
    Object.freeze({id:'C1',kind:'carbon',projection:'trigonal-root',ports:3,radius:1.18}),
    Object.freeze({id:'C2',kind:'carbon',projection:'trigonal-local',planeAxis:Object.freeze([1,0,0]),ports:3,radius:1.18}),
    ...['H1','H2','H3','H4'].map(id=>Object.freeze({id,kind:'hydrogen',ports:1,radius:.72}))
  ]),
  edges:Object.freeze([
    Object.freeze({from:'C1',to:'C2',kind:'bond',order:2,port:0}),
    Object.freeze({from:'C1',to:'H1',kind:'bond',order:1,port:1}),
    Object.freeze({from:'C1',to:'H2',kind:'bond',order:1,port:2}),
    Object.freeze({from:'C2',to:'H3',kind:'bond',order:1,port:1}),
    Object.freeze({from:'C2',to:'H4',kind:'bond',order:1,port:2})
  ]),
  assertions:Object.freeze({formula:'C2H4',geometry:'planar',symmetry:'D2h',carbonCarbonBondOrder:2,cchAngleDegrees:121.55})
});

const acetyleneGraph=Object.freeze({
  name:'acetylene-t0',root:'C1',
  nodes:Object.freeze([
    Object.freeze({id:'C1',kind:'carbon',projection:'linear',ports:2,radius:1.18}),
    Object.freeze({id:'C2',kind:'carbon',projection:'linear-local',ports:2,radius:1.18}),
    Object.freeze({id:'H1',kind:'hydrogen',ports:1,radius:.72}),
    Object.freeze({id:'H2',kind:'hydrogen',ports:1,radius:.72})
  ]),
  edges:Object.freeze([
    Object.freeze({from:'C1',to:'C2',kind:'bond',order:3,port:0}),
    Object.freeze({from:'C1',to:'H1',kind:'bond',order:1,port:1}),
    Object.freeze({from:'C2',to:'H2',kind:'bond',order:1,port:1})
  ]),
  assertions:Object.freeze({formula:'C2H2',geometry:'linear',symmetry:'Dinfh',carbonCarbonBondOrder:3,hccAngleDegrees:180})
});

const GeometryVerifier=Object.freeze({
  angle(projected,a,center,b){
    const p=projected.positions;
    const u=p.get(a).clone().sub(p.get(center)).normalize();
    const v=p.get(b).clone().sub(p.get(center)).normalize();
    return THREE.MathUtils.radToDeg(Math.acos(THREE.MathUtils.clamp(u.dot(v),-1,1)));
  },
  bondOrder(graph,a,b){
    return graph.edges.find(e=>(e.from===a&&e.to===b)||(e.from===b&&e.to===a))?.order??0;
  },
  coplanar(projected,ids,tolerance=1e-6){
    const p=projected.positions,origin=p.get(ids[0]);
    let normal=null;
    for(let i=1;i<ids.length-1&&!normal;i++)for(let j=i+1;j<ids.length&&!normal;j++){
      const n=p.get(ids[i]).clone().sub(origin).cross(p.get(ids[j]).clone().sub(origin));
      if(n.lengthSq()>1e-12)normal=n.normalize();
    }
    if(!normal)return true;
    return ids.every(id=>Math.abs(p.get(id).clone().sub(origin).dot(normal))<=tolerance);
  },
  run(graph,checks){
    const projected=RelationalBuild.project(graph),results=[];
    const near=(actual,expected,tolerance)=>Math.abs(actual-expected)<=tolerance;
    for(const check of checks){
      let actual,pass=false;
      if(check.kind==='angle'){actual=this.angle(projected,check.a,check.center,check.b);pass=near(actual,check.expected,check.tolerance??.1);}
      else if(check.kind==='bondOrder'){actual=this.bondOrder(graph,check.a,check.b);pass=actual===check.expected;}
      else if(check.kind==='coplanar'){actual=this.coplanar(projected,check.ids,check.tolerance);pass=actual===check.expected;}
      results.push({...check,actual,pass});
    }
    return {name:graph.name,pass:results.every(r=>r.pass),results,projected};
  }
});

const geometryRegressionSuite=Object.freeze([
  Object.freeze({graph:methaneGraph,expect:true,checks:Object.freeze([
    Object.freeze({kind:'angle',a:'H1',center:'C1',b:'H2',expected:109.4712,tolerance:.01})
  ])}),
  Object.freeze({graph:waterGraph,expect:true,checks:Object.freeze([
    Object.freeze({kind:'angle',a:'H1',center:'O1',b:'H2',expected:104.5,tolerance:.01})
  ])}),
  Object.freeze({graph:carbonDioxideGraph,expect:true,checks:Object.freeze([
    Object.freeze({kind:'angle',a:'O1',center:'C1',b:'O2',expected:180,tolerance:.01}),
    Object.freeze({kind:'bondOrder',a:'C1',b:'O1',expected:2}),
    Object.freeze({kind:'bondOrder',a:'C1',b:'O2',expected:2})
  ])}),
  Object.freeze({graph:ethaneGraph,expect:true,checks:Object.freeze([
    Object.freeze({kind:'angle',a:'H1',center:'C1',b:'H2',expected:109.4712,tolerance:.01}),
    Object.freeze({kind:'angle',a:'H4',center:'C2',b:'H5',expected:109.4712,tolerance:.01}),
    Object.freeze({kind:'bondOrder',a:'C1',b:'C2',expected:1})
  ])}),
  // Known-bad candidate: must fail the scientific C-C-H angle before we repair it.
  Object.freeze({graph:acetyleneGraph,expect:true,checks:Object.freeze([
    Object.freeze({kind:'angle',a:'H1',center:'C1',b:'C2',expected:180,tolerance:.01}),
    Object.freeze({kind:'angle',a:'C1',center:'C2',b:'H2',expected:180,tolerance:.01}),
    Object.freeze({kind:'bondOrder',a:'C1',b:'C2',expected:3})
  ])}),
  Object.freeze({graph:ethyleneGraph,expect:true,checks:Object.freeze([
    Object.freeze({kind:'angle',a:'C2',center:'C1',b:'H1',expected:121.55,tolerance:.05}),
    Object.freeze({kind:'angle',a:'C1',center:'C2',b:'H3',expected:121.55,tolerance:.05}),
    Object.freeze({kind:'coplanar',ids:Object.freeze(['C1','C2','H1','H2','H3','H4']),expected:true}),
    Object.freeze({kind:'bondOrder',a:'C1',b:'C2',expected:2})
  ])})
]);
const geometryRegressionReport=geometryRegressionSuite.map(test=>{
  const report=GeometryVerifier.run(test.graph,test.checks);
  return {name:report.name,expectedPass:test.expect,actualPass:report.pass,matchedExpectation:report.pass===test.expect,results:report.results};
});
const geometryRegressionHealthy=geometryRegressionReport.every(r=>r.matchedExpectation);
if(!geometryRegressionHealthy){
  const failures=geometryRegressionReport.filter(r=>!r.matchedExpectation);
  throw new Error('CHEMLAB geometry regression expectation mismatch '+JSON.stringify(failures));
}


export {RelationalBuild,GeometryVerifier,geometryRegressionReport,geometryRegressionHealthy};
