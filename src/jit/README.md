# JIT — cold-start entry point / build and publish

This directory is the **source** for small, standalone JIT sites. Each site lives at `src/jit/<slug>/index.html` in `bonoj/Repository`.

## Cold-start discovery

For a **new JIT bauble**, start here, then read [`bonoj/Gate/README.md`](https://github.com/bonoj/Gate/blob/main/README.md) **before any build, commit, sling or deployment**. Gate is the delivery authority for JIT as well as Betwixt; this JIT README supplies the route-specific map. **Mandatory canonical template:** first fetch `bonoj/bonoj.github.io` `master:jit/bauble/index.html` (deployed at `https://bonoj.github.io/jit/bauble/`). This is the existing EMPTY JIT BAUBLE and the authoritative starting scaffold for every new JIT bauble. Copy its complete source into the new experiment before adding behavior. Preserve its existing scene, camera, vessel, input, rendering, and other reusable systems; do not substitute a freshly invented scene or use an unrelated neighboring experiment as the template. Never edit the canonical `jit/bauble/index.html` when creating an experiment. A neighboring experiment may be consulted for specialized behavior only after the empty bauble is loaded. If the canonical template is unavailable, stop and report that instead of improvising. Choose a new unused slug under `src/jit/<slug>/`; do not overwrite Waterworld or other existing experiments. Do not assume the current chat contains the publishing steps.

For **existing Waterworld**, distinguish the [current working specification](WATERWORLD.md) (ambitious future 3D-water goals, not an implementation authorization) from the [v25 executable handoff](waterworld/WATERWORLD.md) (what the present 2.5D hybrid actually does). The [Ledger technical account](https://github.com/bonoj/Ledger/blob/main/notes/2026-10-10-waterworld-conserved-liquid.md) is historical evidence, not deployment authority.

## Mandatory inherited bauble machinery

The deployed `jit/bauble/index.html` is executable infrastructure, not a visual suggestion. Copy the **current** canonical file each time; do not copy an old experiment or freeze a template version in this README. During experiment work, preserve and verify:

- **Vessel and framing:** spherical inner/outer radii, glass and intentional exterior hardware, scene graph, camera orbit/pinch/wheel input, responsive full-bauble initial framing with breathing room. Scene-down gravity is an experiment decision, never an implicit radial-gravity assumption.
- **Single-source build identity:** one `BUILD` constant feeds the visible build name/number **outside INSPECT** and the inspection report. Advance the identifier for each published change. Preserve the adjacent ↻ fresh-fetch control. Never let HUD and report disagree.
- **Inspection and failure reporting:** INSPECT / COPY REPORT, bounded privacy-minimal interaction trace, runtime/viewport/camera/render/performance evidence, and visible fatal-error reporting. Keep the report truthful about which systems exist.
- **Containment:** preserve the mesh-vertex / instanced-mesh verifier, its visible red alarm, console diagnostic, and INSPECT evidence. Interior geometry must remain inside `INNER_R`. Intentional exterior designs require explicit `userData.allowOutsideBauble=true`; never casually exempt experimental contents. This verifier detects breaches; it does **not** enforce physics, catch unrendered particles, or guarantee no escape between checks. Add simulation-side containment and invariants for each material system.
- **Fixed-step clock:** retain the 8 ms simulation step, bounded catch-up, accumulated/dropped-time accounting, and empty `simulate(dt)` extension point. Simulation must not depend on variable render fps.
- **Generic invariants:** retain `BaubleRegisterInvariant`, periodic verification, shared warning alarm, and inspection diagnostics. Register experiment-specific conservation, boundary, invalid-state, and similar checks rather than silently swallowing failures.
- **Simulation/render separation:** treat authoritative physical state and rendered surfaces as distinct where appropriate. When contact or seating depends on a rendered surface, verify their agreement; do not blindly use a visual approximation as physics.
- **No imported domain assumptions:** the template remains empty. Waterworld's liquid solver, buoyancy, wind, orbiting gravity, and bead accounting are examples of domain systems, **not** default bauble behavior.

Before slinging a new bauble, check that the build label and report match; framing shows the complete sphere on the target viewport; INSPECT and error copy work; registered invariants are present; containment is not accidentally disabled; and the committed/published source bytes agree. Distinguish source verification from actual browser/runtime verification. Never claim that a verifier guarantees physical confinement when it only detects breaches.

## Canonical publication route

1. Fetch the canonical empty bauble from `bonoj/bonoj.github.io` `master:jit/bauble/index.html` and use its full contents as the new site's initial scaffold. Do not replace it with a new scene. Read Gate before writing.
2. Create or edit `bonoj/Repository/src/jit/<slug>/index.html`. Commit it.
3. Read the committed source back from Repository. Publish its **exact contents** to `bonoj/bonoj.github.io/jit/<slug>/index.html` on the site's **master** branch (create if absent, update with current blob SHA if present). Commit it.
4. Read the published file back and compare its contents with Repository source. Verify the Pages deployment status and, where tools permit, the actual public response.
5. Give john **one canonical URL**: `https://bonoj.github.io/jit/<slug>/`. Report the publication commit and distinguish committed, Pages-deployed, and publicly verified states. Never claim live based solely on a successful commit.

The public Pages repo is `bonoj/bonoj.github.io` — **not** `bonoj/jit` (which is not the JIT publishing repo). Existing examples: `spellbook`, `genesis`, `false-gods`, `chem001`, `crossing`, `fieldwork`.

**Do not use the Betwixt publication chain for ordinary JIT pages.** Gate governs both routes; its JIT route is direct Repository → `bonoj.github.io` publication. Betwixt alone uses Repository → Home → Interstice. Read Gate first for either route.

## Guardrails

- Don't stop after committing source; publish the public copy in the same task unless told to hold.
- Keep private Home material and secrets out of public JIT source.
- Do not invent a separate build system or deploy route for a static one-file page.
- If public verification isn't possible, say so precisely; don't make john diagnose routine publishing mechanics.
- This README is procedural, not a replacement for inspecting the current repositories if their topology changes.
