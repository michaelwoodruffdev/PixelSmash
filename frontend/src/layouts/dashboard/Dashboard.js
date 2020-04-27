import React, { Component } from 'react';
import './Dashboard.css';
import Game from '../../components/game/Game.js';
import Sidebar from '../../components/sidebar/Sidebar.js';
import Lobby from '../../components/lobby/Lobby.js';
import { troomp, dhonu, billnbob } from '../../characterObjects/characters.js';
import teststage from '../../stageConfigs/himalopolis.js';
import defaultControls from '../../controlConfigs/default.js';
import wasdControls from '../../controlConfigs/wasd.js';
import { Event } from 'react-socket-io';
import Infobar from '../toolbar/Toolbar';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHost: true,
      host: localStorage.getItem("__pixelsmash__username"),
      guest: 'empty slot',
      lobbyNo: null,
      gameStart: false,
      token: '', 
      gameLobby: null, 
      characterMap: {}, 
      selectedCharacters: []
    }

    this.onGetUserInfo = this.onGetUserInfo.bind(this);
    this.onInvitationHeard = this.onInvitationHeard.bind(this);
    this.onInviteFriendHeard = this.onInviteFriendHeard.bind(this);
    this.onStartGameHeard = this.onStartGameHeard.bind(this);
    this.onGuestJoined = this.onGuestJoined.bind(this);
    this.onJoinHost = this.onJoinHost.bind(this);
    this.onGameReadyToStart = this.onGameReadyToStart.bind(this);
  }

  // check login
  componentDidMount() {
    let token = localStorage.getItem('__pixelsmash__token');
    let username = localStorage.getItem('__pixelsmash__username');

    if (!token || !username) {
      this.props.history.push('/login');
      window.alert('logged out');
    } else {
      this.setState({
        token
      });
    }

    let characterMap = this.state.characterMap;
    characterMap['dhonu'] = dhonu;
    characterMap['billnbob'] = billnbob;
    this.setState({
      characterMap: characterMap
    });
  }

  // sets up socket on backend
  onGetUserInfo() {
    this.context.emit("getUserInfoHeard", localStorage.getItem("__pixelsmash__username"));
  }

  // listens for successful or failed invite
  onInviteFriendHeard(success) {
    if (success) {
      window.alert("invite sent");
    } else {
      window.alert("invite failed (other user offline)");
    }
  }

  // on reception of invite
  onInvitationHeard(sender) {
    let answer = window.confirm(`${sender} invited you to a game`);
    if (answer) {
      this.context.emit("acceptInvite", sender);
    }
  }

  // reacts to join event
  onGuestJoined(guest, lobbyNo) {
    this.setState({
      guest: guest,
      isHost: true, 
      lobbyNo
    });
  }

  // reacts to join event
  onJoinHost(host, lobbyNo) {
    this.setState({
      guest: localStorage.getItem("__pixelsmash__username"),
      isHost: false,
      host: host, 
      lobbyNo
    });
  }

  onStartGameHeard(lobbyNo) {
    this.setState({
      gameStart: true
    })
  }

  onGameReadyToStart(playerKey, hostFighter, guestFighter, hostFighterKey, guestFighterKey) {
    this.setState({
      playerKey: playerKey, 
      hostFighterKey: hostFighterKey, 
      guestFighter, guestFighterKey
    });
    let selectedCharacters = this.state.selectedCharacters;
    selectedCharacters[0] = this.state.characterMap[`${hostFighter}`];
    selectedCharacters[1] = this.state.characterMap[`${guestFighter}`];
    this.setState({
      selectedCharacters: selectedCharacters
    });

    console.log('about to set gamestart to true');

    this.setState({
      gameStart: true
    });
  }

  render() {
    var { gameStart, username, token, lobbyNo, host, guest, isHost, playerKey, selectedCharacters, hostFighterKey, guestFighterKey } = this.state;

    return (
      <div className="Dashboard">
        <Infobar></Infobar>
        <br></br><br></br>
        {/*<div className="header-placeholder">PixelSmash</div>*/}
        {/* <img src='https://www.freelogodesign.org/file/app/client/thumb/bf970f3b-3d14-44fc-b851-5b99674b0139_200x200.png?1581994698035' width="150" height="100" alt='Logo' /> */}
        <div className="main-row">
          <div className="left-side">
            {!gameStart &&
              <Lobby loggedInUser={username} loggedInToken={token} socketContext={this.context} host={host} guest={guest} isHost={isHost}/>
            }
            {gameStart &&
              <Game playerConfigs={selectedCharacters} stageConfig={teststage} controlConfigs={[wasdControls]} socketContext={this.context} lobbyNo={lobbyNo} playerKey={playerKey} hostFighterKey={hostFighterKey} guestFighterKey={guestFighterKey} host={host} guest={guest}/>
            }
          </div>
          <div className="right-side">
            <Sidebar socketContext={this.context} />
          </div>
        </div>
        <Event event="getUserInfo" handler={this.onGetUserInfo} />
        <Event event="inviteFriendHeard" handler={this.onInviteFriendHeard} />
        <Event event="invitationHeard" handler={this.onInvitationHeard} />
        <Event event="startGameHeard" handler={this.onStartGameHeard} />
        <Event event="joinHost" handler={this.onJoinHost} />
        <Event event="guestJoined" handler={this.onGuestJoined} />
        <Event event="gameReadyToStart" handler={this.onGameReadyToStart} />
      </div>
    );
  }
}

export default Dashboard;
