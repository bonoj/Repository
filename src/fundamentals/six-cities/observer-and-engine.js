// Six Cities fundamentals: independent observer eye/seat, attention, and caged rotor.
export function buildObserverPresentation({THREE,root,glassMaterial,metalMaterial}={}){
  const glass=new THREE.Mesh(new THREE.IcosahedronGeometry(.50,3),glassMaterial);
  glass.castShadow=true;root.add(glass);
  const eye=new THREE.Group();eye.name='observer:eye';root.add(eye);
  const white=new THREE.Mesh(new THREE.SphereGeometry(.20,22,14),new THREE.MeshStandardMaterial({color:0xe8e5dc,roughness:.48}));eye.add(white);
  const iris=new THREE.Mesh(new THREE.CircleGeometry(.105,24),new THREE.MeshStandardMaterial({color:0x596d6d,roughness:.42,side:THREE.DoubleSide}));iris.position.z=.188;eye.add(iris);
  const pupil=new THREE.Mesh(new THREE.CircleGeometry(.052,24),new THREE.MeshStandardMaterial({color:0x151817,roughness:.36,side:THREE.DoubleSide}));pupil.position.z=.191;eye.add(pupil);
  const ocularSeat=new THREE.Group();ocularSeat.name='observer:ocular-seat';root.add(ocularSeat);
  const seatRadius=.535,seatAft=-.11;
  const seatFront=new THREE.Mesh(new THREE.TorusGeometry(seatRadius,.035,8,32),metalMaterial);seatFront.name='observer:ocular-seat:meridian';seatFront.castShadow=true;ocularSeat.add(seatFront);
  const seatBack=new THREE.Mesh(new THREE.TorusGeometry(seatRadius,.035,8,32),metalMaterial);seatBack.name='observer:ocular-seat:aft';seatBack.position.z=seatAft;seatBack.castShadow=true;ocularSeat.add(seatBack);
  for(let i=0;i<3;i++){const a=Math.PI/2+i*Math.PI*2/3,x=Math.cos(a)*seatRadius,y=Math.sin(a)*seatRadius,front=new THREE.Vector3(x,y,0),back=new THREE.Vector3(x,y,seatAft),d=back.clone().sub(front);const binding=new THREE.Mesh(new THREE.CylinderGeometry(.027,.034,d.length(),8),metalMaterial);binding.name='observer:ocular-seat:binding';binding.position.copy(front).add(back).multiplyScalar(.5);binding.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());binding.castShadow=true;ocularSeat.add(binding);}
  root.userData.observerOcularSeat=ocularSeat;root.userData.observerEye=eye;
}


