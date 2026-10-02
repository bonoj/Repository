import {deriveTerrainSpatialEvidence} from "./terrain-spatial-evidence.js";

export function createObservationAnalysisSystem({world,components}){
  const {Observation,SpatialAnalysis}=components;
  function analyze(observationEntity){
    const observation=Observation.get(observationEntity),derived=deriveTerrainSpatialEvidence(observation);
    if(!derived)return null;
    const analysis={sourceObservation:observationEntity,observer:observation.observer,sampledAtMs:observation.sampledAtMs,...derived};
    const id=world.entity();world.add(id,SpatialAnalysis,analysis);return{id,...analysis};
  }
  return{analyze,inspect:()=>world.query(SpatialAnalysis).map(id=>({id,...SpatialAnalysis.get(id)}))};
}
