export function createLighthuggerInterior({THREE,scene,origin=new THREE.Vector3(0,-32,0)}){
  const root=new THREE.Group();root.name="lighthugger-interior";root.position.copy(origin);scene.add(root);

  const brass=new THREE.MeshStandardMaterial({color:0x8b5d2d,roughness:.42,metalness:.76}),
    dark=new THREE.MeshStandardMaterial({color:0x171819,roughness:.7,metalness:.55,side:THREE.BackSide}),
    floorMat=new THREE.MeshStandardMaterial({color:0x25231f,roughness:.76,metalness:.34}),
    warm=new THREE.MeshBasicMaterial({color:0xffb65f}),
    glass=new THREE.MeshStandardMaterial({color:0x173849,emissive:0x0d2734,emissiveIntensity:.45,transparent:true,opacity:.82,roughness:.25,metalness:.18,side:THREE.DoubleSide});

  // An intentionally under-specified room: enough architecture to inhabit, plenty left unclaimed.
  const radius=7.2,height=5.4;
  const wallThickness=.22;
  for(let i=0;i<8;i++){
    const a=Math.PI/8+i*Math.PI/4;
    const chord=2*radius*Math.sin(Math.PI/8);
    const wall=new THREE.Mesh(new THREE.BoxGeometry(chord+.08,height,wallThickness),dark);
    wall.position.set(Math.sin(a)*(radius-wallThickness*.5),height*.5,Math.cos(a)*(radius-wallThickness*.5));
    wall.rotation.y=a;
    wall.castShadow=true;wall.receiveShadow=true;root.add(wall);
  }
  const floor=new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, .16, 8,1,false,Math.PI/8),floorMat);floor.position.y=-.08;floor.receiveShadow=true;root.add(floor);
  const ceiling=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,.12,8,1,false,Math.PI/8),floorMat);ceiling.position.y=height+.06;root.add(ceiling);

  function beam(a,b,r=.055,mat=brass){const d=b.clone().sub(a),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),7),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());m.castShadow=true;root.add(m);return m;}
  const corners=[];
  for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4,c=new THREE.Vector3(Math.sin(a)*radius*.985,0,Math.cos(a)*radius*.985);corners.push(c);beam(c,c.clone().setY(height),.075);}
  for(let i=0;i<8;i++){const a=corners[i],b=corners[(i+1)%8];beam(a.clone().setY(.16),b.clone().setY(.16),.05);beam(a.clone().setY(height-.18),b.clone().setY(height-.18),.05);}

  // A luminous domestic-machine spine. It has no authored function yet.
  const spine=new THREE.Group();spine.name="unclaimed-service-spine";root.add(spine);
  for(const y of [.55,1.55,2.55,3.55,4.55]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.48,.035,7,24),brass);ring.rotation.x=Math.PI/2;ring.position.y=y;spine.add(ring);}
  const core=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,4.7,8),warm);core.position.y=2.55;spine.add(core);

  // One installed surface borrows Continuity Lab grammar without deciding what it is for.
  const panel=new THREE.Group();panel.name="malleable-installed-surface";panel.position.set(-4.7,2.55,-2.15);panel.rotation.y=-.72;root.add(panel);
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(3.25,1.85),glass);panel.add(screen);
  const rim=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(3.25,1.85)),new THREE.LineBasicMaterial({color:0xd8b277,transparent:true,opacity:.82}));rim.position.z=.012;panel.add(rim);
  const bar=new THREE.Mesh(new THREE.BoxGeometry(2.65,.035,.025),warm);bar.position.set(0,.58,.035);panel.add(bar);

  // Low work island and rails imply possible function without pre-authoring controls.
  const island=new THREE.Mesh(new THREE.CylinderGeometry(1.75,1.9,.34,8,1,false,Math.PI/8),floorMat);island.position.set(1.65,.2,1.1);island.castShadow=true;root.add(island);
  const islandRim=new THREE.Mesh(new THREE.TorusGeometry(1.78,.045,7,32),brass);islandRim.rotation.x=Math.PI/2;islandRim.position.set(1.65,.39,1.1);root.add(islandRim);
  for(const z of [-3.9,3.9])beam(new THREE.Vector3(-4.5,.12,z),new THREE.Vector3(4.5,.12,z),.035,brass);

  const amber=new THREE.PointLight(0xffa64d,42,16,1.7);amber.position.set(0,4.7,0);root.add(amber);
  const cool=new THREE.PointLight(0x75b9d0,18,13,1.7);cool.position.set(-4,2.7,-2);root.add(cool);

  let active=false;
  function setActive(value){active=!!value;root.visible=active;return active}
  setActive(false);
  return{root,origin,setActive,enter:()=>setActive(true),exit:()=>setActive(false),inspect:()=>({kind:"lighthugger-interior",active,origin:origin.toArray(),grammar:"unclaimed octagonal scene space",authoredRules:0})};
}
