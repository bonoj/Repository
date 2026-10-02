export function createContinuityStationSystem({world,components,THREE,scene}){
  const {Transform,RenderObject,ContinuityLocus,Footprint}=components;

  const hullMat=new THREE.MeshStandardMaterial({color:0xcfd3d1,roughness:.58,metalness:.16});
  const hull2Mat=new THREE.MeshStandardMaterial({color:0xaeb6b6,roughness:.62,metalness:.13});
  const darkMat=new THREE.MeshStandardMaterial({color:0x4d5659,roughness:.56,metalness:.28});
  const orangeMat=new THREE.MeshStandardMaterial({color:0xd8782c,roughness:.48,metalness:.20});
  const windowMat=new THREE.MeshStandardMaterial({color:0xffc66e,emissive:0xffa33a,emissiveIntensity:1.35,roughness:.40,metalness:0});

  function cylBetween(parent,a,b,r,mat,segments=8){
    const d=b.clone().sub(a),m=a.clone().add(b).multiplyScalar(.5);
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),segments),mat);
    mesh.position.copy(m);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());
    mesh.castShadow=true;parent.add(mesh);return mesh;
  }
  function box(parent,size,pos,mat,cast=true){
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(size.x,size.y,size.z),mat);
    mesh.position.copy(pos);mesh.castShadow=cast;parent.add(mesh);return mesh;
  }
  function addWindows(parent,pos,axis="x"){
    for(let i=-1;i<=1;i++){
      const p=pos.clone();
      if(axis==="x")p.x+=i*.045;else p.z+=i*.045;
      box(parent,new THREE.Vector3(axis==="x"?.025:.006,.018,axis==="x"?.006:.025),p,windowMat,false);
    }
  }
  function addPipe(parent,points){
    for(let i=0;i<points.length-1;i++)cylBetween(parent,points[i],points[i+1],.006,orangeMat,6);
  }
  function buildStation(){
    const station=new THREE.Group();
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,.080,8),hull2Mat);
    hub.rotation.x=Math.PI/2;hub.castShadow=true;station.add(hub);
    const arms=[
      [new THREE.Vector3(.07,0,0),new THREE.Vector3(.34,0,0)],
      [new THREE.Vector3(-.07,0,0),new THREE.Vector3(-.30,0,0)],
      [new THREE.Vector3(0,0,.07),new THREE.Vector3(0,0,.29)],
      [new THREE.Vector3(0,0,-.07),new THREE.Vector3(0,0,-.23)]
    ];
    for(const [a,b] of arms)cylBetween(station,a,b,.045,hullMat,10);
    for(const p of [new THREE.Vector3(.13,0,0),new THREE.Vector3(-.13,0,0),new THREE.Vector3(0,0,.13),new THREE.Vector3(0,0,-.13)]){
      const collar=new THREE.Mesh(new THREE.TorusGeometry(.051,.009,6,12),darkMat);
      collar.position.copy(p);if(Math.abs(p.x)>.01)collar.rotation.y=Math.PI/2;station.add(collar);
    }
    box(station,new THREE.Vector3(.17,.13,.15),new THREE.Vector3(.39,.015,0),hullMat);
    box(station,new THREE.Vector3(.15,.115,.14),new THREE.Vector3(0,.005,.34),hull2Mat);
    box(station,new THREE.Vector3(.13,.10,.12),new THREE.Vector3(-.34,-.005,0),hullMat);
    const drum=new THREE.Mesh(new THREE.CylinderGeometry(.072,.072,.16,12),hullMat);
    drum.rotation.z=Math.PI/2;drum.position.set(0,0,-.30);drum.castShadow=true;station.add(drum);
    cylBetween(station,new THREE.Vector3(0,.04,0),new THREE.Vector3(0,.30,0),.032,hull2Mat,10);
    box(station,new THREE.Vector3(.13,.12,.12),new THREE.Vector3(0,.34,0),hullMat);
    cylBetween(station,new THREE.Vector3(0,.40,0),new THREE.Vector3(0,.47,0),.018,darkMat,8);
    addPipe(station,[new THREE.Vector3(-.25,.052,.040),new THREE.Vector3(.28,.052,.040),new THREE.Vector3(.28,.052,.075)]);
    addPipe(station,[new THREE.Vector3(.040,.050,-.20),new THREE.Vector3(.040,.050,.26)]);
    addPipe(station,[new THREE.Vector3(.052,.08,.025),new THREE.Vector3(.052,.40,.025)]);
    addWindows(station,new THREE.Vector3(.39,.02,.076),"x");
    addWindows(station,new THREE.Vector3(.076,.01,.34),"z");
    addWindows(station,new THREE.Vector3(-.34,.005,.061),"x");
    station.scale.setScalar(.62);
    return station;
  }

  const id=world.entity(),station=buildStation(),motion={center:new THREE.Vector3(0,8.5,0),radiusX:4.2,radiusZ:3.2,periodMs:90000,phase:.35};
  scene.add(station);
  world.add(id,Transform,{position:new THREE.Vector3(0,8.5,0),rotation:new THREE.Euler(.20,.35,.08),scale:new THREE.Vector3(3.2,3.2,3.2),visible:true});
  world.add(id,RenderObject,{object:station});
  world.add(id,ContinuityLocus,{kind:"orbital-station",donor:"world-lab/OrbitalConstruction T1",apertures:[]});
  world.add(id,Footprint,{kind:"cone",halfAngle:THREE.MathUtils.degToRad(18),maxRadius:4.5,segments:56,debugVisible:true});

  return {
    id,
    object:station,
    update(now){
      const t=now*.000075,phase=(now/motion.periodMs)*Math.PI*2+motion.phase;
      const transform=Transform.get(id);
      transform.position.set(motion.center.x+Math.cos(phase)*motion.radiusX,motion.center.y,motion.center.z+Math.sin(phase)*motion.radiusZ);
      transform.rotation.set(.20+.10*Math.sin(t*.31),.35+t*.43,.08+.12*Math.sin(t*.23));
    },
    inspect(){
      const t=Transform.get(id),locus=ContinuityLocus.get(id);
      return {id,kind:locus.kind,donor:locus.donor,position:t.position.toArray(),scale:t.scale.x,motion:{radiusX:motion.radiusX,radiusZ:motion.radiusZ,periodMs:motion.periodMs,phase:motion.phase},apertures:[...locus.apertures]};
    }
  };
}
