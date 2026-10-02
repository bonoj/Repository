import * as THREE from "three";
import {createWorld} from "../core/ecs.js";
import {createThreeRuntimeCore} from "../runtime/three-runtime.js";
import {createRenderSyncSystem} from "../runtime/render-sync.js";

const mount=document.querySelector("#world");
const three=createThreeRuntimeCore({
  THREE,mount,
  onContextLost:()=>showFault("WebGL context lost. Reload to reconstruct."),
  configureRenderer:renderer=>{
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1;
  }
});
three.scene.background=new THREE.Color(0x080a0d);

const world=createWorld();
const Transform=world.component("Transform");
const RenderObject=world.component("RenderObject");
const components={Transform,RenderObject};

const id=world.entity();
world.add(id,Transform,{
  position:new THREE.Vector3(0,0,0),
  rotation:new THREE.Euler(),
  scale:new THREE.Vector3(1,1,1)
});
const mesh=new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.65,2),
  new THREE.MeshNormalMaterial()
);
three.scene.add(mesh);
world.add(id,RenderObject,{object:mesh});

const camera=new THREE.PerspectiveCamera(48,1,0.03,100);
camera.position.set(0,0,4);
const sync=createRenderSyncSystem({world,components});

function showFault(message){
  const fault=document.querySelector("#fault");
  fault.hidden=false;
  fault.textContent=message;
}

function frame(){
  const {width,height}=three.size();
  camera.aspect=width/height;
  camera.updateProjectionMatrix();
  sync();
  three.render(camera);
}
new ResizeObserver(frame).observe(mount);
frame();
globalThis.__repository={world,components,three,entity:id};
