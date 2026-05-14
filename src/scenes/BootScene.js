import Phaser from 'phaser'

const IS_MINIGAME = typeof __MINIGAME__ !== 'undefined' && __MINIGAME__

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    const base = '/assets/kenney/SpaceShooterRedux'
    const earthBase = '/assets/stages/earth'
    const earthRef = {
      base: 'https://opengameart.org/sites/default/files/backgrounddetailed6.png',
      planet: 'https://opengameart.org/sites/default/files/backgrounddetailed3.png',
      overlay: 'https://opengameart.org/sites/default/files/oga-textures/136561/fx_cloudalpha07.png'
    }

    if (IS_MINIGAME) {
      this.load.audio('bgmStage', 'audio/shmup-stage-moon.mp3')
      this.load.audio('bgmBoss', 'audio/shmup-boss-moon.mp3')
      this.load.image('bgTile', `${base}/Backgrounds/darkPurple.png`)
      this.load.image('bgSectorABase', `${earthBase}/user/sector-a-base.png`)
      this.load.image('bgCloudOverlay', `${earthBase}/user/cloud-overlay.png`)
      return
    }

    if (!IS_MINIGAME) {
      this.load.audio('bgmStage', ['audio/shmup-stage.ogg', 'audio/shmup-stage.mp3'])
      this.load.audio('bgmBoss', ['audio/shmup-boss.ogg', 'audio/shmup-boss.mp3'])
      this.load.audio('bgmStageMoon', 'audio/shmup-stage-moon.mp3')
      this.load.audio('bgmBossMoon', 'audio/shmup-boss-moon.mp3')
      this.load.audio('bgmStageMars', 'audio/shmup-stage-mars.mp3')
      this.load.audio('bgmBossMars', 'audio/shmup-boss-mars.mp3')
    }
    this.load.image('bgTile', `${base}/Backgrounds/darkPurple.png`)

    if (!IS_MINIGAME) {
      this.load.svg('bgEarthABase', `${earthBase}/variant-a/base.svg`, { width: 1024, height: 1024 })
      this.load.svg('bgEarthAPlanet', `${earthBase}/variant-a/planet.svg`, { width: 1024, height: 1024 })
      this.load.svg('bgEarthAOverlay', `${earthBase}/variant-a/overlay.svg`, { width: 1024, height: 1024 })
      this.load.svg('bgEarthBBase', `${earthBase}/variant-b/base.svg`, { width: 1024, height: 1024 })
      this.load.svg('bgEarthBPlanet', `${earthBase}/variant-b/planet.svg`, { width: 1024, height: 1024 })
      this.load.svg('bgEarthBOverlay', `${earthBase}/variant-b/overlay.svg`, { width: 1024, height: 1024 })
      this.load.svg('bgEarthCBaseFallback', `${earthBase}/variant-c/base.svg`, { width: 1024, height: 1024 })
      this.load.svg('bgEarthCPlanetFallback', `${earthBase}/variant-c/planet.svg`, { width: 1024, height: 1024 })
      this.load.svg('bgEarthCOverlayFallback', `${earthBase}/variant-c/overlay.svg`, { width: 1024, height: 1024 })
    }
    if (!IS_MINIGAME) {
      this.load.image('bgEarthUserBase', `${earthBase}/user/earth-topdown-scroll.png`)
      this.load.image('bgSectorABase', `${earthBase}/user/sector-a-base.png`)
      this.load.image('bgSectorAPlanet', `${earthBase}/user/sector-a-planet.png`)
      this.load.image('bgSectorBBase', `${earthBase}/user/sector-b-base.png`)
      this.load.image('bgSectorBPlanet', `${earthBase}/user/sector-b-planet.png`)
      this.load.image('bgSectorCBase', `${earthBase}/user/sector-c-base.png`)
      this.load.image('bgSectorCPlanet', `${earthBase}/user/sector-c-planet.png`)
      this.load.image('bgCloudOverlay', `${earthBase}/user/cloud-overlay.png`)
      this.load.image('bgEarthCBase', earthRef.base)
      this.load.image('bgEarthCPlanet', earthRef.planet)
      this.load.image('bgEarthCOverlay', earthRef.overlay)
    }
    this.load.image('player', `${base}/PNG/playerShip2_blue.png`)
    this.load.image('bullet', `${base}/PNG/Lasers/laserBlue16.png`)
    this.load.image('enemy', `${base}/PNG/Enemies/enemyBlack2.png`)
    this.load.image('enemyScout', `${base}/PNG/Enemies/enemyBlack1.png`)
    this.load.image('enemyStriker', `${base}/PNG/Enemies/enemyBlack2.png`)
    this.load.image('enemyTank', `${base}/PNG/Enemies/enemyBlack4.png`)
    this.load.image('enemySniper', `${base}/PNG/Enemies/enemyRed2.png`)
    this.load.image('enemySwarm', `${base}/PNG/Enemies/enemyRed1.png`)
    this.load.image('enemyCharger', `${base}/PNG/Enemies/enemyRed3.png`)
    this.load.image('enemyGuard', `${base}/PNG/Enemies/enemyRed4.png`)
    this.load.image('enemyUfoElite', `${base}/PNG/ufoRed.png`)
    this.load.image('enemyBullet', `${base}/PNG/Lasers/laserRed03.png`)
    this.load.image('bossBullet', `${base}/PNG/Lasers/laserRed10.png`)
    this.load.image('pickupFire', `${base}/PNG/Power-ups/powerupBlue_bolt.png`)
    this.load.image('pickupShield', `${base}/PNG/Power-ups/powerupBlue_shield.png`)
    this.load.image('pickupLaser', `${base}/PNG/Power-ups/powerupBlue_star.png`)
    this.load.image('pickupSpread', `${base}/PNG/Power-ups/powerupBlue.png`)
    this.load.image('pickupHoming', `${base}/PNG/Power-ups/powerupBlue_shield.png`)
    this.load.image('pickupPierce', `${base}/PNG/Power-ups/powerupBlue_bolt.png`)
    this.load.image('pickupBoomerang', `${base}/PNG/Power-ups/powerupBlue_star.png`)
    this.load.image('pickupUltimate', `${base}/PNG/Power-ups/powerupBlue.png`)
    this.load.image('boss', `${base}/PNG/Enemies/enemyBlack5.png`)
    this.load.image('particle', `${base}/PNG/Effects/star3.png`)
    this.load.image('engineFlame', `${base}/PNG/Effects/fire17.png`)

    const moonBase = '/assets/stages/moon'
    if (!IS_MINIGAME) {
      this.load.image('bgMoonMareA', `${moonBase}/user/mare-a-base.png`)
      this.load.image('bgMoonMareB', `${moonBase}/user/mare-b-base.png`)
      this.load.image('bgMoonMareC', `${moonBase}/user/mare-c-base.png`)
    }

    const marsBase = '/assets/stages/mars'
    if (!IS_MINIGAME) {
      this.load.image('bgMarsZoneA', `${marsBase}/user/zone-a-base.png`)
      this.load.image('bgMarsZoneB', `${marsBase}/user/zone-b-base.png`)
      this.load.image('bgMarsZoneC', `${marsBase}/user/zone-c-base.png`)
    }

    this.load.once('complete', (loader, totalComplete, totalFailed) => {
      if (IS_MINIGAME && totalFailed > 0) {
        console.warn('[BootScene] Mini game preload completed with failed assets:', totalFailed)
      }
    })
    this.load.on('loaderror', (fileObj) => {
      if (IS_MINIGAME) {
        console.warn('[BootScene] Mini game asset failed:', fileObj?.key, fileObj?.src)
      }
    })
  }

  create() {
    if (IS_MINIGAME) this.createMiniGameTextures()
    this.createFxTextures()
    this.createMarsPlaceholderTextures()
    this.scene.start('GameScene')
  }

  createMiniGameTextures() {
    this.createRectTexture('bgTile', 64, 64, 0x07111f, (g) => {
      g.fillStyle(0x10223a, 0.7)
      g.fillCircle(12, 12, 1.6)
      g.fillCircle(42, 28, 1.2)
      g.fillCircle(28, 52, 1.4)
    })
    this.createShipTexture('player', 0x55b7ff, 0xd9f3ff, true)
    this.createShipTexture('enemy', 0xff9a72, 0x2a1515, false)
    this.createShipTexture('enemyScout', 0xffc08a, 0x2a1515, false)
    this.createShipTexture('enemyStriker', 0xff9a72, 0x2a1515, false)
    this.createShipTexture('enemyTank', 0xff745d, 0x2a1515, false)
    this.createShipTexture('enemySniper', 0xff6bd5, 0x2a1515, false)
    this.createShipTexture('enemySwarm', 0xffb15f, 0x2a1515, false)
    this.createShipTexture('enemyCharger', 0xff6c4f, 0x2a1515, false)
    this.createShipTexture('enemyGuard', 0xff8374, 0x2a1515, false)
    this.createShipTexture('enemyUfoElite', 0xff4e75, 0x2a1515, false)
    this.createShipTexture('boss', 0xff5b46, 0x180808, false, 96, 74)
    this.createBulletTexture('bullet', 0x72d8ff, 8, 26)
    this.createBulletTexture('enemyBullet', 0xff7868, 8, 26)
    this.createBulletTexture('bossBullet', 0xff3e54, 10, 34)
    this.createOrbTexture('particle', 0xffffff, 8)
    this.createOrbTexture('engineFlame', 0xff9a2a, 14)
    this.createOrbTexture('pickupFire', 0x45b9ff, 34)
    this.createOrbTexture('pickupShield', 0x56d89f, 34)
    this.createOrbTexture('pickupLaser', 0x61f0ff, 34)
    this.createOrbTexture('pickupSpread', 0x7fa8ff, 34)
    this.createOrbTexture('pickupHoming', 0x66f7b5, 34)
    this.createOrbTexture('pickupPierce', 0xffbe73, 34)
    this.createOrbTexture('pickupBoomerang', 0xd09bff, 34)
    this.createOrbTexture('pickupUltimate', 0xffc86e, 34)
  }

  createRectTexture(key, width, height, color, decorate) {
    if (this.textures.exists(key)) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(color, 1)
    g.fillRect(0, 0, width, height)
    if (decorate) decorate(g)
    g.generateTexture(key, width, height)
    g.destroy()
  }

  createShipTexture(key, color, accent, isPlayer, width = 72, height = 64) {
    if (this.textures.exists(key)) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(color, 1)
    if (isPlayer) {
      g.fillTriangle(width / 2, 4, 8, height - 8, width - 8, height - 8)
      g.fillStyle(accent, 1)
      g.fillTriangle(width / 2, 16, width / 2 - 9, height - 18, width / 2 + 9, height - 18)
    } else {
      g.fillTriangle(8, 8, width - 8, 8, width / 2, height - 6)
      g.fillStyle(accent, 1)
      g.fillCircle(width / 2, height * 0.42, Math.max(5, width * 0.09))
    }
    g.generateTexture(key, width, height)
    g.destroy()
  }

  createBulletTexture(key, color, width, height) {
    if (this.textures.exists(key)) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(color, 1)
    g.fillRoundedRect(0, 0, width, height, width / 2)
    g.generateTexture(key, width, height)
    g.destroy()
  }

  createOrbTexture(key, color, size) {
    if (this.textures.exists(key)) return
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(color, 0.95)
    g.fillCircle(size / 2, size / 2, size / 2 - 2)
    g.lineStyle(2, 0xffffff, 0.85)
    g.strokeCircle(size / 2, size / 2, size / 2 - 3)
    g.generateTexture(key, size, size)
    g.destroy()
  }

  createMarsPlaceholderTextures() {
    const needed = ['bgMarsZoneA', 'bgMarsZoneB', 'bgMarsZoneC']
    const allLoaded = needed.every((k) => this.textures.exists(k))
    if (allLoaded) return

    const variants = [
      { key: 'bgMarsZoneA', bg1: '#1a0c08', bg2: '#2a1610', bg3: '#1e0f0a', stars: 50 },
      { key: 'bgMarsZoneB', bg1: '#1e1008', bg2: '#301a10', bg3: '#22120a', stars: 40 },
      { key: 'bgMarsZoneC', bg1: '#22140c', bg2: '#381e14', bg3: '#28160e', stars: 30 }
    ]
    const rng = (seed) => {
      let s = seed
      return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 }
    }
    variants.forEach((v, idx) => {
      if (this.textures.exists(v.key)) return
      const canvas = this.textures.createCanvas(v.key, 540, 960)
      const ctx = canvas.getContext()
      const grad = ctx.createLinearGradient(0, 0, 0, 960)
      grad.addColorStop(0, v.bg1)
      grad.addColorStop(0.5, v.bg2)
      grad.addColorStop(1, v.bg3)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 540, 960)
      const rand = rng(99 + idx * 211)
      for (let s = 0; s < v.stars; s++) {
        const sx = rand() * 540
        const sy = rand() * 960
        const size = rand() * 2.5 + 0.5
        const a = rand() * 0.3 + 0.15
        ctx.fillStyle = `rgba(200, 140, 100, ${a})`
        ctx.beginPath()
        ctx.arc(sx, sy, size, 0, Math.PI * 2)
        ctx.fill()
      }
      canvas.refresh()
    })
  }

  createFxTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false })

    g.clear()
    g.lineStyle(2, 0xffffff, 1)
    g.strokeCircle(8, 8, 6)
    g.generateTexture('ring', 16, 16)

    g.clear()
    g.fillStyle(0xb0ddff, 1)
    g.fillCircle(3, 3, 3)
    g.fillStyle(0xffffff, 0.65)
    g.fillCircle(3, 3, 1.5)
    g.generateTexture('spark', 6, 6)

    g.destroy()

    this.createPickupTextures()
  }

  createPickupTextures() {
    this.createPickupTexture('pickupIconFire', 0x45b9ff, 0xd8f2ff, (g) => {
      g.lineStyle(3, 0xd8f2ff, 1)
      g.beginPath()
      g.moveTo(21, 10)
      g.lineTo(15, 22)
      g.lineTo(22, 22)
      g.lineTo(18, 30)
      g.lineTo(27, 18)
      g.lineTo(20, 18)
      g.closePath()
      g.strokePath()
    })

    this.createPickupTexture('pickupIconShield', 0x56d89f, 0xd8ffec, (g) => {
      g.lineStyle(3, 0xd8ffec, 1)
      g.strokeRoundedRect(14, 10, 12, 20, 5)
      g.lineStyle(2, 0xd8ffec, 0.9)
      g.beginPath()
      g.moveTo(20, 10)
      g.lineTo(20, 30)
      g.strokePath()
    })

    this.createPickupTexture('pickupIconLaser', 0x61f0ff, 0xe7fdff, (g) => {
      g.lineStyle(3, 0xe7fdff, 1)
      g.beginPath()
      g.moveTo(20, 9)
      g.lineTo(20, 31)
      g.strokePath()
      g.lineStyle(2, 0xe7fdff, 0.85)
      g.strokeCircle(20, 20, 5)
    })

    this.createPickupTexture('pickupIconSpread', 0x7fa8ff, 0xe8eeff, (g) => {
      g.lineStyle(3, 0xe8eeff, 1)
      g.beginPath()
      g.moveTo(20, 11)
      g.lineTo(14, 29)
      g.strokePath()
      g.beginPath()
      g.moveTo(20, 11)
      g.lineTo(20, 29)
      g.strokePath()
      g.beginPath()
      g.moveTo(20, 11)
      g.lineTo(26, 29)
      g.strokePath()
    })

    this.createPickupTexture('pickupIconHoming', 0x66f7b5, 0xe6fff4, (g) => {
      g.lineStyle(3, 0xe6fff4, 1)
      g.strokeCircle(20, 20, 8)
      g.fillStyle(0xe6fff4, 0.95)
      g.fillCircle(20, 20, 2.6)
      g.lineStyle(2, 0xe6fff4, 0.9)
      g.strokeCircle(20, 20, 12)
    })

    this.createPickupTexture('pickupIconPierce', 0xffbe73, 0xfff0de, (g) => {
      g.lineStyle(3, 0xfff0de, 1)
      g.beginPath()
      g.moveTo(12, 20)
      g.lineTo(28, 20)
      g.strokePath()
      g.fillStyle(0xfff0de, 1)
      g.fillTriangle(28, 16, 32, 20, 28, 24)
      g.strokeCircle(14, 20, 3)
    })

    this.createPickupTexture('pickupIconBoomerang', 0xd09bff, 0xf3e7ff, (g) => {
      g.lineStyle(3, 0xf3e7ff, 1)
      g.beginPath()
      g.moveTo(13, 24)
      g.lineTo(20, 12)
      g.lineTo(27, 24)
      g.strokePath()
      g.lineStyle(2, 0xf3e7ff, 0.9)
      g.strokeCircle(20, 23, 7)
    })

    this.createPickupTexture('pickupIconUltimate', 0xffc86e, 0xfff4df, (g) => {
      g.lineStyle(3, 0xfff4df, 1)
      g.strokeCircle(20, 20, 10)
      g.lineStyle(2, 0xfff4df, 0.95)
      g.beginPath()
      g.moveTo(20, 8)
      g.lineTo(20, 32)
      g.strokePath()
      g.beginPath()
      g.moveTo(8, 20)
      g.lineTo(32, 20)
      g.strokePath()
    })
  }

  createPickupTexture(key, baseColor, accentColor, drawGlyph) {
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(baseColor, 0.98)
    g.fillCircle(20, 20, 18)
    g.fillStyle(0xffffff, 0.08)
    g.fillCircle(15, 14, 6)
    g.lineStyle(3, 0xffffff, 0.9)
    g.strokeCircle(20, 20, 18)
    g.lineStyle(2, accentColor, 0.85)
    g.strokeCircle(20, 20, 13.5)
    drawGlyph(g)
    g.generateTexture(key, 40, 40)
    g.destroy()
  }
}