// Attention is an optional independent controller; callers provide target world points.
export function makeObserverAttention({THREE,eye,seat,now=0,random=Math.random}={}){
  return {eye,seat,attention:'wander',started:now,until:0,target:null,nextNotice:now+4200+random()*5200,
    eyeWorld:new THREE.Vector3(),desiredWorld:new THREE.Vector3(),desiredLocal:new THREE.Vector3(),
    targetPoint:new THREE.Vector3(),from:new THREE.Quaternion(),to:new THREE.Quaternion(),parentQ:new THREE.Quaternion()};
}
export function observerAimAt({THREE,agent,worldPoint,out=agent.to}={}){
  agent.eye.getWorldPosition(agent.eyeWorld);
  agent.desiredWorld.copy(worldPoint).sub(agent.eyeWorld).normalize();
  agent.eye.parent.getWorldQuaternion(agent.parentQ);
  agent.desiredLocal.copy(agent.desiredWorld).applyQuaternion(agent.parentQ.invert()).normalize();
  return out.setFromUnitVectors(new THREE.Vector3(0,0,1),agent.desiredLocal);
}
export function noticeObserverTarget({THREE,agent,now,worldPoint,random=Math.random}={}){
  agent.attention='orient';agent.started=now;agent.target=worldPoint;
  agent.targetPoint.copy(worldPoint);agent.from.copy(agent.eye.quaternion);
  observerAimAt({THREE,agent,worldPoint,out:agent.to});
  agent.until=now+720+random()*380;
}
export function updateObserverAttention({THREE,agent,now,index=0,chooseTarget=null,random=Math.random}={}){
  if(agent.attention==='wander'){
    const t=now*.001+index*.73;
    agent.to.setFromEuler(new THREE.Euler(.105*Math.sin(t*.23+.8)+.035*Math.sin(t*.071+2.4),.46*Math.sin(t*.34)+.13*Math.sin(t*.127+1.7),0,'YXZ'));
    agent.eye.quaternion.slerp(agent.to,.035);
    if(now>=agent.nextNotice){
      const target=chooseTarget?.(agent,now);
      if(target)noticeObserverTarget({THREE,agent,now,worldPoint:target,random});
      else agent.nextNotice=now+4200+random()*6200;
    }
  }else if(agent.attention==='orient'){
    const t=THREE.MathUtils.smoothstep(THREE.MathUtils.clamp((now-agent.started)/(agent.until-agent.started),0,1),0,1);
    agent.eye.quaternion.copy(agent.from).slerp(agent.to,t);
    if(now>=agent.until){agent.attention='attend';agent.started=now;agent.until=now+850+random()*1150;}
  }else{
    const target=chooseTarget?.(agent,now,true)??agent.target;
    if(target)observerAimAt({THREE,agent,worldPoint:target});
    agent.to.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(.005*Math.sin(now*.0033+1.1),.008*Math.sin(now*.0041),0,'YXZ')));
    agent.eye.quaternion.slerp(agent.to,.09);
    if(now>=agent.until){agent.attention='wander';agent.target=null;agent.nextNotice=now+4200+random()*6200;}
  }
  agent.seat.quaternion.copy(agent.eye.quaternion);
}

export function makePropulsionModule({THREE,material,name='propulsion-module',parent,at=new THREE.Vector3(),modules=[]}={}){
  const node=new THREE.Group();node.name=name;node.position.copy(at);parent.add(node);
  const gimbal=new THREE.Group();gimbal.name=name+':gimbal';node.add(gimbal);
  const ringRadius=.535,ringTube=.035;
  const ringA=new THREE.Mesh(new THREE.TorusGeometry(ringRadius,ringTube,10,36),material);ringA.castShadow=true;gimbal.add(ringA);
  const ringB=new THREE.Mesh(new THREE.TorusGeometry(ringRadius,ringTube,10,36),material);ringB.rotation.y=Math.PI/2;ringB.castShadow=true;gimbal.add(ringB);
  const rotor=new THREE.Group();rotor.name=name+':six-cube-rotor';gimbal.add(rotor);
  const cubeGeo=new THREE.BoxGeometry(.16,.16,.16);
  for(let i=0;i<6;i++){
    const a=i*Math.PI/3,cube=new THREE.Mesh(cubeGeo,material);
    cube.position.set(Math.cos(a)*.34,Math.sin(a)*.34,0);cube.rotation.set(a*.31,a*.47,a);cube.castShadow=true;rotor.add(cube);
  }
  const module={node,gimbal,rotor,phase:Math.random()*Math.PI*2,tilt:Math.random()*Math.PI*2};
  modules.push(module);return module;
}
export function updatePropulsionModules(now,modules){
  for(const m of modules){
    // Harness and rotor swivel as one; the six cubes spin rapidly within that shared thrust frame.
    m.gimbal.rotation.set(.34*Math.sin(now*.00043+m.tilt),.72*Math.sin(now*.00031+m.phase),.18*Math.sin(now*.00053+m.phase),'YXZ');
    m.rotor.rotation.z=now*.010+m.phase;
    for(let i=0;i<m.rotor.children.length;i++)m.rotor.children[i].rotation.y=now*.018+i*.71;
  }

}

