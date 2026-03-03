import Phaser from 'phaser'

export const GAME_WIDTH = 540
export const GAME_HEIGHT = 960

export const GAME_CONFIG = {
  type: Phaser.AUTO,
  backgroundColor: '#fff3fa',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
}
