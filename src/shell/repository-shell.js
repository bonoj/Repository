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
    #repository-civilization{position:fixed;z-index:70;left:max(.6rem,env(safe-area-inset-left));right:max(.6rem,env(safe-area-inset-right));top:3.55rem;bottom:4rem;border:1px solid #77736b45;border-radius:.55rem;overflow:hidden;background:#171b18;touch-action:none}
    #repository-civilization canvas{display:block;width:100%;height:100%;touch-action:none}
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

  // Disposable 2D civilization pressure surface. It deliberately occupies only
  // the aperture between immutable build status and the spell tray. One finger
  // is the whole interface: tap dents the world; drag carves a wet scar.
  const civHost=document.createElement("section");
  civHost.id="repository-civilization";
  civHost.setAttribute("aria-label","Living civilization perturbation surface");
  const civCanvas=document.createElement("canvas");
  civHost.append(civCanvas);
  document.body.append(civHost);
  const civ=civCanvas.getContext("2d",{alpha:false});
  const CIV_W=96,CIV_H=96,CIV_N=CIV_W*CIV_H;
  const elevation=new Float32Array(CIV_N),wet=new Float32Array(CIV_N),fertility=new Float32Array(CIV_N);
  const people=[],towns=[],ripples=[];
  let civImage=null,civLast=performance.now(),civAcc=0,civPointer=null,civMoved=false;

  function civHash(x,y){let n=(x*374761393+y*668265263+741*69069)|0;n=(n^(n>>>13))*1274126177;return ((n^(n>>>16))>>>0)/4294967295}
  function civIdx(x,y){return y*CIV_W+x}
  for(let y=0;y<CIV_H;y++)for(let x=0;x<CIV_W;x++){
    const i=civIdx(x,y),nx=x/CIV_W-.5,ny=y/CIV_H-.5;
    const island=.62-Math.sqrt(nx*nx+ny*ny)*.92;
    const noise=(civHash(x>>2,y>>2)-.5)*.22+(civHash(x,y)-.5)*.055;
    elevation[i]=island+noise;
    wet[i]=Math.max(0,.105-elevation[i]);
    fertility[i]=Math.max(0,Math.min(1,.28+wet[i]*2.4+(civHash(x+31,y+17)-.5)*.32));
  }
  function landAt(x,y){return x>=0&&y>=0&&x<CIV_W&&y<CIV_H&&elevation[civIdx(x,y)]>0}
  for(let i=0;i<58;i++){
    let x=8+Math.floor(civHash(i,11)*(CIV_W-16)),y=8+Math.floor(civHash(i,29)*(CIV_H-16)),guard=0;
    while(!landAt(x,y)&&guard++<80){x=5+Math.floor(civHash(i+guard,41)*(CIV_W-10));y=5+Math.floor(civHash(i+guard,67)*(CIV_H-10))}
    people.push({x:x+.5,y:y+.5,vx:0,vy:0,age:civHash(i,91)*20,home:-1,rest:0,trail:[]});
  }
  function perturb(px,py,drag=false){
    const r=drag?2.2:6.2,depth=drag?.055:.16;
    for(let y=Math.max(0,Math.floor(py-r));y<=Math.min(CIV_H-1,Math.ceil(py+r));y++)for(let x=Math.max(0,Math.floor(px-r));x<=Math.min(CIV_W-1,Math.ceil(px+r));x++){
      const d=Math.hypot(x+.5-px,y+.5-py);if(d>r)continue;
      const k=(1-d/r);const i=civIdx(x,y);elevation[i]-=depth*k*k;wet[i]=Math.max(wet[i],Math.max(0,-elevation[i])+.05*k);fertility[i]=Math.min(1,fertility[i]+.12*k);
    }
    const force=drag?.7:2.8;
    for(const p of people){const dx=p.x-px,dy=p.y-py,d=Math.hypot(dx,dy)||1;if(d<r*2.2){const k=(1-d/(r*2.2))*force;p.vx+=dx/d*k;p.vy+=dy/d*k}}
    ripples.push({x:px,y:py,r:.2,max:r*2.3,life:1});
  }
  function civStep(dt){
    for(let i=ripples.length-1;i>=0;i--){const r=ripples[i];r.life-=dt*1.3;r.r+=(r.max-r.r)*dt*5;if(r.life<=0)ripples.splice(i,1)}
    // A person alternates between belonging somewhere and making a purposeful trip.
    // Town attraction is therefore social geography, not a force field.
    for(let n=0;n<people.length;n++){
      const p=people[n];p.age+=dt;
      if(p.home<0&&towns.length){
        let best=-1,bd=1e9;
        for(let k=0;k<towns.length;k++){const t=towns[k],d=Math.hypot(t.x-p.x,t.y-p.y);if(d<bd&&d<18){bd=d;best=k}}
        if(best>=0)p.home=best;
      }
      const home=p.home>=0?towns[p.home]:null;
      if(home&&home.pop<.12)p.home=-1;
      p.rest=Math.max(0,p.rest-dt);
      const cx=Math.max(1,Math.min(CIV_W-2,Math.floor(p.x))),cy=Math.max(1,Math.min(CIV_H-2,Math.floor(p.y)));
      let bestX=cx,bestY=cy,best=-99;
      for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){
        const x=cx+ox,y=cy+oy,i=civIdx(x,y);if(elevation[i]<=0)continue;
        let score=fertility[i]*.95-wet[i]*.32;
        if(home){
          const nowD=Math.hypot(p.x-home.x,p.y-home.y),nextD=Math.hypot(x+.5-home.x,y+.5-home.y);
          // Most motion is an excursion with a readable return tendency.
          score+=(nowD>4? (nowD-nextD)*1.4 : (nextD-nowD)*.16);
        }
        score+=civHash(n+Math.floor(p.age*.18),i)*.12;
        if(score>best){best=score;bestX=x;bestY=y}
      }
      const dx=bestX+.5-p.x,dy=bestY+.5-p.y;
      if(p.rest<=0){p.vx+=dx*dt*.34;p.vy+=dy*dt*.34}
      const sp=Math.hypot(p.vx,p.vy);if(sp>.46){p.vx*=.46/sp;p.vy*=.46/sp}
      const nx=p.x+p.vx*dt*4.2,ny=p.y+p.vy*dt*4.2;
      if(landAt(Math.floor(nx),Math.floor(ny))){p.x=nx;p.y=ny}else{p.vx*=-.5;p.vy*=-.5;p.rest=.5}
      p.vx*=Math.pow(.66,dt);p.vy*=Math.pow(.66,dt);
      if(home&&Math.hypot(p.x-home.x,p.y-home.y)<2.2&&civHash(n,Math.floor(p.age))>.992)p.rest=.8+civHash(n+7,Math.floor(p.age))*1.8;
      if(!p.trail)p.trail=[];
      if(!p.trail.length||Math.hypot(p.x-p.trail[p.trail.length-1].x,p.y-p.trail[p.trail.length-1].y)>.7){p.trail.push({x:p.x,y:p.y});if(p.trail.length>8)p.trail.shift()}
    }
    // Settlements remain emergent, but inhabitants who witness one can belong to it.
    if(towns.length<10&&Math.floor(civAcc)%17===0){
      for(const p of people){if(towns.some(t=>Math.hypot(t.x-p.x,t.y-p.y)<8))continue;const i=civIdx(Math.floor(p.x),Math.floor(p.y));if(fertility[i]>.53&&civHash(Math.floor(civAcc),Math.floor(p.x*13+p.y))>.985){towns.push({x:p.x,y:p.y,pop:1});p.home=towns.length-1;break}}
    }
    for(const t of towns){let near=0;for(const p of people)if(Math.hypot(p.x-t.x,p.y-t.y)<6)near++;t.pop+=(near-t.pop)*dt*.08;if(!landAt(Math.floor(t.x),Math.floor(t.y)))t.pop*=Math.pow(.25,dt)}
  }
  function civResize(){
    const r=civCanvas.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);
    const w=Math.max(1,Math.floor(r.width*d)),h=Math.max(1,Math.floor(r.height*d));
    if(civCanvas.width!==w||civCanvas.height!==h){civCanvas.width=w;civCanvas.height=h;return true}return false;
  }
  function civDraw(){
    civResize();const w=civCanvas.width,h=civCanvas.height;
    if(!civImage||civImage.width!==CIV_W||civImage.height!==CIV_H)civImage=civ.createImageData(CIV_W,CIV_H);
    const d=civImage.data;
    for(let i=0;i<CIV_N;i++){const e=elevation[i],q=i*4;if(e<=0){const z=Math.min(1,.2+(-e+wet[i])*2.2);d[q]=20;d[q+1]=55+z*35;d[q+2]=68+z*55}else{const f=fertility[i];d[q]=54+e*48;d[q+1]=66+f*72+e*18;d[q+2]=43+f*24}d[q+3]=255}
    const off=document.createElement("canvas");off.width=CIV_W;off.height=CIV_H;off.getContext("2d").putImageData(civImage,0,0);
    civ.imageSmoothingEnabled=false;civ.drawImage(off,0,0,w,h);
    const sx=w/CIV_W,sy=h/CIV_H;
    civ.lineWidth=Math.max(1,Math.min(sx,sy)*.22);
    for(const t of towns){if(t.pop<.12)continue;civ.fillStyle="rgba(236,205,139,.9)";const s=Math.max(2,Math.min(7,2+t.pop*.32))*Math.min(sx,sy);civ.fillRect(t.x*sx-s/2,t.y*sy-s/2,s,s)}
    // Movement leaves a faint human-scale path; bodies have facing, not orbital-dot symmetry.
    civ.lineWidth=Math.max(1,Math.min(sx,sy)*.16);
    for(const p of people){
      if(p.trail?.length>1){civ.strokeStyle="rgba(226,211,169,.18)";civ.beginPath();civ.moveTo(p.trail[0].x*sx,p.trail[0].y*sy);for(let i=1;i<p.trail.length;i++)civ.lineTo(p.trail[i].x*sx,p.trail[i].y*sy);civ.stroke()}
      const a=Math.atan2(p.vy,p.vx),s=Math.max(1.6,Math.min(sx,sy)*.52);
      civ.save();civ.translate(p.x*sx,p.y*sy);civ.rotate(a+Math.PI/2);
      civ.fillStyle=p.home>=0?"rgba(247,226,178,.96)":"rgba(220,215,194,.9)";
      civ.beginPath();civ.moveTo(0,-s);civ.lineTo(s*.48,s*.62);civ.lineTo(0,s*.38);civ.lineTo(-s*.48,s*.62);civ.closePath();civ.fill();civ.restore();
    }
    for(const r of ripples){civ.strokeStyle="rgba(230,235,220,"+Math.max(0,r.life*.7)+")";civ.beginPath();civ.ellipse(r.x*sx,r.y*sy,r.r*sx,r.r*sy,0,0,Math.PI*2);civ.stroke()}
  }
  function civLoop(now){
    const dt=Math.min(.05,(now-civLast)/1000);civLast=now;civAcc+=dt;civStep(dt);civDraw();requestAnimationFrame(civLoop);
  }
  function civPoint(e){const r=civCanvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*CIV_W,y:(e.clientY-r.top)/r.height*CIV_H}}
  civCanvas.addEventListener("pointerdown",e=>{e.preventDefault();civCanvas.setPointerCapture(e.pointerId);civPointer=civPoint(e);civMoved=false});
  civCanvas.addEventListener("pointermove",e=>{if(!civPointer||!civCanvas.hasPointerCapture(e.pointerId))return;e.preventDefault();const p=civPoint(e);if(Math.hypot(p.x-civPointer.x,p.y-civPointer.y)>.9){civMoved=true;perturb(p.x,p.y,true);civPointer=p}});
  civCanvas.addEventListener("pointerup",e=>{if(!civPointer)return;e.preventDefault();const p=civPoint(e);if(!civMoved)perturb(p.x,p.y,false);civPointer=null});
  civCanvas.addEventListener("pointercancel",()=>{civPointer=null});
  requestAnimationFrame(civLoop);

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