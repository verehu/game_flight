import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/37d80bce-582f-43d7-887b-668ec130d0ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'startup-debug',hypothesisId:'H1',location:'BootScene.js:preload-enter',message:'Boot preload started',data:{sceneKey:this.scene.key},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
    const base = '/assets/kenney/SpaceShooterRedux'
    const earthBase = '/assets/stages/earth'
    const earthRef = {
      base: 'https://opengameart.org/sites/default/files/backgrounddetailed6.png',
      planet: 'https://opengameart.org/sites/default/files/backgrounddetailed3.png',
      overlay: 'https://opengameart.org/sites/default/files/oga-textures/136561/fx_cloudalpha07.png'
    }
    this.load.audio('bgmStage', ['audio/shmup-stage.ogg', 'audio/shmup-stage.mp3'])
    this.load.audio('bgmBoss', ['audio/shmup-boss.ogg', 'audio/shmup-boss.mp3'])
    this.load.image('bgTile', `${base}/Backgrounds/darkPurple.png`)
    this.load.svg('bgEarthABase', `${earthBase}/variant-a/base.svg`, { width: 1024, height: 1024 })
    this.load.svg('bgEarthAPlanet', `${earthBase}/variant-a/planet.svg`, { width: 1024, height: 1024 })
    this.load.svg('bgEarthAOverlay', `${earthBase}/variant-a/overlay.svg`, { width: 1024, height: 1024 })
    this.load.svg('bgEarthBBase', `${earthBase}/variant-b/base.svg`, { width: 1024, height: 1024 })
    this.load.svg('bgEarthBPlanet', `${earthBase}/variant-b/planet.svg`, { width: 1024, height: 1024 })
    this.load.svg('bgEarthBOverlay', `${earthBase}/variant-b/overlay.svg`, { width: 1024, height: 1024 })
    this.load.svg('bgEarthCBaseFallback', `${earthBase}/variant-c/base.svg`, { width: 1024, height: 1024 })
    this.load.svg('bgEarthCPlanetFallback', `${earthBase}/variant-c/planet.svg`, { width: 1024, height: 1024 })
    this.load.svg('bgEarthCOverlayFallback', `${earthBase}/variant-c/overlay.svg`, { width: 1024, height: 1024 })
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

    this.load.once('complete', (loader, totalComplete, totalFailed) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/37d80bce-582f-43d7-887b-668ec130d0ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'startup-debug',hypothesisId:'H1',location:'BootScene.js:preload-complete',message:'Boot preload complete',data:{totalComplete,totalFailed},timestamp:Date.now()})}).catch(()=>{})
      // #endregion
    })
    this.load.on('loaderror', (fileObj) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/37d80bce-582f-43d7-887b-668ec130d0ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'startup-debug',hypothesisId:'H1',location:'BootScene.js:preload-loaderror',message:'Boot preload file failed',data:{key:fileObj?.key ?? null,src:fileObj?.src ?? null,type:fileObj?.type ?? null},timestamp:Date.now()})}).catch(()=>{})
      // #endregion
    })
  }

  create() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/37d80bce-582f-43d7-887b-668ec130d0ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'startup-debug',hypothesisId:'H2',location:'BootScene.js:create-before-start',message:'Boot create starting GameScene',data:{hasPlayerTexture:this.textures.exists('player'),hasBgTile:this.textures.exists('bgTile')},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
    this.createFxTextures()
    this.scene.start('GameScene')
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
