// Pure projection from an exported locus ledger. This module has no world, terrain,
// renderer, ECS, meteor, or station-system dependency.
export function buildInferenceParcel(ledger,{maxObservations=24}={}){
  if(!ledger||ledger.format!=="crucible-locus-ledger")throw new Error("Expected a Crucible locus ledger");
  const entries=Array.isArray(ledger.entries)?ledger.entries.slice(-Math.max(1,maxObservations)):[];
  return{
    format:"crucible-inference-parcel",
    version:1,
    source:{
      ledgerFormat:ledger.format,
      ledgerVersion:ledger.version,
      build:ledger.build,
      instrument:structuredClone(ledger.instrument),
      exportedAt:ledger.exportedAt
    },
    boundary:{
      statement:"This parcel contains recorded locus evidence and optional blind derivations only. It is not authoritative Crucible world state.",
      omittedByDesign:[
        "authoritative terrain state",
        "meteor event history",
        "hidden ECS state",
        "controlled-probe labels",
        "object identities not measured by an aperture",
        "objectives",
        "personality or identity instructions"
      ]
    },
    available:{
      observations:entries.map(({observation,analysis})=>({
        observation:structuredClone(observation),
        analysis:analysis?structuredClone(analysis):null
      }))
    }
  };
}
