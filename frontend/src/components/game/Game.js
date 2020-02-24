import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import './Game.css';

export default class Game extends React.Component {

    constructor(props) {
        super(props);

        let { player1Prop } = props;

        this.state = {
            unmounted: true,
            initialize: true,
            game: {
                width: 1200,
                height: 675,
                type: Phaser.AUTO,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 900 },
                        debug: false
                    }
                },
                scene: {
                    init: function () {
                        this.cameras.main.setBackgroundColor('#24252A')
                    },
                    preload: function () {
                        this.load.spritesheet('player1', player1Prop.spritesheetPath, { frameWidth: player1Prop.frameDimensions.x, frameHeight: player1Prop.frameDimensions.y });
                        this.load.image('background', 'assets/background.png');
                        this.load.image('ground', 'assets/ground.png');
                        // this.load.spritesheet('ledgeGrabBox', 'assets/box.png', { frameWidth: 300, frameHeight: 300 });
                    },
                    create: function () {

                        // background
                        this.background = this.add.image(600, 337.5, 'background');

                        // platforms
                        this.passablePlatforms = this.physics.add.staticGroup();
                        this.passablePlatforms.create(350, 400, 'ground').setScale(.2).refreshBody();
                        this.passablePlatforms.create(850, 400, 'ground').setScale(.2).refreshBody();

                        this.impassablePlatforms = this.physics.add.staticGroup();
                        this.impassablePlatforms.create(600, 550, 'ground').setScale(.75).refreshBody();

                        // player
                        this.player1 = this.physics.add.sprite(600, 400, 'player1');
                        // this.player1.setBounce(.2, .2);
                        // this.player1.setCollideWorldBounds(true);
                        this.player1.setMass(player1Prop.mass);
                        this.player1.jumpCount = 1;
                        this.player1.isMidair = true;
                        this.player1.setSize(player1Prop.hitboxDimensions.x, player1Prop.hitboxDimensions.y);
                        this.player1.setScale(player1Prop.scale);

                        this.player1.ledgeGrabBox = this.physics.add.sprite(this.player1.x + this.player1.body.halfWidth * 1.75, this.player1.y, 'ledgeGrabBox');
                        this.player1.ledgeGrabBox.setScale(.1, .15);
                        // this.player1.ledgeGrabBox.setSize(10, 10);

                        player1Prop.spriteSheetAnimations.forEach(animation => {
                            this.anims.create({
                                key: animation.key,
                                frames: this.anims.generateFrameNumbers('player1', { start: animation.frames.start, end: animation.frames.end }),
                                frameRate: animation.frameRate,
                                repeat: animation.repeat
                            });
                        })

                        // this.anims.create({
                        //     key: 'left',
                        //     frames: this.anims.generateFrameNumbers('player1', { start: 18, end: 23 }),
                        //     frameRate: 10,
                        //     repeat: -1
                        // });
                        // this.anims.create({
                        //     key: 'right',
                        //     frames: this.anims.generateFrameNumbers('player1', { start: 6, end: 11 }),
                        //     frameRate: 10,
                        //     repeat: -1
                        // });
                        // this.anims.create({
                        //     key: 'idle',
                        //     frames: this.anims.generateFrameNumbers('player1', { start: 4, end: 5 }),
                        //     frameRate: 3,
                        //     repeat: -1
                        // });
                        // this.anims.create({
                        //     key: 'jump',
                        //     frames: this.anims.generateFrameNumbers('player1', { start: 0, end: 5 }),
                        //     frameRate: 15,
                        //     repeat: 1
                        // });

                        this.anims.create({
                            key: 'ledgeGrabBoxIdle',
                            frames: this.anims.generateFrameNumbers('ledgeGrabBox', { start: 0, end: 0 }),
                            frameRate: 1,
                            repeat: -1
                        });

                        // text
                        this.helloWorld = this.add.text(
                            this.cameras.main.centerX,
                            this.cameras.main.centerY,
                            "PixelSmash", {
                            font: "40px Arial",
                            fill: "#ffffff"
                        }
                        );
                        this.helloWorld.setOrigin(0.5);
                        this.counter = 0;

                        // physics collisions
                        this.passableCollision = this.physics.add.collider(this.player1, this.passablePlatforms, () => {
                            // this.player1.anims.play('idle');
                            if (this.player1.body.onFloor() === true) {
                                this.player1.jumpCount = 0;
                                this.player1.anims.play('idle');
                            }
                        },
                            (player, platform) => {
                                if (player.y + 20 > platform.y || this.player1.body.velocity.y < 0) {
                                    return false;
                                }
                                return true;
                            });

                        this.impassableCollision = this.physics.add.collider(this.player1, this.impassablePlatforms, (player, platform) => {
                            // console.log(`player x: ${player.x}`);
                            // console.log(`player y: ${player.y}`);
                            // console.log(`platform x: ${platform.x}`);
                            // console.log(`platform y: ${platform.y}`);

                            // console.log(platform.)
                            // ledge grab
                            // if (platform.body.x + platform.body.halfWidth < player.x)

                            if (this.player1.body.onFloor() === true) {
                                this.player1.jumpCount = 0;
                            }
                            // this.player1.anims.play('idle');
                            // console.log('collision');
                        });



                        // initialize keyboard listeners
                        this.cursors = this.input.keyboard.createCursorKeys();
                        this.cursors.space.isPressedWithoutRelease = false;

                        // initialize graphics object
                        // this.graphics = this.add.graphics({ fillStyle: { color: 0x000000 } });
                        // this.graphics.fillRectShape(this.player1.ledgeGrabBox);
                    },
                    update: function () {
                        if (this.counter === 0.00) {
                            // console.log(this.player1);
                            // console.log(this.load);
                            console.log(this.cameras.cameras[0]);
                        }

                        // text animation
                        this.counter += .07;
                        if (this.counter >= 6.28) {
                            this.counter = 0.10;
                        }
                        this.helloWorld.angle = 0 + (10 * Math.sin(this.counter));
                        if (this.counter === .1) {
                            // this.cameras.cameras[0].scrollX += 10;
                            // console.log(this.cameras.cameras[0].scrollX);
                            // let cameraOffset = (this.player1.x - this.cameras.cameras[0].centerX) / 5;
                            // console.log(cameraOffset);
                            // this.cameras.cameras[0].scrollX = cameraOffset;
                            // console.log(this.player1.x - this.cameras.cameras[0].centerX);
                            // console.log(this.player1.body.velocity);
                            // console.log(this.player1.ledgeGrabBox);
                        }

                        // input handling
                        if (this.cursors.left.isDown) {
                            if (this.player1.jumpCount === 0) {
                                this.player1.anims.play('left', true);
                            }
                            this.player1.setVelocityX(-player1Prop.movementSpeed);
                            this.player1.setFlipX(true);
                            console.log('left');
                        }
                        else if (this.cursors.right.isDown) {
                            if (this.player1.jumpCount === 0) {
                                this.player1.anims.play('right', true);
                            }
                            this.player1.setVelocityX(player1Prop.movementSpeed);
                            this.player1.setFlipX(false);
                        }
                        else {
                            // this.player1.anims.play('idle');
                            if (this.player1.body.onFloor()) {
                                this.player1.anims.play('idle');
                            }
                            this.player1.setVelocityX(0);
                        }
                        this.cursors.space.onDown = (e) => {
                            if (!this.cursors.space.isPressedWithoutRelease && this.player1.jumpCount < 2) {
                                if (this.player1.jumpCount === 0) {
                                    this.player1.setVelocityY(player1Prop.jumpHeights.first);
                                }
                                else if (this.player1.jumpCount === 1) {
                                    this.player1.setVelocityY(player1Prop.jumpHeights.second);
                                }
                                this.player1.jumpCount += 1;
                                this.cursors.space.isPressedWithoutRelease = true;
                                console.log('true jump');
                                this.player1.anims.play('jump');
                            }
                        }

                        this.cursors.space.onUp = (e) => {
                            this.cursors.space.isPressedWithoutRelease = false;
                        }

                        // this.player1.ledgeGrabBox.setPosition(this.player1.x + this.player1.halfWidth, this.player1.y + this.player1.halfHeight);
                        // this.graphics.strokeRectShape(this.player1.ledgeGrabBox);
                        // this.player1.ledgeGrabBox.anims.play('ledgeGrabIdle', true);

                        // boundaries
                        if (this.player1.y > 800 || this.player1.x < -250 || this.player1.x > 1450) {
                            this.player1.setVelocityY(0);
                            this.player1.y = 400;
                            this.player1.x = 600;
                        }

                        // camera positioning

                        let cameraOffsetX = (this.player1.x - this.cameras.cameras[0].centerX) / 5;
                        this.cameras.cameras[0].scrollX = cameraOffsetX;

                        let cameraOffsetY = (this.player1.y - this.cameras.cameras[0].centerY) / 5;
                        this.cameras.cameras[0].scrollY = cameraOffsetY;

                        // this.player1.ledgeGrabBox.setPosition(this.player1.x + this.player1.body.halfWidth * 1.75, this.player1.y);


                    }
                }
            }
        }
    }

    initializeGame = () => {
        this.setState({ initialize: true })
    }

    destroy = () => {
        this.setState({ unmounted: true })
    }

    render() {
        const { initialize, game } = this.state
        return (
            <div className="Game">
                {/* <button onClick={this.initializeGame}>start</button> */}
                {<IonPhaser game={game} initialize={initialize} />}
            </div>
        );
    }
}
