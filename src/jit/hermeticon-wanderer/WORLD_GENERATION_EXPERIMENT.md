# World Generation Experiment

## Source map labels

- The Summerlands
- The Winter King's Realm
- To Ice Vale
- The Gradient
- The Amaranthine Fields
- The Quills
- The Heart of Darkness
- The Bood Lakes
- Jade Peak
- The Mists
- Downton
- Silverpass and the Gemgates
- Cinderglade and the Fell Crater
- The Whisperwood
- The Brambles
- The Rift
- The Spill
- Redwall
- Upton
- Kindle Tower
- The Violet Coast
- The Ocean of Tears

## Scope

Generate a **series of aligned 2D maps specifically from the supplied hand-drawn map**, then compile those fields into terrain and material state for a future Hermeticon Wanderer experiment. The image is the geographic source. The 22 author-confirmed labels above are the names; do not substitute guessed transcriptions.

This is an experiment, **not a canonical world-generation procedure** or an authorization to change accepted Wanderer V31 behavior. The Summerlands is only the yellow region, not the entire map. “To Ice Vale” is directional. Preserve “The Bood Lakes” exactly.

## Field atlas

Every layer shares one image-to-world transform, grid resolution, coordinate orientation, and seed. Keep **source observations** separate from **generated interpretations** so ambiguous geography can be corrected without destroying authored evidence.

| 2D field | Encodes | Informs |
| --- | --- | --- |
| **Elevation / relief** | Mountain crests, valleys, plains, passes, shore profile, crater relief; continuous height | Terrain genesis and slopes |
| **Terrain jurisdiction / biome** | Regions including the yellow Summerlands, Whisperwood, Brambles, Amaranthine Fields, etc.; irregular region masks | Which terrain and population functions may act where |
| **Hydrology** | Ocean, lakes, channels, catchments, drainage and the Rift/Spill where visually justified | Water domains, flow constraints and wetness |
| **Material provenance** | Source material identity, origin region/deposit, composition class, and lineage tags | What terrain is made of; what excavated, transported, deposited or fabricated material remains attributable to |
| **Strata / substrate** | Bedrock, overburden, soil, sediment, exposed rock and potential mineral domains | Vertical composition beneath the height surface; erosion and excavation |
| **Surface cover / population** | Forest, vegetation, bare rock, settlement footprint, built surfaces and density | Deterministic inhabitants, vegetation and structures |
| **Feature / landmark** | Named sites, paths, walls, towers, settlements, passes, crater and other discrete features | Thoughtforms, navigation anchors and later nested Hermeticons |
| **Confidence / authorship** | Explicit source strokes, inferred fill, unknown/unresolved areas, generated embellishment | Inspectability and non-destructive correction |

Material provenance is **not a color map**. Color may visualize provenance, but provenance is semantic material identity that persists through transformation. A bearing or terrain deposit should not silently become native to its destination just because it crossed a region boundary. Distinguish **source provenance** from **current location**, **material phase**, and **rendered appearance**.

The layers need not all be separate textures in the runtime. They are independently inspectable **authoring fields**; compilation may pack them or convert them into data structures appropriate for Wanderer's signed geology.

## Experiment sequence

1. **Register and align the source image.** Establish upright orientation, map bounds, world axes and a reproducible coordinate transform. Keep the original drawing available as an overlay. Do not pretend the current text-only note contains the image bytes.
2. **Trace the authored geography.** Mark region boundaries, coastlines, water bodies, mountain/ridge strokes and landmark points. Attach the confirmed names to features. Record uncertain boundaries as uncertain rather than manufacturing precision.
3. **Build the 2D atlas.** Produce and inspect each field separately, plus a composite overlay against the drawing. Use deterministic interpolation and noise only to fill between constraints; preserve major authored silhouettes and adjacency.
4. **Author material origins and strata.** Assign provisional, explicitly generated material domains and vertical profiles where the drawing does not specify geology. Carry stable source/deposit identifiers and allow mixtures; don't infer a definitive mineral inventory from colors alone.
5. **Compile the initial height surface.** Reuse the existing functional-terrain separation of independent fields and Terrain Genesis operators (ridge, trench, basin, shelf, broad relief). Replace procedural octagonal biome jurisdiction with map-derived masks. Keep a reproducible seed and recipe.
6. **Compile into mutable geological matter.** Adapt the resulting initial surface and provenance-bearing strata to Wanderer's persistent geological world. The map is an initializer, not a perpetual constraint on future deformation. Preserve matter identity through excavation, transport and deposition.
7. **Validate before rendering.** Compare atlas overlays to the drawing; check named-region placement, coastline/ridge continuity, feature coordinates, height ranges, water boundaries, provenance coverage, material accounting and deterministic regeneration. Expose source-vs-inferred distinctions in inspect output.
8. **Only then try a navigable Hermeticon.** Test whether Wanderer's aperture can traverse the generated geography while the world persists. Do not overwrite V31 or publish without a separate explicit decision.

## Existing source to reuse or adapt

- `src/betwixt/functional-terrain-v0.js` — independent 2D field composition, biome/feature jurisdiction, deterministic populations and material migration.
- `src/cargo/crucible/source/src/runtime/terrain-genesis.js` — deterministic heightmap genesis and geographic operators.
- `src/cargo/crucible/source/src/runtime/terrain-recipe-generator.js` — seed-addressed recipes.
- `src/fundamentals/terrain/terrain-system.js` — compilation into mutable signed-density terrain, excavation, raise/lower and local rebuild.
- `src/jit/hermeticon-wanderer/HERMETICON.md` and `SEMANTIC_SURFACE.md` — Wanderer interaction, aperture, geological persistence and accepted V31 boundary.

These are **reference implementations**, not evidence that a hand-drawn-map importer or provenance-preserving geological compiler already exists.

## First deliverable and success criterion

A deterministic, inspectable **2D field atlas for this specific drawing**: individually viewable layers, an image-overlay composite, aligned landmark/region labels, explicit unknowns, and a machine-readable field/feature manifest. No 3D scene is needed for the first acceptance test.

Success means we can compare the fields with the original and say **where the world is, what terrain and material may originate there, which features belong there, and which details were invented by generation**—before committing those decisions to an executable landscape.
