export function createExtruderYard({THREE,scene}){
  const root=new THREE.Group();root.name="extruder-design-yard";scene.add(root);
  const mats={
    hull:new THREE.MeshStandardMaterial({color:0xcfd3d1,roughness:.58,metalness:.16}),
    hull2:new THREE.MeshStandardMaterial({color:0xaeb6b6,roughness:.62,metalness:.13}),
    dark:new THREE.MeshStandardMaterial({color:0x4d5659,roughness:.56,metalness:.28}),
    orange:new THREE.MeshStandardMaterial({color:0xd8782c,roughness:.48,metalness:.20}),
    glow:new THREE.MeshStandardMaterial({color:0xffc66e,emissive:0xffa33a,emissiveIntensity:1.25,roughness:.4})
  };
  const candidates=[],pickables=[];
  function box(g,x,y,z,sx,sy,sz,mat=mats.hull){const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat);m.position.set(x,y,z);m.castShadow=true;g.add(m);return m;}
  function cyl(g,x,y,z,r,len,axis="z",mat=mats.dark,n=8){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,n),mat);m.position.set(x,y,z);if(axis==="x")m.rotation.z=Math.PI/2;else if(axis==="z")m.rotation.x=Math.PI/2;m.castShadow=true;g.add(m);return m;}
  function rail(g,x,z,w,d,y=.43){const pts=[[x-w/2,z-d/2],[x+w/2,z-d/2],[x+w/2,z+d/2],[x-w/2,z+d/2],[x-w/2,z-d/2]];for(let i=0;i<4;i++){const a=pts[i],b=pts[i+1],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),m=cyl(g,(a[0]+b[0])/2,y,(a[1]+b[1])/2,.014,len,"y",mats.orange,6);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(dx,0,dz).normalize());}}
  function panel(g,x,y,z,sx,sz,mat=mats.hull2){box(g,x,y,z,sx,.025,sz,mat);}
  function light(g,x,y,z,sx=.08,sz=.035){box(g,x,y,z,sx,.018,sz,mats.glow);}
  function cutter(g,x=.48,y=.04,z=0,r=.12,len=.36){return cyl(g,x,y,z,r,len,"z",mats.dark,8);}
  function chute(g,x=-.46,y=.08,z=0){const c=box(g,x,y,z,.20,.13,.22,mats.dark);c.rotation.z=-.22;return c;}
  function base(g,L=.82,W=.52,H=.25,y=.18){box(g,0,y,0,L,H,W,mats.hull);}
  const builds=[
   g=>{base(g);panel(g,.05,.32,0,.46,.34);cutter(g,.47,.08,0,.11,.32);chute(g);rail(g,0,.0,.55,.40)},
   g=>{base(g,.76,.58,.22);box(g,-.08,.38,0,.42,.20,.38,mats.hull2);cutter(g,.43,.06,0,.10,.42);rail(g,-.05,0,.48,.46);light(g,.18,.50,0,.12,.04)},
   g=>{box(g,0,.18,-.17,.78,.24,.20);box(g,0,.18,.17,.78,.24,.20);box(g,-.06,.34,0,.38,.12,.22,mats.hull2);cutter(g,.44,.06,0,.10,.28);chute(g)},
   g=>{base(g,.88,.46,.20);box(g,-.12,.39,0,.34,.24,.32,mats.hull2);panel(g,.20,.31,0,.22,.30,mats.dark);cutter(g,.48,.04,0,.09,.30);rail(g,-.12,0,.38,.34)},
   g=>{base(g,.70,.62,.24);box(g,.02,.39,0,.34,.20,.46,mats.hull2);cutter(g,.40,.03,0,.12,.48);chute(g,-.40,.10,0);light(g,.18,.50,-.12);light(g,.18,.50,.12)},
   g=>{base(g,.92,.40,.22);box(g,-.18,.37,0,.30,.18,.28,mats.hull2);box(g,.16,.34,0,.26,.12,.30,mats.dark);cutter(g,.50,.06,0,.10,.28);rail(g,-.18,0,.34,.30)},
   g=>{base(g,.72,.54,.18);box(g,0,.34,0,.52,.18,.30,mats.hull2);box(g,.29,.20,-.20,.18,.12,.12,mats.dark);box(g,.29,.20,.20,.18,.12,.12,mats.dark);cutter(g,.42,.02,0,.09,.32);chute(g)},
   g=>{base(g,.84,.56,.20);cyl(g,-.08,.39,0,.17,.34,"z",mats.hull2,8);cutter(g,.46,.05,0,.10,.38);rail(g,-.06,0,.44,.44);light(g,.18,.39,0,.08,.03)},
   g=>{box(g,-.08,.22,0,.58,.34,.46,mats.hull);box(g,.29,.16,0,.18,.18,.36,mats.hull2);cutter(g,.44,.03,0,.08,.30);chute(g,-.44,.10,0);panel(g,-.10,.405,0,.30,.28,mats.dark)},
   g=>{base(g,.94,.58,.16,.15);box(g,-.14,.31,0,.30,.16,.42,mats.hull2);box(g,.20,.29,0,.22,.12,.30,mats.hull);cutter(g,.50,.01,0,.10,.44);rail(g,-.12,0,.36,.46)},
   g=>{box(g,0,.18,-.19,.82,.22,.16,mats.hull);box(g,0,.18,.19,.82,.22,.16,mats.hull);box(g,-.10,.31,0,.30,.12,.24,mats.dark);cutter(g,.45,.03,0,.10,.26);rail(g,-.10,0,.38,.32)},
   g=>{base(g,.74,.48,.28);box(g,-.05,.44,0,.42,.18,.32,mats.hull2);cyl(g,.18,.52,0,.07,.26,"z",mats.dark,8);cutter(g,.43,.07,0,.11,.34);chute(g)},
   g=>{base(g,.88,.50,.18);box(g,-.22,.34,0,.24,.20,.36,mats.hull2);box(g,.13,.31,0,.30,.12,.32,mats.hull2);cutter(g,.48,.02,0,.08,.36);rail(g,.08,0,.36,.38);light(g,-.22,.455,0)},
   g=>{base(g,.78,.60,.20);box(g,-.08,.35,-.18,.40,.16,.16,mats.hull2);box(g,-.08,.35,.18,.40,.16,.16,mats.hull2);cutter(g,.44,.04,0,.11,.46);chute(g);panel(g,.10,.31,0,.20,.18,mats.dark)},
   g=>{base(g,.96,.42,.20);box(g,-.12,.34,0,.46,.14,.26,mats.hull2);cutter(g,.51,.05,0,.09,.30);chute(g,-.51,.08,0);rail(g,-.10,0,.50,.30);light(g,.17,.42,0,.10,.03)},
   g=>{box(g,-.08,.20,0,.60,.30,.54,mats.hull);box(g,.30,.15,0,.18,.16,.40,mats.dark);box(g,-.12,.40,0,.34,.12,.36,mats.hull2);cutter(g,.43,.02,0,.08,.34);rail(g,-.10,0,.38,.42)},
   g=>{base(g,.82,.54,.18);cyl(g,-.16,.34,0,.14,.34,"z",mats.hull2,8);box(g,.17,.31,0,.22,.12,.30,mats.hull);cutter(g,.46,.03,0,.10,.38);chute(g);light(g,.17,.39,0)},
   g=>{base(g,.72,.44,.24);box(g,-.12,.39,0,.28,.18,.28,mats.hull2);box(g,.20,.34,-.14,.20,.10,.10,mats.dark);box(g,.20,.34,.14,.20,.10,.10,mats.dark);cutter(g,.42,.05,0,.09,.30);rail(g,-.12,0,.32,.32)},
   g=>{base(g,.90,.62,.16);box(g,-.18,.31,0,.26,.16,.46,mats.hull2);panel(g,.15,.25,0,.30,.42,mats.dark);cutter(g,.49,.01,0,.11,.48);chute(g,-.49,.07,0)},
   g=>{box(g,0,.18,-.18,.86,.20,.18,mats.hull);box(g,0,.18,.18,.86,.20,.18,mats.hull);cyl(g,-.10,.36,0,.12,.26,"z",mats.hull2,8);cutter(g,.47,.02,0,.08,.24);rail(g,-.08,0,.34,.28)},
   g=>{base(g,.76,.52,.22);box(g,-.18,.38,0,.24,.20,.34,mats.hull2);box(g,.12,.35,0,.26,.14,.28,mats.hull2);cutter(g,.43,.05,0,.10,.36);chute(g);light(g,.12,.43,-.08,.06,.025);light(g,.12,.43,.08,.06,.025)},
   g=>{base(g,.94,.48,.18);box(g,-.05,.32,0,.58,.12,.32,mats.hull2);box(g,.05,.43,0,.28,.10,.22,mats.dark);cutter(g,.50,.01,0,.08,.34);rail(g,-.20,0,.30,.34)},
   g=>{base(g,.80,.64,.18);box(g,-.12,.34,-.20,.34,.16,.16,mats.hull2);box(g,-.12,.34,.20,.34,.16,.16,mats.hull2);box(g,.18,.31,0,.20,.10,.22,mats.dark);cutter(g,.45,.02,0,.10,.50);chute(g)},
   g=>{base(g,.70,.46,.30);box(g,-.08,.47,0,.36,.16,.30,mats.hull2);cutter(g,.41,.08,0,.11,.32);rail(g,-.08,0,.40,.34);panel(g,.10,.565,0,.16,.22,mats.dark);light(g,-.15,.565,0)},
   g=>{base(g,.88,.56,.20);box(g,-.18,.36,0,.28,.18,.40,mats.hull2);box(g,.16,.32,0,.24,.10,.30,mats.dark);cutter(g,.47,.03,0,.09,.40);chute(g,-.47,.08,0);rail(g,-.18,0,.32,.44);light(g,.16,.39,0,.08,.025)}
  ];
  builds.forEach((build,i)=>{const g=new THREE.Group();build(g);g.position.set((i%5-2)*1.65,.18,(Math.floor(i/5)-2)*1.55);g.userData.extruderCandidate=i+1;g.traverse(o=>{if(o.isMesh){o.userData.extruderCandidate=i+1;pickables.push(o);}});root.add(g);candidates.push(g);});
  let selected=0,ring=new THREE.Mesh(new THREE.RingGeometry(.62,.68,32),new THREE.MeshBasicMaterial({color:0xffc66e,side:THREE.DoubleSide,transparent:true,opacity:.85}));ring.rotation.x=-Math.PI/2;ring.position.y=.025;root.add(ring);
  function select(index){selected=(index+25)%25;const p=candidates[selected].position;ring.position.x=p.x;ring.position.z=p.z;return selected+1;}select(0);
  return{root,candidates,pickables,select,next:()=>select(selected+1),previous:()=>select(selected-1),selected:()=>selected+1,dispose:()=>scene.remove(root)};
}
