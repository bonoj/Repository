// Fundamentals material vocabulary.
// Clean clones of proven visual values. Legacy owners remain untouched.
// Consumers create their own THREE materials from these inert descriptions.

export const MATERIALS = Object.freeze({
  warmWhite: Object.freeze({ kind:'standard', color:0xf0f0ed, roughness:.68, metalness:.04 }),
  charcoalMetal: Object.freeze({ kind:'standard', color:0x252724, roughness:.34, metalness:.58 }),
  brass: Object.freeze({ kind:'standard', color:0x9b6638, roughness:.34, metalness:.62 }),
  brassBearing: Object.freeze({ kind:'standard', color:0x9b6638, roughness:.30, metalness:.50 }),
  cyanMetal: Object.freeze({ kind:'standard', color:0x62aeb4, roughness:.26, metalness:.46 }),
  paleMetal: Object.freeze({ kind:'standard', color:0xb9b7aa, roughness:.38, metalness:.36 }),
  glass: Object.freeze({
    kind:'physical', color:0xb9b7aa, roughness:.12, metalness:.04,
    transparent:true, opacity:.28, transmission:.72, thickness:.08, ior:1.2,
    depthWrite:false, side:'double'
  })
});

export function materialDescriptor(name){
  const descriptor=MATERIALS[name];
  if(!descriptor)throw new Error(`Unknown Fundamental material: ${name}`);
  return descriptor;
}
