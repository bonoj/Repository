# Hermeticon — durable contract
Updated 2026-10-13. Applies to new Hermeticons, starting with Wanderer; does not retroactively change legacy baubles. For entry and deployment use [HANDOFF.md](HANDOFF.md); for actual implemented systems use [SEMANTIC_SURFACE.md](SEMANTIC_SURFACE.md). **Requirements are not automatically implementation claims.**

## Definition and authority

A **three-dimensional retina** is a bounded volumetric sampling interface into a larger persistent world. The Hermeticon's inner volume determines local membership and selected simulation eligibility. The camera independently projects the admitted scene onto a two-dimensional display. Changing camera angle is not a simulation event.

**Invariant:** A 360° camera orbit must not change population growth, character clocks, material ownership, or other world state. Moving the Hermeticon through the persistent world *may* change membership and local activity. The Mists camera-dependent growth defect illustrates why these authorities must remain separate.

The Hermeticon is both a local observation aperture and a vessel with region-specific physics, **not a leash**. Geological coordinates own persistent terrain, clouds, and world-domain BBs. The upper dome is a weather visibility/emission domain, not a generic collision wall; the lower bowl is physical for relevant material. Geological support, vessel containment, camera visibility, and simulation eligibility are distinct predicates. Do not impose whole-sphere containment on all persistent geological matter.

## Interaction contract

**Human intent → world interpretation → simulation.**

- Tap acts or redirects; drag orbits; pinch zooms. Distinguish gestures before world raycasting. Multi-touch must not dispatch accidental taps.
- Camera belongs to the human and remains responsive while entities move and the world simulates. Do not move the camera as a substitute for navigation.
- A deliberate tap must not disappear silently because of occlusion, missing surface, or hard-to-intersect geometry. Make unresolved intent inspectable.
- Keep simulation and diagnostics bounded off input hot paths; do not trade away responsive orbit/pinch for expensive witnesses.
- Tap targets are semantic: terrain, creature, cloud, object, and empty space can require different interpretation.
- In Wanderer, tapping terrain redirects the walker; the aperture begins following outside the central **25% of the aperture circle's area** (half its radius). Preserve accepted terrain seating, occlusion, hole avoidance, and bounded routing unless the user requests changes.

## Existence, manifestation, and matter

The world owns persistent geography, identity, history, and authoritative material accounting. The Hermeticon owns the locally instantiated high-resolution presentation and selected activity. Material representation can eventually change across resolution boundaries without loss of substance; that is a **design direction**, not a claim of implemented dynamic LOD or generalized phases.

Conserved substance is distinct from visual particles. Material inventory and contact semantics are specified in [matter/MATTER.md](matter/MATTER.md). Existing lower-bowl collision uses historically accepted proximity correction, not proven trajectory-exact contact. Cloud overlap and emission remain limited experiments, currently paused at fresh load.

## Observation contract

Human continuous visual perception and model-accessible images, source, reports, and targeted instruments are incomplete but complementary views of one executable referent. State the invariant, select a suitable instrument, and connect observations to exact build identity. Visual sequences test appearance and timing; state probes test behavior and clocks; spatial queries test geometry; accounting tests quantities.

A normal INSPECT action must remain lightweight and on-demand. Do not automatically run GPU witnesses, traverse all scene geometry, or rebuild expensive reports each frame. Heavy tests belong in deliberate experiments. FPS does not prove correctness; a committed fix does not prove live behavior.

## Composition and implementation discipline

Hermeticon is a compositional unit independent of physical scale or subject. A molecule, creature, landscape, or galaxy can be presented through the same human interaction principles, but do **not** prebuild a universal framework or retrofit legacy baubles. Prove the smallest behavior in Wanderer, preserve existing interaction and delivery, and distinguish proposal, source implementation, runtime evidence, and user acceptance.

Historical V31/V48 observer measurements and experiments belong in [WORLD_GENERATION_EXPERIMENT.md](WORLD_GENERATION_EXPERIMENT.md) or the relevant subsystem record, not in this enduring contract. The current source remains authoritative for what actually runs.
