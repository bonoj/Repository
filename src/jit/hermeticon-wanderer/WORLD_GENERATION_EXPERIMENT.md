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

## Progress checkpoint — 2026-10-12 (Hermeticon Wanderer V36)

**Working experiment:** `src/jit/hermeticon-wanderer/index.html?terrain=authored-v1` (source file is the same for all terrain providers). Published test: https://bonoj.github.io/jit/hermeticon-wanderer/?terrain=authored-v1 . Build label `hermeticon-wanderer-curved-biomes-v36`. Preserve the accepted V31 provider (`legacy-v31`) and explicit `empty` provider.

### What has actually been demonstrated

- **New world = flat geology.** The authored provider uses the *same* signed-density field and tetrahedral surface extractor as V31. Its geological operations, not its terrain machinery, determine the shape. No duplicate triangulator or per-frame geological rebuild.
- **Sparse atlas geology (V32).** A deliberately provisional arrangement of 22 named nodes adds localized raises, depressions and three through-holes to the slab, leaving broad flat navigable corridors. These are experimental node placements, **not pixel-accurate traced positions** or verified map topology. Original names/interpretations above remain the geographic evidence.
- **One map button (V33/V34).** Default **COMPOSITE** cycles through **ELEVATION, SUBSTRATE, BIOME, HYDROLOGY, PROVENANCE, STRATA, POPULATION, FEATURES** and back. It recolors the existing mesh; no additional map geometry or runtime render pipeline. V34 corrected a parse error introduced when map-lens declarations interrupted an `if/else` pair.
- **Aligned runtime fields (V35).** Eight actual 85 × 85 arrays (plus jurisdiction and gradient weight) are compiled once from the provisional nodes and broad region rules. The button samples these fields rather than recomputing independent display heuristics. Fields are currently *simplified visualization and jurisdiction values*: provenance is **not** yet material lineage, hydrology is **not** conserved water, population is **not** instantiated inhabitants, and features are **not** detailed geometry. Elevation map is a simplified upper-surface estimate, not a full volumetric material model.
- **Curved biomes (V36).** Deterministic, smooth geographic boundary functions replace the conspicuous square north/biome division. A finite-width Gradient lies between Summerlands and Winter King's Realm. These curves are **generated placeholders**, not traced boundaries from the original drawing. No noise-heavy terrain was added.
- **Visual acceptance.** User reports that the sparse relief feels about right, all maps are legible, and V36 feels coherent. The V35 biome square was the sole concern; V36 addressed it. In particular, the **provenance, population and features** views read as sane. This is visual feedback, not a claim of physical or semantic validation.

### World-design constraint learned

**Sparse by design; complexity clusters, navigation flows.** Think of the *Game of Thrones* opening map: recognizable miniature geographic nodes on one continuous sculptural substrate, not a vast walkable simulation of full-size settlements. Aim for a few interesting nodes per viewport, broad quiet intervals and unobstructed paths. Visual richness can concentrate within a node without giving every tree, railing or lamp post collision authority. Empty space makes finding John's Ledger, LinkedIn or a project easy while visiting remains a deliberate choice. Avoid global procedural clutter and noise merely to make the world look populated.

### Next sequence — maps become consequential

1. **Material-aware terrain (next).** Give substrate and strata meaningful, inspectable material identities and vertical exposure rules. Use the *existing* mesh/field and its atlas sampling; no duplicate geometry or geology engine. Differentiate surface treatment from actual material provenance. Verify a top surface and a cut/underside can report their material identities, not merely colors.
2. **Localized physical hydrology.** Integrate the already explored water/material-bead machinery only where selected authored basins call for it. Preserve water inventory and distinguish wet-map hints from real fluid occupancy. Do not claim water is running until verified. No universal ocean simulation just because a field is blue.
3. **One living miniature node.** Choose a single recognizable location and build a small composable structure or environmental system with locally concentrated detail. It should inherit substrate, climate/biome and other relevant map fields, while leaving surrounding travel lanes clear.
4. **Move the node.** Reposition the *same* node into a different geographic jurisdiction and test whether its behavior and appearance adapt from field data without bespoke scene rewrites. This is the composability proof, not just a prettier scene.

**Hold constant while testing:** V31 navigation/camera ownership, aperture clipping, persistent world coordinates, BB/weather behavior, the original signed-volume extraction, sparse 22-node geography, flat corridors and the one-button map inspection loop. Keep build identity current on each executable change; verify source, publication and live delivery independently.

### Open work and honest boundaries

- The original hand-drawn image still needs reproducible registration and faithful tracing. Current node coordinates, relief stamps, biome front, material assignments and most inferred semantics are provisional. In particular, **To Ice Vale is an off-map connection**, and Redwall is a built wall, not a ridge; do not mistake provisional geology stamps for literal feature types.
- The eight visual layers do not yet implement full authorship/confidence metadata, conserved material lineage, water flow, underground strata physics or a general image-to-world importer. The earlier eight-field conceptual table includes confidence/authorship; the current runtime's eight displayed lenses are not an exact implementation of that full semantic specification.
- The previous sections document the original research plan and source interpretations; their statements that the *first* milestone is a 2D atlas are historical. **Current next milestone is material-aware terrain**, followed by hydrology, a living node and relocation testing.


