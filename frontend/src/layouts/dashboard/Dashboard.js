import React, { Component } from 'react';
import './Dashboard.css';
import Game from '../../components/game/Game.js';
import Sidebar from '../../components/sidebar/Sidebar.js';
import Lobby from '../../components/lobby/Lobby.js';
import { troomp, dhonu, billnbob } from '../../characterObjects/characters.js';
import teststage from '../../stageConfigs/teststage.js';
import defaultControls from '../../controlConfigs/default.js';
import wasdControls from '../../controlConfigs/wasd.js';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameStart: false,
      username: '',
      token: '', 
      isHost: true
    }
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

    console.log(this.context);

    let requestObj = {
      username, 
      token
    }

    // get friends
    fetch("http://ec2-18-222-189-77.us-east-2.compute.amazonaws.com:5000/get_friends", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(requestObj)
    })
    .then(res => {
      if (res.status === 401) {
        window.alert("logged out");
        this.props.history.push('/login');
        return null;
      } else if (res.status === 500) {
        window.alert("server error");
        return null;
      } else {
        return res.json();
      }
    })
    .then(res => {
      if (res === null) {
        return;
      } else {
        console.log(res);
      }
    });
  }

  render() {
    var { gameStart, username, token } = this.state;

    return (
      <div className="Dashboard">
        <div className="header-placeholder">PixelSmash</div>
        <div className="main-row">
          <div className="left-side">
            {!gameStart &&
              <Lobby loggedInUser={username} loggedInToken={token} />
            }
            {gameStart &&
              <Game playerConfigs={[billnbob, dhonu]} stageConfig={teststage} controlConfigs={[wasdControls, defaultControls]} socketContext={this.context} />
            }
          </div>
          <div className="right-side">
            <Sidebar />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
