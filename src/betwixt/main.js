import * as THREE from "three";
import {createWorld} from "../core/ecs.js";
import {createThreeRuntimeCore} from "../runtime/three-runtime.js";
import {createRenderSyncSystem} from "../runtime/render-sync.js";

const mount=document.querySelector("#world");
const fault=document.querySelector("#fault");
const three=createThreeRuntimeCore({
  THREE,mount,
  onContextLost:()=>showFault("WebGL context lost. Reload to reconstruct."),
  configureRenderer:renderer=>{
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1;
  }
});
three.scene.background=new THREE.Color(0xf1f1ef);
three.scene.fog=new THREE.Fog(0xf1f1ef,18,34);

const world=createWorld();
const Transform=world.component("Transform");
const RenderObject=world.component("RenderObject");
const components={Transform,RenderObject};
const sync=createRenderSyncSystem({world,components});

function entity(object,position=new THREE.Vector3()){
  const id=world.entity();
  world.add(id,Transform,{position,rotation:new THREE.Euler(),scale:new THREE.Vector3(1,1,1)});
  three.scene.add(object);
  world.add(id,RenderObject,{object});
  return id;
}

const floor=new THREE.Mesh(
  new THREE.CircleGeometry(22,96),
  new THREE.MeshStandardMaterial({color:0xd9d9d5,roughness:1,metalness:0})
);
floor.rotation.x=-Math.PI/2;
floor.position.y=-1.25;
three.scene.add(floor);

const dome=new THREE.Mesh(
  new THREE.SphereGeometry(23,48,24),
  new THREE.MeshBasicMaterial({color:0xf6f6f3,side:THREE.BackSide})
);
dome.position.y=-1.25;
three.scene.add(dome);

three.scene.add(new THREE.HemisphereLight(0xffffff,0x8d9092,2.2));
const key=new THREE.DirectionalLight(0xffffff,2.4);
key.position.set(4,9,6);
three.scene.add(key);

const witness=new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.62,2),
  new THREE.MeshStandardMaterial({color:0xb7b9b8,roughness:0.58,metalness:0.08})
);
const witnessId=entity(witness,new THREE.Vector3(0,0,0));

const camera=new THREE.PerspectiveCamera(48,1,0.03,80);
const target=new THREE.Vector3(0,0,0);
let azimuth=0,polar=Math.PI/2.35,distance=7.5;
const pointers=new Map();
let pinchDistance=null;
let dirty=true;

function clampObserver(){
  polar=THREE.MathUtils.clamp(polar,0.18,Math.PI-0.18);
  distance=THREE.MathUtils.clamp(distance,2.2,21);
}

function placeCamera(){
  clampObserver();
  const sin=Math.sin(polar);
  camera.position.set(
    target.x+distance*sin*Math.sin(azimuth),
    target.y+distance*Math.cos(polar),
    target.z+distance*sin*Math.cos(azimuth)
  );
  if(camera.position.y<-1.05)camera.position.y=-1.05;
  const radial=Math.hypot(camera.position.x,camera.position.z);
  if(radial>21){
    const s=21/radial;
    camera.position.x*=s;camera.position.z*=s;
  }
  camera.lookAt(target);
}

function showFault(message){
  fault.hidden=false;
  fault.textContent=message;
}

function invalidate(){dirty=true;requestAnimationFrame(frame)}
function frame(){
  if(!dirty)return;
  dirty=false;
  const {width,height}=three.size();
  camera.aspect=width/height;
  camera.updateProjectionMatrix();
  placeCamera();
  sync();
  three.render(camera);
}

const canvas=three.renderer.domElement;
canvas.style.touchAction="none";
canvas.addEventListener("pointerdown",e=>{
  canvas.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
});
canvas.addEventListener("pointermove",e=>{
  if(!pointers.has(e.pointerId))return;
  const old=pointers.get(e.pointerId);
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===1){
    azimuth-=(e.clientX-old.x)*0.006;
    polar-=(e.clientY-old.y)*0.006;
    invalidate();
  }else if(pointers.size===2){
    const [a,b]=[...pointers.values()];
    const d=Math.hypot(a.x-b.x,a.y-b.y);
    if(pinchDistance!==null){
      distance*=pinchDistance/Math.max(1,d);
      invalidate();
    }
    pinchDistance=d;
  }
});
function release(e){
  pointers.delete(e.pointerId);
  if(pointers.size<2)pinchDistance=null;
}
canvas.addEventListener("pointerup",release);
canvas.addEventListener("pointercancel",release);
canvas.addEventListener("wheel",e=>{
  e.preventDefault();
  distance*=Math.exp(e.deltaY*0.001);
  invalidate();
},{passive:false});

new ResizeObserver(invalidate).observe(mount);
invalidate();
globalThis.__repository={world,components,three,witnessId,observer:{camera,target}};
