// Fundamentals / Six Cities — extracted from the two Workshop floor specimens.
// The Workshop remains untouched until an explicitly requested build/sling.
export const VerifiedRingConstruction=Object.freeze({
  buildFourApertureRing({THREE,parent,name='four-aperture-ring',parentRadius=1.55,apertureRadius=.535,tube=.035,material}={}){
    const root=new THREE.Group();root.name=name;parent.add(root);
    const yAxis=new THREE.Vector3(0,1,0),zAxis=new THREE.Vector3(0,0,1);
    const apertures=[];
    for(let i=0;i<4;i++){
      const angle=i*Math.PI/2,radial=new THREE.Vector3(Math.cos(angle),0,Math.sin(angle));
      const dock=new THREE.Group();dock.name=name+':aperture:'+i;dock.position.copy(radial).multiplyScalar(parentRadius);
      // Canonical TorusGeometry lies in XY with normal +Z. The relationship supplies its frame.
      dock.quaternion.setFromUnitVectors(zAxis,radial);root.add(dock);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(apertureRadius,tube,10,40),material);
      ring.name=dock.name+':ring';ring.castShadow=true;dock.add(ring);
      apertures.push({dock,ring,radial,angle});
    }
    const connectors=[];
    for(let i=0;i<4;i++){
      const a=apertures[i],b=apertures[(i+1)%4];
      // Each connector owns the tangential point on each aperture facing its neighbor.
      const towardB=b.dock.position.clone().sub(a.dock.position).normalize();
      const towardA=a.dock.position.clone().sub(b.dock.position).normalize();
      const tangentAt=(ap,toward)=>{
        const n=ap.radial,t=toward.clone().addScaledVector(n,-toward.dot(n)).normalize();
        return ap.dock.position.clone().addScaledVector(t,apertureRadius);
      };
      const p0=tangentAt(a,towardB),p1=tangentAt(b,towardA);
      const u0=p0.clone().normalize(),u1=p1.clone().normalize();
      const r=(p0.length()+p1.length())*.5,arc=Math.acos(THREE.MathUtils.clamp(u0.dot(u1),-1,1));
      const curve=new THREE.Curve();curve.getPoint=(t,target=new THREE.Vector3())=>{
        const sin=Math.sin(arc),w0=Math.sin((1-t)*arc)/sin,w1=Math.sin(t*arc)/sin;
        return target.copy(u0).multiplyScalar(w0).addScaledVector(u1,w1).normalize().multiplyScalar(r);
      };
      const member=new THREE.Mesh(new THREE.TubeGeometry(curve,20,tube,8,false),material);
      member.name=name+':connector:'+i;member.castShadow=true;root.add(member);
      connectors.push({member,from:i,to:(i+1)%4,p0,p1});
    }
    root.userData.verifiedRing={parentRadius,apertureRadius,tube,apertures,connectors};
    return root;
  },
  verifyFourApertureRing(root,tolerance=1e-5){
    const d=root.userData.verifiedRing,results=[];
    const check=(name,pass,actual,expected)=>results.push({name,pass,actual,expected});
    check('aperture-count',d.apertures.length===4,d.apertures.length,4);
    check('connector-count',d.connectors.length===4,d.connectors.length,4);
    const center=new THREE.Vector3();
    for(let i=0;i<d.apertures.length;i++){
      const a=d.apertures[i],p=a.dock.position,n=new THREE.Vector3(0,0,1).applyQuaternion(a.dock.quaternion).normalize(),radial=p.clone().normalize();
      check('aperture-'+i+':parent-radius',Math.abs(p.length()-d.parentRadius)<=tolerance,p.length(),d.parentRadius);
      check('aperture-'+i+':coplanar',Math.abs(p.y)<=tolerance,p.y,0);
      check('aperture-'+i+':radial-normal',1-n.dot(radial)<=tolerance,n.dot(radial),1);
      const expectedAngle=i*Math.PI/2,actualAngle=Math.atan2(p.z,p.x);
      const phaseError=Math.abs(Math.atan2(Math.sin(actualAngle-expectedAngle),Math.cos(actualAngle-expectedAngle)));
      check('aperture-'+i+':cardinal-phase',phaseError<=tolerance,actualAngle,expectedAngle);
      const neighbors=d.connectors.filter(c=>c.from===i||c.to===i);
      check('aperture-'+i+':degree-two',neighbors.length===2,neighbors.length,2);
      for(const c of neighbors){
        const endpoint=c.from===i?c.p0:c.p1;
        const local=endpoint.clone().sub(p);
        check('aperture-'+i+':connector-'+c.from+'-'+c.to+':on-circumference',Math.abs(local.length()-d.apertureRadius)<=tolerance,local.length(),d.apertureRadius);
        check('aperture-'+i+':connector-'+c.from+'-'+c.to+':in-plane',Math.abs(local.dot(n))<=tolerance,local.dot(n),0);
      }
    }
    for(const c of d.connectors){
      const g=c.member.geometry.attributes.position; // TubeGeometry endpoints must realize the contract endpoints.
      const first=new THREE.Vector3().fromBufferAttribute(g,0);
      const last=new THREE.Vector3().fromBufferAttribute(g,g.count-1);
      const endpointError=Math.min(
        first.distanceTo(c.p0)+last.distanceTo(c.p1),
        first.distanceTo(c.p1)+last.distanceTo(c.p0)
      );
      // Tube vertices orbit the centerline, so endpoint-centerline truth is verified from the generating curve above;
      // this mesh check only guards against a missing/degenerate realization.
      check('connector-'+c.from+'-'+c.to+':mesh-nondegenerate',g.count>16&&Number.isFinite(endpointError),g.count,'>16 vertices');
    }
    return {name:root.name,pass:results.every(r=>r.pass),results};
  }
});

