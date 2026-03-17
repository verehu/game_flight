import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../game/config'
import { Player, WEAPON_MODES } from '../entities/Player'
import { SynthAudio } from '../audio/SynthAudio'

const ENEMY_THEME = {
  common: 0xffb48c,
  elite: 0xff7a67,
  danger: 0xd93bc1
}

const ENEMY_CONFIG = {
  scout: {
    textureKey: 'enemyScout',
    baseScale: 0.36,
    baseTint: 0xffffff,
    hp: 1,
    minYSpeed: 250,
    levelSpeedGain: 2,
    levelSpeedCap: 90,
    scoreValue: 8,
    dropRate: 0.08,
    flightMode: 'intercept',
    turnRate: 0.045,
    maxVx: 180,
    hitboxScaleX: 0.42,
    hitboxScaleY: 0.46
  },
  striker: {
    textureKey: 'enemyStriker',
    baseScale: 0.42,
    baseTint: 0xf9e8da,
    hp: 2,
    minYSpeed: 175,
    levelSpeedGain: 2,
    levelSpeedCap: 75,
    scoreValue: 14,
    dropRate: 0.15,
    flightMode: 'lane',
    turnRate: 0.03,
    maxVx: 105,
    hitboxScaleX: 0.44,
    hitboxScaleY: 0.48
  },
  tank: {
    textureKey: 'enemyTank',
    baseScale: 0.52,
    baseTint: 0xffd2bf,
    hp: 6,
    minYSpeed: 118,
    levelSpeedGain: 0,
    levelSpeedCap: 0,
    scoreValue: 30,
    dropRate: 0.28,
    flightMode: 'fortress',
    hitboxScaleX: 0.5,
    hitboxScaleY: 0.54
  },
  sniper: {
    textureKey: 'enemySniper',
    baseScale: 0.44,
    baseTint: 0xff9f85,
    hp: 2,
    minYSpeed: 140,
    levelSpeedGain: 1.6,
    levelSpeedCap: 60,
    scoreValue: 18,
    dropRate: 0.16,
    flightMode: 'sniper',
    turnRate: 0.025,
    maxVx: 92,
    hitboxScaleX: 0.44,
    hitboxScaleY: 0.5
  },
  swarm: {
    textureKey: 'enemySwarm',
    baseScale: 0.32,
    baseTint: 0xffb27e,
    hp: 1,
    minYSpeed: 220,
    levelSpeedGain: 2,
    levelSpeedCap: 110,
    scoreValue: 7,
    dropRate: 0.06,
    flightMode: 'swarm',
    turnRate: 0.06,
    maxVx: 150,
    hitboxScaleX: 0.4,
    hitboxScaleY: 0.44
  },
  charger: {
    textureKey: 'enemyCharger',
    baseScale: 0.46,
    baseTint: 0xff8f74,
    hp: 3,
    minYSpeed: 170,
    levelSpeedGain: 1.5,
    levelSpeedCap: 70,
    scoreValue: 20,
    dropRate: 0.14,
    flightMode: 'charger',
    turnRate: 0.045,
    maxVx: 120,
    hitboxScaleX: 0.46,
    hitboxScaleY: 0.5
  },
  guard: {
    textureKey: 'enemyGuard',
    baseScale: 0.5,
    baseTint: 0xff7d74,
    hp: 4,
    minYSpeed: 155,
    levelSpeedGain: 1.4,
    levelSpeedCap: 65,
    scoreValue: 24,
    dropRate: 0.24,
    flightMode: 'guard',
    turnRate: 0.04,
    maxVx: 118,
    hitboxScaleX: 0.48,
    hitboxScaleY: 0.52
  },
  ufoElite: {
    textureKey: 'enemyUfoElite',
    baseScale: 0.54,
    baseTint: 0xff8a75,
    hp: 5,
    minYSpeed: 150,
    levelSpeedGain: 1.2,
    levelSpeedCap: 55,
    scoreValue: 34,
    dropRate: 0.32,
    flightMode: 'ufo',
    turnRate: 0.035,
    maxVx: 170,
    hitboxScaleX: 0.52,
    hitboxScaleY: 0.52
  }
}

const ENEMY_SHOT_CONFIG = {
  striker: { mode: 'down', count: 1, speed: 310, spread: 0, bulletScale: 0.95, bulletSize: [8, 30], tint: ENEMY_THEME.common },
  tank: { mode: 'down', count: 3, speed: 310, spread: 95, bulletScale: 0.98, bulletSize: [8, 30], tint: ENEMY_THEME.common },
  sniper: { mode: 'aimed', count: 1, speed: 380, spread: 0, bulletScale: 1, bulletSize: [9, 34], tint: ENEMY_THEME.elite },
  guard: { mode: 'aimed', count: 2, speed: 320, spread: 60, bulletScale: 1, bulletSize: [8, 30], tint: ENEMY_THEME.elite },
  ufoElite: { mode: 'down', count: 5, speed: 300, spread: 62, bulletScale: 0.92, bulletSize: [8, 28], tint: ENEMY_THEME.danger }
}

const EARTH_BACKGROUND_SCHEME_KEY = 'USER'
const EARTH_BACKGROUND_SCHEMES = {
  USER: {
    base: 'bgEarthUserBase',
    planet: 'bgEarthUserBase',
    overlay: 'bgEarthAOverlay',
    dustTint: 0xc7dff2,
    dustAlpha: 0.12,
    planetAlpha: 0.24,
    overlayAlpha: 0.26,
    planetSpeed: 0.9,
    overlaySpeed: 1.08,
    planetOffsetY: 0,
    planetOffsetX: 0,
    planetXDrift: 0,
    overlayXDrift: 0,
    dustXDrift: 0
  },
  A: {
    base: 'bgEarthABase',
    planet: 'bgEarthAPlanet',
    overlay: 'bgEarthAOverlay',
    dustTint: 0xcbe7ff,
    dustAlpha: 0.3,
    planetAlpha: 0.54,
    overlayAlpha: 0.5,
    planetSpeed: 0.74,
    overlaySpeed: 1.02,
    planetXDrift: 0.02,
    overlayXDrift: 0.05,
    dustXDrift: 0.08
  },
  B: {
    base: 'bgEarthBBase',
    planet: 'bgEarthBPlanet',
    overlay: 'bgEarthBOverlay',
    dustTint: 0xa9deff,
    dustAlpha: 0.3,
    planetAlpha: 0.72,
    overlayAlpha: 0.3,
    planetSpeed: 0.48,
    overlaySpeed: 0.66,
    planetXDrift: 0.02,
    overlayXDrift: 0.05,
    dustXDrift: 0.08
  },
  C: {
    base: 'bgEarthCBase',
    planet: 'bgEarthCPlanet',
    overlay: 'bgEarthCOverlay',
    baseFallback: 'bgEarthCBaseFallback',
    planetFallback: 'bgEarthCPlanetFallback',
    overlayFallback: 'bgEarthCOverlayFallback',
    dustTint: 0xb7d5e8,
    dustAlpha: 0.3,
    planetAlpha: 0.22,
    overlayAlpha: 0.26,
    planetSpeed: 0.7,
    overlaySpeed: 1.03,
    planetXDrift: 0.02,
    overlayXDrift: 0.05,
    dustXDrift: 0.08
  }
}

const SECTOR_TEXTURES = [
  { base: 'bgSectorABase', planet: 'bgSectorAPlanet' },
  { base: 'bgSectorBBase', planet: 'bgSectorBPlanet' },
  { base: 'bgSectorCBase', planet: 'bgSectorCPlanet' }
]
const MOON_SECTOR_TEXTURES = [
  { base: 'bgMoonMareA' },
  { base: 'bgMoonMareB' },
  { base: 'bgMoonMareC' }
]
const SECTOR_OVERLAY = 'bgCloudOverlay'
const SECTOR_CROSSFADE_MS = 2000

const EARTH_SECTOR_FACTORS = [
  { planet: 0.82, overlay: 0.85 },
  { planet: 1, overlay: 1 },
  { planet: 1.08, overlay: 1.12 }
]

const PICKUP_KIND = {
  FIRE: 'fire',
  SHIELD: 'shield',
  LASER: 'laser',
  SPREAD: 'spread',
  HOMING: 'homing',
  PIERCE: 'pierce',
  BOOMERANG: 'boomerang',
  ULTIMATE: 'ultimateCharge'
}

const PICKUP_TEXTURE = {
  [PICKUP_KIND.FIRE]: 'pickupIconFire',
  [PICKUP_KIND.SHIELD]: 'pickupIconShield',
  [PICKUP_KIND.LASER]: 'pickupIconLaser',
  [PICKUP_KIND.SPREAD]: 'pickupIconSpread',
  [PICKUP_KIND.HOMING]: 'pickupIconHoming',
  [PICKUP_KIND.PIERCE]: 'pickupIconPierce',
  [PICKUP_KIND.BOOMERANG]: 'pickupIconBoomerang',
  [PICKUP_KIND.ULTIMATE]: 'pickupIconUltimate'
}

const PICKUP_STYLE = {
  [PICKUP_KIND.FIRE]: { color: 0x62c7ff, burstTint: 0x65e6ff, label: 'FIRE UP' },
  [PICKUP_KIND.SHIELD]: { color: 0x70efad, burstTint: 0x7bff9a, label: 'SHIELD' },
  [PICKUP_KIND.LASER]: { color: 0x7df7ff, burstTint: 0x7df7ff, label: 'LASER' },
  [PICKUP_KIND.SPREAD]: { color: 0x9cb8ff, burstTint: 0xa9beff, label: 'SPREAD' },
  [PICKUP_KIND.HOMING]: { color: 0x84ffc8, burstTint: 0x88ffd8, label: 'HOMING' },
  [PICKUP_KIND.PIERCE]: { color: 0xffcc8a, burstTint: 0xffd28e, label: 'PIERCE' },
  [PICKUP_KIND.BOOMERANG]: { color: 0xd8abff, burstTint: 0xd3b7ff, label: 'BOOMERANG' },
  [PICKUP_KIND.ULTIMATE]: { color: 0xffda8f, burstTint: 0xffdc8f, label: 'ULTIMATE +34' }
}

