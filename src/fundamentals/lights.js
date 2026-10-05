// Fundamentals light vocabulary.
// Runtime-native descriptors cloned from proven Betwixt lighting.
// Placement remains the responsibility of the consuming project.

export const LIGHTS=Object.freeze({
  worldHemisphere:Object.freeze({
    kind:'hemisphere',
    skyColor:0xfff9ef,
    groundColor:0xc7c4be,
    intensity:1.7
  }),

  worldKey:Object.freeze({
    kind:'directional',
    color:0xfff4df,
    intensity:2.2,
    position:Object.freeze([0,24,0]),
    castShadow:true,
    shadow:Object.freeze({
      mapSize:Object.freeze([1024,1024]),
      left:-18,
      right:18,
      top:18,
      bottom:-18,
      near:.5,
      far:60,
      bias:-.00015
    })
  }),

  warmLamp:Object.freeze({
    kind:'point',
    color:0xffb35a,
    intensity:1.7,
    distance:3.4,
    decay:2
  }),

  warmTorch:Object.freeze({
    kind:'point',
    color:0xffb45c,
    intensity:.20,
    distance:.52,
    decay:2
  }),

  warmBeacon:Object.freeze({
    kind:'point',
    color:0xffb35a,
    intensity:2.2,
    distance:4.2,
    decay:2
  })
});

export function lightDescriptor(name){
  const descriptor=LIGHTS[name];
  if(!descriptor)throw new Error(`Unknown Fundamental light: ${name}`);
  return descriptor;
}
