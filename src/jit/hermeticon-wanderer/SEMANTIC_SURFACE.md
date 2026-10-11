# Hermeticon Wanderer — semantic surface
Updated 2026-10-11. Status: v6 verified by user screenshots and runtime report; world/aperture separation not yet implemented.

## Purpose and architecture
Hermeticon Wanderer is an executable, perturbable, persistent world observed through a canonical glass-and-brass bauble. **The bauble is an observation aperture, not a world boundary.** A larger square terrain field exists in world coordinates outside the sphere. Wanderer eventually moves the viewing aperture over that world. World state, geology, time and material persist outside the view.

Ownership:
- **World:** authoritative signed matter field, absolute coordinates, deformation, physics, history, storage chunks.
- **Aperture:** visibility of the world within the sphere, not removal or creation of matter.
- **Vessel:** glass, brass, lighting, camera, orbit/pinch, UI, telemetry, containment of displayed geometry.
- **Wanderer:** observation transform; moving it never translates or regenerates the world.

Square chunks are computation/storage boundaries, not geological boundaries. Keep world y=0 as the fixed equatorial datum. Never normalize heights per chunk. A mountain, stream or tunnel can cross a chunk seam and leave the aperture without terminating.

## Location and evidence
Source: `bonoj/Repository/src/jit/hermeticon-wanderer/index.html`
Public mirror: `bonoj/bonoj.github.io/master:jit/hermeticon-wanderer/index.html`
URL: https://bonoj.github.io/jit/hermeticon-wanderer/
Canonical empty scaffold: `bonoj/bonoj.github.io/master:jit/bauble/index.html`
Procedure: `bonoj/Repository/src/jit/README.md` and `bonoj/Gate/README.md`.
Current build: `hermeticon-wanderer-canonical-v6`.

User screenshots show satisfying low-poly raised/lowered terrain, through-holes, underside, cyan interior lighting, glass, brass ring, working orbit and zoom. User is very happy with the terrain geometry. Known visual issues: artificially circular jagged disk boundary; torn-looking facets in some holes; crowded HUD/build/INSPECT; stale EMPTY VESSEL label.

User runtime report (2026-10-11): 43×21×43 signed samples (38,829); 7,963 solid; 30,866 void; 29,128 mesh triangles / 87,384 vertices, double-sided. Four vertical through-holes and seven top/bottom raise/lower operations per deterministic seed. Seed 743 cycle 7; rebuild 68.1 ms (recorded cycles ~59–72 ms). Render 12 calls, 48,952 triangles, 14 geometries; ~58.99 FPS in report, ~71–88 on screenshots. 25 containment checks with zero reported violations; 25 generic invariant checks with zero failures; no warnings. Fixed 8ms step: 6,253 steps, 50.024 simulated seconds, 8.419 dropped seconds. Interaction trace of 132 events demonstrates orbit, pinch, inspect, copy. These checks do NOT prove mesh watertightness, tunnel connectivity, conservation or continuous simulation time.

## Current implementation versus contract
V6 samples a square volume but physically truncates the signed material with a circular `R - hypot(x,z)` constraint and a spherical `9.91 - hypot(x,y,z)` constraint. The disk wall is generated terrain, **not an optical aperture**. It also autonomously cycles seeds, regenerating local geology. That is a successful volumetric geometry torture test, not a persistent world.

The canonical bauble, fixed-step simulation, containment and inspection are present. The active v6 does NOT yet contain integrated water, bead transport, gathering, fabrication, chunk streaming or a moving Wanderer. Earlier experiments exist as `waterworld-v2.html`, `geological-history-torture.js`, `genesis-preserved-v1.html`; they are evidence and reusable parts, not currently running v6 systems. Waterworld handoff: `src/jit/waterworld/WATERWORLD.md`.

## Next experiments and acceptance
1. Replace radial/spherical material constraints with a larger world-coordinate square terrain field. Preserve signed-field extraction, holes, deformations and canonical bauble.
2. Make visibility clipping an explicit rendering/aperture operation; terrain continues outside. No artificial circular wall or taper. Keep the containment verifier meaningful for rendered geometry; do not disable it to accommodate unbounded authoritative world state.
3. Prove continuity by translating the aperture across fixed deterministic world terrain; the same tunnel should be recoverable as the view moves.
4. Retain build/FPS/INSPECT/COPY REPORT, camera controls, fixed-step accounting, meaningful invariants and errors. Repair HUD status/overlap without replacing the UI.
5. Then compose geology, excavation, water, beads, gravity, material gathering and fabrication. Candidate water design: separate shallow-water domains connected by discrete gravity-driven material transport through holes. This is a hypothesis, not an implemented capability.

Avoid a premature general 3D fluid solver, new bauble scaffold, bespoke delivery pipeline, or claims of runtime correctness based solely on passing generic checks. Build phone-first; preserve deterministic evidence; reuse solved systems. 🐉
