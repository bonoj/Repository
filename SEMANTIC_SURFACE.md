# Repository Semantic Surface

This file states present executable truths. It is not a roadmap, product description, ontology, or history.

## Authority

For current behavior, trust in this order:

1. the built executable and observed behavior;
2. `src/betwixt/world-lab.html`;
3. build and verification machinery;
4. this surface.

The working organism wins over an attractive reconstruction.

## What Repository is

Repository is the current executable ownership boundary for things that may meet, move between contexts, or acquire new behavior without requiring repository migration.

A place does not own an entity's identity.

Current working law:

**Repository owns identity. Places provide context. Systems provide behavior. Relationships connect entities. Consequences survive crossings.**

This law is architectural pressure, not a claim that the code has fully generalized it.

## Current executable

The published Betwixt executable is built from `src/betwixt/world-lab.html`.

That file is the finished World Lab organism transplanted intact and then modified only where executable pressure earned a seam. Its old filename is provenance, not current place identity.

`tools/build.mjs` injects the Repository shell before the donor runtime and attaches the read-only Repository ECS mirror after the donor runtime exists.

`src/betwixt/main.js` and `src/betwixt/shell.html` are an earlier reconstruction path. They are not used by the current build. Do not infer current behavior from them.

## Betwixt and its content are different things

Betwixt currently owns the world-space context: renderer, camera/observer, floor, dome, lighting, fog, interaction surface, Repository status, and spell trays.

The current six-toy arrangement is content *in* Betwixt, not Betwixt itself.

That distinction is executable as `betwixtContent`, a Three.js parent group. It currently contains:

- the five inherited presence roots;
- Jupurn;
- Orbital's independently animated orbit root;
- Foundry drones;
- Descent spoil/stones.

Toy-local descendants remain below those roots.

New organism-owned dynamic render objects must not attach directly to `scene`. They belong beneath `betwixtContent` unless executable evidence earns a different boundary.

The floor, dome, and lights are intentionally outside `betwixtContent`.

## The content boundary has earned operations

The boundary exists because whole-organism operations required it.

Current operations are deliberately provisional:

- `⬆️ / ⬇️` translates the content parent vertically and returns it exactly.
- temporary `⚪️` compacts the intact content around its center into a small representation and subjects that representation to simple gravity; tapping again restores ordinary scale.
- `🛠` clears the bench by restoring ordinary transform, hiding the entire content parent, and suspending the donor simulation loop. Restoring it shifts simulation time anchors so hidden wall-clock time does not become a giant simulation step.

These operations do not establish a universal scene-container protocol, scale system, Workshop schema, or miniature-world architecture.

The demonstrated fact is smaller: the same executable organism can be encountered at another transform/scale or removed from the current context without dismantling its internals.

## Workshop

There is no separate Workshop repository and no generalized Workshop implementation.

At present, `🛠` earns only one Workshop fact: Betwixt can clear its existing content out of the way while leaving the place and coordination surface alive.

`⚗️` is a separate resident container spell. It owns the transported Crucible organism as one parented stateful boundary: raised plinth/terrain, its water and lava state, packed bearings, steam consequences, meteors, and their internal composition. When ⚗️ is off, that parent is absent and its simulation is suspended; its temporary left-tray controls are absent. When ⚗️ is on in Workshop, the same state returns with those controls.

Workshop context does not own Crucible's fluids merely because the fluid machinery is reusable. Liquid authored inside ⚗️ remains Crucible state. Future Workshop fluids may coexist only as independently owned state.

Do not build a fabrication framework merely because the bench is empty. Let construction pressure earn operations.


## Betwixtable spatial boundary

Repeated Workshop pressure has earned one small spatial contract.

A **Betwixtable** is the persistent spatial identity of manipulable content in Betwixt. Camera focus, home/foreground motion, return state, visibility ownership, interaction volume, world placement, and grounding belong to the Betwixtable shell rather than to presentation geometry inside it.

Presentation geometry is authored in the shell's local coordinates. Its rendered bottom may be seated to the shell's local floor, but presentation children do not know GROUND_Y and are not re-grounded in world space. Replacing one presentation with another must be spatially inert.

The Chem discovery object currently demonstrates this boundary: one persistent betwixtable:chem-discovery contains a presentation that changes from dynamite to microscope. Both forms are locally seated against the same shell; detonation changes presentation without changing spatial identity, focus, or world placement.

The physical Crucible geoglass is likewise manipulated through its Betwixtable shell. The substantial Crucible simulation it invokes remains separately owned by the ⚗️ container; it is not presentation geometry inside the geoglass.

Treat the Betwixtable shell as the current geometry encapsulation and spatial snapping point. This does not yet establish a generalized fabrication, layout, or semantic-port framework.

## Simulation and persistence

The donor contains its own ECS and simulation systems for the inherited presences and their local machinery.

When `contentWorkshopHidden` is true, the render loop returns before those systems advance. This is runtime suspension.

Workshop hidden state itself is not persisted as WorldState. Existing page lifecycle code may serialize donor WorldState while the content is hidden; that serialization does not advance simulation.

The donor's BFCache/departure continuity remains authoritative for its existing navigation behavior.

## ECS reality today

There are currently two ECS layers.

The donor ECS inside `world-lab.html` is operational authority for the inherited Betwixt organism: identities, transforms, selection, foregrounding, destinations, and toy systems.

`src/betwixt/mirror.js` creates a second Repository ECS after load. It is intentionally read-only and currently mirrors only the original five presences. It samples donor transforms on demand.

The mirror does **not** currently own Jupurn, `betwixtContent`, Workshop hide/freeze state, toy simulation, navigation, or donor transforms.

Do not mistake the mirror for authoritative world state. Migrate ownership only when an executable operation requires it and preserved behavior can be checked.

