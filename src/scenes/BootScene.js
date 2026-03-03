import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  create() {
    this.createTextures()
    this.scene.start('GameScene')
  }

  createTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false })

    g.clear()
    g.fillStyle(0xfff4fb, 1)
    g.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 22; i += 1) {
      g.fillStyle(0xffe5f5, 0.65)
      g.fillEllipse(Phaser.Math.Between(0, 255), Phaser.Math.Between(0, 255), 34, 20)
    }
    for (let i = 0; i < 38; i += 1) {
      const colors = [0xffffff, 0xfff7b5, 0xbde9ff]
      g.fillStyle(Phaser.Utils.Array.GetRandom(colors), 0.9)
      g.fillCircle(Phaser.Math.Between(0, 255), Phaser.Math.Between(0, 255), Phaser.Math.Between(1, 2))
    }
    g.generateTexture('bgTile', 256, 256)

    g.clear()
    g.fillStyle(0x9ce7ff, 1)
    g.beginPath()
    g.moveTo(20, 0)
    g.lineTo(40, 46)
    g.lineTo(20, 38)
    g.lineTo(0, 46)
    g.closePath()
    g.fillPath()
    g.fillStyle(0xffffff, 1)
    g.fillCircle(20, 16, 6)
    g.fillStyle(0xff9fcb, 1)
    g.fillCircle(15, 19, 2)
    g.fillCircle(25, 19, 2)
    g.fillStyle(0xffffff, 0.85)
    g.fillRoundedRect(18, 26, 4, 10, 2)
    g.generateTexture('player', 40, 46)

    g.clear()
    g.fillStyle(0xffc94d, 1)
    g.fillRoundedRect(0, 0, 10, 18, 4)
    g.fillStyle(0xffffff, 0.75)
    g.fillCircle(5, 6, 2)
    g.generateTexture('bullet', 8, 20)

    g.clear()
    g.fillStyle(0xffb8d8, 1)
    g.fillRoundedRect(0, 4, 36, 34, 14)
    g.fillStyle(0xffffff, 1)
    g.fillCircle(12, 18, 4)
    g.fillCircle(24, 18, 4)
    g.fillStyle(0xff85bf, 1)
    g.fillRect(8, 26, 20, 4)
    g.generateTexture('enemy', 36, 42)

    g.clear()
    g.fillStyle(0xff7a45, 1)
    g.fillRoundedRect(0, 0, 8, 16, 4)
    g.fillStyle(0xffffff, 0.6)
    g.fillCircle(4, 5, 1.5)
    g.generateTexture('enemyBullet', 7, 16)

    g.clear()
    g.fillStyle(0xa25cff, 1)
    g.fillRoundedRect(0, 0, 14, 24, 4)
    g.fillStyle(0xffffff, 0.65)
    g.fillCircle(7, 7, 2)
    g.generateTexture('bossBullet', 14, 24)

    g.clear()
    g.fillStyle(0x7be7ff, 1)
    g.fillCircle(16, 16, 16)
    g.fillStyle(0xffffff, 1)
    g.fillRect(14, 6, 4, 20)
    g.fillRect(6, 14, 20, 4)
    g.generateTexture('pickupFire', 32, 32)

    g.clear()
    g.fillStyle(0x9cf7b6, 1)
    g.fillCircle(16, 16, 16)
    g.lineStyle(3, 0xffffff, 1)
    g.strokeCircle(16, 16, 10)
    g.generateTexture('pickupShield', 32, 32)

    g.clear()
    g.fillStyle(0xd9a5ff, 1)
    g.fillRoundedRect(0, 0, 120, 72, 14)
    g.fillStyle(0xffebff, 1)
    g.fillRect(8, 14, 104, 16)
    g.fillStyle(0xff7ec6, 1)
    g.fillCircle(38, 47, 9)
    g.fillCircle(82, 47, 9)
    g.fillStyle(0xffffff, 1)
    g.fillCircle(38, 47, 3)
    g.fillCircle(82, 47, 3)
    g.generateTexture('boss', 120, 72)

    g.clear()
    g.fillStyle(0xfff3a6, 1)
    // Keep this texture generation API-safe across Phaser 3 versions.
    g.fillCircle(2, 2, 2)
    g.generateTexture('particle', 4, 4)

    g.destroy()
  }
}
