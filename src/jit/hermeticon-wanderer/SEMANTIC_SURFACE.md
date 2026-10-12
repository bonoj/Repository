# Hermeticon Wanderer — semantic surface
Updated: 2026-10-12 · Canon: player-accepted V31 (V21 archaeology retained)

## Accepted V31 — 2026-10-12 (supersedes the V21 handoff)
Player accepted `hermeticon-wanderer-cloud-aperture-v31` at https://bonoj.github.io/jit/hermeticon-wanderer/. Source: `src/jit/hermeticon-wanderer/index.html`; JIT mirror: `bonoj/bonoj.github.io/jit/hermeticon-wanderer/index.html`. Preserve V31 behavior unless an explicit experiment changes it.

- Tap replaces Wanderer's walking target. Drag orbits; pinch zooms; camera remains independent while walking/raining. World follow starts beyond the central 25% **area** of the aperture (half-radius hangout). Player verified the feel. Current cube at y=0 and flat-plane tap targeting are MVP, not terrain seating/pathfinding.
- Terrain is a persistent geological signed field, generated once and clipped by the moving GPU aperture. World-coordinate BBs remain where spawned even when the aperture travels away; offscreen is not lost. No ownership transfer or teleport on aperture crossing.
- Upper hemisphere is a **weather manifestation window**, not a physical BB wall. Cloud stays geological; its rendered mesh is fragment-clipped to the upper dome and double-sided. Rain may emit only within cloud ∩ upper dome; cloud inventory decreases on actual emission. Lower hemisphere is a physical bowl with current intentionally lively bounce behavior.
- The generic containment verifier checks vessel-local geometry, **not geological terrain, cloud or BBs**. Do not mistake offscreen BBs for escape. The current verifier does not prove correct lower-bowl contact or prevent all penetrations.
- Player INSPECT at 33.752 simulated seconds: 10,000 emitted; 9,815 within aperture, 185 offscreen and retained; 9,152 settled, 848 airborne, 0 recorded escaped, conservation true. 182 BBs beyond lower bowl, 1,588,519 wall-bounce events. No containment/invariant failures; cloud shader hooks compiled; terrain GPU/scene witnesses passed; ~58.94 FPS on sampled mobile run. Cloud inventory was already exhausted, so shader compilation is evidenced but partial-cloud overlap was not measured in this report.
- INSPECT now exports `weather` (cloud coordinates, aperture overlap sampling, shader status, emission budget, BB persistence/finite positions), gesture traces, conservation, runtime GPU witnesses. `BaubleInspectWeather()` provides an on-demand focused snapshot. On-demand diagnostics are not a live screenshot or independent cloud pixel witness.
- Known debt: rain emission uses deterministic candidates and can stall at a partial cloud overlap if its next candidate is outside; overlap estimate alone does not prove proportional emission. Lower-bowl collision uses a proximity projection against the moving vessel and can generate repeated bounce counts; behavior is presently accepted as playful, **not** validated trajectory-only collision. `cloud.dimensions=[0,0,0]` and `overlapFraction=1` after exhaustion describe a zero-size/invisible cloud and should not be interpreted as an active-weather test.

The V21 instructions below are historical; do not follow their "next build" direction as if Wanderer were still absent.

## Identity
A beautiful, perturbable, composable executable world, not merely a terrain clipping demo. **The glass bauble is a viewing aperture, never the geological world's physical boundary.** A persistent deterministic square geological field exists beyond the visible sphere. The Wanderer moves the aperture through it. The geology is not attenuated, squeezed or remeshed to fit glass. Atmospheric visibility may fade at the aperture edge.

**New canon — three physically connected regions of ONE world:**
- **Above:** mountains, surface, weather, rivers, incoming material, settlements, holes.
- **Within:** traversable caverns, shafts, bridges, walls, ceiling, machines embedded in geology.
- **Below:** the slab underside, suspended collection/sorting machinery, reservoirs, receiving pools, fabrication and potentially stranger hosted experiences.
- A hole is an entrance, a gravity conduit and a potential industrial resource, not a defect. Material falling through from Above can be caught, vacuumed, sorted, recirculated and fabricated Below. Keep the chain physically legible.
- The first studio-facing demonstration might be a beautiful machine with light interaction: follow material from surface through a hole to the working underside, change one property, watch the causal response. Show, don't tell. Protect private collaboration methods.

