// Reusable geometry extracted from Betwixt's Observer Cardinal Vessel.
export function buildCardinalCage({THREE,parent,material,name='cardinal-cage',nodeRadius=1.72,ringRadius=.66,tube=.055,omitNode=null}={}){
  const shell=new THREE.Group();shell.name=name;parent.add(shell);
  const zAxis=new THREE.Vector3(0,0,1);
  const nodes={
    xp:new THREE.Vector3(nodeRadius,0,0),xn:new THREE.Vector3(-nodeRadius,0,0),
    yp:new THREE.Vector3(0,nodeRadius,0),yn:new THREE.Vector3(0,-nodeRadius,0),
    zp:new THREE.Vector3(0,0,nodeRadius),zn:new THREE.Vector3(0,0,-nodeRadius)
  };
  const docks={};
  for(const [id,p] of Object.entries(nodes)){
    if(id===omitNode)continue;
    const normal=p.clone().normalize(),dock=new THREE.Group();dock.name=name+':dock:'+id;dock.position.copy(p);dock.quaternion.setFromUnitVectors(zAxis,normal);shell.add(dock);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(ringRadius,tube,10,40),material);ring.castShadow=true;dock.add(ring);docks[id]=dock;
  }
  function snap(id,towardId){
    const center=nodes[id],toward=nodes[towardId].clone().sub(center).normalize(),normal=center.clone().normalize();
    const tangent=toward.addScaledVector(normal,-toward.dot(normal)).normalize();
    return center.clone().addScaledVector(tangent,ringRadius);
  }
  function sphericalArc(namePart,aId,bId){
    if(aId===omitNode||bId===omitNode)return;
    const a=snap(aId,bId),b=snap(bId,aId),r=(a.length()+b.length())*.5;
    const ua=a.clone().normalize(),ub=b.clone().normalize(),angle=Math.acos(THREE.MathUtils.clamp(ua.dot(ub),-1,1));
    const curve=new THREE.Curve();curve.getPoint=(t,target=new THREE.Vector3())=>{
      const sin=Math.sin(angle),w0=Math.sin((1-t)*angle)/sin,w1=Math.sin(t*angle)/sin;
      return target.copy(ua).multiplyScalar(w0).addScaledVector(ub,w1).normalize().multiplyScalar(r);
    };
    const member=new THREE.Mesh(new THREE.TubeGeometry(curve,20,tube,8,false),material);member.name=name+':shell:'+namePart;member.castShadow=true;shell.add(member);
  }
  const edges=[['xp','yp'],['yp','xn'],['xn','yn'],['yn','xp'],['yp','zp'],['zp','yn'],['yn','zn'],['zn','yp']];
  edges.forEach(([a,b],i)=>sphericalArc(String(i),a,b));
  return{shell,nodes,docks,nodeRadius,ringRadius,omitNode};
}


export const buildCartridge=(opts)=>buildCardinalCage({...opts,omitNode:null,name:opts.name??'seven-node-six-ring'});
export const buildReceiver=(opts)=>buildCardinalCage({...opts,omitNode:'xp',nodeRadius:opts.nodeRadius??2.56,name:opts.name??'six-node-five-ring'});
export function buildVessel({THREE,parent,material,cartridgeRadius=1.72,ringRadius=.66,tube=.055,clearance=.18}={}){
 const root=new THREE.Group();parent.add(root);
 const cartridge=buildCartridge({THREE,parent:root,material,nodeRadius:cartridgeRadius,ringRadius,tube});
 const receiver=buildReceiver({THREE,parent:root,material,nodeRadius:cartridgeRadius+ringRadius+clearance,ringRadius,tube});
 return {root,cartridge,receiver};
}
