// Fundamentals camera vocabulary.
// Runtime-native descriptors cloned from proven Betwixt camera values.
// No scene, renderer, controls, or locus ownership lives here.

export const CAMERAS=Object.freeze({
  worldPerspective:Object.freeze({
    kind:'perspective',
    fov:48,
    near:.03,
    far:1000
  })
});

export function cameraDescriptor(name){
  const descriptor=CAMERAS[name];
  if(!descriptor)throw new Error(`Unknown Fundamental camera: ${name}`);
  return descriptor;
}
