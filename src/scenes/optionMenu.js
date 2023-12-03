class optionMenu extends Phaser.Scene {
    constructor() {
        super("selectScene")
    }
  
    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
    }
  
    preload() {
        // load images/tile sprites
        this.load.image('player', './assets/player.png')
        this.load.image('background1', './assets/background.png')
        this.load.audio('music', './assets/backgroundMusic.wav')
        this.load.image("glass-panel", "assets/PNG/glassPanel.png")
        this.load.image("cursor-hand", "assets/PNG/cursor_hand.png")
    }
  
    toggleButtons(objects) {
        if (objects[0].visible) {
            for (let i=0; i<objects.length; i+=1) {
                objects[i].setVisible(false)
            }
            this.buttonsActive = false
        }
        else {
            for (let i=0; i<objects.length; i+=1) {
                objects[i].setVisible(true)
            }
            this.buttonsActive = true
        }
    }

    create() {
        this.buttonsActive = true
        this.travelActive = false, this.questActive = false, this.checkActive = false
        this.buttons = []
        this.selectedButtonIndex = 0

        // Grab & display current scene background image
        let scenes = [NaN, 'background1']
        let cities = [NaN, 'MASSADORA', 'CARD SHOP', 'BUNZEN', 'AIAI', 'BADLANDS']
        this.add.image(320, 240, scenes[currentScene])
        
        const { width, height } = this.scale
    
        //================================================================
        /* BUTTON DEFINITIONS */
        // Travel button
        this.travelButton = this.add
            .image(width * 0.5, height * 0.6, "glass-panel")
            .setDisplaySize(150, 50)
    
        this.travelButtonText = this.add.text(this.travelButton.x, this.travelButton.y, "Travel").setOrigin(0.5)
    
        // Quest button
        this.questButton = this.add
            .image(
              this.travelButton.x,
              this.travelButton.y + this.travelButton.displayHeight + 10,
              "glass-panel"
            )
            .setDisplaySize(150, 50)
    
        this.questButtonText = this.add.text(this.questButton.x, this.questButton.y, "Enter Quest").setOrigin(0.5)
    
        // Check Cards button
        this.checkCardsButton = this.add
            .image(
              this.questButton.x,
              this.questButton.y + this.questButton.displayHeight + 10,
              "glass-panel"
            )
            .setDisplaySize(150, 50)
    
        this.checkCardsButtonText = this.add.text(this.checkCardsButton.x, this.checkCardsButton.y, "Check Cards").setOrigin(0.5)
    
        this.buttons.push(this.travelButton)
        this.buttons.push(this.questButton)
        this.buttons.push(this.checkCardsButton)
        this.buttonSelector = this.add.image(0, 0, "cursor-hand")
        this.selectButton(0)

        let objects = [
          this.travelButton, 
          this.travelButtonText,
          this.questButton,
          this.questButtonText,
          this.checkCardsButton,
          this.checkCardsButtonText,
          this.buttonSelector
        ]
    
        this.travelButton.on("selected", () => {
            this.toggleButtons(objects)
            this.travelActive = true
            this.currentCityText = this.add.text(100, 350, "You are currently in the city of " +cities[currentScene])
            this.travelDirectionsText = this.add.text(100, 375, "Where would you like to travel? (Use arrow keys)")
            // Grab adjacent cities
            if (currentScene == 1) {
                this.adjacentCities = [cities[2]]
            }
            else if (currentScene == (cities.length - 1)) {
                this.adjacentCities = [cities[cities.length - 2]]
            }
            else {
                this.adjacentCities = [cities[currentScene - 1], cities[currentScene + 1]]
            }
            if (this.adjacentCities.length == 1) {
                this.arrowOptionsText = this.add.text(100, 400, this.adjacentCities[0] + "<-  |  ->OTHER")
            }
            else {
                this.arrowOptionsText = this.add.text(100, 400, this.adjacentCities[0] + "<-  |  OTHER ^  |  ->" + this.adjacentCities[1])
            }
        })
    
        this.questButton.on("selected", () => {
            console.log("settings")
        })
    
        this.checkCardsButton.on("selected", () => {
            console.log("credits")
        })
    }
  
    selectButton(index) {
        const currentButton = this.buttons[this.selectedButtonIndex]
        currentButton.setTint(0xffffff)
        const button = this.buttons[index]
        button.setTint(0x66ff7f)
        this.buttonSelector.x = button.x + button.displayWidth * 0.5
        this.buttonSelector.y = button.y + 10
        this.selectedButtonIndex = index
    }
  
    selectNextButton(change = 1) {
        let index = this.selectedButtonIndex + change
        if (index >= this.buttons.length) {
            index = 0
        } else if (index < 0) {
            index = this.buttons.length - 1
        }
  
        this.selectButton(index)
    }
  
    confirmSelection() {
        const button = this.buttons[this.selectedButtonIndex]
        button.emit("selected")
    }
  
    update() {
        // Activates button functionality
        if (this.buttonsActive) {
            const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
            const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down)
            const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        
            if (upJustPressed) {
                this.selectNextButton(-1)
            } else if (downJustPressed) {
                this.selectNextButton(1)
            } else if (spaceJustPressed) {
                this.confirmSelection()
            }
        }
        // Travel button functionality
        if (this.travelActive) {
            const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
            const leftJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.left)
            const rightJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.right)
            
            // Removes previous text
            if (((this.adjacentCities.length == 1) && (leftJustPressed || rightJustPressed)) 
            || ((this.adjacentCities.length == 2) && (upJustPressed))) {
                    this.currentCityText.setVisible(false)
                    this.travelDirectionsText.setVisible(false)
                    this.arrowOptionsText.setVisible(false)
            }
            
            // LEFT arrow option
            if (leftJustPressed) {
                this.adjacentCityText = this.add.text(100, 350, "Going to adjacent city "+this.adjacentCities[0])
                this.scene.start(this.adjacentCities[0])
            }

            // RIGHT arrow option
            else if (rightJustPressed) {
                // Go to ANY city with accompany if adjacent cities = 1
                if (this.adjacentCities.length == 1) {
                    this.useAccompanyText = this.add.text(100, 350, "Use a copy of Accompany to travel to any city?")
                    this.accompanyOptionText = this.add.text(100, 375, "YES  <-  |  ->NO")
                    // Consume a copy of accompany if player has any remaining
                    if (leftJustPressed) {
                        if (accompanies[player] >= 1) {
                            accompanies[player] -= 1
                            this.useAccompanyText.setVisible(false)
                            this.accompanyOptionText.setVisible(false)
                            this.consumeAccompanyText = this.add.text(100, 350, "Using a copy of accompany, you have "+accompanies[player]+" copies remaining.")
                            this.destinationText = this.add.text(100, 375, "Where would you like to go?")
                        }
                        else {
                            this.useAccompanyText.setVisible(false)
                            this.accompanyOptionText.setVisible(false)
                            this.noAccompaniesText = this.add.text(100, 350, "You have no copies of accompany remaining.")
                            //return
                        }
                    }
                    // Go back if player has no accompanies remaining
                    else if (rightJustPressed) {
                        //return
                    }
                }

                // Go to adjacent city if adjacent cities = 2
                else {
                    this.adjacentCityText = this.add.text(100, 350, "Going to adjacent city "+this.adjacentCities[1])
                    this.scene.start(this.adjacentCities[1])
                }
            }

            // UP arrow option
            else if (upJustPressed && (this.adjacentCities.length == 2)) {
                this.useAccompanyText = this.add.text(100, 350, "Use a copy of Accompany to travel to any city?")
                this.accompanyOptionText = this.add.text(100, 375, "YES  <-  |  ->NO")
                // Consume a copy of accompany if player has any remaining
                if (leftJustPressed) {
                    if (accompanies[player] >= 1) {
                        accompanies[player] -= 1
                        this.useAccompanyText.setVisible(false)
                        this.accompanyOptionText.setVisible(false)
                        this.consumeAccompanyText = this.add.text(100, 350, "Using a copy of accompany, you have "+accompanies[player]+" copies remaining.")
                        this.destinationText = this.add.text(100, 375, "Where would you like to go?")
                    }
                    else {
                        this.useAccompanyText.setVisible(false)
                        this.accompanyOptionText.setVisible(false)
                        this.noAccompaniesText = this.add.text(100, 350, "You have no copies of accompany remaining.")
                        //return
                    }
                }
                // Go back if player has no accompanies remaining
                else if (rightJustPressed) {
                    //return
                }
            }
        }
    }
}