import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import './Game.css';

export default class Game extends React.Component {

    constructor(props) {
        super(props);

        // this is where I'm thinking we can take props and use them to build the Phaser scene upon starting a new game
        // of course this would mean having to remount this component on every new game, we should probably instead update 
        // the state of the phaser game and the currently loaded resources as the players switch between games.
        this.state = {
            unmounted: false,
            initialize: true,
            game: {
                width: 800,
                height: 600,
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
                    },
                    update: function () {
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
                {<IonPhaser game={game} initialize={initialize} />}
            </div>
        );
    }
}
