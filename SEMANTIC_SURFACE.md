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

Do not build a fabrication framework merely because the bench is empty. Let construction pressure earn operations.

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

## Publication

Repository builds the executable.

Private Home pins an exact Repository SHA, checks out that exact source, rebuilds and verifies it, then publishes the artifact into the public Interstice `betwixt/` socket with a full Repository SHA provenance marker.

Interstice is publication membrane, not executable ownership authority.

A green Repository build is not by itself proof that public Betwixt is current. Provenance and Interstice Pages publication must also agree.

## Guardrails earned by failure

Preserve a working organism before extracting from it.

Do not reproduce a finished behavior from screenshots, prose, or apparent external behavior when the working source can be transplanted or inspected. That failure mode produced plausible code while silently losing earned camera, interaction, continuity, and screen behavior.

Discover seams from inside the organism under executable pressure.

Do not equate place with repository.

Do not create import/export machinery merely to move an entity between contexts inside Repository.

Do not promote a temporary spell, representation, component, or runtime seam into universal architecture before repetition earns it.

When prose and executable evidence disagree, update or delete the prose.
