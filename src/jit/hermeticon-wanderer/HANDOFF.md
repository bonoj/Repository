# Hermeticon Wanderer — project entry point
Updated 2026-10-13.

**Start here.** This is the single entry point for a cold model resuming Hermeticon Wanderer. The human should need to name this document and the desired change, not locate subsystems, reconstruct history, or supervise routine deployment. This file is a map and operating orientation, not a substitute for inspecting current source. Do not treat its snapshot as proof of the live build.

## Find the project

| Resource | Location | Purpose |
|---|---|---|
| Executable source | `bonoj/Repository/src/jit/hermeticon-wanderer/index.html` | Authoritative current implementation; inspect before editing |
| Semantic surface | `bonoj/Repository/src/jit/hermeticon-wanderer/SEMANTIC_SURFACE.md` | What systems exist, ownership, implementation limits |
| Hermeticon contract | `bonoj/Repository/src/jit/hermeticon-wanderer/HERMETICON.md` | Enduring boundaries, gestures, simulation invariants |
| Material contract | `bonoj/Repository/src/jit/hermeticon-wanderer/matter/MATTER.md` | Conservation, accounting, contact |
| Experiment history | `bonoj/Repository/src/jit/hermeticon-wanderer/WORLD_GENERATION_EXPERIMENT.md` | Historical geology and material experiments, not current instructions |
| Publication authority | `bonoj/Gate/README.md` | Required delivery procedure and recovery rules |
| Pages mirror | `bonoj/bonoj.github.io/jit/hermeticon-wanderer/index.html` | Published copy, stamped with source commit SHA |
| Canonical public URL | https://bonoj.github.io/jit/hermeticon-wanderer/?terrain=authored-v1 | Verify what the human can actually see |

## Resume a task

1. **Orient:** Read this entry point, then inspect the actual source and only the supporting contract(s) relevant to the requested change. Check source HEAD and any recent changes that could supersede this snapshot. Do not ask the human to navigate the repositories for you.
2. **Locate:** Find the existing implementation, nearby controls, state ownership, and diagnostics before proposing a new system. Preserve working systems and use established composition patterns; avoid speculative framework work.
3. **Change:** Implement the requested smallest coherent change. Keep a clear distinction between code written, behavior inferred, and behavior actually observed.
4. **Verify:** Select the lightest adequate evidence: source inspection, bounded state probe, screenshot or visual sequence, spatial query, or material accounting. Prefer on-demand JIT instrumentation over expensive always-on witnesses. If a visual judgment requires the human, give a canonical link and one clear observation request.
5. **Deliver when authorized:** Read `bonoj/Gate/README.md` **before** any Pages delivery. Inspect source, mirror, relevant Actions workflow and public page; resume the first incomplete step of the existing **JIT** route. Do not substitute a new publishing mechanism. A source commit, mirror commit, completed Pages deployment, and verified public behavior are distinct stages. Do not call a change live until public verification.
6. **Report:** State what changed, source SHA, whether Pages and public behavior were verified, and any concrete unresolved issue. If blocked, inspect the exact failure and recover using Gate rather than transferring routine work to the human.

**Scope:** A discussion or request to plan does not itself authorize edits or deployment. A request to build does not automatically mean publish; follow the user's explicit instruction. Gate governs delivery, not design.

## Invariants to preserve

- **Three-dimensional retina:** The Hermeticon inner volume defines local membership and selected simulation eligibility. The camera independently determines projection. A 360° camera orbit must not change reeds' growth, residents' clocks, or other world state. Moving the Hermeticon across geology can change membership.
- **World versus vessel:** Persistent geological coordinates and material identity are not camera-local. The lower Crucibowl is physically distinct from terrain. Falling through a geological hole does not necessarily mean leaving the Hermeticon volume.
- **Input:** Tap acts/redirects; drag orbits; pinch zooms. Camera remains under human control during movement and simulation. Do not turn missed taps into silent failures, obstruct controls, introduce long-press requirements, or overload the input/frame loop.
- **Wanderer:** Terrain seating, occlusion, hole avoidance, bounded routefinding, and central half-radius aperture-follow behavior are established working behavior. Do not casually replace them.
- **Material:** Conserve authoritative material quantities under the material contract. The pumpkin's 100 red splat beads are **visual particles**, not members of the conserved 10k BB inventory.
- **Observation:** Keep normal runtime instrumentation bounded. FPS is performance evidence, not correctness. Do not assert GPU ray queries or depth witnesses exist merely because they are possible instruments.
- **Build identity:** HUD presents first eight characters of source SHA, FPS, refresh; full SHA remains inspectable. Population selection is a separate world control. A label or queued workflow does not prove the browser serves a build.

## Current working world — snapshot, not authority

- Authored persistent signed geology (85×21×85, 81 extraction chunks); 85×85 semantic atlas with nine views and 22 named landmarks. The atlas POPULATION layer is a tag, not an autonomous population system.
- Wanderer walks on the terrain, redirects on tap, routes around holes, and moves the aperture after leaving the central half-radius region.
- Mists has a 50-variant deterministic bead-lattice gallery with two prominent visual families and an important original sparse-reed reference. Reeds grow/retreat according to Hermeticon boundary and respond locally to character proximity, **not camera frustum**.
- Three individually scripted residents: Mists orange fugitive flees and splats into 100 visual BBs; Quills turquoise peacock opens a nine-quill fan; Amaranthine violet gardener tends seven flowers. Their current outside-rim behavior guards are targeted, not a generalized agent lifecycle.
- Cloud emission is paused at fresh load; the 96-unit quarry transfer experiment is dormant/hidden. Existing BB and water/gel experiments are not a universal water solution.
- On-demand INSPECT/COPY REPORT was historically verified on Android. Avoid reinstating heavy per-frame diagnostics.
- Last specifically recorded retina-related source commit: `2eb4d64e`. This is **not** a claim about current HEAD or what is live; inspect both.

## Maintenance rule

Keep this file short and operational. Update the resource map or invariants when they change; replace stale snapshot claims instead of appending chronological notes. Keep detailed implementation status in `SEMANTIC_SURFACE.md`, durable interaction rules in `HERMETICON.md`, material rules in `matter/MATTER.md`, and historical experiments in their own records. Do not create dependencies on Ledger notes. **One pointer from the human should be enough.**
