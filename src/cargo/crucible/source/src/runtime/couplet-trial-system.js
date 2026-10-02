export function createCoupletTrialSystem({THREE,scene,terrain,field}){
  const root=new THREE.Group();root.name="clockchain";
  const brass=new THREE.MeshStandardMaterial({color:0x9b6a2f,roughness:.46,metalness:.72});
  const dark=new THREE.MeshStandardMaterial({color:0x4d3a24,roughness:.55,metalness:.64});
  const humanMat=new THREE.MeshStandardMaterial({color:0xc9d2d0,roughness:.3,metalness:.78});
  const modelMat=new THREE.MeshStandardMaterial({color:0xd28a38,roughness:.42,metalness:.55});
  const base=new THREE.Mesh(new THREE.CylinderGeometry(.72,.86,.18,8),dark);base.position.y=.09;root.add(base);
  const rail=new THREE.Mesh(new THREE.BoxGeometry(1.45,.10,.22),brass);rail.position.y=.36;root.add(rail);
  const plunger=new THREE.Mesh(new THREE.CylinderGeometry(.16,.20,.42,10),brass);plunger.position.y=.62;root.add(plunger);
  const px=-3.3,pz=2.7,domeX=2.7,domeZ=1.8;root.position.set(px,terrain.groundHeight(px,pz),pz);scene.add(root);

  const linkGeo=new THREE.TorusGeometry(.045,.012,5,8);
  const specs=[
    {owner:"human",x:-.48,geo:new THREE.IcosahedronGeometry(.17,1),mat:humanMat},
    {owner:"model",x:.48,geo:new THREE.OctahedronGeometry(.20,0),mat:modelMat}
  ];
  const tokens=specs.map(spec=>{
    const cup=new THREE.Mesh(new THREE.TorusGeometry(.20,.045,7,18),dark);cup.rotation.x=Math.PI/2;cup.position.set(spec.x,.48,0);root.add(cup);
    const token=new THREE.Mesh(spec.geo,spec.mat);token.castShadow=true;token.position.set(spec.x,.70,0);root.add(token);
    const chain=new THREE.Group();root.add(chain);const links=[];
    for(let i=0;i<11;i++){const link=new THREE.Mesh(linkGeo,brass);chain.add(link);links.push(link);}
    return{owner:spec.owner,x:spec.x,token,chain,links};
  });

  const seatedY=.70,raisedY=1.92,riseMs=1800,bob=.045;
  const transit=field.turn(3);
  let state="parked",winner=null,resolvedAt=null,lastFieldNow=0;
  function hash32(text){
    // FNV-1a gathers the complete Clockchain head; a final avalanche prevents
    // low-bit structure in similar ledger strings from becoming initiative bias.
    let h=2166136261>>>0;
    for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}
    h^=h>>>16;h=Math.imul(h,0x7feb352d);h^=h>>>15;h=Math.imul(h,0x846ca68b);h^=h>>>16;
    return h>>>0;
  }
  function updateChain(t){
    const ay=.54,ty=t.token.position.y;
    for(let i=0;i<t.links.length;i++){const q=(i+1)/(t.links.length+1),link=t.links[i];link.position.set(t.x,THREE.MathUtils.lerp(ay,ty,q),0);link.rotation.set(Math.PI/2,i%2?Math.PI/2:0,0);}
  }
  function resolve(now){
    const existing=field.terminalResolution();if(existing)return existing;
    const seed=hash32(field.clockchainHead()),owner=(seed&1)===0?"human":"model";
    return field.recordResolution({owner,method:"clockchain-derived-v2",at:field.frontier(),seed});
  }
  function update(fieldNow){
    lastFieldNow=fieldNow;
    // Turn 3: the whole mechanism descends through the plinth, travels while buried,
    // then re-emerges at the center of the brass dome. Children come with it.
    let x=px,z=pz,depth=0;
    if(transit&&fieldNow>=transit.at){
      const u=Math.min(1,Math.max(0,(fieldNow-transit.at)/transit.duration));
      if(u<.34){const q=u/.34;depth=-2.35*(q*q*(3-2*q));}
      else if(u<.62){const q=(u-.34)/.28,e=q*q*(3-2*q);x=THREE.MathUtils.lerp(px,domeX,e);z=THREE.MathUtils.lerp(pz,domeZ,e);depth=-2.35;}
      else {x=domeX;z=domeZ;const q=(u-.62)/.38,e=q*q*(3-2*q);depth=THREE.MathUtils.lerp(-2.35,0,e);}
    }
    const ground=terrain.groundHeight(x,z);root.position.set(x,(Number.isFinite(ground)?ground:0)+depth,z);
    if(!field.terminalResolution()&&fieldNow>=field.frontier())resolve(fieldNow);
    const resolved=field.terminalResolution();
    // Presentation is derived every frame from the CURRENT terminal resolution.
    // Historical winners cannot remain raised after another turn is appended or
    // while replay is still moving through scored history.
    const active=resolved&&fieldNow>=field.frontier()&&fieldNow>=resolved.at;
    if(active){winner=resolved.owner;resolvedAt=resolved.at;state="resolved";}
    else {winner=null;resolvedAt=null;state="parked";}
    for(const t of tokens){
      if(t.owner===winner){
        const age=Math.max(0,fieldNow-(resolvedAt??fieldNow)),u=Math.min(1,age/riseMs),ease=1-Math.pow(1-u,3);
        t.token.position.y=THREE.MathUtils.lerp(seatedY,raisedY,ease)+(u>=1?Math.sin(age*.0032)*bob:0);
      }else t.token.position.y=seatedY;
      updateChain(t);
    }
  }
  function advance(){
    const frontier=field.frontier();
    if(lastFieldNow<frontier){field.fastForwardTo(field.nextTurnStart(lastFieldNow));return "fast-forward";}
    if(!field.terminalResolution()){resolve(lastFieldNow);return "clockchain";}
    return state;
  }
  function contains(object){for(let o=object;o;o=o.parent)if(o===root)return true;return false;}
  update(0);
  return{object:root,tokens,advance,update,contains,inspect:()=>({kind:"clockchain",state,winner,rule:"ledger-derived winner; vertical local suspension",terrainGrounded:true,tokens:tokens.map(t=>({owner:t.owner,localY:t.token.position.y}))})};
}
