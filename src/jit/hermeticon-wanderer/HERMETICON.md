# Hermeticon — semantic and human interaction contract

Status: current design contract, 2026-10-12. This governs **new Hermeticons**, beginning with Hermeticon Wanderer. It does not retroactively modify legacy baubles or assert that all rules are implemented.

## V31 earned boundary and interaction evidence (2026-10-12)
Wanderer V31 was player-accepted. Tap-to-redirect, orbit, pinch, and central 25%-**area** hangout/world-follow work together without forcing the camera to follow the character. Flat y=0 targeting and the visible cube are deliberately minimal, not final grounding or navigation.

**The Hermeticon is an aperture and a physical bowl, not a leash.** Geological world coordinates own persistent BB positions and cloud location. Walking moves the observation aperture; it does not move, transfer, delete, or re-own material. Above the equator the dome is a local weather visibility/emission domain; it is not a collision wall. Below the equator the bowl is physical and may bounce BBs. Contact should ultimately depend on actual material trajectory; V31 still has a proximity-based bowl correction and the resulting lively repeated bounces are player-accepted behavior, not proof of trajectory-correct contact.

The cloud uses double-sided mesh geometry clipped by the upper spherical aperture; like terrain clipping, this does not manufacture new cross-section faces. Only cloud volume intersecting the weather dome may emit. Existing cloud inventory remains until a BB actually spawns. Emission under partial overlap remains a testable implementation limitation.

Historical V31 INSPECT provided on-demand `weather` diagnostics and `BaubleInspectWeather()`; it reports geological/local cloud coordinates, clipping shader hooks, overlap estimate, BB counts inside/outside the aperture, conservation and simulation state. Player report: 10,000 BBs accounted for, 185 outside the aperture retained, zero generic containment violations, shader compiled, ~58.94 FPS. The report was captured after cloud exhaustion, so partial-cloud clipping is accepted visually by the player rather than measured by that snapshot.

**Historical verifier jurisdiction (V31; verifier removed in V48):** whole-sphere containment applied to vessel-local meshes, not persistent world-domain cloud/terrain/BBs. Keep reporting real geometric conditions; do not reintroduce a rule that all geological matter must remain inside the moving sphere. The generic verifier does not establish the absence of physical bowl penetrations.

The earlier V28 caveat above is historical: V31 has persistent geological BBs and world-positioned cloud. Aggregated distant weather, dynamic resolution transitions, absorption and generalized material phases remain design direction, not implemented Wanderer features.

## Unit of composition

**The Hermeticon is our atomic unit**, not a particular physical size, genre, or kind of exhibit. It may contain a galaxy marble held by an alien, all of Middle-earth, an explorable character asset, or a chemistry molecule exhibit. Scale and subject do not determine the interaction contract. Hermeticons can eventually be composed, but we are not building a universal framework in advance.

For now, implement and validate these rules in Hermeticon Wanderer. Generalization to future Hermeticons is earned by use; **do not update legacy baubles**. Do not mistake the older JIT bauble template or its procedural README for this semantic authority.

## Contract with humans touching Hermeticons

**Human intent first. World interpretation second. Simulation third.**

- **Camera belongs to the human.** Orbit and pinch zoom remain continuously responsive while the world simulates, entities move, rain falls, or expensive work is pending. Never hijack the camera to implement navigation, targeting, or physics.
- **A deliberate tap is an action**, not a tiny orbit. Distinguish tap, drag, and pinch at the input boundary, before raycasting or semantic interpretation. Do not discard a tap silently because a surface is hard to intersect, occluded, or absent. Report/inspect unresolved intent.
- **Gesture meanings stay distinct:** tap acts on the bauble; drag orbits; pinch zooms. Multi-touch must not accidentally dispatch taps. Camera observation must not cancel an entity's ongoing action.
- **Simulation cannot hold input hostage.** Bound per-frame work and avoid synchronous expensive raycasts or physics on camera/input hot paths. Never accept an FPS collapse as the cost of making orbit or pinch work.
- **Tap targets are semantic.** Terrain, cloud, creature, object, and empty space may mean different things. Recognition of the human's tap precedes deciding what was touched.
- **Keep coordinate tracking in optional, bounded diagnostics**, not a movement HUD. Capture gesture, targeting, camera, and navigation evidence only when explicitly needed; do not continuously log or burden the player.

### Wanderer first vertical slice

Tap terrain to replace Wanderer's destination; Wanderer walks continuously toward that target at a fixed speed. A new tap redirects him. Orbit and zoom remain free throughout. Wanderer needs current position, target, and speed; terrain contact/presentation must **not** interrupt horizontal travel. The geological world slides relative to the Hermeticon only when Wanderer leaves the central **25% of the aperture circle's area** (half its radius). No movement buttons, no onscreen coordinate display, no premature pathfinding. Terrain selection should agree with the visible aperture, and failures should be inspectable.

These are requirements; the present Wanderer implementation has known shortcomings in tap reliability, terrain seating, and visual continuity. Do not mark them verified without player testing.

## Existence, manifestation, and resolution

A Hermeticon is a local window of expensive, perturbable causality into a potentially much larger world. **World** owns persistent geography, climate, history, and aggregate material accounting. **Hermeticon** owns instantiated local weather and granular resolution. A distant storm can change Gondor while the observer is in Bree without simulating individual distant snowflakes.

Material representation may change across the boundary without loss of conserved substance. Unsettled precipitation must not silently become deposited terrain matter. Individual trajectories need not persist outside local resolution, but quantity and meaningful aggregate state must. This is a semantic direction, **not yet implemented** by Wanderer V28; its cloud still follows the geological translation.

The detailed conservation/contact contract remains in [matter/MATTER.md](matter/MATTER.md). Keep matter behavior there; this document owns the Hermeticon boundary and human interaction semantics.

## Implementation discipline

Prove the smallest behavior in Wanderer. Preserve working orbit/pinch, camera framing, inspection, and the existing JIT delivery route. Do not expand this into an OOP/ECS architecture or migrate legacy baubles. Separate proposed behavior, executable behavior, and user-verified behavior. New Hermeticons inherit this **contract**, not necessarily Wanderer's scene or source code.


## Instrumentation boundary — V48 (2026-10-12)

The observer must not become the dominant workload. A normal INSPECT action reads bounded, already-maintained evidence; it does not run GPU witnesses, traverse all scene geometry, or recompute the world. Heavy verification is a separate deliberate experiment, not an automatic consequence of opening a diagnostic panel. Reports should be transportable into the conversation by one ordinary COPY REPORT action. This is a design/interaction constraint, not a claim that the lightweight counters prove all physical invariants. Wanderer V47 has one player-confirmed successful report paste and mid-transfer observation; full completion remains to be witnessed.


**V48 implementation:** dormant GPU/scene pixel witnesses, generic containment/invariant verifier, per-rebuild terrain vertex diagnostic traversal, and automatic 2.5-second INSPECT JSON regeneration were pruned. Player successfully copied a complete-transfer report (96/96 received, zero reported errors, 75.1 FPS at 24.367 s). These are bounded observer facts, not independent geological conservation or lineage proof. Preserve verification as explicit experiments outside the normal frame path.
