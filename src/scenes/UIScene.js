import Phaser from 'phaser'
import { GAME_WIDTH } from '../game/config'

export class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene')
  }

  create() {
    const gameScene = this.scene.get('GameScene')

    this.scoreText = this.add
      .text(16, 14, 'Score: 0', {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#4a3a69',
        stroke: '#ffffff',
        strokeThickness: 4
      })
      .setDepth(100)

    this.livesText = this.add
      .text(GAME_WIDTH - 16, 14, 'Lives: 3', {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#4a3a69',
        stroke: '#ffffff',
        strokeThickness: 4
      })
      .setOrigin(1, 0)
      .setDepth(100)

    this.hintText = this.add
      .text(
        GAME_WIDTH / 2,
        66,
        'Move: WASD / Arrows / Drag\nShop: 1/2/3  Music: M',
        {
          fontFamily: 'Arial',
          fontSize: '20px',
          color: '#6f65a3',
          align: 'center',
          stroke: '#ffffff',
          strokeThickness: 4
        }
      )
      .setOrigin(0.5, 0)
      .setDepth(100)

    this.audioText = this.add
      .text(GAME_WIDTH / 2, 102, 'Audio: ON', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#6f65a3',
        stroke: '#ffffff',
        strokeThickness: 4
      })
      .setOrigin(0.5, 0)
      .setDepth(100)

    this.stageText = this.add
      .text(GAME_WIDTH / 2, 126, 'Wave 1 - 18s', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ff89bd',
        stroke: '#ffffff',
        strokeThickness: 4
      })
      .setOrigin(0.5, 0)
      .setDepth(100)

    this.fireText = this.add
      .text(16, 160, 'Fire Lv: 1', {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: '#56a8dd',
        stroke: '#ffffff',
        strokeThickness: 4
      })
      .setDepth(100)

    this.shieldText = this.add
      .text(GAME_WIDTH - 16, 160, 'Shield: 0s', {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: '#57b682',
        stroke: '#ffffff',
        strokeThickness: 4
      })
      .setOrigin(1, 0)
      .setDepth(100)

    this.bossBarBg = this.add.rectangle(GAME_WIDTH / 2, 190, 340, 14, 0xffd8ef).setDepth(100)
    this.bossBarFill = this.add.rectangle(GAME_WIDTH / 2 - 170, 190, 340, 10, 0xff9fcd).setDepth(101)
    this.bossBarFill.setOrigin(0, 0.5)
    this.bossBarBg.setVisible(false)
    this.bossBarFill.setVisible(false)

    gameScene.events.on('score-changed', (score) => {
      this.scoreText.setText(`Score: ${score}`)
    })

    gameScene.events.on('lives-changed', (lives) => {
      this.livesText.setText(`Lives: ${lives}`)
    })

    gameScene.events.on('fire-changed', (fireLevel) => {
      this.fireText.setText(`Fire Lv: ${fireLevel}`)
    })

    gameScene.events.on('shield-changed', (seconds) => {
      this.shieldText.setText(`Shield: ${seconds}s`)
    })

    gameScene.events.on('boss-hp-changed', (ratio) => {
      const visible = ratio !== null
      this.bossBarBg.setVisible(visible)
      this.bossBarFill.setVisible(visible)

      if (!visible) return
      this.bossBarFill.width = Phaser.Math.Clamp(340 * ratio, 0, 340)
    })

    gameScene.events.on('stage-changed', (label) => {
      this.stageText.setText(label)
    })

    gameScene.events.on('audio-changed', (muted) => {
      this.audioText.setText(`Audio: ${muted ? 'MUTED' : 'ON'}`)
    })
  }
}
