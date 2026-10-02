export function createCinnabarKiteSystem({THREE,scene,field,dome}){
  const root=new THREE.Group();root.name="cinnabar-kite";
  const paper=new THREE.MeshStandardMaterial({color:0xeee8d6,roughness:.82,metalness:0,side:THREE.DoubleSide}),
    seam=new THREE.MeshStandardMaterial({color:0x7c684f,roughness:.72,metalness:.08,side:THREE.DoubleSide}),
    lineMat=new THREE.LineBasicMaterial({color:0xd8cfb8,transparent:true,opacity:.72});
  // A deliberately overbuilt prototype: articulated cloth grid with deterministic analytic wind.
  const cols=14,rows=28,width=.72,length=2.65,count=(cols+1)*(rows+1),
    positions=new Float32Array(count*3),indices=[];
  for(let r=0;r<=rows;r++)for(let c=0;c<=cols;c++){const i=r*(cols+1)+c,u=c/cols-.5,v=r/rows;positions[i*3]=u*width*(1-.38*v);positions[i*3+1]=-v*length;positions[i*3+2]=0;}
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const a=r*(cols+1)+c,b=a+1,d=(r+1)*(cols+1)+c,e=d+1;indices.push(a,d,b,b,d,e);}
  const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();
  const cloth=new THREE.Mesh(geo,paper);cloth.castShadow=true;root.add(cloth);
  const spine=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,length,6),seam);spine.position.y=-length*.5;root.add(spine);
  const lineGeo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),line=new THREE.Line(lineGeo,lineMat);scene.add(line);
  root.visible=false;scene.add(root);
  const scored=field.turn(2),snap=field.turn(7),flag=field.turn(9),anchorLocal=new THREE.Vector3(0,3.36,0),anchor=new THREE.Vector3(),target=new THREE.Vector3(),linePos=lineGeo.getAttribute("position");
  let progress=0,tension=0,snapped=false,snapOrigin=new THREE.Vector3();
  function smooth(t){return t*t*(3-2*t)}
  function update(fieldNow){
    dome.object.localToWorld(anchor.copy(anchorLocal));
    progress=THREE.MathUtils.clamp((fieldNow-scored.at)/scored.duration,0,1);
    root.visible=progress>0;line.visible=progress>0;if(progress<=0)return;
    const p=smooth(progress),phase=fieldNow*.001;
    // The kite climbs downwind and never becomes a free body; every point is derived from score time.
    target.set(anchor.x+4.2*p+Math.sin(phase*.43)*.28,anchor.y+1.2+5.8*p+Math.sin(phase*.71)*.16,anchor.z-2.4*p+Math.cos(phase*.37)*.34);
    if(snap&&fieldNow>=snap.at){
      if(!snapped){snapped=true;snapOrigin.copy(target);}
      const age=(fieldNow-snap.at)/1000;
      if(flag&&fieldNow>=flag.at){
        const q=THREE.MathUtils.clamp((fieldNow-flag.at)/flag.duration,0,1),e=q*q*(3-2*q);
        root.position.set(THREE.MathUtils.lerp(snapOrigin.x+.62*age,-6.1,e),THREE.MathUtils.lerp(snapOrigin.y+.16*age-.018*age*age,7.15,e),THREE.MathUtils.lerp(snapOrigin.z-.35*age,-4.4,e));
        root.scale.set(THREE.MathUtils.lerp(1,.42,e),THREE.MathUtils.lerp(1,.68,e),1);
      }else{
        root.position.set(snapOrigin.x+.62*age+Math.sin(phase*.73)*.18,snapOrigin.y+.16*age-.018*age*age+Math.sin(phase*1.31)*.12,snapOrigin.z-.35*age+Math.cos(phase*.67)*.20);
        root.scale.set(1,1,1);
      }
      line.visible=false;
    }else{snapped=false;root.position.copy(target);line.visible=true;}
    root.rotation.set(.16+Math.sin(phase*.61)*.07,Math.atan2(-2.4,4.2)-Math.PI/2,.18+Math.sin(phase*.83)*.11+(snapped?Math.sin(phase*2.2)*.14:0));
    const a=geo.getAttribute("position");
    for(let r=0;r<=rows;r++)for(let c=0;c<=cols;c++){const i=r*(cols+1)+c,u=c/cols-.5,v=r/rows,baseX=u*width*(1-.38*v),baseY=-v*length;
      const edge=Math.abs(u)*2,wave=Math.sin(phase*3.1+v*9.4+u*2.7)*(.025+.095*v)+Math.sin(phase*5.7-v*14)*.028*v;
      a.setXYZ(i,baseX+Math.sin(phase*1.7+v*5)*.018*v,baseY,wave*(.45+.55*edge));
    }
    a.needsUpdate=true;geo.computeVertexNormals();
    if(!snapped){linePos.setXYZ(0,anchor.x,anchor.y,anchor.z);linePos.setXYZ(1,target.x,target.y,target.z);linePos.needsUpdate=true;lineGeo.computeBoundingSphere();}
    tension=snapped?0:THREE.MathUtils.clamp(target.distanceTo(anchor)/7.8,0,1);
  }
  return{object:root,line,update,inspect:()=>({kind:"tethered-pale-kite",turn:2,progress:Number(progress.toFixed(3)),tension:Number(tension.toFixed(3)),position:[root.position.x,root.position.y,root.position.z],clothVertices:count,tethered:!snapped,snapped,behavior:snapped?"deterministic-free-drift":"deterministic-analytic-wind"})};
}
