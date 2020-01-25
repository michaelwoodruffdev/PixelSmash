import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import './Game.css';

export default class Game extends React.Component {

    constructor(props) {
        super(props);

        // this is where I'm thinking we can take props and use them to build the Phaser scene upon starting a new game
        this.state = {
            unmounted: false,
            initialize: false,
            game: {
                width: 800,
                height: 600,
                type: Phaser.CANVAS,
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
                        this.load.spritesheet('player', 'assets/spritesheet.png', { frameWidth: 104, frameHeight: 150 });
                    },
                    create: function () {
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
                        this.player = this.physics.add.sprite(100, 100, 'player');
                        this.player.setBounce(.2, .2);
                        this.player.setCollideWorldBounds(true);
                        this.physics.world.bounds = new Phaser.Geom.Rectangle(0, 0, 800, 600);

                        this.anims.create({
                            key: 'left',
                            frames: this.anims.generateFrameNumbers('p', { start: 6, end: 12 }),
                            frameRate: 10,
                            repeat: -1
                        });
                    },
                    update: function () {
                        if (this.counter === 0.00) {
                            console.log(this.player);
                            console.log(this.load);
                        }
                        this.counter += .07;
                        this.helloWorld.angle = 0 + (10 * Math.sin(this.counter));
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
