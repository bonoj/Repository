# Matter — Hermeticon Wanderer

Status: **design contract / evolving hypothesis**, 2026-10-12. This document records our current understanding, not a claim that these mechanisms have been implemented or validated.

## V31 executable matter evidence — 2026-10-12
This section supersedes the older claim that no Wanderer collision behavior is implemented. V31 has a concrete, **not yet generalized** hydrology slice in `src/jit/hermeticon-wanderer/index.html`: one cloud inventory of 10,000 units emits discrete BBs under gravity (9.8), terrain restitution (0.38), tangential damping (0.82), and a physical lower bowl. Resting BBs are retained; there is no absorption, liquid solver, gas conversion, or whole-to-water collection yet. The matter folder remains the intended future development home, not an already extracted runtime module.

**Persistence:** each emitted BB is stored in geological coordinates; Hermeticon movement changes the rendered relative position, not the stored material position. BBs beyond the visible aperture are retained. The upper dome is an emission/visibility region, not a BB containment wall. The lower hemisphere is a physical bowl. The current bowl collision proximity correction can produce repeated wall bounces when the bowl moves; player accepted this lively behavior for now, but it does not yet satisfy strict trajectory-crossing semantics.

**Cloud:** world-positioned inventory volume; upper-dome fragment clipping affects appearance only. The amount remaining is `10,000 - emitted`, and only successful in-dome emission consumes inventory. Current overlap estimate samples the volume; deterministic spawn candidate selection can stall on an outside candidate at partial overlap, so proportional rain under partial intersection is **not verified**.

**Historical evidence (V31; not current INSPECT schema):** player-accepted V31 INSPECT at 33.752 s: 10,000 emitted, 0 remaining, 9,152 resting, 848 airborne, 185 beyond the aperture but retained, 0 `escaped`, finite positions, `conserved=true`. 182 were beyond the lower bowl; 1,588,519 wall bounces recorded. Generic containment and invariants passed, but those are not a physical-bowl penetration witness. Cloud was exhausted when measured. At V31, `weather` and `BaubleInspectWeather()` exposed conservation, cloud position/overlap/shader status, BB locality and emission budget. Those interfaces are not the V48 inspection contract.

For the present rain-only experiment the tested invariant is `N_cloud_remaining + N_BB_emitted = 10,000`. Resting BBs are a subset of emitted BBs, not a new material reservoir; never double-count them. The earlier gas/whole equation is the proposed general model, **not** evidence those representations exist in V31.

Keep future restitution→absorption ordering as a contract; absorption is not yet implemented. Preserve current accepted movement, camera, cloud rendering, and BB dynamics while investigating material transitions.

## Purpose and location

Matter means **conserved substance**, not a rendering material. This folder is the single development home for matter behavior while Hermeticon Wanderer is our proving ground. Keep its code independent of Hermeticon's camera, UI, scene-specific geometry and presentation. Hermeticon supplies geometry and environmental conditions. After the behavior earns reuse, lift this folder into Repository Fundamentals; do not preemptively build a framework or duplicate implementations elsewhere.

**Geometry is not identity.** Start with cubes for clouds, castles, inhabitants and reservoirs; dots for gas and bearings for discrete matter. Beautiful presentation comes after behavior and evidence. Changing a cube into a beautiful object must not change its identity, inventory or causal behavior.

## Material units and representations

A unit of material retains its substance identity and is accounted for across three representations:

1. **Gas / atomic:** a fuzzy dot representing a diffuse, mobile unit.
2. **Discrete:** a ball bearing (BB) with position and velocity, responding to forces and impacts.
3. **Whole:** a unit counted in an aggregate inventory (lake, cloud, glacier, reservoir, etc.). A whole is not necessarily a phase; it may use a collective solver.

These are *representations of the same material*, not different substances. Conversion must transfer units explicitly. Identity, quantity, and, where available, composition and provenance survive representation changes. We have not settled the exact unit scale, transition thresholds or numerical implementation.

Accounting invariant (for a single material, absent explicit external sources/sinks):

    N_total = N_gas + N_BB + sum(N_whole)

No silent creation, loss or teleportation. Inventory transfers should be observable and testable.

## Contact and consequences

A surface/mesh owns **restitution** and **absorption** properties. Resolve contact in deterministic order:

1. Detect contact.
2. **Restitution first:** determine the post-impact response, including rebound or energy loss.
3. **Absorption second:** determine whether/how much of the material transfers out of the discrete representation.
4. Continue with the remaining discrete material, if any, under environmental forces and conditions.

The environment governs what happens after the impact response; it is not a secret second water engine. Material properties (including cohesion) may participate, but should not replace the mesh's contact contract. Exact absorption criteria and interactions remain to be worked out.

## Gravity, impact, and restitution — working vocabulary

For the first hydrology increment, Wanderer's existing terrain is treated as one stationary contact material (rock/dirt/sand distinctions are not yet modeled). A cube cloud rains discrete water BBs into Wanderer's actual geological world. No separate experiment world or hydrology machinery is required.

