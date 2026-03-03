import Phaser from 'phaser'

const WEAPON_MODES = {
  NORMAL: 'normal',
  LASER: 'laser',
  SPREAD: 'spread',
  HOMING: 'homing',
  PIERCE: 'pierce',
  BOOMERANG: 'boomerang'
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setScale(0.46)
    this.body.setSize(56, 48)
    this.body.setOffset(28, 12)
    this.setCollideWorldBounds(true)
    this.speed = 360
    this.fireRate = 140
    this.lastFiredAt = 0
    this.isAlive = true
    this.fireLevel = 1
    this.shieldUntil = 0
    this.weaponMode = WEAPON_MODES.NORMAL
    this.weaponModeUntil = 0
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
      if ((this.scene.debugPlayerKbdLogAt || 0) <= this.scene.time.now) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/37d80bce-582f-43d7-887b-668ec130d0ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'pre-fix',hypothesisId:'H3',location:'Player.js:update',message:'Keyboard movement velocity applied',data:{dx,dy,targetSpeed:this.speed,appliedVx:this.body?.velocity?.x||0,appliedVy:this.body?.velocity?.y||0,appliedSpeed:Math.hypot(this.body?.velocity?.x||0,this.body?.velocity?.y||0)},timestamp:Date.now()})}).catch(()=>{})
        // #endregion
        this.scene.debugPlayerKbdLogAt = this.scene.time.now + 260
      }
    } else {
      this.setVelocity(0, 0)
    }
  }

  tryFire(time, bulletGroup) {
    const mode = this.getCurrentWeaponMode(time)
    const modeFireRate = this.getModeFireRate(mode)
    if (!this.isAlive || time - this.lastFiredAt < modeFireRate) return false

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

    const modePatterns = this.getModePatterns(mode)
    const shots = modePatterns || patterns[this.fireLevel] || patterns[3]
    let firedCount = 0
    shots.forEach((shot) => {
      const spawned = this.spawnBullet(bulletGroup, shot.x, shot.vx, shot.bulletOptions || {})
      if (spawned) firedCount += 1
    })

    this.lastFiredAt = time
    return firedCount > 0
  }

  getCurrentWeaponMode(timeNow) {
    if (this.weaponMode !== WEAPON_MODES.NORMAL && timeNow >= this.weaponModeUntil) {
      this.weaponMode = WEAPON_MODES.NORMAL
      this.weaponModeUntil = 0
    }
    return this.weaponMode
  }

  getModeFireRate(mode) {
    if (mode === WEAPON_MODES.LASER) return 70
    if (mode === WEAPON_MODES.SPREAD) return 165
    if (mode === WEAPON_MODES.HOMING) return 180
    if (mode === WEAPON_MODES.PIERCE) return 150
    if (mode === WEAPON_MODES.BOOMERANG) return 200
    return this.fireRate
  }

  getModePatterns(mode) {
    if (mode === WEAPON_MODES.LASER) {
      return [{ x: 0, vx: 0, bulletOptions: { kind: 'laser', damage: 2, vy: -880, scale: 0.9, size: [12, 46], tint: 0x74f7ff } }]
    }
    if (mode === WEAPON_MODES.SPREAD) {
      return [-180, -90, 0, 90, 180].map((vx) => ({
        x: vx * 0.045,
        vx,
        bulletOptions: { kind: 'spread', damage: 1, vy: -620, scale: 0.82, size: [9, 28], tint: 0x9fd7ff }
      }))
    }
    if (mode === WEAPON_MODES.HOMING) {
      return [
        { x: -10, vx: -50, bulletOptions: { kind: 'homing', damage: 1, vy: -500, scale: 0.85, size: [10, 34], tint: 0x9affcf } },
        { x: 10, vx: 50, bulletOptions: { kind: 'homing', damage: 1, vy: -500, scale: 0.85, size: [10, 34], tint: 0x9affcf } }
      ]
    }
    if (mode === WEAPON_MODES.PIERCE) {
      return [
        { x: -8, vx: -40, bulletOptions: { kind: 'pierce', damage: 1, pierceLeft: 3, vy: -720, scale: 0.9, size: [10, 40], tint: 0xffd28e } },
        { x: 8, vx: 40, bulletOptions: { kind: 'pierce', damage: 1, pierceLeft: 3, vy: -720, scale: 0.9, size: [10, 40], tint: 0xffd28e } }
      ]
    }
    if (mode === WEAPON_MODES.BOOMERANG) {
      return [
        { x: -16, vx: -250, bulletOptions: { kind: 'boomerang', damage: 1, vy: -420, scale: 0.88, size: [11, 34], tint: 0xe0a5ff } },
        { x: 16, vx: 250, bulletOptions: { kind: 'boomerang', damage: 1, vy: -420, scale: 0.88, size: [11, 34], tint: 0xe0a5ff } }
      ]
    }
    return null
  }

  spawnBullet(bulletGroup, offsetX, velocityX, options = {}) {
    const bullet = bulletGroup.get(this.x + offsetX, this.y - 30, 'bullet')
    if (!bullet) return false

    bullet.setActive(true)
    bullet.setVisible(true)
    bullet.body.enable = true
    bullet.body.setVelocity(velocityX, options.vy || -700)
    bullet.setScale(options.scale || 0.85)
    const [hitW, hitH] = options.size || [10, 40]
    bullet.body.setSize(hitW, hitH)
    bullet.setDepth(3)
    bullet.kind = options.kind || 'normal'
    bullet.damage = options.damage || 1
    bullet.pierceLeft = options.pierceLeft || 0
    bullet.spawnedAt = this.scene.time.now
    bullet.returning = false
    if (options.tint) {
      bullet.setTint(options.tint)
    } else {
      bullet.clearTint()
    }
    return true
  }

  setFireLevel(level) {
    this.fireLevel = Phaser.Math.Clamp(level, 1, 3)
  }

  setShield(timeNow, durationMs) {
    this.shieldUntil = Math.max(this.shieldUntil, timeNow + durationMs)
  }

  setWeaponMode(mode, timeNow, durationMs) {
    this.weaponMode = mode || WEAPON_MODES.NORMAL
    if (this.weaponMode === WEAPON_MODES.NORMAL) {
      this.weaponModeUntil = 0
      return
    }
    this.weaponModeUntil = Math.max(this.weaponModeUntil, timeNow + durationMs)
  }

  hasShield(timeNow) {
    return timeNow < this.shieldUntil
  }
}

export { WEAPON_MODES }
