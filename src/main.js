import Phaser from 'phaser'
import './style.css'
import { GAME_CONFIG } from './game/config'
import { BootScene } from './scenes/BootScene'
import { GameScene } from './scenes/GameScene'
import { UIScene } from './scenes/UIScene'

const app = document.querySelector('#app')
app.innerHTML = ''

new Phaser.Game({
  ...GAME_CONFIG,
  parent: app,
  scene: [BootScene, GameScene, UIScene]
})
