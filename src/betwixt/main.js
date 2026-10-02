import * as THREE from "three";
import {createWorld} from "../core/ecs.js";
import {createThreeRuntimeCore} from "../runtime/three-runtime.js";
import {createRenderSyncSystem} from "../runtime/render-sync.js";

const mount=document.querySelector("#world");
const fault=document.querySelector("#fault");
const status=document.querySelector("#status");
const three=createThreeRuntimeCore({
  THREE,mount,
  onContextLost:()=>showFault("WebGL context lost. Reload to reconstruct."),
  configureRenderer:renderer=>{
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1;
  }
});
const {scene,renderer}=three;
scene.background=new THREE.Color(0xf1f1ef);
scene.fog=new THREE.Fog(0xf1f1ef,18,34);

const GROUND_Y=-1.25;
const WORLD_RADIUS=23;
const CAMERA_BOUNDARY=21.5;

const floor=new THREE.Mesh(
  new THREE.CircleGeometry(22,96),
  new THREE.MeshStandardMaterial({color:0xd9d9d5,roughness:1,metalness:0})
);
floor.rotation.x=-Math.PI/2;
floor.position.y=GROUND_Y;
scene.add(floor);

const dome=new THREE.Mesh(
  new THREE.SphereGeometry(WORLD_RADIUS,48,24),
  new THREE.MeshBasicMaterial({color:0xf6f6f3,side:THREE.BackSide,fog:false})
);
dome.position.y=GROUND_Y;
scene.add(dome);

scene.add(new THREE.HemisphereLight(0xffffff,0x8d9092,2.2));
const key=new THREE.DirectionalLight(0xffffff,2.4);
key.position.set(4,9,6);
scene.add(key);

const world=createWorld();
const C={
  Presence:world.component("Presence"),
  Transform:world.component("Transform"),
  RenderObject:world.component("RenderObject"),
  Selectable:world.component("Selectable"),
  Foregroundable:world.component("Foregroundable"),
  Foregrounded:world.component("Foregrounded"),
  RingSlot:world.component("RingSlot"),
  ObserverReturn:world.component("ObserverReturn")
};
const sync=createRenderSyncSystem({world,components:C});

const presenceMat=new THREE.MeshStandardMaterial({color:0xf0f0ed,roughness:.68,metalness:.04});
const presenceIds=[];
for(let slot=0;slot<5;slot++){
  const id=world.entity(),group=new THREE.Group();
  const sphere=new THREE.Mesh(new THREE.SphereGeometry(.58,28,18),presenceMat);
  const hitShell=new THREE.Mesh(
    new THREE.SphereGeometry(1.08,16,10),
    new THREE.MeshBasicMaterial({visible:false})
  );
  const ring=new THREE.Mesh(
    new THREE.TorusGeometry(.72,.018,8,48),
    new THREE.MeshBasicMaterial({color:0x66727c,transparent:true,opacity:.58})
  );
  ring.rotation.x=Math.PI/2;
  ring.position.y=-.62;
  group.add(sphere,hitShell,ring);
  scene.add(group);
  world.add(id,C.Presence,{slot});
  world.add(id,C.Transform,{position:new THREE.Vector3(),rotation:new THREE.Euler(),scale:new THREE.Vector3(1,1,1)});
  world.add(id,C.RenderObject,{object:group,pickables:[sphere,hitShell,ring]});
  world.add(id,C.Selectable,{enabled:true});
  world.add(id,C.Foregroundable,{enabled:true});
  for(const object of [sphere,hitShell,ring])object.userData.entityId=id;
  presenceIds.push(id);
}

const P=(x,y,z)=>[x,y,z];
const RING={
  wide:[P(4.460,5.6,4.307),P(5.465,5.6,-2.924),P(-1.062,5.6,-6.099),P(-6.132,5.6,-0.847),P(-2.731,5.6,5.564)],
  tall:[P(3.885,5.6,3.751),P(4.278,5.6,-2.055),P(-1.218,5.6,-5.000),P(-5.040,5.6,-1.043),P(-1.904,5.6,4.348)]
};

