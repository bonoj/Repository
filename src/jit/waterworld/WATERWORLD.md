# Waterworld — semantic surface / cold-start handoff
Updated 2026-10-10. Status: paused after v25. This file records executable reality and observed evidence; source HTML remains authoritative.

## Find it / resume
Live: https://bonoj.github.io/jit/waterworld/
Source: bonoj/Repository `src/jit/waterworld/index.html`
Published: bonoj/bonoj.github.io `jit/waterworld/index.html`
Latest published build: `waterworld-smooth-surface-v25`; deployment commit `566c8b03a693076267d67efa377bc378ee35ee38`; source commit `0eadeaccbb8d5d8eb18d12988665a801c43617ad`.
Edit source via GitHub connector fetch_file/update_file using current blob SHA. Then fetch source and destination and update deployed file with exact source content and current destination SHA; verify content SHAs match. Never call published/live before successful commit; matching GitHub blobs do not prove Pages CDN/browser has updated. Keep canonical URL, no cache-busting query strings. Inspect build string and user feedback.

## What this is
A mobile-first Three.js glass bauble, radius outer 10.25, inner 10.07, wall .18. Initial 245,944 conserved units: 215,944 in collector (~20% spherical fill), 30,000 in shrinking source sphere radius 3.05. Source emits ballistic beads under moving pendular point gravity (orbital radius 12.2, period 18s, swing .36 radians, center strength 13.5). Wind baseline 3.1. Beads impact, splash, settle, and transfer to collector. Buttons DRIP/PLOP/THUMP/RESET/INSPECT; touch orbit/pinch. THUMP injects radial outward velocity into wet cells; many repeated THUMPs should conserve inventory and remain responsive.

## Simulation and rendering are distinct
Authoritative transport: 64×64 shallow-water grid, `bed`, `depthField`, `velX`, `velZ`, `wet`, `stepWater`. Surface scalar h(x,z)=bed+depth for wet cells; donor-cell volume transfers conserve transport inventory, but this is not a fully momentum-conserving SWE solver. Static `wet` mask denotes valid spherical footprint, not necessarily occupied water. `sampleHeight` is nearest-cell and can return basin bottom on dry cells. Avoid using dry-cell bed as a water surface.
Visual: restored clipped spherical `basin` gives convincing volume; circular radial triangle `waterSurface` is a separate visible sheet. `updateWindVisual` samples the grid into the radial mesh; as of v25 `renderedHeight(x,z)` uses wet-neighbor normalized bilinear interpolation for **rendering only**. It does not smooth or mutate simulation depths or momentum. Rendering and authoritative field need not exactly coincide.

## Skiff contract
Small brass autonomous skiff, sails/turns before shore, responds to currents, catches ballistic drops as conserved cargo (`boatState.cargoUnits`). Boat must sit **on the actual rendered water mesh**, not on an independent approximate buoyancy surface. v24 established `renderedSurfaceY(x,z)`: raycast vertically down onto updated `waterSurface` after `updateWindVisual`; `seatBoatOnRenderedSurface` sets b.y from hit, samples front/back/left/right for pitch/roll. The boat X/Z moves under currents and steering; vertical velocity is zero. Explicit airborne forces would be a separate future feature, not license for passive hovering/diving. v25 adjusted boat offset from y=surface-.12 to y=surface+.03 (raise .15) to improve visual freeboard. Raycast requires mesh world matrix updated; call `seatBoatOnRenderedSurface` after `updateWindVisual` each frame. A previous bilinear scalar buoyancy attempt (v23) was rejected because it allowed the boat to wander vertically. Do not resurrect it.

## History and lessons
v17 conservative 64×64 depth/velocity transport. v18 THUMP outward impulse. v19 brass skiff introduced; flew/submerged/clipped. v20 arbitrary vertical clamps did not solve surface disagreement. v21 replaced volumetric water with a grid sheet, ruined appearance and dropped ~60 to ~50 FPS; **do not repeat**. v22 restored volume. v23 spring buoyancy was not the requested constraint. v24 raycast onto actual rendered mesh, tested at ~60 FPS and accurate origin offset. v25 render-only bilinear interpolation plus freeboard raise .15; published, **not yet user-tested**.

## Last measured v24 user INSPECT (42.22s, seven THUMPs)
Boat position (3.96,-4.23,-4.97), rendered surface Y -4.111409, boat difference -0.1186 (matches v24 intended -.12). verticalVelocity 0, cargo 3, edge avoidance 367. FPS ~60.15, render 24 calls/44,978 triangles. 245,944 accounted, unrepresented 0, collector volume 866.1449 vs transport 866.1409 (small numerical difference), 2035 wet cells, wavePeak 3.68, waveEnergy 928.64, THUMP impulse 72838.76, warnings none. This is one instant, not proof of entire hull intersection.

## Open question at pause
User said boat sits slightly too low, and THUMP wave ring has spiky edges, worse at forward/leading side of impulse. v25 changed only boat freeboard and visual interpolation. Await user visual assessment, preferably repeat THUMP test. If spikes remain, distinguish genuine solver depth gradients from Cartesian-grid/radial-mesh sampling; inspect directional wind/pendular gravity and donor-cell transfer saturation. **Do not blur authoritative depth field or alter conservation as a cosmetic fix.** Avoid large architectural changes without a narrow experiment.

## Working style / guardrails
Phone-first ~60 FPS; beautiful, legible, perturbable bauble. Preserve working visual water, conserved units, controls, and responsive camera. INSPECT is primary observational evidence; ask for screenshot if visual defect not diagnosable from numbers. Narrow reversible interventions; separate rendering, dynamics, boat, and transport boundaries. When user says ➡️ / 🐉 / engage, implement and publish, not merely plan. Never claim independent browser validation unless actually performed. Source + deployed commits and build string are the delivery proof, then user confirms browser behavior.
