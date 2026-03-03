# Enemy Playtest Checklist

## Functional Regression

- [ ] Boot flow reaches gameplay scene without asset load errors.
- [ ] Wave timer, wave transitions, and boss transitions still trigger in order.
- [ ] New enemy types spawn according to wave weights (A/B/C).
- [ ] New shooter types (`sniper`, `guard`, `ufoElite`) fire and bullets collide correctly.
- [ ] Pickup drops still work and forced-drop rules apply (`tank`, `guard`, `ufoElite`).
- [ ] HUD values (score, lives, stage, boss hp, shield) stay synchronized.

## Combat Readability

- [ ] Each new enemy can be identified by silhouette + movement pattern during heavy combat.
- [ ] `charger` telegraph is visible and gives enough dodge time.
- [ ] `sniper` aimed shots are distinguishable from basic enemy bullets.
- [ ] `ufoElite` burst pattern is readable and not visually noisy.

## Balance and Fairness

- [ ] Sector A feels introductory; deaths should mostly come from player mistakes.
- [ ] Sector B introduces mixed pressure without sudden unfair spikes.
- [ ] Sector C is intense but still dodgeable with clear threat signaling.
- [ ] First-clear rate remains reasonable with default upgrades.

## Performance

- [ ] No noticeable frame drops during peak spawn + burst fire moments.
- [ ] Particle and trail effects remain stable after multiple waves and boss phases.

