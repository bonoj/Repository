// Geological History Torture Test v0
// Four overlapping jurisdictions, one operator vocabulary. No named landforms.
export function createQuadrantHistory({noise,clamp,smooth}){
  const mix=(a,b,t)=>a+(b-a)*t;
  const field=(x,z,sx,sz,soft=7)=>smooth(clamp(.5+.5*Math.tanh((x*sx+z*sz)/soft)));
  const jurisdictions=(x,z)=>{
    const east=field(x,z,1,0,8),north=field(x,z,0,1,8);
    return{nw:(1-east)*north,ne:east*north,sw:(1-east)*(1-north),se:east*(1-north)};
  };
  const fault=(x,z,{angle=.7,offset=0,throwHeight=5,seed=1401}={})=>{
    const c=Math.cos(angle),s=Math.sin(angle);
    const d=x*c+z*s+offset+noise(x*.028,z*.028,seed)*3.2;
    const side=Math.tanh(d/1.6);
    return{d,side,delta:side*throwHeight,fracture:Math.exp(-Math.pow(d/2.3,2))};
  };
  const tilt=(x,z,{angle=0,magnitude=.12}={})=>(x*Math.cos(angle)+z*Math.sin(angle))*magnitude;
  const fold=(x,z,{angle=.4,wavelength=19,amplitude=3,seed=1421}={})=>{
    const q=x*Math.cos(angle)+z*Math.sin(angle);
    return Math.sin(q/wavelength*Math.PI*2+noise(x*.02,z*.02,seed)*1.2)*amplitude;
  };
  const exposureErosion=(height,resistance,intensity)=>intensity*(.35+.65*smooth(clamp((height+3)/12)))*(1.15-.65*resistance);
  const collapse=(x,z,{cx=28,cz=-27,radius=15,depth=7,seed=1451}={})=>{
    const warp=noise(x*.045,z*.041,seed)*2.4,r=Math.hypot(x-cx,z-cz)+warp;
    const bowl=smooth(clamp((radius-r)/(radius*.62)));
    const rim=Math.exp(-Math.pow((r-radius*.78)/(radius*.14),2));
    return{-depth*bowl+rim*depth*.22,bowl,rim};
  };
  const deposit=(x,z,low,{cx=24,cz=25,spreadX=24,spreadZ=17,amount=4.5,seed=1471}={})=>{
    const warp=noise(x*.025,z*.021,seed)*4;
    const basin=Math.exp(-(Math.pow((x-cx+warp)/spreadX,2)+Math.pow((z-cz)/spreadZ,2)));
    return basin*smooth(clamp(low))*amount*(.75+.25*noise(x*.07,z*.06,seed+2));
  };
  const incise=(x,z,{phase=0,width=4.2,depth=6,seed=1491}={})=>{
    const course=z+Math.sin(x*.055+phase)*8+noise(x*.025,z*.02,seed)*4;
    const d=Math.abs(course);
    return depth*Math.exp(-Math.pow(d/width,1.65))+depth*.28*Math.exp(-Math.pow(d/(width*.23),1.4));
  };
  function apply(x,z,{baseHeight,resistance}){
    const q=jurisdictions(x,z);
    // NW: fault -> violent uplift -> tilt -> deep exposure erosion.
    const nwFault=fault(x,z,{angle:.63,offset:18,throwHeight:7.5,seed:1501});
    let nw=nwFault.delta+tilt(x,z,{angle:-.38,magnitude:.16});
    nw-=exposureErosion(baseHeight+nw,resistance,4.8);
    // NE: subsidence -> deposition -> later incision.
    const neFault=fault(x,z,{angle:-.92,offset:-8,throwHeight:3.8,seed:1511});
    let ne=-Math.abs(neFault.delta)*.72;
    ne+=deposit(x,z,clamp((3-(baseHeight+ne))/8),{cx:27,cz:27,amount:5.8,seed:1521});
    ne-=incise(x,z,{phase:.8,width:4.8,depth:6.4,seed:1531});
    // SW: compression/folding -> fracture -> differential erosion.
    const swFold=fold(x,z,{angle:.28,wavelength:17,amplitude:4.8,seed:1541});
    const swFault=fault(x,z,{angle:1.18,offset:5,throwHeight:2.1,seed:1551});
    let sw=swFold+swFault.delta*.45;
    sw-=exposureErosion(baseHeight+sw,resistance,3.6)+swFault.fracture*2.6;
    // SE: uplift -> collapse -> mass transport/burial -> re-incision.
    const seCollapse=collapse(x,z,{cx:28,cz:-27,radius:17,depth:8.5,seed:1561});
    let se=4.2+tilt(x,z,{angle:.8,magnitude:.08})+seCollapse;
    const debris=deposit(x,z,clamp((2-(baseHeight+se))/9),{cx:36,cz:-37,spreadX:19,spreadZ:13,amount:6.2,seed:1571});
    se+=debris-incise(x,z,{phase:2.1,width:3.7,depth:5.5,seed:1581});
    // Broad overlap is intentional: boundaries are jurisdictions, not square seams.
    const sum=q.nw+q.ne+q.sw+q.se||1;
    const delta=(nw*q.nw+ne*q.ne+sw*q.sw+se*q.se)/sum;
    return{delta,jurisdictions:q,signals:{nwFault,neFault,swFault,collapse:seCollapse,debris}};
  }
  return{apply,jurisdictions,operators:{fault,tilt,fold,exposureErosion,collapse,deposit,incise}};
}
