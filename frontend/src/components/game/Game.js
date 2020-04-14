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
        this.onLeftHeard = this.onLeftHeard.bind(this);
        this.onRightHeard = this.onRightHeard.bind(this);
        this.onLeftRightRelease = this.onLeftRightRelease.bind(this);
        this.onUpHeard = this.onUpHeard.bind(this);
        this.onConnectHeard = this.onConnectHeard.bind(this);

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
            fighters: playerConfigs.map(pConf => new Fighter(pConf))
        });
        // this.state.fighters.forEach(fighter => fighter.loadSpritesheet());
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
                    extend: {
                        component: this
                    },
                    init: function () {
                        this.cameras.main.setBackgroundColor('#24252A');

                        // fighters initialization
                        console.log('trying to put fighters into state');
                        console.log(this.component);

                        // this.fighters = playerConfigs.map(pConf => new Fighter(pConf, this));
                        this.component.state.fighters.forEach(f => f.setScene(this));
                    },
                    preload: function () {
                        // fighter assets

                        // this.fighters.forEach(fighter => fighter.loadSpritesheet());
                        this.component.state.fighters.forEach(f => f.loadSpritesheet());

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
                        // for (let i = 0; i < this.fighters.length; i++) {
                        //     this.fighters[i].addSprite(stageConfig.spawnLocations[i].x, stageConfig.spawnLocations[i].y);
                        //     this.fighters[i].loadAnimations();
                        //     this.fighters[i].addPlatformCollisions(this.passablePlatforms, this.impassablePlatforms);
                        //     this.fighters[i].addControls(controlConfigs[i]);
                        // }

                        for (let i = 0; i < this.component.state.fighters.length; i++) {
                            this.component.state.fighters[i].addSprite(stageConfig.spawnLocations[i].x, stageConfig.spawnLocations[i].y);
                            this.component.state.fighters[i].loadAnimations();
                            this.component.state.fighters[i].addPlatformCollisions(this.passablePlatforms, this.impassablePlatforms);
                            this.component.state.fighters[i].addControls(controlConfigs[i]);
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
                        this.component.state.fighters.forEach(fighter => {
                            fighter.handleInput(context, this.component.state.lobbyNo);
                            fighter.handleWalk(context);
                            fighter.checkMovementState();
                            fighter.checkDeath();
                        });

                        // handleCamera(this);
                        let fighters = this.component.state.fighters;
                        this.cameras.cameras[0].scrollX = (((fighters[0].sprite.x + fighters[1].sprite.x) / 2) - this.cameras.cameras[0].centerX) / 5;
                        this.cameras.cameras[0].scrollY = ((((fighters[0].sprite.y + fighters[1].sprite.y) / 2) - this.cameras.cameras[0].centerY) / 5) - 100;
                        this.cameras.cameras[0].setZoom(1 - Math.abs(((fighters[0].sprite.x - fighters[1].sprite.x) / 3280)) - .1);
                    }
                }
            }
        })
    }

    onConnected() {
        console.log('heard socket');
    }

    onLeftHeard(fighterKey) {
        console.log(`heard ${fighterKey} press left`);
        let fighterToMove = this.state.fighters.find(f => f.config.fighterKey === fighterKey);
        console.log(fighterToMove);
        fighterToMove.moveLeft();
        // console.log(this.state.fighters.find(f => f.config.fighterKey === fighterKey).moveLeft());
    }

    onRightHeard(fighterKey) {
        console.log(`heard ${fighterKey} press right`);
        let fighterToMove = this.state.fighters.find(f => f.config.fighterKey === fighterKey);
        fighterToMove.moveRight();
    }

    onLeftRightRelease(fighterKey) {
        if (this.state == null) {
            return;
        }
        let fighterToStop = this.state.fighters.find(f => f.config.fighterKey === fighterKey);
        fighterToStop.leftRightRelease();
    }

    onUpHeard(fighterKey) {
        console.log('hello there?');
        if (this.state == null) {
            return;
        }
        let fighterToJump = this.state.fighters.find(f => f.config.fighterKey === fighterKey);
        fighterToJump.tryToJump();
    }

    onConnectHeard(lobbyNo) {
        this.setState({ lobbyNo: lobbyNo });
    }

    initializeGame = () => {
        this.setState({ initialize: true });
    }

    uninitializeGame = () => {
        this.setState({ unmounted: true });
        this.setState({ initialize: false });
    }

    render() {
        const { initialize, game } = this.state
        return (
            <div className="Game">
                <button onClick={this.initializeGame}>start</button>
                {/* <button onClick={this.uninitializeGame}>stop</button> */}

                {<IonPhaser game={game} initialize={initialize} />}
                <Event event="leftHeard" handler={this.onLeftHeard} />
                <Event event="rightHeard" handler={this.onRightHeard} />
                <Event event="leftRightRelease" handler={this.onLeftRightRelease} />
                <Event event="upHeard" handler={this.onUpHeard} />
                <Event event="connectHeard" handler={this.onConnectHeard} />
            </div>
        );
    }
}
