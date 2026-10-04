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

  // 2D pressure surface: Idiot Software Company v1.
  // The company is an organism. Tap a large department to intervene; work travels elsewhere.
  const toyHost=document.createElement("section");toyHost.id="repository-2d";toyHost.setAttribute("aria-label","Idiot Software Company");
  const toyCanvas=document.createElement("canvas");toyHost.append(toyCanvas);document.body.append(toyHost);
  const toy=toyCanvas.getContext("2d");
  const depts=[
    {n:"SALES",x:.18,y:.19,q:0,heat:0},{n:"PRODUCT",x:.50,y:.16,q:0,heat:0},{n:"ENG",x:.82,y:.19,q:0,heat:0},
    {n:"CUSTOMERS",x:.16,y:.50,q:0,heat:0},{n:"MEETINGS",x:.50,y:.48,q:0,heat:0},{n:"PROD",x:.84,y:.50,q:0,heat:0},
    {n:"HR",x:.18,y:.79,q:0,heat:0},{n:"FINANCE",x:.50,y:.82,q:0,heat:0},{n:"EXEC",x:.82,y:.79,q:0,heat:0}
  ];
  const packets=[],scars=[];
  let toyW=1,toyH=1,toyD=1,toyLast=performance.now(),clock=0,cash=70,software=0,people=24,alive=true,ending="",nextSpawn=1.2;
  const routes=[[0,1],[1,2],[2,5],[5,3],[3,0],[6,8],[7,8],[8,4],[4,1],[4,2],[0,4],[3,4],[5,4],[8,0],[2,4],[4,6],[4,7]];
  function toyResize(){const r=toyCanvas.getBoundingClientRect();toyD=Math.min(2,devicePixelRatio||1);const w=Math.max(1,Math.floor(r.width*toyD)),h=Math.max(1,Math.floor(r.height*toyD));if(w!==toyCanvas.width||h!==toyCanvas.height){toyCanvas.width=w;toyCanvas.height=h}toyW=w;toyH=h}
  function send(from,to,type="work",power=1){if(!alive)return;packets.push({from,to,type,power,t:0});depts[from].heat+=.25}
  function spawn(){const r=Math.floor((clock*13)%5);if(r===0)send(3,0,"want");else if(r===1)send(0,1,"promise");else if(r===2)send(5,4,"fire");else if(r===3)send(8,4,"idea");else send(6,4,"person")}
  function intervene(i){
    if(!alive)return;const d=depts[i];d.heat+=1;
    if(i===0){send(0,1,"promise",2);cash+=4}
    else if(i===1){send(1,2,"roadmap",2)}
    else if(i===2){send(2,5,"ship",2)}
    else if(i===3){send(3,0,"want",2)}
    else if(i===4){for(const j of [0,1,2,6,7,8])send(4,j,"meeting",.7)}
    else if(i===5){send(5,3,"release",2)}
    else if(i===6){people++;cash-=3;send(6,4,"onboard")}
    else if(i===7){cash+=8;send(7,8,"budget")}
    else {send(8,0,"strategy");send(8,1,"strategy");send(8,4,"strategy")}
  }
  function toyTap(e){const r=toyCanvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;let hit=-1,bd=99;depts.forEach((d,i)=>{const q=Math.hypot((x-d.x)*1.15,y-d.y);if(q<.15&&q<bd){bd=q;hit=i}});if(hit>=0)intervene(hit)}
  toyCanvas.addEventListener("pointerup",e=>{e.preventDefault();toyTap(e)});
  function arrive(p){
    const d=depts[p.to];d.q+=p.power;d.heat+=.35*p.power;scars.push({a:p.from,b:p.to,type:p.type});if(scars.length>120)scars.shift();
    if(p.type==="promise"){send(p.to,2,"ticket",p.power);cash+=2}
    else if(p.type==="roadmap"||p.type==="ticket"){send(p.to,5,"ship",p.power)}
    else if(p.type==="ship"){software+=p.power;cash-=1.5*p.power;send(5,3,"release",p.power);if((Math.floor(software)+p.to)%4===0)send(5,4,"fire",1.5)}
    else if(p.type==="release"){cash+=3*p.power;if(p.power>1.5)send(3,0,"want",1)}
    else if(p.type==="fire"){cash-=3*p.power;send(4,2,"meeting",1);send(4,8,"meeting",1)}
    else if(p.type==="meeting"){cash-=.7*p.power;d.q+=.4}
    else if(p.type==="strategy"){send(p.to,4,"meeting",1)}
    else if(p.type==="person"){people=Math.max(1,people-1);send(4,6,"meeting",1)}
    else if(p.type==="budget"){cash+=p.power}
    else if(p.type==="want"){send(p.to,1,"promise",1)}
    else if(p.type==="onboard"){cash-=1}
  }
  function toyStep(dt){
    if(!alive)return;clock+=dt;nextSpawn-=dt;if(nextSpawn<=0){spawn();nextSpawn=.9+(Math.sin(clock*2.1)+1)*.45}
    for(let i=packets.length-1;i>=0;i--){const p=packets[i];p.t+=dt*(.55+Math.min(1,p.power*.12));if(p.t>=1){arrive(p);packets.splice(i,1)}}
    for(const d of depts){d.heat=Math.max(0,d.heat-dt*.18);d.q=Math.max(0,d.q-dt*.025)}
    cash-=dt*(.14+people*.0025+depts[4].q*.003);
    if(cash<=0){alive=false;ending="BANKRUPT";cash=0}
    else if(depts[4].q>28){alive=false;ending="MEETING SINGULARITY"}
    else if(software>=28&&cash>45){alive=false;ending="ACQUIRED"}
    else if(people<=2){alive=false;ending="EVERYONE QUIT"}
    else if(software>=45){alive=false;ending="IPO, SOMEHOW"}
  }
  function rr(x,y,w,h,r){toy.beginPath();toy.roundRect(x,y,w,h,r)}
  function toyDraw(){
    toyResize();toy.fillStyle="#121416";toy.fillRect(0,0,toyW,toyH);
    toy.strokeStyle="rgba(230,224,210,.05)";toy.lineWidth=toyD;for(const r of routes){const a=depts[r[0]],b=depts[r[1]];toy.beginPath();toy.moveTo(a.x*toyW,a.y*toyH);toy.lineTo(b.x*toyW,b.y*toyH);toy.stroke()}
    for(const s of scars){const a=depts[s.a],b=depts[s.b];toy.strokeStyle="rgba(190,169,126,.045)";toy.lineWidth=2*toyD;toy.beginPath();toy.moveTo(a.x*toyW,a.y*toyH);toy.lineTo(b.x*toyW,b.y*toyH);toy.stroke()}
    for(const p of packets){const a=depts[p.from],b=depts[p.to],t=Math.min(1,p.t),u=1-t,x=(a.x*u+b.x*t)*toyW,y=(a.y*u+b.y*t)*toyH;toy.fillStyle=p.type==="fire"?"#df796c":p.type==="ship"||p.type==="release"?"#8fc7a1":"#e7d8a7";toy.beginPath();toy.arc(x,y,(6+Math.min(8,p.power*2))*toyD,0,Math.PI*2);toy.fill()}
    depts.forEach((d,i)=>{const w=toyW*.25,h=toyH*.145,x=d.x*toyW-w/2,y=d.y*toyH-h/2;const hot=Math.min(1,d.heat*.35+d.q*.025);toy.fillStyle=i===4?"#51483a":hot>.6?"#5a3b38":"#30363a";rr(x,y,w,h,18*toyD);toy.fill();toy.strokeStyle="rgba(235,225,200,"+(.12+hot*.45)+")";toy.lineWidth=(2+hot*3)*toyD;toy.stroke();toy.fillStyle="#eee8da";toy.textAlign="center";toy.textBaseline="middle";toy.font="800 "+Math.max(15,toyW*.032)+"px system-ui";toy.fillText(d.n,d.x*toyW,d.y*toyH);if(d.q>1){toy.font="700 "+Math.max(12,toyW*.025)+"px system-ui";toy.fillStyle="rgba(238,232,218,.65)";toy.fillText(Math.floor(d.q),d.x*toyW,(d.y+.055)*toyH)}});
    toy.textAlign="left";toy.textBaseline="alphabetic";toy.font="700 "+Math.max(13,toyW*.027)+"px system-ui";toy.fillStyle="rgba(238,232,218,.72)";toy.fillText("$"+Math.floor(cash)+"M",toyW*.03,toyH*.055);toy.textAlign="center";toy.fillText("SOFTWARE "+Math.floor(software),toyW*.5,toyH*.055);toy.textAlign="right";toy.fillText(people+" PEOPLE",toyW*.97,toyH*.055);
    if(!alive){toy.fillStyle="rgba(12,13,14,.82)";toy.fillRect(0,0,toyW,toyH);toy.fillStyle="#f1e8d5";toy.textAlign="center";toy.textBaseline="middle";toy.font="900 "+Math.max(28,toyW*.065)+"px system-ui";toy.fillText(ending,toyW*.5,toyH*.44);toy.font="600 "+Math.max(15,toyW*.031)+"px system-ui";toy.fillStyle="rgba(241,232,213,.7)";toy.fillText("The company has reached alignment.",toyW*.5,toyH*.52)}
  }
  function toyLoop(now){const dt=Math.min(.05,(now-toyLast)/1000);toyLast=now;toyStep(dt);toyDraw();requestAnimationFrame(toyLoop)}requestAnimationFrame(toyLoop);

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