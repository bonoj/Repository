# Hermeticon — semantic and human interaction contract

Status: current design contract, 2026-10-12. This governs **new Hermeticons**, beginning with Hermeticon Wanderer. It does not retroactively modify legacy baubles or assert that all rules are implemented.

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
- **Keep coordinate tracking in INSPECT**, not a movement HUD. Retain gesture diagnostics, accepted/rejected semantic targeting, camera state, and navigation state for debugging without burdening the player.

### Wanderer first vertical slice

Tap terrain to replace Wanderer's destination; Wanderer walks continuously toward that target at a fixed speed. A new tap redirects him. Orbit and zoom remain free throughout. Wanderer needs current position, target, and speed; terrain contact/presentation must **not** interrupt horizontal travel. The geological world slides relative to the Hermeticon only when Wanderer leaves the central **25% of the aperture circle's area** (half its radius). No movement buttons, no onscreen coordinate display, no premature pathfinding. Terrain selection should agree with the visible aperture, and failures should be inspectable.

These are requirements; the present Wanderer implementation has known shortcomings in tap reliability, terrain seating, and visual continuity. Do not mark them verified without player testing.

## Existence, manifestation, and resolution

A Hermeticon is a local window of expensive, perturbable causality into a potentially much larger world. **World** owns persistent geography, climate, history, and aggregate material accounting. **Hermeticon** owns instantiated local weather and granular resolution. A distant storm can change Gondor while the observer is in Bree without simulating individual distant snowflakes.

Material representation may change across the boundary without loss of conserved substance. Unsettled precipitation must not silently become deposited terrain matter. Individual trajectories need not persist outside local resolution, but quantity and meaningful aggregate state must. This is a semantic direction, **not yet implemented** by Wanderer V28; its cloud still follows the geological translation.

The detailed conservation/contact contract remains in [matter/MATTER.md](matter/MATTER.md). Keep matter behavior there; this document owns the Hermeticon boundary and human interaction semantics.

## Implementation discipline

Prove the smallest behavior in Wanderer. Preserve working orbit/pinch, camera framing, inspection, and the existing JIT delivery route. Do not expand this into an OOP/ECS architecture or migrate legacy baubles. Separate proposed behavior, executable behavior, and user-verified behavior. New Hermeticons inherit this **contract**, not necessarily Wanderer's scene or source code.
