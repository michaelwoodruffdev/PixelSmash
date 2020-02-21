import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import './Game.css';

export default class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            unmounted: false,
            initialize: false,
            game: {
                width: 1200,
                height: 675,
                type: Phaser.AUTO,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 300 },
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
                        this.platforms.create(600, 550, 'ground');

                        // player
                        this.player = this.physics.add.sprite(300, 400, 'player');
                        this.player.setBounce(.2, .2);
                        this.player.setCollideWorldBounds(true);
                        this.physics.world.bounds = new Phaser.Geom.Rectangle(0, 0, 800, 600);
                        this.player.height = 10;
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
                        this.physics.add.collider(this.player, this.platforms);

                        // initialize keyboard listeners
                        this.cursors = this.input.keyboard.createCursorKeys();
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
                            console.log(this.player.y);
                        }

                        // input handling
                        if (this.cursors.left.isDown) {
                            this.player.anims.play('left', true);
                            this.player.setVelocityX(-100);
                        }
                        else if (this.cursors.right.isDown) {
                            this.player.anims.play('right', true);
                            this.player.setVelocityX(100);
                        }
                        else {
                            this.player.anims.play('idle', true);
                            this.player.setVelocityX(0);
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
                <button onClick={this.initializeGame}>start</button>
                {<IonPhaser game={game} initialize={initialize} />}
            </div>
        );
    }
}
