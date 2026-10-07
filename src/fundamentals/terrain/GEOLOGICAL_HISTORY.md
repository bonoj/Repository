# Geological History Goodies

Small terrain operators earned by executable experiments. These are capabilities, not named finished terrains.

The first preserved set comes from Beyond T4 at Repository `55036d8f`: 289² topology, seed 741, observed at 60 fps on the target phone. That build remains the reference recipe/branch point.

## Earned laws

- Sharp cliffs are legitimate terrain. Scanner outliers are evidence to inspect, not errors to erase.
- Geological/material identity may remain categorical while morphology consumes continuous resistance across contacts.
- A local material property must not multiply an unrelated large-scale process. Drainage owns canyon-scale incision; stratigraphy gets bounded influence.
- Band-limiting belongs to representation and must not silently create a second, non-authoritative topology.
- Settled mobile matter such as dunes may be authoritative terrain while retaining material/provenance for later discrete realization.
- Prefer reusable operators over named terrain stamps.

## Preserved operators

`geological-history.js` currently holds the earned T4 ingredients: segment distance, stratigraphic state with blended contact resistance, bounded stratigraphic erosion, bedding relief, the 1-2-1 representation filter, and gypsum dune mantle/deposition.

Beyond may continue experimenting freely. Promote further goodies here only when the experiment teaches a reusable law or capability. Do not mutate this baseline merely to make the next Beyond pass look better.


## Frozen reconstruction point

Beyond T4 is preserved in three deliberately separate layers:

1. **Whole executable:** branch `terrain/beyond-t4-baseline` points exactly at Repository `55036d8fec8fc2a2ea6b2880aefc9e1c0fbfec62`. This is the escape hatch: the complete known-good world, scanner integration, composition, and presentation remain recoverable even if later experiments paint themselves into a corner.
2. **Recipe:** `recipes/beyond-t4.js` records the T4 composition and parameters independently of the reusable operators.
3. **Seed:** `seeds/beyond-t4.js` contains only instance identity, seed `741`.

Therefore reconstruction has an explicit hierarchy: **goodies + recipe + seed → instance**, while the frozen branch preserves the whole observed executable as ground truth. Later experiments must not move the frozen branch.
