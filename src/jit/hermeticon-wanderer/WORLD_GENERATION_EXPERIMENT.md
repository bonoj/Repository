# World Generation Experiment

## Source map labels

### The Summerlands
Yellow-washed area across the upper middle of the drawing, behind and around Upton and the approach to Redwall. **Region only**, not the whole mapped world. Yellow indicates a distinct surface treatment; its material composition is unknown.

### The Winter King's Realm
Cold blue northwestern area marked by a snowflake and a cluster of sharp blue mountain peaks. Its exact boundary is not drawn. Snow/ice and steep relief are visually supported; underground ice or rock types are not.

### To Ice Vale
North-pointing arrow beneath the blue northern peaks. **Off-map directional destination**, not a mapped region or confirmed local basin. Keep it as a navigation connection.

### The Gradient
**Author clarification:** an attenuated border between the Summerlands and the Winter King's Realm, probably a *Terminator*-like liminal band. Treat it as a finite-width transitional field, not a hard boundary or merely a directional arrow. The precise gradient variables and physical or magical mechanism remain open; do not force an elevation change.

### The Amaranthine Fields
Broad yellow and pale-purple patch in the left-middle of the map, textured with many short strokes and enclosed by a loose irregular border. Open-field cover is suggested, but exact plants, soil and material are unspecified.

### The Quills
Narrow irregular strip of repeated tall purple spike/needle marks between the Amaranthine Fields and the central grey territory. **Author clarification:** vegetation, probably thick keratinizations. Model this as a dense, tall, keratinized plant/organic growth field rather than stone spires. The exact biology, rigidity, and subsurface roots remain experimental.

### The Heart of Darkness
Dark central grey-purple territory west of the Whisperwood, containing a prominent red/pink outlined central feature labeled Heart of Darkness and nearby smaller red/pink shapes. Keep the named heart as a landmark inside the broader dark zone; do not assume the pink shapes are lakes without confirmation.

### The Bood Lakes
Several small, separated pink/red enclosed shapes running through the central dark region below the Heart of Darkness. **Author confirmation:** these are bodies of liquid. Represent separate lake basins with liquid occupancy; composition, depth, connections and flow remain unspecified. Preserve spelling **Bood**.

### Jade Peak
Tall green-tipped pointed mountain/rock formation rising from the pale blue Mists cluster in the southwest-middle. Distinct isolated high-relief landmark; green is a visual clue, **not proof of jade mineral deposits**.

### The Mists
Group of isolated jagged green-and-blue peaks or islets in pale blue cloud/mist bands left of Silverpass. Several separated silhouettes with low blue horizontal wisps. Ambiguous whether water, fog or lowland surrounds them; don't assign sea level yet.

### Downton
Large blue outlined structure at lower left, with branching dark internal lines and three tall vertical chimney/tower forms; yellow openings near its base. **Author clarification:** cavernous, potentially hanging below. Model a substantial internal void/cavern system and explore suspended or downward-hanging architecture; do **not** treat it as a confirmed floating island. Its precise supports and depth are undecided.

### Silverpass and the Gemgates
Steep pale grey mountain chain at lower center-left, with several small rectangular blue/yellow/green colored gate-like openings embedded on its slope. Pass through rugged relief and built landmark openings; colors do not establish mineral composition.

### Cinderglade and the Fell Crater
Lower center-right green coniferous forest surrounding a dark charcoal crater or volcano with bright red/orange/yellow interior and rim, plus a nearby smaller fiery patch. Forest and exposed volcanic/combustion-like feature are directly depicted; lava, ash and thermal materials are **candidate generated interpretations**, not measured geology.

### The Whisperwood
Twisting, leafless dark branching tree silhouettes in the middle-right transition between the central dark area and green Brambles, under/near the Rift. Sparse gnarled woodland distinct from the dense green Brambles.

### The Brambles
Large dense green vegetation belt across the middle-right, below the Rift and above Cinderglade, with tangled bush/tree marks and irregular outline. Supports dense vegetation jurisdiction; species, soil and belowground structure unknown.

### The Rift
Grey-blue rugged enclosed zone just below Redwall, near the coast, with broken/angular interior marks and colored green/red spots. A distinct fractured/rocky region is shown; do not yet assume a deep subterranean fissure or exact vertical profile.

### The Spill
Blue outlined water-like outflow or inlet immediately east of the Rift, adjacent to the Ocean of Tears. Visible coastal water geometry with curved lobes; source, direction of flow and connection to subsurface water are not proven.

### Redwall
Long segmented magenta/red fortification crossing the upper central edge of the Rift and separating it from Upton/Summerlands. A built linear boundary with bends and repeated wall segments; should be a feature footprint, not a biome or ridge.

