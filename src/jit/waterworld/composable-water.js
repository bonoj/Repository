// Waterworld V25 donor-cell transport, adapted to arbitrary height fields.
// Standalone ES module. No Hermeticon or rendering dependencies.
// Source lineage: src/jit/waterworld/index.html (Waterworld V25).
export class ComposableWater {
 constructor({heightAt, bounds, resolution=64, gravity=13.5, drag=.32, maxSpeed=24, beadRadius=.055, beadCapacity=2600, onExit=()=>{}}){
  if(typeof heightAt!=='function')throw Error('heightAt(x,z) required');
  const {minX,maxX,minZ,maxZ}=bounds;
  if(!(maxX>minX&&maxZ>minZ))throw Error('Invalid bounds');
  Object.assign(this,{heightAt,bounds,resolution,gravity,drag,maxSpeed,beadRadius,beadCapacity,onExit});
  this.n=resolution*resolution;this.dx=(maxX-minX)/resolution;this.dz=(maxZ-minZ)/resolution;this.area=this.dx*this.dz;
  this.bed=new Float32Array(this.n);this.wet=new Uint8Array(this.n);
  this.depth=new Float32Array(this.n);this.vx=new Float32Array(this.n);this.vz=new Float32Array(this.n);
  this.nextDepth=new Float32Array(this.n);this.nextVX=new Float32Array(this.n);this.nextVZ=new Float32Array(this.n);
  this.beads=[];this.emitted=0;this.exited=0;this.deposited=0;this.initialVolume=0;
  this.refreshTerrain();
 }
 index(x,z){const i=Math.floor((x-this.bounds.minX)/this.dx),j=Math.floor((z-this.bounds.minZ)/this.dz);return i<0||i>=this.resolution||j<0||j>=this.resolution?-1:j*this.resolution+i}
 refreshTerrain(){
  const {minX,minZ}=this.bounds,n=this.resolution;
  for(let z=0;z<n;z++)for(let x=0;x<n;x++){
   const i=z*n+x,h=this.heightAt(minX+(x+.5)*this.dx,minZ+(z+.5)*this.dz);
   this.wet[i]=Number.isFinite(h)?1:0;this.bed[i]=this.wet[i]?h:0;
  }
 }
 fillTo(level){for(let i=0;i<this.n;i++)this.depth[i]=this.wet[i]?Math.max(0,level-this.bed[i]):0;this.initialVolume=this.volume()}
 volume(){let v=0;for(let i=0;i<this.n;i++)v+=this.depth[i]*this.area;return v}
 surfaceAt(x,z){const i=this.index(x,z);return i<0||!this.wet[i]?null:this.bed[i]+this.depth[i]}
 // Waterworld's donor-cell pairwise flux and pressure gradient; fixed downward gravity.
 stepWater(dt){
  const n=this.resolution,g=this.gravity,D=this.depth,B=this.bed,W=this.wet,VX=this.vx,VZ=this.vz,NX=this.nextVX,NZ=this.nextVZ,ND=this.nextDepth;
  for(let z=0;z<n;z++)for(let x=0;x<n;x++){
   const i=z*n+x;if(!W[i]||D[i]<.001){NX[i]=NZ[i]=0;continue}
   const h=B[i]+D[i],L=x>0&&W[i-1]?B[i-1]+D[i-1]:h,R=x<n-1&&W[i+1]?B[i+1]+D[i+1]:h;
   const down=z>0&&W[i-n]?B[i-n]+D[i-n]:h,up=z<n-1&&W[i+n]?B[i+n]+D[i+n]:h;
   const drag=Math.exp(-this.drag*dt);
   NX[i]=Math.max(-this.maxSpeed,Math.min(this.maxSpeed,(VX[i]-dt*g*(R-L)/(2*this.dx))*drag));
   NZ[i]=Math.max(-this.maxSpeed,Math.min(this.maxSpeed,(VZ[i]-dt*g*(up-down)/(2*this.dz))*drag));
  }
  ND.set(D);
  for(let z=0;z<n;z++)for(let x=0;x<n;x++){
   const i=z*n+x;if(!W[i])continue;
   for(let axis=0;axis<2;axis++){
    if(axis===0&&x===n-1||axis===1&&z===n-1)continue;
    const j=axis===0?i+1:i+n;if(!W[j])continue;
    const velocity=axis===0?(NX[i]+NX[j])*.5:(NZ[i]+NZ[j])*.5;
    const donor=velocity>=0?i:j,receiver=velocity>=0?j:i;
    const width=axis===0?this.dx:this.dz;
    const wanted=Math.abs(velocity)*dt*D[donor]/width;
    const transfer=Math.min(wanted,Math.max(0,ND[donor])*.48);
    ND[donor]-=transfer;ND[receiver]+=transfer;
   }
  }
  for(let i=0;i<this.n;i++){D[i]=Math.max(0,ND[i]);VX[i]=NX[i];VZ[i]=NZ[i]}
 }
 addWater(x,z,volume){const i=this.index(x,z);if(i<0||!this.wet[i])return false;this.depth[i]+=volume/this.area;this.deposited+=volume;return true}
 removeWater(x,z,volume){const i=this.index(x,z);if(i<0||!this.wet[i])return 0;const v=Math.min(volume,this.depth[i]*this.area);this.depth[i]-=v/this.area;return v}
 thump(x,z,strength=18,radius=7.6){
  const n=this.resolution,{minX,minZ}=this.bounds;
  for(let j=0;j<n;j++)for(let k=0;k<n;k++){
   const i=j*n+k;if(!this.wet[i]||this.depth[i]<.08)continue;
   const dx=minX+(k+.5)*this.dx-x,dz=minZ+(j+.5)*this.dz-z,r=Math.hypot(dx,dz);
   const impulse=strength*Math.exp(-r*r/(radius*radius));
   this.vx[i]+=impulse*dx/Math.max(r,.3);this.vz[i]+=impulse*dz/Math.max(r,.3);
  }
 }
 // Waterworld V25 airborne BB transport: real x/y/z, velocity, gravity, surface deposition.
 emitBead({x,y,z,vx=0,vy=0,vz=0,volume=1}){
  if(this.beads.length>=this.beadCapacity)return false;
  this.beads.push({x,y,z,vx,vy,vz,volume});this.emitted+=volume;return true;
 }
 stepBeads(dt){
  for(let k=this.beads.length-1;k>=0;k--){
   const p=this.beads[k];p.vy-=this.gravity*dt;
   p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;
   const h=this.surfaceAt(p.x,p.z);
   if(h!==null&&p.vy<0&&p.y<=h+this.beadRadius){
    this.addWater(p.x,p.z,p.volume);this.beads.splice(k,1);continue;
   }
   if(p.y< -1e5 || this.index(p.x,p.z)<0){
    this.beads.splice(k,1);this.exited+=p.volume;this.onExit({...p});continue;
   }
  }
 }
 step(dt){this.stepWater(dt);this.stepBeads(dt)}
 diagnostics(){
  const airborne=this.beads.reduce((v,p)=>v+p.volume,0),liquid=this.volume();
  return {liquid,airborne,emitted:this.emitted,deposited:this.deposited,exited:this.exited,
   residual:this.initialVolume+this.emitted-liquid-airborne-this.exited};
 }
 // Read-only bilinear surface for renderer. No simulation mutation.
 renderedHeight(x,z){
  const gx=(x-this.bounds.minX)/this.dx-.5,gz=(z-this.bounds.minZ)/this.dz-.5;
  const ix=Math.floor(gx),iz=Math.floor(gz),tx=gx-ix,tz=gz-iz;let sum=0,weight=0;
  for(let j=0;j<2;j++)for(let k=0;k<2;k++){
   const xx=ix+k,zz=iz+j;if(xx<0||zz<0||xx>=this.resolution||zz>=this.resolution)continue;
   const i=zz*this.resolution+xx;if(!this.wet[i])continue;
   const w=(k?tx:1-tx)*(j?tz:1-tz);sum+=w*(this.bed[i]+this.depth[i]);weight+=w;
  }
  return weight>1e-6?sum/weight:null;
 }
}
