import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../game/config'
import { Player } from '../entities/Player'
import { SynthAudio } from '../audio/SynthAudio'

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    this.score = 0
    this.lives = 3
    this.maxLives = 6
    this.scrollSpeed = 130
    this.isGameOver = false
    this.gameCleared = false
    this.invulnerableUntil = 0
    this.levelSeconds = 0
    this.lastBossShotAt = 0
    this.bossDefeatedCount = 0
    this.phase = 'wave'
    this.isShopOpen = false
    this.audio = new SynthAudio()
    this.audioMuted = false

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.audio) {
        this.audio.destroy()
      }
    })

    this.waveConfigs = [
      {
        name: 'Wave 1',
        duration: 18,
        spawnDelay: 620,
        fireDelay: 900,
        weights: { scout: 62, striker: 30, tank: 8 },
        speedScale: 1
      },
      {
        name: 'Wave 2',
        duration: 20,
        spawnDelay: 530,
        fireDelay: 780,
        weights: { scout: 48, striker: 36, tank: 16 },
        speedScale: 1.14
      },
      {
        name: 'Wave 3',
        duration: 22,
        spawnDelay: 460,
        fireDelay: 700,
        weights: { scout: 42, striker: 36, tank: 22 },
        speedScale: 1.24
      }
    ]
    this.waveIndex = 0
    this.waveRemaining = this.waveConfigs[this.waveIndex].duration

    this.background = this.add
      .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'bgTile')
      .setDepth(0)

    this.player = new Player(this, GAME_WIDTH / 2, GAME_HEIGHT - 120)
    this.player.setDepth(2)

    this.playerBullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 140,
      runChildUpdate: false
    })

    this.enemyBullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 220,
      runChildUpdate: false
    })

    this.bossBullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 260,
      runChildUpdate: false
    })

    this.enemies = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 90,
      runChildUpdate: false
    })

    this.bosses = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 1,
      runChildUpdate: false
    })

    this.pickups = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 30,
      runChildUpdate: false
    })

    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    })
    this.shopKeys = this.input.keyboard.addKeys({
      one: Phaser.Input.Keyboard.KeyCodes.ONE,
      two: Phaser.Input.Keyboard.KeyCodes.TWO,
      three: Phaser.Input.Keyboard.KeyCodes.THREE,
      mute: Phaser.Input.Keyboard.KeyCodes.M
    })

    this.input.once('pointerdown', () => this.startAudio())
    this.input.keyboard.once('keydown', () => this.startAudio())

    this.input.on('pointermove', (pointer) => {
      if (this.isShopOpen || !pointer.isDown || !this.player.isAlive) return
      this.player.x = Phaser.Math.Clamp(pointer.x, 24, GAME_WIDTH - 24)
      this.player.y = Phaser.Math.Clamp(pointer.y, 24, GAME_HEIGHT - 24)
    })

    this.enemySpawnEvent = this.time.addEvent({
      delay: this.waveConfigs[this.waveIndex].spawnDelay,
      loop: true,
      callback: this.spawnEnemy,
      callbackScope: this
    })

    this.enemyFireEvent = this.time.addEvent({
      delay: this.waveConfigs[this.waveIndex].fireDelay,
      loop: true,
      callback: this.enemyFire,
      callbackScope: this
    })

    this.waveTickEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.onWaveTick,
      callbackScope: this
    })

    this.physics.add.overlap(this.playerBullets, this.enemies, this.hitEnemy, undefined, this)
    this.physics.add.overlap(this.playerBullets, this.bosses, this.hitBoss, undefined, this)
    this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, undefined, this)
    this.physics.add.overlap(this.player, this.enemyBullets, this.hitPlayer, undefined, this)
    this.physics.add.overlap(this.player, this.bossBullets, this.hitPlayer, undefined, this)
    this.physics.add.overlap(this.player, this.bosses, this.hitPlayer, undefined, this)
    this.physics.add.overlap(this.player, this.pickups, this.collectPickup, undefined, this)

    if (!this.scene.isActive('UIScene')) {
      this.scene.launch('UIScene')
    }

    this.shopOverlay = this.createShopOverlay()
    this.shopOverlay.setVisible(false)

    this.events.emit('score-changed', this.score)
    this.events.emit('lives-changed', this.lives)
    this.events.emit('fire-changed', this.player.fireLevel)
    this.events.emit('shield-changed', 0)
    this.events.emit('boss-hp-changed', null)
    this.events.emit('stage-changed', `${this.waveConfigs[this.waveIndex].name} - ${this.waveRemaining}s`)
    this.events.emit('audio-changed', this.audioMuted)
  }

  update(time, delta) {
    this.background.tilePositionY -= (this.scrollSpeed * delta) / 1000
    this.levelSeconds += delta / 1000

    if (this.isGameOver || this.gameCleared) return

    this.handleShopInput()
    this.handleAudioInput()

    if (!this.isShopOpen) {
      this.player.update(this.cursors, this.wasd)
      const fired = this.player.tryFire(time, this.playerBullets)
      if (fired) this.audio.playShoot()
    } else {
      this.player.setVelocity(0, 0)
    }

    this.updateEnemies(time)
    this.updateBoss(time)

    this.cleanupOffscreen(this.playerBullets, -30, GAME_HEIGHT + 30)
    this.cleanupOffscreen(this.enemyBullets, -30, GAME_HEIGHT + 30)
    this.cleanupOffscreen(this.bossBullets, -40, GAME_HEIGHT + 40)
    this.cleanupOffscreen(this.enemies, -80, GAME_HEIGHT + 80)
    this.cleanupOffscreen(this.pickups, -40, GAME_HEIGHT + 40)

    if (time > this.invulnerableUntil) {
      this.player.setAlpha(1)
    }

    if (this.player.hasShield(time)) {
      this.player.setTint(0x8dffe2)
      const remainMs = this.player.shieldUntil - time
      this.events.emit('shield-changed', Math.ceil(remainMs / 1000))
    } else {
      this.player.clearTint()
      this.events.emit('shield-changed', 0)
    }
  }

  startAudio() {
    this.audio.unlock()
    this.audio.startMusic()
  }

  createShopOverlay() {
    const panel = this.add.container(0, 0).setDepth(30)
    const mask = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.62)
    const bg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 430, 450, 0x101a31, 0.97)
    bg.setStrokeStyle(4, 0x5f9fff)

    const title = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 180, 'UPGRADE SHOP', {
        fontFamily: 'Arial',
        fontSize: '42px',
        color: '#d2e8ff',
        stroke: '#000',
        strokeThickness: 5
      })
      .setOrigin(0.5)

    const tip = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 126, 'Press 1 / 2 / 3 or click', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#97c6ff'
      })
      .setOrigin(0.5)

    const option1 = this.createShopOption(GAME_HEIGHT / 2 - 56, '1. Firepower +1', 'Spread shot upgrade')
    const option2 = this.createShopOption(GAME_HEIGHT / 2 + 28, '2. Reinforced Hull', '+1 Life (max 6)')
    const option3 = this.createShopOption(GAME_HEIGHT / 2 + 112, '3. Tactical Shield', 'Shield +8s and clear bullets')

    panel.add([mask, bg, title, tip, option1.container, option2.container, option3.container])
    this.shopOptions = [option1, option2, option3]
    this.selectedShopOption = null
    return panel
  }

  createShopOption(y, title, subtitle) {
    const container = this.add.container(0, 0)
    const box = this.add.rectangle(GAME_WIDTH / 2, y, 360, 64, 0x203457, 0.95).setStrokeStyle(2, 0x8ac2ff)
    const titleText = this.add
      .text(GAME_WIDTH / 2 - 162, y - 16, title, {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#f4faff'
      })
      .setOrigin(0, 0)
    const subText = this.add
      .text(GAME_WIDTH / 2 - 162, y + 8, subtitle, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#9ed2ff'
      })
      .setOrigin(0, 0)

    box.setInteractive({ useHandCursor: true })
    container.add([box, titleText, subText])
    return { container, box }
  }

  handleShopInput() {
    if (!this.isShopOpen) return

    if (Phaser.Input.Keyboard.JustDown(this.shopKeys.one)) {
      this.chooseShopUpgrade(1)
    } else if (Phaser.Input.Keyboard.JustDown(this.shopKeys.two)) {
      this.chooseShopUpgrade(2)
    } else if (Phaser.Input.Keyboard.JustDown(this.shopKeys.three)) {
      this.chooseShopUpgrade(3)
    }
  }

  handleAudioInput() {
    if (Phaser.Input.Keyboard.JustDown(this.shopKeys.mute)) {
      this.audioMuted = !this.audioMuted
      this.audio.setMuted(this.audioMuted)
      this.events.emit('audio-changed', this.audioMuted)
    }
  }

  openShop() {
    this.isShopOpen = true
    this.shopOverlay.setVisible(true)
    this.enemySpawnEvent.paused = true
    this.enemyFireEvent.paused = true
    this.waveTickEvent.paused = true
    this.clearAllEnemyBullets()

    this.shopOptions.forEach((option, index) => {
      option.box.removeAllListeners('pointerdown')
      option.box.on('pointerdown', () => this.chooseShopUpgrade(index + 1))
    })

    this.events.emit('stage-changed', 'Upgrade Shop')
  }

  chooseShopUpgrade(index) {
    if (!this.isShopOpen) return

    if (index === 1) {
      this.player.setFireLevel(this.player.fireLevel + 1)
      this.events.emit('fire-changed', this.player.fireLevel)
    } else if (index === 2) {
      this.lives = Math.min(this.maxLives, this.lives + 1)
      this.events.emit('lives-changed', this.lives)
    } else {
      this.player.setShield(this.time.now, 8000)
      this.clearAllEnemyBullets()
      this.explode(this.player.x, this.player.y, 0x8effbd, 22)
    }

    this.shopOverlay.setVisible(false)
    this.isShopOpen = false
    this.resumeCombatAfterShop()
  }

  resumeCombatAfterShop() {
    if (this.phase === 'final-ready') {
      this.startFinalBossStage()
      return
    }

    if (this.phase === 'midboss-ready') {
      this.startMidBossStage()
      return
    }

    this.phase = 'wave'
    this.enemySpawnEvent.paused = false
    this.enemyFireEvent.paused = false
    this.waveTickEvent.paused = false
    const config = this.waveConfigs[this.waveIndex]
    this.events.emit('stage-changed', `${config.name} - ${this.waveRemaining}s`)
  }

  clearAllEnemyBullets() {
    this.enemyBullets.children.iterate((bullet) => {
      if (bullet && bullet.active) bullet.disableBody(true, true)
    })
    this.bossBullets.children.iterate((bullet) => {
      if (bullet && bullet.active) bullet.disableBody(true, true)
    })
  }

  onWaveTick() {
    if (this.phase !== 'wave' || this.isShopOpen || this.isGameOver || this.gameCleared) return

    this.waveRemaining -= 1
    const cfg = this.waveConfigs[this.waveIndex]
    this.events.emit('stage-changed', `${cfg.name} - ${Math.max(0, this.waveRemaining)}s`)

    if (this.waveRemaining > 0) return

    if (this.waveIndex < this.waveConfigs.length - 1) {
      this.waveIndex += 1
      this.waveRemaining = this.waveConfigs[this.waveIndex].duration
      this.applyWaveConfig(this.waveConfigs[this.waveIndex])
      this.openShop()
      return
    }

    this.phase = 'midboss-ready'
    this.openShop()
  }

  applyWaveConfig(config) {
    this.enemySpawnEvent.delay = config.spawnDelay
    this.enemyFireEvent.delay = config.fireDelay
  }

  cleanupOffscreen(group, minY, maxY) {
    group.children.iterate((obj) => {
      if (!obj || !obj.active) return
      if (obj.y < minY || obj.y > maxY) {
        obj.disableBody(true, true)
      }
    })
  }

  spawnEnemy() {
    if (this.isGameOver || this.gameCleared || this.phase !== 'wave' || this.hasActiveBoss()) return

    const enemy = this.enemies.get(Phaser.Math.Between(26, GAME_WIDTH - 26), -44, 'enemy')
    if (!enemy) return

    const config = this.waveConfigs[this.waveIndex]
    const type = this.rollEnemyType(config.weights)
    const speedScale = config.speedScale

    enemy.setActive(true).setVisible(true)
    enemy.body.enable = true
    enemy.setDepth(2)
    enemy.type = type
    enemy.waveSeed = Phaser.Math.FloatBetween(0, Math.PI * 2)
    enemy.scoreValue = 12
    enemy.dropRate = 0.12

    if (type === 'scout') {
      enemy.setScale(0.9)
      enemy.setTint(0xff9ac6)
      enemy.hp = 1
      enemy.body.setVelocityY((250 + Math.min(this.levelSeconds * 2, 90)) * speedScale)
      enemy.scoreValue = 8
      enemy.dropRate = 0.08
    } else if (type === 'striker') {
      enemy.setScale(1)
      enemy.setTint(0x96d4ff)
      enemy.hp = 2
      enemy.body.setVelocityY((175 + Math.min(this.levelSeconds * 2, 75)) * speedScale)
      enemy.scoreValue = 14
      enemy.dropRate = 0.15
    } else {
      enemy.setScale(1.15)
      enemy.setTint(0xd2b0ff)
      enemy.hp = 6
      enemy.body.setVelocityY(118 * speedScale)
      enemy.scoreValue = 30
      enemy.dropRate = 0.28
    }
  }

  rollEnemyType(weights) {
    const total = weights.scout + weights.striker + weights.tank
    const roll = Phaser.Math.Between(1, total)
    if (roll <= weights.scout) return 'scout'
    if (roll <= weights.scout + weights.striker) return 'striker'
    return 'tank'
  }

  enemyFire() {
    if (this.isGameOver || this.gameCleared || this.phase !== 'wave') return

    const livingEnemies = this.enemies
      .getChildren()
      .filter((enemy) => enemy.active && (enemy.type === 'striker' || enemy.type === 'tank'))
    if (livingEnemies.length === 0) return

    const shooter = Phaser.Utils.Array.GetRandom(livingEnemies)
    const shotCount = shooter.type === 'tank' ? 3 : 1

    for (let i = 0; i < shotCount; i += 1) {
      const bullet = this.enemyBullets.get(shooter.x, shooter.y + 20, 'enemyBullet')
      if (!bullet) return
      const spread = shotCount === 1 ? 0 : (i - 1) * 95
      bullet.setActive(true).setVisible(true)
      bullet.body.enable = true
      bullet.body.setVelocity(spread, 310)
      bullet.setDepth(2)
    }
  }

  updateEnemies(time) {
    this.enemies.children.iterate((enemy) => {
      if (!enemy || !enemy.active) return

      if (enemy.type === 'scout') {
        const t = time * 0.004 + enemy.waveSeed
        enemy.body.setVelocityX(Math.sin(t) * 110)
      } else if (enemy.type === 'striker') {
        const t = time * 0.003 + enemy.waveSeed
        enemy.body.setVelocityX(Math.sin(t) * 60)
      } else {
        enemy.body.setVelocityX(0)
      }
    })
  }

  startMidBossStage() {
    this.phase = 'midboss'
    this.waveTickEvent.paused = true
    this.enemySpawnEvent.paused = true
    this.enemyFireEvent.paused = true
    this.clearAllEnemyBullets()
    this.clearEnemiesAndPickups()
    this.spawnBoss('mid')
    this.events.emit('stage-changed', 'Mini Boss')
  }

  startFinalBossStage() {
    this.phase = 'finalboss'
    this.waveTickEvent.paused = true
    this.enemySpawnEvent.paused = true
    this.enemyFireEvent.paused = true
    this.clearAllEnemyBullets()
    this.clearEnemiesAndPickups()
    this.spawnBoss('final')
    this.events.emit('stage-changed', 'Final Boss')
  }

  clearEnemiesAndPickups() {
    this.enemies.children.iterate((enemy) => {
      if (enemy && enemy.active) enemy.disableBody(true, true)
    })
    this.pickups.children.iterate((pickup) => {
      if (pickup && pickup.active) pickup.disableBody(true, true)
    })
  }

  spawnBoss(kind) {
    if (this.isGameOver || this.hasActiveBoss()) return

    const boss = this.bosses.get(GAME_WIDTH / 2, -90, 'boss')
    if (!boss) return

    boss.setActive(true).setVisible(true)
    boss.body.enable = true
    boss.setDepth(4)
    boss.kind = kind
    boss.entered = false

    if (kind === 'mid') {
      boss.hp = 170
      boss.maxHp = 170
      boss.body.setVelocityY(80)
      boss.setTint(0xffffff)
    } else {
      boss.hp = 320
      boss.maxHp = 320
      boss.body.setVelocityY(70)
      boss.setTint(0xff9bf0)
    }

    this.lastBossShotAt = 0
    this.events.emit('boss-hp-changed', 1)
  }

  updateBoss(time) {
    const boss = this.bosses.getChildren().find((obj) => obj.active)
    if (!boss) return

    if (!boss.entered && boss.y >= 140) {
      boss.entered = true
      boss.body.setVelocity(0, 0)
    }

    if (!boss.entered) return

    const speed = boss.kind === 'final' ? 0.0019 : 0.0014
    const range = boss.kind === 'final' ? 180 : 150
    boss.x = GAME_WIDTH / 2 + Math.sin(time * speed) * range
    this.bossShoot(time, boss)
    this.events.emit('boss-hp-changed', Phaser.Math.Clamp(boss.hp / boss.maxHp, 0, 1))
  }

  bossShoot(time, boss) {
    const cooldown = boss.kind === 'final' ? 360 : 540
    if (time - this.lastBossShotAt < cooldown) return

    const phase = Math.floor(time / 800) % 3
    let pattern = []
    if (boss.kind === 'mid') {
      pattern = [-220, -140, -60, 0, 60, 140, 220]
    } else if (phase === 0) {
      pattern = [-280, -210, -140, -70, 0, 70, 140, 210, 280]
    } else if (phase === 1) {
      pattern = [-220, -110, 0, 110, 220]
    } else {
      pattern = [-260, -180, -100, 100, 180, 260]
    }

    pattern.forEach((vx) => {
      const bullet = this.bossBullets.get(boss.x, boss.y + 32, 'bossBullet')
      if (!bullet) return
      bullet.setActive(true).setVisible(true)
      bullet.body.enable = true
      bullet.body.setVelocity(vx, boss.kind === 'final' ? 320 : 260)
      bullet.setDepth(3)
      bullet.setTint(boss.kind === 'final' ? 0xd93bc1 : 0x8f4fe8)
    })

    this.lastBossShotAt = time
  }

  hitBoss(bullet, boss) {
    if (!bullet.active || !boss.active) return
    bullet.disableBody(true, true)
    boss.hp -= 1
    if (boss.hp > 0) return

    this.explode(boss.x, boss.y, 0xffb1e8, 44)
    this.audio.playExplosion()
    boss.disableBody(true, true)
    this.events.emit('boss-hp-changed', null)
    this.score += boss.kind === 'final' ? 900 : 300
    this.events.emit('score-changed', this.score)
    this.clearAllEnemyBullets()
    this.bossDefeatedCount += 1

    if (boss.kind === 'mid') {
      this.phase = 'final-ready'
      this.dropPickup(boss.x - 44, boss.y, 'fire')
      this.dropPickup(boss.x + 44, boss.y, 'shield')
      this.openShop()
    } else {
      this.winGame()
    }
  }

  hasActiveBoss() {
    return this.bosses.getChildren().some((obj) => obj.active)
  }

  collectPickup(player, pickup) {
    if (!pickup.active) return
    pickup.disableBody(true, true)

    if (pickup.kind === 'fire') {
      this.audio.playPickup()
      this.player.setFireLevel(this.player.fireLevel + 1)
      this.events.emit('fire-changed', this.player.fireLevel)
      this.score += 20
      this.events.emit('score-changed', this.score)
      this.explode(player.x, player.y, 0x65e6ff, 14)
      return
    }

    if (pickup.kind === 'shield') {
      this.audio.playPickup()
      this.player.setShield(this.time.now, 7000)
      this.explode(player.x, player.y, 0x7bff9a, 14)
    }
  }

  dropPickup(x, y, forcedKind) {
    const kind = forcedKind || (Phaser.Math.Between(0, 100) < 60 ? 'fire' : 'shield')
    const texture = kind === 'fire' ? 'pickupFire' : 'pickupShield'
    const pickup = this.pickups.get(x, y, texture)
    if (!pickup) return

    pickup.kind = kind
    pickup.setActive(true).setVisible(true)
    pickup.body.enable = true
    pickup.setDepth(3)
    pickup.setVelocity(0, 120)
  }

  maybeDropFromEnemy(enemy) {
    if (Phaser.Math.FloatBetween(0, 1) > enemy.dropRate) return
    const kind = enemy.type === 'tank' ? 'shield' : undefined
    this.dropPickup(enemy.x, enemy.y, kind)
  }

  hitEnemy(bullet, enemy) {
    if (!bullet.active || !enemy.active) return

    bullet.disableBody(true, true)
    enemy.hp -= 1
    if (enemy.hp > 0) return

    this.explode(enemy.x, enemy.y, 0xffc4e4)
    this.audio.playExplosion()
    enemy.disableBody(true, true)
    this.score += enemy.scoreValue
    this.events.emit('score-changed', this.score)
    this.maybeDropFromEnemy(enemy)
  }

  hitPlayer(playerObj, hazard) {
    if (this.isGameOver || this.gameCleared || this.isShopOpen) return
    if (this.time.now < this.invulnerableUntil) return

    if (this.player.hasShield(this.time.now)) {
      if (hazard.active && !hazard.maxHp) {
        hazard.disableBody(true, true)
      }
      this.explode(playerObj.x, playerObj.y, 0x7bff9a, 10)
      return
    }

    if (hazard.active && !hazard.maxHp) {
      hazard.disableBody(true, true)
    }

    this.lives -= 1
    this.audio.playHit()
    this.invulnerableUntil = this.time.now + 1000
    this.player.setAlpha(0.35)
    this.cameras.main.shake(120, 0.005)
    this.explode(playerObj.x, playerObj.y, 0x87d7ff, 16)
    this.events.emit('lives-changed', this.lives)

    if (this.lives <= 0) {
      this.gameOver()
    }
  }

  explode(x, y, tint, quantity = 12) {
    const particles = this.add.particles(0, 0, 'particle', {
      x,
      y,
      quantity,
      lifespan: 400,
      speed: { min: 60, max: 260 },
      scale: { start: 1.3, end: 0 },
      tint
    })
    this.time.delayedCall(120, () => particles.destroy())
  }

  winGame() {
    this.gameCleared = true
    this.player.isAlive = false
    this.player.setVelocity(0, 0)
    this.enemySpawnEvent.paused = true
    this.enemyFireEvent.paused = true
    this.waveTickEvent.paused = true
    this.events.emit('stage-changed', 'Mission Complete')

    const text = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'MISSION COMPLETE\nClick To Play Again', {
        fontFamily: 'Arial',
        fontSize: '42px',
        color: '#ffffff',
        align: 'center',
        stroke: '#111',
        strokeThickness: 6
      })
      .setOrigin(0.5)
      .setDepth(35)

    this.input.once('pointerdown', () => {
      text.destroy()
      this.scene.restart()
    })
  }

  gameOver() {
    this.isGameOver = true
    this.player.isAlive = false
    this.player.setVelocity(0, 0)
    this.enemySpawnEvent.remove()
    this.enemyFireEvent.remove()
    this.waveTickEvent.remove()
    this.events.emit('boss-hp-changed', null)
    this.events.emit('stage-changed', 'Game Over')

    const text = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'GAME OVER\nClick To Restart', {
        fontFamily: 'Arial',
        fontSize: '42px',
        color: '#ffffff',
        align: 'center',
        stroke: '#111',
        strokeThickness: 6
      })
      .setOrigin(0.5)
      .setDepth(35)

    this.input.once('pointerdown', () => {
      text.destroy()
      this.scene.restart()
    })
  }

}
