---
name: phaser-audio-design
description: Designs Phaser 3 audio layers for SFX, music, warnings, and dynamic mixing with strong gameplay readability. Use when the user asks for better music, richer SFX, warning cues, arcade audio style, or audio mix balancing.
---

# Phaser Audio Design

## Goal

Use audio to improve clarity and impact, not just decoration.

## Audio Layers

1. Core actions: shoot, hit, pickup.
2. Combat impact: explosion tiers (normal vs boss).
3. State cues: warning alarms, low health, phase transitions.
4. Music bed: looped rhythm that does not mask SFX.

## Mixing Rules

- Prioritize gameplay cues over music.
- Keep master headroom to avoid clipping during stacked explosions.
- Use distinct frequency ranges:
  - shots: upper-mid
  - impacts: low-mid
  - warnings: high-mid with short bursts
- Respect mute toggles instantly and safely.

## Synth/WebAudio Tips

- Keep envelope times short for action SFX.
- Add slight pitch/random variation to repeated effects.
- Use per-event gain limits so burst fire does not overload output.
- Stop timers/intervals on scene shutdown.

## Guardrails

- Never require audio unlock for gameplay logic.
- Avoid long alarm loops that fatigue players.
- Ensure all created nodes are cleaned up.

## Done Criteria

- Actions are audible under heavy combat.
- Boss/warning cues are immediately recognizable.
- No stuck audio after scene restart/shutdown.
