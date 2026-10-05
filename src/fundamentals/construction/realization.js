// Spatial realization data for semantic construction.
// Frames belong to a realization, never to semantic ports.

export function realizationFrames(entries=[]){
  const frames=new Map();
  for(const entry of entries){
    const key=`${entry.thing}::${entry.port}`;
    if(frames.has(key))throw new Error(`Duplicate realization frame ${key}`);
    frames.set(key,Object.freeze({
      position:Object.freeze([...(entry.position??[0,0,0])]),
      outward:Object.freeze([...(entry.outward??[0,1,0])]),
      up:Object.freeze([...(entry.up??[0,0,1])])
    }));
  }
  return Object.freeze({
    frame(thing,port){return frames.get(`${thing}::${port}`)??null},
    has(thing,port){return frames.has(`${thing}::${port}`)},
    entries(){return [...frames.entries()]}
  });
}