## The snowglobe lessons — decisions to carry forward

*Curated from the Betwixt snowglobes, Crucible, Six Cities, Waterworld, Asteroid and Hermeticon experiments through Wanderer V36. This is a working brief for the next builder, not a chronology, bibliography or retrospective of commits. Direct quotations are the author's; the rest distills the decisions demonstrated across the work.*

### Build worlds that can answer back

The turning point in the Six Cities snowglobe was not another beautiful terrain treatment. A suspicious patch prompted the question **what is that?** Instead of making the human narrate a screenshot, we made the running world export its geology. One tap produced a situated survey that could support questions we had not yet thought to ask. The same affordance later carried hydrological evidence.

**Play forward:** a world should expose its state, causes, uncertainties and identity cheaply enough that a human and model can investigate it together. Instrument the question actually being asked. A screenshot, source code, a survey and a user's visual judgment are different kinds of evidence. Do not ask the human to become the world's telemetry transport or claim a committed build is the one they saw without verification.

### Make consequences, not merely effects

Six Cities turned streams, storage, capture and delivery into the beginnings of an infrastructure that could respond to its own material flows. Gas rose, lingered, condensed and fell back to earth. Crucible's terrain could be altered. Waterworld made a liquid surface an expression of conserved material rather than a painted plane. Asteroid could expose its constituents without treating the original rock as fictitious.

The recurring authorial decision was to push past an attractive animation and ask **what persists, what changes, where did the matter go, and what can act on it next?**

**Play forward:** terrain, weather, structures, populations and material transport should eventually drive one another. Preserve inventory and provenance across representation, phase and location. Do not confuse a map indicating water with water that actually flows, or a provenance color with provenance that survives transport.

### Spend complexity where it becomes meaningful

> “Flat is good because it means noise and clutter can be localized. Localized density is richness without reduction in navigability.”

> “Remember our purpose is to make a fairy sparse but easily navigable world with a few interesting nodes per viewport. Empty space means finding John's ledger or his linked in is both easy and a choice.”

This is more than a style preference. Sparse space protects orientation, choice and the possibility of encountering something special. A tiny settlement can be intricate; the route to it should not be a collision course through decorative clutter. The map's empty ground is *authored negative space*, not missing content.

**Play forward:** concentrate systemic and visual richness into a few legible nodes per viewport. Preserve broad, traversable quiet ground. Do not fill it with noise or furniture to prove that the world is populated.

### Let functions author places, then let history take over

The functional d20 and later terrain experiments established that very different local generators can coexist if their jurisdictions and boundaries are well behaved. The geology experiments also exposed a trap: endlessly polishing one convincing canyon or mesa can improve quality while barely expanding the world's expressive range.

> “Right now we're just testing continuous cool ass maps.”

The maps are cheap, independently inspectable descriptions of *where things may happen*. They should not perpetually overwrite the results of what has happened. Once terrain is excavated, flooded, settled, built on or otherwise changed, that consequence belongs to the persistent world.

**Play forward:** prefer heterogeneous functions over a single universal noise recipe; independent fields over tangled controls; reusable capability over polishing one specimen. Compile initial conditions into ordinary mutable matter. Preserve history.

### Keep the instrument smaller than the world

The original snowglobe gave a simulation a beautiful boundary, but Hermeticon exposed the conceptual mistake of treating that boundary as the extent of reality. A moving sphere can reveal geology, manifest local weather and physically contact material without owning everything it reveals. A cloud stays behind when we walk away. A bearing outside the aperture has not ceased to exist. A failed containment witness may be applying the wrong definition of inside.

> “Think of locations more like game of thrones intro map.”

**Play forward:** one continuous, addressable world; a small, navigable aperture; recognizable miniature destinations. Spend detailed computation near consequence and observation without erasing distant matter or history. A Hermeticon may be one composable object from outside and a complex world from within; recursive interaction is a direction, not an already solved mechanism.

### Simplicity is an enabling constraint

> “I want exactly the same machinery we have now, just no holes punched in it or mountains raised. I want the concept of "new world" to be explainable in 2 words. I want no performance hit. Clear?”

**New world = flat geology.** That decision made the next experiments possible without inventing another terrain engine. The same extractor could express a blank slab, sparse rises, depressions and through-holes. One button could reveal the maps without a new inspection console. In earlier experiments, a single familiar tap became a geological and then hydrological survey.

**Play forward:** reuse the solved substrate, interaction and delivery paths. Make the smallest change that exposes the next causal question. Generalize only when repeated executable pressure earns it. Avoid building infrastructure to protect an experiment from problems it has not encountered.

### The next question is whether a place can inherit its world

Wanderer V36 has coherent sparse geography and inspectable fields. That is an accepted visual foundation, **not** proof of material simulation. The next useful crossing is from *descriptive* maps to *governing* maps: substrate and strata determine what a cut reveals; a basin can host conserved water; a small living node can consume the conditions of its location.

Then move that same node elsewhere. If its material, weather, behavior and appearance change because the atlas changed beneath it—without a custom rewrite—we have earned a meaningful increment in composability.

**Keep asking:** Did this pass create a new reusable capability, a new observable consequence or a better question? Or did it merely polish the scenery?
