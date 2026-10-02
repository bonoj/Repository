export function createLocusChronograph({THREE,station,maxMarks=48}){
  const root=new THREE.Group();
  root.position.set(0,.49,0);
  station.add(root);

  const ringMat=new THREE.MeshBasicMaterial({color:0x5f7f91,transparent:true,opacity:.28,depthWrite:false,blending:THREE.AdditiveBlending});
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.255,.004,5,48),ringMat);
  ring.rotation.x=Math.PI/2;
  root.add(ring);

  const markGeo=new THREE.SphereGeometry(.009,5,4);
  const marks=[];
  for(let i=0;i<maxMarks;i++){
    const mat=new THREE.MeshBasicMaterial({color:0x6bcfff,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});
    const mark=new THREE.Mesh(markGeo,mat);
    mark.visible=false;
    root.add(mark);
    marks.push(mark);
  }

  let entries=[];
  function update(ledger){
    entries=ledger?.entries?.slice(-maxMarks)??[];
    for(let i=0;i<maxMarks;i++){
      const mark=marks[i],entry=entries[i];
      if(!entry){mark.visible=false;continue}
      const a=(i/Math.max(1,maxMarks))*Math.PI*2-Math.PI/2;
      const relief=Math.max(0,entry.analysis?.relief?.range??0);
      const roughness=Math.max(0,entry.analysis?.relief?.roughness??0);
      const lift=Math.min(.095,relief*.085);
      const radius=.255+Math.min(.035,roughness*.09);
      mark.position.set(Math.cos(a)*radius,lift,Math.sin(a)*radius);
      mark.scale.setScalar(.75+Math.min(1.5,relief*1.5));
      mark.material.opacity=.24+Math.min(.68,relief*.72);
      mark.visible=true;
    }
  }

  return{
    object:root,
    update,
    inspect:()=>({kind:"locus-chronograph",source:"locus-ledger",maxMarks,visibleMarks:entries.length})
  };
}
