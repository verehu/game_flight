import Phaser from 'phaser'
import './style.css'
import { GAME_CONFIG } from './game/config'
import { BootScene } from './scenes/BootScene'
import { GameScene } from './scenes/GameScene'
import { UIScene } from './scenes/UIScene'

const app = document.querySelector('#app')
app.innerHTML = ''

// #region agent log
fetch('http://127.0.0.1:7242/ingest/37d80bce-582f-43d7-887b-668ec130d0ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'startup-debug',hypothesisId:'H5',location:'main.js:before-new-game',message:'Initializing Phaser.Game',data:{hasApp:Boolean(app),appChildren:app?.childElementCount ?? null},timestamp:Date.now()})}).catch(()=>{})
// #endregion

new Phaser.Game({
  ...GAME_CONFIG,
  parent: app,
  scene: [BootScene, GameScene, UIScene]
})
