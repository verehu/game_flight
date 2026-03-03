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
        color: '#b8d2f3',
        stroke: '#0a1220',
        strokeThickness: 4
      })
      .setDepth(100)

    this.livesText = this.add
      .text(GAME_WIDTH - 16, 14, 'Hull: 3', {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#b8d2f3',
        stroke: '#0a1220',
        strokeThickness: 4
      })
      .setOrigin(1, 0)
      .setDepth(100)

    this.hintText = this.add
      .text(
        GAME_WIDTH / 2,
        66,
        'Control: WASD / Arrows / Drag\nSupply: 1/2/3  Radio: M',
        {
          fontFamily: 'Arial',
          fontSize: '20px',
          color: '#89a8cf',
          align: 'center',
          stroke: '#0a1220',
          strokeThickness: 4
        }
      )
      .setOrigin(0.5, 0)
      .setDepth(100)

    this.audioText = this.add
      .text(GAME_WIDTH / 2, 102, 'Radio: ON', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#89a8cf',
        stroke: '#0a1220',
        strokeThickness: 4
      })
      .setOrigin(0.5, 0)
      .setDepth(100)

    this.stageText = this.add
      .text(GAME_WIDTH / 2, 126, 'Sector A - 18s', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffba6b',
        stroke: '#0a1220',
        strokeThickness: 4
      })
      .setOrigin(0.5, 0)
      .setDepth(100)

    this.fireText = this.add
      .text(16, 160, 'Fire Lv: 1', {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: '#7fc4ff',
        stroke: '#0a1220',
        strokeThickness: 4
      })
      .setDepth(100)

    this.shieldText = this.add
      .text(GAME_WIDTH - 16, 160, 'Shield: 0s', {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: '#70d8a5',
        stroke: '#0a1220',
        strokeThickness: 4
      })
      .setOrigin(1, 0)
      .setDepth(100)

    this.bossBarBg = this.add.rectangle(GAME_WIDTH / 2, 190, 340, 14, 0x26354b).setDepth(100)
    this.bossBarFill = this.add.rectangle(GAME_WIDTH / 2 - 170, 190, 340, 10, 0xff6d57).setDepth(101)
    this.bossBarFill.setOrigin(0, 0.5)
    this.bossBarBg.setVisible(false)
    this.bossBarFill.setVisible(false)

    gameScene.events.on('score-changed', (score) => {
      this.scoreText.setText(`Score: ${score}`)
    })

    gameScene.events.on('lives-changed', (lives) => {
      this.livesText.setText(`Hull: ${lives}`)
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
      this.audioText.setText(`Radio: ${muted ? 'MUTED' : 'ON'}`)
    })
  }
}
