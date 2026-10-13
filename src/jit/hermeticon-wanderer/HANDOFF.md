# Hermeticon Wanderer — start here
Updated 2026-10-13. **This is the one project entry point.** The human names Wanderer and the task; the model locates resources, inspects source, preserves invariants, implements and verifies the requested change, and handles routine delivery/recovery. This document is a map, not evidence of current deployed state.

## Resource map

| Need | Authoritative location |
|---|---|
| Executable | `bonoj/Repository/src/jit/hermeticon-wanderer/index.html` |
| Current systems and limitations | [SEMANTIC_SURFACE.md](SEMANTIC_SURFACE.md) |
| Hermeticon invariants and interaction | [HERMETICON.md](HERMETICON.md) |
| Matter/conservation | [matter/MATTER.md](matter/MATTER.md) |
| Geology and atlas history | [WORLD_GENERATION_EXPERIMENT.md](WORLD_GENERATION_EXPERIMENT.md) |
| **Publication and failure recovery** | `bonoj/Gate/README.md` |
| Pages mirror | `bonoj/bonoj.github.io/jit/hermeticon-wanderer/index.html` |
| **Canonical live view** | https://bonoj.github.io/jit/hermeticon-wanderer/?terrain=authored-v1 |

## Resume, change, deliver

1. **Orient:** Inspect current Repository source and HEAD; read only supporting documents relevant to the task. Find the existing code, state ownership, and available JIT instruments before designing a replacement. The snapshot below can be stale.
2. **Work:** Preserve established behavior. Implement the smallest requested change; distinguish intended behavior, committed code, observed behavior, and user-accepted behavior. Discussion/planning is not authorization to edit; building is not automatically authorization to publish.
3. **Observe:** Choose the smallest adequate evidence: visual sequence for appearance, state probe for behavior, spatial query for geometry, accounting for matter. Keep normal runtime observation bounded; do not add expensive frame-loop witnesses.
4. **Publish only when requested:** **Read `bonoj/Gate/README.md` before delivery.** Follow its existing JIT route, inspect source SHA, Pages mirror, Actions deployment, and actual public output. Resume at the first incomplete step. Never call a queued deployment or updated label live.
5. **Report:** What changed, source SHA, exact delivery/verification status, and any unresolved issue. Ask the human for a visual judgment only when it genuinely cannot be established through available evidence.

## When GitHub or OpenAI tooling fails

**A failed tool call is not a failed task.** Inspect the exact error and current remote state. Classify schema/argument mismatch, stale SHA, payload/transport problem, rate limit, transient service issue, connector failure, permissions, or explicit safety/authorization restriction. Check available supported tool actions and their contracts; do not endlessly repeat the same failing call.

For GitHub Contents write/transport failures, use Gate's authorized incremental-write or Git Data blob → tree → commit → ref recovery path when available; verify expected HEAD and read back bytes. For deployment failures, resume Gate's first incomplete JIT step. **Do not bypass real permission or safety restrictions, silently force past a conflict, invent a publishing mechanism, or make the human debug routine platform friction.** If all permitted routes fail, report the exact blocked step, attempted remedies, and minimum required human action.

## Invariants — protect these

- **3D retina:** Inner Hermeticon volume governs local membership and selected simulation activity; camera controls projection only. A full orbit must not change reed growth, resident clocks, or other world state. Moving the Hermeticon relative to geology can change membership.
- **World ownership:** Persistent geology and authoritative material are world-space; lower Crucibowl and geological terrain have distinct physical roles. A hole in geology does not imply exit from the Hermeticon volume.
- **Interaction:** Tap acts/redirects, drag orbits, pinch zooms. Never hijack camera, silently discard deliberate taps, add long-press dependencies, or block input with expensive simulation.
- **Wanderer:** Preserve accepted terrain seating, occlusion, hole avoidance, bounded routefinding, and central half-radius aperture-follow.
- **Matter:** Preserve authoritative inventory/conservation. Pumpkin's 100 red splat BBs are **visual**, outside the conserved 10k BB inventory.
- **Observation:** Bounded on-demand instruments; FPS measures performance, not correctness. GPU ray/depth instrumentation is an option, not a confirmed existing feature.
- **Build:** HUD shows first eight characters of source SHA, FPS, refresh; full SHA inspectable. Population selector is separate. Source, mirror, completed deployment, and verified public behavior are separate facts.

## Current foothold (verify against source)

Persistent authored signed geology (85×21×85, 81 extraction chunks), 85×85 semantic atlas with nine views and 22 landmarks. Wanderer walks, redirects, avoids holes, and moves the aperture beyond the central half-radius. Mists contains 50 selectable deterministic bead-lattice variants (mostly two perceptual families; preserve original sparse reeds), with boundary-driven growth and local proximity collapse. Three individually scripted residents: Mists fugitive runs and splats; Quills peacock fans; Amaranthine gardener blooms seven flowers. Their outside-rim guards are targeted, **not** a general lifecycle. Cloud emission is paused; quarry transfer is hidden/dormant. Existing material/gel experiments are not a general water solver.

The last specifically documented retina source commit was `2eb4d64e`, **not** an assertion of current HEAD or live status.

**Maintenance:** Replace stale snapshot text; do not append chronological updates. Put implementation details in SEMANTIC_SURFACE, durable rules in HERMETICON, material details in MATTER, and history in experiment records. Do not make Ledger an operational dependency.