## Locations and procedure
Source: `bonoj/Repository/src/jit/hermeticon-wanderer/index.html`
Public mirror: `bonoj/bonoj.github.io/master:jit/hermeticon-wanderer/index.html`
URL: https://bonoj.github.io/jit/hermeticon-wanderer/
Canonical empty scaffold: `bonoj/bonoj.github.io/master:jit/bauble/index.html` (do not modify).
Publication authority: `bonoj/Gate/README.md` + `bonoj/Repository/src/jit/README.md`.

## Implemented and evidenced — V21
- Build: `hermeticon-wanderer-continuous-traversal-v21`.
- Deterministic world-coordinate 3D signed matter field: seed 741, 85×21×85 (151,725) samples, square half-extent 25.2, 42 initial geological operations (14 through-holes and 28 raises/lowers). Geology has upper and lower surfaces.
- One resident mesh, generated at initialization. 125,184 triangles / 375,552 vertices, ~307 ms initial generation. `terrainBuildCount=1` after traversal. **No terrain remeshing on ordinary Wanderer movement.**
- GPU sphere clip radius 9.72, with blue radial edge fog (~7.1–9.7). GPU witness x/z: visible at 9.71, discarded at 9.73; real scene witness 346 occupied pixels all inside projected sphere. Shader compiled with both hooks. No runtime warnings in supplied report.
- Wanderer moved to approximately (−4.176, 6.218) without changing the resident mesh. The terrain view transform and shader aperture uniform move relative to world-coordinate geology.
- Glass and brass bauble, orbit/pinch camera, four temporary on-screen direction buttons, INSPECT/COPY REPORT, fixed 8 ms simulation, performance and invariants.
- Runtime reported ~87.6 FPS after ~46 seconds, screenshots ~59.7–109.9 FPS depending on view. Promising but NOT a worst-case 60 FPS guarantee. Zero reported invariant or containment violations. User screenshots confirmed compelling views from above, near surface, sideways across slab, and from below; user described result as 'absolutely gorgeous.'
- The large number of mesh vertices outside the aperture is **expected** in the resident-world architecture, not a breach. The CPU geometry exists beyond the GPU viewing window.
- Inspection debt: labels such as `cutTriangles`, `scoop`, `vertex-initialized-fragment-sphere-scoop`, and `extractionMargin` reflect prior architecture and need semantic cleanup. Pixel witnesses do not prove aesthetic quality, smoothness, physical containment or correct occlusion.
- **Not yet implemented here:** an embodied visible Wanderer, vertical traversal, material bead transport, collection, sorting, fabrication, or connected cave experiences. Related transport experiments elsewhere are potential reusable evidence, not already integrated.

## Architectural principles
1. One persistent world, multiple viewing locations. No ordinary-traversal regeneration; no chunking or streaming yet. Keep world y=0 as fixed datum.
2. Separate authoritative matter and transport from rendering. Preserve geology, tunnels, and holes through aperture movement.
3. Radial atmospheric fog conceals the viewing horizon. It must not rewrite geology; avoid a hard circular terrain edge.
4. Occlusion within caves is a distinct problem: preserve real ceilings and walls; explore selective near-foreground visibility when necessary, rather than deleting physical terrain.
5. Phone-first, simple legible interactions, deterministic tests, minimal architecture, no long-press, no tiny controls.
6. Preserve the V21 baseline and inspection witnesses while exploring; don't confuse a visual success with a conservation proof.

## Immediate exploration — in order
### A. Little Wanderer and clear screen
- Remove the four permanent navigation arrow buttons from the main screen.
- Introduce a small, clearly legible Wanderer entity located within the geology. It should become the focus of movement and future vertical exploration.
- Prototype direct, touch-friendly navigation (e.g. tap-to-move with a visible target/path) that coexists with camera orbit/pinch. Avoid automatically imposing ubiquitous virtual thumbsticks; test touch ambiguity and ergonomics.
- Initially navigate surface; later move through actual holes into caverns and below. Format coordinates compactly, move diagnostics into INSPECT, retain build/FPS and refresh.
- Success: user can wander smoothly without button clutter; `terrainBuildCount=1`, stable geology, near 60 FPS under realistic camera views.

