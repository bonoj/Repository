// 2D TOY BOX — Far Bell, retired after successful play loop.
// Large tap targets; consequence travels away from the finger; repeated play leaves marks.
// Terminal-state direction: accumulated crossings converge rather than remain endless.
// Preserved from build 7dc5fa4b. Not loaded by Betwixt.

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
  const flights=[],echoes=[],marks=[];
  let toyW=1,toyH=1,toyD=1,toyLast=performance.now(),toyTurn=0;
  function toyResize(){const r=toyCanvas.getBoundingClientRect();toyD=Math.min(2,devicePixelRatio||1);const w=Math.max(1,Math.floor(r.width*toyD)),h=Math.max(1,Math.floor(r.height*toyD));if(w!==toyCanvas.width||h!==toyCanvas.height){toyCanvas.width=w;toyCanvas.height=h}toyW=w;toyH=h}
  function bellPos(b){return{x:b.x*toyW,y:b.y*toyH,r:b.r*Math.min(toyW,toyH)}}
  function strike(index){
    const source=bells[index];
    // Each bell has a hidden recipient; repeated strikes mutate that relationship.
    const hop=1+((index+toyTurn)% (bells.length-1));
    const targetIndex=(index+hop)%bells.length,target=bells[targetIndex];
    flights.push({from:index,to:targetIndex,t:0,curve:(toyTurn%2?1:-1)*(.12+.04*index)});
    source.phase+=.7;source.tone++;toyTurn++;
    // Consequence is delayed until the travelling signal arrives elsewhere.
  }
  function toyTap(e){const r=toyCanvas.getBoundingClientRect(),x=(e.clientX-r.left)*toyD,y=(e.clientY-r.top)*toyD;let hit=-1,bd=Infinity;bells.forEach((b,i)=>{const p=bellPos(b),d=Math.hypot(x-p.x,y-p.y);if(d<p.r*1.35&&d<bd){hit=i;bd=d}});if(hit>=0)strike(hit)}
  toyCanvas.addEventListener("pointerup",e=>{e.preventDefault();toyTap(e)});
  function toyStep(dt){
    for(let i=flights.length-1;i>=0;i--){const f=flights[i];f.t+=dt*.72;if(f.t>=1){const b=bells[f.to];b.phase+=2.4;b.r=Math.min(.22,b.r+.006);b.tone++;marks.push({from:f.from,to:f.to,curve:f.curve});if(marks.length>80)marks.shift();echoes.push({at:f.to,t:0});flights.splice(i,1)}}
    for(let i=echoes.length-1;i>=0;i--){echoes[i].t+=dt;if(echoes[i].t>1.35)echoes.splice(i,1)}
    for(const b of bells)b.r+=(b.r>.16?-.0035:0)*dt;
  }
  function toyDraw(){
    toyResize();toy.clearRect(0,0,toyW,toyH);
    const bg=toy.createLinearGradient(0,0,0,toyH);bg.addColorStop(0,"#121923");bg.addColorStop(1,"#17130f");toy.fillStyle=bg;toy.fillRect(0,0,toyW,toyH);
    // Sparse horizon makes the field feel like a place without introducing tiny interactables.
    toy.strokeStyle="rgba(220,210,190,.10)";toy.lineWidth=toyD;
    toy.beginPath();toy.moveTo(0,toyH*.56);toy.bezierCurveTo(toyW*.22,toyH*.49,toyW*.68,toyH*.64,toyW,toyH*.52);toy.stroke();
    marks.forEach(m=>{const a=bellPos(bells[m.from]),b=bellPos(bells[m.to]);toy.strokeStyle="rgba(184,153,103,.16)";toy.lineWidth=2*toyD;toy.beginPath();toy.moveTo(a.x,a.y);toy.lineTo(b.x,b.y);toy.stroke()});
    for(const f of flights){const a=bellPos(bells[f.from]),b=bellPos(bells[f.to]),t=Math.min(1,f.t),mx=(a.x+b.x)/2+f.curve*toyW,my=(a.y+b.y)/2-f.curve*toyH;const u=1-t,x=(u*u*a.x+2*u*t*mx+t*t*b.x),y=(u*u*a.y+2*u*t*my+t*t*b.y);toy.strokeStyle="rgba(238,220,174,.28)";toy.lineWidth=3*toyD;toy.beginPath();toy.moveTo(a.x,a.y);toy.quadraticCurveTo(mx,my,x,y);toy.stroke();toy.fillStyle="rgba(250,235,188,.95)";toy.beginPath();toy.arc(x,y,7*toyD,0,Math.PI*2);toy.fill()}
    for(const e of echoes){const p=bellPos(bells[e.at]),rr=p.r*(1+e.t*1.8);toy.strokeStyle="rgba(237,218,176,"+(Math.max(0,1-e.t/1.35)*.55)+")";toy.lineWidth=3*toyD;toy.beginPath();toy.arc(p.x,p.y,rr,0,Math.PI*2);toy.stroke()}
    bells.forEach((b,i)=>{const p=bellPos(b),pulse=1+Math.sin(performance.now()*.0014+b.phase)*.025;toy.save();toy.translate(p.x,p.y);toy.scale(pulse,pulse);const g=toy.createRadialGradient(-p.r*.22,-p.r*.28,p.r*.08,0,0,p.r);g.addColorStop(0,i===4?"#ddd1aa":"#c7b786");g.addColorStop(.68,i===4?"#77684b":"#665c45");g.addColorStop(1,"#28251f");toy.fillStyle=g;toy.beginPath();toy.arc(0,0,p.r,0,Math.PI*2);toy.fill();toy.strokeStyle="rgba(246,230,190,.34)";toy.lineWidth=3*toyD;toy.stroke();toy.fillStyle="rgba(20,19,18,.72)";toy.beginPath();toy.arc(0,p.r*.18,p.r*.20,0,Math.PI*2);toy.fill();toy.restore()});
  }
  function toyLoop(now){const dt=Math.min(.05,(now-toyLast)/1000);toyLast=now;toyStep(dt);toyDraw();requestAnimationFrame(toyLoop)}
  requestAnimationFrame(toyLoop);
