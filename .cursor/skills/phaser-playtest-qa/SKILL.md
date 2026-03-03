---
name: phaser-playtest-qa
description: Performs Phaser 3 regression checks for boot flow, gameplay loop, collisions, bosses, HUD sync, and performance-safe changes. Use when validating gameplay updates, bug fixes, balancing changes, or release readiness.
---

# Phaser Playtest QA

## Goal

Catch gameplay regressions quickly after code changes.

## Smoke Checklist

- App boots without console errors.
- Player can move/fire and bullets clean up offscreen.
- Enemy spawns, fires, and collisions apply expected damage.
- Pickup effects apply and update HUD values.
- Boss warning and boss phases trigger correctly.
- Game over and restart loop works.
- Victory flow and restart loop works.

## Performance Checklist

- No runaway particle or tween accumulation.
- No unbounded timers/events after scene restart.
- No input listener leaks across restarts.

## Test Strategy

1. Run a local build to catch compile-time issues.
2. Run in browser and validate high-risk transitions:
   - wave -> shop -> boss
   - boss defeat -> next phase
   - player death -> restart
3. Verify visual and audio cues under pressure moments.

## Reporting Format

- Critical issue: breaks progression or controls.
- Major issue: strong gameplay/readability degradation.
- Minor issue: polish or consistency gap.

## Done Criteria

- No critical regressions.
- Progression loop is complete and repeatable.
- HUD, audio, and gameplay state remain synchronized.
