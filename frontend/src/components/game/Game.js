import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import './Game.css';
import Fighter from '../../gameClasses/Fighter.js';
import { Event } from 'react-socket-io';

const handleCamera = (scene) => {
    scene.cameras.cameras[0].scrollX = (((scene.fighters[0].sprite.x + scene.fighters[1].sprite.x) / 2) - scene.cameras.cameras[0].centerX) / 5;
    scene.cameras.cameras[0].scrollY = ((((scene.fighters[0].sprite.y + scene.fighters[1].sprite.y) / 2) - scene.cameras.cameras[0].centerY) / 5) - 100;
    scene.cameras.cameras[0].setZoom(1 - Math.abs(((scene.fighters[0].sprite.x - scene.fighters[1].sprite.x) / 3280)) - .1);
}

export default class Game extends React.Component {

    constructor(props) {
        super(props);

        let { playerConfigs, stageConfig, controlConfigs } = props;

        this.onConnected = this.onConnected.bind(this);

        this.state = {
            unmounted: false,
            initialize: false,
            game: null
        }
    }

    componentDidMount() {
        console.log(this.context);
        let { playerConfigs, stageConfig, controlConfigs } = this.props;
        let context = this.context;
        this.setState({
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
                        this.fighters = playerConfigs.map(pConf => new Fighter(pConf, this));
                    },
                    preload: function () {
                        // fighter assets
                        this.fighters.forEach(fighter => fighter.loadSpritesheet());

                        // load stage assets
                        this.load.image('background', stageConfig.assets.background);
                        this.load.image('ground', stageConfig.assets.ground);
                    },
                    create: function () {
                        // timers
                        this.gameTimer = 0;
                        this.framesPassed = 0;

                        // background
                        this.background = this.add.image(600, 337.5, 'background').setScale(2);

                        // platforms
                        this.passablePlatforms = this.physics.add.staticGroup();
                        stageConfig.passablePlatforms.forEach(platform => {
                            this.passablePlatforms.create(platform.x, platform.y, 'ground').setScale(platform.scale).refreshBody();
                        });
                        this.impassablePlatforms = this.physics.add.staticGroup();
                        stageConfig.impassablePlatforms.forEach(platform => {
                            this.impassablePlatforms.create(platform.x, platform.y, 'ground').setScale(platform.scale).refreshBody();
                        });

                        // fighters initialization
                        for (let i = 0; i < this.fighters.length; i++) {
                            this.fighters[i].addSprite(stageConfig.spawnLocations[i].x, stageConfig.spawnLocations[i].y);
                            this.fighters[i].loadAnimations();
                            this.fighters[i].addPlatformCollisions(this.passablePlatforms, this.impassablePlatforms);
                            this.fighters[i].addControls(controlConfigs[i]);
                        }

                        // input keys
                        this.physics.world.setFPS(30);

                        this.cameras.cameras[0].fadeIn(1000);
                    },
                    update: function () {
                        //timers
                        this.gameTimer += 1 / 30;
                        this.framesPassed += 1;

                        // handle fighters input and current animation state
                        this.fighters.forEach(fighter => {
                            fighter.handleWalk(context);
                            fighter.checkMovementState();
                            fighter.checkDeath();
                        });

                        handleCamera(this);
                    }
                }
            }
        })
    }

    onConnected() {
        console.log('heard socket');
    }

    initializeGame = () => {
        this.setState({ initialize: true })
    }

    uninitializeGame = () => {
        this.setState({ unmounted: true })
        this.setState({ initialize: false })
    }

    render() {
        const { initialize, game } = this.state
        return (
            <div className="Game">
                <button onClick={this.initializeGame}>start</button>
                {/* <button onClick={this.uninitializeGame}>stop</button> */}

                {<IonPhaser game={game} initialize={initialize} />}
                <Event event="connected" handler={this.onConnected} />
            </div>
        );
    }
}
