const SQRT1_2=Math.SQRT1_2;
export function createTerrainSystem({THREE,scene}){
  const NX=60,NY=44,NZ=60,MIN=new THREE.Vector3(-10,-5.5,-10),MAX=new THREE.Vector3(10,6.5,10);
  const APPARATUS_RADIUS=9.75,APPARATUS_APOTHEM=APPARATUS_RADIUS*Math.cos(Math.PI/8),EDGE_REVEAL=.7,MATERIAL_APOTHEM=APPARATUS_APOTHEM-EDGE_REVEAL;
  const APPARATUS_TOP=-1.1,APPARATUS_DEPTH=5,APPARATUS_BOTTOM=APPARATUS_TOP-APPARATUS_DEPTH,SURFACE_Y=.15;
  const PLANES=[[1,0],[-1,0],[0,1],[0,-1],[SQRT1_2,SQRT1_2],[-SQRT1_2,SQRT1_2],[SQRT1_2,-SQRT1_2],[-SQRT1_2,-SQRT1_2]];
  const field=new Float32Array(NX*NY*NZ),initial=new Float32Array(field.length),idx=(x,y,z)=>x+NX*(y+NY*z);let seed=1;
  const wp=(x,y,z)=>new THREE.Vector3(THREE.MathUtils.lerp(MIN.x,MAX.x,x/(NX-1)),THREE.MathUtils.lerp(MIN.y,MAX.y,y/(NY-1)),THREE.MathUtils.lerp(MIN.z,MAX.z,z/(NZ-1)));
  const octagonDistance=(x,z)=>Math.max(Math.abs(x),Math.abs(z),(Math.abs(x)+Math.abs(z))/Math.SQRT2);
  const insideMaterial=(x,z)=>octagonDistance(x,z)<=MATERIAL_APOTHEM+1e-6,insideApparatus=(x,z,pad=0)=>octagonDistance(x,z)<=APPARATUS_APOTHEM+pad;
  function boundary(x,z){let q=-Infinity,nx=0,nz=0;for(const[px,pz]of PLANES){const d=x*px+z*pz;if(d>q){q=d;nx=px;nz=pz}}return{q,nx,nz};}
  // Exact lateral contract for systems that need the material specimen boundary.
  function materialBoundary(x,z){const b=boundary(x,z);return{inside:b.q<=MATERIAL_APOTHEM+1e-6,distance:MATERIAL_APOTHEM-b.q,nx:b.nx,nz:b.nz,offset:MATERIAL_APOTHEM};}
  function clipPlane(poly,nx,nz){if(!poly.length)return poly;const out=[];let a=poly.at(-1),da=a.x*nx+a.z*nz-MATERIAL_APOTHEM,ain=da<=1e-6;for(const b of poly){const db=b.x*nx+b.z*nz-MATERIAL_APOTHEM,bin=db<=1e-6;if(ain!==bin){const t=da/(da-db);out.push(a.clone().lerp(b,t))}if(bin)out.push(b);a=b;da=db;ain=bin}return out;}
  function clip(raw){const out=[];for(let i=0;i<raw.length;i+=3){let poly=[raw[i],raw[i+1],raw[i+2]];for(const[nx,nz]of PLANES){poly=clipPlane(poly,nx,nz);if(poly.length<3)break}for(let j=1;j+1<poly.length;j++)out.push(poly[0],poly[j],poly[j+1])}return out;}
  function cutWalls(surface){const edges=new Map(),eps=1e-4,key=p=>`${Math.round(p.x*1e4)},${Math.round(p.y*1e4)},${Math.round(p.z*1e4)}`;function planeFor(a,b){for(let i=0;i<PLANES.length;i++){const[nx,nz]=PLANES[i];if(Math.abs(a.x*nx+a.z*nz-MATERIAL_APOTHEM)<eps&&Math.abs(b.x*nx+b.z*nz-MATERIAL_APOTHEM)<eps)return i}return-1}for(let i=0;i<surface.length;i+=3){const tri=[surface[i],surface[i+1],surface[i+2]];for(let j=0;j<3;j++){const a=tri[j],b=tri[(j+1)%3],p=planeFor(a,b);if(p<0)continue;const ka=key(a),kb=key(b),id=p+":"+(ka<kb?ka+"|"+kb:kb+"|"+ka);if(!edges.has(id))edges.set(id,[a.clone(),b.clone()])}}const walls=[];for(const[a,b]of edges.values()){const fy=Math.min(APPARATUS_TOP-.03,a.y,b.y),ad=new THREE.Vector3(a.x,fy,a.z),bd=new THREE.Vector3(b.x,fy,b.z);walls.push(a,b,bd,a,bd,ad)}return walls;}
  const corners=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],tets=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
  const interp=(a,b,va,vb)=>a.clone().lerp(b,THREE.MathUtils.clamp(va/(va-vb),0,1));
  function polygonize(ps,vs,out){const inside=[],outside=[];for(let i=0;i<4;i++)(vs[i]>0?inside:outside).push(i);if(!inside.length||inside.length===4)return;if(inside.length===1||inside.length===3){const inv=inside.length===3,A=inv?outside[0]:inside[0],others=inv?inside:outside,p0=interp(ps[A],ps[others[0]],vs[A],vs[others[0]]),p1=interp(ps[A],ps[others[1]],vs[A],vs[others[1]]),p2=interp(ps[A],ps[others[2]],vs[A],vs[others[2]]);out.push(...(inv?[p0,p2,p1]:[p0,p1,p2]));return}const[a,b]=inside,[c,d]=outside,p0=interp(ps[a],ps[c],vs[a],vs[c]),p1=interp(ps[a],ps[d],vs[a],vs[d]),p2=interp(ps[b],ps[c],vs[b],vs[c]),p3=interp(ps[b],ps[d],vs[b],vs[d]);out.push(p0,p1,p2,p2,p1,p3);}
  function hash(n){const s=Math.sin(n*127.1+seed*311.7)*43758.5453123;return s-Math.floor(s)}
  const LAND_CANDIDATE_A={id:"land-a",provenance:"Geological Diversity board 1 specimen 6",relief:3.2,slope:.08,trunk:1.05,trib:.58,width:.92,plateau:.78,warp:.14};
  const segDist=(x,z,ax,az,bx,bz)=>{const dx=bx-ax,dz=bz-az,l=dx*dx+dz*dz||1,t=THREE.MathUtils.clamp(((x-ax)*dx+(z-az)*dz)/l,0,1);return Math.hypot(x-(ax+dx*t),z-(az+dz*t));};
  function terrainSeedHeight(x,z){
    const g=LAND_CANDIDATE_A;
    const radial=Math.hypot(x*.82,z*.72),plateau=g.plateau*Math.max(0,1-Math.pow(radial/9.4,4));
    const macro=g.relief*(.24*Math.sin(x*.34+seed*.71)+.18*Math.cos(z*.29-seed*.43)+g.warp*.12*Math.sin((x+z)*.71+seed));
    const downhill=-g.slope*(x+8);
    let h=SURFACE_Y+plateau+macro+downhill;
    const bend=1.15*Math.sin(seed*1.37),trunk=segDist(x,z,-7.8,bend,-.5,.15*bend)+segDist(x,z,-.5,.15*bend,8.5,-.55*bend);
    h-=g.trunk*Math.exp(-(trunk*trunk)/(2*g.width*g.width));
    const joins=[[-6.2,5.8,-2.0,1.2],[-5.4,-5.9,-1.2,-.8],[.2,5.6,2.8,-.1],[.8,-5.8,3.4,-.35]];
    for(let i=0;i<joins.length;i++){if(((seed+i)%3)===0&&g.trib<.7)continue;const [ax,az,bx,bz]=joins[i],d=segDist(x,z,ax,az,bx,bz),w=g.width*(.58+.08*(i%2));h-=g.trib*(.72+.12*i)*Math.exp(-(d*d)/(2*w*w));}
    return h;
  }
  function synthesize(nextSeed=seed){seed=nextSeed|0;for(let z=0;z<NZ;z++)for(let y=0;y<NY;y++)for(let x=0;x<NX;x++){const p=wp(x,y,z);field[idx(x,y,z)]=terrainSeedHeight(p.x,p.z)-p.y;}initial.set(field);}
  synthesize(seed);
  const material=new THREE.MeshStandardMaterial({color:0x785846,roughness:.96,metalness:.02,flatShading:true,side:THREE.DoubleSide});
  const CHUNK=10,CX=Math.ceil((NX-1)/CHUNK),CZ=Math.ceil((NZ-1)/CHUNK),chunks=[],mesh=new THREE.Group();mesh.name="deformable-world-substance";scene.add(mesh);
  for(let cz=0;cz<CZ;cz++)for(let cx=0;cx<CX;cx++){const geometry=new THREE.BufferGeometry(),part=new THREE.Mesh(geometry,material);part.receiveShadow=true;part.name=`terrain-chunk-${cx}-${cz}`;mesh.add(part);chunks.push({cx,cz,geometry,mesh:part,triangles:0});}
  const apparatusMaterial=new THREE.MeshStandardMaterial({color:0x3f4745,roughness:.78,metalness:.22}),apparatus=new THREE.Mesh(new THREE.CylinderGeometry(APPARATUS_RADIUS,APPARATUS_RADIUS,APPARATUS_DEPTH,8,1,false,Math.PI/8),apparatusMaterial);apparatus.position.y=APPARATUS_TOP-APPARATUS_DEPTH*.5;apparatus.name="crucible-octagonal-apparatus";apparatus.receiveShadow=true;scene.add(apparatus);
  // World-space visibility boundary: anything opting into this plane is invisible below
  // the plinth top, independent of the apparatus' finite rendered depth.
  const belowPlinthOcclusion=new THREE.Plane(new THREE.Vector3(0,1,0),-APPARATUS_TOP);
  function occludeBelowPlinth(object){
    object.traverse(o=>{if((!o.isMesh&&!o.isLine&&!o.isLineSegments)||!o.material)return;const materials=Array.isArray(o.material)?o.material:[o.material];for(const mat of materials){const planes=mat.clippingPlanes||[];if(!planes.includes(belowPlinthOcclusion))mat.clippingPlanes=[...planes,belowPlinthOcclusion];mat.needsUpdate=true;}});
    return object;
  }
  function rebuildChunk(chunk){
    const raw=[],x0=chunk.cx*CHUNK,x1=Math.min(NX-1,x0+CHUNK),z0=chunk.cz*CHUNK,z1=Math.min(NZ-1,z0+CHUNK);
    for(let z=z0;z<z1;z++)for(let y=0;y<NY-1;y++)for(let x=x0;x<x1;x++){const ps=corners.map(c=>wp(x+c[0],y+c[1],z+c[2])),vs=corners.map(c=>field[idx(x+c[0],y+c[1],z+c[2])]);for(const t of tets)polygonize(t.map(i=>ps[i]),t.map(i=>vs[i]),raw)}
    const out=clip(raw);out.push(...cutWalls(out));const pos=[];for(const p of out)pos.push(p.x,p.y,p.z);chunk.geometry.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));chunk.geometry.computeVertexNormals();chunk.geometry.computeBoundingSphere();chunk.triangles=out.length/3;
  }
  function rebuild(bounds=null){
    if(!bounds){for(const chunk of chunks)rebuildChunk(chunk);return}
    const cx0=Math.max(0,Math.floor(Math.max(0,bounds.x0-1)/CHUNK)),cx1=Math.min(CX-1,Math.floor(Math.min(NX-2,bounds.x1+1)/CHUNK)),cz0=Math.max(0,Math.floor(Math.max(0,bounds.z0-1)/CHUNK)),cz1=Math.min(CZ-1,Math.floor(Math.min(NZ-2,bounds.z1+1)/CHUNK));
    for(let cz=cz0;cz<=cz1;cz++)for(let cx=cx0;cx<=cx1;cx++)rebuildChunk(chunks[cx+CX*cz]);
  }
  function terrainHeight(x,z){
    if(!insideMaterial(x,z))return-Infinity;
    const fx=THREE.MathUtils.clamp((x-MIN.x)/(MAX.x-MIN.x)*(NX-1),0,NX-1.001),fz=THREE.MathUtils.clamp((z-MIN.z)/(MAX.z-MIN.z)*(NZ-1),0,NZ-1.001),x0=Math.floor(fx),z0=Math.floor(fz),tx=fx-x0,tz=fz-z0;
    function column(ix,iz){for(let y=NY-2;y>=0;y--){const a=field[idx(ix,y,iz)],b=field[idx(ix,y+1,iz)];if(a>=0&&b<0){const pa=wp(ix,y,iz),pb=wp(ix,y+1,iz),t=a/(a-b);return THREE.MathUtils.lerp(pa.y,pb.y,t)}}return-Infinity}
    const h00=column(x0,z0),h10=column(x0+1,z0),h01=column(x0,z0+1),h11=column(x0+1,z0+1);
    if(![h00,h10,h01,h11].every(Number.isFinite))return Math.max(h00,h10,h01,h11);
    return THREE.MathUtils.lerp(THREE.MathUtils.lerp(h00,h10,tx),THREE.MathUtils.lerp(h01,h11,tx),tz);
  }
  const SUPPORT_G=112,support=new Float32Array(SUPPORT_G*SUPPORT_G);
  function rebuildSupport(bounds=null){
    // Bearing support is terrain-owned derived state. Mutations pass their already-known
    // field footprint; terrain maps it to support cells and refreshes only that region.
    const gx=x=>THREE.MathUtils.clamp((x-MIN.x)/(MAX.x-MIN.x)*(SUPPORT_G-1),0,SUPPORT_G-1);
    const gz=z=>THREE.MathUtils.clamp((z-MIN.z)/(MAX.z-MIN.z)*(SUPPORT_G-1),0,SUPPORT_G-1);
    let sx0=0,sx1=SUPPORT_G-1,sz0=0,sz1=SUPPORT_G-1;
    if(bounds){
      const wx0=THREE.MathUtils.lerp(MIN.x,MAX.x,Math.max(0,bounds.x0-1)/(NX-1)),wx1=THREE.MathUtils.lerp(MIN.x,MAX.x,Math.min(NX-1,bounds.x1+1)/(NX-1));
      const wz0=THREE.MathUtils.lerp(MIN.z,MAX.z,Math.max(0,bounds.z0-1)/(NZ-1)),wz1=THREE.MathUtils.lerp(MIN.z,MAX.z,Math.min(NZ-1,bounds.z1+1)/(NZ-1));
      sx0=Math.max(0,Math.floor(gx(wx0))-2);sx1=Math.min(SUPPORT_G-1,Math.ceil(gx(wx1))+2);
      sz0=Math.max(0,Math.floor(gz(wz0))-2);sz1=Math.min(SUPPORT_G-1,Math.ceil(gz(wz1))+2);
      for(let iz=sz0;iz<=sz1;iz++)support.fill(-Infinity,iz*SUPPORT_G+sx0,iz*SUPPORT_G+sx1+1);
    }else support.fill(-Infinity);
    const eps=1e-8;
    for(const chunk of chunks){
      const a=chunk.geometry.getAttribute("position");if(!a)continue;
      for(let t=0;t<a.count;t+=3){
        const ax=a.getX(t),ay=a.getY(t),az=a.getZ(t),bx=a.getX(t+1),by=a.getY(t+1),bz=a.getZ(t+1),cx=a.getX(t+2),cy=a.getY(t+2),cz=a.getZ(t+2);
        const den=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz);if(Math.abs(den)<eps)continue;
        const ix0=Math.max(sx0,Math.floor(gx(Math.min(ax,bx,cx)))-1),ix1=Math.min(sx1,Math.ceil(gx(Math.max(ax,bx,cx)))+1);
        const iz0=Math.max(sz0,Math.floor(gz(Math.min(az,bz,cz)))-1),iz1=Math.min(sz1,Math.ceil(gz(Math.max(az,bz,cz)))+1);
        if(ix0>ix1||iz0>iz1)continue;
        for(let iz=iz0;iz<=iz1;iz++){const z=THREE.MathUtils.lerp(MIN.z,MAX.z,iz/(SUPPORT_G-1));for(let ix=ix0;ix<=ix1;ix++){
          const x=THREE.MathUtils.lerp(MIN.x,MAX.x,ix/(SUPPORT_G-1));
          const wa=((bz-cz)*(x-cx)+(cx-bx)*(z-cz))/den,wb=((cz-az)*(x-cx)+(ax-cx)*(z-cz))/den,wc=1-wa-wb;
          if(wa>=-1e-5&&wb>=-1e-5&&wc>=-1e-5){const y=wa*ay+wb*by+wc*cy,k=ix+SUPPORT_G*iz;if(y>support[k])support[k]=y}
        }}
      }
    }
    // Fill only the refreshed region; neighboring stable support remains valid context.
    const copy=support.slice();
    for(let iz=sz0;iz<=sz1;iz++)for(let ix=sx0;ix<=sx1;ix++){const k=ix+SUPPORT_G*iz;if(Number.isFinite(copy[k]))continue;let best=-Infinity;for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const x=ix+dx,z=iz+dz;if(x<0||x>=SUPPORT_G||z<0||z>=SUPPORT_G)continue;best=Math.max(best,copy[x+SUPPORT_G*z])}support[k]=best}
  }
  function groundHeightExact(x,z){const h=terrainHeight(x,z);return insideApparatus(x,z)?Math.max(h,APPARATUS_TOP):h;}
  function bearingTerrainHeight(x,z){if(x<MIN.x||x>MAX.x||z<MIN.z||z>MAX.z)return-Infinity;const fx=THREE.MathUtils.clamp((x-MIN.x)/(MAX.x-MIN.x)*(SUPPORT_G-1),0,SUPPORT_G-1.001),fz=THREE.MathUtils.clamp((z-MIN.z)/(MAX.z-MIN.z)*(SUPPORT_G-1),0,SUPPORT_G-1.001),ix=Math.floor(fx),iz=Math.floor(fz),tx=fx-ix,tz=fz-iz,A=support[ix+SUPPORT_G*iz],B=support[ix+1+SUPPORT_G*iz],C=support[ix+SUPPORT_G*(iz+1)],D=support[ix+1+SUPPORT_G*(iz+1)];if(![A,B,C,D].every(Number.isFinite))return Math.max(A,B,C,D);return THREE.MathUtils.lerp(THREE.MathUtils.lerp(A,B,tx),THREE.MathUtils.lerp(C,D,tx),tz);}
  function groundHeight(x,z){const terrainY=bearingTerrainHeight(x,z);return insideApparatus(x,z)?Math.max(terrainY,APPARATUS_TOP):terrainY;}
  // Spatial field vocabulary. Legacy names remain aliases while consumers migrate.
  const supportY=groundHeight,terrainY=terrainHeight,exactSupportY=groundHeightExact;
  // Fluid/world columns need bathymetry, not the bearing-support plinth top. Inside the
  // finite apparatus a missing terrain column terminates at the physical world bottom.
  function worldBedHeight(x,z){if(!insideApparatus(x,z))return-Infinity;const terrainY=terrainHeight(x,z);return Number.isFinite(terrainY)?terrainY:APPARATUS_BOTTOM;}


  function raise(center,{radius=3.2,height=2.2}={}){
    const r=Math.max(.3,radius),h=Math.max(.04,height),ix0=Math.max(1,Math.floor((center.x-r-MIN.x)/(MAX.x-MIN.x)*(NX-1))-1),ix1=Math.min(NX-2,Math.ceil((center.x+r-MIN.x)/(MAX.x-MIN.x)*(NX-1))+1),iz0=Math.max(1,Math.floor((center.z-r-MIN.z)/(MAX.z-MIN.z)*(NZ-1))-1),iz1=Math.min(NZ-2,Math.ceil((center.z+r-MIN.z)/(MAX.z-MIN.z)*(NZ-1))+1);
    for(let z=iz0;z<=iz1;z++)for(let x=ix0;x<=ix1;x++){const p=wp(x,0,z),radial=Math.hypot(p.x-center.x,p.z-center.z);if(radial>=r)continue;const w=1-radial/r,delta=h*w*w*(3-2*w);for(let y=1;y<NY-1;y++)field[idx(x,y,z)]+=delta;}
    const dirty={x0:ix0,x1:ix1,z0:iz0,z1:iz1};rebuild(dirty);rebuildSupport(dirty);return{radius:r,height:h};
  }

  function lower(center,{radius=3.2,depth=2.2}={}){
    const r=Math.max(.3,radius),d=Math.max(.04,depth),ix0=Math.max(1,Math.floor((center.x-r-MIN.x)/(MAX.x-MIN.x)*(NX-1))-1),ix1=Math.min(NX-2,Math.ceil((center.x+r-MIN.x)/(MAX.x-MIN.x)*(NX-1))+1),iz0=Math.max(1,Math.floor((center.z-r-MIN.z)/(MAX.z-MIN.z)*(NZ-1))-1),iz1=Math.min(NZ-2,Math.ceil((center.z+r-MIN.z)/(MAX.z-MIN.z)*(NZ-1))+1);
    for(let z=iz0;z<=iz1;z++)for(let x=ix0;x<=ix1;x++){const p=wp(x,0,z),radial=Math.hypot(p.x-center.x,p.z-center.z);if(radial>=r)continue;const w=1-radial/r,delta=d*w*w*(3-2*w);for(let y=1;y<NY-1;y++)field[idx(x,y,z)]-=delta;}
    const dirty={x0:ix0,x1:ix1,z0:iz0,z1:iz1};rebuild(dirty);rebuildSupport(dirty);return{radius:r,depth:d};
  }

  function excavate(center,{radius=.62,depth=.34}={}){
    const r=Math.max(.3,radius),d=Math.max(.04,depth),ix0=Math.max(1,Math.floor((center.x-r-MIN.x)/(MAX.x-MIN.x)*(NX-1))-1),ix1=Math.min(NX-2,Math.ceil((center.x+r-MIN.x)/(MAX.x-MIN.x)*(NX-1))+1),iz0=Math.max(1,Math.floor((center.z-r-MIN.z)/(MAX.z-MIN.z)*(NZ-1))-1),iz1=Math.min(NZ-2,Math.ceil((center.z+r-MIN.z)/(MAX.z-MIN.z)*(NZ-1))+1);
    for(let z=iz0;z<=iz1;z++)for(let x=ix0;x<=ix1;x++){const p=wp(x,0,z),radial=Math.hypot(p.x-center.x,p.z-center.z);if(radial>=r)continue;const w=1-radial/r,delta=d*w*w;for(let y=1;y<NY-1;y++)field[idx(x,y,z)]-=delta;}
    const dirty={x0:ix0,x1:ix1,z0:iz0,z1:iz1};rebuild(dirty);rebuildSupport(dirty);return{radius:r,depth:d};
  }

  function impact(center,{magnitude=1}={}){
    const e=Math.max(.02,magnitude),radius=.72+.62*Math.sqrt(e),depth=.16+.72*Math.pow(e,.82),rim=.035+.16*Math.pow(e,.72),peakStrength=e>=.72?(.035+.13*Math.pow((e-.72)/.83,.72)):0,peakRadius=radius*.24;
    const ix0=Math.max(1,Math.floor((center.x-radius-MIN.x)/(MAX.x-MIN.x)*(NX-1))-1),ix1=Math.min(NX-2,Math.ceil((center.x+radius-MIN.x)/(MAX.x-MIN.x)*(NX-1))+1);
    const iz0=Math.max(1,Math.floor((center.z-radius-MIN.z)/(MAX.z-MIN.z)*(NZ-1))-1),iz1=Math.min(NZ-2,Math.ceil((center.z+radius-MIN.z)/(MAX.z-MIN.z)*(NZ-1))+1);
    const yr=radius*.62,iy0=Math.max(1,Math.floor((center.y-yr-MIN.y)/(MAX.y-MIN.y)*(NY-1))-1),iy1=Math.min(NY-2,Math.ceil((center.y+yr-MIN.y)/(MAX.y-MIN.y)*(NY-1))+1);
    for(let z=iz0;z<=iz1;z++)for(let y=iy0;y<=iy1;y++)for(let x=ix0;x<=ix1;x++){
      const p=wp(x,y,z),dx=p.x-center.x,dz=p.z-center.z,radial=Math.hypot(dx,dz),dy=p.y-center.y;
      const bowl=Math.hypot(dx,dy*.82,dz);
      if(bowl<radius*.72){const w=1-bowl/(radius*.72);field[idx(x,y,z)]-=depth*w*w;}
      if(radial>radius*.62&&radial<radius&&Math.abs(dy)<radius*.48){const ring=Math.sin(Math.PI*(radial-radius*.62)/(radius*.38)),vertical=Math.max(0,1-Math.abs(dy-radius*.08)/(radius*.48));field[idx(x,y,z)]+=rim*ring*vertical;}
      if(peakStrength>0&&radial<peakRadius&&Math.abs(dy)<radius*.32){const radialWeight=1-radial/peakRadius,vertical=Math.max(0,1-Math.abs(dy-radius*.02)/(radius*.32));field[idx(x,y,z)]+=peakStrength*radialWeight*radialWeight*vertical;}
    }
    const dirty={x0:ix0,x1:ix1,z0:iz0,z1:iz1};rebuild(dirty);rebuildSupport(dirty);
    return{magnitude:e,radius,depth,rim,centralUplift:peakStrength};
  }
  function snapshot(){return{seed,field:field.slice()}}
  function restore(state){if(!state?.field||state.field.length!==field.length)throw new Error("Invalid terrain snapshot");seed=state.seed|0;field.set(state.field);rebuild();rebuildSupport();return seed}
  function reset(){field.set(initial);rebuild();rebuildSupport();}
  function loadLandCandidate({rebuild:doRebuild=true}={}){synthesize(6);if(doRebuild){rebuild();rebuildSupport()}return LAND_CANDIDATE_A.id;}
  function rebuildAll(){rebuild();rebuildSupport();}
  function collideSphere(position,velocity,radius,restitution=.28,drag=.86){if(position.y-radius>=APPARATUS_TOP||position.y+radius<=APPARATUS_BOTTOM)return false;const b=boundary(position.x,position.z),minQ=APPARATUS_APOTHEM+radius;if(b.q>=minQ||b.q<=APPARATUS_APOTHEM)return false;const push=minQ-b.q;position.x+=b.nx*push;position.z+=b.nz*push;const vn=velocity.x*b.nx+velocity.z*b.nz;if(vn<0){velocity.x-=(1+restitution)*vn*b.nx;velocity.z-=(1+restitution)*vn*b.nz}velocity.x*=drag;velocity.z*=drag;return true;}
  function collideBearingState(state,radius,restitution=.28,drag=.86){
    if(state.y-radius>=APPARATUS_TOP||state.y+radius<=APPARATUS_BOTTOM)return false;
    const b=boundary(state.x,state.z),minQ=APPARATUS_APOTHEM+radius;if(b.q>=minQ||b.q<=APPARATUS_APOTHEM)return false;
    const push=minQ-b.q;state.x+=b.nx*push;state.z+=b.nz*push;const vn=state.vx*b.nx+state.vz*b.nz;
    if(vn<0){state.vx-=(1+restitution)*vn*b.nx;state.vz-=(1+restitution)*vn*b.nz}state.vx*=drag;state.vz*=drag;return true;
  }
  function segmentApparatusHit(a,b){let enter=0,exit=1,normal=null;const d=b.clone().sub(a),slabs=PLANES.map(([nx,nz])=>({n:new THREE.Vector3(nx,0,nz),c:APPARATUS_APOTHEM}));slabs.push({n:new THREE.Vector3(0,1,0),c:APPARATUS_TOP},{n:new THREE.Vector3(0,-1,0),c:-APPARATUS_BOTTOM});for(const s of slabs){const da=s.n.dot(a)-s.c,dd=s.n.dot(d);if(Math.abs(dd)<1e-8){if(da>0)return null;continue}const t=-da/dd;if(dd<0){if(t>enter){enter=t;normal=s.n}}else exit=Math.min(exit,t);if(enter>exit)return null}return enter>=0&&enter<=1&&normal?{t:enter,point:a.clone().lerp(b,enter),normal:normal.clone()}:null;}
  rebuild();rebuildSupport();
  return{mesh,apparatus,field,rebuild,impact,excavate,raise,lower,snapshot,restore,reset,loadLandCandidate,rebuildAll,supportY,terrainY,exactSupportY,groundHeight,groundHeightExact,worldBedHeight,bearingTerrainHeight,terrainHeight,insideMaterial,insideApparatus,materialBoundary,collideSphere,collideBearingState,segmentApparatusHit,belowPlinthOcclusion,occludeBelowPlinth,landCandidate:()=>({...LAND_CANDIDATE_A}),inspect:()=>({grid:[NX,NY,NZ],volume:{min:[MIN.x,MIN.y,MIN.z],max:[MAX.x,MAX.y,MAX.z],spacing:[(MAX.x-MIN.x)/(NX-1),(MAX.y-MIN.y)/(NY-1),(MAX.z-MIN.z)/(NZ-1)]},chunks:[CX,CZ],triangles:chunks.reduce((n,c)=>n+c.triangles,0),seed,apparatus:{radius:APPARATUS_RADIUS,top:APPARATUS_TOP,bottom:APPARATUS_BOTTOM},materialApothem:MATERIAL_APOTHEM})};
}