### Upton
Compact red/pink built settlement within a pale blue rounded enclosure at upper center, north of Redwall. Multiple towers/buildings and a central tall structure; precise building counts and enclosure meaning remain open.

### Kindle Tower
Tall grey tower with red/orange flame at its top, on a small yellow island in the upper-right blue water. Discrete built landmark; the nearby red label 'The Isle of Fire' names the island but is **not one of the 22 confirmed atlas titles**.

### The Violet Coast
Blue coastal edge along the right/lower-right of the landmass, beside the Brambles and the Cinderglade approach, bordering the Ocean of Tears. Jagged shoreline and violet/blue shading; not evidence of a specific sediment or mineral.

### The Ocean of Tears
Expansive pale blue water filling the right side of the map, with blue wave strokes and a coastline running diagonally down toward the Violet Coast. Open-water domain; depth, salinity, currents and seafloor composition unknown.

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

## Connection to Hermeticon Wanderer — incremental realization

**The map authors the persistent world; Wanderer is the moving local aperture into it.** The atlas does not author the Hermeticon vessel, camera, gesture controls, or bowl physics. It describes geography and material conditions in geological world coordinates. The Hermeticon samples, reveals, and eventually instantiates local detail as it travels. Material and weather outside the aperture must not be deleted, relocated, or re-owned by the sphere.

The existing atlas fields have different destinations:

| Atlas fields | Persistent world responsibility | Hermeticon-local expression |
| --- | --- | --- |
| Elevation, strata, substrate | World-space geological surface and underlying material | Terrain visible within the moving aperture; local terrain interactions |
| Material provenance | Source deposits, material identity, composition, lineage and conserved accounting | Local BBs and excavated/transported matter retain their origins, even across region and representation boundaries |
| Region/biome, surface cover, population | Geographic jurisdiction, ecological conditions and population distributions | Nearby terrain treatment and eventually instantiated vegetation, structures or inhabitants |
| Hydrology | Drainage, water bodies, moisture, climate and water inventory | Visible local water and weather; cloud/rain only where world conditions and aperture overlap justify it |
| Features/landmarks | Persistent positions, names and semantic associations | Discoverable places, navigation targets and possible thoughtforms |
| Confidence/authorship | Source-versus-generated evidence attached to world data | Inspectable explanations of why a feature or material exists |

**Do not confuse authoring fields with runtime layers or physical shells.** A 2D atlas may initialize a volumetric signed-density world: height is one boundary, while strata, deposits and later voids or intrusions can extend below or above it. These maps are *initial conditions*, not perpetual rules that erase later excavation, erosion, transport, deposition or fabrication.

### Build only what the next experiment needs

1. **Atlas first — no 3D required.** Align the hand drawing; trace the known geography; generate and inspect the independent 2D fields and provenance/strata metadata. Validate the composite against the original drawing.
2. **Geology in a separate test.** Compile elevation plus a minimal material/strata assignment into persistent world-space terrain. Verify shape, deterministic regeneration, and provenance queries. This does not require vegetation, weather, inhabitants or every landmark.
3. **Wanderer aperture integration, when authorized.** Let an isolated Wanderer experiment traverse the new world and reveal its existing terrain. Preserve accepted V31 navigation, camera ownership, geological persistence, cloud clipping and lower-bowl behavior; do not overwrite V31 merely to test the atlas.
4. **Material consequence.** Add local material interactions one at a time: extraction, BB transport, deposition and origin-preserving accounting. Confirm that leaving the aperture does not erase matter and that moving between representation scales does not silently change provenance. Aggregate/distant representations are future design, not current V31 capability.
5. **Other world systems on demand.** Bring in water, weather, populations, landmarks, semantic thoughtforms and richer underground geology independently, only when the preceding seam is demonstrably useful. No requirement to populate the whole map or simulate everything everywhere.

At each stage, the *world* retains the authoritative state. The Hermeticon spends computation locally; it is not the owner of the geography it happens to display. Features outside the aperture may exist as lightweight world data until encountered. The intended long-term boundary is world-scale aggregate persistence with local high-resolution manifestation, **not a claim that Wanderer already implements general resolution transitions**.

**Next actionable milestone remains the 2D atlas.** The hand-drawn source image must be made available as an actual asset before pixel-accurate tracing; this Markdown document currently records labels and the plan, not the image bytes.

## First deliverable and success criterion

A deterministic, inspectable **2D field atlas for this specific drawing**: individually viewable layers, an image-overlay composite, aligned landmark/region labels, explicit unknowns, and a machine-readable field/feature manifest. No 3D scene is needed for the first acceptance test.

Success means we can compare the fields with the original and say **where the world is, what terrain and material may originate there, which features belong there, and which details were invented by generation**—before committing those decisions to an executable landscape.

---

## Current state — 2026-10-12 (Hermeticon Wanderer V39)