const RANDOM_PICKUP_WEIGHTS = [
  { kind: PICKUP_KIND.FIRE, weight: 24 },
  { kind: PICKUP_KIND.SHIELD, weight: 14 },
  { kind: PICKUP_KIND.LASER, weight: 11 },
  { kind: PICKUP_KIND.SPREAD, weight: 10 },
  { kind: PICKUP_KIND.HOMING, weight: 9 },
  { kind: PICKUP_KIND.PIERCE, weight: 9 },
  { kind: PICKUP_KIND.BOOMERANG, weight: 9 },
  { kind: PICKUP_KIND.ULTIMATE, weight: 14 }
]

const EARTH_WAVE_CONFIGS = [
  {
    name: 'Sector A',
    duration: 18,
    spawnDelay: 620,
    fireDelay: 900,
    weights: { scout: 50, striker: 25, tank: 8, swarm: 10, charger: 4, sniper: 2, guard: 1 },
    speedScale: 1
  },
  {
    name: 'Sector B',
    duration: 20,
    spawnDelay: 530,
    fireDelay: 780,
    weights: { scout: 36, striker: 24, tank: 14, swarm: 11, charger: 6, sniper: 5, guard: 3, ufoElite: 1 },
    speedScale: 1.14
  },
  {
    name: 'Sector C',
    duration: 22,
    spawnDelay: 460,
    fireDelay: 700,
    weights: { scout: 24, striker: 22, tank: 18, swarm: 10, charger: 9, sniper: 8, guard: 6, ufoElite: 3 },
    speedScale: 1.24
  }
]

const MOON_WAVE_CONFIGS = [
  {
    name: 'Mare A',
    duration: 20,
    spawnDelay: 560,
    fireDelay: 820,
    weights: { scout: 20, striker: 22, tank: 16, swarm: 8, charger: 16, sniper: 12, guard: 4, ufoElite: 2 },
    speedScale: 1.15
  },
  {
    name: 'Mare B',
    duration: 22,
    spawnDelay: 470,
    fireDelay: 680,
    weights: { scout: 14, striker: 18, tank: 18, swarm: 6, charger: 14, sniper: 14, guard: 10, ufoElite: 6 },
    speedScale: 1.3
  },
  {
    name: 'Mare C',
    duration: 24,
    spawnDelay: 380,
    fireDelay: 580,
    weights: { scout: 10, striker: 14, tank: 16, swarm: 8, charger: 14, sniper: 14, guard: 15, ufoElite: 9 },
    speedScale: 1.45
  }
]

const STAGE_CONFIGS = [
  {
    id: 'earth',
    name: 'Earth Orbit',
    waves: EARTH_WAVE_CONFIGS,
    hasMidBoss: true,
    midBossHp: 170,
    midBossLabel: 'Assault Carrier',
    bossHp: 320,
    bossLabel: 'Command Dreadnought',
    bossTint: 0xffceb5,
    bossScale: 1.72,
    bossShootCooldown: 360,
    bgMode: 'earth'
  },
  {
    id: 'moon',
    name: 'Lunar Approach',
    waves: MOON_WAVE_CONFIGS,
    hasMidBoss: false,
    bossHp: 480,
    bossLabel: 'Lunar Fortress',
    bossTint: 0xc0d8ff,
    bossScale: 1.85,
    bossShootCooldown: 300,
    bgMode: 'moon'
  }
]

