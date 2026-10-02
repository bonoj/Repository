export function createFootprintSystem({world,components,THREE,scene,terrain}){
  const {Transform,Footprint,FootprintView}=components;
  const states=new Map();
  const material=new THREE.LineBasicMaterial({color:0xffd38a,transparent:true,opacity:.58,depthTest:true,depthWrite:false});
  function realize(id){
    let state=states.get(id);if(state)return state;
    const spec=Footprint.get(id),segments=spec.segments||48;
    const geometry=new THREE.BufferGeometry(),line=new THREE.LineLoop(geometry,material);
    line.name=`footprint-${id}`;line.renderOrder=5;scene.add(line);
    state={line,geometry,segments,center:new THREE.Vector3(),radius:0,groundY:0};
    states.set(id,state);world.add(id,FootprintView,state);return state;
  }
  function resolve(id){
    const spec=Footprint.get(id),transform=Transform.get(id),state=realize(id);
    const groundY=terrain.groundHeight(transform.position.x,transform.position.z);
    if(!Number.isFinite(groundY)){state.line.visible=false;return state}
    const height=Math.max(0,transform.position.y-groundY);
    const radius=spec.kind==="cone"?Math.min(spec.maxRadius??Infinity,height*Math.tan(spec.halfAngle)):spec.radius;
    const points=[];
    for(let i=0;i<state.segments;i++){
      const a=i/state.segments*Math.PI*2,x=transform.position.x+Math.cos(a)*radius,z=transform.position.z+Math.sin(a)*radius;
      const y=terrain.groundHeight(x,z);points.push(x,Number.isFinite(y)?y+.035:groundY+.035,z);
    }
    state.geometry.setAttribute("position",new THREE.Float32BufferAttribute(points,3));
    state.geometry.computeBoundingSphere();state.center.set(transform.position.x,groundY,transform.position.z);
    state.radius=radius;state.groundY=groundY;state.line.visible=spec.debugVisible!==false;
    return state;
  }
  function update(){for(const id of world.query(Transform,Footprint))resolve(id)}
  function contains(id,position,padding=0){const s=states.get(id)||resolve(id);const dx=position.x-s.center.x,dz=position.z-s.center.z;return dx*dx+dz*dz<=(s.radius+padding)*(s.radius+padding)}
  function inspect(id){const s=states.get(id)||resolve(id),spec=Footprint.get(id);return{id,kind:spec.kind,center:s.center.toArray(),radius:s.radius,halfAngle:spec.halfAngle,debugVisible:s.line.visible}}
  return{update,contains,inspect};
}
