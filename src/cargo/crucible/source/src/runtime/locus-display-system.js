export function createLocusDisplaySystem({THREE,station}){
  // CLARA inherits the Continuity Lab surface grammar: one persistent bounded display,
  // coherent internal panels, and affordances that can reform without losing the frame.
  const canvas=document.createElement("canvas");canvas.width=512;canvas.height=320;const ctx=canvas.getContext("2d");
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const root=new THREE.Group();root.name="station-feed-hud";root.visible=false;station.object.add(root);

  const W=2.18,H=1.18,centerX=.18,pad=.055,headerH=.20,bayW=.38,gap=.045;
  const innerH=H-pad*2-headerH,sceneW=W-pad*2-bayW-gap;
  const surfaceMat=new THREE.MeshBasicMaterial({color:0x07131b,transparent:true,opacity:.48,depthWrite:false,side:THREE.DoubleSide});
  const surface=new THREE.Mesh(new THREE.PlaneGeometry(W,H),surfaceMat);surface.position.set(centerX,0,-.014);root.add(surface);
  const lineMat=new THREE.LineBasicMaterial({color:0xdff9ff,transparent:true,opacity:.88,depthWrite:false});
  const outer=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(W,H)),lineMat);outer.position.set(centerX,0,.010);root.add(outer);

  // Header belongs to the whole surface rather than to any one panel.
  const headerCanvas=document.createElement("canvas");headerCanvas.width=512;headerCanvas.height=72;const hctx=headerCanvas.getContext("2d");
  hctx.clearRect(0,0,512,72);hctx.fillStyle="rgba(235,251,255,.96)";hctx.font="24px monospace";hctx.fillText("CLARA",18,29);
  hctx.fillStyle="rgba(175,224,238,.76)";hctx.font="12px monospace";hctx.fillText("ORBITAL LOCUS  //  CONTINUITY SURFACE",18,51);
  hctx.strokeStyle="rgba(207,246,255,.45)";hctx.beginPath();hctx.moveTo(292,34);hctx.lineTo(494,34);hctx.stroke();
  const headerTexture=new THREE.CanvasTexture(headerCanvas);headerTexture.colorSpace=THREE.SRGBColorSpace;
  const header=new THREE.Mesh(new THREE.PlaneGeometry(W-pad*2,headerH),new THREE.MeshBasicMaterial({map:headerTexture,transparent:true,opacity:.96,depthWrite:false,side:THREE.DoubleSide}));
  header.position.set(centerX,H*.5-pad-headerH*.5,.006);root.add(header);

  const contentY=-headerH*.5;
  const sceneX=centerX-W*.5+pad+sceneW*.5;
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(sceneW,innerH),new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity:.96,depthWrite:false,side:THREE.DoubleSide}));
  screen.position.set(sceneX,contentY,.006);root.add(screen);
  const sceneRim=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(sceneW,innerH)),lineMat);sceneRim.position.copy(screen.position).setZ(.011);root.add(sceneRim);

  const bayX=centerX+W*.5-pad-bayW*.5;
  const bay=new THREE.Group();bay.name="clara-cinnabar-control-bay";bay.position.set(bayX,contentY,.012);root.add(bay);
  const bayRim=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(bayW,innerH)),lineMat);bayRim.position.z=.002;bay.add(bayRim);
  const controlMat=new THREE.MeshBasicMaterial({color:0x123d50,transparent:true,opacity:.88,depthWrite:false,side:THREE.DoubleSide});
  const buttonW=bayW-pad*1.15,buttonH=.25;
  const stowButton=new THREE.Mesh(new THREE.PlaneGeometry(buttonW,buttonH),controlMat);stowButton.name="cinnabar-stow-toggle";stowButton.position.set(0,innerH*.5-pad-buttonH*.5,.004);bay.add(stowButton);
  const buttonRim=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(buttonW,buttonH)),new THREE.LineBasicMaterial({color:0xdff9ff,transparent:true,opacity:.48,depthWrite:false}));buttonRim.position.z=.002;stowButton.add(buttonRim);
  const arrowShape=new THREE.Shape();arrowShape.moveTo(-.065,.042);arrowShape.lineTo(.065,.042);arrowShape.lineTo(0,-.062);arrowShape.closePath();
  const arrow=new THREE.Mesh(new THREE.ShapeGeometry(arrowShape),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.98,depthWrite:false,side:THREE.DoubleSide}));arrow.position.z=.004;stowButton.add(arrow);
  const logButton=new THREE.Mesh(new THREE.PlaneGeometry(buttonW,buttonH),controlMat.clone());logButton.name="locus-log-export";logButton.position.set(0,innerH*.5-pad-buttonH*1.5-.045,.004);bay.add(logButton);
  const logRim=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(buttonW,buttonH)),new THREE.LineBasicMaterial({color:0xdff9ff,transparent:true,opacity:.48,depthWrite:false}));logRim.position.z=.002;logButton.add(logRim);
  const logCanvas=document.createElement("canvas");logCanvas.width=192;logCanvas.height=96;const lctx=logCanvas.getContext("2d");lctx.clearRect(0,0,192,96);lctx.fillStyle="rgba(255,255,255,.98)";lctx.font="bold 34px monospace";lctx.textAlign="center";lctx.textBaseline="middle";lctx.fillText("LOG",96,48);
  const logTexture=new THREE.CanvasTexture(logCanvas);logTexture.colorSpace=THREE.SRGBColorSpace;
  const logLabel=new THREE.Mesh(new THREE.PlaneGeometry(buttonW*.72,buttonH*.72),new THREE.MeshBasicMaterial({map:logTexture,transparent:true,depthWrite:false,side:THREE.DoubleSide}));logLabel.position.z=.004;logButton.add(logLabel);
    let cinnabarPacked=false,cinnabarPacking=false;
  function setCinnabarPacked(packed,packing=false){cinnabarPacked=!!packed;cinnabarPacking=!!packing;arrow.rotation.z=cinnabarPacked?Math.PI:0;controlMat.opacity=cinnabarPacking?.52:.88;return cinnabarPacked}

  const tailMat=new THREE.MeshBasicMaterial({color:0x6bcfff,transparent:true,opacity:.06,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});
  const tailGeo=new THREE.BufferGeometry(),tail=new THREE.Mesh(tailGeo,tailMat);tail.name="station-feed-tail";station.object.add(tail);
  const anchorLocal=new THREE.Vector3(0,.31,0),anchorWorld=new THREE.Vector3(),cardWorld=new THREE.Vector3(),camDir=new THREE.Vector3(),cardRight=new THREE.Vector3(),cardUp=new THREE.Vector3();
  let open=false;function setOpen(v){open=!!v;root.visible=open;tail.visible=open;return open}function toggle(){return setOpen(!open)}tail.visible=false;
  function updatePresentation(camera){
    if(!open||!camera)return;
    const sw=new THREE.Vector3();station.object.getWorldPosition(sw),cw=new THREE.Vector3();camera.getWorldPosition(cw);
    camDir.copy(cw).sub(sw).normalize();
    const p=sw.clone().add(new THREE.Vector3(.95,.65,0)).addScaledVector(camDir,.55);station.object.worldToLocal(p);root.position.copy(p);root.lookAt(cw);
    station.object.localToWorld(anchorWorld.copy(anchorLocal));root.getWorldPosition(cardWorld);
    cardRight.set(1,0,0).applyQuaternion(root.getWorldQuaternion(new THREE.Quaternion())).multiplyScalar(.42);
    cardUp.set(0,1,0).applyQuaternion(root.getWorldQuaternion(new THREE.Quaternion())).multiplyScalar(.25);
    const back=cardWorld.clone().addScaledVector(camDir,-.035),a=anchorWorld.clone(),corners=[back.clone().sub(cardRight).sub(cardUp),back.clone().add(cardRight).sub(cardUp),back.clone().add(cardRight).add(cardUp),back.clone().sub(cardRight).add(cardUp)];
    const pts=[];for(let i=0;i<4;i++)pts.push(a,corners[i],corners[(i+1)%4]);
    const pos=[];for(const v of pts.map(v=>station.object.worldToLocal(v.clone())))pos.push(v.x,v.y,v.z);
    tailGeo.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));tailGeo.computeBoundingSphere();
  }
  function draw(observation){
    ctx.clearRect(0,0,512,320);ctx.fillStyle="rgba(8,25,34,.42)";ctx.fillRect(0,0,512,320);
    ctx.fillStyle="rgba(224,248,255,.92)";ctx.font="18px monospace";ctx.fillText("SCENE SUMMARY",22,30);
    ctx.strokeStyle="rgba(207,246,255,.36)";ctx.beginPath();ctx.moveTo(22,43);ctx.lineTo(490,43);ctx.stroke();
    const profile=observation?.measurement?.terrainProfile;if(!profile?.samples?.length){ctx.fillStyle="rgba(170,226,242,.70)";ctx.font="17px monospace";ctx.fillText("AWAITING APERTURE SAMPLE",108,170);texture.needsUpdate=true;return}
    const fp=observation.footprint,r=Math.max(.001,fp.radius),samples=profile.samples,min=profile.minHeight,max=profile.maxHeight,span=Math.max(.001,max-min),cx=256,cy=174,rr=102;
    ctx.strokeStyle="rgba(180,237,250,.58)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.stroke();ctx.strokeStyle="rgba(180,237,250,.16)";ctx.lineWidth=1;for(const q of [.33,.66]){ctx.beginPath();ctx.arc(cx,cy,rr*q,0,Math.PI*2);ctx.stroke()}
    for(const s of samples){const dx=(s.x-fp.center[0])/r,dz=(s.z-fp.center[2])/r,v=(s.height-min)/span,alpha=.28+v*.67,rad=4+v*2.5;ctx.fillStyle=`rgba(205,245,255,${alpha.toFixed(3)})`;ctx.beginPath();ctx.arc(cx+dx*rr,cy+dz*rr,rad,0,Math.PI*2);ctx.fill()}
    ctx.fillStyle="rgba(235,252,255,.96)";ctx.beginPath();ctx.arc(cx,cy,3.5,0,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(185,232,244,.88)";ctx.font="14px monospace";ctx.fillText(`RELIEF ${(max-min).toFixed(3)}`,22,298);ctx.textAlign="right";ctx.fillText(`FOOTPRINT R ${r.toFixed(2)}`,490,298);ctx.textAlign="left";texture.needsUpdate=true
  }
  draw(null);return{update:draw,toggle,setOpen,setCinnabarPacked,stowButton,logButton,updatePresentation,containsObject(object){for(let o=object;o;o=o.parent)if(o===root)return true;return false},inspect(){return{kind:"locus-evidence-display",presentation:"station-anchored CLARA continuity surface",open,cinnabarPacked,cinnabarPacking,source:"latest recorded aperture observation",privilegedWorldAccess:false}}}
}