import React, { Component } from 'react';
import './Dashboard.css';
import Game from '../../components/game/Game.js';
import Sidebar from '../../components/sidebar/Sidebar.js';
import { troomp, dhonu, billnbob } from '../../characterObjects/characters.js';
import teststage from '../../stageConfigs/teststage.js';
import defaultControls from '../../controlConfigs/default.js';
import wasdControls from '../../controlConfigs/wasd.js';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  // check login
  componentDidMount() {
    let token = localStorage.getItem('__pixelsmash__token');
    let username = localStorage.getItem('__pixelsmash__username');

    if (!token || !username) {
      this.props.history.push('/login');
      window.alert('logged out');
    }

    console.log(this.context);
  }

  render() {
    return (
      <div className="Dashboard">
        <div className="header-placeholder">PixelSmash</div>
        <div className="main-row">
          <div className="left-side">
            <Game playerConfigs={[billnbob, dhonu]} stageConfig={teststage} controlConfigs={[wasdControls, defaultControls]} socketContext={this.context} />
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
