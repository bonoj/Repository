function pixelRatio(maxPixelRatio){
  return Math.min(globalThis.devicePixelRatio||1,maxPixelRatio);
}

export function createThreeRuntimeCore({
  THREE,
  mount,
  onContextLost=()=>{},
  rendererOptions={antialias:true,powerPreference:"high-performance"},
  maxPixelRatio=1.5,
  configureRenderer=()=>{}
}){
  if(!THREE)throw new Error("THREE is required");
  if(!mount)throw new Error("mount is required");

  const scene=new THREE.Scene();
  const renderer=new THREE.WebGLRenderer(rendererOptions);
  renderer.setPixelRatio(pixelRatio(maxPixelRatio));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  configureRenderer(renderer,THREE);
  mount.append(renderer.domElement);

  let width=1,height=1;
  function resize(){
    width=Math.max(1,mount.clientWidth);
    height=Math.max(1,mount.clientHeight);
    renderer.setSize(width,height,false);
  }

  const observer=new ResizeObserver(resize);
  observer.observe(mount);
  renderer.domElement.addEventListener("webglcontextlost",event=>{
    event.preventDefault();
    onContextLost(event);
  });
  resize();

  return {
    THREE,scene,renderer,
    size:()=>({width,height}),
    render:camera=>renderer.render(scene,camera),
    dispose(){observer.disconnect();renderer.dispose();renderer.domElement.remove();}
  };
}
