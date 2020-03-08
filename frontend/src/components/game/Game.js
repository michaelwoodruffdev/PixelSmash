import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import './Game.css';
import Fighter from '../../gameClasses/Fighter.js';

export default class Game extends React.Component {

    constructor(props) {
        super(props);

        let { player1Prop } = props;

        this.state = {
            unmounted: false,
            initialize: false,
            game: {
                width: 1200,
                height: 675,
                fps: {
                    target: 30, 
                    forceSetTimeOut: true
                }, 
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
                        this.cameras.main.setBackgroundColor('#24252A');

                        // fighters initialization
                        this.fighter1 = new Fighter(player1Prop, this);
                    },
                    preload: function () {
                        this.fighter1.loadSpritesheet();
                        // this.load.spritesheet('player1', player1Prop.spritesheetPath, { frameWidth: player1Prop.frameDimensions.x, frameHeight: player1Prop.frameDimensions.y });
                        this.load.image('background', 'assets/background.png');
                        this.load.image('ground', 'assets/ground.png');
                    },
                    create: function () {
                        // timers
                        this.gameTimer = 0;
                        this.framesPassed = 0;
                        
                        // background
                        this.background = this.add.image(600, 337.5, 'background');
                        
                        // platforms
                        this.passablePlatforms = this.physics.add.staticGroup();
                        this.passablePlatforms.create(250, 400, 'ground').setScale(.2).refreshBody();
                        this.passablePlatforms.create(950, 400, 'ground').setScale(.2).refreshBody();

                        this.impassablePlatforms = this.physics.add.staticGroup();
                        this.impassablePlatforms.create(600, 550, 'ground').setScale(1.1).refreshBody();

                        // fighter spritesheet
                        this.player1 = this.fighter1.addSprite(600, 400);
                        this.fighter1.loadAnimations();

                        // physics collisions
                        this.fighter1.addPlatformCollisions(this.passablePlatforms, this.impassablePlatforms);
                        this.physics.world.setFPS(60);

                        // keyboard listeners
                        this.fighter1.createCursorEvents(this.cursors);
                    },
                    update: function () {

                        //timers
                        this.gameTimer += 1/60;
                        this.framesPassed += 1;

                        // input handling
                        this.fighter1.handleInput();
                        this.fighter1.checkAnimation();

                        // boundaries
                        this.fighter1.checkDeath();

                        // camera positioning
                        let cameraOffsetX = (this.player1.x - this.cameras.cameras[0].centerX) / 5;
                        this.cameras.cameras[0].scrollX = cameraOffsetX;

                        let cameraOffsetY = (this.player1.y - this.cameras.cameras[0].centerY) / 5;
                        this.cameras.cameras[0].scrollY = cameraOffsetY;

                    }
                }
            }
        }
    }

    initializeGame = () => {
        this.setState({ initialize: true })
    }

    uninitializeGame = () => {
        this.setState({ unmounted: true })
    }

    render() {
        const { initialize, game } = this.state
        return (
            <div className="Game">
                <button onClick={this.initializeGame}>start</button>
                <button onClick={this.uninitializeGame}>stop</button>

                {<IonPhaser game={game} initialize={initialize}/>}
            </div>
        );
    }
}
