export function buildTransportWatershed({terrain,transport}){
  terrain.raise({x:-5.4,z:-1.6},{radius:3.8,height:2.8});
  terrain.raise({x:-2.2,z:3.9},{radius:3.1,height:1.85});
  terrain.raise({x:2.0,z:-3.8},{radius:3.4,height:1.55});
  const channel=(a,b,n=11)=>{for(let i=0;i<=n;i++){const t=i/n,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t;terrain.excavate({x,z},{radius:.62,depth:.18});}};
  channel({x:-5.0,z:-1.4},{x:-1.0,z:.2},12);
  channel({x:-2.0,z:3.7},{x:-.8,z:.7},8);
  channel({x:-1.0,z:.2},{x:3.0,z:1.0},12);
  channel({x:3.0,z:1.0},{x:7.7,z:2.4},13);
  transport.reset();
  transport.setSources([
    {x:-5.1,z:-1.5,rate:.62},
    {x:-2.0,z:3.55,rate:.38},
    {x:1.7,z:-3.7,rate:.28}
  ]);
  return{kind:"transport-watershed-001",springs:transport.inspect().sources};
}