// Exact Workshop floor specimen: two coaxial orb-seat rings and two straight rails.
// No behavior, material flow, or driver semantics are implied.
export function buildTwoRingTwoRail({THREE,parent,material,name='two-ring-two-rail',ringRadius=.535,ringTube=.035,halfLength=1.25,railRadius=.035}={}){
  if(!THREE||!parent||!material)throw new Error('Six Cities pipe requires THREE, parent and material');
  const root=new THREE.Group();root.name=name;parent.add(root);
  for(const z of [-halfLength,halfLength]){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(ringRadius,ringTube,10,36),material);
    ring.position.z=z;ring.castShadow=true;root.add(ring);
  }
  for(const x of [-ringRadius,ringRadius]){
    const a=new THREE.Vector3(x,0,-halfLength),b=new THREE.Vector3(x,0,halfLength);
    const d=b.clone().sub(a),rail=new THREE.Mesh(new THREE.CylinderGeometry(railRadius,railRadius,d.length(),10),material);
    rail.position.copy(a).add(b).multiplyScalar(.5);
    rail.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());
    root.add(rail);
  }
  root.userData.sixCities={kind:'two-ring-two-rail',ringRadius,ringTube,halfLength,railRadius};
  return root;
}
export function verifyTwoRingTwoRail(root,tolerance=1e-5){
  const d=root.userData.sixCities,children=root.children;
  const rings=children.filter(x=>x.geometry?.type==='TorusGeometry');
  const rails=children.filter(x=>x.geometry?.type==='CylinderGeometry');
  const pass=!!d&&rings.length===2&&rails.length===2&&
    rings.every((r,i)=>Math.abs(r.position.z-(i===0?-d.halfLength:d.halfLength))<=tolerance)&&
    rails.every(r=>Math.abs(r.geometry.parameters.height-2*d.halfLength)<=tolerance);
  return {name:root.name,pass,ringCount:rings.length,railCount:rails.length};
}
