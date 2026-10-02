(()=>{
  const place={sigil:"🌀",title:"BETWIXT"};
  const spells={
    temporary:[
      {id:"spin",text:"🪄",label:"Spin presences",onClick:spinPresences},
      {id:"marble",text:"⚪️",label:"Compact Betwixt content",onClick:marbleBetwixtContent},
      {id:"crucible",text:"⚗️",label:"Summon intact Crucible",onClick:toggleCrucible}
    ],
    resident:[
      {id:"workshop",text:"🛠",label:"Clear the Workshop bench",onClick:toggleWorkshop},
      {id:"lift",text:"⬆️",label:"Lift Betwixt content",onClick:liftBetwixtContent},
      {id:"refresh",text:"🔄",label:"Reload",onClick:()=>location.reload()}
    ]
  };
  const build=globalThis.__REPOSITORY_BUILD__||"local";
  const sha=globalThis.__REPOSITORY_SHA__||null;

  const style=document.createElement("style");
  style.textContent=`
    #repository-status{position:fixed;z-index:90;left:max(.7rem,env(safe-area-inset-left));right:max(.7rem,env(safe-area-inset-right));top:max(.7rem,env(safe-area-inset-top));width:max-content;max-width:calc(100% - max(.7rem,env(safe-area-inset-left)) - max(.7rem,env(safe-area-inset-right)));box-sizing:border-box;padding:.45rem .6rem;border:1px solid #77736b40;border-radius:.45rem;background:#e7e2d8df;color:#4d4d49;font:600 11px/1.25 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.04em;pointer-events:none;box-shadow:0 3px 12px #5a514314;backdrop-filter:blur(4px)}
    #repository-devtools{position:fixed;z-index:90;inset:auto max(.6rem,env(safe-area-inset-right)) max(.6rem,env(safe-area-inset-bottom)) max(.6rem,env(safe-area-inset-left));box-sizing:border-box;display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;pointer-events:none}
    #repository-devtools .spell-tray{display:flex;flex-wrap:wrap;align-content:flex-end;gap:.28rem;max-width:calc(4 * 2.65rem + 3 * .28rem);pointer-events:auto}
    #repository-devtools .temporary{justify-content:flex-start}
    #repository-devtools .resident{justify-content:flex-end;flex-direction:row-reverse}
    #repository-devtools button{box-sizing:border-box;width:2.65rem;height:2.65rem;min-height:0;padding:0;border:1px solid #77736b55;border-radius:.45rem;background:#d9d6cf;color:#343638;font:1.25rem/1 system-ui,-apple-system,Segoe UI Emoji,sans-serif;touch-action:manipulation}
    #repository-devtools button.active{outline:1px solid #555;background:#cbc7be}
    #repository-devtools button.wide{grid-column:span 2;width:auto}
    #repository-devtools button.tall{grid-row:span 2;height:auto}
    #repository-devtools button.large{grid-column:span 2;grid-row:span 2;width:auto;height:auto;font-size:1.6rem}
    #repository-crucible{position:fixed;z-index:80;left:50%;top:50%;width:min(88vw,52rem);height:min(76dvh,44rem);transform:translate(-50%,-50%);border:1px solid #77736b66;border-radius:.7rem;background:#342820;box-shadow:0 1.2rem 4rem #0007;overflow:hidden}
    #repository-crucible iframe{display:block;width:100%;height:100%;border:0;background:#342820}
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
  function registerTool({id,text,label,onClick,active=false,size,lane="temporary"}){
    if(!id||registered.has(id))throw new Error(`Repository tool already registered: ${id}`);
    const button=document.createElement("button");
    button.type="button";
    button.textContent=text||"•";
    button.setAttribute("aria-label",label||id);
    button.classList.toggle("active",!!active);
    if(size)button.classList.add(size);
    button.addEventListener("click",()=>onClick?.(button));
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
    inspect:()=>({place:{...place},build,sha,fps,tools:[...registered.keys()]})
  };
})();