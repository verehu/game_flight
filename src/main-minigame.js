import Phaser from 'phaser'
import { GAME_CONFIG } from './game/config'
import { BootScene } from './scenes/BootScene'
import { GameScene } from './scenes/GameScene'
import { UIScene } from './scenes/UIScene'

const game = new Phaser.Game({
  ...GAME_CONFIG,
  type: Phaser.CANVAS,
  canvas: canvas,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height
  },
  scene: [BootScene, GameScene, UIScene],
  audio: {
    disableWebAudio: true
  }
})

export default game
