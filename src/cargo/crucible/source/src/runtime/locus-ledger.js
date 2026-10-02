export function createLocusLedger({build,station,footprints,apertures,maxEntries=240}){
  const entries=[];
  function append(observation,analysis){
    entries.push({observation:structuredClone(observation),analysis:analysis?structuredClone(analysis):null});
    if(entries.length>maxEntries)entries.splice(0,entries.length-maxEntries);
  }
  function snapshot(){
    const stationState=station.inspect(),footprint=footprints.inspect(station.id);
    return{
      format:"crucible-locus-ledger",version:1,
      exportedAt:new Date().toISOString(),build,
      instrument:{
        station:{kind:stationState.kind,donor:stationState.donor,motion:stationState.motion},
        footprint:{kind:footprint.kind,halfAngle:footprint.halfAngle,maxObservedRadius:footprint.radius},
        apertures:apertures.inspect()
      },
      retention:{kind:"rolling",maxEntries,count:entries.length},
      entries:structuredClone(entries)
    };
  }
  function download(){
    const data=snapshot(),blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=`crucible-locus-${String(build||"local").slice(0,7)}-${Date.now()}.json`;
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    return data;
  }
  return{append,snapshot,download,clear:()=>entries.splice(0),inspect:()=>({entries:entries.length,maxEntries})};
}
