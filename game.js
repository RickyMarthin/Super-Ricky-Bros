/* Global Phaser */

import { createAnimations } from "./animations.js"
import { checkControls } from "./controls.js"

const config = {
  autoFocus: false,
  type: Phaser.AUTO, // webgl, canvas
  width: 256,
  height: 244,
  backgroundColor: '#049cd8',
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 300},
      debug: false
    }
  },
  scene: {
    preload, // se ejecuta para precargar los recursos del juego
    create, // se ejecuta cuando el juego comienza
    update // se ejecuta en cada frame
  }
}

new Phaser.Game(config)
// this -> this -> el juego que estamos cargando

function preload() { // 1.
  // image(x, y, id-del-asset)
  this.load.image (
    'cloud1',
    'assets/scenery/overworld/cloud1.png'
  )

  this.load.image (
    'floorbricks',
    'assets/scenery/overworld/floorbricks.png'
  )

  this.load.spritesheet(
    'mario',
    'assets/entities/mario.png',
    { frameWidth:18, frameHeight:16 }
  )        

  this.load.audio(
    'gameover',
    'assets/sound/music/gameover.mp3'
  )
}

function create() { // 2.
  this.add.image(100, 50, 'cloud1')
    .setOrigin(0, 0)
    .setScale(0.15)

  this.floor = this.physics.add.staticGroup()

  this.floor
    .create(0, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody()        

  this.floor
    .create(150, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody()        

  // this.mario = this.add.sprite(50, 210, 'mario')
  // .setOrigin(0, 1);

  this.mario = this.physics.add.sprite(50, 210, 'mario')
    .setOrigin(0, 1)
    .setGravityY(300)
    .setCollideWorldBounds(true)

  this.physics.world.setBounds(0, 0, 2000, config.height)
  this.physics.add.collider(this.mario, this.floor)

  this.cameras.main.setBounds(0, 0, 2000, config.height)
  this.cameras.main.startFollow(this.mario)

  createAnimations(this)

  this.keys = this.input.keyboard.createCursorKeys()
}

function update() { // 3. continuamente
  checkControls(this)

  const { mario, sound, scene } = this

  // check is mario is dead
  if (mario.isDead) return
  
  if (mario.y >= config.height) {
    mario.isDead = true
    mario.anims.play('mario-dead');
    mario.setCollideWorldBounds(false);
    this.sound.add('gameover', { volume: 0.2 }).play(); 

    setTimeout(() => {
      mario.setVelocityY(-250);
    }, 100)

    setTimeout(() => {
      this.scene.restart()
    }, 8000)
  }
}