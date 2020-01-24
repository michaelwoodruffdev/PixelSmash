import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import './Game.css';

export default class Game extends React.Component {

    state = {
        unmounted: false,
        initialize: true,
        game: {
            width: "50%",
            height: "1600px",
            type: Phaser.AUTO,
            scene: {
                init: function () {
                    this.cameras.main.setBackgroundColor('#24252A')
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
                    this.helloWorld.angle = 0 + ( 10 * Math.sin(this.counter) );
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
