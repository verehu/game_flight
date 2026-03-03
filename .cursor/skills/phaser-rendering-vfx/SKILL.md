---
name: phaser-rendering-vfx
description: Improves Phaser 3 visual quality for sprites, procedural textures, particles, shaders, and UI readability while preserving style coherence. Use when the user asks for better graphics, rendering quality, visual polish, VFX, or style unification.
---

# Phaser Rendering and VFX

## Goal

Upgrade visual quality without breaking gameplay readability or art direction.

## Workflow

1. Lock a visual direction first (palette, contrast, silhouette priorities).
2. Improve assets in this order:
   - Primary gameplay actors (player, enemy, bullets)
   - Background readability layers
   - Impact effects (explosion, hit flash, trails)
   - HUD clarity
3. Keep color hierarchy stable:
   - Friendlies: cool/cyan family
   - Enemies: warm/red-orange family
   - Boss threats: purple/red warning family
4. Prefer lightweight procedural graphics (`Graphics`, particles, tint) before adding heavy assets.
5. Validate on moving gameplay, not static frames only.

## Phaser 3 Techniques

- Use `setDepth` and consistent layer bands (bg < actors < bullets < HUD).
- Use additive blend for engine trails and sparks only (`ADD`), not for all effects.
- Use short-lived particles with tuned lifespans instead of high quantity spam.
- Use camera feedback (`shake`, `flash`) sparingly for meaningful events.
- Keep bullet shapes simple and high-contrast for dodge readability.

## Guardrails

- Do not reduce gameplay clarity for visual realism.
- Avoid mixing incompatible palettes in one scene.
- Avoid per-frame allocations in hot paths when possible.
- Keep procedural texture APIs compatible with Phaser 3 stable methods.

## Done Criteria

- Enemies and boss have clear flight silhouettes.
- Hit/explosion effects are readable at full combat density.
- HUD remains legible over all background regions.
- Build succeeds and no lints are introduced.
