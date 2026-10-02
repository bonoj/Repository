// One ownership surface for Crucible's developer UI.
// Control grammar, grouping, labels, state, and DOM binding live here.
export function createDevUI({mount,statusMount,build,actions}){
  if(!mount)throw new Error("DevUI mount missing");
  const groups=[
    {kind:"choice",label:"Spatial tools",items:[{id:"meteor",text:"☄️",label:"Call meteor at tapped point",tool:"meteor",cycle:actions.meteorMagnitude}]},
    {kind:"choice",label:"Bearing controls",items:[
      {id:"bearings",text:"⚫️",label:"Spawn 25 bearings at tapped point; tap again for 25 thousand",tool:"bearing-packet",cycle:actions.bearingMagnitude}
    ]},
    {kind:"choice",label:"Terrain tools",items:[
      {id:"carve",text:"⛏️",label:"Carve terrain at tapped point",tool:"carve"},
      {id:"raise",text:"🪏",label:"Raise terrain at tapped point",tool:"raise"}
    ]},
    {kind:"choice",label:"Transport tools",items:[
      {id:"source",text:"💧",label:"Place transport source at tapped point",tool:"source"},
      {id:"lava",text:"🌋",label:"Place lava at tapped point",tool:"lava"},
    ]},
    {kind:"controls",items:[
      {id:"science",text:"🔬",label:"Toggle Science mode",on:actions.science},
      {id:"terrain-next",text:"⛰️",label:"Next deterministic terrain",on:actions.terrainNext},
      {id:"time",text:"⌛️",label:"Simulation speed 1 times",on:actions.timeScale},
      {id:"save",text:"📋",label:"Capture current water diagnostic evidence",on:actions.terrainEvidence},
      {id:"refresh",text:"🔄",label:"Refresh",on:actions.refresh}
    ]}
  ];
  let tool="meteor",fps="…",meteorMagnitude=1,bearingMagnitude=0;const nodes=new Map();
  mount.replaceChildren();
  if(statusMount){statusMount.replaceChildren();const o=document.createElement("output");o.className="dev-status-readout";nodes.set("status",o);statusMount.append(o)}
  function syncStatus(){const n=nodes.get("status");if(n)n.textContent=`${String(build||"local").slice(0,8)} • fps ${fps}`}
  function button(item){
    const b=document.createElement("button");b.type="button";b.className="dev-control";b.textContent=item.text;b.setAttribute("aria-label",item.label);nodes.set(item.id,b);
    b.addEventListener("click",()=>{if(item.tool){if(item.tool===tool&&item.cycle){if(item.id==="meteor"){meteorMagnitude=(meteorMagnitude+1)%4;item.cycle(meteorMagnitude);syncMeteor()}else if(item.id==="bearings"){bearingMagnitude=bearingMagnitude?0:1;item.cycle(bearingMagnitude);syncBearings()}}else{tool=item.tool;if(item.id==="bearings"){bearingMagnitude=0;item.cycle?.(bearingMagnitude);syncBearings()}syncTools();actions.tool?.(tool)} }else item.on?.(b)});return b;
  }
  for(const group of groups){
    if(group.kind==="readout"){for(const [id,value,label] of group.items){const o=document.createElement("output");o.className="dev-readout";o.textContent=value;o.setAttribute("aria-label",label);nodes.set(id,o);mount.append(o)}continue}
    const host=document.createElement("span");host.className=group.kind==="choice"?"dev-group":"dev-controls";if(group.label)host.setAttribute("aria-label",group.label);
    for(const item of group.items)host.append(button(item));mount.append(host);
  }
  function syncTools(){for(const group of groups)for(const item of group.items||[])if(item?.tool)nodes.get(item.id)?.classList.toggle("active",item.tool===tool)}
  function syncMeteor(){const n=nodes.get("meteor");if(!n)return;n.style.setProperty("--meteor-scale",String(1+meteorMagnitude*.08));n.setAttribute("aria-label",`Call meteor magnitude ${meteorMagnitude+1} at tapped point`)}
  function syncBearings(){const n=nodes.get("bearings");if(!n)return;n.textContent=bearingMagnitude?"⚫️⚫️\n⚫️⚫️":"⚫️";n.style.whiteSpace="pre-line";n.setAttribute("aria-label",bearingMagnitude?"Spawn 25 thousand bearings at tapped point":"Spawn 25 bearings at tapped point")}
  function setPressed(id,value){const n=nodes.get(id);n?.classList.toggle("active",!!value);n?.setAttribute("aria-pressed",String(!!value))}
  function setChoice(prefix,index){for(let i=0;i<16;i++){const n=nodes.get(`${prefix}-${i+1}`);if(n)n.classList.toggle("active",i===index)}}
  function setText(id,text,label){const n=nodes.get(id);if(!n)return;n.textContent=text;if(label)n.setAttribute("aria-label",label)}
  syncTools();syncMeteor();syncBearings();syncStatus();
  return{get tool(){return tool},setTool(v){tool=v;syncTools();return tool},setPressed,setChoice,setText,setFps:v=>{fps=v;syncStatus()},inspect:()=>({tool,controls:[...nodes.keys()]})};
}
