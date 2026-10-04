(()=>{
  const place={sigil:"🌀",title:"BETWIXT"};
  const spells={
    temporary:[],
    resident:[
      {id:"refresh",text:"🔄",label:"Refresh",onClick:freshArrival},
      {id:"workshop",text:"🛠",label:"Workshop",onClick:toggleWorkshop}
    ]
  };
  const build=globalThis.__REPOSITORY_BUILD__||"local";
  const sha=globalThis.__REPOSITORY_SHA__||null;

  // Build identity is the executable's own immutable provenance. Publication
  // freshness is a deployment concern; the page must not try to infer or repair
  // it by fetching another potentially stale Pages resource.

  const style=document.createElement("style");
  style.textContent=`
    #repository-status{position:fixed;z-index:90;left:max(.7rem,env(safe-area-inset-left));right:max(.7rem,env(safe-area-inset-right));top:max(.7rem,env(safe-area-inset-top));width:max-content;max-width:calc(100% - max(.7rem,env(safe-area-inset-left)) - max(.7rem,env(safe-area-inset-right)));box-sizing:border-box;padding:.45rem .6rem;border:1px solid #77736b40;border-radius:.45rem;background:#e7e2d8df;color:#4d4d49;font:600 11px/1.25 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.04em;pointer-events:none;box-shadow:0 3px 12px #5a514314;backdrop-filter:blur(4px)}
    #repository-devtools{position:fixed;z-index:90;inset:auto max(.6rem,env(safe-area-inset-right)) max(.6rem,env(safe-area-inset-bottom)) max(.6rem,env(safe-area-inset-left));box-sizing:border-box;display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;pointer-events:none}
    #repository-devtools .spell-tray{display:flex;flex-wrap:wrap;align-content:flex-end;gap:.28rem;max-width:calc(4 * 2.65rem + 3 * .28rem);pointer-events:auto}
    #repository-devtools .temporary{justify-content:flex-start}
    #repository-devtools .resident{justify-content:flex-start;flex-direction:row-reverse;margin-left:auto;flex:0 0 auto}
    #repository-devtools button{box-sizing:border-box;width:2.65rem;height:2.65rem;min-height:0;padding:0;border:1px solid #77736b55;border-radius:.45rem;background:#d9d6cf;color:#343638;font:1.25rem/1 system-ui,-apple-system,Segoe UI Emoji,sans-serif;touch-action:manipulation}
    #repository-devtools button.active{outline:1px solid #555;background:#cbc7be}
    #repository-devtools button.wide{grid-column:span 2;width:auto}
    #repository-devtools button.tall{grid-row:span 2;height:auto}
    #repository-devtools button.large{grid-column:span 2;grid-row:span 2;width:auto;height:auto;font-size:1.6rem}
    #repository-crucible{position:fixed;z-index:80;left:50%;top:50%;width:min(88vw,52rem);height:min(76dvh,44rem);transform:translate(-50%,-50%);border:1px solid #77736b66;border-radius:.7rem;background:#342820;box-shadow:0 1.2rem 4rem #0007;overflow:hidden}
    #repository-crucible iframe{display:block;width:100%;height:100%;border:0;background:#342820}
    #repository-2d{position:fixed;z-index:70;left:max(.6rem,env(safe-area-inset-left));right:max(.6rem,env(safe-area-inset-right));top:3.55rem;bottom:4rem;border:1px solid #77736b45;border-radius:.55rem;overflow:hidden;background:#11151c;touch-action:manipulation}
    #repository-2d canvas{display:block;width:100%;height:100%;touch-action:manipulation}
  `;
  document.head.append(style);

  const status=document.createElement("output");
  status.id="repository-status";
  status.textContent=`${place.sigil} ${place.title} · ${build} · … fps`;
  document.body.append(status);

  const tools=document.createElement("div");
  tools.id="repository-devtools";
  tools.setAttribute("aria-label","Repository tools");
  const temporaryTray=document.createElement("div");
  temporaryTray.className="spell-tray temporary";
  temporaryTray.setAttribute("aria-label","Temporary spells");
  const residentTray=document.createElement("div");
  residentTray.className="spell-tray resident";
  residentTray.setAttribute("aria-label","Resident spells");
  tools.append(temporaryTray,residentTray);
  document.body.append(tools);

  // 2D pressure surface: The Far Bell.
  // Large targets only. A tap is an instruction sent across the world: the
  // touched bell never owns the immediate consequence, so the finger cannot hide it.
  const toyHost=document.createElement("section");
  toyHost.id="repository-2d";
  toyHost.setAttribute("aria-label","The Far Bell");
  const toyCanvas=document.createElement("canvas");
  toyHost.append(toyCanvas);document.body.append(toyHost);
  const toy=toyCanvas.getContext("2d");
  const bells=[
    {x:.18,y:.24,r:.115,phase:0,tone:0},{x:.76,y:.18,r:.13,phase:1,tone:1},
    {x:.25,y:.72,r:.14,phase:2,tone:2},{x:.78,y:.72,r:.12,phase:3,tone:3},
    {x:.50,y:.47,r:.16,phase:4,tone:4}
  ];
  const flights=[],echoes=[];
  let toyW=1,toyH=1,toyD=1,toyLast=performance.now(),toyTurn=0;
  function toyResize(){const r=toyCanvas.getBoundingClientRect();toyD=Math.min(2,devicePixelRatio||1);const w=Math.max(1,Math.floor(r.width*toyD)),h=Math.max(1,Math.floor(r.height*toyD));if(w!==toyCanvas.width||h!==toyCanvas.height){toyCanvas.width=w;toyCanvas.height=h}toyW=w;toyH=h}
  function bellPos(b){return{x:b.x*toyW,y:b.y*toyH,r:b.r*Math.min(toyW,toyH)}}
  function strike(index){
    const source=bells[index];
    // Each bell has a hidden recipient; repeated strikes mutate that relationship.
    const hop=1+((index+toyTurn)% (bells.length-1));
    const targetIndex=(index+hop)%bells.length,target=bells[targetIndex];
    flights.push({from:index,to:targetIndex,t:0,curve:(toyTurn%2?1:-1)*(.12+.04*index)});
    source.phase+=.7;toyTurn++;
    // Consequence is delayed until the travelling signal arrives elsewhere.
  }
  function toyTap(e){const r=toyCanvas.getBoundingClientRect(),x=(e.clientX-r.left)*toyD,y=(e.clientY-r.top)*toyD;let hit=-1,bd=Infinity;bells.forEach((b,i)=>{const p=bellPos(b),d=Math.hypot(x-p.x,y-p.y);if(d<p.r*1.35&&d<bd){hit=i;bd=d}});if(hit>=0)strike(hit)}
  toyCanvas.addEventListener("pointerup",e=>{e.preventDefault();toyTap(e)});
  function toyStep(dt){
    for(let i=flights.length-1;i>=0;i--){const f=flights[i];f.t+=dt*.72;if(f.t>=1){const b=bells[f.to];b.phase+=2.4;b.r=Math.min(.205,b.r+.012);echoes.push({at:f.to,t:0});flights.splice(i,1)}}
    for(let i=echoes.length-1;i>=0;i--){echoes[i].t+=dt;if(echoes[i].t>1.35)echoes.splice(i,1)}
    for(const b of bells)b.r+=(b.r>.16?-.0035:0)*dt;
  }
  function toyDraw(){
    toyResize();toy.clearRect(0,0,toyW,toyH);
    const bg=toy.createLinearGradient(0,0,0,toyH);bg.addColorStop(0,"#121923");bg.addColorStop(1,"#17130f");toy.fillStyle=bg;toy.fillRect(0,0,toyW,toyH);
    // Sparse horizon makes the field feel like a place without introducing tiny interactables.
    toy.strokeStyle="rgba(220,210,190,.10)";toy.lineWidth=toyD;
    toy.beginPath();toy.moveTo(0,toyH*.56);toy.bezierCurveTo(toyW*.22,toyH*.49,toyW*.68,toyH*.64,toyW,toyH*.52);toy.stroke();
    for(const f of flights){const a=bellPos(bells[f.from]),b=bellPos(bells[f.to]),t=Math.min(1,f.t),mx=(a.x+b.x)/2+f.curve*toyW,my=(a.y+b.y)/2-f.curve*toyH;const u=1-t,x=(u*u*a.x+2*u*t*mx+t*t*b.x),y=(u*u*a.y+2*u*t*my+t*t*b.y);toy.strokeStyle="rgba(238,220,174,.28)";toy.lineWidth=3*toyD;toy.beginPath();toy.moveTo(a.x,a.y);toy.quadraticCurveTo(mx,my,x,y);toy.stroke();toy.fillStyle="rgba(250,235,188,.95)";toy.beginPath();toy.arc(x,y,7*toyD,0,Math.PI*2);toy.fill()}
    for(const e of echoes){const p=bellPos(bells[e.at]),rr=p.r*(1+e.t*1.8);toy.strokeStyle="rgba(237,218,176,"+(Math.max(0,1-e.t/1.35)*.55)+")";toy.lineWidth=3*toyD;toy.beginPath();toy.arc(p.x,p.y,rr,0,Math.PI*2);toy.stroke()}
    bells.forEach((b,i)=>{const p=bellPos(b),pulse=1+Math.sin(performance.now()*.0014+b.phase)*.025;toy.save();toy.translate(p.x,p.y);toy.scale(pulse,pulse);const g=toy.createRadialGradient(-p.r*.22,-p.r*.28,p.r*.08,0,0,p.r);g.addColorStop(0,i===4?"#ddd1aa":"#c7b786");g.addColorStop(.68,i===4?"#77684b":"#665c45");g.addColorStop(1,"#28251f");toy.fillStyle=g;toy.beginPath();toy.arc(0,0,p.r,0,Math.PI*2);toy.fill();toy.strokeStyle="rgba(246,230,190,.34)";toy.lineWidth=3*toyD;toy.stroke();toy.fillStyle="rgba(20,19,18,.72)";toy.beginPath();toy.arc(0,p.r*.18,p.r*.20,0,Math.PI*2);toy.fill();toy.restore()});
  }
  function toyLoop(now){const dt=Math.min(.05,(now-toyLast)/1000);toyLast=now;toyStep(dt);toyDraw();requestAnimationFrame(toyLoop)}
  requestAnimationFrame(toyLoop);

  let fps=0,frames=0,stamp=performance.now();
  function sample(now){
    frames++;
    if(now-stamp>=500){
      fps=Math.round(frames*1000/(now-stamp));
      status.textContent=`${place.sigil} ${place.title} · ${build} · ${fps} fps`;
      frames=0;stamp=now;
    }
    requestAnimationFrame(sample);
  }
  requestAnimationFrame(sample);

  const registered=new Map();
  function registerTool({id,text,label,onClick,onDoubleClick,onLongPress,onContextMenu,active=false,size,lane="temporary"}){
    if(!id||registered.has(id))throw new Error(`Repository tool already registered: ${id}`);
    const button=document.createElement("button");
    button.type="button";
    button.textContent=text||"•";
    button.setAttribute("aria-label",label||id);
    button.classList.toggle("active",!!active);
    if(size)button.classList.add(size);
    if(onDoubleClick||onLongPress||onContextMenu){
      let pressTimer=null,lastTap=0,longFired=false;
      button.addEventListener("pointerdown",e=>{
        e.stopPropagation();longFired=false;
        if(onLongPress)pressTimer=setTimeout(()=>{pressTimer=null;longFired=true;onLongPress(button)},650);
      });
      button.addEventListener("pointerup",e=>{
        e.stopPropagation();if(pressTimer){clearTimeout(pressTimer);pressTimer=null}
        if(longFired)return;
        const now=performance.now();
        if(onDoubleClick&&now-lastTap<320){lastTap=0;onDoubleClick(button);return}
        lastTap=now;
        setTimeout(()=>{if(lastTap===now){onClick?.(button);lastTap=0}},onDoubleClick?330:0);
      });
      button.addEventListener("pointercancel",()=>{if(pressTimer)clearTimeout(pressTimer);pressTimer=null});
      button.addEventListener("contextmenu",e=>{if(onContextMenu){e.preventDefault();e.stopPropagation();onContextMenu(button)}});
    }else button.addEventListener("click",()=>onClick?.(button));
    registered.set(id,button);
    (lane==="resident"?residentTray:temporaryTray).append(button);
    return button;
  }
  function removeTool(id){
    registered.get(id)?.remove();
    registered.delete(id);
  }

  let crucibleAperture=null;
  function toggleCrucible(button){
    if(crucibleAperture){
      crucibleAperture.remove();
      crucibleAperture=null;
      button?.classList.remove("active");
      button?.setAttribute("aria-pressed","false");
      return false;
    }
    const host=document.createElement("section");
    host.id="repository-crucible";
    host.setAttribute("aria-label","Intact Crucible");
    const frame=document.createElement("iframe");
    frame.src="crucible/index.html";
    frame.title="Crucible";
    host.append(frame);
    document.body.append(host);
    crucibleAperture=host;
    button?.classList.add("active");
    button?.setAttribute("aria-pressed","true");
    return true;
  }

  function marbleBetwixtContent(button){
    const world=globalThis.vestibule;
    if(!world?.toggleContentTinkered||world.contentWorkshopHidden)return;
    const tinkered=world.toggleContentTinkered();
    button?.classList.toggle("active",tinkered);
    button?.setAttribute("aria-pressed",tinkered?"true":"false");
    const lift=registered.get("lift");
    if(lift){lift.classList.remove("active");lift.setAttribute("aria-pressed","false");lift.textContent="⬆️"}
  }

  function freshArrival(){
    try{sessionStorage.removeItem("worldLab.worldState.v1")}catch(_){}
    // Reset the live observer before navigation too. On mobile a same-document
    // replace can be satisfied from the current page/BFCache; the new document
    // will independently boot to the same home pose.
    globalThis.vestibule?.home?.();
    const url=new URL(location.href);
    // Never preserve a build cache key across a requested fresh arrival.
    // A stale document must not be able to make its own provenance sticky.
    url.search="";
    url.searchParams.set("fresh",Date.now().toString(36));
    url.hash="";
    location.replace(url);
  }

  function toggleWorkshop(button){
    const world=globalThis.vestibule;
    if(!world?.toggleContentWorkshopHidden)return;
    const hidden=world.toggleContentWorkshopHidden();
    button?.classList.toggle("active",hidden);
    button?.setAttribute("aria-pressed",hidden?"true":"false");
    const lift=registered.get("lift");
    if(lift){lift.classList.remove("active");lift.setAttribute("aria-pressed","false");lift.textContent="⬆️"}
    const marble=registered.get("marble");
    marble?.classList.remove("active");marble?.setAttribute("aria-pressed","false");
  }

  function liftBetwixtContent(button){
    const world=globalThis.vestibule;
    if(!world?.toggleContentRaised||world.contentWorkshopHidden)return;
    if(world.contentTinkered)world.setContentTinkered(false);
    const raised=world.toggleContentRaised();
    button.textContent=raised?"⬇️":"⬆️";
    button?.classList.toggle("active",raised);
    button?.setAttribute("aria-pressed",raised?"true":"false");
    const marble=registered.get("marble");
    marble?.classList.remove("active");marble?.setAttribute("aria-pressed","false");
  }

  function toggleArcball(button){
    const world=globalThis.vestibule;if(!world?.toggleArcball)return;
    const active=world.toggleArcball();
    button?.classList.toggle("active",active);button?.setAttribute("aria-pressed",active?"true":"false");
  }
  function toggleFluidGlobes(button){
    const world=globalThis.vestibule;if(!world?.toggleFluidGlobes)return;
    const active=world.toggleFluidGlobes();
    button?.classList.toggle("active",active);button?.setAttribute("aria-pressed",active?"true":"false");
  }
  function toggleCrayon(button){
    const world=globalThis.vestibule;if(!world?.toggleCrayon)return;
    const active=world.toggleCrayon();
    button?.classList.toggle("active",active);button?.setAttribute("aria-pressed",active?"true":"false");
  }
  function clearCrayon(){globalThis.vestibule?.clearCrayon?.()}
  function exportCrayon(){globalThis.vestibule?.exportCrayon?.()}

  function spinPresences(){
    const world=globalThis.vestibule;
    if(!world?.presences?.length)return;
    const start=performance.now(),duration=1800,turns=2;
    const base=world.presences.map(o=>o.rotation.y);
    const tick=now=>{
      const raw=Math.min(1,(now-start)/duration);
      const t=1-Math.pow(1-raw,3);
      world.presences.forEach((o,i)=>{o.rotation.y=base[i]+Math.PI*2*turns*t});
      world.invalidate?.();
      if(raw<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  for(const spell of spells.temporary)registerTool({...spell,lane:"temporary"});
  for(const spell of spells.resident)registerTool({...spell,lane:"resident"});

  // Betwixt now begins at the bench. Workshop is the sole manifested spell.
  // Wait for the donor to expose its world boundary, then enter exactly once.
  function enterWorkshopOnReady(){
    const world=globalThis.vestibule;
    if(!world?.setContentWorkshopHidden)return false;
    if(!world.contentWorkshopHidden)world.setContentWorkshopHidden(true);
    const button=registered.get("workshop");
    button?.classList.add("active");button?.setAttribute("aria-pressed","true");
    return true;
  }
  if(!enterWorkshopOnReady())addEventListener("vestibule-ready",enterWorkshopOnReady,{once:true});

  globalThis.RepositoryShell={
    place,
    spells,
    build,
    sha,
    status,
    devtools:tools,
    trays:{temporary:temporaryTray,resident:residentTray},
    registerTool,
    removeTool,
    button:id=>registered.get(id)||null,
    inspect:()=>({place:{...place},build,sha,fps,tools:[...registered.keys()]})
  };
})();