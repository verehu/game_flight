# Art Style Guide

## Visual Direction

- Target: clean sci-fi arcade readability.
- Priority order: silhouette clarity > bullet readability > hit feedback > background detail.

## Color Hierarchy

- Friendly/player: cyan and cool blue family.
- Standard enemies: warm orange/red family.
- Elite and boss threat: magenta/purple warning family.

## Enemy Presentation Rules

- Keep enemy body tints in warm range; reserve purple tones for high-threat bullets and boss moments.
- Distinct enemy behavior should pair with distinct silhouette (`enemyBlack`, `enemyRed`, `ufo` variants).
- Keep collision shapes compact and centered (do not exceed visible hull shape).

## Effects and Layering

- Use additive blend only for flame and spark accents.
- Keep explosion particles short-lived and high-contrast.
- Avoid stacking camera shake and flash at high intensity repeatedly.

## UI Readability

- HUD text must remain high-contrast against the background overlay.
- Boss bar colors should stay in warning palette and be visually separated from normal HUD stats.
- Avoid background hues that compete with bullets and enemy telegraphs.

