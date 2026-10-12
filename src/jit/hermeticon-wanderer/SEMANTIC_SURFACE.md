# Hermeticon Wanderer — semantic surface
Updated 2026-10-12 · Current build: `hermeticon-wanderer-observer-pruned-v48`

## Current executable reality

- Source: `bonoj/Repository/src/jit/hermeticon-wanderer/index.html`. JIT mirror: `bonoj/bonoj.github.io/jit/hermeticon-wanderer/index.html`; public URL: https://bonoj.github.io/jit/hermeticon-wanderer/?terrain=authored-v1. The executable is authoritative.
- Player-accepted navigation/weather baseline (V31): tap replaces walking target, drag orbits, pinch zooms; world aperture follows after Wanderer leaves central 25% of circular area (half-radius). Persistent geology and BBs use world coordinates; the aperture does not own or destroy offscreen matter. Upper dome manifests weather; lower bowl is physical. Terrain seating, bowl trajectory contact, partial-cloud emission remain imperfect or not fully verified.
- Authored geology: deterministic signed field 85×21×85, 81 horizontal extraction chunks, localized rebuilds. 96 positive signed-field samples excavate to 96 BB transfer units, then deposit at receiver as geological field changes. Do not confuse BB accounting with proof of material lineage, continuous physical volume, or re-excavation.
- V48 observer: on-demand INSPECT shows bounded FPS, terrain locality counters, 96-unit transfer states, limited errors/events; COPY REPORT works on Android. Dormant GPU/scene witnesses, containment/invariant verifier, costly per-rebuild vertex diagnostic scan, and periodic JSON report regeneration were removed. No legacy observer machinery should be reintroduced in the simulation loop.

## Verified player witness

At 24.367 s on V48: **96 receiver / 0 source / 0 transit**, 75.1 FPS, 81 chunks, 1 full and 97 local rebuilds, last dirty chunks 1, last rebuild 3.4 ms, errors []. Transfer began at 2.901 s and completed at 14.906 s. COPY REPORT delivered this evidence successfully. One snapshot does not establish all-frame performance or independently prove geological conservation. Earlier V47 mid-transfer: 66 source / 12 transit / 18 receiver, 56.7 FPS, last rebuild 6.6 ms; comparisons are not controlled.

## Next experiment

Geology A → 96 material BBs → deposited geology B → destructive re-excavation into BBs, verifying material identities, counts, and field changes without inventing another engine. Keep normal observation negligible and bounded. For detailed chronology consult `WORLD_GENERATION_EXPERIMENT.md`; for boundary semantics `HERMETICON.md`; for material conservation `matter/MATTER.md`; for cold start `HANDOFF.md`. Historical V21/V31 witnesses belong to the experiment record, not current INSPECT instructions.