### B. Layer-aware visibility and descent
- Prove a single actual passage from Above to Within/Below, not a scene teleport disguised as continuity.
- Compare views from surface, cavern, underside. Explore fading only obstructive foreground rock while retaining authoritative roof/walls.
- Keep radial fog for the distant aperture edge; it cannot solve every local occlusion.

### C. Material transport — smallest causal loop
- One surface source → one existing hole → gravity-driven fall → one underside catcher or pool.
- Make matter and direction readable. Instrument counts: emitted, in-flight, collected, lost, conservation residual, throughput, FPS.
- Consult existing Crucible/Six Cities bead-stream and water transport implementations before reuse; don't assume they are present in Hermeticon.
- Then test vacuum intake, separation by material property, pipes, reservoirs, recirculation and fabrication. Start small and visually convincing, scale later.

## Horizons (not commitments)
- Terraria-like descent through geological layers into a deeper, stranger world.
- Machines and civilizations suspended from the underside of mountains.
- Surface weather and material cycles feeding subterranean industry.
- Modular transport, chemistry, sorting and fabrication as composable experiential systems.
- A compelling executable outreach bauble for studios: a tiny coherent world whose inhabitants and machinery demonstrate creative systems thinking through interaction.

## Handoff
The immediate next build should be a **small Wanderer + uncluttered navigation hypothesis test**, not a sprawling game or new chunk architecture. After validating movement, test **one real material path through a hole to a receiving machine below**. Preserve V21 as the continuous-terrain baseline. 🐉


## Current operational state — V47 (2026-10-12)

**This section supersedes V31 inspection instructions and earlier V42–V46 tooling status.** Current executable is `index.html`, build `hermeticon-wanderer-instrumentation-reset-v47`; public JIT mirror is `bonoj/bonoj.github.io/jit/hermeticon-wanderer/index.html`. Preserve the player-accepted movement/weather boundary from V31, but do not treat its old full INSPECT schema or GPU witness claims as current runtime instrumentation.

- Terrain authority: one 85×21×85 signed field; 81 horizontal extraction regions, 10-cell width with dependency halo. Excavation removes 96 positive samples; 96 material BBs transfer to the receiver and deposit as signed-field geology. Region rebuilds are localized; material lineage is recorded in the simulation.
- V46 replaced crash-prone inspection with a bounded CPU-only snapshot. INSPECT reads existing counters, BB states, terrain rebuild metrics, a small event ring, and runtime errors. It does **not** run GPU readbacks, scene traversal, full-field conservation scans, or the legacy containment/invariant verifier. Those older witnesses remain in source as historical/optional machinery, not evidence that the current inspector runs them.
- V47 restored **COPY REPORT**, using direct clipboard write on tap and a legacy selection/copy fallback. Player successfully pasted the V47 JSON into conversation. No JSON download/upload is required.
- **Player-observed V47 mid-transfer witness:** at 6,642 ms, 56.7 FPS; 81 chunks, 1 full rebuild, 19 local rebuilds, last dirty chunks 1, last rebuild 6.6 ms; BB states 66 source + 12 transit + 18 receiver = 96; zero reported runtime errors. Event log records 96 excavated samples and transfer start. This establishes working report transport and one healthy mid-transfer sample, **not** complete transfer, end-state conservation, repeated mobile stability, or all-frame performance.
- Next verification: after all 96 reach receiver, capture V47 INSPECT; check source 0, transit 0, receiver 96, no runtime errors, plausible FPS and bounded rebuilds. The lightweight report does not independently prove geological conservation or re-excavation. Next geological experiment remains A → BB → geology B → BB re-excavation, after confirming this baseline.

**Document ownership:** this surface owns current observed state; `HANDOFF.md` is a short entry point, `WORLD_GENERATION_EXPERIMENT.md` preserves chronological experiments, `HERMETICON.md` owns the durable boundary/interaction contract, `LEGACY_TERRAIN_V31.md` is historical. Do not duplicate this state in new documents.