**Executable:** `src/jit/hermeticon-wanderer/index.html`, authored provider `?terrain=authored-v1`. Reported runtime build: `hermeticon-wanderer-geological-source-v39`. The report below is a user-supplied runtime INSPECT snapshot, not an independent source, deployment or browser verification. `legacy-v31` and `empty` remain separate terrain providers; do not change accepted V31 behavior to advance the authored experiment.

### Established progression

- **V32–V36 — geographic substrate.** A sparse provisional 22-node atlas compiles into the same persistent 3D signed-density geology and tetrahedral extractor used by Wanderer. Nine map lenses inspect the aligned fields. Curved Summerlands/Gradient/Winter King's Realm boundaries replaced square partitions. The user confirmed the geography and strata read coherently. The nodes and boundaries are generated approximations, **not** traced positions from the hand drawing.
- **V37 — material columns.** Generated surface/subsoil/bedrock identities distinguish actual material lookup from map-lens colors; exposed cuts reveal layered geology. These assignments are provisional and do not establish real-world ore composition or full provenance.
- **V38 — bounded material circuit.** Excavation, source/transit/receiver accounting and discrete transported units became a testable circuit. Material identity is carried rather than inferred from its destination's color.
- **V39 — geology as source.** Excavation now removes positive samples from the authoritative signed field and supplies the material circuit. The user-provided runtime report records 49,584 initial solid samples, 49,488 after excavation, 96 removed samples, 96 emitted and 96 delivered to the receiver; source and transit are zero. `terrainDeltaSamples=96`, `geologyBalanced=true`, `balanced=true`. The terrain mesh changed from 119,612 to 120,072 triangles after excavation. The reported run is ~58.14 FPS on a 384 × 694 mobile viewport. This is **sample-count conservation**, not proof of continuous-volume conservation or volume-equivalent mesh change.
- **Visual inspection of V39.** The user supplied a screenshot showing readable horizontal strata and excavated faces. The transfer apparatus is visually distinct from geology; the visible material volume and the source/receiver relationship are not yet spatially self-evident. Do not equate a passing ledger with a visually convincing excavation or deposition.
- **Existing Wanderer systems preserved in the V39 report.** The moving GPU aperture, resident world geology, weather and 10,000 rain BBs remain operational. Weather and rain conservation pass; no containment or simulation invariant failures were reported. This does not prove material ownership for rain: the report lists all 10,000 as unowned.

### Known instrumentation issue

The V39 INSPECT snapshot reports `GPU_APERTURE_WITNESS_FAIL`, while the independent scene projection witness passes and the sampled radial edge transitions from visible at radius 9.71 to discarded at 9.73 around the intended 9.72 aperture. The radial witness marks radius 0 as the first discarded sample because that pixel is black; its monotonicity assumption is therefore unsound for a scene with empty or unlit center pixels. **Repair the witness's visibility criterion; do not alter a working aperture shader merely to satisfy a defective test.** The exact failure mechanism still needs code inspection and verification.

### Immediate next experiment — V40: deposition and recovery

**Close the loop inside the same authoritative geology.**

1. Excavate a bounded sample set at geological location A, preserving material identity and source lineage.
2. Move those units through the existing source → transit → receiver circuit.
3. Deposit the delivered units at location B as **persistent solid samples in the existing signed field**, not decorative particles or a second terrain system.
4. Re-excavate that deposited matter. Confirm that it yields the material that arrived, rather than freshly generated native geology.
5. Verify the round-trip ledger: material counts and identities across geology A, circuit, geology B and the return circuit; no silent creation, loss or conversion. Inspect terrain geometry before/after each mutation and confirm edits survive moving the Hermeticon aperture away and back.

**Keep V40 bounded.** Reuse the existing signed-field mutation, material identities, circuit and extraction. Do not build a new particle solver, ore-node entity framework, fabricator, hydrology engine, or elaborate mining machinery. Fix the aperture witness independently. Continue to label the accounting unit **discrete signed-field samples**, not physical cubic meters; continuous volume reconciliation is subsequent work.

### Direction after V40

- **Material volume and shape.** Establish a consistent physical measure relating field samples, cell dimensions, transported quantity and resulting terrain volume. Test excavation/deposition against that measure; avoid promising visual conservation based solely on sample counts.
- **Geologically situated deposits.** Put veins or other material domains *inside* the common geological field, with explicit generated origin and lineage. Mining should expose and follow deposits through the terrain rather than destroy isolated resource props. The original drawing does **not** certify any specific ore deposit.
- **Localized hydrology.** Water occupies actual basins and excavated/deposited terrain, responds to changed boundaries, and preserves its own material accounting. Use existing water and bead work as references; do not claim water is already physically coupled to authored geology.
- **A consequential miniature node.** Concentrate detail in one place that inherits local substrate, water and climate/biome jurisdiction. Later move the same node to another jurisdiction and test adaptation without bespoke scene rewrites.