- **Gravity** is environmental acceleration; it changes a BB's velocity over time.
- **Velocity** is the BB's motion, with direction and speed. Its component relative to the contact surface normal governs normal impact.
- **Impact** is a contact event with incoming relative velocity. Physical contact force/impulse exists, but a simple rigid bounce need not explicitly solve force over contact time.
- **Restitution** is a property of the contacted surface (later potentially combined with material properties). It determines how much normal relative speed is recovered in the rebound.
- **Bounce** is the resulting outgoing velocity; gravity continues accelerating the BB afterward.
- **Absorption** is a separate mesh-owned contact consequence, evaluated **after** restitution, never before.

For a stationary surface with unit outward normal **n**, incoming velocity **v**, and coefficient of restitution `e`, the normal velocity component obeys `v_out,n = -e * v_in,n` for an approaching BB (`v_in · n < 0`). Equivalently, with tangential velocity initially preserved: `v_out = v_in - (1 + e) * (v_in · n) * n`. `e = 0` means no normal rebound, `e = 1` an ideal elastic normal rebound, and `e = 0.5` half the incoming normal speed. Slopes redirect bounce through their surface normals. Friction/tangential dissipation, resting contacts, numerical collision stability, and absorption rules remain separate questions.

**Resolution order:** gravity updates motion → contact detects incoming impact → restitution resolves rebound → absorption is considered → remaining discrete matter continues under environmental forces. This is our shared working vocabulary, not a claim that Wanderer already implements the collision response.

## Flat surfaces and cohesion

A single bearing on sufficiently flat terrain can settle without a downhill direction. For water, a pile of static bearings is not yet a satisfactory account of pooling and flow.

Our working hypothesis: **cohesion is a material property**. Neighboring/settled water units can coalesce into a whole. When collective behavior is justified, that whole may use a **shallow-water solver**. The solver is an earned representation of a cohesive population, not the definition of water and not a permanent vessel.

At a lip, through a hole, during a splash, or where a collective solver no longer applies, units can leave the whole and return to discrete bearings. The precise criteria for joining, splitting, wetting/drying, adhesion, pressure and solver domain boundaries are **open design questions**, not established solutions.

## Hydrology: first experiment, general liquid foundation

Start with **hydrology as the first consumer of general matter transport**, rather than building a water-specific surface and trying to generalize afterward.

Initial minimal bauble: a cube cloud, simple receiving surface with a hole/edge, and a cube reservoir beneath it. No decorative geometry.

Proposed observable cycle:

- Cloud whole releases material to gas and/or falling discrete BBs, with explicit accounting.
- BBs fall under environmental forces, contact meshes, resolve restitution before absorption, and may collect.
- Cohesive collected units form a whole; when warranted, a shallow-water solver handles collective transport.
- Overflow, holes and splashes return units to BBs; gravity continues their motion.
- Evaporation returns material to gas; condensation returns it to discrete or collective representation as appropriate.
- At every step, verify conservation and observable transfers.

Water is the first test material. Other liquids should eventually share transport and accounting while differing in material properties and phase/interaction rules. **This is a goal, not a demonstrated general solution.**

## Implementation discipline

- Develop implementation **here**: `src/jit/hermeticon-wanderer/matter/`. Hermeticon consumes it; avoid scene-local duplicate physics.
- Keep the smallest executable vertical slice. Do not create an abstract hierarchy of hypothetical future substances.
- Distinguish **proposed**, **implemented**, and **verified** behavior as work advances.
- Preserve the existing standalone JIT delivery route when eventually integrating/publishing; do not deploy merely to create this document.
- Existing `src/fundamentals/{materials.js,bearings/,liquids/,consequences/}` are prior work, not automatically replaced or canonical implementations of this new contract. Inspect before reuse or migration.
- If the seam becomes awkward, fix the seam explicitly rather than silently relocating the source of truth.

## Next questions to resolve experimentally

- What observable conditions promote discrete BBs into a whole, and demote them again?
- How does cohesion on a flat surface create pooling/spreading without arbitrary drift?
- How does a shallow-water solver operate over open terrain with holes, underside and spillover, without pretending every place is a closed 2.5D basin?
- What absorption semantics make sense for a receiving surface versus a body of water?
- What are the simplest diagnostics for material totals, transfers, and per-representation inventory?

The first success is **legible, conserved material movement**, not attractive water.


## V48 observer boundary and material evidence (2026-10-12)

The normal V48 observer reports bounded counters, events, and errors; it does not run the former containment/invariant verifiers, GPU/scene witnesses, or per-rebuild terrain-vertex diagnostic scan. Player-observed V48 report at 24.367 s: 96/96 transfer units received, zero remaining source/transit, 97 local terrain rebuilds, last rebuild 3.4 ms, no reported errors. This establishes reported BB unit delivery, **not** an independent signed-field conservation proof, material identity/lineage proof, or successful re-excavation. Preserve material conservation as a world contract and validate the geology A → BB → geology B → BB re-excavation round trip in an explicit experiment, never by adding expensive automatic runtime observers.
