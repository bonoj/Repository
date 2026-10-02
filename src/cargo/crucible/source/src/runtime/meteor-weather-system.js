export function createMeteorWeatherSystem({THREE,terrain,meteors,field=null,seed=0x51a7c1}){
  class RNG{constructor(s){this.s=s>>>0||1}next(){let x=this.s;x^=x<<13;x^=x>>>17;x^=x<<5;this.s=x>>>0;return this.s/4294967296}}
  const rng=new RNG(seed);let nextAt=2200+rng.next()*2800,events=0,impacts=0,lastKind=null,clockNow=0,pending=[],packetSerial=0,enabled=true,pausedAt=null;
  const powers=[.18,.28,.42,.62,.85,1.15,1.55];
  function target(){
    for(let i=0;i<8;i++){const a=rng.next()*Math.PI*2,r=Math.sqrt(rng.next())*8.0,x=Math.cos(a)*r,z=Math.sin(a)*r;if(terrain.insideMaterial(x,z))return meteors.targetAt(x,z)}
    return meteors.targetAt();
  }
  function power(){const u=rng.next();const index=u<.38?Math.floor(rng.next()*3):u<.82?2+Math.floor(rng.next()*3):4+Math.floor(rng.next()*3);return powers[Math.min(index,powers.length-1)]}
  function schedule(now){nextAt=now+1800+rng.next()*7200}
  function setEnabled(next,now=clockNow){next=!!next;if(next===enabled)return enabled;if(!next){pausedAt=now;enabled=false;return enabled}const shift=Math.max(0,now-(pausedAt??now));nextAt+=shift;for(const item of pending)item.at+=shift;pausedAt=null;enabled=true;clockNow=now;return enabled}
  function update(now){
    clockNow=now;if(!enabled)return;
    const abatement=field?.turn?.(4)??null;
    if(abatement&&now>=abatement.at){
      // Turn 4 winds autonomous weather down rather than deleting the system.
      // Already-scheduled packet members are allowed to finish; no new packets begin.
      nextAt=Math.max(nextAt,abatement.at+abatement.duration);
      if(now>=abatement.at+abatement.duration)return;
    }for(let i=pending.length-1;i>=0;i--)if(now>=pending[i].at){const item=pending.splice(i,1)[0];meteors.meteor(item.point,item.power,item.packet);impacts++}
    if(now<nextAt)return;
    events++;const u=rng.next(),base=target(),packetId=`weather-${++packetSerial}`;
    let count,spread,kind;
    if(u<.48){count=1;spread=0;kind="singlet"}
    else if(u<.86){count=2+Math.floor(rng.next()*4);spread=.45+rng.next()*1.2;kind="burst"}
    else{count=6+Math.floor(rng.next()*7);spread=1.0+rng.next()*2.0;kind="shower"}
    lastKind=kind;
    for(let i=0;i<count;i++){
      const a=rng.next()*Math.PI*2,r=spread?Math.sqrt(rng.next())*spread:0,x=base.x+Math.cos(a)*r,z=base.z+Math.sin(a)*r;
      const p=terrain.insideMaterial(x,z)?meteors.targetAt(x,z):base;
      const delay=i===0?0:80+i*(70+rng.next()*220),magnitude=power();
      const packet={id:packetId,kind,center:base.toArray(),member:i,count};
      if(delay===0){meteors.meteor(p,magnitude,packet);impacts++}else pending.push({at:now+delay,point:p.clone(),power:magnitude,packet});
    }
    schedule(now);
  }
  return{update,setEnabled,inspect:()=>{const a=field?.turn?.(4)??null,abating=!!a&&clockNow>=a.at&&clockNow<a.at+a.duration,abated=!!a&&clockNow>=a.at+a.duration;return{seed,enabled,events,impacts,packets:packetSerial,pending:pending.length,lastKind,nextInMs:abated?null:Math.max(0,Math.round(nextAt-clockNow)),abating,abated}}};
}
