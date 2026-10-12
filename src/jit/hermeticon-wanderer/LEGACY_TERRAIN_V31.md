# Wanderer V31 terrain — preserved baseline (inactive reference)

This is a **containment record**, not a runtime terrain initializer and not a canonical world-generation procedure. No new authored atlas should overwrite the V31 terrain algorithm or its seed.

- Accepted executable source: `src/jit/hermeticon-wanderer/index.html`
- Preserved source blob SHA: `1402eb800ea4c305e33bcf25c99f5000ae2eb5e1`
- Accepted build identifier: `hermeticon-wanderer-cloud-aperture-v31`
- Original terrain: resident geological signed-density field, seed 741; 85 × 21 × 85 samples; 14 through-holes and 28 raise/lower operations, generated once by `regenerate()` and GPU-clipped to the moving aperture.
- Existing source calls `regenerate()` during initialization. **It is still active in V31.** This note does not claim non-instantiation is implemented.
- Accepted geological coordinates and world-space BB persistence must not be re-owned by the Hermeticon aperture. Keep the weather window, lower bowl, camera and navigation behavior intact.

## Future non-instantiation boundary

When wiring the first authored layer cake, extract or wrap the legacy generator as an explicitly selected terrain provider. The authored provider must be able to initialize world geology without calling the legacy `regenerate()` function or generating its 42 legacy operations. Keep the legacy provider retrievable and selectable for regression, with **no automatic blending, overlay, or background instantiation**. Do not switch the live V31 default or deploy without an authorized, verified experiment. Expose provider ID, seed, field dimensions, build count, and whether the inactive provider instantiated anything in INSPECT.

The original implementation remains recoverable from the immutable Git blob above and its containing repository history. Before changing the executable, record its actual commit SHA and verify source/public mirror identity.
