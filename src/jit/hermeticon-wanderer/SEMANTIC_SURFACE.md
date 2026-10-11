# Hermeticon Wanderer — semantic surface
Updated: 2026-10-11 · Canon: V21 continuous traversal + Above / Within / Below

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