## Shared runtime code

`src/core/ecs.js` is a small generic ECS primitive.

`src/runtime/three-runtime.js` and `src/runtime/render-sync.js` are reusable runtime seams inherited from earlier extraction work. They are not presently on Betwixt's published execution path because the intact donor remains authoritative.

Repeated executable use, not their existence in `src/runtime`, determines whether they are substrate.

## Shell and spells

The Repository shell owns the visible status and the two spell trays.

Status grammar is:

`{sigil} {TITLE} · {BUILD_8} · {FPS} fps`

For Betwixt the place identity is currently `🌀 BETWIXT`.

Build is the first eight characters of the exact Repository commit used to build the executable. Full SHA remains machine provenance.

Spells are model-mediated working controls. Temporary spells may appear and disappear without ceremony. Resident spells have survived enough local use to remain useful. Repetition across contexts may earn shared vocabulary; it does not presume it.

Current shell still declares Betwixt's place identity and spell arrays directly in `src/shell/repository-shell.js`. The stronger generic-shell/place-config separation has not yet been implemented.

## Earned material: glass

Betwixt has one visually accepted glass baseline, earned by the communicating-tanks Workshop specimen.

Current glass standard is intentionally cheap: a pale cyan-gray `THREE.MeshStandardMaterial` with `color: 0xc8e2e3`, `transparent: true`, `opacity: .16`, `roughness: .08`, `metalness: 0`, `depthWrite: false`, and `side: THREE.DoubleSide`, paired with explicit `EdgesGeometry` drawn in muted blue-gray at about .62 opacity.

The accepted perceptual result came from translucent faces plus explicit edges, not refraction, transmission, environment mapping, Fresnel, thickness simulation, or a custom shader. Treat this as the local glass standard until executable evidence earns a replacement or family, not as a universal material abstraction.

## Publication

Repository builds the executable.

Private Home pins an exact Repository SHA, checks out that exact source, rebuilds and verifies it, then publishes the artifact into the public Interstice `betwixt/` socket with a full Repository SHA provenance marker.

Interstice is publication membrane, not executable ownership authority.

A green Repository build is not by itself proof that public Betwixt is current. Provenance and Interstice Pages publication must also agree.

## Guardrails earned by failure

Preserve a working organism before extracting from it.

Do not reproduce a finished behavior from screenshots, prose, or apparent external behavior when the working source can be transplanted or inspected. That failure mode produced plausible code while silently losing earned camera, interaction, continuity, and screen behavior.

Discover seams from inside the organism under executable pressure.

Do not preserve only the appearance or one downstream consequence of authoritative material and call the material transported. The Grimoire lava failure at Repository `9c0a6a6e` rendered an orange spherical proxy and manually restored lava → bearing pops while bypassing the transported lava state. It looked causally plausible but could not participate in fluid interactions such as external gravity. Material transport is accepted only when one authoritative state drives its presentation and its earned consequences.


Do not equate place with repository.

Do not create import/export machinery merely to move an entity between contexts inside Repository.

Do not promote a temporary spell, representation, component, or runtime seam into universal architecture before repetition earns it.

When prose and executable evidence disagree, update or delete the prose.

## Crucible Workshop stability snapshot

This section records a recoverable regression boundary, not current project state or a roadmap.

Repository `0233e12a26b58fbd7fd7709b3ef52e5be5f3592d` is the stability snapshot after the raised Crucible Workshop composition, meteor transport seams, and fixed-footprint meteor magnitude control were working together. Home published that exact Repository revision through its pinned build route.

Earlier accepted pre-meteor reference `b27ca198e87f54b50d7440a31727241414dc176a` remains useful archaeology if a regression specifically concerns the meteor addition. Do not keep advancing these SHAs as development moves; they are recovery coordinates.

### Composition that must not regress

The raised Crucible terrain/plinth is one ownership space. Transported terrain, shallow water, shallow lava, packed bearings, steam contact effects, lava bearing pops, and meteors are composed against that terrain space rather than reimplemented as visual proxies.

Water and lava are the transported shallow-field systems. They are 2.5D terrain-supported fields, not volumetric fluids. Their authoritative state drives their surfaces and consequences.

Bearings use Crucible's packed-array bearing implementation, not one ECS entity per bearing. They remain liquid-aware. Lava bearing pops sample actual wet lava cells and spawn through the bearing system.

Steam exists only at water/lava contact. Do not replace that causal rule with generic lava smoke.

Meteors use the transported Crucible meteor system. Workshop supplies the composition seams that the module expects from Crucible's root: its ECS Transform is synchronized to its Three.js RenderObject, and meteor impacts are emitted onto the shared impact bus consumed by packed bearings. Terrain impact, rendered descent, and bearing impulse are separate consequences of the same meteor event.

The current Crucible meteor module also owns a small additive orange wake. That wake is presently not visible correctly in Betwixt and is intentionally left unresolved. It is not required to reinterpret or rewrite the otherwise working meteor composition. Meteor presentation may be revisited later.

### Controls at the snapshot

At that snapshot the left tray exposed:

- `☄️` meteor, with four impact magnitudes;
- `⛰️` next deterministic terrain;
- `⚫️` bearing spawn, cycling 25 / 25,000;
- `💧` water source;
- `🌋` lava;
- `⛏️` carve terrain;
- `🪏` raise terrain.

These controls are working handles, not an API taxonomy.

### Regression rule

Do not casually reconstruct, simplify, normalize, or independently imitate any system in this composition.

When extending it, preserve existing authoritative state and causal paths. Change the smallest seam required by the new behavior. A plausible visual result is not parity.

A green build proves construction, not experiential acceptance. john's observed acceptance is the boundary for promotion.

