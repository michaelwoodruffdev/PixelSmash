import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import './Game.css';

export default class Game extends React.Component {

    constructor(props) {
        super(props);

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
                        this.load.spritesheet('player', 'assets/trumpsprite.png', { frameWidth: 100, frameHeight: 100 });
                        this.load.image('background', 'assets/background.png');
                        this.load.image('ground', 'assets/ground.png');
                    },
                    create: function () {

                        // background
                        this.background = this.add.image(600, 337.5, 'background');

                        // platforms
                        this.platforms = this.physics.add.staticGroup();
                        this.platforms.create(600, 550, 'ground').setScale(.75).refreshBody();
                        this.platforms.create(350, 400, 'ground').setScale(.2).refreshBody();
                        this.platforms.create(850, 400, 'ground').setScale(.2).refreshBody();

                        // player
                        this.player = this.physics.add.sprite(600, 400, 'player');
                        // this.player.setBounce(.2, .2);
                        // this.player.setCollideWorldBounds(true);
                        this.player.setMass(200);
                        this.player.jumpCount = 1;
                        this.player.isMidair = true;
                        this.player.setSize(70, 70);
                        this.anims.create({
                            key: 'left',
                            frames: this.anims.generateFrameNumbers('player', { start: 18, end: 23 }),
                            frameRate: 10,
                            repeat: -1
                        });
                        this.anims.create({
                            key: 'right',
                            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
                            frameRate: 10,
                            repeat: -1
                        });
                        this.anims.create({
                            key: 'idle',
                            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
                            frameRate: 3,
                            repeat: -1
                        });
                        this.anims.create({
                            key: 'jump',
                            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
                            frameRate: 15,
                            repeat: 1
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
                        this.groundCollision = this.physics.add.collider(this.player, this.platforms, () => {
                            // this.player.jumpCount = 0;
                            if (this.player.body.onFloor() === true) {
                                console.log('hello floor');
                                this.player.setVelocityY(0);
                                this.player.jumpCount = 0;
                            }
                            if (this.player.body.onCeiling() === true) {
                                // this.player.body.setCollideWor
                            }
                        }, 
                        (player, platform) => {
                            // if (this.player.body.velocity.y < 0) {
                            //     if (player.y > platform.y)
                            //     return false;
                            // }
                            if (player.y + 20 > platform.y) {
                                return false;
                            }
                            return true;
                        });

                        // this.groundCollision.overlapOnly = true;

                        // initialize keyboard listeners
                        this.cursors = this.input.keyboard.createCursorKeys();
                        this.cursors.space.isPressedWithoutRelease = false;
                    },
                    update: function () {
                        if (this.counter === 0.00) {
                            console.log(this.player);
                            console.log(this.load);
                        }

                        // text animation
                        this.counter += .07;
                        if (this.counter >= 6.28) {
                            this.counter = 0.1;
                        }
                        this.helloWorld.angle = 0 + (10 * Math.sin(this.counter));
                        if (this.counter === .1) {
                            // console.log(this.player.y);
                            console.log(this.player.body.velocity);
                        }

                        // input handling
                        if (this.cursors.left.isDown) {
                            this.player.anims.play('left', true);
                            this.player.setVelocityX(-250);
                        }
                        else if (this.cursors.right.isDown) {
                            this.player.anims.play('right', true);
                            this.player.setVelocityX(250);
                        }
                        else {
                            this.player.anims.play('idle', true);
                            this.player.setVelocityX(0);
                        }
                        // if (this.player.jumpCount < 2 && this.cursors.space.isUp)
                        if (this.cursors.space.isDown && (this.player.body.touching.down || !this.player.hasDoubleJumped)) {
                            if (!this.player.body.touching.down) {
                                this.player.hasDoubleJumped = true;
                            }
                            this.player.setVelocityY(-600);
                        }
                        if (this.player.y > 850 || this.player.x < -50 || this.player.x > 1250) {
                            this.player.setVelocityY(0);
                            this.player.y = 400;
                            this.player.x = 600;
                        }

                        if (this.player.body.onFloor() === true) {
                            this.player.setVelocityY(0);
                        }
                        this.cursors.space.onDown = (e) => {
                            if (!this.cursors.space.isPressedWithoutRelease && this.player.jumpCount < 2) {
                                this.player.jumpCount += 1;
                                this.player.setVelocityY(-400);
                                this.cursors.space.isPressedWithoutRelease = true;
                                console.log('true jump');
                            }
                        }
                        // if (this.cursors.spaceKeyDown) {
                        //     this.cursors.spaceKeyTimer += 1;
                        // }
                        this.cursors.space.onUp = (e) => {
                            this.cursors.space.isPressedWithoutRelease = false;
                        }

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
