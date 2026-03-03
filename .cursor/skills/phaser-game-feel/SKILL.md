---
name: phaser-game-feel
description: Tunes Phaser 3 combat feel using timing, recoil, hit-stop, camera feedback, enemy cadence, and reward pacing. Use when the user asks for better feel, juicier combat, smoother controls, stronger impact, or arcade-style responsiveness.
---

# Phaser Game Feel

## Goal

Make combat feel responsive, punchy, and fair.

## Tuning Order

1. Input and movement responsiveness.
2. Fire rhythm and projectile speed.
3. Enemy spawn cadence and pressure curve.
4. Impact feedback (hit-stop, shake, flash, sound).
5. Recovery windows and fairness (invulnerability, telegraphs).

## Baseline Ranges

- Player fire cadence: 120-180ms.
- Enemy bullet speed: 240-360 (normal), higher for boss phases.
- Hit-stop:
  - minor hit: 12-30ms
  - heavy hit: 40-80ms
  - boss break: 70-120ms
- Camera shake:
  - minor: 0.001-0.0025
  - medium: 0.003-0.005
  - major: 0.006-0.01

## Implementation Notes

- Keep one source of truth for state flags (`isGameOver`, phase gates, shop lock).
- Gate expensive effects during pause/hit-stop windows.
- Use brief warning states before high-threat transitions.
- Keep collision and projectile cleanup deterministic.

## Guardrails

- Do not stack multiple strong camera effects in one frame repeatedly.
- Avoid permanent control lock; warnings should be short and intentional.
- Any difficulty increase should preserve readable telegraphs.

## Done Criteria

- Controls feel immediate.
- Every hit has recognizable feedback.
- Boss transitions feel dramatic but not unfair.
- Difficulty ramps smoothly across phases.
