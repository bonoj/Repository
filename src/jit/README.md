# JIT — cold-start entry point / build and publish

This directory is the **source** for small, standalone JIT sites. Each site lives at `src/jit/<slug>/index.html` in `bonoj/Repository`.

## Cold-start discovery

For a **new JIT bauble**, start here, then read [`bonoj/Gate/README.md`](https://github.com/bonoj/Gate/blob/main/README.md) **before any build, commit, sling or deployment**. Gate is the delivery authority for JIT as well as Betwixt; this JIT README supplies the route-specific map. Inspect a neighboring JIT source for the established standalone, mobile-first pattern. Choose a new unused slug under `src/jit/<slug>/`; do not overwrite Waterworld or other existing experiments. Do not assume the current chat contains the publishing steps.

For **existing Waterworld**, distinguish the [current working specification](WATERWORLD.md) (ambitious future 3D-water goals, not an implementation authorization) from the [v25 executable handoff](waterworld/WATERWORLD.md) (what the present 2.5D hybrid actually does). The [Ledger technical account](https://github.com/bonoj/Ledger/blob/main/notes/2026-10-10-waterworld-conserved-liquid.md) is historical evidence, not deployment authority.

## Canonical publication route

1. Read an existing neighboring JIT source to preserve the single-file, phone-first pattern.
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
