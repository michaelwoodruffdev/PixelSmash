class Fighter {
    // constructor
    constructor(characterObject, scene) {
        // members
        this.scene = scene;

        this.sprite = null;
        this.isFalling = true;
        this.isWalking = false;
        this.config = characterObject;

        this.jumpCount = 1;
        this.isMidair = true;

        this.deathCount = 0;
    }

    // loading spritesheet data
    loadSpritesheet() {
        console.log('loading spritesheet for ' + this.config.fighterKey);
        this.scene.load.spritesheet(this.config.fighterKey, this.config.spritesheetPath, this.config.frameDimensions);
    }
    loadAnimations() {
        console.log('loading animations for ' + this.config.fighterKey);
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
        console.log('adding sprite to scene for ' + this.config.fighterKey);
        this.sprite = this.scene.physics.add.sprite(x, y, this.config.fighterKey);
        this.sprite.setMass(this.configmass);
        this.sprite.setSize(this.config.hitboxDimensions.x, this.config.hitboxDimensions.y);
        this.sprite.setScale(this.config.scale);

        return this.sprite;
    }
    addPlatformCollisions(passablePlatforms, impassablePlatforms) {
        this.passableCollision = this.scene.physics.add.collider(this.sprite, passablePlatforms, () => {
            if (this.sprite.body.onFloor() === true) {
                if (this.isMidair) {
                    console.log('landeddd');
                    this.isMidair = false;
                    // this.isWalking = true;
                    this.isFalling = false;
                    this.jumpCount = 0;
                    this.sprite.anims.play(this.config.fighterKey + 'idle');
                }
            }
        },
            (player, platform) => {
                if (player.y + 20 > platform.y || this.sprite.body.velocity.y < 0) {
                    return false;
                }
                return true;
            });

        this.impassableCollision = this.scene.physics.add.collider(this.sprite, impassablePlatforms, (player, platform) => {
            if (this.sprite.body.onFloor() === true) {
                if (this.isMidair) {
                    console.log('landeddd');
                    this.isMidair = false;
                    // this.isWalking = true;
                    this.isFalling = false;
                    this.jumpCount = 0;
                    this.sprite.anims.play(this.config.fighterKey + 'idle');
                }
                // if (!this.isWalking) {
                //     this.isWalking = true;
                // }
            }
        });
    }

    // handle input each frame
    handleInput() {
        if (this.cursor.left.isDown) {
            if (this.jumpCount === 0) {
                // this.sprite.anims.play(this.config.fighterKey + 'left', true);
            }
            this.sprite.setVelocityX(-this.config.movementSpeed);
            this.sprite.setFlipX(true);
            // console.log('left');
        }
        else if (this.cursor.right.isDown) {
            if (this.jumpCount === 0) {
                // this.sprite.anims.play(this.config.fighterKey + 'right', true);
            }
            this.sprite.setVelocityX(this.config.movementSpeed);
            this.sprite.setFlipX(false);
        }
        else {
            if (this.sprite.body.onFloor()) {
                // this.sprite.anims.play(this.config.fighterKey + 'idle');
            }
            this.sprite.setVelocityX(0);
        }
    }

    checkAnimation() {
        // console.log(this.sprite.body.deltaY());
        // if (this.sprite.body.deltaY() < .5 && this.isMidair) {
        //     console.log('landed');
        //     this.sprite.anims.play(this.config.fighterKey + 'falling');
        //     this.isMidair = false;
        // }
        if (!this.sprite.body.onFloor()) {
            // console.log('2');
            if (this.sprite.body.deltaY() > 0 && !this.isFalling) {
                this.isFalling = true;
                this.isMidair = true;
                this.isWalking = false;
                this.sprite.anims.play(this.config.fighterKey + 'falling');
            }
            if (this.jumpCount === 0) {
                console.log('hey');
                this.jumpCount = 1;
            }
        } else {
            if (this.sprite.body.deltaX() === 0 && this.isWalking) {
                this.isWalking = false;
                this.sprite.anims.play(this.config.fighterKey + 'idle');
            } else if (this.sprite.body.deltaX() !== 0 && !this.isWalking) {
                if (this.sprite.body.deltaX() > 0) {
                    this.sprite.anims.play(this.config.fighterKey + 'right');
                } else if (this.sprite.body.deltaX() < 0) {
                    this.sprite.anims.play(this.config.fighterKey + 'left');
                }
                this.isWalking = true;
            }
        }
    }

    createCursorEvents() {
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.cursor.space.isPressedWithoutRelease = false;
        this.cursor.space.onDown = (e) => {
            if (!this.cursor.space.isPressedWithoutRelease && this.jumpCount < 2) {
                if (this.jumpCount === 0) {
                    this.sprite.setVelocityY(this.config.jumpHeights.first);
                    this.sprite.anims.play(this.config.fighterKey + 'firstjump');
                }
                else if (this.jumpCount === 1) {
                    this.sprite.setVelocityY(this.config.jumpHeights.second);
                    this.sprite.anims.play(this.config.fighterKey + 'secondjump');
                }
                this.jumpCount += 1;
                this.cursor.space.isPressedWithoutRelease = true;
                this.isFalling = false;
                this.isWalking = false;
                console.log('true jump');
                this.isMidair = true;
            }
        }


        this.cursor.space.onUp = (e) => {
            this.cursor.space.isPressedWithoutRelease = false;
        }
    }

    checkDeath() {
        if (this.sprite.y > 800 || this.sprite.x < -250 || this.sprite.x > 1450) {
            this.sprite.setVelocityY(0);
            this.sprite.y = 400;
            this.sprite.x = 600;
            this.deathCount++;
        }
    }
}

export default Fighter;