const camera=new THREE.PerspectiveCamera(48,1,.03,80);
const target=new THREE.Vector3(0,1,0);
let radius=14,theta=.18,phi=1.18;
let lastPortrait=innerHeight>innerWidth*1.12;
let selectedEntity=null;
let presenceMotion=null;
let dirty=true;

function showFault(message){
  fault.hidden=false;
  fault.textContent=message;
}
function profile(){return innerHeight>innerWidth*1.12?"tall":"wide"}
function ringSlotPosition(id){return C.RingSlot.get(id).position.clone()}
function applyRing({preserveCamera=true}={}){
  presenceMotion=null;
  if(selectedEntity){
    world.remove(selectedEntity,C.Foregrounded);
    world.remove(selectedEntity,C.ObserverReturn);
  }
  selectedEntity=null;
  const pts=RING[profile()];
  for(const id of world.query(C.Presence,C.Transform)){
    const p=new THREE.Vector3(...pts[C.Presence.get(id).slot]);
    C.RingSlot.set(id,{position:p.clone()});
    C.Transform.get(id).position.copy(p);
  }
  sync();
  if(!preserveCamera)home();
  invalidate();
}
function home(){
  presenceMotion=null;
  if(selectedEntity){
    const slot=C.RingSlot.get(selectedEntity);
    if(slot)C.Transform.get(selectedEntity).position.copy(slot.position);
    world.remove(selectedEntity,C.Foregrounded);
    world.remove(selectedEntity,C.ObserverReturn);
  }
  selectedEntity=null;
  const pts=RING[profile()];
  const box=new THREE.Box3();
  pts.forEach(p=>box.expandByPoint(new THREE.Vector3(...p)));
  const center=box.getCenter(new THREE.Vector3());
  const size=box.getSize(new THREE.Vector3());
  target.copy(center);
  const vertical=Math.max(size.y+3,size.z*.42+4);
  const horizontal=size.x+4;
  const fov=THREE.MathUtils.degToRad(camera.fov);
  const aspect=camera.aspect;
  const needV=(vertical*.5)/Math.tan(fov*.5);
  const needH=(horizontal*.5)/(Math.tan(fov*.5)*aspect);
  radius=Math.max(8,needV,needH)*1.25;
  theta=.16;
  phi=1.16;
  sync();
  applyCamera();
}
function applyCamera(){
  phi=THREE.MathUtils.clamp(phi,.12,Math.PI-.12);
  radius=Math.max(.75,radius);
  camera.position.set(
    target.x+radius*Math.sin(phi)*Math.sin(theta),
    target.y+radius*Math.cos(phi),
    target.z+radius*Math.sin(phi)*Math.cos(theta)
  );
  const worldLen=camera.position.length();
  if(worldLen>CAMERA_BOUNDARY){
    camera.position.multiplyScalar(CAMERA_BOUNDARY/worldLen);
    const off=camera.position.clone().sub(target);
    radius=off.length();
    phi=Math.acos(THREE.MathUtils.clamp(off.y/radius,-1,1));
    theta=Math.atan2(off.x,off.z);
  }
  camera.position.y=Math.max(GROUND_Y+.18,camera.position.y);
  const targetHorizontal=Math.hypot(target.x,target.z);
  if(targetHorizontal>CAMERA_BOUNDARY*.72){
    const k=CAMERA_BOUNDARY*.72/targetHorizontal;
    target.x*=k;
    target.z*=k;
  }
  camera.lookAt(target);
  invalidate();
}
function presentationPosition(){
  const forward=new THREE.Vector3();
  camera.getWorldDirection(forward);
  const up=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1).normalize();
  return camera.position.clone().addScaledVector(forward,8.5).addScaledVector(up,.35);
}
function easeQuiet(t){
  return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
}

