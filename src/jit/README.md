# JIT — build and publish

This directory is the **source** for small, standalone JIT sites. Each site lives at `src/jit/<slug>/index.html` in `bonoj/Repository`.

## Canonical publication route

1. Read an existing neighboring JIT source to preserve the single-file, phone-first pattern.
2. Create or edit `bonoj/Repository/src/jit/<slug>/index.html`. Commit it.
3. Read the committed source back from Repository. Publish its **exact contents** to `bonoj/bonoj.github.io/jit/<slug>/index.html` on the site's **master** branch (create if absent, update with current blob SHA if present). Commit it.
4. Read the published file back and compare its contents with Repository source. Verify the Pages deployment status and, where tools permit, the actual public response.
5. Give john **one canonical URL**: `https://bonoj.github.io/jit/<slug>/`. Report the publication commit and distinguish committed, Pages-deployed, and publicly verified states. Never claim live based solely on a successful commit.

The public Pages repo is `bonoj/bonoj.github.io` — **not** `bonoj/jit` (which is not the JIT publishing repo). Existing examples: `spellbook`, `genesis`, `false-gods`, `chem001`, `crossing`, `fieldwork`.

**No Betwixt sling for ordinary JIT pages.** `bonoj/Gate` governs the Betwixt Repository → Home → Interstice publication route; don't apply that route to a standalone JIT page. If touching Betwixt deployment, read Gate first.

## Guardrails

- Don't stop after committing source; publish the public copy in the same task unless told to hold.
- Keep private Home material and secrets out of public JIT source.
- Do not invent a separate build system or deploy route for a static one-file page.
- If public verification isn't possible, say so precisely; don't make john diagnose routine publishing mechanics.
- This README is procedural, not a replacement for inspecting the current repositories if their topology changes.
