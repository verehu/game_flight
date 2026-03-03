import Phaser from 'phaser'

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setCollideWorldBounds(true)
    this.speed = 360
    this.fireRate = 140
    this.lastFiredAt = 0
    this.isAlive = true
    this.fireLevel = 1
    this.shieldUntil = 0
  }

  update(cursors, wasd) {
    if (!this.isAlive) {
      this.setVelocity(0, 0)
      return
    }

    let dx = 0
    let dy = 0

    if (cursors.left.isDown || wasd.left.isDown) dx -= 1
    if (cursors.right.isDown || wasd.right.isDown) dx += 1
    if (cursors.up.isDown || wasd.up.isDown) dy -= 1
    if (cursors.down.isDown || wasd.down.isDown) dy += 1

    if (dx !== 0 || dy !== 0) {
      const vec = new Phaser.Math.Vector2(dx, dy).normalize().scale(this.speed)
      this.setVelocity(vec.x, vec.y)
    } else {
      this.setVelocity(0, 0)
    }
  }

  tryFire(time, bulletGroup) {
    if (!this.isAlive || time - this.lastFiredAt < this.fireRate) return false

    const patterns = {
      1: [{ x: 0, vx: 0 }],
      2: [
        { x: -12, vx: -30 },
        { x: 12, vx: 30 }
      ],
      3: [
        { x: 0, vx: 0 },
        { x: -16, vx: -65 },
        { x: 16, vx: 65 }
      ]
    }

    const shots = patterns[this.fireLevel] || patterns[3]
    let firedCount = 0
    shots.forEach((shot) => {
      const spawned = this.spawnBullet(bulletGroup, shot.x, shot.vx)
      if (spawned) firedCount += 1
    })

    this.lastFiredAt = time
    return firedCount > 0
  }

  spawnBullet(bulletGroup, offsetX, velocityX) {
    const bullet = bulletGroup.get(this.x + offsetX, this.y - 36, 'bullet')
    if (!bullet) return false

    bullet.setActive(true)
    bullet.setVisible(true)
    bullet.body.enable = true
    bullet.body.setVelocity(velocityX, -700)
    bullet.setDepth(3)
    return true
  }

  setFireLevel(level) {
    this.fireLevel = Phaser.Math.Clamp(level, 1, 3)
  }

  setShield(timeNow, durationMs) {
    this.shieldUntil = Math.max(this.shieldUntil, timeNow + durationMs)
  }

  hasShield(timeNow) {
    return timeNow < this.shieldUntil
  }
}
