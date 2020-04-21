import React, { Component } from 'react';
import './Dashboard.css';
import Game from '../../components/game/Game.js';
import Sidebar from '../../components/sidebar/Sidebar.js';
import Lobby from '../../components/lobby/Lobby.js';
import { troomp, dhonu, billnbob } from '../../characterObjects/characters.js';
import teststage from '../../stageConfigs/teststage.js';
import defaultControls from '../../controlConfigs/default.js';
import wasdControls from '../../controlConfigs/wasd.js';
import { Event } from 'react-socket-io';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameStart: false,
      username: '',
      token: '', 
      isHost: true, 
      guest: '', 
      lobbyNo: null
    }

    this.onGetUserInfo = this.onGetUserInfo.bind(this);
    this.onInvitationHeard = this.onInvitationHeard.bind(this);
    this.onInviteFriendHeard = this.onInviteFriendHeard.bind(this);
    this.onStartGameHeard = this.onStartGameHeard.bind(this);
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
        username,
        token
      });
    }
  }

  onGetUserInfo() {
    this.context.emit("getUserInfoHeard", this.state.username);
  }

  onInviteFriendHeard(success) {
    if (success) {
      window.alert("invite sent");
    } else {
      window.alert("invite failed (other user offline)");
    }
  }

  onInvitationHeard(sender) {
    let answer = window.confirm(`${sender} invited you to a game`);
    if (answer) {
      this.context.emit("acceptInvite", sender);
    }
  }

  onStartGameHeard(lobbyNo) {
    this.setState({
      lobbyNo: lobbyNo
    });
    this.setState({
      gameStart: true
    })
  }

  render() {
    var { gameStart, username, token, lobbyNo } = this.state;

    return (
      <div className="Dashboard">
        <div className="header-placeholder">PixelSmash</div>
        <div className="main-row">
          <div className="left-side">
            {!gameStart &&
              <Lobby loggedInUser={username} loggedInToken={token} socketContext={this.context}/>
            }
            {gameStart &&
              <Game playerConfigs={[billnbob, dhonu]} stageConfig={teststage} controlConfigs={[wasdControls, defaultControls]} socketContext={this.context} lobbyNo={lobbyNo}/>
            }
          </div>
          <div className="right-side">
            <Sidebar socketContext={this.context}/>
          </div>
        </div>
        <Event event="getUserInfo" handler={this.onGetUserInfo} />
        <Event event="inviteFriendHeard" handler={this.onInviteFriendHeard} />
        <Event event="invitationHeard" handler={this.onInvitationHeard} />
        <Event event="startGameHeard" handler={this.onStartGameHeard} />
      </div>
    );
  }
}

export default Dashboard;
