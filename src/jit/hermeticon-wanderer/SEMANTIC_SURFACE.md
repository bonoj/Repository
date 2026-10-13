# Hermeticon Wanderer — executable semantic surface
Updated 2026-10-13. **Current-state guide, not a deployment record.** Source is authoritative: `bonoj/Repository/src/jit/hermeticon-wanderer/index.html`. Start with [HANDOFF.md](HANDOFF.md) for resource discovery and delivery; this file describes the systems and their ownership.

## World, retina, camera

- **Persistent world:** Signed authored geology (85×21×85) extracted in 81 chunks, with 85×85 semantic atlas, nine display layers, and 22 named landmark operations. Atlas POPULATION is a map tag, not an autonomous population system. Landmarks have bobbing world-space markers and proximity-sized labels.
- **Three-dimensional retina:** The inner Hermeticon boundary selects the world-space volume eligible for local presentation and selected behavior updates. The virtual camera projects this admitted scene independently. Camera-frustum visibility **must not** change ecological or character state.
- **Wanderer:** Mobile tap-to-redirect movement; orbit and pinch remain independent. Character follows terrain height, is depth-occluded by terrain, avoids unsupported holes and inner boundary, and uses bounded routing around holes. The world aperture follows once Wanderer leaves the central half-radius region. These are established behaviors; do not re-solve old flat-ground navigation.
- **Vessel versus geology:** The lower Crucibowl is physically distinct from geological support. Persistent geological coordinates own world-domain material; moving the aperture does not re-own it.

## Populations and residents

- **Mists bead-lattice gallery:** 50 deterministic selectable variants, mostly two visually distinct structural families with palette/parameter changes. Preserve the original sparse-reed reference. Reeds grow/retreat with the Hermeticon boundary and locally collapse/regrow around inhabitants; a camera-frustum dependency previously caused false shrink/regrow and was removed.
- **Mists fugitive:** Orange cube idles and jumps, flees toward Downton on proximity, launches from supported rim, falls and splats. Its body and 100 red spray BBs use vessel-local coordinates after impact. Those particles are visual only, not part of the conserved material inventory.
- **Quills peacock:** Turquoise cube idles and opens/closes a nine-quill fan in response to Wanderer's proximity.
- **Amaranthine gardener:** Violet cube idles beside seven geometric flowers that bloom and close with Wanderer's proximity. This is animated geometry, not conserved material growth.
- **Boundary guards:** These three scripted residents hide and pause their behavior outside the inner Hermeticon boundary, independently of camera orientation. The guards are targeted; there is no proven universal agent/population lifecycle, and not every geometric extremity is individually clipped.

## Matter, experiments, and instrumentation

- **Material:** Historical 10,000-unit cloud/BB accounting and lower bowl behavior are documented in [matter/MATTER.md](matter/MATTER.md). Fresh-load cloud emission is paused. The 96-unit quarry transfer experiment is hidden/dormant. Existing BB, water, and gel-sheet slices are not a general hydrology solution.
- **Observation:** INSPECT/COPY REPORT was historically player-tested on Android; heavy automatic per-frame witnesses were pruned in V48. For new questions, use bounded JIT state probes, screenshots/sequences, spatial queries, or accounting as appropriate. GPU-derived depth/picking or GPU ray queries may be considered where supported; do not assert that Wanderer currently implements them.
- **Provenance:** HUD metadata is first eight source SHA characters, FPS, refresh; full source SHA is inspectable. Population selection is a separate world control. Code commit, Pages mirror, deployment, and public runtime are distinct evidence stages.

## Known limits and interpretation

The three residents are individually scripted encounters, not an autonomous population framework. The atlas POPULATION tag is not the bead-lattice population system. The 100 red splat particles are not authoritative BB matter. The historical 96-unit transfer report (receiver 96, source/transit 0 at 24.367s, 75.1 FPS, no reported errors) is evidence of that past experiment, **not** proof of geological lineage or current transfer activity. Do not infer present deployment state from an old note. Read current source for exact parameters and the public build for observed behavior.
