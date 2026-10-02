# Crucible cargo

Exact rebuildable source transplant of Crucible executable candidate.

- donor repository: bonoj/Crucible
- donor commit: d1c5e437197e72b16624c0b7104c6e9d9cbb0d0f
- donor candidate workflow run: 36933948286
- donor candidate artifact: 11197201981
- donor candidate artifact digest: sha256:4d8357f196ebe6845448a5aea5c97af2a7a46ae2dbefa8ddc51dc3a4487a0377
- source files: 50
- source bytes recorded by donor tree: 217670

This cargo is inert. It has not been integrated with Betwixt, Repository ECS, shell, renderer, input, or publication.

Preserve the organism before extracting seams.


## Water organism boundary

Crucible water is not merely its solver. The transported source closure preserves:

- `runtime/shallow-water-system.js` — authoritative 64×64 state **and** continuous presentation reconstruction, wet/support/terrain clipping, free-surface mesh, boundary curtain, injection, viscosity, and sampled surface/flow interfaces.
- `runtime/terrain-system.js` — exact bed/support and material-boundary semantics consumed by water.
- `runtime/bearing-system.js` — buoyancy and flow coupling through `surfaceY` + `flowInto`.
- `runtime/transport-system.js` — scalar-carrier coupling to the solved water support surface.
- Crucible `main.js` — integration evidence wiring terrain → water → bearings/scalar presentation.

The intact Crucible executable remains the behavioral reference. Extraction into Betwixt must not be described as full water transfer unless these couplings are preserved or explicitly replaced and verified.


## Lava organism boundary

Crucible lava is a sibling use of the transported shallow-fluid machinery, but its identity includes integration behavior outside the solver:

- `createShallowWaterSystem(... kind:"lava" ...)` with the earned hot/deep presentation and viscosity level 26.
- shared terrain/material-boundary semantics and the same continuous reconstructed surface machinery.
- bearing coupling through `liquids:[transport,lavaTransport]`.
- water/lava overlap producing the `water-lava-steam` consequence.
- lava wet cells driving intermittent bearing pops from the live surface.
- live update ordering: bearings → water → lava → steam → lava pops.

The intact Crucible executable remains the behavioral reference for lava as well as water.
