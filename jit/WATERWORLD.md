# Waterworld — Working Specification
Status: planning only. No implementation authorized by this document.
Last updated: 2026-10-10

## Intent
Build beautiful, convincing, **genuinely 3D water** for perturbable, composable executable worlds. Water is material with identity and consequence, not a heightfield, decorative shader, or collection of visible ball bearings.

## First acceptance scene: existing Waterworld bauble
Keep the existing page `https://bonoj.github.io/jit/waterworld/`, glass sphere, camera, controls, inspector, and visual grammar. Do not create a second site, half-bauble, or replacement UI.

Under ordinary **downward gravity**, water must:
- Rest level and genuinely still; no spontaneous acceleration, vibration, or creeping.
- Slosh with mass, inertia, overshoot, reflected waves, and believable damping.
- Produce interacting ripples and waves with appropriate propagation and dissipation.
- Splash: crowns, jets, sheets, separated droplets, ballistic motion, and reunion.
- Pour, cascade, pool, circulate, and interact with obstacles.
- Displace and buoy objects; support floating, bobbing, sinking, and wakes.
- Remain inside curved glass with stable pressure and contact behavior: **no sticking, spikes, tearing, wall-clamped triangles, or tunneling**.
- Look like continuous clear water: depth, reflection, refraction, absorption, highlights, coherent silhouettes, and plausible caustics. Evan Wallace WebGL Water is an *appearance benchmark*, not a sufficient 3D solver.
- Target **60 fps or better on john's actual phone**. Measure rather than infer; quality and performance are both requirements.

## Longer-range physics
The fluid must not assume one vertical surface or globally downward gravity. Support arbitrary 3D forces and containment, including:
1. Lakes/rivers inside a rotating O'Neill cylinder under effective artificial gravity.
2. Water escaping a breach into space with conserved momentum.
3. Free-floating streams, droplets, blobs, orbital motion, and flow toward a central black-hole-like attractor.
4. Deliberate transport back outward, returning to a reservoir.
5. Eventually evaporation, vapor transport, condensation, rain, freezing and melting, preserving material identity and accounting through transitions.

## Engineering direction — candidates, NOT a decision
- Study and benchmark established **3D fluid solvers**, particularly PBF, DFSPH/SPH, and APIC/FLIP. Do not invent a new solver before testing established work.
- Separate fluid state/physics from appearance. Simulated particles are **not** giant visible spheres. Investigate screen-space fluid depth/thickness/normal reconstruction and/or reconstructed surface meshes; judge mobile cost and image quality.
- Investigate physically correct curved boundaries (implicit signed-distance/volume boundaries, suitable slip/friction, pressure consistency, collision stability) rather than clamping a visual surface to the glass.
- Evaluate WebGPU availability and fallback constraints on the actual target device. GPU compute, neighbor search, solver iteration count, fluid rendering resolution, memory traffic, and CPU↔GPU readbacks must be profiled.
- Distinguish simulation cadence from display cadence without misrepresenting performance.
- Treat material transport, phase transitions, and accounting as composable systems above/alongside the local fluid solver, not as reasons to fake fluid motion.

## Existing references to evaluate
- Particles4All: https://particles4all.netlify.app/
- LinzhouLi WebGPU fluid: https://linzhouli.github.io/WebGPU-Fluid-Simulation/
- WebGL PBF: https://xuxmin.github.io/pbf
- SPlisHSPlasH physics reference: https://github.com/InteractiveComputerGraphics/SPlisHSPlasH
- Evan Wallace WebGL Water (visual reference): https://madebyevan.com/webgl-water/
These are leads, **not validated mobile solutions**. Check code, licensing, compatibility, actual boundary behavior, optics, and phone benchmarks before choosing.

## Prior failures to avoid
- The previous custom 2.5D heightfield developed nonzero rest velocity, extreme speed, and ~184 clamped wall vertices; patching the display did not solve the physics.
- The later `jit/waterworld-3d/` detour created a separate page, UI, half-bauble, and 1,152 rendered balls, ran ~20 fps, and did not constitute a validated fluid solution. That experiment was deleted; do not recreate it.
- Don't claim a commit is publicly live without verifying Pages and the served page.
- Don't use unreliable dynamic chat image embeds; prefer direct links to real demonstrations.
- Keep the small refresh ↻ next to the build identifier; do not redesign UI while working on water.

## Sequence when explicitly authorized
1. Research and compare actual implementations, licenses, boundary handling, renderers, and phone/WebGPU constraints.
2. Define an observable benchmark and acceptance instrumentation (rest velocity, conservation, wall penetration, stability, frame time, particle counts).
3. Test the best candidate with minimum disruption and honest performance reporting.
4. Integrate **only** the water subsystem into the existing Waterworld.
5. Validate stillness → slosh → waves → splashes → curved-wall contact → optics → 60 fps.
6. Expand to arbitrary gravity, cylinder escape, central attractor, and return transport only after the first scene works.

## Authority and delivery
**STOP: Do not build, edit executable code, commit an implementation, or deploy until john explicitly asks.** This document is a specification, not permission to execute. Planning and discussion are fine. For any later authorized JIT deployment, read `bonoj/Gate/README.md`, inspect state, follow the existing route, and verify the public result.

**Success:** One existing Waterworld with beautiful, stable, real 3D water at measured mobile 60 fps, extensible to impossible-world material transport. No fake balls, no sticky/spiky glass, no new website.
