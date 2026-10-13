import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// BB lattice grammar: visible matter is assembled from repeated discrete spheres.
// No mesh-heavy imported assets. Everything lives inside Hermeticon's group.
export function populateStatus(hermeticon){
 const root=hermeticon.group;
 const bb=new T.SphereGeometry(.115,7,5);
 const mats={
  brass:new T.MeshStandardMaterial({color:0xc99b50,metalness:.82,roughness:.28}),
  ice:new T.MeshStandardMaterial({color:0x5fcde0,metalness:.36,roughness:.18,emissive:0x104b68,emissiveIntensity:.4}),
  violet:new T.MeshStandardMaterial({color:0x975de0,metalness:.48,roughness:.22,emissive:0x3a1680,emissiveIntensity:.5}),
  stone:new T.MeshStandardMaterial({color:0x475668,metalness:.4,roughness:.65}),
  fire:new T.MeshStandardMaterial({color:0xffa64e,emissive:0xd65c19,emissiveIntensity:.9})
 };
 const pts={brass:[],ice:[],violet:[],stone:[],fire:[]};
 const put=(kind,x,y,z)=>pts[kind].push([x,y,z]);
 function ring(kind,r,y,n=90,offset=0){for(let i=0;i<n;i++){let a=i*Math.PI*2/n+offset;put(kind,r*Math.cos(a),y,r*Math.sin(a))}}
 function column(kind,x,z,from,to,step=.25){for(let y=from;y<=to;y+=step)put(kind,x,y,z)}
 // Glass globe as a point-lattice shell with brass latitude lines.
 for(let j=1;j<16;j++){let phi=j*Math.PI/16,r=8.7*Math.sin(phi),y=8.7*Math.cos(phi);let n=Math.max(18,Math.floor(r*17));for(let i=0;i<n;i++){let a=i*2*Math.PI/n;put('ice',r*Math.cos(a),y,r*Math.sin(a))}}
 for(const y of [-3.9,0,3.9])ring('brass',Math.sqrt(8.7**2-y*y),y,126);
 // Pedestal and fortress, entirely built from BBs.
 for(let y=-7.9;y<-6.8;y+=.26)ring('brass',4.6,y,110);
 for(let y=-6.9;y<-4.9;y+=.24)for(let x=-3.7;x<=3.7;x+=.27)for(let z=-3.7;z<=3.7;z+=.27)if(Math.abs(x)>3.35||Math.abs(z)>3.35)put('stone',x,y,z);
 for(const x of [-3.2,3.2])for(const z of [-3.2,3.2]){
  for(let y=-5;y<-.5;y+=.25)ringAt('stone',x,z,.72,y,24);
  for(let y=-.5;y<.3;y+=.24)ringAt('brass',x,z,.82,y,24);
 }
 function ringAt(k,x,z,r,y,n){for(let i=0;i<n;i++){let a=i*2*Math.PI/n;put(k,x+r*Math.cos(a),y,z+r*Math.sin(a))}}
 // The warlock: hood, shoulders, arms and an enormous staff.
 for(let j=0;j<19;j++){let y=-3.8+j*.24,r=.5+Math.sin(j/18*Math.PI)*.85;ringAt('violet',0,0,r,y,Math.round(18+r*19))}
 for(let j=0;j<13;j++){let phi=j*Math.PI/13;ringAt('violet',0,0,.85*Math.sin(phi),1.1+.85*Math.cos(phi),25)}
 for(let y=-3.1;y<3.3;y+=.18)put('brass',1.35,y,.15);
 for(let j=0;j<10;j++){let phi=j*Math.PI/10;ringAt('fire',1.35,.15,.53*Math.sin(phi),3.4+.53*Math.cos(phi),22)}
 // Concentric rings: the warlock's extremely unnecessary security perimeter.
 for(let r of [5.1,5.7,6.3])ring('violet',r,-4.5,120);
 // Label planes are physical objects within the world, not HUD replacements.
 function label(text,y,width=5.5,scale=.75){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=180;
  const ctx=canvas.getContext('2d');ctx.clearRect(0,0,1024,180);
  ctx.fillStyle='#e6d4a6';ctx.font='bold 64px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,90);
  const texture=new T.CanvasTexture(canvas);
  const plane=new T.Mesh(new T.PlaneGeometry(width,width*180/1024),new T.MeshBasicMaterial({map:texture,transparent:true,side:T.DoubleSide,depthWrite:false}));
  plane.position.set(0,y,4.6);root.add(plane);
 }
 label('MANUEL LEAL',5.7,7.2);
 label('PRINCIPAL SECURITY WARLOCK',4.85,7.8);
 label('MICROSOFT · FORMER NSA',-5.6,7.5);
 label('DO NOT DISTURB',-6.5,6.5);
 const tmp=new T.Object3D(),meshes=[];
 for(const [name,positions] of Object.entries(pts)){
  const mesh=new T.InstancedMesh(bb,mats[name],positions.length);
  positions.forEach(([x,y,z],i)=>{tmp.position.set(x,y,z);tmp.updateMatrix();mesh.setMatrixAt(i,tmp.matrix)});
  mesh.instanceMatrix.needsUpdate=true;mesh.name='bb-lattice-'+name;root.add(mesh);meshes.push(mesh);
 }
 const counts=Object.fromEntries(Object.entries(pts).map(([k,v])=>[k,v.length]));
 let elapsed=0;
 hermeticon.update=(dt)=>{elapsed+=dt;root.rotation.y=Math.sin(elapsed*.16)*.14;meshes.find(m=>m.name==='bb-lattice-fire').material.emissiveIntensity=.7+.35*Math.sin(elapsed*3)};
 hermeticon.inspect=()=>({name:'Manny Status',grammar:'BB lattice',counts,total:Object.values(counts).reduce((a,b)=>a+b,0),profile:'https://www.linkedin.com/in/manuel-leal-053384234',message:'Low profile maintained'});
}