import React from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import './Game.css';
import Fighter from '../../gameClasses/Fighter.js';
import { Event } from 'react-socket-io';

export default class Game extends React.Component {

    constructor(props) {
        // manage props
        super(props);
        let { playerConfigs, stageConfig, controlConfigs, lobbyNo } = props;

        // bind 'this' keyword to functions
        this.onConnected = this.onConnected.bind(this);
        this.onLeftHeard = this.onLeftHeard.bind(this);
        this.onRightHeard = this.onRightHeard.bind(this);
        this.onLeftRightRelease = this.onLeftRightRelease.bind(this);
        this.onUpHeard = this.onUpHeard.bind(this);
        this.onConnectHeard = this.onConnectHeard.bind(this);
        this.onHostConnectHeard = this.onHostConnectHeard.bind(this);
        this.onGameStart = this.onGameStart.bind(this);
        this.onPlayerDisconnect = this.onPlayerDisconnect.bind(this);
        this.onSyncFighters = this.onSyncFighters.bind(this);
        this.onSyncFighterHeard = this.onSyncFighterHeard.bind(this);
        this.onLatencyPong = this.onLatencyPong.bind(this);

        // root state initialization
        this.state = {
            unmounted: false,
            initialize: false,
            game: null,
            playerKey: 'billnbobsampleusername', 
            lobbyNo: lobbyNo
        }
    }

