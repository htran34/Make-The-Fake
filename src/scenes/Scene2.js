class Scene2 extends Phaser.Scene {
    constructor() {
        super("CARD SHOP")
    }

    preload() {
        // load images/tile sprites
        this.load.image('player2', './assets/playerBig.png')
        this.load.image('background2', './assets/background2.png')
        this.load.audio('music', './assets/backgroundMusic.wav')
    }

    create() {
        // boolean to check if game has to be restarted from a player loss
        this.gameEnded = false;

        // // display score
        // this.scoreDisplay = this.add.text(50, 50, 'CARDS COLLECTED: ' + score)
        // this.scoreDisplay.setDepth(999)

        // deactivate & reset space key capture from menu
        this.input.keyboard.removeCapture('SPACE')
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        // play music
        this.music = this.sound.play('music', soundConfig)

        // load background image
        this.add.image(320, 240, 'background2')

        // load player sprite
        this.add.image(300, 350, 'player2')
    }

    update() {
      if (Phaser.Input.Keyboard.JustDown(keySpace)) {
          this.scene.start('selectScene')
      }
    }
}