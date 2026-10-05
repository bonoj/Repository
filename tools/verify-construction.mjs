import {constructionThing,construction,relate,detach,portAvailable} from "../src/fundamentals/construction/construction.js";
import {realizationFrames} from "../src/fundamentals/construction/realization.js";

const post=constructionThing({id:"post-A",kind:"post",ports:[{id:"top",kind:"support"},{id:"bottom",kind:"support"}]});
const slab=constructionThing({id:"slab-B",kind:"slab",ports:[{id:"underside",kind:"support"}]});
let g=construction({things:[post,slab]});
g=relate(g,{a:{thing:"post-A",port:"top"},b:{thing:"slab-B",port:"underside"}});
if(portAvailable(g,"post-A","top"))throw new Error("occupied construction port reported available");
let rejected=false;try{relate(g,{a:{thing:"post-A",port:"top"},b:{thing:"slab-B",port:"underside"}})}catch{rejected=true}
if(!rejected)throw new Error("duplicate construction attachment was accepted");
g=detach(g,g.relations[0]);
if(!portAvailable(g,"post-A","top")||!portAvailable(g,"slab-B","underside"))throw new Error("detach did not restore semantic availability");
const frames=realizationFrames([{thing:"post-A",port:"top",position:[0,1,0],outward:[0,1,0],up:[0,0,1]}]);
if(!frames.has("post-A","top"))throw new Error("realization frame missing");
console.log("Semantic construction substrate verified.");
