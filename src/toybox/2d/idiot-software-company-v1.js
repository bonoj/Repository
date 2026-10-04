// 2D TOY BOX — Idiot Software Company v1.
// Experienced findings: HR-only -> bankruptcy; EXEC-only -> alignment; FINANCE can sustain indefinitely; ENG-only -> acquired.
// Preserved from build e88925ec. Not loaded by Betwixt.

  // 2D pressure surface: Idiot Software Company.
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
