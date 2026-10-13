import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Hermeticon is a composable world, not an apparatus.
export const hermeticon = {
 group: new THREE.Group(),
 inspect(){ return {name:'Hermeticon',children:this.group.children.length}; }
};
hermeticon.group.name='Hermeticon';