The design target is **Astroneer-like sculptability with consequences carried by a shared world**, including the material/resource stakes of Valheim-style excavation, without requiring either game's machinery or nuisance combat. A trench redirecting water, a deposit exposing new material, or a berm changing access should arise from shared state, not hand-authored reactions.

### Boundaries still open

The hand-drawn source image has not been registered as a reproducible pixel-to-world asset here; source labels and author clarifications above remain authoritative. The current 22 nodes, relief, biome fronts and material assignments are provisional. The atlas's visual `PROVENANCE`, `HYDROLOGY` and `POPULATION` lenses do not by themselves implement complete lineage, physical water or inhabitants. Source geography and generated interpretations must remain distinguishable.

**Continuity rule:** The world owns its geology and material history; the Hermeticon is a mobile local witness, not a container for all world matter. Preserve accepted navigation, aperture, weather, sparse corridors and one-button atlas inspection while increasing physical consequence. Do not confuse source commit, published mirror, Pages deployment and actual live browser evidence.


### 2026-10-12 — V42 deposition implementation (runtime verification pending)

V41 verified extraction of 96 positive signed-field samples: 29 basin sediment, 52 weathered subsoil, 15 deep bedrock; nominal sample-cell volume 12.4416 world units³, **not** measured mesh volume. V42 wires each sample's material ID and origin lineage onto its transport unit. Delivery now claims eligible void samples near destination B, writes positive signed-field values plus sparse material overrides, and batches terrain remeshing per simulation step. INSPECT reports deposition count, per-material counts, field-solid accounting, and individual deposition records. No new transport engine or standalone deposition geometry. Receiver visuals remain temporary circuit apparatus; deposited geology is the authoritative state.

**Unproven:** runtime delivery of all 96, stable visible mound, accurate mesh volume, persistence across regeneration, and destructive re-excavation/recovery of material overrides. Inspect the runtime before calling the geological round trip complete. Existing GPU aperture center-black witness false failure remains unresolved. Next: run V42 and compare INSPECT with screenshot; verify material identity at deposited locations and re-excavate deposited field samples without inventing another engine.


## V44 — bounded surface extraction (2026-10-12)

V43 was verified live with 96 excavated and 96 deposited signed-field samples and conserved BB material bags. Its deposition performance seam was a global 84×20×84 tetrahedral remesh after each dirty simulation step. V44 adopts the existing fundamentals/terrain dirty-region pattern: a single authoritative 85×21×85 signed field, horizontal 10-cell extraction regions spanning the full vertical field, and a one-cell dependency halo. Excavation passes its sample bounds; BB deposits merge bounds per simulation step. Unchanged geometry buffers are retained. Map lenses color the region geometries, and the 32×32 scene witness renders the same shared region geometries. INSPECT reports mesh.locality (totalChunks, fullRebuilds, localRebuilds, lastDirtyChunks, lastRebuiltCells, lastRebuildMs). Material accounting is unchanged. Runtime FPS, visual seams, and public delivery still require live verification; no performance victory claimed from static code inspection alone.


## V45–V47 — inspection recovery and bounded logging (2026-10-12)

V44 localized terrain extraction, but its older INSPECT path remained heavyweight: GPU aperture and scene witnesses, scene traversal, verification scans, and large synchronous report construction. Player reported INSPECT crashing and clipboard copy failures. V45 restored the V43 legacy clipboard fallback but the player still observed `COPIED` without usable Android clipboard text; that indicator was not sufficient proof of end-to-end copy.

V46 removed the heavyweight INSPECT execution path and periodic verifier scans from the active inspection cycle. It introduced bounded telemetry (48-event ring, last 24 events in snapshot), transfer milestones, current BB state counts, terrain rebuild counters, and recent runtime errors. JSON export was introduced but was the wrong user workflow. V47 replaced JSON export with **COPY REPORT**, direct clipboard write from tap with legacy fallback. The player pasted a valid V47 report into ChatGPT: at 6,642 ms, 56.7 FPS, 81 terrain chunks, 1 full and 19 local rebuilds, 1 dirty chunk on last rebuild (6.6 ms), BB state 66 source / 12 transit / 18 receiver, zero reported errors. This is **mid-transfer**; do not claim completion or conservation solely from this snapshot.

Source V47 commit `0c5302d1fc3b5d729d872010ede092b403adeab2`; JIT mirror commit `a70192c199cb7b66b6ce4e3912a54d2870b90a10`. Next: capture after 96 receiver units, then test geological re-excavation. Preserve V47 working copy/report behavior and local meshing. The older V44 section's statement that public delivery and runtime performance remain wholly unverified is historical, not current status.