const DEBUG_PARAMS = (() => {
  try {
    const params = new URLSearchParams(window.location.search)
    return {
      startStage: parseInt(params.get('stage'), 10) || 0,
      godMode: params.has('god')
    }
  } catch (e) { return { startStage: 0, godMode: false } }
})()

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/37d80bce-582f-43d7-887b-668ec130d0ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'startup-debug',hypothesisId:'H3',location:'GameScene.js:create-enter',message:'GameScene create entered',data:{hasPlayerTexture:this.textures.exists('player'),hasEnemyTexture:this.textures.exists('enemy'),hasBgTile:this.textures.exists('bgTile')},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
    this.score = 0
    this.lives = DEBUG_PARAMS.godMode ? 999 : 3
    this.maxLives = 6
    this.scrollSpeed = 130
    this.isGameOver = false
    this.gameCleared = false
    this.invulnerableUntil = 0
    this.levelSeconds = 0
    this.lastBossShotAt = 0
    this.bossDefeatedCount = 0
    this.phase = 'wave'
    this.weaponModeDurationMs = 10000
    this.ultimateCharge = 0
    this.ultimateChargeMax = 100
    this.ultimateBossDamageRatio = 0.14
    this.audio = new SynthAudio()
    this.audioMuted = false
    this.hitStopLock = false
    this.music = {
      stage: null,
      boss: null,
      current: null,
      currentKey: null
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.audio) {
        this.audio.destroy()
      }
      this.destroyMusic()
    })

    this.stageIndex = DEBUG_PARAMS.startStage
    const stage = this.getActiveStage()
    this.waveConfigs = stage.waves
    this.waveIndex = 0
    this.waveRemaining = this.waveConfigs[this.waveIndex].duration

    if (stage.bgMode === 'moon') {
      this.createMoonBackground()
    } else {
      this.createEarthBackground(EARTH_BACKGROUND_SCHEME_KEY)
      this.applyEarthSectorLook(this.waveIndex)
    }

    this.player = new Player(this, GAME_WIDTH / 2, GAME_HEIGHT - 120)
    this.player.setDepth(2)
    this.player.engineTrailAt = 0

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
    this.inputKeys = this.input.keyboard.addKeys({
      mute: Phaser.Input.Keyboard.KeyCodes.M,
      ultimate: Phaser.Input.Keyboard.KeyCodes.SPACE
    })
    this.debugPointerLogAt = 0
    this.debugUpdateLogAt = 0
    this.debugInputConflictLogAt = 0

    this.input.once('pointerdown', () => {
      this.startAudio()
    })
    this.input.keyboard.once('keydown', () => {
      this.startAudio()
    })

    this.input.on('pointermove', (pointer) => {
      if (!pointer.isDown || !this.player.isAlive) return
      const prevX = this.player.x
      const prevY = this.player.y
      this.player.x = Phaser.Math.Clamp(pointer.x, 34, GAME_WIDTH - 34)
      this.player.y = Phaser.Math.Clamp(pointer.y, 30, GAME_HEIGHT - 30)
      if (this.time.now >= this.debugPointerLogAt) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/37d80bce-582f-43d7-887b-668ec130d0ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'pre-fix',hypothesisId:'H1',location:'GameScene.js:pointermove',message:'Pointer movement applies direct position',data:{prevX,prevY,nextX:this.player.x,nextY:this.player.y,pointerX:pointer.x,pointerY:pointer.y,jumpDist:Math.hypot(this.player.x-prevX,this.player.y-prevY),vx:this.player.body?.velocity?.x||0,vy:this.player.body?.velocity?.y||0},timestamp:Date.now()})}).catch(()=>{})
        // #endregion
        this.debugPointerLogAt = this.time.now + 220
      }
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
    this.setupMusic()

    this.events.emit('score-changed', this.score)
    this.events.emit('lives-changed', this.lives)
    this.events.emit('fire-changed', this.player.fireLevel)
    this.events.emit('weapon-mode-changed', WEAPON_MODES.NORMAL, 0)
    this.events.emit('shield-changed', 0)
    this.events.emit('ultimate-changed', this.ultimateCharge, this.ultimateChargeMax)
    this.events.emit('boss-hp-changed', null)
    this.events.emit('stage-changed', `${this.waveConfigs[this.waveIndex].name} - ${this.waveRemaining}s`)
    this.events.emit('audio-changed', this.audioMuted)
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/37d80bce-582f-43d7-887b-668ec130d0ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'startup-debug',hypothesisId:'H3',location:'GameScene.js:create-exit',message:'GameScene create completed',data:{phase:this.phase,uiActive:this.scene.isActive('UIScene'),enemySpawnDelay:this.enemySpawnEvent?.delay ?? null},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
  }

  update(time, delta) {
    this.updateBackgroundLayers(delta)
    this.levelSeconds += delta / 1000

    if (this.isGameOver || this.gameCleared) return
    if (this.phase === 'warning' || this.phase === 'stage-clear') {
      this.player.setVelocity(0, 0)
      return
    }

    this.handleAudioInput()
    this.handleUltimateInput()
    const keyboardIntent =
      this.cursors.left.isDown ||
      this.cursors.right.isDown ||
      this.cursors.up.isDown ||
      this.cursors.down.isDown ||
      this.wasd.left.isDown ||
      this.wasd.right.isDown ||
      this.wasd.up.isDown ||
      this.wasd.down.isDown
    if (time >= this.debugUpdateLogAt && this.player?.active) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/37d80bce-582f-43d7-887b-668ec130d0ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'pre-fix',hypothesisId:'H2',location:'GameScene.js:update',message:'Movement sample before player.update',data:{x:this.player.x,y:this.player.y,vx:this.player.body?.velocity?.x||0,vy:this.player.body?.velocity?.y||0,speed:Math.hypot(this.player.body?.velocity?.x||0,this.player.body?.velocity?.y||0),keyboardIntent,pointerDown:this.input.activePointer?.isDown||false},timestamp:Date.now()})}).catch(()=>{})
      // #endregion
      this.debugUpdateLogAt = time + 220
    }
    if (keyboardIntent && this.input.activePointer?.isDown && time >= this.debugInputConflictLogAt) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/37d80bce-582f-43d7-887b-668ec130d0ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'pre-fix',hypothesisId:'H4',location:'GameScene.js:update',message:'Keyboard and pointer active simultaneously',data:{x:this.player.x,y:this.player.y,vx:this.player.body?.velocity?.x||0,vy:this.player.body?.velocity?.y||0,pointerX:this.input.activePointer.x,pointerY:this.input.activePointer.y},timestamp:Date.now()})}).catch(()=>{})
      // #endregion
      this.debugInputConflictLogAt = time + 300
    }
    this.player.update(this.cursors, this.wasd)
    this.updatePlayerEngineTrail(time)
    const fired = this.player.tryFire(time, this.playerBullets)
    if (fired) this.audio.playShoot()
    this.updatePlayerBullets(time, delta)
    this.updatePickups(time)

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

    const currentMode = this.player.getCurrentWeaponMode(time)
    const modeRemainSec =
      currentMode === WEAPON_MODES.NORMAL ? 0 : Math.max(0, Math.ceil((this.player.weaponModeUntil - time) / 1000))
    this.events.emit('weapon-mode-changed', currentMode, modeRemainSec)
    this.events.emit('ultimate-changed', this.ultimateCharge, this.ultimateChargeMax)
  }

  createEarthBackground(schemeKey) {
    const useSectorTextures = this.hasSectorTextures()
    if (useSectorTextures) {
      this.createSectorBackground()
      return
    }

    const scheme = EARTH_BACKGROUND_SCHEMES[schemeKey] || EARTH_BACKGROUND_SCHEMES.A
    const rawBaseKey = this.resolveBackgroundTextureKey(scheme.base, scheme.baseFallback)
    const baseKey = this.prepareSeamlessTextureForScheme(schemeKey, rawBaseKey)
    const planetKey = this.resolveBackgroundTextureKey(scheme.planet, scheme.planetFallback)
    const overlayKey = this.resolveBackgroundTextureKey(scheme.overlay, scheme.overlayFallback)
    const hasEarthTextures = Boolean(baseKey && planetKey && overlayKey)
    const isBasePlanetSameAssetFamily =
      hasEarthTextures &&
      (baseKey === planetKey || baseKey === `${planetKey}_seamlessY` || planetKey === `${baseKey}_seamlessY`)

    const dustTextureKey = hasEarthTextures && schemeKey === 'USER' ? 'bgTile' : hasEarthTextures ? baseKey : 'bgTile'

    this.background = this.add
      .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, hasEarthTextures ? baseKey : 'bgTile')
      .setDepth(0)

    const enablePlanetLayer = hasEarthTextures && !isBasePlanetSameAssetFamily

    this.backgroundPlanet = enablePlanetLayer
      ? this.add
          .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, planetKey)
          .setDepth(0.2)
          .setAlpha(scheme.planetAlpha)
      : null
    if (this.backgroundPlanet) {
      this.backgroundPlanet.tilePositionY = scheme.planetOffsetY || 0
      this.backgroundPlanet.tilePositionX = scheme.planetOffsetX || 0
    }

    this.backgroundDust = this.add
      .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, dustTextureKey)
      .setDepth(0.4)
      .setAlpha(scheme.dustAlpha ?? 0.3)
      .setTint(hasEarthTextures ? scheme.dustTint : 0x6ca9e8)

    this.backgroundOverlay = hasEarthTextures
      ? this.add
          .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, overlayKey)
          .setDepth(0.5)
          .setAlpha(scheme.overlayAlpha)
      : null

    if (schemeKey === 'USER' && hasEarthTextures) {
      const source = this.textures.get(baseKey)?.source?.[0]
      const sourceWidth = source?.width || GAME_WIDTH
      const fitScaleX = GAME_WIDTH / sourceWidth
      this.background.setTileScale(fitScaleX, fitScaleX)
      this.backgroundDust.setTileScale(fitScaleX, fitScaleX)
      if (this.backgroundPlanet) this.backgroundPlanet.setTileScale(fitScaleX, fitScaleX)
    }

    this.backgroundScheme = {
      key: schemeKey,
      hasEarthTextures,
      planetSpeed: scheme.planetSpeed,
      overlaySpeed: scheme.overlaySpeed,
      planetAlpha: scheme.planetAlpha,
      overlayAlpha: scheme.overlayAlpha,
      planetXDrift: scheme.planetXDrift ?? 0.02,
      overlayXDrift: scheme.overlayXDrift ?? 0.05,
      dustXDrift: scheme.dustXDrift ?? 0.08
    }
    this.backgroundPlanetBaseAlpha = scheme.planetAlpha
    this.backgroundOverlayBaseAlpha = scheme.overlayAlpha
  }

  hasSectorTextures() {
    const textures = this.activeSectorTextures || SECTOR_TEXTURES
    const first = textures[0]
    return first && this.textures.exists(first.base)
  }

  computeTileScale(textureKey) {
    const src = this.textures.get(textureKey)?.source?.[0]
    const w = src?.width || GAME_WIDTH
    const s = GAME_WIDTH / w
    return s
  }

  createSectorBackground() {
    const sec = SECTOR_TEXTURES[0]
    const baseKey = sec.base
    const overlayKey = this.textures.exists(SECTOR_OVERLAY) ? SECTOR_OVERLAY : null
    const scale = this.computeTileScale(baseKey)

    this.background = this.add
      .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, baseKey)
      .setDepth(0)
    this.background.setTileScale(scale, scale)

    this.backgroundBaseNext = this.add
      .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, baseKey)
      .setDepth(0.05)
      .setAlpha(0)
    this.backgroundBaseNext.setTileScale(scale, scale)

    this.backgroundPlanet = null
    this.backgroundPlanetNext = null

    this.backgroundDust = this.add
      .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'bgTile')
      .setDepth(0.4)
      .setAlpha(0.08)
      .setTint(0xc7dff2)

    if (overlayKey) {
      this.cloudShadow = this.add
        .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, overlayKey)
        .setDepth(0.3)
        .setAlpha(0.4)
        .setBlendMode(Phaser.BlendModes.MULTIPLY)
      this.cloudShadow.setTileScale(scale * 1.6, scale * 1.6)

      this.backgroundOverlay = this.add
        .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, overlayKey)
        .setDepth(0.5)
        .setAlpha(0.6)
        .setBlendMode(Phaser.BlendModes.SCREEN)
      this.backgroundOverlay.setTileScale(scale * 1.6, scale * 1.6)

      this.backgroundOverlay2 = this.add
        .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, overlayKey)
        .setDepth(0.52)
        .setAlpha(0.3)
        .setBlendMode(Phaser.BlendModes.SCREEN)
      this.backgroundOverlay2.setTileScale(scale * 2.8, scale * 2.8)
      this.backgroundOverlay2.tilePositionX = 300
      this.backgroundOverlay2.tilePositionY = 400
      this.backgroundOverlay2.setFlipX(true)
    } else {
      this.cloudShadow = null
      this.backgroundOverlay = null
      this.backgroundOverlay2 = null
    }

    this.backgroundScheme = {
      key: 'SECTOR',
      hasEarthTextures: true,
      planetSpeed: 0.74,
      overlaySpeed: 1.05,
      planetAlpha: 0,
      overlayAlpha: 0.7,
      planetXDrift: 0,
      overlayXDrift: 0.04,
      dustXDrift: 0.06
    }
    this.backgroundPlanetBaseAlpha = 0
    this.backgroundOverlayBaseAlpha = 0.7
    this.currentSectorIndex = 0
    this.sectorCrossfade = null
    this.activeSectorTextures = SECTOR_TEXTURES
  }

  transitionToSector(sectorIndex) {
    if (!this.hasSectorTextures()) return
    if (sectorIndex === this.currentSectorIndex) return
    const textures = this.activeSectorTextures || SECTOR_TEXTURES
    const clamped = Math.min(sectorIndex, textures.length - 1)
    const sec = textures[clamped]
    if (!sec || !this.textures.exists(sec.base)) return

    const scale = this.computeTileScale(sec.base)

    if (this.backgroundBaseNext) {
      this.backgroundBaseNext.setTexture(sec.base)
      this.backgroundBaseNext.setTileScale(scale, scale)
      this.backgroundBaseNext.tilePositionY = this.background.tilePositionY
      this.backgroundBaseNext.tilePositionX = this.background.tilePositionX
      this.backgroundBaseNext.setAlpha(0)
    }

    this.sectorCrossfade = {
      targetIndex: clamped,
      elapsed: 0,
      duration: SECTOR_CROSSFADE_MS,
      scale
    }
  }

  updateSectorCrossfade(delta) {
    if (!this.sectorCrossfade) return
    const cf = this.sectorCrossfade
    cf.elapsed += delta
    const t = Math.min(cf.elapsed / cf.duration, 1)
    const ease = t * t * (3 - 2 * t)

    if (this.backgroundBaseNext) this.backgroundBaseNext.setAlpha(ease)

    if (t >= 1) {
      const sec = (this.activeSectorTextures || SECTOR_TEXTURES)[cf.targetIndex]
      this.background.setTexture(sec.base)
      this.background.setTileScale(cf.scale, cf.scale)
      this.background.tilePositionY = this.backgroundBaseNext.tilePositionY
      this.background.tilePositionX = this.backgroundBaseNext.tilePositionX
      if (this.backgroundBaseNext) this.backgroundBaseNext.setAlpha(0)

      this.currentSectorIndex = cf.targetIndex
      this.sectorCrossfade = null
    }
  }

  resolveBackgroundTextureKey(primaryKey, fallbackKey) {
    if (primaryKey && this.textures.exists(primaryKey)) return primaryKey
    if (fallbackKey && this.textures.exists(fallbackKey)) return fallbackKey
    return null
  }

  prepareSeamlessTextureForScheme(schemeKey, sourceKey) {
    if (!sourceKey || !this.textures.exists(sourceKey)) return sourceKey
    if (schemeKey !== 'USER') return sourceKey

    const seamlessKey = `${sourceKey}_seamlessY`
    if (this.textures.exists(seamlessKey)) return seamlessKey

    const sourceTexture = this.textures.get(sourceKey)
    const sourceImage = sourceTexture?.getSourceImage()
    if (!sourceImage?.width || !sourceImage?.height) return sourceKey

    const width = sourceImage.width
    const height = sourceImage.height
    const band = Math.max(24, Math.floor(height * 0.08))
    const canvasTexture = this.textures.createCanvas(seamlessKey, width, height)
    if (!canvasTexture) return sourceKey
    const ctx = canvasTexture.getContext()
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(sourceImage, 0, 0, width, height)

    // Blend bottom rows into top edge.
    for (let i = 0; i < band; i += 1) {
      ctx.globalAlpha = (i + 1) / band
      ctx.drawImage(sourceImage, 0, height - band + i, width, 1, 0, i, width, 1)
    }
    // Blend top rows into bottom edge.
    for (let i = 0; i < band; i += 1) {
      ctx.globalAlpha = 1 - i / band
      ctx.drawImage(sourceImage, 0, i, width, 1, 0, height - band + i, width, 1)
    }
    ctx.globalAlpha = 1
    canvasTexture.refresh()
    return seamlessKey
  }

  measureVerticalSeamMismatch(textureKey) {
    if (!textureKey || !this.textures.exists(textureKey)) return null
    const img = this.textures.get(textureKey)?.getSourceImage()
    if (!img?.width || !img?.height) return null

    const sampleCanvas = document.createElement('canvas')
    sampleCanvas.width = img.width
    sampleCanvas.height = img.height
    const ctx = sampleCanvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(img, 0, 0)

    const top = ctx.getImageData(0, 0, img.width, 1).data
    const bottom = ctx.getImageData(0, img.height - 1, img.width, 1).data
    let diffSum = 0
    for (let i = 0; i < top.length; i += 4) {
      diffSum += Math.abs(top[i] - bottom[i])
      diffSum += Math.abs(top[i + 1] - bottom[i + 1])
      diffSum += Math.abs(top[i + 2] - bottom[i + 2])
    }
    return Number((diffSum / (img.width * 3)).toFixed(2))
  }

  applyEarthSectorLook(waveIndex) {
    if (!this.backgroundScheme?.hasEarthTextures) return

    if (this.hasSectorTextures()) {
      this.transitionToSector(waveIndex)
      return
    }

    const factor = EARTH_SECTOR_FACTORS[Math.min(waveIndex, EARTH_SECTOR_FACTORS.length - 1)]
    this.backgroundPlanetBaseAlpha = this.backgroundScheme.planetAlpha * factor.planet
    this.backgroundOverlayBaseAlpha = this.backgroundScheme.overlayAlpha * factor.overlay
    if (this.backgroundPlanet) this.backgroundPlanet.setAlpha(this.backgroundPlanetBaseAlpha)
    if (this.backgroundOverlay) this.backgroundOverlay.setAlpha(this.backgroundOverlayBaseAlpha)
  }

  updateBackgroundLayers(delta) {
    const baseScrollY = (this.scrollSpeed * delta) / 1000
    this.background.tilePositionY -= baseScrollY
    this.backgroundDust.tilePositionY -= (this.scrollSpeed * 0.55 * delta) / 1000
    this.backgroundDust.tilePositionX += (this.scrollSpeed * this.backgroundScheme.dustXDrift * delta) / 1000

    if (this.backgroundBaseNext && this.sectorCrossfade) {
      this.backgroundBaseNext.tilePositionY -= baseScrollY
    }

    if (!this.backgroundScheme?.hasEarthTextures) return

    if (this.backgroundPlanet) {
      this.backgroundPlanet.tilePositionY -= (this.scrollSpeed * this.backgroundScheme.planetSpeed * delta) / 1000
      this.backgroundPlanet.tilePositionX += (this.scrollSpeed * this.backgroundScheme.planetXDrift * delta) / 1000
    }
    if (this.backgroundPlanetNext && this.sectorCrossfade) {
      this.backgroundPlanetNext.tilePositionY -= (this.scrollSpeed * this.backgroundScheme.planetSpeed * delta) / 1000
      this.backgroundPlanetNext.tilePositionX += (this.scrollSpeed * this.backgroundScheme.planetXDrift * delta) / 1000
    }

    if (this.cloudShadow) {
      this.cloudShadow.tilePositionY -= (this.scrollSpeed * 1.1 * delta) / 1000
      this.cloudShadow.tilePositionX += (this.scrollSpeed * 0.04 * delta) / 1000
    }
    if (this.backgroundOverlay) {
      this.backgroundOverlay.tilePositionY -= (this.scrollSpeed * 1.12 * delta) / 1000
      this.backgroundOverlay.tilePositionX += (this.scrollSpeed * 0.04 * delta) / 1000
      const warningAlphaMul = this.phase === 'warning' ? 0.52 : 1
      this.backgroundOverlay.setAlpha(this.backgroundOverlayBaseAlpha * warningAlphaMul)
    }
    if (this.backgroundOverlay2) {
      this.backgroundOverlay2.tilePositionY -= (this.scrollSpeed * 0.55 * delta) / 1000
      this.backgroundOverlay2.tilePositionX -= (this.scrollSpeed * 0.02 * delta) / 1000
    }

    this.updateSectorCrossfade(delta)

    if (!this.bgDebugFirstFrameLogged) {
      this.bgDebugFirstFrameLogged = true
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/37d80bce-582f-43d7-887b-668ec130d0ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'pre-fix',hypothesisId:'H2-H3',location:'GameScene.js:updateBackgroundLayers:first-frame',message:'Background tile positions first frame',data:{base:{x:this.background?.tilePositionX||0,y:this.background?.tilePositionY||0},dust:{x:this.backgroundDust?.tilePositionX||0,y:this.backgroundDust?.tilePositionY||0},planet:this.backgroundPlanet?{x:this.backgroundPlanet.tilePositionX,y:this.backgroundPlanet.tilePositionY}:null,overlay:this.backgroundOverlay?{x:this.backgroundOverlay.tilePositionX,y:this.backgroundOverlay.tilePositionY}:null,phase:this.phase},timestamp:Date.now()})}).catch(()=>{})
      // #endregion
    }
    this.bgDebugFrameCount = (this.bgDebugFrameCount || 0) + 1
    if (this.bgDebugFrameCount === 120) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/37d80bce-582f-43d7-887b-668ec130d0ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'pre-fix',hypothesisId:'H2-H3',location:'GameScene.js:updateBackgroundLayers:frame-120',message:'Background tile positions after scrolling',data:{base:{x:this.background?.tilePositionX||0,y:this.background?.tilePositionY||0},dust:{x:this.backgroundDust?.tilePositionX||0,y:this.backgroundDust?.tilePositionY||0},planet:this.backgroundPlanet?{x:this.backgroundPlanet.tilePositionX,y:this.backgroundPlanet.tilePositionY}:null,overlay:this.backgroundOverlay?{x:this.backgroundOverlay.tilePositionX,y:this.backgroundOverlay.tilePositionY}:null,phase:this.phase},timestamp:Date.now()})}).catch(()=>{})
      // #endregion
    }
  }

  startAudio() {
    this.audio.unlock()
    this.startStageMusic()
  }

  setupMusic() {
    if (this.cache.audio.exists('bgmStage')) {
      this.music.stage = this.sound.add('bgmStage', { loop: true, volume: 0 })
    }
    if (this.cache.audio.exists('bgmBoss')) {
      this.music.boss = this.sound.add('bgmBoss', { loop: true, volume: 0 })
    }
  }

  getMusicVolume(trackKey) {
    if (this.audioMuted) return 0
    return trackKey === 'boss' ? 0.52 : 0.45
  }

  switchMusic(trackKey) {
    const next = this.music[trackKey]
    if (!next) return
    if (this.music.current === next) {
      next.setVolume(this.getMusicVolume(trackKey))
      return
    }

    if (!next.isPlaying) {
      next.play({ loop: true, volume: 0 })
    }

    this.tweens.add({
      targets: next,
      volume: this.getMusicVolume(trackKey),
      duration: 320,
      ease: 'Sine.out'
    })

    if (this.music.current && this.music.current.isPlaying) {
      const prev = this.music.current
      this.tweens.add({
        targets: prev,
        volume: 0,
        duration: 280,
        ease: 'Sine.in',
        onComplete: () => {
          if (prev.isPlaying) prev.stop()
        }
      })
    }

    this.music.current = next
    this.music.currentKey = trackKey
  }

  startStageMusic() {
    this.switchMusic('stage')
  }

  startBossMusic() {
    if (this.music.boss) {
      this.switchMusic('boss')
    }
  }

  handleAudioInput() {
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.mute)) {
      this.audioMuted = !this.audioMuted
      this.audio.setMuted(this.audioMuted)
      if (this.music.current && this.music.current.isPlaying) {
        this.music.current.setVolume(this.getMusicVolume(this.music.currentKey))
      }
      this.events.emit('audio-changed', this.audioMuted)
    }
  }

  handleUltimateInput() {
    if (!Phaser.Input.Keyboard.JustDown(this.inputKeys.ultimate)) return
    this.triggerUltimate()
  }

  addUltimateCharge(amount) {
    this.ultimateCharge = Phaser.Math.Clamp(this.ultimateCharge + amount, 0, this.ultimateChargeMax)
  }

  getNearestHostile(fromX, fromY) {
    let nearest = null
    let minDistSq = Number.POSITIVE_INFINITY
    const candidates = [...this.enemies.getChildren(), ...this.bosses.getChildren()]
    candidates.forEach((target) => {
      if (!target?.active) return
      const dx = target.x - fromX
      const dy = target.y - fromY
      const distSq = dx * dx + dy * dy
      if (distSq < minDistSq) {
        minDistSq = distSq
        nearest = target
      }
    })
    return nearest
  }

  updatePlayerBullets(time, delta) {
    const dt = delta / 1000
    this.playerBullets.children.iterate((bullet) => {
      if (!bullet?.active) return
      if (bullet.kind === 'homing') {
        const target = this.getNearestHostile(bullet.x, bullet.y)
        if (target) {
          const toTarget = new Phaser.Math.Vector2(target.x - bullet.x, target.y - bullet.y)
          if (toTarget.lengthSq() > 0.0001) {
            toTarget.normalize()
            const speed = Math.max(520, bullet.body.speed)
            const desiredVx = toTarget.x * speed
            const desiredVy = toTarget.y * speed
            const steer = Phaser.Math.Clamp(8 * dt, 0, 1)
            bullet.body.velocity.x = Phaser.Math.Linear(bullet.body.velocity.x, desiredVx, steer)
            bullet.body.velocity.y = Phaser.Math.Linear(bullet.body.velocity.y, desiredVy, steer)
          }
        }
      } else if (bullet.kind === 'boomerang') {
        const ageMs = time - (bullet.spawnedAt || time)
        if (!bullet.returning && ageMs > 420) {
          bullet.returning = true
        }
        if (bullet.returning) {
          const toPlayer = new Phaser.Math.Vector2(this.player.x - bullet.x, this.player.y - bullet.y)
          if (toPlayer.lengthSq() < 20 * 20) {
            bullet.disableBody(true, true)
            return
          }
          toPlayer.normalize()
          bullet.body.setVelocity(toPlayer.x * 500, toPlayer.y * 500)
        }
        bullet.rotation += 0.35
      }
    })
  }

  updatePickups(time) {
    this.pickups.children.iterate((pickup) => {
      if (!pickup?.active) return
      const seed = pickup.pulseSeed || 0
      const pulse = 0.92 + Math.sin((time + seed) * 0.01) * 0.09
      pickup.setScale(pulse)
      pickup.setAngle((time * 0.08 + seed) % 360)
    })
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
    if (this.phase !== 'wave' || this.isGameOver || this.gameCleared) return

    this.waveRemaining -= 1
    const cfg = this.waveConfigs[this.waveIndex]
    this.events.emit('stage-changed', `${cfg.name} - ${Math.max(0, this.waveRemaining)}s`)

    if (this.waveRemaining > 0) return

    if (this.waveIndex < this.waveConfigs.length - 1) {
      this.waveIndex += 1
      this.waveRemaining = this.waveConfigs[this.waveIndex].duration
      this.applyWaveConfig(this.waveConfigs[this.waveIndex])
      this.applyEarthSectorLook(this.waveIndex)
      const nextCfg = this.waveConfigs[this.waveIndex]
      this.events.emit('stage-changed', `${nextCfg.name} - ${this.waveRemaining}s`)
      return
    }

    this.enemySpawnEvent.paused = true
    this.enemyFireEvent.paused = true
    this.waveTickEvent.paused = true
    this.clearAllEnemyBullets()
    this.clearEnemiesAndPickups()

    const activeStage = this.getActiveStage()
    if (activeStage.hasMidBoss) {
      this.phase = 'midboss-ready'
      this.time.delayedCall(300, () => this.startMidBossStage())
    } else {
      this.phase = 'final-ready'
      this.time.delayedCall(300, () => this.startFinalBossStage())
    }
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

    const enemy = this.enemies.get(Phaser.Math.Between(32, GAME_WIDTH - 32), -50, 'enemy')
    if (!enemy) return

    const waveConfig = this.waveConfigs[this.waveIndex]
    const type = this.rollEnemyType(waveConfig.weights)
    const config = ENEMY_CONFIG[type] || ENEMY_CONFIG.scout
    const speedScale = waveConfig.speedScale
    const ySpeed = (config.minYSpeed + Math.min(this.levelSeconds * config.levelSpeedGain, config.levelSpeedCap)) * speedScale

    enemy.setActive(true).setVisible(true)
    enemy.body.enable = true
    enemy.setDepth(2)
    enemy.type = type
    enemy.waveSeed = Phaser.Math.FloatBetween(0, Math.PI * 2)
    enemy.setTexture(config.textureKey)
    enemy.setAngle(180)
    enemy.baseScale = config.baseScale
    enemy.setScale(enemy.baseScale)
    enemy.baseTint = config.baseTint
    enemy.setTint(enemy.baseTint)
    enemy.hp = config.hp
    enemy.scoreValue = config.scoreValue
    enemy.dropRate = config.dropRate
    enemy.flightMode = config.flightMode
    enemy.turnRate = config.turnRate || 0
    enemy.maxVx = config.maxVx || 0
    enemy.body.setVelocityY(ySpeed)

    if (type === 'scout') {
      enemy.nextManeuverAt = this.time.now + Phaser.Math.Between(700, 1100)
      enemy.maneuverBias = 0
    } else if (type === 'striker') {
      enemy.laneX = Phaser.Math.Snap.To(enemy.x, 80, 40)
      enemy.nextLaneShiftAt = this.time.now + Phaser.Math.Between(1200, 2000)
    } else if (type === 'sniper') {
      enemy.standoffY = Phaser.Math.Between(120, 240)
      enemy.aimX = enemy.x
      enemy.nextAimShiftAt = this.time.now + Phaser.Math.Between(900, 1500)
    } else if (type === 'swarm') {
      enemy.swarmPhase = Phaser.Math.FloatBetween(0, Math.PI * 2)
    } else if (type === 'charger') {
      enemy.chargeState = 'seek'
      enemy.chargeTargetX = this.player.x
      enemy.nextChargeAt = this.time.now + Phaser.Math.Between(1700, 2600)
      enemy.chargeTelegraphUntil = 0
      enemy.chargeEndAt = 0
    } else if (type === 'guard') {
      enemy.guardPhase = Phaser.Math.FloatBetween(0, Math.PI * 2)
      enemy.guardAnchorX = enemy.x
      enemy.nextGuardShiftAt = this.time.now + Phaser.Math.Between(850, 1500)
    } else if (type === 'ufoElite') {
      enemy.ufoFreq = Phaser.Math.FloatBetween(0.0028, 0.0042)
    }
    enemy.body.setSize(
      enemy.width * (config.hitboxScaleX || 0.48),
      enemy.height * (config.hitboxScaleY || 0.52),
      true
    )

    enemy.engineTrailAt = 0
  }

  rollEnemyType(weights) {
    const entries = Object.entries(weights).filter(([, weight]) => weight > 0)
    if (entries.length === 0) return 'scout'
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
    const roll = Phaser.Math.Between(1, total)
    let current = 0
    for (const [type, weight] of entries) {
      current += weight
      if (roll <= current) return type
    }
    return entries[entries.length - 1][0]
  }

  enemyFire() {
    if (this.isGameOver || this.gameCleared || this.phase !== 'wave') return

    const livingEnemies = this.enemies
      .getChildren()
      .filter((enemy) => enemy.active && ENEMY_SHOT_CONFIG[enemy.type])
    if (livingEnemies.length === 0) return

    const shooter = Phaser.Utils.Array.GetRandom(livingEnemies)
    const shotConfig = ENEMY_SHOT_CONFIG[shooter.type]
    const shotCount = shotConfig.count || 1

    for (let i = 0; i < shotCount; i += 1) {
      const bullet = this.enemyBullets.get(shooter.x, shooter.y + 20, 'enemyBullet')
      if (!bullet) return
      bullet.setActive(true).setVisible(true)
      bullet.body.enable = true
      const center = (shotCount - 1) / 2
      const offset = (i - center) * (shotConfig.spread || 0)

      if (shotConfig.mode === 'aimed') {
        const toPlayer = new Phaser.Math.Vector2(this.player.x - shooter.x, this.player.y - shooter.y)
        if (toPlayer.lengthSq() < 0.0001) {
          toPlayer.set(0, 1)
        } else {
          toPlayer.normalize()
        }
        const side = new Phaser.Math.Vector2(-toPlayer.y, toPlayer.x)
        bullet.body.setVelocity(
          toPlayer.x * shotConfig.speed + side.x * offset,
          toPlayer.y * shotConfig.speed + side.y * offset
        )
      } else {
        bullet.body.setVelocity(offset, shotConfig.speed)
      }

      bullet.setScale(shotConfig.bulletScale || 0.95)
      const [hitW, hitH] = shotConfig.bulletSize || [8, 30]
      bullet.body.setSize(hitW, hitH)
      bullet.setTint(shotConfig.tint || ENEMY_THEME.common)
      bullet.setDepth(2)
    }
  }

  updateEnemies(time) {
    this.enemies.children.iterate((enemy) => {
      if (!enemy || !enemy.active) return

      if (enemy.type === 'scout') {
        if (time >= (enemy.nextManeuverAt || 0)) {
          const towardPlayer = this.player.x - enemy.x
          enemy.maneuverBias = Phaser.Math.Clamp(towardPlayer * 0.35, -120, 120)
          enemy.nextManeuverAt = time + Phaser.Math.Between(700, 1100)
        }
        const desiredVx = Phaser.Math.Clamp(enemy.maneuverBias || 0, -(enemy.maxVx || 160), enemy.maxVx || 160)
        const smoothed = Phaser.Math.Linear(enemy.body.velocity.x, desiredVx, enemy.turnRate || 0.04)
        enemy.body.setVelocityX(smoothed)
      } else if (enemy.type === 'striker') {
        if (time >= (enemy.nextLaneShiftAt || 0)) {
          const snappedPlayerLane = Phaser.Math.Snap.To(this.player.x, 80, 40)
          const fallbackLane = Phaser.Math.Between(1, 5) * 80 - 40
          enemy.laneX = Phaser.Math.Between(0, 100) < 65 ? snappedPlayerLane : fallbackLane
          enemy.laneX = Phaser.Math.Clamp(enemy.laneX, 40, GAME_WIDTH - 40)
          enemy.nextLaneShiftAt = time + Phaser.Math.Between(1200, 2000)
        }
        const desiredVx = Phaser.Math.Clamp((enemy.laneX - enemy.x) * 2.2, -(enemy.maxVx || 100), enemy.maxVx || 100)
        const smoothed = Phaser.Math.Linear(enemy.body.velocity.x, desiredVx, enemy.turnRate || 0.03)
        enemy.body.setVelocityX(smoothed)
      } else if (enemy.type === 'sniper') {
        if (time >= (enemy.nextAimShiftAt || 0)) {
          enemy.aimX = Phaser.Math.Clamp(this.player.x + Phaser.Math.Between(-90, 90), 40, GAME_WIDTH - 40)
          enemy.nextAimShiftAt = time + Phaser.Math.Between(900, 1500)
        }
        if (enemy.y > (enemy.standoffY || 180)) {
          enemy.body.setVelocityY(Math.min(enemy.body.velocity.y, 95))
        }
        const desiredVx = Phaser.Math.Clamp((enemy.aimX - enemy.x) * 1.6, -(enemy.maxVx || 90), enemy.maxVx || 90)
        const smoothed = Phaser.Math.Linear(enemy.body.velocity.x, desiredVx, enemy.turnRate || 0.025)
        enemy.body.setVelocityX(smoothed)
      } else if (enemy.type === 'swarm') {
        const desiredVx = Math.sin(time * 0.0072 + (enemy.swarmPhase || 0)) * (enemy.maxVx || 150)
        const smoothed = Phaser.Math.Linear(enemy.body.velocity.x, desiredVx, enemy.turnRate || 0.06)
        enemy.body.setVelocityX(smoothed)
      } else if (enemy.type === 'charger') {
        if (enemy.chargeState === 'seek') {
          const desiredVx = Phaser.Math.Clamp((this.player.x - enemy.x) * 0.9, -(enemy.maxVx || 120), enemy.maxVx || 120)
          const smoothed = Phaser.Math.Linear(enemy.body.velocity.x, desiredVx, enemy.turnRate || 0.045)
          enemy.body.setVelocityX(smoothed)
          if (time >= (enemy.nextChargeAt || 0)) {
            enemy.chargeState = 'telegraph'
            enemy.chargeTargetX = this.player.x
            enemy.chargeTelegraphUntil = time + 320
            enemy.setTint(0xfff0cf)
            enemy.body.setVelocityY(90)
          }
        } else if (enemy.chargeState === 'telegraph') {
          enemy.body.setVelocityX(0)
          if (time >= (enemy.chargeTelegraphUntil || 0)) {
            enemy.chargeState = 'dash'
            const toward = new Phaser.Math.Vector2(enemy.chargeTargetX - enemy.x, this.player.y + 30 - enemy.y)
            if (toward.lengthSq() < 0.0001) toward.set(0, 1)
            toward.normalize()
            const chargeSpeed = 420
            enemy.body.setVelocity(toward.x * chargeSpeed, toward.y * chargeSpeed)
            enemy.chargeEndAt = time + 440
            enemy.setTint(0xfffef0)
          }
        } else if (time >= (enemy.chargeEndAt || 0)) {
          enemy.chargeState = 'seek'
          enemy.nextChargeAt = time + Phaser.Math.Between(1700, 2600)
          enemy.setTint(enemy.baseTint || 0xffffff)
        }
      } else if (enemy.type === 'guard') {
        if (time >= (enemy.nextGuardShiftAt || 0)) {
          const snappedPlayerLane = Phaser.Math.Snap.To(this.player.x, 80, 40)
          enemy.guardAnchorX = Phaser.Math.Clamp(snappedPlayerLane + Phaser.Math.Between(-80, 80), 50, GAME_WIDTH - 50)
          enemy.nextGuardShiftAt = time + Phaser.Math.Between(850, 1500)
        }
        const orbit = Math.sin(time * 0.005 + (enemy.guardPhase || 0)) * 72
        const desiredX = (enemy.guardAnchorX || enemy.x) + orbit
        const desiredVx = Phaser.Math.Clamp((desiredX - enemy.x) * 2.1, -(enemy.maxVx || 118), enemy.maxVx || 118)
        const smoothed = Phaser.Math.Linear(enemy.body.velocity.x, desiredVx, enemy.turnRate || 0.04)
        enemy.body.setVelocityX(smoothed)
      } else if (enemy.type === 'ufoElite') {
        const desiredVx = Math.sin(time * (enemy.ufoFreq || 0.0036) + enemy.waveSeed) * (enemy.maxVx || 170)
        const smoothed = Phaser.Math.Linear(enemy.body.velocity.x, desiredVx, enemy.turnRate || 0.035)
        enemy.body.setVelocityX(smoothed)
      } else {
        enemy.body.setVelocityX(0)
        enemy.setScale(enemy.baseScale || 1)
        return
      }

      const pulse = Math.sin(time * 0.018 + enemy.waveSeed) * 0.03
      enemy.setScale((enemy.baseScale || 1) + pulse)
      if (time >= (enemy.engineTrailAt || 0)) {
        // Place exhaust opposite to movement vector so flame direction stays correct.
        const velocity = enemy.body.velocity
        const speed = Math.hypot(velocity.x, velocity.y)
        const dirX = speed > 0.01 ? velocity.x / speed : 0
        const dirY = speed > 0.01 ? velocity.y / speed : 1
        const rearX = enemy.x - dirX * 20
        const rearY = enemy.y - dirY * 20
        const sideX = -dirY * 8
        const sideY = dirX * 8
        this.spawnEngineTrail(rearX - sideX, rearY - sideY, 0xffa766, 0.56, 130)
        this.spawnEngineTrail(rearX + sideX, rearY + sideY, 0xff8a4f, 0.48, 130)
        enemy.engineTrailAt = time + Phaser.Math.Between(45, 85)
      }
    })
  }

  startMidBossStage() {
    const activeStage = this.getActiveStage()
    this.waveTickEvent.paused = true
    this.enemySpawnEvent.paused = true
    this.enemyFireEvent.paused = true
    this.clearAllEnemyBullets()
    this.clearEnemiesAndPickups()
    const label = activeStage.midBossLabel || 'Assault Carrier'
    this.beginBossWarning(`WARNING: ${label.toUpperCase()}`, () => {
      this.phase = 'midboss'
      this.startBossMusic()
      this.spawnBoss('mid')
      this.events.emit('stage-changed', label)
    })
  }

  startFinalBossStage() {
    const activeStage = this.getActiveStage()
    this.waveTickEvent.paused = true
    this.enemySpawnEvent.paused = true
    this.enemyFireEvent.paused = true
    this.clearAllEnemyBullets()
    this.clearEnemiesAndPickups()
    const label = activeStage.bossLabel || 'Command Dreadnought'
    this.beginBossWarning(`WARNING: ${label.toUpperCase()}`, () => {
      this.phase = 'finalboss'
      this.startBossMusic()
      this.spawnBoss('final')
      this.events.emit('stage-changed', label)
    })
  }

  beginBossWarning(label, onDeploy) {
    this.phase = 'warning'
    this.audio.playAlarm()
    this.cameras.main.flash(220, 255, 80, 80, true)
    this.cameras.main.shake(220, 0.0045)
    this.events.emit('stage-changed', label)

    const warningText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, label, {
        fontFamily: 'Arial',
        fontSize: '42px',
        color: '#ff6f57',
        stroke: '#120505',
        strokeThickness: 7
      })
      .setOrigin(0.5)
      .setDepth(38)

    this.tweens.add({
      targets: warningText,
      alpha: { from: 1, to: 0.2 },
      duration: 130,
      yoyo: true,
      repeat: 9
    })

    this.time.delayedCall(1500, () => {
      warningText.destroy()
      onDeploy()
    })
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
    const activeStage = this.getActiveStage()

    const boss = this.bosses.get(GAME_WIDTH / 2, -90, 'boss')
    if (!boss) return

    boss.setActive(true).setVisible(true)
    boss.body.enable = true
    boss.setDepth(4)
    boss.kind = kind
    boss.entered = false

    if (kind === 'mid') {
      boss.hp = activeStage.midBossHp || 170
      boss.maxHp = boss.hp
      boss.body.setVelocityY(80)
      boss.baseTint = 0xfff0e6
      boss.setTint(boss.baseTint)
      boss.baseScale = 1.5
    } else {
      boss.hp = activeStage.bossHp
      boss.maxHp = boss.hp
      boss.body.setVelocityY(70)
      boss.baseTint = activeStage.bossTint
      boss.setTint(boss.baseTint)
      boss.baseScale = activeStage.bossScale
    }
    boss.setScale(boss.baseScale)
    boss.body.setSize(boss.width * 0.52, boss.height * 0.58, true)
    boss.engineTrailAt = 0

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

    const activeStage = this.getActiveStage()
    let bossSpeed, bossRange
    if (boss.kind === 'mid') {
      bossSpeed = 0.0014
      bossRange = 150
    } else if (activeStage.id === 'moon') {
      bossSpeed = 0.0023
      bossRange = 210
    } else {
      bossSpeed = 0.0019
      bossRange = 180
    }
    boss.x = GAME_WIDTH / 2 + Math.sin(time * bossSpeed) * bossRange
    const pulse = Math.sin(time * 0.01) * 0.02
    boss.setScale((boss.baseScale || 1) + pulse)
    if (time >= (boss.engineTrailAt || 0)) {
      this.spawnEngineTrail(boss.x - 30, boss.y + 50, 0xffb35d, 0.68, 210)
      this.spawnEngineTrail(boss.x - 10, boss.y + 53, 0xff8647, 0.58, 220)
      this.spawnEngineTrail(boss.x + 10, boss.y + 53, 0xff8647, 0.58, 220)
      this.spawnEngineTrail(boss.x + 30, boss.y + 50, 0xffb35d, 0.68, 210)
      boss.engineTrailAt = time + Phaser.Math.Between(32, 58)
    }
    this.bossShoot(time, boss)
    this.events.emit('boss-hp-changed', Phaser.Math.Clamp(boss.hp / boss.maxHp, 0, 1))
  }

  spawnEngineTrail(x, y, tint, alpha, duration) {
    const flame = this.add.image(x, y, 'engineFlame').setDepth(1)
    flame.setTint(tint)
    flame.setAlpha(alpha)
    flame.setScale(Phaser.Math.FloatBetween(1.5, 2.6))
    flame.setBlendMode(Phaser.BlendModes.ADD)
    this.tweens.add({
      targets: flame,
      y: y + Phaser.Math.Between(8, 20),
      alpha: 0,
      scale: 0.2,
      duration,
      ease: 'Quad.out',
      onComplete: () => flame.destroy()
    })
  }

  updatePlayerEngineTrail(time) {
    if (!this.player?.isAlive || this.phase === 'warning') return
    if (time < (this.player.engineTrailAt || 0)) return

    const velocity = this.player.body?.speed || 0
    const moveFactor = Phaser.Math.Clamp(velocity / this.player.speed, 0, 1)
    const burningHard = moveFactor > 0.35

    const tailY = this.player.y + 22
    const sideOffset = 8
    this.spawnPlayerEngineFlame(this.player.x - sideOffset, tailY, 0x7de6ff, 0.42 + moveFactor * 0.22)
    this.spawnPlayerEngineFlame(this.player.x + sideOffset, tailY, 0x59c8ff, 0.36 + moveFactor * 0.2)

    if (burningHard && Phaser.Math.Between(0, 100) < 42) {
      this.spawnPlayerEngineFlame(this.player.x, tailY + 2, 0xaef4ff, 0.28 + moveFactor * 0.15)
    }

    const nextDelay = burningHard ? Phaser.Math.Between(28, 48) : Phaser.Math.Between(46, 74)
    this.player.engineTrailAt = time + nextDelay
  }

  spawnPlayerEngineFlame(x, y, tint, alpha) {
    const flame = this.add.image(x, y, 'engineFlame').setDepth(1)
    flame.setTint(tint)
    flame.setAlpha(alpha)
    flame.setScale(Phaser.Math.FloatBetween(1.1, 1.9))
    flame.setBlendMode(Phaser.BlendModes.ADD)
    this.tweens.add({
      targets: flame,
      y: y + Phaser.Math.Between(9, 17),
      alpha: 0,
      scale: 0.12,
      duration: Phaser.Math.Between(105, 165),
      ease: 'Quad.out',
      onComplete: () => flame.destroy()
    })
  }

  bossShoot(time, boss) {
    const activeStage = this.getActiveStage()
    const cooldown = boss.kind === 'mid' ? 540 : (activeStage.bossShootCooldown || 360)
    if (time - this.lastBossShotAt < cooldown) return

    let pattern = []
    let bulletSpeed = 320
    let bulletTint = 0xd93bc1

    if (boss.kind === 'mid') {
      pattern = [-220, -140, -60, 0, 60, 140, 220]
      bulletSpeed = 260
      bulletTint = 0x8f4fe8
    } else if (activeStage.id === 'moon') {
      bulletTint = 0x5f9fff
      bulletSpeed = 340
      const moonPhase = Math.floor(time / 700) % 3
      if (moonPhase === 0) {
        pattern = Array.from({ length: 11 }, (_, i) => (i - 5) * 56)
      } else if (moonPhase === 1) {
        const offset = Math.floor(time / 350) % 2 === 0 ? 30 : -30
        pattern = Array.from({ length: 7 }, (_, i) => (i - 3) * 80 + offset)
      } else {
        const rotAngle = (time * 0.003) % (Math.PI * 2)
        pattern = Array.from({ length: 8 }, (_, i) =>
          Math.sin(rotAngle + (i * Math.PI) / 4) * 260
        )
      }
    } else {
      const earthPhase = Math.floor(time / 800) % 3
      if (earthPhase === 0) {
        pattern = [-280, -210, -140, -70, 0, 70, 140, 210, 280]
      } else if (earthPhase === 1) {
        pattern = [-220, -110, 0, 110, 220]
      } else {
        pattern = [-260, -180, -100, 100, 180, 260]
      }
    }

    pattern.forEach((vx) => {
      const bullet = this.bossBullets.get(boss.x, boss.y + 32, 'bossBullet')
      if (!bullet) return
      bullet.setActive(true).setVisible(true)
      bullet.body.enable = true
      bullet.body.setVelocity(vx, bulletSpeed)
      bullet.setScale(0.78)
      bullet.body.setSize(22, 22)
      bullet.setDepth(3)
      bullet.setTint(bulletTint)
    })

    this.lastBossShotAt = time
  }

  applyDamageToEnemy(enemy, damage, options = {}) {
    if (!enemy?.active) return false
    const dealt = Math.max(1, Math.floor(damage))
    enemy.hp -= dealt
    enemy.setTintFill(0xffffff)
    this.time.delayedCall(45, () => {
      if (enemy.active) {
        enemy.setTint(enemy.baseTint || 0xffffff)
      }
    })
    if (enemy.hp > 0) return false

    this.explode(enemy.x, enemy.y, options.tint || 0xffc4e4)
    this.audio.playExplosion()
    if (!options.silentCamera) {
      this.cameras.main.shake(45, 0.0018)
      this.hitStop(24)
    }
    enemy.disableBody(true, true)
    this.score += enemy.scoreValue
    this.events.emit('score-changed', this.score)
    if (options.allowDrop !== false) {
      this.maybeDropFromEnemy(enemy)
    }
    if (options.gainUltimateCharge !== false) {
      this.addUltimateCharge(3)
    }
    return true
  }

  applyDamageToBoss(boss, damage, options = {}) {
    if (!boss?.active) return false
    const dealt = Math.max(1, Math.floor(damage))
    boss.hp -= dealt
    boss.setTintFill(0xffffff)
    this.time.delayedCall(55, () => {
      if (boss.active) {
        boss.setTint(boss.baseTint || 0xffffff)
      }
    })
    if (!options.silentCamera) {
      this.cameras.main.shake(35, 0.0012)
      this.hitStop(18)
    }
    if (boss.hp > 0) return false

    this.explode(boss.x, boss.y, 0xffb1e8, 44)
    this.audio.playExplosion()
    this.cameras.main.flash(180, 255, 200, 220, true)
    this.cameras.main.shake(220, 0.007)
    this.hitStop(90)
    boss.disableBody(true, true)
    this.events.emit('boss-hp-changed', null)
    this.score += boss.kind === 'final' ? 900 : 300
    this.events.emit('score-changed', this.score)
    this.clearAllEnemyBullets()
    this.bossDefeatedCount += 1
    this.addUltimateCharge(18)

    if (boss.kind === 'mid') {
      this.phase = 'final-ready'
      this.time.delayedCall(450, () => this.startFinalBossStage())
    } else if (this.stageIndex < STAGE_CONFIGS.length - 1) {
      this.time.delayedCall(600, () => this.showStageClearOverlay())
    } else {
      this.winGame()
    }
    return true
  }

  triggerUltimate() {
    if (this.ultimateCharge < this.ultimateChargeMax) return false
    this.ultimateCharge = 0
    this.audio.playUltimate()
    this.cameras.main.flash(220, 120, 220, 255, true)
    this.cameras.main.shake(180, 0.005)
    this.hitStop(70)
    this.clearAllEnemyBullets()

    this.enemies.children.iterate((enemy) => {
      if (!enemy?.active) return
      this.applyDamageToEnemy(enemy, 999, { allowDrop: true, gainUltimateCharge: false, silentCamera: true, tint: 0xbde8ff })
    })

    this.bosses.children.iterate((boss) => {
      if (!boss?.active) return
      const percentDamage = Math.ceil(boss.maxHp * this.ultimateBossDamageRatio)
      const maxCap = Math.ceil(boss.maxHp * 0.2)
      const damage = Phaser.Math.Clamp(percentDamage, 1, maxCap)
      this.applyDamageToBoss(boss, damage, { silentCamera: true })
    })
    return true
  }

  hitBoss(bullet, boss) {
    if (!bullet.active || !boss.active) return
    if (bullet.kind === 'pierce' && bullet.hitCooldownUntil && this.time.now < bullet.hitCooldownUntil) {
      return
    }
    if (bullet.kind === 'pierce' && bullet.pierceLeft > 0) {
      bullet.pierceLeft -= 1
      bullet.hitCooldownUntil = this.time.now + 70
    } else {
      bullet.disableBody(true, true)
    }
    this.applyDamageToBoss(boss, bullet.damage || 1)
  }

  hasActiveBoss() {
    return this.bosses.getChildren().some((obj) => obj.active)
  }

  collectPickup(player, pickup) {
    if (!pickup.active) return
    const style = PICKUP_STYLE[pickup.kind] || PICKUP_STYLE[PICKUP_KIND.FIRE]
    pickup.disableBody(true, true)

    if (pickup.kind === PICKUP_KIND.FIRE) {
      this.audio.playPickup()
      this.player.setFireLevel(this.player.fireLevel + 1)
      this.events.emit('fire-changed', this.player.fireLevel)
      this.score += 20
      this.events.emit('score-changed', this.score)
      this.explode(player.x, player.y, style.burstTint, 14)
      this.showPickupLabel(player.x, player.y - 16, style.label, style.color)
      return
    }

    if (pickup.kind === PICKUP_KIND.SHIELD) {
      this.audio.playPickup()
      this.player.setShield(this.time.now, 7000)
      this.explode(player.x, player.y, style.burstTint, 14)
      this.showPickupLabel(player.x, player.y - 16, style.label, style.color)
      return
    }

    if (pickup.kind === PICKUP_KIND.ULTIMATE) {
      this.audio.playPickup()
      this.addUltimateCharge(34)
      this.explode(player.x, player.y, style.burstTint, 15)
      this.showPickupLabel(player.x, player.y - 16, style.label, style.color)
      return
    }

    const modeByPickup = {
      [PICKUP_KIND.LASER]: WEAPON_MODES.LASER,
      [PICKUP_KIND.SPREAD]: WEAPON_MODES.SPREAD,
      [PICKUP_KIND.HOMING]: WEAPON_MODES.HOMING,
      [PICKUP_KIND.PIERCE]: WEAPON_MODES.PIERCE,
      [PICKUP_KIND.BOOMERANG]: WEAPON_MODES.BOOMERANG
    }
    const mode = modeByPickup[pickup.kind]
    if (mode) {
      this.audio.playPickup()
      this.player.setWeaponMode(mode, this.time.now, this.weaponModeDurationMs)
      this.explode(player.x, player.y, style.burstTint, 14)
      this.showPickupLabel(player.x, player.y - 16, style.label, style.color)
    }
  }

  dropPickup(x, y, forcedKind) {
    const kind = forcedKind || this.rollWeightedPickup()
    const texture = PICKUP_TEXTURE[kind] || PICKUP_TEXTURE[PICKUP_KIND.FIRE]
    const style = PICKUP_STYLE[kind] || PICKUP_STYLE[PICKUP_KIND.FIRE]
    const pickup = this.pickups.get(x, y, texture)
    if (!pickup) return

    pickup.kind = kind
    pickup.setActive(true).setVisible(true)
    pickup.body.enable = true
    pickup.setDepth(3)
    pickup.setTint(style.color)
    pickup.setVelocity(0, 120)
    pickup.pulseSeed = Phaser.Math.Between(0, 2000)
  }

  showPickupLabel(x, y, label, tint) {
    const text = this.add
      .text(x, y, label, {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#ffffff',
        stroke: '#081425',
        strokeThickness: 5
      })
      .setOrigin(0.5)
      .setDepth(20)
      .setTint(tint)

    this.tweens.add({
      targets: text,
      y: y - 26,
      alpha: 0,
      duration: 520,
      ease: 'Sine.out',
      onComplete: () => text.destroy()
    })
  }

  rollWeightedPickup() {
    const total = RANDOM_PICKUP_WEIGHTS.reduce((sum, item) => sum + item.weight, 0)
    const roll = Phaser.Math.Between(1, total)
    let acc = 0
    for (const item of RANDOM_PICKUP_WEIGHTS) {
      acc += item.weight
      if (roll <= acc) return item.kind
    }
    return PICKUP_KIND.FIRE
  }

  maybeDropFromEnemy(enemy) {
    if (Phaser.Math.FloatBetween(0, 1) > enemy.dropRate) return
    const kindByType = {
      tank: PICKUP_KIND.SHIELD,
      guard: PICKUP_KIND.PIERCE,
      sniper: PICKUP_KIND.HOMING,
      striker: PICKUP_KIND.SPREAD,
      charger: PICKUP_KIND.BOOMERANG,
      ufoElite: PICKUP_KIND.LASER
    }
    const kind = kindByType[enemy.type]
    this.dropPickup(enemy.x, enemy.y, kind)
  }

  hitEnemy(bullet, enemy) {
    if (!bullet.active || !enemy.active) return
    if (bullet.kind === 'pierce' && bullet.hitCooldownUntil && this.time.now < bullet.hitCooldownUntil) {
      return
    }
    if (bullet.kind === 'pierce' && bullet.pierceLeft > 0) {
      bullet.pierceLeft -= 1
      bullet.hitCooldownUntil = this.time.now + 70
    } else {
      bullet.disableBody(true, true)
    }
    this.applyDamageToEnemy(enemy, bullet.damage || 1)
  }

  hitPlayer(playerObj, hazard) {
    if (this.isGameOver || this.gameCleared) return
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
    this.cameras.main.flash(120, 255, 70, 70, true)
    this.cameras.main.shake(150, 0.006)
    this.hitStop(60)
    this.explode(playerObj.x, playerObj.y, 0x87d7ff, 16)
    this.events.emit('lives-changed', this.lives)

    if (this.lives <= 0) {
      this.gameOver()
    }
  }

  explode(x, y, tint, quantity = 12) {
    const core = this.add.particles(0, 0, 'particle', {
      x,
      y,
      quantity,
      lifespan: 360,
      speed: { min: 70, max: 250 },
      scale: { start: 1.2, end: 0 },
      tint
    })
    const sparks = this.add.particles(0, 0, 'particle', {
      x,
      y,
      quantity: Math.ceil(quantity * 0.8),
      lifespan: 240,
      speed: { min: 120, max: 320 },
      scale: { start: 0.8, end: 0 },
      blendMode: 'ADD',
      tint: 0xffffff
    })
    const halo = this.add.image(x, y, 'ring').setDepth(6).setTint(tint).setAlpha(0.75)
    this.tweens.add({
      targets: halo,
      scale: 2.2,
      alpha: 0,
      duration: 180,
      ease: 'Sine.out',
      onComplete: () => halo.destroy()
    })
    const sparkle = this.add.particles(0, 0, 'spark', {
      x,
      y,
      quantity: Math.max(2, Math.ceil(quantity * 0.35)),
      lifespan: 190,
      speed: { min: 35, max: 120 },
      scale: { start: 1.1, end: 0 },
      blendMode: 'ADD',
      tint: [0xffffff, tint]
    })
    this.time.delayedCall(430, () => {
      core.destroy()
      sparks.destroy()
      sparkle.destroy()
    })
  }

  hitStop(durationMs) {
    if (this.hitStopLock || this.isGameOver || this.gameCleared) return
    this.hitStopLock = true
    this.physics.world.pause()
    this.time.delayedCall(durationMs, () => {
      this.physics.world.resume()
      this.hitStopLock = false
    })
  }

  getActiveStage() {
    return STAGE_CONFIGS[this.stageIndex] || STAGE_CONFIGS[0]
  }

  showStageClearOverlay() {
    this.phase = 'stage-clear'
    this.enemySpawnEvent.paused = true
    this.enemyFireEvent.paused = true
    this.waveTickEvent.paused = true
    this.startStageMusic()

    const activeStage = this.getActiveStage()
    const clearText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, `${activeStage.name.toUpperCase()}\nCLEAR`, {
        fontFamily: 'Arial',
        fontSize: '48px',
        color: '#ffd080',
        align: 'center',
        stroke: '#111',
        strokeThickness: 7
      })
      .setOrigin(0.5)
      .setDepth(38)

    this.tweens.add({
      targets: clearText,
      scale: { from: 0.5, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 600,
      ease: 'Back.out'
    })

    this.time.delayedCall(2500, () => {
      this.tweens.add({
        targets: clearText,
        alpha: 0,
        duration: 400,
        onComplete: () => clearText.destroy()
      })
      this.advanceToNextStage()
    })
  }

  advanceToNextStage() {
    this.stageIndex += 1
    const nextStage = this.getActiveStage()

    this.destroyBackgroundLayers()

    if (nextStage.bgMode === 'moon') {
      this.createMoonBackground()
    } else {
      this.createEarthBackground(EARTH_BACKGROUND_SCHEME_KEY)
    }

    this.waveConfigs = nextStage.waves
    this.waveIndex = 0
    this.waveRemaining = this.waveConfigs[0].duration

    const enterText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, `ENTERING ${nextStage.name.toUpperCase()}`, {
        fontFamily: 'Arial',
        fontSize: '36px',
        color: '#c0d8ff',
        stroke: '#0a1020',
        strokeThickness: 6
      })
      .setOrigin(0.5)
      .setDepth(38)

    this.tweens.add({
      targets: enterText,
      alpha: { from: 1, to: 0 },
      duration: 2000,
      ease: 'Sine.out',
      onComplete: () => enterText.destroy()
    })

    this.phase = 'wave'
    this.applyWaveConfig(this.waveConfigs[0])
    this.enemySpawnEvent.paused = false
    this.enemyFireEvent.paused = false
    this.waveTickEvent.paused = false

    this.events.emit('stage-changed', `${this.waveConfigs[0].name} - ${this.waveRemaining}s`)
  }

  destroyBackgroundLayers() {
    const layers = [
      this.background, this.backgroundBaseNext,
      this.backgroundPlanet, this.backgroundPlanetNext,
      this.backgroundDust, this.backgroundOverlay,
      this.backgroundOverlay2, this.cloudShadow
    ]
    layers.forEach((layer) => { if (layer) layer.destroy() })
    this.background = null
    this.backgroundBaseNext = null
    this.backgroundPlanet = null
    this.backgroundPlanetNext = null
    this.backgroundDust = null
    this.backgroundOverlay = null
    this.backgroundOverlay2 = null
    this.cloudShadow = null
    this.sectorCrossfade = null
  }

  createMoonBackground() {
    const textures = MOON_SECTOR_TEXTURES
    const baseKey = textures[0].base

    if (this.textures.exists(baseKey)) {
      const scale = this.computeTileScale(baseKey)
      this.background = this.add
        .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, baseKey)
        .setDepth(0)
      this.background.setTileScale(scale, scale)

      this.backgroundBaseNext = this.add
        .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, baseKey)
        .setDepth(0.05)
        .setAlpha(0)
      this.backgroundBaseNext.setTileScale(scale, scale)
    } else {
      this.background = this.add
        .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'bgTile')
        .setDepth(0)
      this.backgroundBaseNext = null
    }

    this.backgroundPlanet = null
    this.backgroundPlanetNext = null

    this.backgroundDust = this.add
      .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'bgTile')
      .setDepth(0.4)
      .setAlpha(0.06)
      .setTint(0x8fb5d8)

    this.cloudShadow = null
    this.backgroundOverlay = null
    this.backgroundOverlay2 = null

    this.backgroundScheme = {
      key: 'MOON',
      hasEarthTextures: true,
      planetSpeed: 0,
      overlaySpeed: 0,
      planetAlpha: 0,
      overlayAlpha: 0,
      planetXDrift: 0,
      overlayXDrift: 0,
      dustXDrift: 0.04
    }
    this.backgroundPlanetBaseAlpha = 0
    this.backgroundOverlayBaseAlpha = 0
    this.currentSectorIndex = 0
    this.sectorCrossfade = null
    this.activeSectorTextures = textures
  }

  winGame() {
    this.gameCleared = true
    this.player.isAlive = false
    this.player.setVelocity(0, 0)
    this.enemySpawnEvent.paused = true
    this.enemyFireEvent.paused = true
    this.waveTickEvent.paused = true
    this.destroyMusic(220)
    this.events.emit('stage-changed', 'Target Neutralized')

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
    this.destroyMusic(180)
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

  destroyMusic(fadeMs = 0) {
    const tracks = [this.music.stage, this.music.boss].filter(Boolean)
    tracks.forEach((track) => {
      if (!track) return
      if (fadeMs > 0 && track.isPlaying) {
        this.tweens.add({
          targets: track,
          volume: 0,
          duration: fadeMs,
          onComplete: () => {
            track.stop()
            track.destroy()
          }
        })
      } else {
        if (track.isPlaying) track.stop()
        track.destroy()
      }
    })
    this.music.stage = null
    this.music.boss = null
    this.music.current = null
    this.music.currentKey = null
  }

}
