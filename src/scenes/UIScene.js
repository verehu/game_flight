import Phaser from 'phaser'
import { GAME_WIDTH } from '../game/config'

const MODE_COLORS = {
  normal: '#d3c3ff',
  laser: '#7df7ff',
  spread: '#9cb8ff',
  homing: '#84ffc8',
  pierce: '#ffcc8a',
  boomerang: '#d8abff'
}

export class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene')
  }

  create() {
    const gameScene = this.scene.get('GameScene')
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/37d80bce-582f-43d7-887b-668ec130d0ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'startup-debug',hypothesisId:'H4',location:'UIScene.js:create-enter',message:'UIScene create entered',data:{hasGameScene:Boolean(gameScene),gameSceneActive:this.scene.isActive('GameScene')},timestamp:Date.now()})}).catch(()=>{})
    // #endregion

    this.add.rectangle(18, 10, GAME_WIDTH - 36, 208, 0x061120, 0.46).setOrigin(0, 0).setDepth(96)
    this.add.rectangle(18, 10, GAME_WIDTH - 36, 208, 0x6ec6ff, 0.12).setOrigin(0, 0).setDepth(97)
    this.add.rectangle(18, 10, GAME_WIDTH - 36, 1, 0x8fd6ff, 0.48).setOrigin(0, 0).setDepth(98)

    this.scoreText = this.add
      .text(16, 14, 'Score: 0', {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#d2e8ff',
        stroke: '#0a1220',
        strokeThickness: 4
      })
      .setDepth(100)

    this.livesText = this.add
      .text(GAME_WIDTH - 16, 14, 'Hull: 3', {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#d2e8ff',
        stroke: '#0a1220',
        strokeThickness: 4
      })
      .setOrigin(1, 0)
      .setDepth(100)

    this.hintText = this.add
      .text(
        GAME_WIDTH / 2,
        66,
        'Control: WASD / Arrows / Drag\nUltimate: SPACE  Radio: M',
        {
          fontFamily: 'Arial',
          fontSize: '19px',
          color: '#a8c8ef',
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
        color: '#a8c8ef',
        stroke: '#0a1220',
        strokeThickness: 4
      })
      .setOrigin(0.5, 0)
      .setDepth(100)

    this.stageText = this.add
      .text(GAME_WIDTH / 2, 126, 'Sector A - 18s', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffc27c',
        stroke: '#0a1220',
        strokeThickness: 4
      })
      .setOrigin(0.5, 0)
      .setDepth(100)

    this.fireText = this.add
      .text(16, 160, 'Fire Lv: 1', {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: '#7ad7ff',
        stroke: '#0a1220',
        strokeThickness: 4
      })
      .setDepth(100)

    this.shieldText = this.add
      .text(GAME_WIDTH - 16, 160, 'Shield: 0s', {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: '#7ce3b7',
        stroke: '#0a1220',
        strokeThickness: 4
      })
      .setOrigin(1, 0)
      .setDepth(100)

    this.weaponModeText = this.add
      .text(16, 186, 'Mode: NORMAL', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#d3c3ff',
        stroke: '#0a1220',
        strokeThickness: 4
      })
      .setDepth(100)

    this.ultimateText = this.add
      .text(GAME_WIDTH - 16, 186, 'Ultimate: 0%', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#ffd08d',
        stroke: '#0a1220',
        strokeThickness: 4
      })
      .setOrigin(1, 0)
      .setDepth(100)

    this.bossBarBg = this.add.rectangle(GAME_WIDTH / 2, 190, 340, 14, 0x261a35).setDepth(100)
    this.bossBarFill = this.add.rectangle(GAME_WIDTH / 2 - 170, 190, 340, 10, 0xff5f8f).setDepth(101)
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

    gameScene.events.on('weapon-mode-changed', (mode, remainSec) => {
      const label = mode ? mode.toUpperCase() : 'NORMAL'
      this.weaponModeText.setColor(MODE_COLORS[mode] || MODE_COLORS.normal)
      if (mode && mode !== 'normal' && remainSec > 0) {
        this.weaponModeText.setText(`Mode: ${label} ${remainSec}s`)
        return
      }
      this.weaponModeText.setText('Mode: NORMAL')
    })

    gameScene.events.on('ultimate-changed', (charge, maxCharge) => {
      const pct = Math.round((charge / Math.max(maxCharge, 1)) * 100)
      this.ultimateText.setColor(pct >= 100 ? '#fff2b8' : '#ffd08d')
      this.ultimateText.setText(pct >= 100 ? 'Ultimate: READY' : `Ultimate: ${pct}%`)
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
