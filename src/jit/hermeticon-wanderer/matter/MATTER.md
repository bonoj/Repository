# Matter — Hermeticon Wanderer

Status: **design contract / evolving hypothesis**, 2026-10-12. This document records our current understanding, not a claim that these mechanisms have been implemented or validated.

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
