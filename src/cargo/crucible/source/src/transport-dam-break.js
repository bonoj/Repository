export function buildTransportDamBreak({terrain,transport}){
  // Upland bowl and retaining ridge are terrain. Transport receives no dam semantics.
  terrain.raise({x:-5.0,z:0},{radius:4.2,height:2.35});
  terrain.excavate({x:-5.15,z:0},{radius:2.25,depth:1.15});
  terrain.raise({x:-2.65,z:0},{radius:1.35,height:1.5});

  const channel=(a,b,n=10,radius=.62,depth=.22)=>{for(let i=0;i<=n;i++){const t=i/n;terrain.excavate({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t},{radius,depth});}};
  // Shared throat, then three competing downstream routes to different plinth edges.
  channel({x:-2.3,z:0},{x:.2,z:0},8,.7,.3);
  channel({x:.1,z:0},{x:7.9,z:3.5},18,.68,.28);
  channel({x:.1,z:0},{x:7.9,z:-3.5},18,.68,.28);
  channel({x:.1,z:0},{x:4.0,z:0},10,.58,.18);
  terrain.raise({x:2.3,z:0},{radius:1.25,height:.75});

  transport.reset();
  transport.setSources([]);
  transport.fillRegion({x:-5.15,z:0,radius:1.75,amount:115});

  // The experiment begins with failure of the retaining ridge, not a scripted flow path.
  terrain.lower({x:-2.65,z:0},{radius:.9,depth:1.8});
  return{kind:"transport-dam-break-001",reservoir:{x:-5.15,z:0,radius:1.75,mass:115},breach:{x:-2.65,z:0,radius:.9,depth:1.8}};
}