const ForegroundSystem={
  begin(id,toForeground){
    if(!C.Foregroundable.has(id)||presenceMotion)return;
    const from=C.Transform.get(id).position.clone();
    const to=toForeground?presentationPosition():ringSlotPosition(id);
    if(toForeground){
      world.add(id,C.ObserverReturn,{
        cameraPosition:camera.position.clone(),
        target:target.clone(),radius,theta,phi
      });
      world.add(id,C.Foregrounded,true);
      selectedEntity=id;
    }
    const saved=C.ObserverReturn.get(id);
    presenceMotion={
      id,from,to,toForeground,
      fromTarget:target.clone(),
      toTarget:toForeground?to.clone():(saved?saved.target.clone():target.clone()),
      fromCameraPosition:camera.position.clone(),
      toCameraPosition:(!toForeground&&saved)?saved.cameraPosition.clone():camera.position.clone(),
      started:performance.now(),
      duration:THREE.MathUtils.clamp(390+from.distanceTo(to)*22,430,610)
    };
    invalidate();
  },
  dismiss(){
    if(selectedEntity&&!presenceMotion)this.begin(selectedEntity,false);
  }
};

const raycaster=new THREE.Raycaster();
const pointerNDC=new THREE.Vector2();
const SelectionSystem={
  pick(x,y){
    const r=renderer.domElement.getBoundingClientRect();
    pointerNDC.set(((x-r.left)/r.width)*2-1,-((y-r.top)/r.height)*2+1);
    raycaster.setFromCamera(pointerNDC,camera);
    const pickables=[];
    for(const id of world.query(C.Selectable,C.RenderObject)){
      if(C.Selectable.get(id).enabled)pickables.push(...C.RenderObject.get(id).pickables);
    }
    for(const hit of raycaster.intersectObjects(pickables,false)){
      const id=hit.object.userData.entityId;
      if(id&&C.Selectable.has(id))return id;
    }
    return null;
  },
  tap(x,y){
    const hit=this.pick(x,y);
    if(selectedEntity){
      if(hit===selectedEntity)return;
      ForegroundSystem.dismiss();
      return;
    }
    if(hit&&!presenceMotion)ForegroundSystem.begin(hit,true);
  }
};

const canvas=renderer.domElement;
canvas.style.touchAction="none";
const pointers=new Map();
const tapStarts=new Map();
let pinch=null,pinchCentroid=null;
const centroid=a=>({
  x:a.reduce((s,p)=>s+p.x,0)/a.length,
  y:a.reduce((s,p)=>s+p.y,0)/a.length
});
function panPixels(dx,dy,gain=.8){
  const scale=radius*gain/innerHeight;
  target.addScaledVector(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0),-dx*scale);
  target.addScaledVector(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1),dy*scale);
}
function clearPointer(id){
  pointers.delete(id);
  tapStarts.delete(id);
  if(pointers.size<2){pinch=null;pinchCentroid=null}
}
canvas.addEventListener("pointerdown",e=>{
  canvas.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  tapStarts.set(e.pointerId,{x:e.clientX,y:e.clientY,t:performance.now()});
  if(pointers.size===2){
    const a=[...pointers.values()];
    pinch=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);
    pinchCentroid=centroid(a);
  }
});
canvas.addEventListener("pointermove",e=>{
  if(!pointers.has(e.pointerId))return;
  const old=pointers.get(e.pointerId);
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  const a=[...pointers.values()];
  if(a.length===1){
    if(e.shiftKey||e.buttons===2)panPixels(e.clientX-old.x,e.clientY-old.y);
    else{
      theta-=(e.clientX-old.x)*.006;
      phi-=(e.clientY-old.y)*.006;
    }
    applyCamera();
  }else if(a.length===2){
    const d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);
    const c=centroid(a);
    if(pinch&&d>0)radius*=pinch/d;
    if(pinchCentroid)panPixels(c.x-pinchCentroid.x,c.y-pinchCentroid.y,.42);
    pinch=d;
    pinchCentroid=c;
    applyCamera();
  }
});
canvas.addEventListener("pointerup",e=>{
  const start=tapStarts.get(e.pointerId);
  if(start){
    const travel=Math.hypot(e.clientX-start.x,e.clientY-start.y);
    const elapsed=performance.now()-start.t;
    if(travel<10&&elapsed<420&&pointers.size===1)SelectionSystem.tap(e.clientX,e.clientY);
  }
  clearPointer(e.pointerId);
});
canvas.addEventListener("pointercancel",e=>clearPointer(e.pointerId));
canvas.addEventListener("lostpointercapture",e=>clearPointer(e.pointerId));
canvas.addEventListener("contextmenu",e=>e.preventDefault());
canvas.addEventListener("wheel",e=>{
  e.preventDefault();
  radius*=Math.exp(e.deltaY*.001);
  applyCamera();
},{passive:false});

