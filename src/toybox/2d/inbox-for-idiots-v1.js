// 2D TOY BOX — Inbox for Idiots v1.
// Seed experiment: one giant message, YES/LATER/NO, tap-only, visible routing, terminal inbox zero.
// Preserved from build 3e43b751 before expanding into the software-company organism.

  // 2D pressure surface: Inbox for Idiots.
  // A deliberately stupid inbox: one enormous message at a time, three enormous
  // destinations. Tap a destination; the card visibly leaves the finger and commits there.
  const toyHost=document.createElement("section");toyHost.id="repository-2d";toyHost.setAttribute("aria-label","Inbox for Idiots");
  const toyCanvas=document.createElement("canvas");toyHost.append(toyCanvas);document.body.append(toyHost);
  const toy=toyCanvas.getContext("2d");
  const inbox=[
    {who:"MOM",body:"Dinner Sunday? I need a head count.",kind:0},
    {who:"BANK",body:"Your statement is ready. Nothing exploded.",kind:2},
    {who:"LEX",body:"Can you look at this when you get a second?",kind:0},
    {who:"ROBOT",body:"Build finished. One warning wants attention.",kind:1},
    {who:"STORE",body:"You left something in your cart. Tragic.",kind:2},
    {who:"OLLIE",body:"Important question: dragon or spaceship?",kind:0},
    {who:"WORK",body:"Can you make the weird prototype do the thing?",kind:1}
  ];
  const piles=[[],[],[]],flying=[];
  let current=0,toyW=1,toyH=1,toyD=1,toyLast=performance.now(),done=false;
  function toyResize(){const r=toyCanvas.getBoundingClientRect();toyD=Math.min(2,devicePixelRatio||1);const w=Math.max(1,Math.floor(r.width*toyD)),h=Math.max(1,Math.floor(r.height*toyD));if(w!==toyCanvas.width||h!==toyCanvas.height){toyCanvas.width=w;toyCanvas.height=h}toyW=w;toyH=h}
  function zones(){return[{x:.18,y:.83,label:"YES"},{x:.50,y:.83,label:"LATER"},{x:.82,y:.83,label:"NO"}]}
  function choose(i){
    if(done||current>=inbox.length||flying.length)return;
    const z=zones()[i];flying.push({msg:inbox[current],fromX:.5,fromY:.38,toX:z.x,toY:z.y,t:0,pile:i});current++;
  }
  function toyTap(e){const r=toyCanvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;if(y<.68)return;const zs=zones();let best=0,bd=99;zs.forEach((z,i)=>{const d=Math.hypot(x-z.x,(y-z.y)*1.4);if(d<bd){bd=d;best=i}});choose(best)}
  toyCanvas.addEventListener("pointerup",e=>{e.preventDefault();toyTap(e)});
  function toyStep(dt){for(let i=flying.length-1;i>=0;i--){const f=flying[i];f.t+=dt*1.8;if(f.t>=1){piles[f.pile].push(f.msg);flying.splice(i,1);if(current>=inbox.length&&!flying.length)done=true}}}
  function roundRect(x,y,w,h,r){toy.beginPath();toy.roundRect(x,y,w,h,r)}
  function toyDraw(){
    toyResize();toy.fillStyle="#171719";toy.fillRect(0,0,toyW,toyH);
    const pad=toyW*.06,cardW=toyW*.78,cardH=Math.min(toyH*.34,toyW*.48),cx=(toyW-cardW)/2,cy=toyH*.16;
    if(!done&&current<inbox.length){const m=inbox[current];toy.fillStyle="#eee9dd";roundRect(cx,cy,cardW,cardH,18*toyD);toy.fill();toy.fillStyle="#262321";toy.font="700 "+Math.max(22,toyW*.055)+"px system-ui";toy.fillText(m.who,cx+cardW*.07,cy+cardH*.27);toy.font="500 "+Math.max(17,toyW*.039)+"px system-ui";const words=m.body.split(" ");let line="",yy=cy+cardH*.49;for(const word of words){const t=line+word+" ";if(toy.measureText(t).width>cardW*.84){toy.fillText(line,cx+cardW*.07,yy);line=word+" ";yy+=toyW*.052}else line=t}toy.fillText(line,cx+cardW*.07,yy)}
    const zs=zones(),labels=["YES","LATER","NO"];zs.forEach((z,i)=>{const w=toyW*.27,h=toyH*.16,x=z.x*toyW-w/2,y=z.y*toyH-h/2;toy.fillStyle=i===0?"#3e5b45":i===1?"#5a5038":"#5a3938";roundRect(x,y,w,h,18*toyD);toy.fill();toy.fillStyle="#f2ead9";toy.textAlign="center";toy.textBaseline="middle";toy.font="800 "+Math.max(18,toyW*.043)+"px system-ui";toy.fillText(labels[i],z.x*toyW,z.y*toyH);toy.textAlign="start";toy.textBaseline="alphabetic";if(piles[i].length){toy.fillStyle="rgba(242,234,217,.7)";toy.font="700 "+Math.max(14,toyW*.032)+"px system-ui";toy.textAlign="center";toy.fillText(String(piles[i].length),z.x*toyW,y-10*toyD);toy.textAlign="start"}});
    for(const f of flying){const t=Math.min(1,f.t),ease=1-Math.pow(1-t,3),x=(f.fromX+(f.toX-f.fromX)*ease)*toyW,y=(f.fromY+(f.toY-f.fromY)*ease)*toyH,s=(1-ease*.72);toy.save();toy.translate(x,y);toy.scale(s,s);toy.fillStyle="#eee9dd";roundRect(-toyW*.22,-toyH*.07,toyW*.44,toyH*.14,14*toyD);toy.fill();toy.restore()}
    if(done){toy.fillStyle="#eee9dd";toy.textAlign="center";toy.font="800 "+Math.max(28,toyW*.07)+"px system-ui";toy.fillText("INBOX ZERO",toyW*.5,toyH*.38);toy.font="500 "+Math.max(16,toyW*.035)+"px system-ui";toy.fillStyle="rgba(238,233,221,.7)";toy.fillText("You have successfully had three thoughts.",toyW*.5,toyH*.46);toy.textAlign="start"}
  }
  function toyLoop(now){const dt=Math.min(.05,(now-toyLast)/1000);toyLast=now;toyStep(dt);toyDraw();requestAnimationFrame(toyLoop)}requestAnimationFrame(toyLoop);