    componentDidMount() {
        console.log('game mounted');

        // initialization
        let { playerConfigs, stageConfig, controlConfigs, hostFighterKey, guestFighterKey, host, guest } = this.props;
        let context = this.props.socketContext;     // socket.io connection

        // store fighters in state
        let fightersToStoreInState = {};
        fightersToStoreInState[`${hostFighterKey}`] = new Fighter(playerConfigs[0], host);
        fightersToStoreInState[`${guestFighterKey}`] = new Fighter(playerConfigs[1], guest);
        this.setState({
            fighterMap: fightersToStoreInState,
            isHost: false,
            latency: 0,
            latencyPingTimer: 0
        });

        // latency timer
        this.setState({
            latencyTimerId: setInterval(() => {
                this.setState({ latencyPingTimer: Date.now() });
                context.emit('latencyPing');
            }, 2000)
        });

        // main phaser game setup
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
                    extend: {   // this allows us to access components state within scene object
                        component: this
                    },
                    init: function () {
                        // add scene reference to fighter classes
                        Object.keys(this.component.state.fighterMap).forEach((key) => {
                            this.component.state.fighterMap[key].setScene(this);
                        });
                    },
                    preload: function () {
                        // fighter assets
                        Object.keys(this.component.state.fighterMap).forEach((key) => {
                            this.component.state.fighterMap[key].loadSpritesheet();
                        });

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

                        // this will actually instantiate fighters in the scene and make them interactable
                        let i = 0;
                        let fighterMapp = this.component.state.fighterMap;
                        // console.log(this.component.state.playerKey);
                        Object.keys(fighterMapp).forEach((key) => {
                            fighterMapp[key].addSprite(stageConfig.spawnLocations[i].x, stageConfig.spawnLocations[i].y);
                            fighterMapp[key].loadAnimations();
                            fighterMapp[key].addPlatformCollisions(this.passablePlatforms, this.impassablePlatforms, context, this.component.props.playerKey, this.component.props.lobbyNo);
                            i++;
                        });
                        console.log('adding controls to ' + this.component.props.playerKey);
                        fighterMapp[this.component.props.playerKey].addControls(controlConfigs[0]);

                        this.physics.world.setFPS(30);
                        this.cameras.cameras[0].fadeIn(1000);
                    },
                    update: function () {
                        //timers
                        this.gameTimer += 1 / 30;
                        this.framesPassed += 1;

                        var fighterMap = this.component.state.fighterMap;

                        if (this.framesPassed === 30) {
                            this.framesPassed = 0;
                            if (this.component.state.fighterMap[this.component.props.playerKey].sprite.body.onFloor()) {
                                context.emit('syncFighter',
                                    {
                                        fighterKey: this.component.props.playerKey,
                                        x: fighterMap[this.component.props.playerKey].sprite.x,
                                        y: fighterMap[this.component.props.playerKey].sprite.y
                                    },
                                    this.component.props.lobbyNo
                                );
                            }
                        }

                        // handle fighters input and current animation state
                        fighterMap[this.component.props.playerKey].handleInput(context, this.component.props.lobbyNo);
                        Object.keys(fighterMap).forEach(key => {
                            fighterMap[key].handleWalk(context);
                            fighterMap[key].checkMovementState();
                            fighterMap[key].checkDeath();
                        });


                        this.component.handleCamera(this.cameras.cameras[0]);
                    }
                }
            }
        });
        this.setState({
            initialize: true
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.latencyTimerId);
    }

    handleCamera(camera) {
        let centerBetweenFighters = { x: 0, y: 0 };
        let extremes = {
            minX: 10000,
            maxX: -10000,
            minY: 10000,
            maxY: -10000
        };
        Object.keys(this.state.fighterMap).forEach(key => {
            let currentFighterSprite = this.state.fighterMap[key].sprite;
            centerBetweenFighters.x += currentFighterSprite.x;
            centerBetweenFighters.y += currentFighterSprite.y;
            if (currentFighterSprite.x < extremes.minX) {
                extremes.minX = currentFighterSprite.x;
            }
            if (currentFighterSprite.x > extremes.maxX) {
                extremes.maxX = currentFighterSprite.x;
            }
            if (currentFighterSprite.y < extremes.minY) {
                extremes.minY = currentFighterSprite.y;
            }
            if (currentFighterSprite.y > extremes.maxY) {
                extremes.maxY = currentFighterSprite.y;
            }
        });
        let rangeOfPositions = { x: extremes.maxX - extremes.minX, y: extremes.maxY - extremes.minY };
        centerBetweenFighters.x /= Object.keys(this.state.fighterMap).length;
        centerBetweenFighters.y /= Object.keys(this.state.fighterMap).length;
        let center = { x: camera.centerX, y: camera.centerY };
        let differenceOfCenters = { x: centerBetweenFighters.x - center.x, y: centerBetweenFighters.y - center.y };
        let cameraSpeed = 20;
        let desiredX = differenceOfCenters.x / 2;
        camera.scrollX += (desiredX - camera.scrollX) / cameraSpeed;
        let desiredY = differenceOfCenters.y / 3;
        camera.scrollY += (desiredY - camera.scrollY) / cameraSpeed;
        let desiredZoom = 1 - Math.abs(rangeOfPositions.x / 4280);
        camera.setZoom((camera.zoom + (desiredZoom - camera.zoom) / cameraSpeed));
    }

    onConnected() {
        // console.log('heard socket');
    }

    onLeftHeard(fighterKey) {
        console.log(fighterKey);
        this.state.fighterMap[fighterKey].moveLeft();
    }

    onRightHeard(fighterKey) {
        this.state.fighterMap[fighterKey].moveRight();
    }

    onLeftRightRelease(fighterKey) {
        if (this.state == null) {
            return;
        }
        this.state.fighterMap[fighterKey].leftRightRelease();
    }

    onUpHeard(fighterKey) {
        if (this.state == null) {
            return;
        }
        this.state.fighterMap[fighterKey].tryToJump();
    }

    onConnectHeard(lobbyNo) {
        this.setState({ lobbyNo: lobbyNo });
    }

    onHostConnectHeard() {
        this.setState({
            isHost: true,
            playerKey: 'dhonusampleusername'
        });
    }

    onGameStart() {
        this.setState({ initialize: true });
    }

    onPlayerDisconnect() {
        this.props.context.emit('manualDisconnect');
    }

    onSyncFighters(updateObj) {
        this.state.fighters[0].sprite.setX(updateObj.player1.x);
        this.state.fighters[0].sprite.setY(updateObj.player1.y);
        this.state.fighters[1].sprite.setX(updateObj.player2.x);
        this.state.fighters[1].sprite.setY(updateObj.player2.y);
    }

    onSyncFighterHeard(position, fighterKey) {
        console.log(fighterKey);
        console.log(this.state.fighterMap);
        if (Math.abs(this.state.fighterMap[fighterKey].sprite.x - position.x) > 50 || Math.abs(this.state.fighterMap[fighterKey].sprite.y - position.y) > 50) {
            console.log('should resync');
            this.state.fighterMap[fighterKey].sprite.setX(position.x);
            this.state.fighterMap[fighterKey].sprite.setY(position.y);
        }
    }

    onLatencyPong() {
        this.setState({ latency: Date.now() - this.state.latencyPingTimer });
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
                {!initialize && 
                    <p>Waiting for socket connection</p>
                }

                {<IonPhaser game={game} initialize={initialize} />}
                <Event event="leftHeard" handler={this.onLeftHeard} />
                <Event event="rightHeard" handler={this.onRightHeard} />
                <Event event="leftRightRelease" handler={this.onLeftRightRelease} />
                <Event event="upHeard" handler={this.onUpHeard} />
                <Event event="connectHeard" handler={this.onConnectHeard} />
                <Event event="hostConnectHeard" handler={this.onHostConnectHeard} />
                <Event event="gameStart" handler={this.onGameStart} />
                <Event event="playerDisconnect" handler={this.onPlayerDisconnect} />
                <Event event="syncFighters" handler={this.onSyncFighters} />
                <Event event="syncFighterHeard" handler={this.onSyncFighterHeard} />
                <Event event="latencyPong" handler={this.onLatencyPong} />
            </div>
        );
    }
}