function invalidate(){
  dirty=true;
  requestAnimationFrame(frame);
}
function frame(now){
  const {width,height}=three.size();
  camera.aspect=width/height;
  camera.updateProjectionMatrix();

  if(presenceMotion){
    const m=presenceMotion;
    const raw=Math.min(1,(now-m.started)/m.duration);
    const t=easeQuiet(raw);
    const transform=C.Transform.get(m.id);
    transform.position.lerpVectors(m.from,m.to,t);
    sync();
    camera.position.lerpVectors(m.fromCameraPosition,m.toCameraPosition,t);
    target.lerpVectors(m.fromTarget,m.toTarget,t);
    camera.lookAt(target);
    dirty=true;
    if(raw>=1){
      transform.position.copy(m.to);
      sync();
      target.copy(m.toTarget);
      camera.lookAt(target);
      if(!m.toForeground){
        const saved=C.ObserverReturn.get(m.id);
        if(saved){
          camera.position.copy(saved.cameraPosition);
          target.copy(saved.target);
          radius=saved.radius;
          theta=saved.theta;
          phi=saved.phi;
          camera.lookAt(target);
        }
        world.remove(m.id,C.Foregrounded);
        world.remove(m.id,C.ObserverReturn);
        selectedEntity=null;
      }else{
        target.copy(transform.position);
        const off=camera.position.clone().sub(target);
        radius=off.length();
        phi=Math.acos(THREE.MathUtils.clamp(off.y/radius,-1,1));
        theta=Math.atan2(off.x,off.z);
        camera.lookAt(target);
      }
      presenceMotion=null;
    }else requestAnimationFrame(frame);
  }

  if(!dirty)return;
  dirty=false;
  three.render(camera);
}

new ResizeObserver(()=>{
  const wasPortrait=lastPortrait;
  lastPortrait=innerHeight>innerWidth*1.12;
  const {width,height}=three.size();
  camera.aspect=width/height;
  camera.updateProjectionMatrix();
  applyRing({preserveCamera:true});
  if(wasPortrait!==lastPortrait)home();
  invalidate();
}).observe(mount);

applyRing({preserveCamera:true});
const initial=three.size();
camera.aspect=initial.width/initial.height;
camera.updateProjectionMatrix();
home();

let statusFrames=0,statusStamp=performance.now(),statusRaf=0;
function sampleStatus(now){
  statusFrames++;
  if(now-statusStamp>=500){
    const fps=Math.round(statusFrames*1000/(now-statusStamp));
    const build=status.textContent.split(" • ")[0];
    status.textContent=`${build} • fps ${fps}`;
    statusFrames=0;statusStamp=now;
  }
  statusRaf=requestAnimationFrame(sampleStatus);
}
statusRaf=requestAnimationFrame(sampleStatus);

globalThis.__repository={
  world,
  components:C,
  three,
  presences:presenceIds,
  observer:{camera,target,home},
  systems:{SelectionSystem,ForegroundSystem,RenderSyncSystem:sync},
  inspect:()=>({
    profile:profile(),
    selected:selectedEntity?C.Presence.get(selectedEntity).slot:null,
    positions:presenceIds.map(id=>C.Transform.get(id).position.toArray()),
    camera:{position:camera.position.toArray(),target:target.toArray(),radius,theta,phi}
  })
};
