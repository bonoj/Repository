export function createImpactSystem(){
  const listeners=new Set();
  return{
    subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},
    emit(event){for(const fn of listeners)fn(event)},
    inspect(){return{kind:"world-impact-bus",listeners:listeners.size}}
  };
}
