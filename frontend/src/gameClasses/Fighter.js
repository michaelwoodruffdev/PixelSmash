class Fighter {
    // constructor
    constructor(characterObject, scene) {
        // members
        this.scene = scene;

        this.sprite = null;
        this.isFalling = true;
        this.isWalking = false;
        this.config = characterObject;
        this.config.fighterKey += 'sampleusername';

        this.velocityX = 0;

        this.jumpCount = 1;
        this.isMidair = true;

        this.deathCount = 0;
    }

    // loading spritesheet data
    loadSpritesheet() {
        this.scene.load.spritesheet(this.config.fighterKey, this.config.spritesheetPath, this.config.frameDimensions);
    }

    loadAnimations() {
        this.config.spriteSheetAnimations.forEach(animation => {
            this.scene.anims.create({
                key: this.config.fighterKey + animation.key,
                frames: this.scene.anims.generateFrameNumbers(this.config.fighterKey, animation.frames),
                frameRate: animation.frameRate,
                repeat: animation.repeat
            });
        });
    }

    // adding sprite and collisions
    addSprite(x, y) {
        this.sprite = this.scene.physics.add.sprite(x, y, this.config.fighterKey);
        this.sprite.setMass(this.configmass);
        this.sprite.setSize(this.config.hitboxDimensions.x, this.config.hitboxDimensions.y);
        this.sprite.setScale(this.config.scale);

        return this.sprite;
    }

    land() {
        this.isMidair = false;
        this.isFalling = false;
        this.jumpCount = 0;
        this.sprite.anims.play(this.config.fighterKey + 'idle');
    }

    addPlatformCollisions(passablePlatforms, impassablePlatforms) {
        this.passableCollision = this.scene.physics.add.collider(this.sprite, passablePlatforms, () => {
            if (this.sprite.body.onFloor() === true) {
                if (this.isMidair) {
                    this.land();
                }
            }
        },
            (player, platform) => {
                // conditionally pass through platform (in this case if player is moving upwards below platform)
                if (player.y + 20 > platform.y || this.sprite.body.velocity.y < 0) {
                    return false;
                }
                return true;
            });

        this.impassableCollision = this.scene.physics.add.collider(this.sprite, impassablePlatforms, (player, platform) => {
            if (this.sprite.body.onFloor() === true) {
                if (this.isMidair) {
                    this.land();
                }
            }
        });
    }


    addControls(controls) {
        this.upKey = this.scene.input.keyboard.addKey(controls.keys.up);
        this.downKey = this.scene.input.keyboard.addKey(controls.keys.down);
        this.leftKey = this.scene.input.keyboard.addKey(controls.keys.left);
        this.rightKey = this.scene.input.keyboard.addKey(controls.keys.right);

        this.jumpKey = this.scene.input.keyboard.addKey(controls.keys.jump);
        this.jumpKey.isPressedWithoutRelease = false;
        this.jumpKey.on('down', (event) => {
            if (!this.jumpKey.isPressedWithoutRelease && this.jumpCount < 2) {
                // jump key was pressed
                this.jumpKey.isPressedWithoutRelease = true;
                // first jump
                if (this.jumpCount === 0) {
                    this.sprite.setVelocityY(this.config.jumpHeights.first);
                    this.sprite.anims.play(this.config.fighterKey + 'firstjump');
                }
                // double jump
                else if (this.jumpCount === 1) {
                    this.sprite.setVelocityY(this.config.jumpHeights.second);
                    this.sprite.anims.play(this.config.fighterKey + 'secondjump');
                }
                this.jumpCount += 1;
                this.isFalling = false;
                this.isWalking = false;
                this.isMidair = true;
            }
        });
        this.jumpKey.on('up', (event) => {
            if (this.jumpKey.isPressedWithoutRelease) {
                this.jumpKey.isPressedWithoutRelease = false;
            }
        });
    }

    // handle input each frame
    handleWalk(socketcontext) {
        // left key input
        if (this.leftKey.isDown) {
            socketcontext.emit('leftPressed', this.config.fighterKey);
            if (this.sprite.body.onFloor()) {
                this.velocityX = -this.config.movementSpeed;
            } else {
                if (this.velocityX > -200) {
                    this.velocityX -= 70;
                }
            }
        }
        // right key input
        else if (this.rightKey.isDown) {
            if (this.sprite.body.onFloor()) {
                this.velocityX = this.config.movementSpeed;
            } else {
                if (this.velocityX < 200) {
                    this.velocityX += 70;
                }
            }
        }
        // no left or right input
        else {
            if (this.sprite.body.onFloor()) {
                this.velocityX = 0;
            }
        }
        this.sprite.setVelocityX(this.velocityX);
    }

    checkMovementState() {
        // midair
        if (!this.sprite.body.onFloor()) {
            if (this.sprite.body.deltaY() > 0 && !this.isFalling) {
                this.isFalling = true;
                this.isMidair = true;
                this.isWalking = false;
                this.sprite.anims.play(this.config.fighterKey + 'falling');
            }
            if (this.jumpCount === 0) {
                this.jumpCount = 1;
            }
        }
        // on ground 
        else {
            // idle
            if (this.sprite.body.deltaX() === 0 && this.isWalking) {
                this.isWalking = false;
                this.sprite.anims.play(this.config.fighterKey + 'idle');
            }
            // walking
            else if (this.sprite.body.deltaX() !== 0 && !this.isWalking) {
                // right
                if (this.sprite.body.deltaX() > 0) {
                    this.sprite.setFlipX(false);
                    this.sprite.anims.play(this.config.fighterKey + 'right');
                }
                // left
                else if (this.sprite.body.deltaX() < 0) {
                    this.sprite.setFlipX(true);
                    this.sprite.anims.play(this.config.fighterKey + 'left');
                }
                this.isWalking = true;
            }
        }
    }


    checkDeath() {
        if (this.sprite.y > 1100 || this.sprite.x < -550 || this.sprite.x > 1650) {
            this.sprite.setVelocityY(0);
            this.sprite.y = 200;
            this.sprite.x = 600;
            this.deathCount++;
        }
    }
}

export default Fighter;