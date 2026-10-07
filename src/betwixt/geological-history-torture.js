// Geological History Sampler v1
// Deterministic world genome: seed -> history parameters. No sliders, no named landforms.
export function createQuadrantHistory({noise,clamp,smooth,seed=741,mutation=0}){
  const fract=v=>v-Math.floor(v);
  const hash=(n,s=seed)=>fract(Math.sin(n*127.1+s*74.7)*43758.5453123);
  const signed=(n,s=seed)=>hash(n,s)*2-1;
  const range=(n,a,b,s=seed)=>a+(b-a)*hash(n,s);
  // mutation is a deterministic nearby walk around the base genome, not a new seed.
  const m=(n,span)=>mutation? signed(n+mutation*97,seed+mutation*31)*span*Math.min(1,Math.abs(mutation)*.22):0;
  const genome={
    seed,mutation,
    jurisdictionSoftness:range(1,5.5,12)+m(1,2),
    nw:{faultAngle:range(10,.25,1.15)+m(10,.16),faultOffset:range(11,8,25)+m(11,4),throwHeight:range(12,4.5,10)+m(12,1.6),tiltAngle:range(13,-.8,.15)+m(13,.2),tiltMagnitude:range(14,.08,.22)+m(14,.035),erosion:range(15,3.2,6.2)+m(15,.8)},
    ne:{faultAngle:range(20,-1.4,-.45)+m(20,.18),faultOffset:range(21,-16,3)+m(21,4),throwHeight:range(22,2.2,5.8)+m(22,1),subsidence:range(23,.45,.95)+m(23,.12),depositX:range(24,16,38)+m(24,5),depositZ:range(25,15,40)+m(25,5),depositAmount:range(26,3.5,8)+m(26,1.2),incisePhase:range(27,0,Math.PI*2)+m(27,.5),inciseWidth:range(28,3.2,6.2)+m(28,.7),inciseDepth:range(29,4,8.5)+m(29,1.2)},
    sw:{foldAngle:range(30,-.15,.75)+m(30,.2),wavelength:range(31,11,25)+m(31,3),amplitude:range(32,2.8,6.8)+m(32,1),faultAngle:range(33,.75,1.5)+m(33,.16),faultOffset:range(34,-5,14)+m(34,4),throwHeight:range(35,1,3.8)+m(35,.8),erosion:range(36,2.3,5)+m(36,.7),fractureErosion:range(37,1.2,3.8)+m(37,.7)},
    se:{collapseX:range(40,15,40)+m(40,5),collapseZ:range(41,-40,-15)+m(41,5),radius:range(42,11,22)+m(42,3),depth:range(43,5,11)+m(43,1.5),uplift:range(44,2.5,6)+m(44,1),tiltAngle:range(45,.25,1.25)+m(45,.2),tiltMagnitude:range(46,.035,.12)+m(46,.025),debrisX:range(47,20,45)+m(47,5),debrisZ:range(48,-46,-20)+m(48,5),debrisAmount:range(49,3.5,8)+m(49,1.2),incisePhase:range(50,0,Math.PI*2)+m(50,.5),inciseWidth:range(51,2.6,5)+m(51,.6),inciseDepth:range(52,3.5,7.5)+m(52,1)}
  };
  const field=(v,soft)=>smooth(clamp(.5+.5*Math.tanh(v/soft)));
  const finite=v=>Number.isFinite(v)?v:0;
  const jurisdictions=(x,z)=>{const east=field(x,genome.jurisdictionSoftness),north=field(z,genome.jurisdictionSoftness);return{nw:(1-east)*north,ne:east*north,sw:(1-east)*(1-north),se:east*(1-north)}};
  const fault=(x,z,{angle=.7,offset=0,throwHeight=5,localSeed=1401}={})=>{const c=Math.cos(angle),s=Math.sin(angle),d=x*c+z*s+offset+noise(x*.028,z*.028,localSeed)*3.2,side=Math.tanh(d/1.6);return{d,side,delta:side*throwHeight,fracture:Math.exp(-Math.pow(d/2.3,2))}};
  const tilt=(x,z,{angle=0,magnitude=.12}={})=>(x*Math.cos(angle)+z*Math.sin(angle))*magnitude;
  const fold=(x,z,{angle=.4,wavelength=19,amplitude=3,localSeed=1421}={})=>{const q=x*Math.cos(angle)+z*Math.sin(angle);return Math.sin(q/wavelength*Math.PI*2+noise(x*.02,z*.02,localSeed)*1.2)*amplitude};
  const exposureErosion=(height,resistance,intensity)=>intensity*(.35+.65*smooth(clamp((height+3)/12)))*(1.15-.65*resistance);
  const collapse=(x,z,{cx=28,cz=-27,radius=15,depth=7,localSeed=1451}={})=>{const warp=noise(x*.045,z*.041,localSeed)*2.4,r=Math.hypot(x-cx,z-cz)+warp,bowl=smooth(clamp((radius-r)/(radius*.62))),rim=Math.exp(-Math.pow((r-radius*.78)/(radius*.14),2));return{delta:-depth*bowl+rim*depth*.22,bowl,rim}};
  const deposit=(x,z,low,{cx=24,cz=25,spreadX=24,spreadZ=17,amount=4.5,localSeed=1471}={})=>{const warp=noise(x*.025,z*.021,localSeed)*4,basin=Math.exp(-(Math.pow((x-cx+warp)/spreadX,2)+Math.pow((z-cz)/spreadZ,2)));return basin*smooth(clamp(low))*amount*(.75+.25*noise(x*.07,z*.06,localSeed+2))};
  const incise=(x,z,{phase=0,width=4.2,depth=6,localSeed=1491}={})=>{const course=z+Math.sin(x*.055+phase)*8+noise(x*.025,z*.02,localSeed)*4,d=Math.abs(course);return depth*Math.exp(-Math.pow(d/width,1.65))+depth*.28*Math.exp(-Math.pow(d/(width*.23),1.4))};
  function apply(x,z,{baseHeight,resistance}){
    const q=jurisdictions(x,z),g=genome;
    const nwFault=fault(x,z,{angle:g.nw.faultAngle,offset:g.nw.faultOffset,throwHeight:g.nw.throwHeight,localSeed:seed+1501});
    let nw=nwFault.delta+tilt(x,z,{angle:g.nw.tiltAngle,magnitude:g.nw.tiltMagnitude});nw-=exposureErosion(baseHeight+nw,resistance,g.nw.erosion);
    const neFault=fault(x,z,{angle:g.ne.faultAngle,offset:g.ne.faultOffset,throwHeight:g.ne.throwHeight,localSeed:seed+1511});
    let ne=-Math.abs(neFault.delta)*g.ne.subsidence;ne+=deposit(x,z,clamp((3-(baseHeight+ne))/8),{cx:g.ne.depositX,cz:g.ne.depositZ,amount:g.ne.depositAmount,localSeed:seed+1521});ne-=incise(x,z,{phase:g.ne.incisePhase,width:g.ne.inciseWidth,depth:g.ne.inciseDepth,localSeed:seed+1531});
    const swFold=fold(x,z,{angle:g.sw.foldAngle,wavelength:g.sw.wavelength,amplitude:g.sw.amplitude,localSeed:seed+1541}),swFault=fault(x,z,{angle:g.sw.faultAngle,offset:g.sw.faultOffset,throwHeight:g.sw.throwHeight,localSeed:seed+1551});
    let sw=swFold+swFault.delta*.45;sw-=exposureErosion(baseHeight+sw,resistance,g.sw.erosion)+swFault.fracture*g.sw.fractureErosion;
    const seCollapse=collapse(x,z,{cx:g.se.collapseX,cz:g.se.collapseZ,radius:g.se.radius,depth:g.se.depth,localSeed:seed+1561});
    let se=g.se.uplift+tilt(x,z,{angle:g.se.tiltAngle,magnitude:g.se.tiltMagnitude})+seCollapse.delta;
    const debris=deposit(x,z,clamp((2-(baseHeight+se))/9),{cx:g.se.debrisX,cz:g.se.debrisZ,spreadX:19,spreadZ:13,amount:g.se.debrisAmount,localSeed:seed+1571});
    se+=debris-incise(x,z,{phase:g.se.incisePhase,width:g.se.inciseWidth,depth:g.se.inciseDepth,localSeed:seed+1581});
    const sum=q.nw+q.ne+q.sw+q.se||1,delta=(nw*q.nw+ne*q.ne+sw*q.sw+se*q.se)/sum;
    return{delta:finite(delta),jurisdictions:q,signals:{nwFault,neFault,swFault,collapse:seCollapse,debris:finite(debris)}};
  }
  return{apply,jurisdictions,genome,operators:{fault,tilt,fold,exposureErosion,collapse,deposit,incise}};
}
