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
    #mark{display:none!important}
    #repository-status{position:fixed;z-index:1000;left:max(.7rem,env(safe-area-inset-left));right:max(.7rem,env(safe-area-inset-right));top:max(.7rem,env(safe-area-inset-top));width:max-content;max-width:calc(100% - max(.7rem,env(safe-area-inset-left)) - max(.7rem,env(safe-area-inset-right)));box-sizing:border-box;padding:.45rem .6rem;border:1px solid #77736b40;border-radius:.45rem;background:#e7e2d8df;color:#4d4d49;font:600 11px/1.25 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.04em;pointer-events:none;box-shadow:0 3px 12px #5a514314;backdrop-filter:blur(4px)}
    #repository-devtools{position:fixed;z-index:1000;inset:auto max(.6rem,env(safe-area-inset-right)) max(.6rem,env(safe-area-inset-bottom)) max(.6rem,env(safe-area-inset-left));box-sizing:border-box;display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;pointer-events:none}
    #repository-devtools .spell-tray{display:flex;flex-wrap:wrap;align-content:flex-end;gap:.28rem;max-width:calc(4 * 2.65rem + 3 * .28rem);pointer-events:auto}
    #repository-devtools .temporary{justify-content:flex-start}
    #repository-devtools .resident{justify-content:flex-start;flex-direction:row-reverse;margin-left:auto;flex:0 0 auto}
    #repository-devtools button{box-sizing:border-box;width:2.65rem;height:2.65rem;min-height:0;padding:0;border:1px solid #77736b55;border-radius:.45rem;background:#d9d6cf;color:#343638;font:1.25rem/1 system-ui,-apple-system,Segoe UI Emoji,sans-serif;touch-action:manipulation}
    #repository-devtools button.active{outline:1px solid #555;background:#cbc7be}
    #repository-devtools button.wide{grid-column:span 2;width:auto}
    #repository-devtools button.tall{grid-row:span 2;height:auto}
    #repository-devtools button.large{grid-column:span 2;grid-row:span 2;width:auto;height:auto;font-size:1.6rem}
    #repository-crucible{position:fixed;z-index:800;left:50%;top:50%;width:min(88vw,52rem);height:min(76dvh,44rem);transform:translate(-50%,-50%);border:1px solid #77736b66;border-radius:.7rem;background:#342820;box-shadow:0 1.2rem 4rem #0007;overflow:hidden}
    #repository-crucible iframe{display:block;width:100%;height:100%;border:0;background:#342820}
    #repository-2d{position:fixed;z-index:100;left:max(.6rem,env(safe-area-inset-left));right:max(.6rem,env(safe-area-inset-right));top:3.55rem;bottom:4rem;border:1px solid #77736b45;border-radius:.55rem;overflow:hidden;background:#11151c;touch-action:manipulation}
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

  // 2D pressure surface: semantic painted world.
  const toyHost=document.createElement("section");toyHost.id="repository-2d";toyHost.setAttribute("aria-label","Painted World");
  const toyCanvas=document.createElement("canvas");toyHost.append(toyCanvas);document.body.append(toyHost);const p=toyCanvas.getContext("2d");
  let W=1,H=1,D=1,last=performance.now(),time=0,place=0,from=0,travel=1;
  const places=[
    {name:"OBSERVATORY",x:.53,y:.28,z:0,sky:0},
    {name:"SUNSET CITADEL",x:.20,y:.23,z:1,sky:1},
    {name:"FALLS",x:.20,y:.50,z:2,sky:0},
    {name:"UNDERCITY",x:.34,y:.72,z:3,sky:0},
    {name:"CRYSTAL GATE",x:.53,y:.60,z:4,sky:0},
    {name:"GREAT CASCADE",x:.68,y:.62,z:5,sky:0},
    {name:"BASIN",x:.61,y:.84,z:6,sky:0},
    {name:"EAST BRIDGE",x:.82,y:.49,z:7,sky:0},
    {name:"STAR CASTLE",x:.80,y:.27,z:8,sky:2}
  ];
  const edges=[[0,1],[0,2],[0,4],[0,7],[2,3],[3,4],[3,6],[4,5],[4,6],[5,6],[5,7],[7,8]];
  function resize(){const r=toyCanvas.getBoundingClientRect();D=Math.min(2,devicePixelRatio||1);const w=Math.max(1,Math.floor(r.width*D)),h=Math.max(1,Math.floor(r.height*D));if(w!==toyCanvas.width||h!==toyCanvas.height){toyCanvas.width=w;toyCanvas.height=h}W=w;H=h}
  const mix=(a,b,t)=>a+(b-a)*t, clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  function proj(q){const focus=places[place],old=places[from],t=travel*travel*(3-2*travel),fx=mix(old.x,focus.x,t),fy=mix(old.y,focus.y,t);const zoom=mix(1.0,1.55,clamp(focus.z/8*.7+.15));return {x:W*.5+(q.x-fx)*W*zoom,y:H*.48+(q.y-fy)*H*zoom,s:zoom}}
  function poly(points,fill){p.beginPath();points.forEach((q,i)=>{const v=proj(q);i?p.lineTo(v.x,v.y):p.moveTo(v.x,v.y)});p.closePath();p.fillStyle=fill;p.fill()}
  function line(a,b,w,stroke){const A=proj(a),B=proj(b);p.beginPath();p.moveTo(A.x,A.y);p.lineTo(B.x,B.y);p.lineWidth=w*D*A.s;p.strokeStyle=stroke;p.stroke()}
  function glow(x,y,r,c){const v=proj({x,y}),g=p.createRadialGradient(v.x,v.y,0,v.x,v.y,r*D*v.s);g.addColorStop(0,c);g.addColorStop(1,"rgba(0,0,0,0)");p.fillStyle=g;p.beginPath();p.arc(v.x,v.y,r*D*v.s,0,Math.PI*2);p.fill()}
  function waterfall(x,y0,y1,w){const A=proj({x,y:y0}),B=proj({x,y:y1}),ww=w*W*A.s;const g=p.createLinearGradient(A.x-ww,A.y,A.x+ww,A.y);g.addColorStop(0,"rgba(60,145,210,.15)");g.addColorStop(.45,"rgba(185,235,255,.92)");g.addColorStop(.62,"rgba(80,185,245,.75)");g.addColorStop(1,"rgba(40,90,160,.12)");p.fillStyle=g;p.fillRect(A.x-ww/2,A.y,ww,B.y-A.y);for(let i=0;i<4;i++){const xx=A.x+Math.sin(time*(.7+i*.11)+i*4)*ww*.28;p.strokeStyle="rgba(230,250,255,.3)";p.lineWidth=D;p.beginPath();p.moveTo(xx,A.y);p.lineTo(xx+Math.sin(time+i)*ww*.12,B.y);p.stroke()}glow(x,y1,18,"rgba(90,205,255,.42)")}
  function arch(x,y,w,h){const v=proj({x,y}),s=v.s;p.fillStyle="#171719";p.fillRect(v.x-w*W*s/2,v.y-h*H*s,w*W*s,h*H*s);p.globalCompositeOperation="destination-out";p.beginPath();p.ellipse(v.x,v.y-h*H*s*.08,w*W*s*.27,h*H*s*.55,0,Math.PI,0);p.fill();p.globalCompositeOperation="source-over"}
  function drawSky(){const f=places[place],g=p.createLinearGradient(0,0,W,H*.55);if(f.sky===1){g.addColorStop(0,"#4b2550");g.addColorStop(.55,"#e56b4d");g.addColorStop(1,"#ffb04f")}else{g.addColorStop(0,"#11152f");g.addColorStop(.55,"#283366");g.addColorStop(1,"#b15365")}p.fillStyle=g;p.fillRect(0,0,W,H);for(let i=0;i<90;i++){const x=((i*83)%997)/997*W,y=((i*47)%431)/431*H*.46,r=(i%5?1:1.8)*D;p.fillStyle="rgba(220,235,255,"+(.25+(i%7)/12)+")";p.fillRect(x,y,r,r)}const mx=W*.74,my=H*.13,mr=W*.045;p.fillStyle="#d9b8a1";p.beginPath();p.arc(mx,my,mr,0,Math.PI*2);p.fill();p.strokeStyle="rgba(255,196,132,.8)";p.lineWidth=2*D;p.beginPath();p.ellipse(W*.87,H*.18,W*.075,H*.015,-.08,0,Math.PI*2);p.stroke()}
  function world(){drawSky();
    poly([{x:-.1,y:.55},{x:.12,y:.36},{x:.24,y:.39},{x:.30,y:.58},{x:.45,y:.48},{x:.58,y:.50},{x:.70,y:.41},{x:.88,y:.34},{x:1.1,y:.48},{x:1.1,y:1.1},{x:-.1,y:1.1}],"#151a22");
    poly([{x:.05,y:.55},{x:.19,y:.46},{x:.31,y:.53},{x:.42,y:.48},{x:.51,y:.52},{x:.58,y:.46},{x:.68,y:.52},{x:.74,y:.47},{x:.90,y:.53},{x:.92,y:.70},{x:.70,y:.67},{x:.60,y:.75},{x:.39,y:.68},{x:.20,y:.72},{x:.02,y:.66}],"#252125");
    edges.forEach(e=>line(places[e[0]],places[e[1]],.004,"rgba(118,88,65,.7)"));
    for(let i=0;i<7;i++)arch(.18+i*.105,.56+Math.sin(i)*.018,.075,.10);
    waterfall(.17,.40,.55,.035);waterfall(.26,.48,.61,.022);waterfall(.61,.43,.76,.055);waterfall(.70,.50,.72,.025);waterfall(.38,.67,.79,.025);
    const basin=proj({x:.58,y:.82});const bg=p.createRadialGradient(basin.x,basin.y,0,basin.x,basin.y,W*.25);bg.addColorStop(0,"rgba(30,175,220,.75)");bg.addColorStop(1,"rgba(8,47,75,.1)");p.fillStyle=bg;p.beginPath();p.ellipse(basin.x,basin.y,W*.27*basin.s,H*.055*basin.s,0,0,Math.PI*2);p.fill();
    const o=proj({x:.52,y:.29}),ow=W*.16*o.s,oh=H*.15*o.s;p.fillStyle="#261d1c";p.fillRect(o.x-ow*.55,o.y,ow*1.1,oh*.75);p.strokeStyle="#b4875e";p.lineWidth=2*D;o.s;p.beginPath();p.ellipse(o.x,o.y,ow*.55,oh*.65,0,Math.PI,0);p.stroke();for(let i=-4;i<=4;i++){p.beginPath();p.moveTo(o.x+i*ow*.11,o.y);p.lineTo(o.x+i*ow*.08,o.y-oh*.60);p.stroke()}glow(.52,.31,30,"rgba(255,156,62,.32)");
    const c=proj({x:.20,y:.25});p.fillStyle="#17161d";for(let i=-4;i<=4;i++){const x=c.x+i*W*.012*c.s,h=H*(.07+((i*i+3)%5)*.014)*c.s;p.fillRect(x-W*.008*c.s,c.y-h,W*.016*c.s,h);p.beginPath();p.moveTo(x-W*.01*c.s,c.y-h);p.lineTo(x,c.y-h-H*.035*c.s);p.lineTo(x+W*.01*c.s,c.y-h);p.fill()}glow(.20,.27,22,"rgba(255,130,52,.42)");
    for(let i=0;i<28;i++){const x=.12+((i*37)%79)/100,y=.52+((i*23)%37)/100;glow(x,y,3+(i%3),"rgba(255,151,55,.72)")}
    for(let i=0;i<4;i++){const v=proj({x:.32+i*.09,y:.70+(i%2)*.035});p.strokeStyle="#7c5335";p.lineWidth=5*D*v.s;p.beginPath();p.arc(v.x,v.y,18*D*v.s,0,Math.PI*2);p.stroke();for(let k=0;k<8;k++){p.beginPath();p.moveTo(v.x,v.y);p.lineTo(v.x+Math.cos(k*Math.PI/4)*18*D*v.s,v.y+Math.sin(k*Math.PI/4)*18*D*v.s);p.stroke()}}
  }
  function labels(){const f=places[place];places.forEach((q,i)=>{if(i===place)return;const v=proj(q);if(v.x<20||v.x>W-20||v.y<30||v.y>H-35)return;const d=Math.hypot(q.x-f.x,q.y-f.y);if(d>.48)return;p.font="700 "+Math.max(10,W*.017)+"px system-ui";const tw=p.measureText(q.name).width+24*D;p.fillStyle="rgba(10,13,20,.76)";p.beginPath();p.roundRect(v.x-tw/2,v.y-14*D,tw,28*D,14*D);p.fill();p.strokeStyle="rgba(230,187,111,.55)";p.lineWidth=D;p.stroke();p.fillStyle="#f2dfb7";p.textAlign="center";p.textBaseline="middle";p.fillText(q.name,v.x,v.y)});
    p.fillStyle="rgba(7,9,14,.76)";p.fillRect(0,0,W,58*D);p.fillStyle="#f1d59b";p.textAlign="left";p.textBaseline="middle";p.font="800 "+Math.max(14,W*.028)+"px system-ui";p.fillText(f.name,20*D,28*D);p.fillStyle="#c4c8cf";p.font="500 "+Math.max(10,W*.015)+"px system-ui";p.fillText("tap a named place to travel",20*D,48*D)}
  function tap(e){const r=toyCanvas.getBoundingClientRect(),x=(e.clientX-r.left)*D,y=(e.clientY-r.top)*D;let best=-1,bd=1e9;places.forEach((q,i)=>{if(i===place)return;const v=proj(q),d=Math.hypot(x-v.x,y-v.y);if(d<bd){bd=d;best=i}});if(best>=0&&bd<Math.max(42*D,W*.08)){from=place;place=best;travel=0}}
  toyCanvas.addEventListener("pointerup",e=>{e.preventDefault();tap(e)});
  function loop(now){resize();const dt=Math.min(.05,(now-last)/1000);last=now;time+=dt;travel=Math.min(1,travel+dt*.72);world();labels();requestAnimationFrame(loop)}requestAnimationFrame(loop);

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