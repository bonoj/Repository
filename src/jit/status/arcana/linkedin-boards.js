import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {CSS3DObject} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/renderers/CSS3DRenderer.js';
// A matched pair of physical brass boards and camera-projected DOM surfaces.
// LinkedIn forbids embedding on many clients: use real navigable profile links.
export function mountLinkedInBoards(hermeticon){
 const group=hermeticon.content;
 const brass=new T.MeshStandardMaterial({color:0x94703b,metalness:.86,roughness:.28,side:T.DoubleSide});
 const edge=new T.MeshStandardMaterial({color:0xe0b76d,metalness:.75,roughness:.25});
 const boardGeometry=new T.BoxGeometry(5.15,7.15,.17);
 const profiles=[
  {side:'left',name:'JOHN BONO',subtitle:'EXECUTABLE WORLDS · R&D',url:'https://www.linkedin.com/search/results/people/?keywords=John%20Bono'},
  {side:'right',name:'MANUEL LEAL',subtitle:'STATUS: PRESENT AND ACCOUNTED FOR',url:'https://www.linkedin.com/in/manuel-leal-053384234'}
 ];
 const boards=[];
 for(const [i,p] of profiles.entries()){
  const pivot=new T.Group();pivot.position.set(i===0?-3.1:3.1,0,0);
  pivot.rotation.y=(i===0?1:-1)*Math.PI/4;group.add(pivot);
  const board=new T.Mesh(boardGeometry,brass);board.name=p.side+' brass board';pivot.add(board);
  const frame=new T.LineSegments(new T.EdgesGeometry(boardGeometry),new T.LineBasicMaterial({color:0xe0b76d}));pivot.add(frame);
  const el=document.createElement('article');el.className='profile-dom';el.style.cssText='width:500px;height:700px;box-sizing:border-box;background:linear-gradient(155deg,#142633,#09121b 70%);border:10px solid #b48a4a;box-shadow:inset 0 0 0 3px #e2bc7b;color:#ead8ad;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:32px;text-align:center;font-family:Georgia,serif;';
  const seal=document.createElement('div');seal.textContent='in';seal.style.cssText='font:bold 105px Arial;color:#d9b779;border:6px solid #97723b;width:150px;height:150px;border-radius:24px;display:grid;place-items:center';
  const name=document.createElement('div');name.textContent=p.name;name.style.cssText='font:bold 45px Georgia;letter-spacing:3px';
  const sub=document.createElement('div');sub.textContent=p.subtitle;sub.style.cssText='font:20px Arial;letter-spacing:2px;max-width:420px;line-height:1.5';
  const link=document.createElement('a');link.href=p.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='OPEN LINKEDIN ↗';link.style.cssText='font:bold 25px Arial;color:#f6d28d;text-decoration:underline;padding:20px';
  el.append(seal,name,sub,link);
  const dom=new CSS3DObject(el);dom.scale.set(.01,.01,.01);dom.position.z=.105;pivot.add(dom);
  boards.push({side:p.side,url:p.url,pivot,board});
 }
 hermeticon.inspect=()=>({name:'Hermeticon',panels:boards.map(b=>({side:b.side,rotationY:b.pivot.rotation.y,link:b.url,dom:true,brass:true})),vessel:'glass and brass'});
}
